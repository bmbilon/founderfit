/**
 * FounderFit Score v2.1: Question Validation
 *
 * Dev-only validation to catch question bank issues before they ship.
 * Runs at startup in development mode and logs warnings for any issues.
 */

import type { Question, ExecutionForce, QuestionType } from '@/types';

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Binary question text patterns
 * These patterns indicate the question should be binary type
 */
const BINARY_PATTERNS = [
  /^Do you\b/i,
  /^Have you\b/i,
  /^Would you\b/i,
  /^Can you\b/i,
  /^Are you\b/i,
  /^Did you\b/i,
  /^Will you\b/i,
  /^Is it true that\b/i,
];

/**
 * Likert question text patterns (statement-based)
 * These patterns indicate the question should be likert type
 */
const LIKERT_PATTERNS = [
  /^I\b/i, // "I revise my thesis..." "I make decisions..."
  /^My\b/i, // "My team..." "My approach..."
  /^When\b/i, // "When facing..." (followed by statement about behavior)
  /^People\b/i, // "People on my team..."
];

/**
 * Valid execution forces
 */
const VALID_FORCES: ExecutionForce[] = [
  'thesis_integrity',
  'learning_velocity',
  'decision_quality_under_load',
  'talent_gravity',
  'delivery_control',
  'resilience_economics',
];

/**
 * Valid question types
 */
const VALID_TYPES: QuestionType[] = ['binary', 'likert', 'multiple-choice'];

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationWarning {
  questionId: string;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  warnings: ValidationWarning[];
  errorCount: number;
  warningCount: number;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if question ID is unique
 */
function validateUniqueIds(questions: Question[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const ids = new Set<string>();

  questions.forEach((q) => {
    if (ids.has(q.id)) {
      warnings.push({
        questionId: q.id,
        severity: 'error',
        message: `Duplicate question ID: ${q.id}`,
        suggestion: 'Each question must have a unique ID',
      });
    }
    ids.add(q.id);
  });

  return warnings;
}

/**
 * Check if force is valid
 */
function validateForce(question: Question): ValidationWarning | null {
  if (!VALID_FORCES.includes(question.force)) {
    return {
      questionId: question.id,
      severity: 'error',
      message: `Invalid force: ${question.force}`,
      suggestion: `Must be one of: ${VALID_FORCES.join(', ')}`,
    };
  }
  return null;
}

/**
 * Check if type is valid
 */
function validateType(question: Question): ValidationWarning | null {
  if (!VALID_TYPES.includes(question.type)) {
    return {
      questionId: question.id,
      severity: 'error',
      message: `Invalid type: ${question.type}`,
      suggestion: `Must be one of: ${VALID_TYPES.join(', ')}`,
    };
  }
  return null;
}

/**
 * Check if question text matches type expectations
 */
function validateTextMatchesType(question: Question): ValidationWarning | null {
  const text = question.text;
  const type = question.type;

  // Check if text looks binary but is marked as likert
  if (type === 'likert') {
    const looksBinary = BINARY_PATTERNS.some((pattern) => pattern.test(text));
    if (looksBinary) {
      return {
        questionId: question.id,
        severity: 'warning',
        message: `Question text looks binary (starts with "Do you", "Have you", etc.) but type is likert`,
        suggestion: `Consider changing type to 'binary' or rephrasing as a statement (e.g., "I...")`,
      };
    }
  }

  // Check if text looks likert but is marked as binary
  if (type === 'binary') {
    const looksLikert = LIKERT_PATTERNS.some((pattern) => pattern.test(text));
    if (looksLikert) {
      return {
        questionId: question.id,
        severity: 'warning',
        message: `Question text looks like a statement (starts with "I", "My", etc.) but type is binary`,
        suggestion: `Consider changing type to 'likert' or rephrasing as a yes/no question`,
      };
    }
  }

  return null;
}

/**
 * Validate options for question type
 */
function validateOptions(question: Question): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!question.options || question.options.length === 0) {
    warnings.push({
      questionId: question.id,
      severity: 'error',
      message: 'Question has no options',
      suggestion: 'Add options array with proper values',
    });
    return warnings;
  }

  if (question.type === 'binary') {
    // Binary questions should have 2 options with values 0 and 1
    if (question.options.length !== 2) {
      warnings.push({
        questionId: question.id,
        severity: 'warning',
        message: `Binary question has ${question.options.length} options (expected 2)`,
        suggestion: 'Binary questions should have exactly 2 options',
      });
    }

    const values = question.options.map((opt) => opt.value).sort();
    if (values[0] !== 0 || values[1] !== 1) {
      warnings.push({
        questionId: question.id,
        severity: 'error',
        message: `Binary question options must have values 0 and 1, got: ${values.join(', ')}`,
        suggestion: 'Use values 0 and 1 for binary questions',
      });
    }
  }

  if (question.type === 'likert') {
    // Likert questions should have 5 options with values 1-5
    if (question.options.length !== 5) {
      warnings.push({
        questionId: question.id,
        severity: 'warning',
        message: `Likert question has ${question.options.length} options (expected 5)`,
        suggestion: 'Likert questions should have exactly 5 options',
      });
    }

    const values = question.options.map((opt) => opt.value).sort((a, b) => a - b);
    const expectedValues = [1, 2, 3, 4, 5];
    if (JSON.stringify(values) !== JSON.stringify(expectedValues)) {
      warnings.push({
        questionId: question.id,
        severity: 'error',
        message: `Likert question options must have values 1-5, got: ${values.join(', ')}`,
        suggestion: 'Use values 1, 2, 3, 4, 5 for Likert questions',
      });
    }
  }

  return warnings;
}

/**
 * Check if question text is answerable (not too vague/abstract)
 */
function validateAnswerability(question: Question): ValidationWarning | null {
  const text = question.text.toLowerCase();

  // Warn about overly abstract or unanswerable phrasing
  const problematicPatterns = [
    { pattern: /how do you approach/i, message: 'Too abstract - prefer specific behavioral statements' },
    { pattern: /describe your/i, message: 'Too open-ended - prefer statements that can be rated' },
    { pattern: /what is your/i, message: 'Too open-ended - prefer statements that can be rated' },
    { pattern: /rate your/i, message: 'Avoid meta-instructions like "rate your" - state the behavior directly' },
    { pattern: /\[placeholder\]/i, message: 'Contains placeholder text' },
  ];

  for (const { pattern, message } of problematicPatterns) {
    if (pattern.test(text)) {
      return {
        questionId: question.id,
        severity: 'warning',
        message,
        suggestion: 'Rephrase as a concrete behavioral statement (e.g., "I do X when Y happens")',
      };
    }
  }

  return null;
}

/**
 * Validate reverse scoring flag
 */
function validateReverseScoring(question: Question): ValidationWarning | null {
  // For now, just check that reverse_scored is boolean or undefined
  if (question.reverse_scored !== undefined && typeof question.reverse_scored !== 'boolean') {
    return {
      questionId: question.id,
      severity: 'error',
      message: `reverse_scored must be boolean, got: ${typeof question.reverse_scored}`,
      suggestion: 'Set reverse_scored to true, false, or leave undefined (defaults to false)',
    };
  }

  return null;
}

/**
 * Validate force distribution (should have roughly equal questions per force)
 */
function validateForceDistribution(questions: Question[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const forceCounts: Record<string, number> = {};

  // Count questions per force
  questions.forEach((q) => {
    forceCounts[q.force] = (forceCounts[q.force] || 0) + 1;
  });

  // Check if any force has 0 questions
  VALID_FORCES.forEach((force) => {
    if (!forceCounts[force] || forceCounts[force] === 0) {
      warnings.push({
        questionId: '_global',
        severity: 'error',
        message: `Force "${force}" has no questions`,
        suggestion: 'Each force should have at least 1 question',
      });
    }
  });

  // Check for imbalanced distribution
  const counts = Object.values(forceCounts);
  const min = Math.min(...counts);
  const max = Math.max(...counts);

  if (max > min * 2) {
    warnings.push({
      questionId: '_global',
      severity: 'warning',
      message: `Unbalanced question distribution across forces (min: ${min}, max: ${max})`,
      suggestion: 'Try to keep roughly equal questions per force for balanced scoring',
    });
  }

  return warnings;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate an array of questions
 * Returns a validation result with all warnings and errors
 */
export function validateQuestions(questions: Question[]): ValidationResult {
  const warnings: ValidationWarning[] = [];

  // Run global validations
  warnings.push(...validateUniqueIds(questions));
  warnings.push(...validateForceDistribution(questions));

  // Run per-question validations
  questions.forEach((question) => {
    const forceWarning = validateForce(question);
    if (forceWarning) warnings.push(forceWarning);

    const typeWarning = validateType(question);
    if (typeWarning) warnings.push(typeWarning);

    const textMatchWarning = validateTextMatchesType(question);
    if (textMatchWarning) warnings.push(textMatchWarning);

    warnings.push(...validateOptions(question));

    const answerabilityWarning = validateAnswerability(question);
    if (answerabilityWarning) warnings.push(answerabilityWarning);

    const reverseWarning = validateReverseScoring(question);
    if (reverseWarning) warnings.push(reverseWarning);
  });

  // Count errors vs warnings
  const errorCount = warnings.filter((w) => w.severity === 'error').length;
  const warningCount = warnings.filter((w) => w.severity === 'warning').length;

  return {
    valid: errorCount === 0,
    warnings,
    errorCount,
    warningCount,
  };
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Log validation results to console (dev-only)
 */
export function logValidationResults(result: ValidationResult): void {
  if (result.valid && result.warningCount === 0) {
    console.log('✅ Question bank validation passed with no warnings');
    return;
  }

  console.log('\n⚠️  Question Bank Validation Results');
  console.log('━'.repeat(60));

  if (result.errorCount > 0) {
    console.log(`\n🔴 ${result.errorCount} ERROR(S) - MUST FIX BEFORE PRODUCTION`);
    result.warnings
      .filter((w) => w.severity === 'error')
      .forEach((warning) => {
        console.log(`\n  Question: ${warning.questionId}`);
        console.log(`  ❌ ${warning.message}`);
        if (warning.suggestion) {
          console.log(`  💡 ${warning.suggestion}`);
        }
      });
  }

  if (result.warningCount > 0) {
    console.log(`\n🟡 ${result.warningCount} WARNING(S) - RECOMMENDED TO FIX`);
    result.warnings
      .filter((w) => w.severity === 'warning')
      .forEach((warning) => {
        console.log(`\n  Question: ${warning.questionId}`);
        console.log(`  ⚠️  ${warning.message}`);
        if (warning.suggestion) {
          console.log(`  💡 ${warning.suggestion}`);
        }
      });
  }

  console.log('\n' + '━'.repeat(60) + '\n');
}

/**
 * Run validation and log results (for use in main.tsx)
 */
export function runQuestionValidation(questions: Question[]): void {
  if (import.meta.env.DEV) {
    const result = validateQuestions(questions);
    logValidationResults(result);
  }
}

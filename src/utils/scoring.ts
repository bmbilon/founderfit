/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * Scoring Utilities
 */

import {
  ExecutionForce,
  QuestionResponse,
  AssessmentScores,
  ScoreInterpretation,
  ForceInterpretation,
  QuestionType,
  SCORE_BANDS,
  FORCE_THRESHOLDS,
  FORCE_COACHING,
} from '@/types';
import type { DemographicAnswers } from '@/data/demographics';
import { buildWeightProfile, getDefaultWeightProfile, type WeightProfile } from './weighting';

// ============================================================================
// NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalize a binary response (0 or 1) to 0-100 scale
 * Binary questions are scored as 0 or 100 points (value * 100)
 * This ensures binary questions have equal weight to Likert questions on the 0-100 scale
 */
export function normalizeBinaryValue(value: number): number {
  if (value !== 0 && value !== 1) {
    throw new Error(`Invalid binary value: ${value}. Must be 0 or 1.`);
  }
  return value * 100; // 0 → 0, 1 → 100
}

/**
 * Normalize a Likert response (1-5) to 0-100 scale
 * Likert questions are scored as 0, 25, 50, 75, or 100 points ((value - 1) / 4 * 100)
 */
export function normalizeLikertValue(value: number): number {
  if (value < 1 || value > 5) {
    throw new Error(`Invalid Likert value: ${value}. Must be between 1 and 5.`);
  }
  return ((value - 1) / 4) * 100;
}

/**
 * Normalize Thesis Integrity Q1 response according to canonical spec
 * Maps option values (0-3) to base impacts then normalizes to 0-100
 *
 * Options have been shuffled to prevent positional gaming.
 * Current mapping (after shuffle):
 * - value 0: "Continue testing..." → +4 impact (passive caution)
 * - value 1: "Actively explore..." → +22 impact (strong falsification mindset)
 * - value 2: "Reframe..." → -18 impact (narrative protection)
 * - value 3: "Adjust..." → +12 impact (adaptive revision)
 *
 * Normalization: ((impact - min) / (max - min)) * 100
 * Where min = -18, max = +22, range = 40
 *
 * TODO: Implement demographic modulation per spec
 * - Age-based: <30 amplify C/D, 45-55 penalize A/cap D, 55+ down-weight D
 * - Experience: <3y boost B, 3-10y maximize C/D, 10+y strongly penalize A
 * - Prior exits: None=D full, 1 exit=D -15%, multiple=A red flag
 * - Team: Solo=dampen repeated D, 2-3=D full, 4+=C optimal
 * This requires passing demographics through scoring pipeline (future enhancement)
 */
export function normalizeThesisIntegrityQ1(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q1 value: ${value}. Must be 0-3.`);
  }

  // Map option value to base impact (options shuffled to prevent gaming)
  const BASE_IMPACTS: Record<number, number> = {
    0: +4,  // "Continue testing..." (passive caution)
    1: +22, // "Actively explore..." (strong falsification mindset)
    2: -18, // "Reframe..." (narrative protection, ego defense)
    3: +12, // "Adjust..." (adaptive revision)
  };

  const impact = BASE_IMPACTS[value];

  // Normalize to 0-100 scale
  const MIN_IMPACT = -18;
  const MAX_IMPACT = +22;
  const RANGE = MAX_IMPACT - MIN_IMPACT; // 40

  const normalized = ((impact - MIN_IMPACT) / RANGE) * 100;

  return normalized;
}

/**
 * Normalize Thesis Integrity Q2 response (Sanitation Overheard)
 * Maps option values (0-3) to base impacts then normalizes to 0-100
 *
 * Options have been shuffled to prevent positional gaming.
 * Current mapping (after shuffle):
 * - value 0: "Assume it was exaggerated..." → -16 impact (rationalization)
 * - value 1: "Say nothing today..." → +10 impact (silent exit)
 * - value 2: "Mention what you overheard..." → +12 impact (direct confrontation)
 * - value 3: "Calmly ask..." → +18 impact (diplomatic inquiry)
 *
 * Normalization: ((impact - min) / (max - min)) * 100
 * Where min = -16, max = +18, range = 34
 *
 * Flags:
 * - Option with +12 triggers dominance_pressure (pattern-based)
 * - Option with -16 triggers rationalization_bias (pattern-based)
 *
 * TODO: Implement demographic modulation per spec
 * - Age: <30 A -10%, B/C +5%; 45-55 B +10%, D -10%; 55+ C -10%
 * - Industry exp: <3 A +5%; 3-10 B +10%; 10+ D -15%
 * - Prior exits: 1+ C -10% unless stakeholder-care high; 2+ D red-flag if repeated
 * - Cofounders: solo C -10%, B +5%; 2-3 B +5%; 4+ A +5%
 *
 * TODO: Implement anti-gaming rule
 * - If repeated B + impression-management high elsewhere => down-weight B by 10%
 *
 * This requires passing demographics and pattern detection through scoring pipeline
 */
export function normalizeThesisIntegrityQ2(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q2 value: ${value}. Must be 0-3.`);
  }

  // Map option value to base impact (options shuffled to prevent gaming)
  const BASE_IMPACTS: Record<number, number> = {
    0: -16, // "Assume..." (rationalization, lowest)
    1: +10, // "Say nothing..." (silent exit)
    2: +12, // "Mention..." (direct confrontation)
    3: +18, // "Calmly ask..." (diplomatic inquiry, highest)
  };

  const impact = BASE_IMPACTS[value];

  // Normalize to 0-100 scale
  const MIN_IMPACT = -16;
  const MAX_IMPACT = +18;
  const RANGE = MAX_IMPACT - MIN_IMPACT; // 34

  const normalized = ((impact - MIN_IMPACT) / RANGE) * 100;

  return normalized;
}

/**
 * Normalize Thesis Integrity Q3 response (Third-Party Landmine)
 * Maps option values (0-3) to base impacts then normalizes to 0-100
 *
 * Options have been shuffled to prevent positional gaming.
 * Current mapping (after shuffle):
 * - value 0: "Improve execution..." → +12 impact (execution focus)
 * - value 1: "Accept failure..." → -10 impact (learning avoidance)
 * - value 2: "Stay the course..." → -18 impact (counterfactual fixation)
 * - value 3: "Re-examine assumptions..." → +22 impact (assumption re-examination, BEST)
 *
 * Normalization: ((impact - min) / (max - min)) * 100
 * Where min = -18, max = +22, range = 40
 *
 * Flags:
 * - Option with -18 triggers counterfactual_fixation
 * - Option with -10 triggers learning_avoidance
 * - Option with +12 (patterned) triggers execution_rationalization
 *
 * TODO: Implement demographic modulation per spec
 * - Prior startup, no successful exit: -18/-10 options -25%/-20%
 * - Prior successful exit: +22 option strongest
 * - Age 40+: -18/-10 options additional -10%
 * - Industry exp 3+: +22 option +10%
 *
 * This requires passing demographics through scoring pipeline
 */
export function normalizeThesisIntegrityQ3(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q3 value: ${value}. Must be 0-3.`);
  }

  // Map option value to base impact (options shuffled to prevent gaming)
  const BASE_IMPACTS: Record<number, number> = {
    0: +12, // "Improve execution..." (execution focus)
    1: -10, // "Accept failure..." (learning avoidance)
    2: -18, // "Stay the course..." (counterfactual fixation)
    3: +22, // "Re-examine..." (assumption re-examination, highest)
  };

  const impact = BASE_IMPACTS[value];

  // Normalize to 0-100 scale
  const MIN_IMPACT = -18;
  const MAX_IMPACT = +22;
  const RANGE = MAX_IMPACT - MIN_IMPACT; // 40

  const normalized = ((impact - MIN_IMPACT) / RANGE) * 100;

  return normalized;
}

/**
 * Normalize Thesis Integrity Q4 response (Cofounder Disagreement)
 * Maps option values (0-3) to base impacts then normalizes to 0-100
 *
 * Options have been shuffled to prevent positional gaming.
 * Current mapping (after shuffle):
 * - value 0: "Table the decision..." → +8 impact (table decision, passive)
 * - value 1: "Defer to your cofounder..." → -10 impact (conflict avoidance)
 * - value 2: "Push forward..." → -18 impact (authority override)
 * - value 3: "Define what evidence..." → +24 impact (define evidence, test, update - BEST)
 *
 * Normalization: ((impact - min) / (max - min)) * 100
 * Where min = -18, max = +24, range = 42
 *
 * Flags:
 * - Option with -18 triggers authority_override
 * - Option with -10 triggers conflict_avoidance
 *
 * TODO: Implement demographic modulation per spec
 * - Repeat founder, no exit: -18 option -25%, -10 option -20%
 * - Successful exit: +24 option strongest
 * - 2-3 cofounders: +24 option +4 bonus
 * - 4+ cofounders: -18/-10 options additional -10%
 *
 * This requires passing demographics through scoring pipeline
 */
export function normalizeThesisIntegrityQ4(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q4 value: ${value}. Must be 0-3.`);
  }

  // Map option value to base impact (options shuffled to prevent gaming)
  const BASE_IMPACTS: Record<number, number> = {
    0: +8,  // "Table..." (table decision, passive)
    1: -10, // "Defer..." (conflict avoidance)
    2: -18, // "Push forward..." (authority override)
    3: +24, // "Define evidence..." (define evidence, test, update, highest)
  };

  const impact = BASE_IMPACTS[value];

  // Normalize to 0-100 scale
  const MIN_IMPACT = -18;
  const MAX_IMPACT = +24;
  const RANGE = MAX_IMPACT - MIN_IMPACT; // 42

  const normalized = ((impact - MIN_IMPACT) / RANGE) * 100;

  return normalized;
}

/**
 * Normalize Thesis Integrity Q5 response (Public Commitment)
 * Maps option values (0-3) to base impacts then normalizes to 0-100
 *
 * Options have been shuffled to prevent positional gaming.
 * Current mapping (after shuffle):
 * - value 0: "Narrow the scope..." → +10 impact (narrow scope and reposition)
 * - value 1: "Stay the course..." → -12 impact (romantic persistence)
 * - value 2: "Push forward aggressively..." → -26 impact (hubris override, lowest)
 * - value 3: "Pause further investment..." → +26 impact (pause and re-evaluate, BEST)
 *
 * Normalization: ((impact - min) / (max - min)) * 100
 * Where min = -26, max = +26, range = 52
 *
 * Flags:
 * - Option with -26 triggers hubris_override
 * - Option with -12 triggers romantic_persistence
 * - Repeated selection of -26 or -12 across TI questions triggers belief_identity_fusion
 *
 * Detects:
 * - ego_cost_fallacy (public commitment preventing rational revision)
 * - belief_identity_fusion (thesis becomes part of founder identity)
 * - public_commitment_bias (credibility concerns override evidence)
 *
 * TODO: Implement demographic modulation per spec (if any provided)
 *
 * This requires passing demographics through scoring pipeline
 */
export function normalizeThesisIntegrityQ5(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q5 value: ${value}. Must be 0-3.`);
  }

  // Map option value to base impact (options shuffled to prevent gaming)
  const BASE_IMPACTS: Record<number, number> = {
    0: +10, // "Narrow scope..." (narrow scope and reposition)
    1: -12, // "Stay the course..." (romantic persistence)
    2: -26, // "Push forward..." (hubris override, lowest)
    3: +26, // "Pause..." (pause and re-evaluate, highest)
  };

  const impact = BASE_IMPACTS[value];

  // Normalize to 0-100 scale
  const MIN_IMPACT = -26;
  const MAX_IMPACT = +26;
  const RANGE = MAX_IMPACT - MIN_IMPACT; // 52

  const normalized = ((impact - MIN_IMPACT) / RANGE) * 100;

  return normalized;
}

/**
 * Normalize Thesis Integrity Q6 response (The Lesson That Didn't Stick)
 * Returns explicit points value based on option selected
 * Options have been shuffled to prevent positional gaming
 * Points: D=0, C=18, B=72, A=100 (mapped to values 0-3 after shuffle)
 */
export function normalizeThesisIntegrityQ6(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q6 value: ${value}. Must be 0-3.`);
  }

  const OPTION_POINTS: Record<number, number> = {
    0: 0,   // Option D: "If conviction remains..."
    1: 18,  // Option C: "Move faster this time..."
    2: 72,  // Option B: "Bring in stronger operators..."
    3: 100, // Option A: "Pressure-test..."
  };

  return OPTION_POINTS[value];
}

/**
 * Normalize Thesis Integrity Q7 response (The Narrative Lock-In)
 * Returns explicit points value based on option selected
 * Options have been shuffled to prevent positional gaming
 * Points: A=81, C=0, D=44, B=100 (mapped to values 0-3 after shuffle)
 */
export function normalizeThesisIntegrityQ7(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q7 value: ${value}. Must be 0-3.`);
  }

  const OPTION_POINTS: Record<number, number> = {
    0: 81,  // Option A: "Keep the narrative stable..."
    1: 0,   // Option C: "Reinforce the story..."
    2: 44,  // Option D: "Pause internal debate..."
    3: 100, // Option B: "Encourage internal debate..."
  };

  return OPTION_POINTS[value];
}

/**
 * Normalize Thesis Integrity Q8 response (Being Right vs Being Early)
 * Returns explicit points value based on option selected
 * Options have been shuffled to prevent positional gaming
 * Points: C=27, B=61, D=0, A=100 (mapped to values 0-3 after shuffle)
 */
export function normalizeThesisIntegrityQ8(value: number): number {
  if (value < 0 || value > 3) {
    throw new Error(`Invalid Thesis Integrity Q8 value: ${value}. Must be 0-3.`);
  }

  const OPTION_POINTS: Record<number, number> = {
    0: 27,  // Option C: "If the thesis is correct..."
    1: 61,  // Option B: "Endurance matters..."
    2: 0,   // Option D: "Market resistance..."
    3: 100, // Option A: "Being early is effectively..."
  };

  return OPTION_POINTS[value];
}

/**
 * Apply demographic scaling to MC question scores (Q6-Q8 only)
 * Scaling adjusts the base score BEFORE force averages are computed
 *
 * @param baseScore - The raw score from the selected option (0-100)
 * @param questionId - The question ID (e.g., 'A_TI_Q6')
 * @param demographics - Optional demographic answers
 * @returns Scaled score clamped to [0, 100]
 */
export function applyDemographicScalingToMcScore(
  baseScore: number,
  questionId: string,
  demographics?: DemographicAnswers
): number {
  if (!demographics) {
    return baseScore;
  }

  let score = baseScore;

  // Cofounder scaling
  if (demographics.cofounder_count === 'solo') {
    // Solo founder: if baseScore == 0 then keep 0; else baseScore * 0.97
    if (score !== 0) {
      score = score * 0.97;
    }
  } else if (demographics.cofounder_count === 'two' || demographics.cofounder_count === 'three') {
    // 2-3 cofounders: no scaling (1.00)
    score = score * 1.0;
  } else if (demographics.cofounder_count === 'four_plus') {
    // 4+ cofounders: 0.98
    score = score * 0.98;
  }

  // Age scaling (use strongest multiplier, don't stack)
  const ageBracket = demographics.age_bracket;
  if (ageBracket === '50_54' || ageBracket === '55_59' || ageBracket === '60_plus') {
    // Contains "50", "55", or "60": 1.04
    score = score * 1.04;
  } else if (ageBracket === '45_49') {
    // Contains "45": 1.03
    score = score * 1.03;
  } else if (ageBracket === 'under_25' || ageBracket === '25_29') {
    // Contains "18", "under 25", or "25-29": 0.97
    score = score * 0.97;
  }

  // Industry experience scaling
  const industryExp = demographics.industry_experience;
  if (industryExp === '0_1' || industryExp === '2_3') {
    // 0-2 years: 0.97
    score = score * 0.97;
  } else if (industryExp === '4_6') {
    // 3-7 years: 1.00
    score = score * 1.0;
  } else if (industryExp === '7_10' || industryExp === '11_plus') {
    // 8+ years: 1.02
    score = score * 1.02;
  }

  // Prior exits scaling (Q18/A_TI_Q6 only - "lesson learned" landmine amplifier)
  if (questionId === 'A_TI_Q6') {
    const hasPriorStartups = demographics.prior_startups !== '0';
    const hasNoExits = demographics.prior_exits === '0';

    if (hasPriorStartups && hasNoExits) {
      // If selected option points is 0 or 18, multiply by 0.90 (penalty)
      if (baseScore === 0 || baseScore === 18) {
        score = score * 0.90;
      }
      // If selected option points is 72 or 100, multiply by 1.03 (boost)
      else if (baseScore === 72 || baseScore === 100) {
        score = score * 1.03;
      }
    }
  }

  // Clamp to [0, 100] and round to nearest integer
  score = Math.max(0, Math.min(100, score));
  score = Math.round(score);

  return score;
}

/**
 * Normalize a response value based on question type
 * @param value - The raw response value
 * @param questionType - 'binary', 'likert', or 'multiple-choice'
 * @param reverseScored - If true, reverse the score (100 - normalized)
 * @param customScoring - Optional custom scoring identifier (e.g., 'thesis_integrity_q1')
 */
export function normalizeValue(
  value: number,
  questionType: QuestionType,
  reverseScored: boolean = false,
  customScoring?: string
): number {
  let normalized: number;

  // Handle custom scoring first
  if (customScoring === 'thesis_integrity_q1') {
    normalized = normalizeThesisIntegrityQ1(value);
  } else if (customScoring === 'thesis_integrity_q2') {
    normalized = normalizeThesisIntegrityQ2(value);
  } else if (customScoring === 'thesis_integrity_q3') {
    normalized = normalizeThesisIntegrityQ3(value);
  } else if (customScoring === 'thesis_integrity_q4') {
    normalized = normalizeThesisIntegrityQ4(value);
  } else if (customScoring === 'thesis_integrity_q5') {
    normalized = normalizeThesisIntegrityQ5(value);
  } else if (customScoring === 'thesis_integrity_q6') {
    normalized = normalizeThesisIntegrityQ6(value);
  } else if (customScoring === 'thesis_integrity_q7') {
    normalized = normalizeThesisIntegrityQ7(value);
  } else if (customScoring === 'thesis_integrity_q8') {
    normalized = normalizeThesisIntegrityQ8(value);
  } else if (questionType === 'binary') {
    normalized = normalizeBinaryValue(value);
  } else if (questionType === 'likert') {
    normalized = normalizeLikertValue(value);
  } else if (questionType === 'multiple-choice') {
    // Default multiple-choice normalization (if no custom scoring)
    // Assumes values are 0-based and evenly distributed
    // This is a fallback; most multiple-choice questions should have custom scoring
    throw new Error('Multiple-choice questions require custom_scoring specification');
  } else {
    throw new Error(`Unknown question type: ${questionType}`);
  }

  // Apply reverse scoring if needed
  if (reverseScored) {
    normalized = 100 - normalized;
  }

  return normalized;
}

// ============================================================================
// FORCE SCORE CALCULATION
// ============================================================================

/**
 * Calculate the score for a single Execution Force
 * Returns a score from 0-100, or null if no responses for this force
 * @param responses - Array of question responses
 * @param force - The execution force to calculate score for
 * @param questionMeta - Map of question IDs to their metadata (type, reverse_scored, custom_scoring)
 * @param demographics - Optional demographic answers for MC question scaling
 */
export function calculateForceScore(
  responses: QuestionResponse[],
  force: ExecutionForce,
  questionMeta: Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>,
  demographics?: DemographicAnswers
): number | null {
  const forceResponses = responses.filter((r) => r.force === force);

  if (forceResponses.length === 0) {
    return null; // No responses for this force - don't include in overall calculation
  }

  // Normalize each response and apply demographic scaling for Q6/Q7/Q8
  const normalizedValues = forceResponses.map((response) => {
    const meta = questionMeta.get(response.questionId);
    if (!meta) {
      throw new Error(`Question metadata not found for question ${response.questionId}`);
    }

    let normalized = normalizeValue(
      response.value,
      meta.type,
      meta.reverse_scored || false,
      meta.custom_scoring
    );

    // Apply demographic scaling ONLY for Q6/Q7/Q8 (A_TI_Q6, A_TI_Q7, A_TI_Q8)
    if (response.questionId === 'A_TI_Q6' || response.questionId === 'A_TI_Q7' || response.questionId === 'A_TI_Q8') {
      normalized = applyDemographicScalingToMcScore(normalized, response.questionId, demographics);
    }

    return normalized;
  });

  const sum = normalizedValues.reduce((acc, val) => acc + val, 0);
  const average = sum / normalizedValues.length;

  return Math.round(average);
}

/**
 * Calculate all force scores from survey responses
 * Returns partial record - forces with no responses will be excluded
 * @param demographics - Optional demographic answers for MC question scaling
 */
export function calculateAllForceScores(
  responses: QuestionResponse[],
  questionMeta: Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>,
  demographics?: DemographicAnswers
): Partial<Record<ExecutionForce, number>> {
  const forces: ExecutionForce[] = [
    'thesis_integrity',
    'learning_velocity',
    'decision_quality_under_load',
    'talent_gravity',
    'delivery_control',
    'resilience_economics',
  ];

  const forceScores: Partial<Record<ExecutionForce, number>> = {};

  for (const force of forces) {
    const score = calculateForceScore(responses, force, questionMeta, demographics);
    if (score !== null) {
      forceScores[force] = score;
    }
  }

  return forceScores;
}

// ============================================================================
// OVERALL SCORE CALCULATION
// ============================================================================

/**
 * Calculate the overall FounderFit score from force scores
 * Uses demographic-driven weights if provided, otherwise equal weights
 *
 * @param forceScores - Individual force scores (0-100)
 * @param demographics - Optional demographic answers for weighting
 * @returns Overall score (0-100)
 * @throws Error if not all forces have scores (incomplete assessment)
 */
export function calculateOverallScore(
  forceScores: Partial<Record<ExecutionForce, number>>,
  demographics?: DemographicAnswers
): number {
  const forces: ExecutionForce[] = [
    'thesis_integrity',
    'learning_velocity',
    'decision_quality_under_load',
    'talent_gravity',
    'delivery_control',
    'resilience_economics',
  ];

  // Check if all forces have at least one answered question
  const missingForces = forces.filter((force) => forceScores[force] === undefined);
  if (missingForces.length > 0) {
    throw new Error(
      `Cannot calculate overall score: missing responses for forces: ${missingForces.join(', ')}`
    );
  }

  // Get weight profile based on demographics
  const weightProfile = demographics
    ? buildWeightProfile(demographics)
    : getDefaultWeightProfile();

  // Calculate weighted average
  let weightedSum = 0;
  for (const force of forces) {
    const score = forceScores[force]!;
    const weight = weightProfile.forceWeights[force];
    weightedSum += score * weight;
  }

  return Math.round(weightedSum);
}

/**
 * Get weight profile for demographics
 * ADMIN ONLY - Shows how demographics affect scoring weights
 *
 * @param demographics - User's demographic answers
 * @returns Weight profile with force weights and narrative context
 */
export function getWeightProfile(demographics: DemographicAnswers): WeightProfile {
  return buildWeightProfile(demographics);
}

/**
 * Detailed breakdown of scoring calculation
 */
export interface ScoreBreakdown {
  perQuestion: Array<{
    questionId: string;
    force: ExecutionForce;
    rawValue: number;
    normalized: number;
    reverseScored: boolean;
  }>;
  perForce: Array<{
    force: ExecutionForce;
    score: number;
    questionCount: number;
  }>;
  overall: {
    score: number;
    forceCount: number;
  };
}

/**
 * Calculate complete assessment scores with detailed breakdown
 * @param responses - Array of question responses
 * @param questionMeta - Map of question IDs to their metadata (type, reverse_scored, custom_scoring)
 * @param demographics - Optional demographic answers for MC scaling and weighting
 * @param includeBreakdown - Whether to include detailed breakdown
 * @returns Assessment scores with optional detailed breakdown
 */
export function calculateAssessmentScores(
  responses: QuestionResponse[],
  questionMeta: Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>,
  demographics?: DemographicAnswers,
  includeBreakdown: boolean = false
): AssessmentScores & { breakdown?: ScoreBreakdown } {
  const forceScores = calculateAllForceScores(responses, questionMeta, demographics);
  const overallScore = calculateOverallScore(forceScores, demographics);

  const result: AssessmentScores & { breakdown?: ScoreBreakdown } = {
    overallScore,
    forceScores: forceScores as Record<ExecutionForce, number>,
  };

  if (includeBreakdown) {
    // Per-question breakdown
    const perQuestion = responses.map((response) => {
      const meta = questionMeta.get(response.questionId);
      if (!meta) {
        throw new Error(`Question metadata not found for question ${response.questionId}`);
      }
      const normalized = normalizeValue(
        response.value,
        meta.type,
        meta.reverse_scored || false,
        meta.custom_scoring
      );
      return {
        questionId: response.questionId,
        force: response.force,
        rawValue: response.value,
        normalized,
        reverseScored: meta.reverse_scored || false,
      };
    });

    // Per-force breakdown
    const perForce = Object.entries(forceScores).map(([force, score]) => ({
      force: force as ExecutionForce,
      score: score as number,
      questionCount: responses.filter((r) => r.force === force).length,
    }));

    // Overall breakdown
    const overall = {
      score: overallScore,
      forceCount: Object.keys(forceScores).length,
    };

    result.breakdown = {
      perQuestion,
      perForce,
      overall,
    };
  }

  return result;
}

// ============================================================================
// SCORE INTERPRETATION
// ============================================================================

/**
 * Get the interpretation band for an overall score
 */
export function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score >= SCORE_BANDS.exceptional.min) {
    return {
      score,
      band: 'exceptional',
      message: SCORE_BANDS.exceptional.description,
    };
  } else if (score >= SCORE_BANDS.strong.min) {
    return {
      score,
      band: 'strong',
      message: SCORE_BANDS.strong.description,
    };
  } else if (score >= SCORE_BANDS.average.min) {
    return {
      score,
      band: 'average',
      message: SCORE_BANDS.average.description,
    };
  } else {
    return {
      score,
      band: 'developing',
      message: SCORE_BANDS.developing.description,
    };
  }
}

/**
 * Get interpretation for a specific force score
 */
export function getForceInterpretation(
  force: ExecutionForce,
  score: number
): ForceInterpretation {
  let interpretation: 'high' | 'moderate' | 'low';
  let coachingNote: string;

  if (score >= FORCE_THRESHOLDS.high) {
    interpretation = 'high';
    coachingNote = FORCE_COACHING[force].high;
  } else if (score >= FORCE_THRESHOLDS.moderate) {
    interpretation = 'moderate';
    coachingNote = FORCE_COACHING[force].moderate;
  } else {
    interpretation = 'low';
    coachingNote = FORCE_COACHING[force].low;
  }

  return {
    force,
    score,
    interpretation,
    coachingNote,
  };
}

/**
 * Get interpretations for all forces
 */
export function getAllForceInterpretations(
  forceScores: Record<ExecutionForce, number>
): ForceInterpretation[] {
  return Object.entries(forceScores).map(([force, score]) =>
    getForceInterpretation(force as ExecutionForce, score)
  );
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that all questions have been answered
 */
export function validateAllQuestionsAnswered(
  responses: Record<string, QuestionResponse>,
  totalQuestions: number
): boolean {
  return Object.keys(responses).length === totalQuestions;
}

/**
 * Validate that a response value is valid for the question type
 */
export function validateResponseValue(value: number, questionType: QuestionType): boolean {
  if (questionType === 'binary') {
    return value === 0 || value === 1;
  } else {
    return value >= 1 && value <= 5;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the percentage of questions answered
 */
export function getProgressPercentage(responsesCount: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((responsesCount / totalQuestions) * 100);
}

/**
 * Format a score for display (e.g., 85 -> "85")
 */
export function formatScore(score: number): string {
  return Math.round(score).toString();
}

/**
 * Get color class based on score band
 */
export function getScoreColorClass(score: number): string {
  if (score >= SCORE_BANDS.exceptional.min) return 'score-exceptional';
  if (score >= SCORE_BANDS.strong.min) return 'score-strong';
  if (score >= SCORE_BANDS.average.min) return 'score-average';
  return 'score-developing';
}

// ============================================================================
// ANTI-GAMING RULES
// ============================================================================

/**
 * TODO: Implement Thesis Integrity Q1 anti-gaming rule per spec
 *
 * Rule from /specs/thesis_integrity_q1.md:
 * "If Option D is selected frequently AND vanity / dominance signals are high elsewhere,
 * D is reclassified as performative humility and down-weighted."
 *
 * Implementation requirements:
 * 1. Define threshold for "frequently" (e.g., >70% of multiple-choice questions)
 * 2. Define vanity/dominance signal indicators (requires cross-question analysis)
 * 3. Implement down-weighting mechanism (adjust normalized score or force weight)
 *
 * This requires pattern detection across all responses and may need to be
 * implemented as part of signal integrity checks.
 */

// ============================================================================
// SIGNAL INTEGRITY INDEX
// ============================================================================

import type {
  SignalIntegrityResult,
  IntegrityFlag,
  InconsistentPair,
} from '@/types';

/**
 * Placeholder inconsistent pairs
 * TODO: Populate with actual question pairs once real questions are available
 */
const INCONSISTENT_PAIRS: InconsistentPair[] = [
  // Example: If you answer "I make fast decisions" (high) on one question,
  // but "I need extensive validation" (low) on another, that's inconsistent
  // {
  //   question1Id: 'C1',
  //   question2Id: 'C3',
  //   description: 'Decision speed contradiction',
  //   checkFn: (v1, v2) => Math.abs(v1 - v2) <= 2, // Values should be within 2 points
  // },
];

/**
 * Configuration for Signal Integrity checks
 */
const INTEGRITY_CONFIG = {
  // Expected time range in seconds (adjust based on question count)
  expectedTimeRange: {
    min: 60, // Too fast (< 1 minute for 12 questions = suspicious)
    max: 1800, // Too slow (> 30 minutes = possible interruption/distraction)
  },
  // Straightlining threshold (% of questions with same answer)
  straightliningThreshold: 0.7, // 70% or more same answers
  // Extreme pattern threshold (% of questions with extreme answers only)
  extremeThreshold: 0.8, // 80% or more extreme answers (all 1s, all 5s, all 0s, all 1s)
};

/**
 * Calculate Signal Integrity Index
 *
 * Analyzes assessment responses for validity indicators:
 * - Time to complete (too fast or too slow)
 * - Inconsistent answer pairs
 * - Straightlining (same answer repeatedly)
 * - Extreme patterns (only choosing extremes)
 *
 * Returns integrity score (0-100, higher = better) and detailed flags
 */
export function calculateSignalIntegrity(
  responses: QuestionResponse[],
  startTime: Date,
  endTime: Date
): SignalIntegrityResult {
  const flags: IntegrityFlag[] = [];
  let integrityScore = 100; // Start at perfect, deduct for issues

  // ============================================================================
  // CHECK 1: Time to Complete
  // ============================================================================

  const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  const { min, max } = INTEGRITY_CONFIG.expectedTimeRange;

  const timeCheckPassed = durationSeconds >= min && durationSeconds <= max;

  if (durationSeconds < min) {
    const severity: 'low' | 'medium' | 'high' =
      durationSeconds < min / 2 ? 'high' : durationSeconds < min * 0.75 ? 'medium' : 'low';

    flags.push({
      type: 'time_outlier',
      severity,
      message: `Assessment completed suspiciously fast (${Math.round(durationSeconds)}s). Minimum expected: ${min}s.`,
      details: {
        durationSeconds,
        expectedMin: min,
        speedRatio: durationSeconds / min,
      },
    });

    integrityScore -= severity === 'high' ? 30 : severity === 'medium' ? 20 : 10;
  } else if (durationSeconds > max) {
    flags.push({
      type: 'time_outlier',
      severity: 'low',
      message: `Assessment took unusually long (${Math.round(durationSeconds / 60)}min). May indicate interruptions.`,
      details: {
        durationSeconds,
        expectedMax: max,
        durationMinutes: Math.round(durationSeconds / 60),
      },
    });

    integrityScore -= 5; // Minor deduction for slow completion
  }

  // ============================================================================
  // CHECK 2: Inconsistent Pairs
  // ============================================================================

  let inconsistentPairViolations = 0;

  for (const pair of INCONSISTENT_PAIRS) {
    const response1 = responses.find((r) => r.questionId === pair.question1Id);
    const response2 = responses.find((r) => r.questionId === pair.question2Id);

    if (response1 && response2) {
      const isConsistent = pair.checkFn(response1.value, response2.value);
      if (!isConsistent) {
        inconsistentPairViolations++;

        flags.push({
          type: 'inconsistent_pair',
          severity: 'medium',
          message: `Inconsistent responses detected: ${pair.description}`,
          details: {
            question1: pair.question1Id,
            question2: pair.question2Id,
            value1: response1.value,
            value2: response2.value,
          },
        });
      }
    }
  }

  const pairCheckPassed = inconsistentPairViolations === 0;
  if (inconsistentPairViolations > 0) {
    integrityScore -= Math.min(inconsistentPairViolations * 15, 30); // Max 30 point deduction
  }

  // ============================================================================
  // CHECK 3: Straightlining Detection
  // ============================================================================

  // Count how many times each value appears
  const valueCounts: Record<number, number> = {};
  responses.forEach((r) => {
    valueCounts[r.value] = (valueCounts[r.value] || 0) + 1;
  });

  // Find the most common value and its percentage
  const maxCount = Math.max(...Object.values(valueCounts));
  const straightlinePercentage = maxCount / responses.length;

  const straightliningPassed =
    straightlinePercentage < INTEGRITY_CONFIG.straightliningThreshold;

  if (!straightliningPassed) {
    const mostCommonValue = Object.keys(valueCounts).find(
      (k) => valueCounts[parseInt(k)] === maxCount
    );

    flags.push({
      type: 'straightlining',
      severity: straightlinePercentage > 0.9 ? 'high' : 'medium',
      message: `Straightlining detected: ${Math.round(straightlinePercentage * 100)}% of answers are the same value (${mostCommonValue}).`,
      details: {
        mostCommonValue,
        percentage: straightlinePercentage,
        occurrences: maxCount,
        totalQuestions: responses.length,
      },
    });

    integrityScore -= straightlinePercentage > 0.9 ? 40 : 25;
  }

  // ============================================================================
  // CHECK 4: Extreme Pattern Detection
  // ============================================================================

  // Count responses that are extreme values (for Likert: 1 or 5, for binary: 0 or 1)
  // Since binary is 0-1 and Likert is 1-5, extremes are 0,1 for binary and 1,5 for Likert
  const extremeCount = responses.filter((r) => {
    return r.value === 0 || r.value === 1 || r.value === 5;
  }).length;

  const extremePercentage = extremeCount / responses.length;

  const extremePassed = extremePercentage < INTEGRITY_CONFIG.extremeThreshold;

  if (!extremePassed) {
    flags.push({
      type: 'extreme_pattern',
      severity: extremePercentage > 0.95 ? 'high' : 'medium',
      message: `Extreme response pattern: ${Math.round(extremePercentage * 100)}% of answers are extreme values (only 0, 1, or 5).`,
      details: {
        extremeCount,
        totalQuestions: responses.length,
        percentage: extremePercentage,
      },
    });

    integrityScore -= extremePercentage > 0.95 ? 30 : 20;
  }

  // ============================================================================
  // FINAL INTEGRITY SCORE
  // ============================================================================

  // Clamp score to 0-100
  integrityScore = Math.max(0, Math.min(100, Math.round(integrityScore)));

  return {
    integrityScore,
    flags,
    checks: {
      timeToComplete: {
        passed: timeCheckPassed,
        durationSeconds: Math.round(durationSeconds),
        expectedRange: { min, max },
      },
      inconsistentPairs: {
        passed: pairCheckPassed,
        violations: inconsistentPairViolations,
      },
      straightlining: {
        passed: straightliningPassed,
        straightlinePercentage: Math.round(straightlinePercentage * 100) / 100,
      },
      extremePatterns: {
        passed: extremePassed,
        extremePercentage: Math.round(extremePercentage * 100) / 100,
      },
    },
  };
}

/**
 * Get human-readable integrity assessment
 */
export function getIntegrityAssessment(integrityScore: number): {
  level: 'excellent' | 'good' | 'questionable' | 'poor';
  message: string;
} {
  if (integrityScore >= 90) {
    return {
      level: 'excellent',
      message: 'Excellent response integrity. No significant validity concerns detected.',
    };
  } else if (integrityScore >= 70) {
    return {
      level: 'good',
      message: 'Good response integrity. Minor patterns detected but generally valid.',
    };
  } else if (integrityScore >= 50) {
    return {
      level: 'questionable',
      message:
        'Questionable response integrity. Multiple validity concerns detected. Interpret results with caution.',
    };
  } else {
    return {
      level: 'poor',
      message:
        'Poor response integrity. Significant validity issues detected. Results may not be reliable.',
    };
  }
}

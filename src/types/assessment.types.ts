/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * Assessment & Survey Types
 */

import { ExecutionForce } from './database.types';

// ============================================================================
// EXECUTION FORCES FRAMEWORK
// ============================================================================

export const EXECUTION_FORCES = {
  thesis_integrity: {
    id: 'thesis_integrity' as const,
    name: 'Thesis Integrity',
    code: 'A',
    description: 'Can you form, hold, and revise a thesis without delusion or drift?',
    outcomeLink: 'Faster convergence to coherent strategy; fewer thrash cycles; better narrative consistency.',
  },
  learning_velocity: {
    id: 'learning_velocity' as const,
    name: 'Learning Velocity',
    code: 'B',
    description: 'How quickly do you turn signal -> model update -> new behavior?',
    outcomeLink: 'Speed to PMF; iteration efficiency; less wasted build.',
  },
  decision_quality_under_load: {
    id: 'decision_quality_under_load' as const,
    name: 'Decision Quality Under Load',
    code: 'C',
    description: 'How you decide when data is incomplete, stakes are high, multiple fires exist.',
    outcomeLink: 'Survival; fewer compounding errors; better second-order thinking.',
  },
  talent_gravity: {
    id: 'talent_gravity' as const,
    name: 'Talent Gravity',
    code: 'D',
    description: 'Ability to attract, align, and retain high-quality people.',
    outcomeLink: 'Team quality; execution throughput; culture durability.',
  },
  delivery_control: {
    id: 'delivery_control' as const,
    name: 'Delivery Control',
    code: 'E',
    description: 'Reliability of output: systems, follow-through, operational closure.',
    outcomeLink: 'Predictable shipping; lower entropy; better unit economics hygiene.',
  },
  resilience_economics: {
    id: 'resilience_economics' as const,
    name: 'Resilience Economics',
    code: 'F',
    description: 'Managing personal energy + motivation so the company doesn\'t die of founder depletion.',
    outcomeLink: 'Endurance; sustained intensity without burnout spirals.',
  },
} as const;

export type ExecutionForceKey = keyof typeof EXECUTION_FORCES;

export interface ExecutionForceInfo {
  id: ExecutionForce;
  name: string;
  code: string;
  description: string;
  outcomeLink: string;
}

// ============================================================================
// QUESTION TYPES
// ============================================================================

export type QuestionType = 'binary' | 'likert' | 'multiple-choice';

export interface QuestionOption {
  text: string;
  value: number;
  id?: string; // Option ID for multiple-choice (e.g., "A", "B", "C", "D")
  label?: string; // Short label for multiple-choice options
  points?: number; // Explicit point value for multiple-choice (0-100)
}

export interface Question {
  id: string; // e.g., 'A1', 'B2', 'C3'
  force: ExecutionForce;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  reverse_scored?: boolean; // If true, higher values = lower scores (for negatively-worded items)
  custom_scoring?: 'thesis_integrity_q1' | 'thesis_integrity_q2' | 'thesis_integrity_q3' | 'thesis_integrity_q4' | 'thesis_integrity_q5' | 'thesis_integrity_q6' | 'thesis_integrity_q7' | 'thesis_integrity_q8'; // Special scoring rules for specific questions
  leftLabel?: string; // Optional left anchor label for Likert questions (e.g., "Defend the original explanation...")
  rightLabel?: string; // Optional right anchor label for Likert questions (e.g., "Actively revise the explanation...")
}

export interface QuestionResponse {
  questionId: string;
  force: ExecutionForce;
  value: number;
}

// ============================================================================
// SCORING TYPES
// ============================================================================

export interface ForceScore {
  force: ExecutionForce;
  score: number; // 0-100
  responseCount: number;
}

export interface AssessmentScores {
  overallScore: number; // 0-100
  forceScores: Record<ExecutionForce, number>;
}

export interface ScoreInterpretation {
  score: number;
  band: 'exceptional' | 'strong' | 'average' | 'developing';
  message: string;
}

export interface ForceInterpretation {
  force: ExecutionForce;
  score: number;
  interpretation: 'high' | 'moderate' | 'low';
  coachingNote: string;
}

// ============================================================================
// SURVEY STATE
// ============================================================================

export interface SurveyState {
  currentQuestionIndex: number;
  responses: Record<string, QuestionResponse>;
  isComplete: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
}

// ============================================================================
// SIGNAL INTEGRITY INDEX
// ============================================================================

export interface IntegrityFlag {
  type: 'time_outlier' | 'inconsistent_pair' | 'straightlining' | 'extreme_pattern';
  severity: 'low' | 'medium' | 'high';
  message: string;
  details?: Record<string, any>;
}

export interface SignalIntegrityResult {
  integrityScore: number; // 0-100, where 100 = highest integrity
  flags: IntegrityFlag[];
  checks: {
    timeToComplete: {
      passed: boolean;
      durationSeconds: number;
      expectedRange: { min: number; max: number };
    };
    inconsistentPairs: {
      passed: boolean;
      violations: number;
    };
    straightlining: {
      passed: boolean;
      straightlinePercentage: number;
    };
    extremePatterns: {
      passed: boolean;
      extremePercentage: number;
    };
  };
}

// Placeholder: Define question pairs that should be consistent
// Will be populated once real questions are available
export interface InconsistentPair {
  question1Id: string;
  question2Id: string;
  description: string;
  checkFn: (value1: number, value2: number) => boolean;
}

// ============================================================================
// ASSESSMENT METADATA (Auditability Snapshots)
// ============================================================================

/**
 * Weight profile snapshot for auditability
 * Captures the exact weighting logic used at scoring time
 */
export interface WeightProfileSnapshot {
  version: string; // e.g., "v2.1"
  branch: 'solo' | 'two_three' | 'four_plus' | 'default';
  forceWeights: Record<ExecutionForce, number>; // normalized to sum=1.0
  deltasApplied: Record<string, number>; // e.g., { "industry_experience:thesis_integrity": 0.02 }
  normalizedSum: number; // should be 1.0 within float tolerance
}

/**
 * Narrative context snapshot for auditability
 * Captures the exact narrative shown to the user at results time
 */
export interface NarrativeSnapshot {
  cofounderContext: string;
  ageContext: string;
  industryExperienceContext: string;
  priorExitsContext: string;
}

/**
 * Integrity scoring snapshot for auditability
 * Captures the exact integrity calculation inputs/outputs and thresholds
 */
export interface IntegritySnapshot {
  integrity_score: number | null;
  integrity_flags: IntegrityFlag[];
  integrity_checks: SignalIntegrityResult['checks'];
  started_at: string | null;
  duration_seconds: number | null;
  thresholds: {
    minDuration: number; // seconds
    maxDuration: number; // seconds
    straightlineThreshold: number; // percentage (0-1)
    extremePatternThreshold: number; // percentage (0-1)
  };
  version: string; // e.g., "v2.1"
}

/**
 * Assessment metadata shape
 * Stored in assessments.metadata JSONB column
 */
export interface AssessmentMetadata {
  demographics?: Record<string, any>; // DemographicAnswers
  weight_profile?: WeightProfileSnapshot;
  narrative?: NarrativeSnapshot;
  integrity?: IntegritySnapshot;
}

// ============================================================================
// ASSESSMENT SUBMISSION
// ============================================================================

export interface AssessmentSubmission {
  founder_id: string;
  venture_id?: string;
  overall_score: number;
  force_thesis_integrity: number;
  force_learning_velocity: number;
  force_decision_quality: number;
  force_talent_gravity: number;
  force_delivery_control: number;
  force_resilience_economics: number;

  // Signal Integrity tracking
  integrity_score: number;
  integrity_flags: IntegrityFlag[];
  integrity_checks: SignalIntegrityResult['checks'];
  started_at: string;
  duration_seconds: number;

  // FAC Model (optional - for score enhancement)
  demographic_responses?: Record<string, any>;
  fac_score?: number;
  demographic_modifier?: number;

  assessment_version: string;
  completed_at: string;
  metadata?: AssessmentMetadata;
}

export interface ResponseSubmission {
  assessment_id: string;
  question_id: string;
  force: ExecutionForce;
  value: number;
  question_text: string;
}

// ============================================================================
// SCORE BANDS
// ============================================================================

export const SCORE_BANDS = {
  exceptional: {
    min: 80,
    max: 100,
    label: 'Exceptional Execution Capacity',
    description:
      'Your execution forces are exceptionally well-developed. You demonstrate the characteristics strongly correlated with founder success across multiple ventures. This profile suggests high potential for building and scaling ambitious companies.',
  },
  strong: {
    min: 65,
    max: 79,
    label: 'Strong Execution Profile',
    description:
      'You show strong execution capabilities across most forces. You have the foundational traits of successful founders with clear areas to leverage and some opportunities for targeted development.',
  },
  average: {
    min: 50,
    max: 64,
    label: 'Solid Foundational Profile',
    description:
      'You demonstrate solid foundational execution traits with significant opportunities for growth. Focus on your strongest forces while systematically developing others through deliberate practice.',
  },
  developing: {
    min: 0,
    max: 49,
    label: 'Developing Execution Capacity',
    description:
      'Your execution profile shows areas requiring significant development. Consider whether the founder path aligns with your natural strengths, or focus on building specific forces through structured practice and mentorship.',
  },
} as const;

// ============================================================================
// FORCE INTERPRETATION THRESHOLDS
// ============================================================================

export const FORCE_THRESHOLDS = {
  high: 70,
  moderate: 40,
} as const;

export const FORCE_COACHING = {
  thesis_integrity: {
    high: 'Strong strategic coherence--validate your thesis regularly to avoid confirmation bias and sunk-cost thinking.',
    moderate: 'Decent strategic thinking--work on articulating your thesis more clearly and testing it more rigorously.',
    low: 'Strategic clarity needed--define your thesis explicitly and create validation checkpoints to avoid drift.',
  },
  learning_velocity: {
    high: 'Rapid learner--ensure you\'re not iterating so fast that you lose strategic consistency.',
    moderate: 'Good learning pace--create more structured feedback loops to accelerate model updates.',
    low: 'Learning cycles are slow--build systematic methods to capture signals and update your mental models faster.',
  },
  decision_quality_under_load: {
    high: 'Excellent decision-making under pressure--continue developing second-order thinking to compound this strength.',
    moderate: 'Solid under pressure--practice making faster decisions with incomplete data through structured frameworks.',
    low: 'Decision quality suffers under load--develop heuristics and frameworks to improve speed and quality simultaneously.',
  },
  talent_gravity: {
    high: 'Strong talent magnet--ensure you\'re retaining and developing your team as effectively as you attract them.',
    moderate: 'Decent talent attraction--work on your narrative and culture to create stronger pull for high-performers.',
    low: 'Talent is a constraint--invest heavily in your story, vision, and culture to attract better team members.',
  },
  delivery_control: {
    high: 'Excellent operational rigor--leverage this for predictable execution and better unit economics.',
    moderate: 'Decent delivery consistency--build more systems and processes to reduce entropy as you scale.',
    low: 'Execution is inconsistent--create more structure, tracking, and follow-through systems immediately.',
  },
  resilience_economics: {
    high: 'Strong personal sustainability--your stamina is an asset; ensure you model healthy intensity for your team.',
    moderate: 'Decent resilience--build better energy management systems before scaling pressure increases.',
    low: 'Burnout risk is high--implement immediate changes to energy management or risk venture failure through founder depletion.',
  },
} as const;

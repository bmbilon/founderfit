/**
 * FounderFit Score v2.1: Demographic-Driven Weighting
 * Demographics determine how execution forces are weighted, NOT direct score adjustments
 */

import type { ExecutionForce } from '@/types/database.types';
import type { DemographicAnswers, DemographicProfile } from '@/data/demographics';
import { buildDemographicProfile } from '@/data/demographics';
import type { WeightProfileSnapshot, NarrativeSnapshot } from '@/types/assessment.types';

// ============================================================================
// WEIGHT PROFILE TYPES
// ============================================================================

export interface WeightProfile {
  forceWeights: Record<ExecutionForce, number>;
  questionWeights?: Record<string, number>; // Optional per-question weights
  narrative: NarrativeContext;
}

export interface NarrativeContext {
  cofounderContext: string;
  ageContext: string;
  industryExperienceContext: string;
  priorExitsContext: string;
}

// ============================================================================
// BASE WEIGHT TEMPLATES
// ============================================================================

/**
 * Solo Founder Weights
 * Emphasizes delivery control, decision quality, and resilience (no team to rely on)
 */
const SOLO_WEIGHTS: Record<ExecutionForce, number> = {
  thesis_integrity: 0.16,
  learning_velocity: 0.16,
  decision_quality_under_load: 0.18,
  talent_gravity: 0.12, // Less critical for solo
  delivery_control: 0.20, // Critical - must ship alone
  resilience_economics: 0.18, // Critical - burnout risk high
};

/**
 * Two or Three Founders Weights
 * Balanced weighting with emphasis on talent gravity and decision quality
 */
const TWO_THREE_WEIGHTS: Record<ExecutionForce, number> = {
  thesis_integrity: 0.16,
  learning_velocity: 0.16,
  decision_quality_under_load: 0.17,
  talent_gravity: 0.18, // Critical for co-founder dynamics
  delivery_control: 0.17,
  resilience_economics: 0.16,
};

/**
 * Four or More Founders Weights
 * Emphasizes thesis integrity, decision quality, and delivery control (coordination complexity)
 */
const FOUR_PLUS_WEIGHTS: Record<ExecutionForce, number> = {
  thesis_integrity: 0.18, // Critical - must maintain alignment
  learning_velocity: 0.14,
  decision_quality_under_load: 0.18, // Critical - distributed decisions
  talent_gravity: 0.14, // Less critical (already have team)
  delivery_control: 0.20, // Critical - coordination overhead
  resilience_economics: 0.16,
};

// ============================================================================
// WEIGHT BUILDER
// ============================================================================

/**
 * Build a weight profile from demographic answers
 * Process:
 * 1. Select base weights based on cofounder bucket
 * 2. Apply deltas based on industry experience and exits
 * 3. Renormalize to sum = 1.0
 * 4. Generate narrative context
 */
export function buildWeightProfile(demographics: DemographicAnswers): WeightProfile {
  const profile = buildDemographicProfile(demographics);

  // Step 1: Select base weights based on cofounder bucket
  let weights = { ...getBaseWeights(profile.cofounderBucket) };

  // Step 2: Apply deltas based on experience
  weights = applyExperienceDeltas(weights, profile);

  // Step 3: Renormalize to ensure sum = 1.0
  weights = normalizeWeights(weights);

  // Step 4: Generate narrative context
  const narrative = generateNarrativeContext(demographics);

  return {
    forceWeights: weights,
    narrative,
  };
}

/**
 * Build complete weight profile snapshot for auditability
 * This captures the exact weighting logic + narrative used at scoring time
 * so results remain auditable even if weighting logic changes later
 */
export function buildWeightProfileSnapshot(demographics: DemographicAnswers): {
  weightProfile: WeightProfileSnapshot;
  narrative: NarrativeSnapshot;
} {
  const profile = buildDemographicProfile(demographics);

  // Step 1: Select base weights based on cofounder bucket
  const baseWeights = { ...getBaseWeights(profile.cofounderBucket) };

  // Step 2: Track deltas applied
  const deltasApplied: Record<string, number> = {};
  let weights = { ...baseWeights };

  // Apply and track industry experience deltas
  if (profile.hasIndustryExperience) {
    const thesisDelta = 0.02;
    const learningDelta = 0.01;
    weights.thesis_integrity += thesisDelta;
    weights.learning_velocity += learningDelta;
    deltasApplied['industry_experience:thesis_integrity'] = thesisDelta;
    deltasApplied['industry_experience:learning_velocity'] = learningDelta;
  }

  // Apply and track prior exits deltas
  if (profile.hasSuccessfulExits) {
    const decisionDelta = 0.02;
    const deliveryDelta = 0.01;
    weights.decision_quality_under_load += decisionDelta;
    weights.delivery_control += deliveryDelta;
    deltasApplied['prior_exits:decision_quality_under_load'] = decisionDelta;
    deltasApplied['prior_exits:delivery_control'] = deliveryDelta;
  }

  // Step 3: Normalize and capture sum
  weights = normalizeWeights(weights);
  const normalizedSum = Object.values(weights).reduce((acc, val) => acc + val, 0);

  // Step 4: Generate narrative context
  const narrative = generateNarrativeContext(demographics);

  return {
    weightProfile: {
      version: 'v2.1',
      branch: profile.cofounderBucket,
      forceWeights: weights,
      deltasApplied,
      normalizedSum,
    },
    narrative: {
      cofounderContext: narrative.cofounderContext,
      ageContext: narrative.ageContext,
      industryExperienceContext: narrative.industryExperienceContext,
      priorExitsContext: narrative.priorExitsContext,
    },
  };
}

/**
 * Get base weights for a cofounder bucket
 */
function getBaseWeights(bucket: 'solo' | 'two_three' | 'four_plus'): Record<ExecutionForce, number> {
  switch (bucket) {
    case 'solo':
      return { ...SOLO_WEIGHTS };
    case 'two_three':
      return { ...TWO_THREE_WEIGHTS };
    case 'four_plus':
      return { ...FOUR_PLUS_WEIGHTS };
  }
}

/**
 * Apply experience-based deltas to weights
 * Max delta: ±0.02 per adjustment
 */
function applyExperienceDeltas(
  weights: Record<ExecutionForce, number>,
  profile: DemographicProfile
): Record<ExecutionForce, number> {
  const adjusted = { ...weights };

  // Industry experience >= 4 years: stronger thesis and learning
  if (profile.hasIndustryExperience) {
    adjusted.thesis_integrity += 0.02;
    adjusted.learning_velocity += 0.01;
  }

  // Prior successful exits >= 1: stronger decision quality and delivery
  if (profile.hasSuccessfulExits) {
    adjusted.decision_quality_under_load += 0.02;
    adjusted.delivery_control += 0.01;
  }

  return adjusted;
}

/**
 * Normalize weights to sum to 1.0
 * Ensures weighted average is valid
 */
function normalizeWeights(
  weights: Record<ExecutionForce, number>
): Record<ExecutionForce, number> {
  const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);

  if (sum === 0) {
    // Fallback to equal weights
    return {
      thesis_integrity: 1 / 6,
      learning_velocity: 1 / 6,
      decision_quality_under_load: 1 / 6,
      talent_gravity: 1 / 6,
      delivery_control: 1 / 6,
      resilience_economics: 1 / 6,
    };
  }

  const normalized: Record<ExecutionForce, number> = {} as any;
  for (const [force, weight] of Object.entries(weights)) {
    normalized[force as ExecutionForce] = weight / sum;
  }

  return normalized;
}

/**
 * Generate narrative context based on demographics
 * This is displayed separately from the numeric score
 */
function generateNarrativeContext(
  demographics: DemographicAnswers
): NarrativeContext {
  // Cofounder context
  const cofounderContext = generateCofounderContext(demographics.cofounder_count);

  // Age context
  const ageContext = generateAgeContext(demographics.age_bracket);

  // Industry experience context
  const industryExperienceContext = generateIndustryContext(
    demographics.industry_experience
  );

  // Prior exits context
  const priorExitsContext = generateExitsContext(
    demographics.prior_exits,
    demographics.prior_startups
  );

  return {
    cofounderContext,
    ageContext,
    industryExperienceContext,
    priorExitsContext,
  };
}

// ============================================================================
// NARRATIVE GENERATORS
// ============================================================================

function generateCofounderContext(count: string): string {
  switch (count) {
    case 'solo':
      return 'Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.';
    case 'two':
      return 'Two-founder team: Optimal for speed and decision-making. Ensure clear role division and maintain strong communication to avoid deadlock.';
    case 'three':
      return 'Three-founder team: Good balance of skills and perspectives. Watch for tie-breaking dynamics and ensure all voices remain aligned on core thesis.';
    case 'four_plus':
      return 'Four+ founders: Rich skill diversity but higher coordination overhead. Critical to maintain thesis alignment and establish clear decision protocols.';
    default:
      return '';
  }
}

function generateAgeContext(bracket: string): string {
  if (bracket === 'under_25' || bracket === '25_29') {
    return 'Early-career founder: High energy and adaptability. Focus on building credibility, securing mentorship, and accelerating pattern recognition.';
  } else if (bracket === '30_34' || bracket === '35_39' || bracket === '40_44') {
    return 'Peak-experience founder: Strong balance of experience, energy, and network. Leverage domain expertise while maintaining openness to new approaches.';
  } else if (bracket === '45_49' || bracket === '50_54') {
    return 'Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.';
  } else {
    return 'Veteran founder: Extensive experience and perspective. Critical to stay current with emerging trends and maintain high execution velocity.';
  }
}

function generateIndustryContext(experience: string): string {
  switch (experience) {
    case '0_1':
    case '2_3':
      return 'Limited industry experience: Outsider advantage for fresh perspective, but higher risk of missed opportunities or misread signals. Build strong advisory board.';
    case '4_6':
      return 'Solid industry experience: Good foundation for opportunity discovery and credibility. Continue deepening expertise while avoiding industry blind spots.';
    case '7_10':
    case '11_plus':
      return 'Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches.';
    default:
      return '';
  }
}

function generateExitsContext(exits: string, priorStartups: string): string {
  if (exits === '0' && priorStartups === '0') {
    return 'First-time founder: High learning curve but fresh perspective. Seek mentorship, build tight feedback loops, and maintain rapid iteration cycles.';
  } else if (exits === '0' && priorStartups !== '0') {
    return 'Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.';
  } else if (exits === '1') {
    return 'One successful exit: Proven track record and credibility. Avoid replicating past playbook—each venture has unique dynamics.';
  } else {
    return 'Multiple successful exits: Strong credibility and pattern recognition. Continue challenging assumptions and maintain hunger despite past success.';
  }
}

// ============================================================================
// DEFAULT PROFILE (No Demographics)
// ============================================================================

/**
 * Default weight profile when no demographics are provided
 * Equal weighting across all forces
 */
export function getDefaultWeightProfile(): WeightProfile {
  return {
    forceWeights: {
      thesis_integrity: 1 / 6,
      learning_velocity: 1 / 6,
      decision_quality_under_load: 1 / 6,
      talent_gravity: 1 / 6,
      delivery_control: 1 / 6,
      resilience_economics: 1 / 6,
    },
    narrative: {
      cofounderContext: '',
      ageContext: '',
      industryExperienceContext: '',
      priorExitsContext: '',
    },
  };
}

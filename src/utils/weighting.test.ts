/**
 * FounderFit Score v2.1: Weighting Tests
 * Tests for demographic-driven weight profiles
 * Ensures branch selection, normalization, deltas, and determinism work correctly
 */

import { describe, it, expect } from 'vitest';
import { buildWeightProfile, getDefaultWeightProfile, buildWeightProfileSnapshot } from './weighting';
import type { DemographicAnswers } from '@/data/demographics';
import { calculateOverallScore } from './scoring';
import type { ExecutionForce } from '@/types/database.types';

describe('buildWeightProfile', () => {
  it('should use solo weights for solo founder', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const profile = buildWeightProfile(demographics);

    // Solo founders should have higher delivery_control and resilience_economics
    expect(profile.forceWeights.delivery_control).toBeGreaterThan(0.18);
    expect(profile.forceWeights.resilience_economics).toBeGreaterThan(0.16);
    expect(profile.forceWeights.talent_gravity).toBeLessThan(0.14);
  });

  it('should use two-three weights for two founders', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'two',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const profile = buildWeightProfile(demographics);

    // Two-three founders should have balanced weights with emphasis on talent_gravity
    expect(profile.forceWeights.talent_gravity).toBeGreaterThan(0.16);
  });

  it('should use four_plus weights for four+ founders', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'four_plus',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const profile = buildWeightProfile(demographics);

    // Four+ founders should have higher thesis_integrity and delivery_control
    expect(profile.forceWeights.thesis_integrity).toBeGreaterThan(0.16);
    expect(profile.forceWeights.delivery_control).toBeGreaterThan(0.18);
  });

  it('should apply industry experience delta', () => {
    const withoutExperience: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '0_1',
      prior_startups: '0',
      prior_exits: '0',
    };

    const withExperience: DemographicAnswers = {
      ...withoutExperience,
      industry_experience: '7_10',
    };

    const profileWithout = buildWeightProfile(withoutExperience);
    const profileWith = buildWeightProfile(withExperience);

    // Industry experience should increase thesis_integrity and learning_velocity
    expect(profileWith.forceWeights.thesis_integrity).toBeGreaterThan(
      profileWithout.forceWeights.thesis_integrity
    );
    expect(profileWith.forceWeights.learning_velocity).toBeGreaterThan(
      profileWithout.forceWeights.learning_velocity
    );
  });

  it('should apply prior exits delta', () => {
    const withoutExits: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const withExits: DemographicAnswers = {
      ...withoutExits,
      prior_exits: '1',
    };

    const profileWithout = buildWeightProfile(withoutExits);
    const profileWith = buildWeightProfile(withExits);

    // Prior exits should increase decision_quality and delivery_control
    expect(profileWith.forceWeights.decision_quality_under_load).toBeGreaterThan(
      profileWithout.forceWeights.decision_quality_under_load
    );
    expect(profileWith.forceWeights.delivery_control).toBeGreaterThan(
      profileWithout.forceWeights.delivery_control
    );
  });

  it('should normalize weights to sum to 1.0', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '1',
    };

    const profile = buildWeightProfile(demographics);

    const sum = Object.values(profile.forceWeights).reduce((acc, val) => acc + val, 0);

    expect(sum).toBeCloseTo(1.0, 10);
  });

  it('should generate narrative context', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '0',
    };

    const profile = buildWeightProfile(demographics);

    expect(profile.narrative.cofounderContext).toBeTruthy();
    expect(profile.narrative.ageContext).toBeTruthy();
    expect(profile.narrative.industryExperienceContext).toBeTruthy();
    expect(profile.narrative.priorExitsContext).toBeTruthy();
  });

  it('should generate appropriate cofounder context', () => {
    const solo: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const profile = buildWeightProfile(solo);
    expect(profile.narrative.cofounderContext).toContain('Solo founder');
  });
});

describe('getDefaultWeightProfile', () => {
  it('should return equal weights', () => {
    const profile = getDefaultWeightProfile();

    const weights = Object.values(profile.forceWeights);
    const expectedWeight = 1 / 6;

    weights.forEach((weight) => {
      expect(weight).toBeCloseTo(expectedWeight, 10);
    });
  });

  it('should have empty narrative', () => {
    const profile = getDefaultWeightProfile();

    expect(profile.narrative.cofounderContext).toBe('');
    expect(profile.narrative.ageContext).toBe('');
    expect(profile.narrative.industryExperienceContext).toBe('');
    expect(profile.narrative.priorExitsContext).toBe('');
  });
});

// ============================================================================
// COMPREHENSIVE PRODUCTION TESTS
// ============================================================================

describe('Branch Selection (Production Hardening)', () => {
  it('should select SOLO branch for solo founder', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.branch).toBe('solo');
    // Solo should emphasize delivery_control and resilience_economics
    expect(weightProfile.forceWeights.delivery_control).toBeGreaterThan(0.18);
    expect(weightProfile.forceWeights.resilience_economics).toBeGreaterThan(0.16);
    // Solo should de-emphasize talent_gravity
    expect(weightProfile.forceWeights.talent_gravity).toBeLessThan(0.14);
  });

  it('should select TWO_THREE branch for two founders', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'two',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.branch).toBe('two_three');
    // Two-three should emphasize talent_gravity
    expect(weightProfile.forceWeights.talent_gravity).toBeGreaterThan(0.16);
  });

  it('should select TWO_THREE branch for three founders', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'three',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.branch).toBe('two_three');
  });

  it('should select FOUR_PLUS branch for four+ founders', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'four_plus',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.branch).toBe('four_plus');
    // Four+ should emphasize thesis_integrity and delivery_control
    expect(weightProfile.forceWeights.thesis_integrity).toBeGreaterThan(0.16);
    expect(weightProfile.forceWeights.delivery_control).toBeGreaterThan(0.18);
  });
});

describe('Weight Normalization (Production Hardening)', () => {
  it('should normalize weights to sum exactly 1.0', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '1',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    const sum = Object.values(weightProfile.forceWeights).reduce((acc, val) => acc + val, 0);

    // Sum should be exactly 1.0 within floating point tolerance
    expect(sum).toBeCloseTo(1.0, 10);
    expect(weightProfile.normalizedSum).toBeCloseTo(1.0, 10);
  });

  it('should have no negative weights', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '11_plus',
      prior_startups: '3_plus',
      prior_exits: '2_plus',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    Object.values(weightProfile.forceWeights).forEach((weight) => {
      expect(weight).toBeGreaterThanOrEqual(0);
    });
  });

  it('should normalize correctly even with maximum deltas applied', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '11_plus', // Triggers +0.02 and +0.01 deltas
      prior_startups: '3_plus',
      prior_exits: '2_plus', // Triggers +0.02 and +0.01 deltas
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    const sum = Object.values(weightProfile.forceWeights).reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });
});

describe('Delta Capping (Production Hardening)', () => {
  const MAX_DELTA = 0.02;

  it('should not exceed max delta of 0.02 per adjustment', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '11_plus',
      prior_startups: '3_plus',
      prior_exits: '2_plus',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    Object.values(weightProfile.deltasApplied).forEach((delta) => {
      expect(Math.abs(delta)).toBeLessThanOrEqual(MAX_DELTA);
    });
  });

  it('should track all deltas applied for auditability', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '1',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    // Should have deltas for both industry experience and prior exits
    expect(Object.keys(weightProfile.deltasApplied).length).toBeGreaterThan(0);
    expect(weightProfile.deltasApplied).toHaveProperty('industry_experience:thesis_integrity');
    expect(weightProfile.deltasApplied).toHaveProperty('prior_exits:decision_quality_under_load');
  });

  it('should apply no deltas when criteria not met', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '25_29',
      industry_experience: '0_1', // Less than 4 years
      prior_startups: '0',
      prior_exits: '0', // No exits
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(Object.keys(weightProfile.deltasApplied).length).toBe(0);
  });
});

describe('Determinism (Production Hardening)', () => {
  it('should produce identical weights for identical demographics', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'two',
      age_bracket: '35_39',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '1',
    };

    const profile1 = buildWeightProfileSnapshot(demographics);
    const profile2 = buildWeightProfileSnapshot(demographics);

    // Should be deep equal
    expect(profile1.weightProfile.forceWeights).toEqual(profile2.weightProfile.forceWeights);
    expect(profile1.weightProfile.deltasApplied).toEqual(profile2.weightProfile.deltasApplied);
    expect(profile1.weightProfile.normalizedSum).toBe(profile2.weightProfile.normalizedSum);
    expect(profile1.narrative).toEqual(profile2.narrative);
  });

  it('should produce different weights for different branches', () => {
    const solo: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const two: DemographicAnswers = {
      ...solo,
      cofounder_count: 'two',
    };

    const soloProfile = buildWeightProfileSnapshot(solo);
    const twoProfile = buildWeightProfileSnapshot(two);

    // Weights should differ between branches
    expect(soloProfile.weightProfile.forceWeights).not.toEqual(twoProfile.weightProfile.forceWeights);
    expect(soloProfile.weightProfile.branch).not.toBe(twoProfile.weightProfile.branch);
  });
});

describe('Weighted Scoring Integration (Production Hardening)', () => {
  it('should produce different overall scores for same force scores with different demographics', () => {
    // Create identical force scores
    const forceScores: Record<ExecutionForce, number> = {
      thesis_integrity: 75,
      learning_velocity: 70,
      decision_quality_under_load: 80,
      talent_gravity: 65,
      delivery_control: 85,
      resilience_economics: 70,
    };

    const soloDemographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const twoDemographics: DemographicAnswers = {
      ...soloDemographics,
      cofounder_count: 'two',
    };

    const soloScore = calculateOverallScore(forceScores, soloDemographics);
    const twoScore = calculateOverallScore(forceScores, twoDemographics);

    // Scores should differ because weights differ
    expect(soloScore).not.toBe(twoScore);
  });

  it('should weight forces according to branch emphasis', () => {
    // Create force scores where delivery_control is highest
    const forceScores: Record<ExecutionForce, number> = {
      thesis_integrity: 50,
      learning_velocity: 50,
      decision_quality_under_load: 50,
      talent_gravity: 50,
      delivery_control: 90, // Highest score
      resilience_economics: 50,
    };

    const soloDemographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const twoDemographics: DemographicAnswers = {
      ...soloDemographics,
      cofounder_count: 'two',
    };

    const soloScore = calculateOverallScore(forceScores, soloDemographics);
    const twoScore = calculateOverallScore(forceScores, twoDemographics);

    // Solo should score higher because it emphasizes delivery_control more
    expect(soloScore).toBeGreaterThan(twoScore);
  });
});

describe('Snapshot Auditability (Production Hardening)', () => {
  it('should include version in weight profile snapshot', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.version).toBe('v2.1');
  });

  it('should capture complete narrative snapshot', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '7_10',
      prior_startups: '1',
      prior_exits: '0',
    };

    const { narrative } = buildWeightProfileSnapshot(demographics);

    expect(narrative.cofounderContext).toBeTruthy();
    expect(narrative.ageContext).toBeTruthy();
    expect(narrative.industryExperienceContext).toBeTruthy();
    expect(narrative.priorExitsContext).toBeTruthy();
  });

  it('should capture normalized sum for validation', () => {
    const demographics: DemographicAnswers = {
      cofounder_count: 'solo',
      age_bracket: '30_34',
      industry_experience: '2_3',
      prior_startups: '0',
      prior_exits: '0',
    };

    const { weightProfile } = buildWeightProfileSnapshot(demographics);

    expect(weightProfile.normalizedSum).toBeDefined();
    expect(weightProfile.normalizedSum).toBeCloseTo(1.0, 10);
  });
});

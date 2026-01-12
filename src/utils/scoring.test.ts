/**
 * FounderFit Score v2.1: Scoring Utilities Tests
 *
 * Comprehensive test suite for normalization, reverse scoring,
 * force calculation, and missing answer handling.
 */

import { describe, it, expect } from 'vitest';
import type { QuestionResponse, QuestionType } from '@/types';
import {
  normalizeBinaryValue,
  normalizeLikertValue,
  normalizeThesisIntegrityQ1,
  normalizeThesisIntegrityQ2,
  normalizeThesisIntegrityQ3,
  normalizeThesisIntegrityQ4,
  normalizeThesisIntegrityQ5,
  normalizeValue,
  calculateForceScore,
  calculateAllForceScores,
  calculateOverallScore,
  calculateAssessmentScores,
} from './scoring';

// ============================================================================
// NORMALIZATION TESTS
// ============================================================================

describe('Binary Normalization', () => {
  it('should normalize 0 to 0', () => {
    expect(normalizeBinaryValue(0)).toBe(0);
  });

  it('should normalize 1 to 100', () => {
    expect(normalizeBinaryValue(1)).toBe(100);
  });

  it('should throw error for invalid values', () => {
    expect(() => normalizeBinaryValue(2)).toThrow('Invalid binary value');
    expect(() => normalizeBinaryValue(-1)).toThrow('Invalid binary value');
    expect(() => normalizeBinaryValue(0.5)).toThrow('Invalid binary value');
  });
});

describe('Likert Normalization', () => {
  it('should normalize 1 to 0', () => {
    expect(normalizeLikertValue(1)).toBe(0);
  });

  it('should normalize 2 to 25', () => {
    expect(normalizeLikertValue(2)).toBe(25);
  });

  it('should normalize 3 to 50', () => {
    expect(normalizeLikertValue(3)).toBe(50);
  });

  it('should normalize 4 to 75', () => {
    expect(normalizeLikertValue(4)).toBe(75);
  });

  it('should normalize 5 to 100', () => {
    expect(normalizeLikertValue(5)).toBe(100);
  });

  it('should throw error for values < 1', () => {
    expect(() => normalizeLikertValue(0)).toThrow('Invalid Likert value');
  });

  it('should throw error for values > 5', () => {
    expect(() => normalizeLikertValue(6)).toThrow('Invalid Likert value');
  });
});

// ============================================================================
// REVERSE SCORING TESTS
// ============================================================================

describe('Reverse Scoring', () => {
  it('should reverse binary scores', () => {
    expect(normalizeValue(0, 'binary', true)).toBe(100); // 100 - 0
    expect(normalizeValue(1, 'binary', true)).toBe(0); // 100 - 100
  });

  it('should reverse likert scores', () => {
    expect(normalizeValue(1, 'likert', true)).toBe(100); // 100 - 0
    expect(normalizeValue(2, 'likert', true)).toBe(75); // 100 - 25
    expect(normalizeValue(3, 'likert', true)).toBe(50); // 100 - 50
    expect(normalizeValue(4, 'likert', true)).toBe(25); // 100 - 75
    expect(normalizeValue(5, 'likert', true)).toBe(0); // 100 - 100
  });

  it('should not reverse when reverseScored is false', () => {
    expect(normalizeValue(1, 'binary', false)).toBe(100);
    expect(normalizeValue(5, 'likert', false)).toBe(100);
  });

  it('should default to non-reversed when reverseScored is undefined', () => {
    expect(normalizeValue(1, 'binary')).toBe(100);
    expect(normalizeValue(5, 'likert')).toBe(100);
  });
});

// ============================================================================
// FORCE SCORE CALCULATION TESTS
// ============================================================================

describe('Force Score Calculation', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['B1', { type: 'binary', reverse_scored: false }],
  ]);

  it('should calculate average score for a force', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 3 }, // 50
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(75); // (100 + 50) / 2 = 75
  });

  it('should return null when no responses for force', () => {
    const responses: QuestionResponse[] = [];
    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeNull();
  });

  it('should handle reverse scored questions', () => {
    const metaWithReverse = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
      ['A1', { type: 'likert' as QuestionType, reverse_scored: true }],
      ['A2', { type: 'likert' as QuestionType, reverse_scored: false }],
    ]);

    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100 reversed = 0
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', metaWithReverse);
    expect(score).toBe(50); // (0 + 100) / 2 = 50
  });

  it('should handle mixed binary and likert questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // likert: 100
      { questionId: 'B1', force: 'thesis_integrity', value: 1 }, // binary: 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100) / 2 = 100
  });

  it('should throw error if question metadata not found', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'UNKNOWN', force: 'thesis_integrity', value: 5 },
    ];

    expect(() => calculateForceScore(responses, 'thesis_integrity', questionMeta)).toThrow(
      'Question metadata not found'
    );
  });
});

// ============================================================================
// ALL FORCE SCORES CALCULATION TESTS
// ============================================================================

describe('Calculate All Force Scores', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
    ['A1', { type: 'likert' }],
    ['B1', { type: 'likert' }],
    ['C1', { type: 'binary' }],
  ]);

  it('should calculate scores for all forces with responses', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 },
      { questionId: 'B1', force: 'learning_velocity', value: 3 },
      { questionId: 'C1', force: 'decision_quality_under_load', value: 1 },
    ];

    const scores = calculateAllForceScores(responses, questionMeta);

    expect(scores.thesis_integrity).toBe(100);
    expect(scores.learning_velocity).toBe(50);
    expect(scores.decision_quality_under_load).toBe(100);
    expect(scores.talent_gravity).toBeUndefined();
    expect(scores.delivery_control).toBeUndefined();
    expect(scores.resilience_economics).toBeUndefined();
  });

  it('should return empty object when no responses', () => {
    const responses: QuestionResponse[] = [];
    const scores = calculateAllForceScores(responses, questionMeta);
    expect(Object.keys(scores).length).toBe(0);
  });
});

// ============================================================================
// OVERALL SCORE CALCULATION TESTS
// ============================================================================

describe('Overall Score Calculation', () => {
  it('should calculate average of all force scores', () => {
    const forceScores = {
      thesis_integrity: 100,
      learning_velocity: 75,
      decision_quality_under_load: 50,
      talent_gravity: 25,
      delivery_control: 100,
      resilience_economics: 50,
    };

    const overall = calculateOverallScore(forceScores);
    expect(overall).toBe(67); // (100+75+50+25+100+50)/6 = 66.67, rounded to 67
  });

  it('should throw error if any force is missing', () => {
    const incompleteScores = {
      thesis_integrity: 100,
      learning_velocity: 75,
      decision_quality_under_load: 50,
      talent_gravity: 25,
      delivery_control: 100,
      // Missing resilience_economics
    };

    expect(() => calculateOverallScore(incompleteScores)).toThrow(
      'Cannot calculate overall score: missing responses for forces'
    );
  });

  it('should throw error with correct missing force names', () => {
    const incompleteScores = {
      thesis_integrity: 100,
      learning_velocity: 75,
      // Missing other forces
    };

    expect(() => calculateOverallScore(incompleteScores)).toThrow('resilience_economics');
  });
});

// ============================================================================
// ASSESSMENT SCORES CALCULATION TESTS
// ============================================================================

describe('Calculate Assessment Scores', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
    ['A1', { type: 'likert' }],
    ['A2', { type: 'likert' }],
    ['B1', { type: 'likert' }],
    ['B2', { type: 'likert' }],
    ['C1', { type: 'likert' }],
    ['C2', { type: 'likert' }],
    ['D1', { type: 'likert' }],
    ['D2', { type: 'likert' }],
    ['E1', { type: 'likert' }],
    ['E2', { type: 'likert' }],
    ['F1', { type: 'likert' }],
    ['F2', { type: 'likert' }],
  ]);

  const completeResponses: QuestionResponse[] = [
    { questionId: 'A1', force: 'thesis_integrity', value: 5 },
    { questionId: 'A2', force: 'thesis_integrity', value: 5 },
    { questionId: 'B1', force: 'learning_velocity', value: 4 },
    { questionId: 'B2', force: 'learning_velocity', value: 4 },
    { questionId: 'C1', force: 'decision_quality_under_load', value: 3 },
    { questionId: 'C2', force: 'decision_quality_under_load', value: 3 },
    { questionId: 'D1', force: 'talent_gravity', value: 2 },
    { questionId: 'D2', force: 'talent_gravity', value: 2 },
    { questionId: 'E1', force: 'delivery_control', value: 5 },
    { questionId: 'E2', force: 'delivery_control', value: 5 },
    { questionId: 'F1', force: 'resilience_economics', value: 4 },
    { questionId: 'F2', force: 'resilience_economics', value: 4 },
  ];

  it('should calculate complete assessment scores', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta);

    expect(result.overallScore).toBeDefined();
    expect(result.forceScores.thesis_integrity).toBe(100);
    expect(result.forceScores.learning_velocity).toBe(75);
    expect(result.forceScores.decision_quality_under_load).toBe(50);
    expect(result.forceScores.talent_gravity).toBe(25);
    expect(result.forceScores.delivery_control).toBe(100);
    expect(result.forceScores.resilience_economics).toBe(75);
  });

  it('should include breakdown when requested', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta, undefined, true);

    expect(result.breakdown).toBeDefined();
    expect(result.breakdown?.perQuestion).toHaveLength(12);
    expect(result.breakdown?.perForce).toHaveLength(6);
    expect(result.breakdown?.overall).toBeDefined();
  });

  it('should not include breakdown by default', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta);
    expect(result.breakdown).toBeUndefined();
  });

  it('should include correct per-question breakdown', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta, undefined, true);

    const firstQuestion = result.breakdown?.perQuestion[0];
    expect(firstQuestion?.questionId).toBe('A1');
    expect(firstQuestion?.rawValue).toBe(5);
    expect(firstQuestion?.normalized).toBe(100);
    expect(firstQuestion?.reverseScored).toBe(false);
  });

  it('should include correct per-force breakdown', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta, undefined, true);

    const thesisForce = result.breakdown?.perForce.find(
      (f) => f.force === 'thesis_integrity'
    );
    expect(thesisForce?.score).toBe(100);
    expect(thesisForce?.questionCount).toBe(2);
  });

  it('should include correct overall breakdown', () => {
    const result = calculateAssessmentScores(completeResponses, questionMeta, undefined, true);

    expect(result.breakdown?.overall.score).toBeDefined();
    expect(result.breakdown?.overall.forceCount).toBe(6);
  });

  it('should handle reverse scored questions in breakdown', () => {
    const metaWithReverse = new Map(questionMeta);
    metaWithReverse.set('A1', { type: 'likert', reverse_scored: true });

    // Use complete responses with one reverse-scored question
    const responsesWithReverse = [...completeResponses];
    const result = calculateAssessmentScores(responsesWithReverse, metaWithReverse, undefined, true);

    // Find the reverse-scored question in the breakdown
    const reverseQuestion = result.breakdown?.perQuestion.find((q) => q.questionId === 'A1');
    expect(reverseQuestion?.reverseScored).toBe(true);
    expect(reverseQuestion?.normalized).toBe(0); // 5 reversed = 0
  });
});

// ============================================================================
// MISSING ANSWERS BEHAVIOR TESTS
// ============================================================================

describe('Missing Answers Behavior', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
    ['A1', { type: 'likert' }],
    ['B1', { type: 'likert' }],
  ]);

  it('should exclude forces with no answers from force scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 },
    ];

    const scores = calculateAllForceScores(responses, questionMeta);
    expect(scores.thesis_integrity).toBeDefined();
    expect(scores.learning_velocity).toBeUndefined();
  });

  it('should throw error when calculating overall with incomplete responses', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 },
    ];

    const scores = calculateAllForceScores(responses, questionMeta);
    expect(() => calculateOverallScore(scores)).toThrow();
  });

  it('should calculate overall only when all 6 forces have responses', () => {
    const completeQuestionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
      ['A1', { type: 'likert' }],
      ['B1', { type: 'likert' }],
      ['C1', { type: 'likert' }],
      ['D1', { type: 'likert' }],
      ['E1', { type: 'likert' }],
      ['F1', { type: 'likert' }],
    ]);

    const completeResponses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 },
      { questionId: 'B1', force: 'learning_velocity', value: 5 },
      { questionId: 'C1', force: 'decision_quality_under_load', value: 5 },
      { questionId: 'D1', force: 'talent_gravity', value: 5 },
      { questionId: 'E1', force: 'delivery_control', value: 5 },
      { questionId: 'F1', force: 'resilience_economics', value: 5 },
    ];

    const scores = calculateAllForceScores(completeResponses, completeQuestionMeta);
    const overall = calculateOverallScore(scores);
    expect(overall).toBe(100);
  });
});

// ============================================================================
// EDGE CASES AND ERROR HANDLING
// ============================================================================

describe('Edge Cases', () => {
  it('should handle single question per force', () => {
    const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
      ['A1', { type: 'likert' as QuestionType }],
    ]);
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 3 },
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(50);
  });

  it('should handle many questions per force', () => {
    const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
      ['A1', { type: 'likert' as QuestionType }],
      ['A2', { type: 'likert' as QuestionType }],
      ['A3', { type: 'likert' as QuestionType }],
      ['A4', { type: 'likert' as QuestionType }],
      ['A5', { type: 'likert' as QuestionType }],
    ]);

    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 1 }, // 0
      { questionId: 'A2', force: 'thesis_integrity', value: 2 }, // 25
      { questionId: 'A3', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A4', force: 'thesis_integrity', value: 4 }, // 75
      { questionId: 'A5', force: 'thesis_integrity', value: 5 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(50); // (0+25+50+75+100)/5 = 50
  });

  it('should round scores correctly', () => {
    const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean }>([
      ['A1', { type: 'likert' as QuestionType }],
      ['A2', { type: 'likert' as QuestionType }],
      ['A3', { type: 'likert' as QuestionType }],
    ]);

    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A3', force: 'thesis_integrity', value: 4 }, // 75
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(92); // (100+100+75)/3 = 91.67, rounds to 92
  });
});

// ============================================================================
// THESIS INTEGRITY Q1 CUSTOM SCORING TESTS
// ============================================================================

describe('Thesis Integrity Q1 - Base Scoring (per /specs/thesis_integrity_q1.md)', () => {
  it('should map Option A (0) to 0 points (base impact: -18)', () => {
    expect(normalizeThesisIntegrityQ1(0)).toBe(0);
  });

  it('should map Option B (1) to 55 points (base impact: +4)', () => {
    expect(normalizeThesisIntegrityQ1(1)).toBeCloseTo(55, 1);
  });

  it('should map Option C (2) to 75 points (base impact: +12)', () => {
    expect(normalizeThesisIntegrityQ1(2)).toBe(75);
  });

  it('should map Option D (3) to 100 points (base impact: +22)', () => {
    expect(normalizeThesisIntegrityQ1(3)).toBe(100);
  });

  it('should throw error for values < 0', () => {
    expect(() => normalizeThesisIntegrityQ1(-1)).toThrow('Invalid Thesis Integrity Q1 value');
  });

  it('should throw error for values > 3', () => {
    expect(() => normalizeThesisIntegrityQ1(4)).toThrow('Invalid Thesis Integrity Q1 value');
  });

  it('should maintain correct score ordering (A < B < C < D)', () => {
    const scoreA = normalizeThesisIntegrityQ1(0);
    const scoreB = normalizeThesisIntegrityQ1(1);
    const scoreC = normalizeThesisIntegrityQ1(2);
    const scoreD = normalizeThesisIntegrityQ1(3);

    expect(scoreA).toBeLessThan(scoreB);
    expect(scoreB).toBeLessThan(scoreC);
    expect(scoreC).toBeLessThan(scoreD);
  });
});

describe('Thesis Integrity Q1 - Integration with Force Scoring', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
  ]);

  it('should correctly score force with Option A (worst)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // 0 (Option A)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(67); // (100 + 100 + 0) / 3 = 66.67, rounds to 67
  });

  it('should correctly score force with Option B (passive caution)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 1 }, // 55 (Option B)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(85); // (100 + 100 + 55) / 3 = 85
  });

  it('should correctly score force with Option C (adaptive revision)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 2 }, // 75 (Option C)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(92); // (100 + 100 + 75) / 3 = 91.67, rounds to 92
  });

  it('should correctly score force with Option D (best)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // 100 (Option D)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100 + 100) / 3 = 100
  });

  it('should handle Option A severely penalizing high likert scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // 0 (Option A)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeLessThan(70); // Strong penalty for Option A
  });

  it('should work in complete assessment scoring', () => {
    const completeQuestionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
      ['A1', { type: 'likert' }],
      ['A2', { type: 'likert' }],
      ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
      ['B1', { type: 'likert' }],
      ['B2', { type: 'likert' }],
      ['C1', { type: 'likert' }],
      ['C2', { type: 'likert' }],
      ['D1', { type: 'likert' }],
      ['D2', { type: 'likert' }],
      ['E1', { type: 'likert' }],
      ['E2', { type: 'likert' }],
      ['F1', { type: 'likert' }],
      ['F2', { type: 'likert' }],
    ]);

    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 },
      { questionId: 'A2', force: 'thesis_integrity', value: 5 },
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // Option D = 100
      { questionId: 'B1', force: 'learning_velocity', value: 5 },
      { questionId: 'B2', force: 'learning_velocity', value: 5 },
      { questionId: 'C1', force: 'decision_quality_under_load', value: 5 },
      { questionId: 'C2', force: 'decision_quality_under_load', value: 5 },
      { questionId: 'D1', force: 'talent_gravity', value: 5 },
      { questionId: 'D2', force: 'talent_gravity', value: 5 },
      { questionId: 'E1', force: 'delivery_control', value: 5 },
      { questionId: 'E2', force: 'delivery_control', value: 5 },
      { questionId: 'F1', force: 'resilience_economics', value: 5 },
      { questionId: 'F2', force: 'resilience_economics', value: 5 },
    ];

    const result = calculateAssessmentScores(responses, completeQuestionMeta);
    expect(result.forceScores.thesis_integrity).toBe(100); // All perfect scores
    expect(result.overallScore).toBe(100);
  });
});

describe('Thesis Integrity Q1 - Option A Penalty (Narrative Protection)', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert' }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
  ]);

  it('should apply severe penalty for Option A even with high other scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // 0 (Option A)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(50); // (100 + 0) / 2 = 50
  });

  it('should show Option A creates significant score gap vs Option D', () => {
    const scoreWithA = normalizeThesisIntegrityQ1(0); // Option A
    const scoreWithD = normalizeThesisIntegrityQ1(3); // Option D
    const gap = scoreWithD - scoreWithA;

    expect(gap).toBe(100); // Maximum possible gap
  });
});

// ============================================================================
// THESIS INTEGRITY Q2 CUSTOM SCORING TESTS (Sanitation Overheard)
// ============================================================================

describe('Thesis Integrity Q2 - Base Scoring (Sanitation Overheard)', () => {
  it('should map Option A (0) to ~76 points (base impact: +10)', () => {
    expect(normalizeThesisIntegrityQ2(0)).toBeCloseTo(76.47, 1);
  });

  it('should map Option B (1) to 100 points (base impact: +18)', () => {
    expect(normalizeThesisIntegrityQ2(1)).toBe(100);
  });

  it('should map Option C (2) to ~82 points (base impact: +12)', () => {
    expect(normalizeThesisIntegrityQ2(2)).toBeCloseTo(82.35, 1);
  });

  it('should map Option D (3) to 0 points (base impact: -16)', () => {
    expect(normalizeThesisIntegrityQ2(3)).toBe(0);
  });

  it('should throw error for values < 0', () => {
    expect(() => normalizeThesisIntegrityQ2(-1)).toThrow('Invalid Thesis Integrity Q2 value');
  });

  it('should throw error for values > 3', () => {
    expect(() => normalizeThesisIntegrityQ2(4)).toThrow('Invalid Thesis Integrity Q2 value');
  });

  it('should maintain correct score ordering (D < A < C < B)', () => {
    const scoreD = normalizeThesisIntegrityQ2(3);
    const scoreA = normalizeThesisIntegrityQ2(0);
    const scoreC = normalizeThesisIntegrityQ2(2);
    const scoreB = normalizeThesisIntegrityQ2(1);

    expect(scoreD).toBeLessThan(scoreA);
    expect(scoreA).toBeLessThan(scoreC);
    expect(scoreC).toBeLessThan(scoreB);
  });

  it('should have Option B (diplomatic inquiry) as highest score', () => {
    const scores = [
      normalizeThesisIntegrityQ2(0), // A: silent exit
      normalizeThesisIntegrityQ2(1), // B: diplomatic
      normalizeThesisIntegrityQ2(2), // C: confrontation
      normalizeThesisIntegrityQ2(3), // D: rationalization
    ];

    const maxScore = Math.max(...scores);
    expect(maxScore).toBe(normalizeThesisIntegrityQ2(1)); // B is highest
  });

  it('should have Option D (rationalization) as lowest score', () => {
    const scores = [
      normalizeThesisIntegrityQ2(0), // A: silent exit
      normalizeThesisIntegrityQ2(1), // B: diplomatic
      normalizeThesisIntegrityQ2(2), // C: confrontation
      normalizeThesisIntegrityQ2(3), // D: rationalization
    ];

    const minScore = Math.min(...scores);
    expect(minScore).toBe(normalizeThesisIntegrityQ2(3)); // D is lowest
  });
});

describe('Thesis Integrity Q2 - Integration with Force Scoring', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['A_TI_Q2', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q2' }],
  ]);

  it('should correctly score force with Option A (silent exit)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 0 }, // ~76
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(92, 0); // (100 + 100 + 76) / 3 ≈ 92
  });

  it('should correctly score force with Option B (diplomatic - best)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 1 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100 + 100) / 3 = 100
  });

  it('should correctly score force with Option C (direct confrontation)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 2 }, // ~82
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(94, 0); // (100 + 100 + 82) / 3 ≈ 94
  });

  it('should correctly score force with Option D (rationalization - worst)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(67); // (100 + 100 + 0) / 3 = 66.67, rounds to 67
  });

  it('should handle Option D severely penalizing high likert scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeLessThan(70); // Strong penalty for rationalization
  });
});

describe('Thesis Integrity Q2 - Option Interpretation', () => {
  it('should show Option B (diplomatic) is preferred over Option C (confrontational)', () => {
    const scoreB = normalizeThesisIntegrityQ2(1); // Diplomatic
    const scoreC = normalizeThesisIntegrityQ2(2); // Confrontational

    expect(scoreB).toBeGreaterThan(scoreC);
  });

  it('should show Option A (silent exit) is better than Option D (rationalization)', () => {
    const scoreA = normalizeThesisIntegrityQ2(0); // Silent exit
    const scoreD = normalizeThesisIntegrityQ2(3); // Rationalization

    expect(scoreA).toBeGreaterThan(scoreD);
  });

  it('should show significant gap between best (B) and worst (D) options', () => {
    const scoreB = normalizeThesisIntegrityQ2(1); // Best
    const scoreD = normalizeThesisIntegrityQ2(3); // Worst
    const gap = scoreB - scoreD;

    expect(gap).toBe(100); // Maximum possible gap
  });

  it('should show Option C (confrontational) is slightly better than Option A (silent)', () => {
    const scoreC = normalizeThesisIntegrityQ2(2); // Confrontational
    const scoreA = normalizeThesisIntegrityQ2(0); // Silent exit

    expect(scoreC).toBeGreaterThan(scoreA);
  });
});

describe('Thesis Integrity Q2 - Combined with Q1', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert' }],
    ['A2', { type: 'likert' }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
    ['A_TI_Q2', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q2' }],
  ]);

  it('should correctly average both Q1 and Q2 with likert questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // Q1 Option D = 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 1 }, // Q2 Option B = 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // All perfect scores
  });

  it('should handle mixed performance across Q1 and Q2', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A2', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(25); // (50 + 50 + 0 + 0) / 4 = 25
  });
});

// ============================================================================
// THESIS INTEGRITY Q3 CUSTOM SCORING TESTS (Third-Party Landmine)
// ============================================================================

describe('Thesis Integrity Q3 - Base Scoring (Third-Party Landmine)', () => {
  it('should map Option A (0) to 0 points (base impact: -18, counterfactual fixation)', () => {
    expect(normalizeThesisIntegrityQ3(0)).toBe(0);
  });

  it('should map Option B (1) to 75 points (base impact: +12, execution focus)', () => {
    expect(normalizeThesisIntegrityQ3(1)).toBe(75);
  });

  it('should map Option C (2) to 100 points (base impact: +22, assumption re-examination)', () => {
    expect(normalizeThesisIntegrityQ3(2)).toBe(100);
  });

  it('should map Option D (3) to 20 points (base impact: -10, learning avoidance)', () => {
    expect(normalizeThesisIntegrityQ3(3)).toBe(20);
  });

  it('should throw error for values < 0', () => {
    expect(() => normalizeThesisIntegrityQ3(-1)).toThrow('Invalid Thesis Integrity Q3 value');
  });

  it('should throw error for values > 3', () => {
    expect(() => normalizeThesisIntegrityQ3(4)).toThrow('Invalid Thesis Integrity Q3 value');
  });

  it('should maintain correct score ordering (A < D < B < C)', () => {
    const scoreA = normalizeThesisIntegrityQ3(0);
    const scoreD = normalizeThesisIntegrityQ3(3);
    const scoreB = normalizeThesisIntegrityQ3(1);
    const scoreC = normalizeThesisIntegrityQ3(2);

    expect(scoreA).toBeLessThan(scoreD);
    expect(scoreD).toBeLessThan(scoreB);
    expect(scoreB).toBeLessThan(scoreC);
  });

  it('should have Option C (assumption re-examination) as highest score', () => {
    const scores = [
      normalizeThesisIntegrityQ3(0), // A: stay the course
      normalizeThesisIntegrityQ3(1), // B: execution focus
      normalizeThesisIntegrityQ3(2), // C: re-examine assumptions
      normalizeThesisIntegrityQ3(3), // D: move on
    ];

    const maxScore = Math.max(...scores);
    expect(maxScore).toBe(normalizeThesisIntegrityQ3(2)); // C is highest
  });

  it('should have Option A (counterfactual fixation) as lowest score', () => {
    const scores = [
      normalizeThesisIntegrityQ3(0), // A: stay the course
      normalizeThesisIntegrityQ3(1), // B: execution focus
      normalizeThesisIntegrityQ3(2), // C: re-examine assumptions
      normalizeThesisIntegrityQ3(3), // D: move on
    ];

    const minScore = Math.min(...scores);
    expect(minScore).toBe(normalizeThesisIntegrityQ3(0)); // A is lowest
  });
});

describe('Thesis Integrity Q3 - Integration with Force Scoring', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['A_TI_Q3', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q3' }],
  ]);

  it('should correctly score force with Option A (counterfactual fixation - worst)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(67); // (100 + 100 + 0) / 3 = 66.67, rounds to 67
  });

  it('should correctly score force with Option B (execution focus)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 1 }, // 75
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(92); // (100 + 100 + 75) / 3 = 91.67, rounds to 92
  });

  it('should correctly score force with Option C (assumption re-examination - best)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 2 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100 + 100) / 3 = 100
  });

  it('should correctly score force with Option D (learning avoidance)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 3 }, // 20
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(73); // (100 + 100 + 20) / 3 = 73.33, rounds to 73
  });

  it('should handle Option A severely penalizing high likert scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeLessThan(70); // Strong penalty for counterfactual fixation
  });
});

describe('Thesis Integrity Q3 - Option Interpretation', () => {
  it('should show Option C (re-examine assumptions) is best', () => {
    const scoreC = normalizeThesisIntegrityQ3(2);
    const scoreB = normalizeThesisIntegrityQ3(1);
    const scoreD = normalizeThesisIntegrityQ3(3);
    const scoreA = normalizeThesisIntegrityQ3(0);

    expect(scoreC).toBeGreaterThan(scoreB);
    expect(scoreC).toBeGreaterThan(scoreD);
    expect(scoreC).toBeGreaterThan(scoreA);
  });

  it('should show Option B (execution focus) is better than Option D (move on)', () => {
    const scoreB = normalizeThesisIntegrityQ3(1); // Execution focus
    const scoreD = normalizeThesisIntegrityQ3(3); // Move on

    expect(scoreB).toBeGreaterThan(scoreD);
  });

  it('should show Option D (learning avoidance) is better than Option A (stay course)', () => {
    const scoreD = normalizeThesisIntegrityQ3(3); // Move on
    const scoreA = normalizeThesisIntegrityQ3(0); // Stay course

    expect(scoreD).toBeGreaterThan(scoreA);
  });

  it('should show significant gap between best (C) and worst (A) options', () => {
    const scoreC = normalizeThesisIntegrityQ3(2); // Best
    const scoreA = normalizeThesisIntegrityQ3(0); // Worst
    const gap = scoreC - scoreA;

    expect(gap).toBe(100); // Maximum possible gap
  });

  it('should show Option C strongly preferred over execution-focused B', () => {
    const scoreC = normalizeThesisIntegrityQ3(2); // Re-examine assumptions
    const scoreB = normalizeThesisIntegrityQ3(1); // Execution focus
    const gap = scoreC - scoreB;

    expect(gap).toBe(25); // Significant 25-point gap
  });
});

describe('Thesis Integrity Q3 - Combined with Q1 and Q2', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert' }],
    ['A2', { type: 'likert' }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
    ['A_TI_Q2', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q2' }],
    ['A_TI_Q3', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q3' }],
  ]);

  it('should correctly average all three MC questions with likert questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // Q1 Option D = 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 1 }, // Q2 Option B = 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 2 }, // Q3 Option C = 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // All perfect scores
  });

  it('should handle mixed performance across all three MC questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A2', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(20); // (50 + 50 + 0 + 0 + 0) / 5 = 20
  });

  it('should handle worst options across all MC questions showing severe penalty', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0 (worst)
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0 (worst)
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0 (worst)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(40); // (100 + 100 + 0 + 0 + 0) / 5 = 40
  });
});

// ============================================================================
// THESIS INTEGRITY Q4 CUSTOM SCORING TESTS (Cofounder Disagreement)
// ============================================================================

describe('Thesis Integrity Q4 - Base Scoring (Cofounder Disagreement)', () => {
  it('should map Option A (0) to 0 points (base impact: -18, authority override)', () => {
    expect(normalizeThesisIntegrityQ4(0)).toBe(0);
  });

  it('should map Option B (1) to ~62 points (base impact: +8, table decision)', () => {
    expect(normalizeThesisIntegrityQ4(1)).toBeCloseTo(61.9, 1);
  });

  it('should map Option C (2) to 100 points (base impact: +24, evidence-based testing)', () => {
    expect(normalizeThesisIntegrityQ4(2)).toBe(100);
  });

  it('should map Option D (3) to ~19 points (base impact: -10, conflict avoidance)', () => {
    expect(normalizeThesisIntegrityQ4(3)).toBeCloseTo(19.05, 1);
  });

  it('should throw error for values < 0', () => {
    expect(() => normalizeThesisIntegrityQ4(-1)).toThrow('Invalid Thesis Integrity Q4 value');
  });

  it('should throw error for values > 3', () => {
    expect(() => normalizeThesisIntegrityQ4(4)).toThrow('Invalid Thesis Integrity Q4 value');
  });

  it('should maintain correct score ordering (A < D < B < C)', () => {
    const scoreA = normalizeThesisIntegrityQ4(0);
    const scoreD = normalizeThesisIntegrityQ4(3);
    const scoreB = normalizeThesisIntegrityQ4(1);
    const scoreC = normalizeThesisIntegrityQ4(2);

    expect(scoreA).toBeLessThan(scoreD);
    expect(scoreD).toBeLessThan(scoreB);
    expect(scoreB).toBeLessThan(scoreC);
  });

  it('should have Option C (evidence-based testing) as highest score', () => {
    const scores = [
      normalizeThesisIntegrityQ4(0), // A: authority override
      normalizeThesisIntegrityQ4(1), // B: table decision
      normalizeThesisIntegrityQ4(2), // C: evidence-based testing
      normalizeThesisIntegrityQ4(3), // D: conflict avoidance
    ];

    const maxScore = Math.max(...scores);
    expect(maxScore).toBe(normalizeThesisIntegrityQ4(2)); // C is highest
  });

  it('should have Option A (authority override) as lowest score', () => {
    const scores = [
      normalizeThesisIntegrityQ4(0), // A: authority override
      normalizeThesisIntegrityQ4(1), // B: table decision
      normalizeThesisIntegrityQ4(2), // C: evidence-based testing
      normalizeThesisIntegrityQ4(3), // D: conflict avoidance
    ];

    const minScore = Math.min(...scores);
    expect(minScore).toBe(normalizeThesisIntegrityQ4(0)); // A is lowest
  });
});

describe('Thesis Integrity Q4 - Integration with Force Scoring', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['A_TI_Q4', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q4' }],
  ]);

  it('should correctly score force with Option A (authority override - worst)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(67); // (100 + 100 + 0) / 3 = 66.67, rounds to 67
  });

  it('should correctly score force with Option B (table decision)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 1 }, // ~62
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(87, 0); // (100 + 100 + 62) / 3 ≈ 87
  });

  it('should correctly score force with Option C (evidence-based testing - best)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 2 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100 + 100) / 3 = 100
  });

  it('should correctly score force with Option D (conflict avoidance)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 3 }, // ~19
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(73, 0); // (100 + 100 + 19) / 3 ≈ 73
  });

  it('should handle Option A severely penalizing high likert scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeLessThan(70); // Strong penalty for authority override
  });
});

describe('Thesis Integrity Q4 - Option Interpretation', () => {
  it('should show Option C (evidence-based testing) is best', () => {
    const scoreC = normalizeThesisIntegrityQ4(2);
    const scoreB = normalizeThesisIntegrityQ4(1);
    const scoreD = normalizeThesisIntegrityQ4(3);
    const scoreA = normalizeThesisIntegrityQ4(0);

    expect(scoreC).toBeGreaterThan(scoreB);
    expect(scoreC).toBeGreaterThan(scoreD);
    expect(scoreC).toBeGreaterThan(scoreA);
  });

  it('should show Option B (table decision) is better than Option D (conflict avoidance)', () => {
    const scoreB = normalizeThesisIntegrityQ4(1); // Table decision
    const scoreD = normalizeThesisIntegrityQ4(3); // Conflict avoidance

    expect(scoreB).toBeGreaterThan(scoreD);
  });

  it('should show Option D (conflict avoidance) is better than Option A (authority override)', () => {
    const scoreD = normalizeThesisIntegrityQ4(3); // Conflict avoidance
    const scoreA = normalizeThesisIntegrityQ4(0); // Authority override

    expect(scoreD).toBeGreaterThan(scoreA);
  });

  it('should show significant gap between best (C) and worst (A) options', () => {
    const scoreC = normalizeThesisIntegrityQ4(2); // Best
    const scoreA = normalizeThesisIntegrityQ4(0); // Worst
    const gap = scoreC - scoreA;

    expect(gap).toBe(100); // Maximum possible gap
  });

  it('should show Option C strongly preferred over passive Option B', () => {
    const scoreC = normalizeThesisIntegrityQ4(2); // Evidence-based testing
    const scoreB = normalizeThesisIntegrityQ4(1); // Table decision
    const gap = scoreC - scoreB;

    expect(gap).toBeCloseTo(38.1, 1); // Significant gap (~38 points)
  });
});

describe('Thesis Integrity Q4 - Combined with Q1, Q2, and Q3', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert' }],
    ['A2', { type: 'likert' }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
    ['A_TI_Q2', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q2' }],
    ['A_TI_Q3', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q3' }],
    ['A_TI_Q4', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q4' }],
  ]);

  it('should correctly average all four MC questions with likert questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // Q1 Option D = 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 1 }, // Q2 Option B = 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 2 }, // Q3 Option C = 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 2 }, // Q4 Option C = 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // All perfect scores
  });

  it('should handle mixed performance across all four MC questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A2', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // Q4 Option A = 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(17); // (50 + 50 + 0 + 0 + 0 + 0) / 6 = 16.67, rounds to 17
  });

  it('should handle worst options across all four MC questions showing severe penalty', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0 (worst)
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0 (worst)
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0 (worst)
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // Q4 Option A = 0 (worst)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(33); // (100 + 100 + 0 + 0 + 0 + 0) / 6 = 33.33, rounds to 33
  });
});

// ============================================================================
// THESIS INTEGRITY Q5 CUSTOM SCORING TESTS (Public Commitment)
// ============================================================================

describe('Thesis Integrity Q5 - Base Scoring (Public Commitment)', () => {
  it('should map Option A (0) to 100 points (base impact: +26, pause and re-evaluate)', () => {
    expect(normalizeThesisIntegrityQ5(0)).toBe(100);
  });

  it('should map Option B (1) to 0 points (base impact: -26, hubris override)', () => {
    expect(normalizeThesisIntegrityQ5(1)).toBe(0);
  });

  it('should map Option C (2) to ~69 points (base impact: +10, narrow scope)', () => {
    expect(normalizeThesisIntegrityQ5(2)).toBeCloseTo(69.23, 1);
  });

  it('should map Option D (3) to ~27 points (base impact: -12, romantic persistence)', () => {
    expect(normalizeThesisIntegrityQ5(3)).toBeCloseTo(26.92, 1);
  });

  it('should throw error for values < 0', () => {
    expect(() => normalizeThesisIntegrityQ5(-1)).toThrow('Invalid Thesis Integrity Q5 value');
  });

  it('should throw error for values > 3', () => {
    expect(() => normalizeThesisIntegrityQ5(4)).toThrow('Invalid Thesis Integrity Q5 value');
  });

  it('should maintain correct score ordering (B < D < C < A)', () => {
    const scoreB = normalizeThesisIntegrityQ5(1);
    const scoreD = normalizeThesisIntegrityQ5(3);
    const scoreC = normalizeThesisIntegrityQ5(2);
    const scoreA = normalizeThesisIntegrityQ5(0);

    expect(scoreB).toBeLessThan(scoreD);
    expect(scoreD).toBeLessThan(scoreC);
    expect(scoreC).toBeLessThan(scoreA);
  });

  it('should have Option A (pause and re-evaluate) as highest score', () => {
    const scores = [
      normalizeThesisIntegrityQ5(0), // A: pause and re-evaluate
      normalizeThesisIntegrityQ5(1), // B: push forward aggressively
      normalizeThesisIntegrityQ5(2), // C: narrow scope
      normalizeThesisIntegrityQ5(3), // D: stay the course
    ];

    const maxScore = Math.max(...scores);
    expect(maxScore).toBe(normalizeThesisIntegrityQ5(0)); // A is highest
  });

  it('should have Option B (hubris override) as lowest score', () => {
    const scores = [
      normalizeThesisIntegrityQ5(0), // A: pause and re-evaluate
      normalizeThesisIntegrityQ5(1), // B: push forward aggressively
      normalizeThesisIntegrityQ5(2), // C: narrow scope
      normalizeThesisIntegrityQ5(3), // D: stay the course
    ];

    const minScore = Math.min(...scores);
    expect(minScore).toBe(normalizeThesisIntegrityQ5(1)); // B is lowest
  });
});

describe('Thesis Integrity Q5 - Integration with Force Scoring', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert', reverse_scored: false }],
    ['A2', { type: 'likert', reverse_scored: false }],
    ['A_TI_Q5', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q5' }],
  ]);

  it('should correctly score force with Option A (pause and re-evaluate - best)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 0 }, // 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // (100 + 100 + 100) / 3 = 100
  });

  it('should correctly score force with Option B (hubris override - worst)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 1 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(67); // (100 + 100 + 0) / 3 = 66.67, rounds to 67
  });

  it('should correctly score force with Option C (narrow scope)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 2 }, // ~69
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(90, 0); // (100 + 100 + 69) / 3 ≈ 90
  });

  it('should correctly score force with Option D (romantic persistence)', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 3 }, // ~27
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeCloseTo(76, 0); // (100 + 100 + 27) / 3 ≈ 76
  });

  it('should handle Option B severely penalizing high likert scores', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 1 }, // 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBeLessThan(70); // Strong penalty for hubris override
  });
});

describe('Thesis Integrity Q5 - Option Interpretation', () => {
  it('should show Option A (pause and re-evaluate) is best', () => {
    const scoreA = normalizeThesisIntegrityQ5(0);
    const scoreB = normalizeThesisIntegrityQ5(1);
    const scoreC = normalizeThesisIntegrityQ5(2);
    const scoreD = normalizeThesisIntegrityQ5(3);

    expect(scoreA).toBeGreaterThan(scoreB);
    expect(scoreA).toBeGreaterThan(scoreC);
    expect(scoreA).toBeGreaterThan(scoreD);
  });

  it('should show Option C (narrow scope) is better than Option D (stay course)', () => {
    const scoreC = normalizeThesisIntegrityQ5(2); // Narrow scope
    const scoreD = normalizeThesisIntegrityQ5(3); // Stay course

    expect(scoreC).toBeGreaterThan(scoreD);
  });

  it('should show Option D (romantic persistence) is better than Option B (hubris)', () => {
    const scoreD = normalizeThesisIntegrityQ5(3); // Romantic persistence
    const scoreB = normalizeThesisIntegrityQ5(1); // Hubris override

    expect(scoreD).toBeGreaterThan(scoreB);
  });

  it('should show significant gap between best (A) and worst (B) options', () => {
    const scoreA = normalizeThesisIntegrityQ5(0); // Best
    const scoreB = normalizeThesisIntegrityQ5(1); // Worst
    const gap = scoreA - scoreB;

    expect(gap).toBe(100); // Maximum possible gap
  });

  it('should show Option A strongly preferred over pragmatic Option C', () => {
    const scoreA = normalizeThesisIntegrityQ5(0); // Pause and re-evaluate
    const scoreC = normalizeThesisIntegrityQ5(2); // Narrow scope
    const gap = scoreA - scoreC;

    expect(gap).toBeCloseTo(30.77, 1); // Significant gap (~31 points)
  });
});

describe('Thesis Integrity Q5 - Combined with Q1, Q2, Q3, and Q4', () => {
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>([
    ['A1', { type: 'likert' }],
    ['A2', { type: 'likert' }],
    ['A_FINAL', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q1' }],
    ['A_TI_Q2', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q2' }],
    ['A_TI_Q3', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q3' }],
    ['A_TI_Q4', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q4' }],
    ['A_TI_Q5', { type: 'multiple-choice', custom_scoring: 'thesis_integrity_q5' }],
  ]);

  it('should correctly average all five MC questions with likert questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 3 }, // Q1 Option D = 100
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 1 }, // Q2 Option B = 100
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 2 }, // Q3 Option C = 100
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 2 }, // Q4 Option C = 100
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 0 }, // Q5 Option A = 100
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(100); // All perfect scores
  });

  it('should handle mixed performance across all five MC questions', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A2', force: 'thesis_integrity', value: 3 }, // 50
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // Q4 Option A = 0
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 1 }, // Q5 Option B = 0
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(14); // (50 + 50 + 0 + 0 + 0 + 0 + 0) / 7 = 14.29, rounds to 14
  });

  it('should handle worst options across all five MC questions showing severe penalty', () => {
    const responses: QuestionResponse[] = [
      { questionId: 'A1', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A2', force: 'thesis_integrity', value: 5 }, // 100
      { questionId: 'A_FINAL', force: 'thesis_integrity', value: 0 }, // Q1 Option A = 0 (worst)
      { questionId: 'A_TI_Q2', force: 'thesis_integrity', value: 3 }, // Q2 Option D = 0 (worst)
      { questionId: 'A_TI_Q3', force: 'thesis_integrity', value: 0 }, // Q3 Option A = 0 (worst)
      { questionId: 'A_TI_Q4', force: 'thesis_integrity', value: 0 }, // Q4 Option A = 0 (worst)
      { questionId: 'A_TI_Q5', force: 'thesis_integrity', value: 1 }, // Q5 Option B = 0 (worst)
    ];

    const score = calculateForceScore(responses, 'thesis_integrity', questionMeta);
    expect(score).toBe(29); // (100 + 100 + 0 + 0 + 0 + 0 + 0) / 7 = 28.57, rounds to 29
  });
});

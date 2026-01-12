/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * Question Bank
 *
 * NOTE: Questions will be provided by the product team.
 * This file contains placeholder structure only.
 */

import type { Question, ExecutionForce } from '@/types';

// ============================================================================
// PLACEHOLDER QUESTIONS
// ============================================================================

/**
 * IMPORTANT: These are placeholder questions only.
 * The actual questions mapping old personality traits to the new
 * 6 Execution Forces will be provided by the product team.
 *
 * When real questions arrive, replace this entire array.
 */
export const questions: Question[] = [
  // Questions FULLY RANDOMIZED to prevent pattern recognition and gaming
  // Paired questions (a/b) are separated to prevent back-to-back similar questions
  // Each "a" question is reverse-scored to prevent "always select 5" gaming

  // C1b
  {
    id: 'C1b',
    force: 'decision_quality_under_load' as ExecutionForce,
    text: 'Under time pressure, I delay decisions if acting too early risks compounding mistakes.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // F1a (reverse scored)
  {
    id: 'F1a',
    force: 'resilience_economics' as ExecutionForce,
    text: 'During prolonged stress, I push through and deal with recovery later.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // A2b
  {
    id: 'A2b',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // D1a (reverse scored)
  {
    id: 'D1a',
    force: 'talent_gravity' as ExecutionForce,
    text: 'When strong candidates hesitate to join, I assume they don\'t yet see the upside or vision.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // B2b
  {
    id: 'B2b',
    force: 'learning_velocity' as ExecutionForce,
    text: 'When something isn\'t working, I launch experiments immediately and learn by doing.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // E1a (reverse scored)
  {
    id: 'E1a',
    force: 'delivery_control' as ExecutionForce,
    text: 'When deadlines slip, it\'s usually because the bar for quality changed.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // A1b
  {
    id: 'A1b',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // D2a (reverse scored)
  {
    id: 'D2a',
    force: 'talent_gravity' as ExecutionForce,
    text: 'When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // F2b
  {
    id: 'F2b',
    force: 'resilience_economics' as ExecutionForce,
    text: 'After a significant setback, I deliberately slow down to extract lessons.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // B1a (reverse scored)
  {
    id: 'B1a',
    force: 'learning_velocity' as ExecutionForce,
    text: 'After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // C2b
  {
    id: 'C2b',
    force: 'decision_quality_under_load' as ExecutionForce,
    text: 'When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // E2a (reverse scored)
  {
    id: 'E2a',
    force: 'delivery_control' as ExecutionForce,
    text: 'I prefer execution systems that stay lightweight and flexible.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // A2a (reverse scored)
  {
    id: 'A2a',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'When explaining why my company will succeed, I emphasize conviction in the insight and vision.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // D1b
  {
    id: 'D1b',
    force: 'talent_gravity' as ExecutionForce,
    text: 'When strong candidates hesitate to join, I assume I haven\'t created enough clarity or trust.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // F1b
  {
    id: 'F1b',
    force: 'resilience_economics' as ExecutionForce,
    text: 'During prolonged stress, I adjust pace early to preserve long-term stamina.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // C1a (reverse scored)
  {
    id: 'C1a',
    force: 'decision_quality_under_load' as ExecutionForce,
    text: 'Under time pressure, I make a call quickly to preserve momentum.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // B1b
  {
    id: 'B1b',
    force: 'learning_velocity' as ExecutionForce,
    text: 'After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // E2b
  {
    id: 'E2b',
    force: 'delivery_control' as ExecutionForce,
    text: 'I prefer execution systems that enforce discipline and accountability.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // A1a (reverse scored)
  {
    id: 'A1a',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'When evidence challenges my core assumptions, I defend the original explanation unless the contradiction is overwhelming.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // F2a (reverse scored)
  {
    id: 'F2a',
    force: 'resilience_economics' as ExecutionForce,
    text: 'After a significant setback, I refocus immediately on the next objective.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // C2a (reverse scored)
  {
    id: 'C2a',
    force: 'decision_quality_under_load' as ExecutionForce,
    text: 'When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // D2b
  {
    id: 'D2b',
    force: 'talent_gravity' as ExecutionForce,
    text: 'When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // B2a (reverse scored)
  {
    id: 'B2a',
    force: 'learning_velocity' as ExecutionForce,
    text: 'When something isn\'t working, I spend time diagnosing the root cause before acting.',
    type: 'likert',
    reverse_scored: true,
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // E1b
  {
    id: 'E1b',
    force: 'delivery_control' as ExecutionForce,
    text: 'When deadlines slip, it\'s usually because the original plan underestimated complexity.',
    type: 'likert',
    options: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
  },

  // Force A (Final): Thesis Integrity - High-Stakes Anomaly Response
  // Placed at END of assessment for fatigue leverage (intentional)
  // See /specs/thesis_integrity_q1.md for canonical scoring specification
  // Options shuffled to prevent positional gaming
  {
    id: 'A_FINAL',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'You\'re involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don\'t fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?',
    type: 'multiple-choice',
    options: [
      { text: 'Continue testing without changing the explanation yet. It\'s too early to revise until the signal is clearer.', value: 0 },
      { text: 'Actively explore alternative explanations that could better account for both the original results and the anomalies.', value: 1 },
      { text: 'Reframe how the edge cases are interpreted. Early breakthroughs often produce messy data, and the core explanation still holds.', value: 2 },
      { text: 'Adjust the explanation to account for the edge cases, even if it becomes less elegant or cohesive.', value: 3 },
    ],
    custom_scoring: 'thesis_integrity_q1',
  },

  // Force A: Thesis Integrity Q2 - Sanitation Overheard
  // Multiple-choice question testing response to overheard safety compromise
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q2',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'You go to the same café weekly. Today you overhear the barista tell a coworker, "We\'re supposed to sanitize the milk wand between drinks… but when it\'s busy, nobody does." You already drank half your latte.\n\nWhat do you do?',
    type: 'multiple-choice',
    options: [
      { text: 'Assume it was exaggerated. Finish the drink and continue as normal.', value: 0 },
      { text: 'Say nothing today. Mentally note it and stop coming back.', value: 1 },
      { text: 'Mention what you overheard and ask them to sanitize everything now, even if it slows the line.', value: 2 },
      { text: 'Calmly ask the barista/manager what their sanitation process is, without mentioning what you overheard.', value: 3 },
    ],
    custom_scoring: 'thesis_integrity_q2',
  },

  // Force A: Thesis Integrity Q3 - Third-Party Landmine
  // Multiple-choice question testing retrospective analysis and learning from failure
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q3',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?',
    type: 'multiple-choice',
    options: [
      { text: 'Improve execution speed and marketing so the product\'s value becomes clearer.', value: 0 },
      { text: 'Accept failure as part of innovation and move on to the next opportunity.', value: 1 },
      { text: 'Stay the course longer. Breakthrough products often fail before the market catches up.', value: 2 },
      { text: 'Re-examine assumptions about user readiness and adjust scope earlier.', value: 3 },
    ],
    custom_scoring: 'thesis_integrity_q3',
  },

  // Force A: Thesis Integrity Q4 - Cofounder Disagreement
  // Multiple-choice question testing conflict resolution and evidence-based decision making
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q4',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?',
    type: 'multiple-choice',
    options: [
      { text: 'Table the decision until clearer data emerges.', value: 0 },
      { text: 'Defer to your cofounder to preserve trust and avoid conflict.', value: 1 },
      { text: 'Push forward with your approach. Momentum matters more than perfect certainty.', value: 2 },
      { text: 'Define what evidence would change each of your minds, run a fast test, and commit to updating the decision.', value: 3 },
    ],
    custom_scoring: 'thesis_integrity_q4',
  },

  // Force A: Thesis Integrity Q5 - Public Commitment
  // Multiple-choice question testing public commitment bias and ego cost fallacy
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q5',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'You\'ve publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?',
    type: 'multiple-choice',
    options: [
      { text: 'Narrow the scope and reposition publicly while continuing development privately.', value: 0 },
      { text: 'Stay the course. The vision is sound, and breakthroughs often look wrong before they look right.', value: 1 },
      { text: 'Push forward aggressively. Walking back now would damage credibility more than being wrong later.', value: 2 },
      { text: 'Pause further investment, re-evaluate the core assumption, and prepare to abandon the direction if evidence continues to weaken.', value: 3 },
    ],
    custom_scoring: 'thesis_integrity_q5',
  },

  // Force A: Thesis Integrity Q6 - The Lesson That Didn't Stick
  // Multiple-choice question with demographic scaling
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q6',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'A founder you know built a startup that failed after raising meaningful capital. They\'re starting a new company in the same general space and say: "This time I\'ll execute better. The idea was right." They ask you what they should do differently before committing fully again.',
    type: 'multiple-choice',
    options: [
      { id: 'D', label: 'If conviction remains, commit', text: 'If conviction remains, commit fully — overcorrecting risks diluting the vision.', value: 0, points: 0 },
      { id: 'C', label: 'Move faster this time', text: 'Move faster this time — hesitation likely slowed momentum before.', value: 1, points: 18 },
      { id: 'B', label: 'Bring in stronger operators', text: 'Bring in stronger operators earlier so past execution gaps don\'t repeat.', value: 2, points: 72 },
      { id: 'A', label: 'Pressure-test whether the original', text: 'Pressure-test whether the original idea actually failed, or whether execution masked a deeper flaw.', value: 3, points: 100 },
    ],
    custom_scoring: 'thesis_integrity_q6',
  },

  // Force A: Thesis Integrity Q7 - The Narrative Lock-In
  // Multiple-choice question with demographic scaling
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q7',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You\'re deciding how to handle internal discussions.',
    type: 'multiple-choice',
    options: [
      { id: 'A', label: 'Keep the narrative stable', text: 'Keep the narrative stable externally while quietly testing alternative explanations internally.', value: 0, points: 81 },
      { id: 'C', label: 'Reinforce the story internally', text: 'Reinforce the story internally to maintain alignment and morale.', value: 1, points: 0 },
      { id: 'D', label: 'Pause internal debate until', text: 'Pause internal debate until clearer contradictions emerge.', value: 2, points: 44 },
      { id: 'B', label: 'Encourage internal debate that', text: 'Encourage internal debate that could destabilize the story if needed.', value: 3, points: 100 },
    ],
    custom_scoring: 'thesis_integrity_q7',
  },

  // Force A: Thesis Integrity Q8 - Being Right vs Being Early
  // Multiple-choice question with demographic scaling
  // Options shuffled to prevent positional gaming
  {
    id: 'A_TI_Q8',
    force: 'thesis_integrity' as ExecutionForce,
    text: 'You\'re confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.',
    type: 'multiple-choice',
    options: [
      { id: 'C', label: 'If the thesis is', text: 'If the thesis is correct, timing issues can be managed.', value: 0, points: 27 },
      { id: 'B', label: 'Endurance matters — timing', text: 'Endurance matters — timing often rewards those who persist.', value: 1, points: 61 },
      { id: 'D', label: 'Market resistance usually reflects', text: 'Market resistance usually reflects misunderstanding, not readiness.', value: 2, points: 0 },
      { id: 'A', label: 'Being early is effectively', text: 'Being early is effectively being wrong until conditions change.', value: 3, points: 100 },
    ],
    custom_scoring: 'thesis_integrity_q8',
  },
];

// ============================================================================
// QUESTION METADATA
// ============================================================================

/**
 * Total number of questions in the assessment
 */
export const TOTAL_QUESTIONS = questions.length;

/**
 * Map of question IDs to question types
 * Used for scoring calculations
 */
export const questionTypes = new Map(
  questions.map((q) => [q.id, q.type])
);

/**
 * Questions grouped by force
 */
export const questionsByForce = questions.reduce((acc, question) => {
  if (!acc[question.force]) {
    acc[question.force] = [];
  }
  acc[question.force].push(question);
  return acc;
}, {} as Record<ExecutionForce, Question[]>);

/**
 * Get question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/**
 * Get question index by ID
 */
export function getQuestionIndex(id: string): number {
  return questions.findIndex((q) => q.id === id);
}

/**
 * Get force question count
 */
export function getForceQuestionCount(force: ExecutionForce): number {
  return questions.filter((q) => q.force === force).length;
}

/**
 * Export uppercase alias for compatibility
 */
export const QUESTIONS = questions;

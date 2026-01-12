/**
 * FounderFit Score v2.1: Demographics Collection
 * Demographics drive weighting of execution forces, NOT direct score adjustments
 */

// ============================================================================
// DEMOGRAPHIC TYPES
// ============================================================================

export type CofounderCount = 'solo' | 'two' | 'three' | 'four_plus';
export type AgeBracket =
  | 'under_25'
  | '25_29'
  | '30_34'
  | '35_39'
  | '40_44'
  | '45_49'
  | '50_54'
  | '55_59'
  | '60_plus';
export type IndustryExperience = '0_1' | '2_3' | '4_6' | '7_10' | '11_plus';
export type PriorStartups = '0' | '1' | '2' | '3_plus';
export type PriorExits = '0' | '1' | '2_plus';

export interface DemographicAnswers {
  cofounder_count: CofounderCount;
  age_bracket: AgeBracket;
  industry_experience: IndustryExperience;
  prior_startups: PriorStartups;
  prior_exits: PriorExits;
}

export interface DemographicProfile {
  cofounderBucket: 'solo' | 'two_three' | 'four_plus';
  hasIndustryExperience: boolean; // >= 4 years
  hasSuccessfulExits: boolean; // >= 1 exit
  ageBracket: AgeBracket;
  priorStartups: PriorStartups;
}

// ============================================================================
// DEMOGRAPHIC QUESTIONS
// ============================================================================

export interface DemographicQuestion {
  id: keyof DemographicAnswers;
  label: string;
  helperText?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const DEMOGRAPHIC_QUESTIONS: DemographicQuestion[] = [
  {
    id: 'cofounder_count',
    label: 'How many co-founders are on your founding team?',
    helperText: 'Include yourself. Count co-founders only, not total headcount.',
    options: [
      { value: 'solo', label: 'Solo founder (just me)' },
      { value: 'two', label: 'Two founders (2 people)' },
      { value: 'three', label: 'Three founders (3 people)' },
      { value: 'four_plus', label: 'Four or more founders (4+)' },
    ],
  },
  {
    id: 'age_bracket',
    label: 'What is your age?',
    options: [
      { value: 'under_25', label: 'Under 25' },
      { value: '25_29', label: '25-29' },
      { value: '30_34', label: '30-34' },
      { value: '35_39', label: '35-39' },
      { value: '40_44', label: '40-44' },
      { value: '45_49', label: '45-49' },
      { value: '50_54', label: '50-54' },
      { value: '55_59', label: '55-59' },
      { value: '60_plus', label: '60+' },
    ],
  },
  {
    id: 'industry_experience',
    label: 'How many years of relevant industry experience do you have?',
    helperText: 'Experience in the industry your venture operates in.',
    options: [
      { value: '0_1', label: '0-1 years' },
      { value: '2_3', label: '2-3 years' },
      { value: '4_6', label: '4-6 years' },
      { value: '7_10', label: '7-10 years' },
      { value: '11_plus', label: '11+ years' },
    ],
  },
  {
    id: 'prior_startups',
    label: 'How many startups have you previously founded?',
    helperText: 'Not including your current venture.',
    options: [
      { value: '0', label: 'None' },
      { value: '1', label: '1 startup' },
      { value: '2', label: '2 startups' },
      { value: '3_plus', label: '3 or more startups' },
    ],
  },
  {
    id: 'prior_exits',
    label: 'How many successful exits have you had?',
    helperText: 'Acquisition or IPO. Not including ongoing ventures.',
    options: [
      { value: '0', label: 'None' },
      { value: '1', label: '1 successful exit' },
      { value: '2_plus', label: '2 or more successful exits' },
    ],
  },
];

// ============================================================================
// VALIDATION
// ============================================================================

export function validateDemographicAnswers(
  answers: Partial<DemographicAnswers>
): answers is DemographicAnswers {
  return !!(
    answers.cofounder_count &&
    answers.age_bracket &&
    answers.industry_experience &&
    answers.prior_startups &&
    answers.prior_exits
  );
}

// ============================================================================
// PROFILE BUILDER
// ============================================================================

/**
 * Build a demographic profile from raw answers
 * This profile is used for weighting and narrative generation
 */
export function buildDemographicProfile(
  answers: DemographicAnswers
): DemographicProfile {
  // Determine cofounder bucket
  const cofounderBucket =
    answers.cofounder_count === 'solo'
      ? 'solo'
      : answers.cofounder_count === 'four_plus'
      ? 'four_plus'
      : 'two_three';

  // Has meaningful industry experience? (4+ years)
  const hasIndustryExperience =
    answers.industry_experience === '4_6' ||
    answers.industry_experience === '7_10' ||
    answers.industry_experience === '11_plus';

  // Has successful exits? (1+)
  const hasSuccessfulExits =
    answers.prior_exits === '1' || answers.prior_exits === '2_plus';

  return {
    cofounderBucket,
    hasIndustryExperience,
    hasSuccessfulExits,
    ageBracket: answers.age_bracket,
    priorStartups: answers.prior_startups,
  };
}

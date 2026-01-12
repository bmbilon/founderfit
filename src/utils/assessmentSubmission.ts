/**
 * FounderFit Score v2.1: Assessment Submission
 * Handles scoring calculation and database persistence
 */

import { supabase } from '@/lib/supabase';
import { QUESTIONS } from '@/data/questions';
import type { DemographicAnswers } from '@/data/demographics';
import { validateDemographicAnswers } from '@/data/demographics';
import type { QuestionResponse, QuestionType } from '@/types/assessment.types';
import { calculateAllForceScores, calculateOverallScore, calculateSignalIntegrity } from './scoring';
import { buildWeightProfileSnapshot } from './weighting';

const SURVEY_STORAGE_KEY = 'founderfit:survey:draft:v2.1';
const DEMOGRAPHICS_STORAGE_KEY = 'founderfit:demographics:draft:v2.1';
const SURVEY_START_KEY = 'founderfit:survey:startedAt:v2.1';

/**
 * Get the founder profile ID from the authenticated user
 *
 * CRITICAL RULE: auth.users.id NEVER goes into assessments
 *                founders.id ALWAYS goes into assessments.founder_id
 *
 * This function performs the "supa scoop":
 * 1. Get authenticated user (auth.users.id)
 * 2. Fetch founder profile (founders table where auth_user_id = user.id)
 * 3. Return founder.id (the ONLY ID we use for assessments)
 *
 * @throws {Error} If not authenticated or founder profile doesn't exist
 * @returns {string} founders.id (NOT auth.users.id)
 */
async function getFounderProfileIdOrThrow(): Promise<string> {
  // Step 1: Get auth user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('No authenticated user');
  }

  // Step 2: Fetch founder profile (this is the scoop)
  const { data: founderData, error: founderError } = await supabase
    .from('founders')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (founderError || !founderData) {
    throw new Error('Founder profile not found');
  }

  // Step 3: Return founder.id (the ONLY ID we care about)
  return (founderData as { id: string }).id;
}

/**
 * Load survey responses from localStorage
 */
export function loadSurveyResponses(): Record<string, number> {
  try {
    console.log('[loadSurveyResponses] Reading from key:', SURVEY_STORAGE_KEY);
    const raw = localStorage.getItem(SURVEY_STORAGE_KEY);
    console.log('[loadSurveyResponses] Raw data:', raw ? `${raw.substring(0, 100)}...` : 'null');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    console.log('[loadSurveyResponses] Parsed data keys:', Object.keys(parsed));
    return parsed;
  } catch (error) {
    console.error('[loadSurveyResponses] Error loading responses:', error);
    return {};
  }
}

/**
 * Load demographic data from localStorage
 */
export function loadDemographicData(): DemographicAnswers | null {
  try {
    const raw = localStorage.getItem(DEMOGRAPHICS_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);

    // Validate using the new validation function
    if (validateDemographicAnswers(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get survey start time from localStorage
 */
export function getSurveyStartTime(): Date | null {
  try {
    const raw = localStorage.getItem(SURVEY_START_KEY);
    if (!raw) return null;
    return new Date(raw);
  } catch {
    return null;
  }
}

/**
 * Calculate duration in seconds between start time and now
 */
export function calculateDuration(startedAt: Date): number {
  const now = new Date();
  return Math.round((now.getTime() - startedAt.getTime()) / 1000);
}

/**
 * Convert localStorage responses to structured QuestionResponse objects
 * Skips any responses with question IDs that don't exist in current question set
 * (This handles migration from old question IDs to new ones)
 */
export function convertResponsesToStructured(
  responses: Record<string, number>
): QuestionResponse[] {
  const structured: QuestionResponse[] = [];
  const skipped: string[] = [];

  for (const [questionId, value] of Object.entries(responses)) {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      console.warn(`[convertResponsesToStructured] Skipping unknown question ID: ${questionId}`);
      skipped.push(questionId);
      continue;
    }
    structured.push({
      questionId,
      force: question.force,
      value,
    });
  }

  if (skipped.length > 0) {
    console.warn(`[convertResponsesToStructured] Skipped ${skipped.length} responses with unknown IDs:`, skipped);
  }

  return structured;
}

/**
 * Submit completed assessment to Supabase
 * Returns assessment ID on success
 * Automatically resolves founder ID from authenticated user
 */
export async function submitAssessment(
  ventureId?: string
): Promise<{ assessmentId: string; overallScore: number }> {
  console.log('[submitAssessment] Starting submission...', { ventureId });

  // Resolve founder ID from authenticated user (the "supa scoop")
  // ✅ This returns founders.id (NOT auth.users.id)
  const founderId = await getFounderProfileIdOrThrow();
  console.log('[submitAssessment] Resolved founder.id:', founderId);

  // Load data from localStorage
  const rawResponses = loadSurveyResponses();
  console.log('[submitAssessment] Loaded raw responses:', {
    count: Object.keys(rawResponses).length,
    keys: Object.keys(rawResponses),
  });

  const demographics = loadDemographicData();
  console.log('[submitAssessment] Loaded demographics:', demographics);

  const startedAt = getSurveyStartTime();
  console.log('[submitAssessment] Survey start time:', startedAt);

  // Validate we have responses
  if (Object.keys(rawResponses).length === 0) {
    console.error('[submitAssessment] ERROR: No survey responses found in localStorage');
    throw new Error('No survey responses found');
  }

  // Convert to structured format
  console.log('[submitAssessment] Converting responses to structured format...');
  const responses = convertResponsesToStructured(rawResponses);
  console.log('[submitAssessment] Structured responses:', { count: responses.length });

  // Build question metadata map
  const questionMeta = new Map<string, { type: QuestionType; reverse_scored?: boolean; custom_scoring?: string }>();
  QUESTIONS.forEach((q) => {
    questionMeta.set(q.id, {
      type: q.type,
      reverse_scored: q.reverse_scored,
      custom_scoring: q.custom_scoring,
    });
  });
  console.log('[submitAssessment] Built question metadata map:', { size: questionMeta.size });

  // Calculate execution force scores
  console.log('[submitAssessment] Calculating force scores...');
  const forceScores = calculateAllForceScores(responses, questionMeta);
  console.log('[submitAssessment] Force scores calculated:', forceScores);

  // Calculate overall score using demographic weights (if available)
  console.log('[submitAssessment] Calculating overall score...');
  const overallScore = calculateOverallScore(forceScores, demographics || undefined);
  console.log('[submitAssessment] Overall score:', overallScore);

  // Calculate signal integrity
  console.log('[submitAssessment] Calculating signal integrity...');
  const startDate = startedAt || new Date(); // Fallback to now if no start time
  const endDate = new Date();
  const durationSeconds = calculateDuration(startDate);
  const integrityResult = calculateSignalIntegrity(responses, startDate, endDate);
  console.log('[submitAssessment] Integrity result:', {
    score: integrityResult.integrityScore,
    flagCount: integrityResult.flags.length,
  });

  // Prepare assessment submission
  console.log('[submitAssessment] Preparing assessment data...');
  const now = new Date().toISOString();

  // Build metadata snapshots for auditability
  const metadata: Record<string, any> = {};

  if (demographics) {
    // Store demographics
    metadata.demographics = demographics;

    // Build and store weight profile + narrative snapshots
    const { weightProfile, narrative } = buildWeightProfileSnapshot(demographics);
    metadata.weight_profile = weightProfile;
    metadata.narrative = narrative;
    console.log('[submitAssessment] Built weight profile snapshot:', {
      version: weightProfile.version,
      branch: weightProfile.branch,
      normalizedSum: weightProfile.normalizedSum,
      deltasCount: Object.keys(weightProfile.deltasApplied).length,
    });
  }

  // Build and store integrity snapshot in metadata
  metadata.integrity_snapshot = {
    integrity_score: integrityResult.integrityScore,
    integrity_flags: integrityResult.flags,
    integrity_checks: integrityResult.checks,
    started_at: startDate.toISOString(),
    duration_seconds: durationSeconds,
    thresholds: {
      minDuration: 60,
      maxDuration: 1800,
      straightlineThreshold: 0.7,
      extremePatternThreshold: 0.8,
    },
    version: 'v2.1',
  };
  console.log('[submitAssessment] Built integrity snapshot');

  // Build assessment insert payload (clean + explicit)
  const assessmentData = {
    // ✅ CRITICAL: founder_id = founders.id (NOT auth.users.id)
    founder_id: founderId,
    venture_id: ventureId || null,
    overall_score: overallScore,

    // Force scores
    force_thesis_integrity: forceScores.thesis_integrity!,
    force_learning_velocity: forceScores.learning_velocity!,
    force_decision_quality: forceScores.decision_quality_under_load!,
    force_talent_gravity: forceScores.talent_gravity!,
    force_delivery_control: forceScores.delivery_control!,
    force_resilience_economics: forceScores.resilience_economics!,

    // Signal integrity
    integrity_score: integrityResult.integrityScore,
    integrity_flags: integrityResult.flags as any,
    integrity_checks: integrityResult.checks as any,
    started_at: startDate.toISOString(),
    duration_seconds: durationSeconds,

    // Version and timestamps
    assessment_version: 'v2.1',
    completed_at: now,

    // Metadata (includes demographics, weight_profile, narrative, integrity_snapshot)
    metadata,
  };
  console.log('[submitAssessment] Assessment data prepared:', {
    founderId,
    overallScore,
    hasMetadata: !!assessmentData.metadata,
  });

  // Sanity check: verify demographic_modifier is NOT in payload
  console.log(
    '[submitAssessment] Final insert payload keys:',
    Object.keys(assessmentData)
  );

  // Insert assessment into database (single row, return id)
  console.log('[submitAssessment] Inserting assessment into Supabase...');
  const { data: assessmentData_result, error } = await supabase
    .from('assessments')
    .insert(assessmentData as any)
    .select('id')
    .single();

  if (error) {
    console.error('[submitAssessment] ❌ Supabase insert error:', error);
    throw error;
  }

  if (!assessmentData_result) {
    throw new Error('Assessment created but no ID returned');
  }

  const assessmentId = (assessmentData_result as { id: string }).id;
  console.log('[submitAssessment] ✅ Assessment inserted successfully:', assessmentId);

  // Insert individual responses
  console.log('[submitAssessment] Preparing response data...');
  const responseData = responses.map((resp) => {
    const question = QUESTIONS.find((q) => q.id === resp.questionId);
    return {
      assessment_id: assessmentId,
      question_id: resp.questionId,
      force: resp.force,
      value: resp.value,
      question_text: question?.text || '',
    };
  });
  console.log('[submitAssessment] Response data prepared:', { count: responseData.length });

  console.log('[submitAssessment] Inserting responses into Supabase...');
  const { error: responsesError } = await supabase
    .from('assessment_responses')
    .insert(responseData as any);

  if (responsesError) {
    console.error('[submitAssessment] WARNING: Response submission error:', responsesError);
    // Assessment is already saved, so we don't throw here
    // Just log the error
  } else {
    console.log('[submitAssessment] Responses inserted successfully');
  }

  // Clear localStorage after successful submission
  console.log('[submitAssessment] Clearing localStorage...');
  clearSurveyData();

  console.log('[submitAssessment] ✅ Submission complete!', {
    assessmentId,
    overallScore,
  });

  return {
    assessmentId,
    overallScore,
  };
}

/**
 * Clear all survey-related data from localStorage
 */
export function clearSurveyData(): void {
  try {
    localStorage.removeItem(SURVEY_STORAGE_KEY);
    localStorage.removeItem(DEMOGRAPHICS_STORAGE_KEY);
    localStorage.removeItem(SURVEY_START_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Set survey start time (called when survey begins)
 */
export function setSurveyStartTime(): void {
  try {
    const now = new Date().toISOString();
    localStorage.setItem(SURVEY_START_KEY, now);
  } catch {
    // Ignore errors
  }
}

/**
 * Fetch assessment results from database
 */
export async function fetchAssessmentResults(assessmentId: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (error) {
    console.error('Error fetching assessment:', error);
    throw new Error(`Failed to fetch assessment: ${error.message}`);
  }

  return data;
}

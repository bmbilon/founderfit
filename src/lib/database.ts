/**
 * FounderFit Score v2.1
 * Database Access Layer
 */

import { supabase } from './supabase';
import type {
  Assessment,
  AssessmentResponse,
  Venture,
  FounderAssessmentHistory,
  CohortAnalysis,
  ExecutionForce,
  VentureStage,
  VentureOutcome,
} from '@/types';

// ============================================================================
// ASSESSMENT OPERATIONS
// ============================================================================

export interface CreateAssessmentData {
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
  integrity_flags: any[]; // IntegrityFlag[], stored as JSONB
  integrity_checks: Record<string, any>; // Stored as JSONB
  started_at: string;
  duration_seconds: number;

  assessment_version?: string;
  completed_at: string;
}

/**
 * Create a new assessment
 */
export async function createAssessment(data: CreateAssessmentData): Promise<Assessment> {
  const insertData = {
    ...data,
    assessment_version: data.assessment_version || 'v2.1',
    metadata: {},
  };

  const { data: assessment, error } = await supabase
    .from('assessments')
    .insert(insertData as any)
    .select()
    .single();

  if (error) throw error;
  return assessment as Assessment;
}

/**
 * Get assessment by ID
 */
export async function getAssessment(assessmentId: string): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (error) {
    console.error('Error fetching assessment:', error);
    return null;
  }

  return data;
}

/**
 * Get all assessments for a founder
 */
export async function getFounderAssessments(founderId: string): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('founder_id', founderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching founder assessments:', error);
    return [];
  }

  return data;
}

/**
 * Get assessment history with venture context
 */
export async function getFounderAssessmentHistory(
  founderId: string
): Promise<FounderAssessmentHistory[]> {
  const { data, error } = await supabase
    .from('founder_assessment_history')
    .select('*')
    .eq('founder_id', founderId)
    .order('assessment_date', { ascending: false });

  if (error) {
    console.error('Error fetching assessment history:', error);
    return [];
  }

  return data;
}

// ============================================================================
// ASSESSMENT RESPONSE OPERATIONS
// ============================================================================

export interface CreateResponseData {
  assessment_id: string;
  question_id: string;
  force: ExecutionForce;
  value: number;
  question_text: string;
}

/**
 * Create multiple assessment responses
 */
export async function createAssessmentResponses(
  responses: CreateResponseData[]
): Promise<AssessmentResponse[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .insert(responses as any)
    .select();

  if (error) throw error;
  return data as AssessmentResponse[];
}

/**
 * Get responses for an assessment
 */
export async function getAssessmentResponses(
  assessmentId: string
): Promise<AssessmentResponse[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching assessment responses:', error);
    return [];
  }

  return data;
}

// ============================================================================
// VENTURE OPERATIONS
// ============================================================================

export interface CreateVentureData {
  founder_id: string;
  name: string;
  description?: string;
  stage?: VentureStage;
  outcome?: VentureOutcome;
  founded_date?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a new venture
 */
export async function createVenture(data: CreateVentureData): Promise<Venture> {
  const insertData = {
    ...data,
    stage: data.stage || 'idea',
    outcome: data.outcome || 'active',
    metadata: data.metadata || {},
  };

  const { data: venture, error } = await supabase
    .from('ventures')
    .insert(insertData as any)
    .select()
    .single();

  if (error) throw error;
  return venture as Venture;
}

/**
 * Get venture by ID
 */
export async function getVenture(ventureId: string): Promise<Venture | null> {
  const { data, error } = await supabase
    .from('ventures')
    .select('*')
    .eq('id', ventureId)
    .single();

  if (error) {
    console.error('Error fetching venture:', error);
    return null;
  }

  return data;
}

/**
 * Get all ventures for a founder
 */
export async function getFounderVentures(founderId: string): Promise<Venture[]> {
  const { data, error } = await supabase
    .from('ventures')
    .select('*')
    .eq('founder_id', founderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching founder ventures:', error);
    return [];
  }

  return data;
}

/**
 * Update venture
 */
export async function updateVenture(
  ventureId: string,
  updates: Partial<CreateVentureData>
): Promise<Venture> {
  const { data, error } = await supabase
    .from('ventures')
    // @ts-ignore - Supabase type inference issue
    .update(updates)
    .eq('id', ventureId)
    .select()
    .single();

  if (error) throw error;
  return data as Venture;
}

/**
 * Update venture outcome
 */
export async function updateVentureOutcome(
  ventureId: string,
  outcome: VentureOutcome,
  outcomeDate?: string,
  outcomeNotes?: string
): Promise<Venture> {
  const updates: any = { outcome };
  if (outcomeDate) updates.outcome_date = outcomeDate;
  if (outcomeNotes) updates.outcome_notes = outcomeNotes;

  const { data, error } = await supabase
    .from('ventures')
    // @ts-ignore - Supabase type inference issue
    .update(updates)
    .eq('id', ventureId)
    .select()
    .single();

  if (error) throw error;
  return data as Venture;
}

// ============================================================================
// ANALYTICS & COHORT OPERATIONS (ADMIN)
// ============================================================================

/**
 * Get cohort analysis data
 */
export async function getCohortAnalysis(): Promise<CohortAnalysis[]> {
  const { data, error } = await supabase.from('cohort_analysis').select('*');

  if (error) {
    console.error('Error fetching cohort analysis:', error);
    return [];
  }

  return data;
}

/**
 * Get all assessments (admin only)
 */
export async function getAllAssessments(): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all assessments:', error);
    return [];
  }

  return data;
}

/**
 * Get assessment statistics
 */
export async function getAssessmentStats() {
  const { data, error } = await supabase.from('assessments').select('*');

  if (error) {
    console.error('Error fetching assessment stats:', error);
    return null;
  }

  const assessments = data as Assessment[];
  const totalAssessments = assessments.length;
  const avgOverallScore =
    assessments.reduce((sum, a) => sum + a.overall_score, 0) / totalAssessments;

  const forceAverages = {
    thesis_integrity:
      assessments.reduce((sum, a) => sum + a.force_thesis_integrity, 0) / totalAssessments,
    learning_velocity:
      assessments.reduce((sum, a) => sum + a.force_learning_velocity, 0) / totalAssessments,
    decision_quality:
      assessments.reduce((sum, a) => sum + a.force_decision_quality, 0) / totalAssessments,
    talent_gravity:
      assessments.reduce((sum, a) => sum + a.force_talent_gravity, 0) / totalAssessments,
    delivery_control:
      assessments.reduce((sum, a) => sum + a.force_delivery_control, 0) / totalAssessments,
    resilience_economics:
      assessments.reduce((sum, a) => sum + a.force_resilience_economics, 0) / totalAssessments,
  };

  // Calculate integrity statistics
  const assessmentsWithIntegrity = assessments.filter((a) => a.integrity_score !== null);
  const avgIntegrityScore =
    assessmentsWithIntegrity.length > 0
      ? assessmentsWithIntegrity.reduce((sum, a) => sum + (a.integrity_score || 0), 0) /
        assessmentsWithIntegrity.length
      : null;

  const integrityDistribution = {
    excellent: assessments.filter((a) => (a.integrity_score || 0) >= 90).length,
    good: assessments.filter((a) => (a.integrity_score || 0) >= 70 && (a.integrity_score || 0) < 90)
      .length,
    questionable: assessments.filter(
      (a) => (a.integrity_score || 0) >= 50 && (a.integrity_score || 0) < 70
    ).length,
    poor: assessments.filter((a) => (a.integrity_score || 0) < 50 && a.integrity_score !== null)
      .length,
  };

  return {
    totalAssessments,
    avgOverallScore: Math.round(avgOverallScore),
    forceAverages: Object.fromEntries(
      Object.entries(forceAverages).map(([k, v]) => [k, Math.round(v)])
    ),
    avgIntegrityScore: avgIntegrityScore ? Math.round(avgIntegrityScore) : null,
    integrityDistribution,
    assessmentsWithIntegrity: assessmentsWithIntegrity.length,
  };
}

/**
 * Get high integrity assessments only (integrity score >= 70)
 */
export async function getHighIntegrityAssessments(): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .gte('integrity_score', 70)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching high integrity assessments:', error);
    return [];
  }

  return data;
}

/**
 * Get assessments filtered by integrity score threshold
 */
export async function getAssessmentsByIntegrityThreshold(
  minScore: number
): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .gte('integrity_score', minScore)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching assessments by integrity:', error);
    return [];
  }

  return data;
}

/**
 * Get assessments with specific integrity flags
 */
export async function getAssessmentsWithFlags(
  flagType: 'time_outlier' | 'inconsistent_pair' | 'straightlining' | 'extreme_pattern'
): Promise<Assessment[]> {
  const { data, error } = await supabase.from('assessments').select('*');

  if (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }

  const assessments = data as Assessment[];
  // Filter by flag type in application code (JSONB queries can be complex)
  return assessments.filter((assessment) => {
    if (!assessment.integrity_flags) return false;
    return assessment.integrity_flags.some((flag: any) => flag.type === flagType);
  });
}

/**
 * Get founder count
 */
export async function getFounderCount(): Promise<number> {
  const { count, error } = await supabase
    .from('founders')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching founder count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get venture count by outcome
 */
export async function getVentureCountByOutcome(): Promise<Record<VentureOutcome, number>> {
  const { data, error } = await supabase.from('ventures').select('outcome');

  if (error) {
    console.error('Error fetching ventures:', error);
    return {
      active: 0,
      success_exit: 0,
      failure: 0,
      zombie: 0,
      pivot: 0,
    };
  }

  const ventures = data as Pick<Venture, 'outcome'>[];
  const counts: Record<VentureOutcome, number> = {
    active: 0,
    success_exit: 0,
    failure: 0,
    zombie: 0,
    pivot: 0,
  };

  ventures.forEach((v) => {
    counts[v.outcome]++;
  });

  return counts;
}

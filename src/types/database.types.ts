/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * TypeScript Database Types
 */

import type { IntegrityFlag } from './assessment.types';

// ============================================================================
// ENUMS
// ============================================================================

export type VentureStage =
  | 'idea'
  | 'pre_seed'
  | 'seed'
  | 'series_a'
  | 'series_b'
  | 'series_c_plus'
  | 'acquired'
  | 'ipo'
  | 'shutdown';

export type VentureOutcome =
  | 'active'
  | 'success_exit'
  | 'failure'
  | 'zombie'
  | 'pivot';

export type ExecutionForce =
  | 'thesis_integrity'
  | 'learning_velocity'
  | 'decision_quality_under_load'
  | 'talent_gravity'
  | 'delivery_control'
  | 'resilience_economics';

export type UserRole = 'founder' | 'admin';

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Founder {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Venture {
  id: string;
  founder_id: string;
  name: string;
  description: string | null;
  stage: VentureStage;
  outcome: VentureOutcome;
  founded_date: string | null;
  outcome_date: string | null;
  outcome_notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  founder_id: string;
  venture_id: string | null;

  // Overall score
  overall_score: number;

  // Individual force scores (0-100)
  force_thesis_integrity: number;
  force_learning_velocity: number;
  force_decision_quality: number;
  force_talent_gravity: number;
  force_delivery_control: number;
  force_resilience_economics: number;

  // Signal Integrity tracking
  integrity_score: number | null; // 0-100, higher = better validity
  integrity_flags: IntegrityFlag[] | null; // Array of detected validity issues
  integrity_checks: Record<string, any> | null; // Detailed check results
  started_at: string | null; // When assessment was started
  duration_seconds: number | null; // Time to complete in seconds

  // FAC (Founder Advantage Composite) Model - PROPRIETARY
  demographic_responses: Record<string, any> | null; // Raw demographic answers
  fac_score: number | null; // 0-100, Founder Advantage Composite
  demographic_modifier: number | null; // Score shift applied (-50 to +50)

  // Metadata
  assessment_version: string;
  metadata: Record<string, any>;

  created_at: string;
  completed_at: string | null;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  question_id: string;
  force: ExecutionForce;
  value: number; // 0-1 for binary, 1-5 for Likert
  question_text: string | null;
  created_at: string;
}

// ============================================================================
// DATABASE VIEWS
// ============================================================================

export interface FounderAssessmentHistory {
  founder_id: string;
  founder_name: string;
  email: string;
  assessment_id: string;
  overall_score: number;
  force_thesis_integrity: number;
  force_learning_velocity: number;
  force_decision_quality: number;
  force_talent_gravity: number;
  force_delivery_control: number;
  force_resilience_economics: number;
  integrity_score: number | null;
  integrity_flags: IntegrityFlag[] | null;
  duration_seconds: number | null;
  assessment_date: string;
  started_at: string | null;
  venture_name: string | null;
  venture_stage: VentureStage | null;
  venture_outcome: VentureOutcome | null;
}

export interface CohortAnalysis {
  outcome: VentureOutcome;
  stage: VentureStage;
  founder_count: number;
  avg_overall_score: number;
  avg_thesis_integrity: number;
  avg_learning_velocity: number;
  avg_decision_quality: number;
  avg_talent_gravity: number;
  avg_delivery_control: number;
  avg_resilience_economics: number;
  avg_integrity_score: number;
  excellent_integrity_count: number;
  good_integrity_count: number;
  questionable_integrity_count: number;
  poor_integrity_count: number;
}

// ============================================================================
// SUPABASE DATABASE TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      founders: {
        Row: Founder;
        Insert: Omit<Founder, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Founder, 'id' | 'created_at' | 'updated_at'>>;
      };
      ventures: {
        Row: Venture;
        Insert: Omit<Venture, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Venture, 'id' | 'created_at' | 'updated_at'>>;
      };
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, 'id' | 'created_at'>;
        Update: Partial<Omit<Assessment, 'id' | 'created_at'>>;
      };
      assessment_responses: {
        Row: AssessmentResponse;
        Insert: Omit<AssessmentResponse, 'id' | 'created_at'>;
        Update: Partial<Omit<AssessmentResponse, 'id' | 'created_at'>>;
      };
    };
    Views: {
      founder_assessment_history: {
        Row: FounderAssessmentHistory;
      };
      cohort_analysis: {
        Row: CohortAnalysis;
      };
    };
    Functions: {};
    Enums: {
      venture_stage: VentureStage;
      venture_outcome: VentureOutcome;
      execution_force: ExecutionForce;
      user_role: UserRole;
    };
  };
}

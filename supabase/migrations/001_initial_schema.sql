-- FounderFit Score v2.1: The 6 Execution Forces Framework
-- Database Schema for Longitudinal Founder Assessment

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- ============================================================================
-- 2. ENUMS
-- ============================================================================

CREATE TYPE venture_stage AS ENUM (
  'idea',
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'series_c_plus',
  'acquired',
  'ipo',
  'shutdown'
);

CREATE TYPE venture_outcome AS ENUM (
  'active',
  'success_exit',
  'failure',
  'zombie',
  'pivot'
);

CREATE TYPE execution_force AS ENUM (
  'thesis_integrity',
  'learning_velocity',
  'decision_quality_under_load',
  'talent_gravity',
  'delivery_control',
  'resilience_economics'
);

CREATE TYPE user_role AS ENUM (
  'founder',
  'admin'
);

-- ============================================================================
-- 3. TABLES (in dependency order)
-- ============================================================================

-- Table 1: founders (no dependencies)
CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'founder' NOT NULL,
  auth_user_id UUID UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table 2: ventures (depends on founders)
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stage venture_stage DEFAULT 'idea' NOT NULL,
  outcome venture_outcome DEFAULT 'active' NOT NULL,
  founded_date DATE,
  outcome_date DATE,
  outcome_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table 3: assessments (depends on founders and ventures)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
  venture_id UUID REFERENCES ventures(id) ON DELETE SET NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  force_thesis_integrity INTEGER NOT NULL CHECK (force_thesis_integrity >= 0 AND force_thesis_integrity <= 100),
  force_learning_velocity INTEGER NOT NULL CHECK (force_learning_velocity >= 0 AND force_learning_velocity <= 100),
  force_decision_quality INTEGER NOT NULL CHECK (force_decision_quality >= 0 AND force_decision_quality <= 100),
  force_talent_gravity INTEGER NOT NULL CHECK (force_talent_gravity >= 0 AND force_talent_gravity <= 100),
  force_delivery_control INTEGER NOT NULL CHECK (force_delivery_control >= 0 AND force_delivery_control <= 100),
  force_resilience_economics INTEGER NOT NULL CHECK (force_resilience_economics >= 0 AND force_resilience_economics <= 100),
  integrity_score INTEGER CHECK (integrity_score >= 0 AND integrity_score <= 100),
  integrity_flags JSONB,
  integrity_checks JSONB,
  started_at TIMESTAMPTZ,
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  assessment_version TEXT DEFAULT 'v2.1' NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Table 4: assessment_responses (depends on assessments)
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  force execution_force NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
  question_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX idx_founders_email ON founders(email);
CREATE INDEX idx_founders_auth_user_id ON founders(auth_user_id);
CREATE INDEX idx_founders_role ON founders(role);

CREATE INDEX idx_ventures_founder_id ON ventures(founder_id);
CREATE INDEX idx_ventures_stage ON ventures(stage);
CREATE INDEX idx_ventures_outcome ON ventures(outcome);
CREATE INDEX idx_ventures_founder_outcome ON ventures(founder_id, outcome);

CREATE INDEX idx_assessments_founder_id ON assessments(founder_id);
CREATE INDEX idx_assessments_venture_id ON assessments(venture_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessments_integrity_score ON assessments(integrity_score);
CREATE INDEX idx_assessments_founder_created ON assessments(founder_id, created_at DESC);
CREATE INDEX idx_assessments_integrity_flags ON assessments USING GIN (integrity_flags);

CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_assessment_responses_force ON assessment_responses(force);

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Founders policies
CREATE POLICY founders_select_own ON founders
  FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY founders_update_own ON founders
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Ventures policies
CREATE POLICY ventures_select_own ON ventures
  FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY ventures_insert_own ON ventures
  FOR INSERT
  WITH CHECK (
    founder_id IN (
      SELECT id FROM founders WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY ventures_update_own ON ventures
  FOR UPDATE
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY ventures_select_admin ON ventures
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY ventures_insert_admin ON ventures
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY ventures_update_admin ON ventures
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY ventures_delete_admin ON ventures
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Assessments policies
CREATE POLICY assessments_select_own ON assessments
  FOR SELECT
  USING (
    founder_id IN (
      SELECT id FROM founders WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY assessments_insert_own ON assessments
  FOR INSERT
  WITH CHECK (
    founder_id IN (
      SELECT id FROM founders WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY assessments_select_admin ON assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY assessments_insert_admin ON assessments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY assessments_update_admin ON assessments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY assessments_delete_admin ON assessments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment responses policies
CREATE POLICY responses_select_own ON assessment_responses
  FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE founder_id IN (
        SELECT id FROM founders WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY responses_insert_own ON assessment_responses
  FOR INSERT
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE founder_id IN (
        SELECT id FROM founders WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY responses_select_admin ON assessment_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY responses_insert_admin ON assessment_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY responses_update_admin ON assessment_responses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY responses_delete_admin ON assessment_responses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM founders
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 6. VIEWS
-- ============================================================================

CREATE VIEW founder_assessment_history AS
SELECT
  f.id as founder_id,
  f.name as founder_name,
  f.email,
  a.id as assessment_id,
  a.overall_score,
  a.force_thesis_integrity,
  a.force_learning_velocity,
  a.force_decision_quality,
  a.force_talent_gravity,
  a.force_delivery_control,
  a.force_resilience_economics,
  a.integrity_score,
  a.integrity_flags,
  a.duration_seconds,
  a.created_at as assessment_date,
  a.started_at,
  v.name as venture_name,
  v.stage as venture_stage,
  v.outcome as venture_outcome
FROM founders f
LEFT JOIN assessments a ON f.id = a.founder_id
LEFT JOIN ventures v ON a.venture_id = v.id
ORDER BY f.id, a.created_at DESC;

CREATE VIEW cohort_analysis AS
SELECT
  v.outcome,
  v.stage,
  COUNT(DISTINCT a.founder_id) as founder_count,
  AVG(a.overall_score) as avg_overall_score,
  AVG(a.force_thesis_integrity) as avg_thesis_integrity,
  AVG(a.force_learning_velocity) as avg_learning_velocity,
  AVG(a.force_decision_quality) as avg_decision_quality,
  AVG(a.force_talent_gravity) as avg_talent_gravity,
  AVG(a.force_delivery_control) as avg_delivery_control,
  AVG(a.force_resilience_economics) as avg_resilience_economics,
  AVG(a.integrity_score) as avg_integrity_score,
  COUNT(*) FILTER (WHERE a.integrity_score >= 90) as excellent_integrity_count,
  COUNT(*) FILTER (WHERE a.integrity_score >= 70 AND a.integrity_score < 90) as good_integrity_count,
  COUNT(*) FILTER (WHERE a.integrity_score >= 50 AND a.integrity_score < 70) as questionable_integrity_count,
  COUNT(*) FILTER (WHERE a.integrity_score < 50 AND a.integrity_score IS NOT NULL) as poor_integrity_count
FROM ventures v
JOIN assessments a ON v.id = a.venture_id
GROUP BY v.outcome, v.stage;

-- ============================================================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_founders_updated_at
  BEFORE UPDATE ON founders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventures_updated_at
  BEFORE UPDATE ON ventures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.founders (auth_user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'founder')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 8. COMMENTS
-- ============================================================================

COMMENT ON TABLE founders IS 'Founder profiles linked to Supabase Auth';
COMMENT ON TABLE ventures IS 'Ventures associated with founders for outcome tracking';
COMMENT ON TABLE assessments IS 'FounderFit assessments with 6 Execution Forces scores and Signal Integrity tracking';
COMMENT ON TABLE assessment_responses IS 'Individual question responses for detailed analysis';

COMMENT ON COLUMN assessments.force_thesis_integrity IS 'Force A: Form, hold, and revise thesis without delusion';
COMMENT ON COLUMN assessments.force_learning_velocity IS 'Force B: Signal to model update to new behavior speed';
COMMENT ON COLUMN assessments.force_decision_quality IS 'Force C: Decision quality under incomplete data and high stakes';
COMMENT ON COLUMN assessments.force_talent_gravity IS 'Force D: Ability to attract, align, and retain talent';
COMMENT ON COLUMN assessments.force_delivery_control IS 'Force E: Reliability of output and operational closure';
COMMENT ON COLUMN assessments.force_resilience_economics IS 'Force F: Managing energy and motivation without burnout';
COMMENT ON COLUMN assessments.integrity_score IS 'Signal Integrity score (0-100): Measures response quality and validity';
COMMENT ON COLUMN assessments.integrity_flags IS 'Array of detected integrity issues (time_outlier, inconsistent_pair, straightlining, extreme_pattern)';
COMMENT ON COLUMN assessments.integrity_checks IS 'Detailed results from integrity validation checks';
COMMENT ON COLUMN assessments.started_at IS 'Timestamp when assessment was started (for completion time tracking)';
COMMENT ON COLUMN assessments.duration_seconds IS 'Time taken to complete assessment (for integrity validation)';

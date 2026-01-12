-- Migration: Add FAC (Founder Advantage Composite) demographics to assessments table
-- Date: 2026-01-10
-- Description: Add columns for FAC model demographic scoring

-- Add demographic_responses column (raw user answers)
ALTER TABLE assessments
ADD COLUMN demographic_responses JSONB;

-- Add fac_score column (Founder Advantage Composite 0-100)
ALTER TABLE assessments
ADD COLUMN fac_score INTEGER CHECK (fac_score >= 0 AND fac_score <= 100);

-- Add demographic_modifier column (the shift applied to execution score)
ALTER TABLE assessments
ADD COLUMN demographic_modifier INTEGER CHECK (demographic_modifier >= -50 AND demographic_modifier <= 50);

-- Add index for demographic queries (for admin analytics)
CREATE INDEX idx_assessments_demographic_responses ON assessments USING GIN (demographic_responses);
CREATE INDEX idx_assessments_fac_score ON assessments (fac_score);

-- Add comments
COMMENT ON COLUMN assessments.demographic_responses IS 'Raw demographic answers: age_bracket, industry_years, exit_history, prior_startups, education';
COMMENT ON COLUMN assessments.fac_score IS 'Founder Advantage Composite (FAC) score (0-100). Weighted combination of 5 advantage indices (AAI, IAI, XAI, SAI, EAI).';
COMMENT ON COLUMN assessments.demographic_modifier IS 'Score shift applied based on FAC model. Final Score = Execution Score + demographic_modifier.';

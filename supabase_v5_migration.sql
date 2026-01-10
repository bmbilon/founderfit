-- FounderFit v5 Database Migration
-- Adds new columns for validity scoring, success index, and context

-- Add overall_trait_score (replaces overall_score for clarity)
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS overall_trait_score INTEGER;

-- Add validity scoring fields
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS validity_score INTEGER;

ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS validity_flags JSONB DEFAULT '[]'::jsonb;

ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS confidence_band TEXT;

-- Add success index (nullable - suppressed if validity < 60)
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS success_index INTEGER;

-- Add context data
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS context JSONB;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_reports_validity_score ON test_reports(validity_score);
CREATE INDEX IF NOT EXISTS idx_test_reports_success_index ON test_reports(success_index);

-- Add comments for documentation
COMMENT ON COLUMN test_reports.overall_trait_score IS 'Overall trait score (0-100) from 22 core questions';
COMMENT ON COLUMN test_reports.validity_score IS 'Response validity score (0-100) from 8 validity checks';
COMMENT ON COLUMN test_reports.validity_flags IS 'Array of validity flags (attention_fail, too_perfect, inconsistency)';
COMMENT ON COLUMN test_reports.confidence_band IS 'Confidence level: Low (<60), Medium (60-79), High (80+)';
COMMENT ON COLUMN test_reports.success_index IS 'Context-aware success likelihood (0-100), null if validity < 60';
COMMENT ON COLUMN test_reports.context IS 'User context: ageBucket, domainExp, stage, industry, founderExp, capital';

-- Verify the migration
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'test_reports' 
AND column_name IN ('overall_trait_score', 'validity_score', 'validity_flags', 'confidence_band', 'success_index', 'context')
ORDER BY ordinal_position;

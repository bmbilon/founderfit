-- Migration: Add user_name and user_email columns to test_reports table
-- Date: 2026-01-09
-- Description: Store user contact information for email delivery of results

-- Add user_name column (text, optional for backward compatibility)
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS user_name TEXT;

-- Add user_email column (text, optional for backward compatibility)
ALTER TABLE test_reports 
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add index on email for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_test_reports_email ON test_reports(user_email);

-- Add comment to document the columns
COMMENT ON COLUMN test_reports.user_name IS 'Full name of the test subject';
COMMENT ON COLUMN test_reports.user_email IS 'Email address for result delivery';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'test_reports' 
ORDER BY ordinal_position;

-- 003_add_demographic_modifier.sql

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS demographic_modifier jsonb
  DEFAULT '{}'::jsonb;

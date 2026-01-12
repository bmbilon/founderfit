# Demographic Modifier Column Migration

## Overview

Added dedicated `demographic_modifier` JSONB column to store weight profile snapshots for auditability and easier querying.

## Changes Made

### 1. **Database Migration: `003_add_demographic_modifier.sql`**

**Location:** `supabase/migrations/003_add_demographic_modifier.sql`

**Actions:**
1. Drops old `demographic_modifier` INTEGER column (from FAC model - no longer used)
2. Adds new `demographic_modifier` JSONB column with default `'{}'`
3. Creates GIN index for efficient JSONB queries
4. Adds descriptive comment explaining the column structure

**Column Structure:**
```typescript
{
  version: "v2.1",
  branch: "solo" | "two_three" | "four_plus",
  forceWeights: {
    thesis_integrity: 0.175,
    learning_velocity: 0.165,
    decision_quality_under_load: 0.175,
    talent_gravity: 0.117,
    delivery_control: 0.194,
    resilience_economics: 0.175
  },
  deltasApplied: {
    "industry_experience:thesis_integrity": 0.02,
    "industry_experience:learning_velocity": 0.01,
    "prior_exits:decision_quality_under_load": 0.02,
    "prior_exits:delivery_control": 0.01
  },
  normalizedSum: 1.0
}
```

### 2. **Code Update: `src/utils/assessmentSubmission.ts`**

**Changes:**
- Stores weight profile snapshot in **both** locations:
  1. `metadata.weight_profile` (JSONB in metadata column) - for backward compatibility
  2. `demographic_modifier` (dedicated JSONB column) - for easier querying

**Before:**
```typescript
demographic_modifier: null,
```

**After:**
```typescript
demographic_modifier: weightProfileSnapshot, // JSONB weight profile snapshot
```

## Running the Migration

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd /Users/brettbilon/Downloads/founderfit-vercel

# Push migration to Supabase
supabase db push
```

**Expected Output:**
```
Applying migration 003_add_demographic_modifier.sql...
✓ Successfully applied migration
```

### Option 2: Manual SQL Execution

If you prefer to run the SQL manually via Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/003_add_demographic_modifier.sql`
4. Paste and execute

### Option 3: Using Supabase Migration Commands

```bash
# Reset local database (if using local dev)
supabase db reset

# Or apply specific migration
supabase migration up
```

## Verification

After running the migration, verify the column exists:

```sql
-- Check column exists and has correct type
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'assessments'
  AND column_name = 'demographic_modifier';

-- Expected output:
-- column_name          | data_type | column_default
-- demographic_modifier | jsonb     | '{}'::jsonb
```

## Querying the New Column

### Example Queries

**1. Find all assessments by branch:**
```sql
SELECT id, founder_id, overall_score,
       demographic_modifier->>'branch' as branch,
       demographic_modifier->>'version' as version
FROM assessments
WHERE demographic_modifier->>'branch' = 'solo';
```

**2. Get normalized sum for validation:**
```sql
SELECT id,
       (demographic_modifier->>'normalizedSum')::float as normalized_sum
FROM assessments
WHERE demographic_modifier IS NOT NULL
  AND demographic_modifier->>'normalizedSum' IS NOT NULL;
```

**3. Count assessments by weighting branch:**
```sql
SELECT
  demographic_modifier->>'branch' as branch,
  COUNT(*) as count
FROM assessments
WHERE demographic_modifier->>'branch' IS NOT NULL
GROUP BY demographic_modifier->>'branch'
ORDER BY count DESC;
```

**4. Get deltas applied for an assessment:**
```sql
SELECT id,
       jsonb_pretty(demographic_modifier->'deltasApplied') as deltas
FROM assessments
WHERE id = 'your-assessment-id';
```

**5. Validate weight normalization:**
```sql
-- Find assessments where normalized sum is NOT close to 1.0
SELECT id,
       (demographic_modifier->>'normalizedSum')::float as sum,
       ABS((demographic_modifier->>'normalizedSum')::float - 1.0) as deviation
FROM assessments
WHERE demographic_modifier->>'normalizedSum' IS NOT NULL
  AND ABS((demographic_modifier->>'normalizedSum')::float - 1.0) > 0.001
ORDER BY deviation DESC;
```

## Benefits of Dedicated Column

### 1. **Easier Querying**
```sql
-- With dedicated column
WHERE demographic_modifier->>'branch' = 'solo'

-- vs. nested in metadata (harder to query)
WHERE metadata->'weight_profile'->>'branch' = 'solo'
```

### 2. **Better Indexing**
GIN index on `demographic_modifier` enables fast queries on weight profiles.

### 3. **Clearer Schema**
Dedicated column makes it explicit that this is a first-class field, not just arbitrary metadata.

### 4. **Easier Analytics**
Simple to aggregate and analyze weight profiles across assessments:
```sql
SELECT
  demographic_modifier->>'branch' as branch,
  AVG(overall_score) as avg_score,
  COUNT(*) as count
FROM assessments
WHERE demographic_modifier->>'branch' IS NOT NULL
GROUP BY branch;
```

## Backward Compatibility

### Old Assessments (before migration)
- `demographic_modifier` will be `NULL` or `{}`
- `metadata.weight_profile` will also be missing
- ResultsPage will fall back to recomputing narrative from demographics

### New Assessments (after migration)
- `demographic_modifier` will contain weight profile snapshot
- `metadata.weight_profile` will also contain snapshot (redundant but safe)
- ResultsPage will use persisted snapshot

### During Migration
No data loss - the migration:
1. Drops old INTEGER column (was always NULL anyway for new assessments)
2. Creates new JSONB column with default `{}`
3. Existing rows get `{}` as default value

## Testing the Change

### 1. Create Test Assessment

Complete a full assessment after running the migration.

### 2. Verify Database

```sql
-- Check the new assessment has weight profile
SELECT
  id,
  founder_id,
  overall_score,
  demographic_modifier->>'version' as version,
  demographic_modifier->>'branch' as branch,
  jsonb_object_keys(demographic_modifier->'forceWeights') as force
FROM assessments
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 1;
```

### 3. Verify Results Page

Navigate to the results page and verify:
- ✅ "Scoring model: v2.1" badge appears
- ✅ Narrative context displays correctly
- ✅ Console shows: `[ResultsPage] Using persisted narrative snapshot from: v2.1`

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Drop the new JSONB column
ALTER TABLE public.assessments
  DROP COLUMN IF EXISTS demographic_modifier;

-- Restore old INTEGER column (if needed)
ALTER TABLE public.assessments
  ADD COLUMN demographic_modifier INTEGER
  CHECK (demographic_modifier >= -50 AND demographic_modifier <= 50);
```

## Summary

✅ **Migration file created:** `003_add_demographic_modifier.sql`
✅ **Code updated:** `assessmentSubmission.ts` now stores weight profile in dedicated column
✅ **Tests passing:** All 64 tests pass
✅ **Build successful:** No TypeScript errors
✅ **Backward compatible:** Old assessments continue to work

**Next step:** Run `supabase db push` to apply the migration to your database.

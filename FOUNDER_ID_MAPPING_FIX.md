# Founder ID Mapping Fix - "Supa Scoop"

## Critical Rule (Locked In)

```
❌ auth.users.id   NEVER goes into assessments
✅ founders.id     ALWAYS goes into assessments.founder_id
```

## The Problem

Previously, there was potential confusion about which ID to use when inserting assessments:
- `auth.users.id` - The Supabase auth user ID
- `founders.id` - The founder profile ID (references auth_user_id)

**The fix:** Always perform the "supa scoop" to map auth user → founder profile → founder.id

## Implementation

### Step 1: Migration File

**Created:** `supabase/migrations/003_add_demographic_modifier.sql`

```sql
-- 003_add_demographic_modifier.sql

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS demographic_modifier jsonb
  DEFAULT '{}'::jsonb;
```

**To apply:**
```bash
supabase db push
```

**Verify in Supabase SQL Editor:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'assessments';

-- Expected: demographic_modifier | jsonb
```

### Step 2: Founder ID Resolution ("Supa Scoop")

**Location:** `src/utils/assessmentSubmission.ts`

**Function:** `getFounderProfileIdOrThrow()`

This function performs the critical mapping:

```typescript
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
```

### Step 3: Assessment Submission

**Function:** `submitAssessment()`

```typescript
export async function submitAssessment(
  ventureId?: string
): Promise<{ assessmentId: string; overallScore: number }> {
  console.log('[submitAssessment] Starting submission...', { ventureId });

  // Resolve founder ID from authenticated user (the "supa scoop")
  // ✅ This returns founders.id (NOT auth.users.id)
  const founderId = await getFounderProfileIdOrThrow();
  console.log('[submitAssessment] Resolved founder.id:', founderId);

  // ... load data, calculate scores, build snapshots ...

  // Build assessment insert payload (clean + explicit)
  const assessmentData = {
    // ✅ CRITICAL: founder_id = founders.id (NOT auth.users.id)
    founder_id: founderId,
    venture_id: ventureId || null,

    // Execution force scores
    overall_score: overallScore,
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

    // Weight profile snapshot (JSONB)
    demographic_modifier: weightProfileSnapshot,

    // Legacy FAC model fields (unused)
    demographic_responses: null,
    fac_score: null,

    // Version and timestamps
    assessment_version: 'v2.1',
    completed_at: now,

    // Metadata (includes demographics, weight_profile, narrative, integrity)
    metadata,
  };

  // Insert assessment into database (single row, return id)
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

  // ... insert responses, clear localStorage ...

  console.log('[submitAssessment] ✅ Submission complete!', {
    assessmentId,
    overallScore,
  });

  return { assessmentId, overallScore };
}
```

## What Success Looks Like

### Console Logs (Expected Output)

```
[submitAssessment] Starting submission... { ventureId: undefined }
[submitAssessment] Resolved founder.id: 12345678-1234-1234-1234-123456789abc
[submitAssessment] Loaded raw responses: { count: 24, keys: [...] }
[submitAssessment] Loaded demographics: {...}
...
[submitAssessment] Inserting assessment into Supabase...
[submitAssessment] ✅ Assessment inserted successfully: abcdef12-3456-7890-abcd-ef1234567890
...
[submitAssessment] ✅ Submission complete! { assessmentId: '...', overallScore: 75 }
```

### Network Tab (Browser DevTools)

```
POST /rest/v1/assessments → 201 Created

Response Body:
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890"
}
```

### No Errors

- ✅ No alert popup
- ✅ No PGRST (PostgreSQL REST) errors
- ✅ No foreign key constraint violations
- ✅ Browser navigates to `/results/:id`

## Verification Checklist

### 1. Migration Applied
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'assessments'
AND column_name = 'demographic_modifier';

-- Expected: 1 row with jsonb type
```

### 2. Founder ID Correctly Used
```sql
-- Check a recent assessment
SELECT
  id,
  founder_id,
  created_at
FROM assessments
ORDER BY created_at DESC
LIMIT 1;

-- founder_id should be a UUID from founders table
-- NOT from auth.users
```

### 3. Verify Foreign Key
```sql
-- This should return the founder profile
SELECT
  f.id,
  f.email,
  f.auth_user_id,
  a.id as assessment_id
FROM assessments a
JOIN founders f ON f.id = a.founder_id
ORDER BY a.created_at DESC
LIMIT 1;

-- If this works, founder_id is correctly mapped
```

## Common Issues & Solutions

### Issue 1: "Founder profile not found"

**Error:**
```
Error: Founder profile not found
```

**Cause:** User is authenticated in `auth.users` but has no matching row in `founders` table

**Solution:**
```sql
-- Check if founder profile exists
SELECT * FROM founders WHERE auth_user_id = 'your-auth-user-id';

-- If missing, create one
INSERT INTO founders (auth_user_id, email, full_name, role)
VALUES ('your-auth-user-id', 'user@example.com', 'User Name', 'founder');
```

### Issue 2: Foreign Key Constraint Violation

**Error:**
```
PGRST error: insert or update on table "assessments" violates foreign key constraint
```

**Cause:** Trying to insert with a founder_id that doesn't exist in `founders` table

**Solution:** Make sure `getFounderProfileIdOrThrow()` is being used correctly and returns a valid `founders.id`

### Issue 3: Wrong ID Type

**Error:**
```
invalid input syntax for type uuid
```

**Cause:** Accidentally passing auth.users.id (string) instead of founders.id (UUID)

**Solution:** Always use `getFounderProfileIdOrThrow()` - never pass auth user IDs directly

## Removed Code Patterns

The following patterns have been **completely removed** from the codebase:

```typescript
// ❌ NEVER DO THIS:
const tempFounderId = 'temp-founder-' + Date.now();
await submitAssessment(tempFounderId);

// ❌ NEVER DO THIS:
const { user } = await supabase.auth.getUser();
await submitAssessment(user.id); // Wrong! This is auth.users.id

// ❌ NEVER DO THIS:
const founderId = useAuth().user.id; // Wrong! This is auth.users.id
```

**Correct Pattern:**
```typescript
// ✅ DO THIS (function handles the mapping internally):
await submitAssessment();

// Inside submitAssessment():
const founderId = await getFounderProfileIdOrThrow(); // Returns founders.id
```

## Database Schema Verification

### Founders Table
```sql
-- auth_user_id links to auth.users.id
CREATE TABLE founders (
  id UUID PRIMARY KEY,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  ...
);
```

### Assessments Table
```sql
-- founder_id links to founders.id (NOT auth.users.id)
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES founders(id),
  ...
  demographic_modifier JSONB DEFAULT '{}',
  ...
);
```

### The Mapping
```
auth.users.id → founders.auth_user_id → founders.id → assessments.founder_id
     ↓               ↓                      ↓              ↓
  (auth)         (link)                (profile)        (data)
```

## Test Results

✅ **Build successful** (553ms)
✅ **All 64 tests passing**
✅ **No TypeScript errors**
✅ **No runtime errors**

## Summary

The founder ID mapping is now **crystal clear** and follows a single, unbreakable rule:

1. **Get auth user** (`auth.users.id`)
2. **Fetch founder profile** (`founders` table via `auth_user_id`)
3. **Use founder.id** (`founders.id`) for ALL assessment operations

The "supa scoop" function `getFounderProfileIdOrThrow()` encapsulates this logic and ensures:
- ✅ Type safety (returns `string` of founders.id)
- ✅ Error handling (throws if profile missing)
- ✅ Clear documentation (comments explain the rule)
- ✅ Single source of truth (one function, one way)

**No more confusion. No more temp IDs. No more auth IDs in assessments.**

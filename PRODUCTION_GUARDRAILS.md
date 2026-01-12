# Production Stability Guardrails

**FounderFit Score™ v2.1**

This document details the production-stability guardrails implemented to ensure data quality and system reliability.

---

## 1. Supabase Health Gate

### Purpose
Prevents the application from loading when Supabase is misconfigured or unreachable, providing clear error messages and retry capabilities.

### Implementation

**Files**:
- `src/lib/healthCheck.ts` - Health check logic
- `src/components/HealthGate.tsx` - UI components
- `src/components/HealthGate.css` - Styling
- `src/App.tsx` - Integration

### What It Checks

#### Configuration Validation
```typescript
✓ VITE_SUPABASE_URL exists and is a valid URL
✓ VITE_SUPABASE_ANON_KEY exists and is a valid JWT token (>100 chars)
```

**Error Display**: Full-screen configuration error with setup instructions if validation fails.

#### Connectivity Validation
```typescript
✓ Auth service reachable (supabase.auth.getSession())
✓ Database reachable (lightweight query to founders table)
✓ 10-second timeout with graceful failure
```

**Error Display**: Full-screen connection error with:
- Diagnostic status for each service
- Retry button with loading state
- Troubleshooting suggestions

### User Experience

**On App Start**:
1. Shows "Starting FounderFit..." loading screen
2. Runs health checks in parallel (auth + database)
3. If healthy: App renders normally
4. If unhealthy: Shows appropriate error screen

**Error Screens**:

| Status | Display | Actions |
|--------|---------|---------|
| `CHECKING` | Spinner + "Checking Supabase connectivity..." | Wait |
| `CONFIG_ERROR` | ⚠️ + Configuration instructions | Fix .env, restart |
| `CONNECTION_ERROR` | 🔌 + Diagnostic details | Retry button |
| `HEALTHY` | None (app renders) | - |

**Retry Flow**:
- User clicks "Retry Connection"
- Button shows "Retrying..." (disabled)
- Health check runs again
- Updates to appropriate state based on result

### Route Protection

The `HealthGate` wraps the entire app, blocking **all routes** (including Survey and Results) until health check passes. No partial loading states or broken functionality.

---

## 2. Signal Integrity Index

### Purpose
Detects invalid or low-quality assessment responses to ensure data reliability for longitudinal analysis and cohort studies.

### Implementation

**Files**:
- `src/utils/scoring.ts` - `calculateSignalIntegrity()` function
- `src/types/assessment.types.ts` - Type definitions

### What It Checks

#### Check 1: Time to Complete Outliers

**Logic**:
```typescript
Expected range: 60 seconds (min) to 1800 seconds / 30 min (max)

Too fast (<60s):
  - <30s: HIGH severity, -30 points
  - 30-45s: MEDIUM severity, -20 points
  - 45-60s: LOW severity, -10 points

Too slow (>1800s):
  - LOW severity, -5 points (may indicate interruptions)
```

**Flag Example**:
```json
{
  "type": "time_outlier",
  "severity": "high",
  "message": "Assessment completed suspiciously fast (25s). Minimum expected: 60s.",
  "details": {
    "durationSeconds": 25,
    "expectedMin": 60,
    "speedRatio": 0.42
  }
}
```

#### Check 2: Inconsistent Pairs

**Logic**:
```typescript
Compares answers to related questions that should be logically consistent

Example pair (placeholder):
  Q: "I make fast decisions" → answer: 5 (strongly agree)
  Q: "I need extensive validation before deciding" → answer: 5 (strongly agree)

These contradict each other. Flag as inconsistent if |value1 - value2| > 2

Deduction: -15 points per violation (max -30 total)
```

**Current Status**: Placeholder array `INCONSISTENT_PAIRS` in `scoring.ts`. Populate with real pairs once questions are finalized.

**Flag Example**:
```json
{
  "type": "inconsistent_pair",
  "severity": "medium",
  "message": "Inconsistent responses detected: Decision speed contradiction",
  "details": {
    "question1": "C1",
    "question2": "C3",
    "value1": 5,
    "value2": 1
  }
}
```

#### Check 3: Straightlining Detection

**Logic**:
```typescript
Detects when respondent gives the same answer repeatedly

Threshold: 70% of answers are the same value

Example: 10/12 questions answered with "3" = 83% straightlining

Deduction:
  - 70-90% straightlining: -25 points, MEDIUM severity
  - >90% straightlining: -40 points, HIGH severity
```

**Flag Example**:
```json
{
  "type": "straightlining",
  "severity": "high",
  "message": "Straightlining detected: 92% of answers are the same value (3).",
  "details": {
    "mostCommonValue": "3",
    "percentage": 0.92,
    "occurrences": 11,
    "totalQuestions": 12
  }
}
```

#### Check 4: Extreme Pattern Detection

**Logic**:
```typescript
Detects when respondent only chooses extreme values

Extreme values:
  - Binary: 0 or 1 (both are extreme for binary)
  - Likert: 1 or 5 (strongly disagree or strongly agree only)

Threshold: 80% of answers are extreme values only

Deduction:
  - 80-95% extreme: -20 points, MEDIUM severity
  - >95% extreme: -30 points, HIGH severity
```

**Flag Example**:
```json
{
  "type": "extreme_pattern",
  "severity": "medium",
  "message": "Extreme response pattern: 83% of answers are extreme values (only 0, 1, or 5).",
  "details": {
    "extremeCount": 10,
    "totalQuestions": 12,
    "percentage": 0.83
  }
}
```

### Integrity Score Calculation

**Starting Point**: 100 (perfect integrity)

**Deductions**:
- Time outlier (fast): -10 to -30 depending on severity
- Time outlier (slow): -5
- Inconsistent pairs: -15 per violation (max -30)
- Straightlining: -25 to -40 depending on percentage
- Extreme patterns: -20 to -30 depending on percentage

**Final Score**: Clamped to 0-100

**Interpretation**:
```typescript
90-100: Excellent integrity (no significant concerns)
70-89:  Good integrity (minor patterns, generally valid)
50-69:  Questionable integrity (interpret with caution)
0-49:   Poor integrity (results may not be reliable)
```

### Usage in Assessment Flow

**During Survey**:
```typescript
const startTime = new Date(); // Record when survey starts

// ... user completes survey ...

const endTime = new Date(); // Record when survey completes

// Calculate integrity
const integrityResult = calculateSignalIntegrity(
  responses,
  startTime,
  endTime
);

// Calculate scores
const scores = calculateAssessmentScores(responses, questionTypes);

// Save to database with integrity tracking
const assessment = await createAssessment({
  founder_id: founderId,
  venture_id: ventureId,

  // Scores
  overall_score: scores.overallScore,
  force_thesis_integrity: scores.forceScores.thesis_integrity,
  force_learning_velocity: scores.forceScores.learning_velocity,
  force_decision_quality: scores.forceScores.decision_quality_under_load,
  force_talent_gravity: scores.forceScores.talent_gravity,
  force_delivery_control: scores.forceScores.delivery_control,
  force_resilience_economics: scores.forceScores.resilience_economics,

  // Integrity tracking (persisted to database)
  integrity_score: integrityResult.integrityScore,
  integrity_flags: integrityResult.flags,
  integrity_checks: integrityResult.checks,
  started_at: startTime.toISOString(),
  duration_seconds: Math.round((endTime.getTime() - startTime.getTime()) / 1000),

  assessment_version: 'v2.1',
  completed_at: endTime.toISOString()
});

// Also save individual responses
await createAssessmentResponses(responses.map(r => ({
  assessment_id: assessment.id,
  question_id: r.questionId,
  force: r.force,
  value: r.value,
  question_text: questions.find(q => q.id === r.questionId)?.text || ''
})));
```

**Admin View & Analysis**:

```typescript
// Get only high-integrity assessments for reliable cohort analysis
const reliableAssessments = await getHighIntegrityAssessments(); // >= 70

// Or use custom threshold
const excellentOnly = await getAssessmentsByIntegrityThreshold(90);

// Get assessments with specific flags
const straightliners = await getAssessmentsWithFlags('straightlining');

// Get overall statistics including integrity distribution
const stats = await getAssessmentStats();
console.log(stats.integrityDistribution);
// {
//   excellent: 45,  // 90-100
//   good: 32,       // 70-89
//   questionable: 8, // 50-69
//   poor: 3         // 0-49
// }

// Query high-integrity assessments view (SQL)
const { data } = await supabase
  .from('high_integrity_assessments')
  .select('*');

// Filter cohort analysis by integrity
const { data: cohorts } = await supabase
  .from('cohort_analysis')
  .select('*');
// Note: cohort_analysis view automatically excludes assessments without integrity data
```

**Use Cases**:
- Display integrity score alongside assessment scores on results page
- Filter dashboard to show only reliable assessments (>=70)
- Show integrity flags for questionable assessments in admin panel
- Use integrity as a filter or weight in cohort analysis
- Track integrity trends over time
- Identify patterns in low-integrity responses

---

## 3. Binary Question Normalization Fix

### Problem
Binary questions were normalized to 0-20 scale (`value / 5 * 100`), giving them less weight than Likert questions.

### Solution
Binary questions now normalize to 0-100 scale (`value * 100`):

```typescript
// OLD (INCORRECT)
binary 0 → 0 points   (0%)
binary 1 → 20 points  (20%)

// NEW (CORRECT)
binary 0 → 0 points   (0%)
binary 1 → 100 points (100%)
```

This ensures **equal weighting** between binary and Likert questions when calculating force scores.

### Impact

**Force Score Calculation**:
```
Old: If dimension has 3 binary questions answered as [1, 1, 1]:
     avg = (20 + 20 + 20) / 3 = 20 → Force score: 20

New: If dimension has 3 binary questions answered as [1, 1, 1]:
     avg = (100 + 100 + 100) / 3 = 100 → Force score: 100
```

**Mixed Questions**:
```
Dimension with 2 binary + 1 Likert (value=5):

Old: avg = (20 + 20 + 100) / 3 = 47 → Force score: 47
New: avg = (100 + 100 + 100) / 3 = 100 → Force score: 100
```

Binary questions now contribute equally to force scores, as intended by the psychometric design.

---

## Configuration

### Health Check Timeouts

**File**: `src/lib/healthCheck.ts`

```typescript
// Default timeout for health check
runHealthCheckWithTimeout(10000) // 10 seconds
```

Adjust if needed for slow network environments.

### Integrity Thresholds

**File**: `src/utils/scoring.ts`

```typescript
const INTEGRITY_CONFIG = {
  expectedTimeRange: {
    min: 60,    // Adjust based on question count
    max: 1800,  // 30 minutes
  },
  straightliningThreshold: 0.7, // 70%
  extremeThreshold: 0.8,         // 80%
};
```

**Tuning Recommendations**:
- **min time**: ~5 seconds per question (12 questions = 60s)
- **max time**: Allow for interruptions, but flag if excessive
- **straightlining**: Lower threshold (0.6) for more sensitive detection
- **extreme**: Adjust based on question design (some valid respondents may naturally choose extremes)

### Inconsistent Pairs

**File**: `src/utils/scoring.ts`

```typescript
const INCONSISTENT_PAIRS: InconsistentPair[] = [
  {
    question1Id: 'C1',
    question2Id: 'C3',
    description: 'Decision speed contradiction',
    checkFn: (v1, v2) => Math.abs(v1 - v2) <= 2,
  },
  // Add more pairs here once questions are finalized
];
```

**How to Add Pairs**:
1. Identify questions that should have logically consistent answers
2. Define the consistency check function
3. Add to the array with descriptive message

---

## Testing

### Health Gate Tests

**Manual Testing**:

1. **Config Error Test**:
   ```bash
   # Remove .env file
   rm .env
   npm run dev
   # Should show: Configuration Error screen
   ```

2. **Connection Error Test**:
   ```bash
   # Use invalid Supabase URL
   VITE_SUPABASE_URL=https://invalid.supabase.co
   npm run dev
   # Should show: Cannot Reach Backend screen
   # Click Retry → should retry and show result
   ```

3. **Healthy State Test**:
   ```bash
   # With valid .env
   npm run dev
   # Should show: Brief "Starting FounderFit..." then render app
   ```

### Integrity Index Tests

**Unit Testing** (placeholder for future):
```typescript
import { calculateSignalIntegrity } from '@/utils/scoring';

// Test 1: Fast completion
const responses = [...]; // 12 responses
const startTime = new Date('2024-01-01T10:00:00');
const endTime = new Date('2024-01-01T10:00:30'); // 30 seconds

const result = calculateSignalIntegrity(responses, startTime, endTime);
expect(result.integrityScore).toBeLessThan(100);
expect(result.flags.some(f => f.type === 'time_outlier')).toBe(true);

// Test 2: Straightlining
const straightlineResponses = Array(12).fill({ questionId: 'Q1', force: 'thesis_integrity', value: 3 });
const result2 = calculateSignalIntegrity(straightlineResponses, start, end);
expect(result2.flags.some(f => f.type === 'straightlining')).toBe(true);

// Test 3: Valid responses
const validResponses = [varied responses with normal timing];
const result3 = calculateSignalIntegrity(validResponses, start, end);
expect(result3.integrityScore).toBeGreaterThanOrEqual(90);
```

---

## Deployment Checklist

Before going to production:

- [ ] Verify `.env` has correct Supabase credentials
- [ ] Test health gate with invalid credentials (should show error)
- [ ] Test health gate with network disconnected (should show connection error)
- [ ] Verify retry button works in connection error state
- [ ] Complete at least one full assessment to test integrity scoring
- [ ] Review integrity thresholds and adjust if needed
- [ ] Populate INCONSISTENT_PAIRS with real question relationships
- [ ] Test assessment with various timing patterns
- [ ] Verify binary normalization: complete assessment with all binary=1, check force scores
- [ ] Document any configuration changes made

---

## Monitoring Recommendations

**Track in Production**:
1. **Health Check Failures**: Log when health gate blocks app load
2. **Integrity Scores**: Monitor distribution of integrity scores
3. **Integrity Flags**: Track frequency of each flag type
4. **Binary Question Scores**: Verify scoring looks correct after normalization fix

**Alerting Thresholds**:
- Health check failure rate > 5%
- Average integrity score < 70
- Straightlining flag rate > 10%
- Time outlier (fast) rate > 15%

---

## Future Enhancements

1. **Adaptive Integrity Thresholds**: Adjust based on observed distributions
2. **Machine Learning**: Train model to detect subtle invalid patterns
3. **Real-Time Feedback**: Warn users during survey if patterns detected
4. **Admin Dashboard**: Visualize integrity metrics over time
5. **Automated Flagging**: Auto-exclude low-integrity responses from cohort analysis

---

**All production guardrails are now active and ready for deployment.**

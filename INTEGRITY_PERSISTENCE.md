# Signal Integrity Persistence - Implementation Summary

**Date**: Added as part of production guardrails implementation
**Migration**: `002_add_integrity_tracking.sql`

---

## Overview

Signal Integrity Index data is now **persisted to the database** alongside assessment scores. This enables longitudinal analysis of data quality, filtering of low-integrity assessments, and tracking of validity patterns over time.

---

## Database Changes

### New Columns in `assessments` Table

| Column | Type | Description |
|--------|------|-------------|
| `integrity_score` | INTEGER (0-100) | Overall validity score. Higher = better. NULL for legacy assessments. |
| `integrity_flags` | JSONB | Array of flag objects: `[{type, severity, message, details}]` |
| `integrity_checks` | JSONB | Detailed check results: `{timeToComplete, inconsistentPairs, straightlining, extremePatterns}` |
| `started_at` | TIMESTAMPTZ | When founder started the assessment (first question viewed) |
| `duration_seconds` | INTEGER | Time to complete in seconds. Used for time outlier detection. |

### Indexes Added

```sql
-- Filter assessments by integrity score
CREATE INDEX idx_assessments_integrity_score ON assessments(integrity_score);

-- Common admin query: integrity + date
CREATE INDEX idx_assessments_integrity_created ON assessments(integrity_score, created_at DESC);
```

### Updated Views

**`founder_assessment_history`**
- Now includes: `integrity_score`, `integrity_flags`, `duration_seconds`, `started_at`
- Shows integrity data alongside scores for founder dashboards

**`cohort_analysis`**
- Now includes: `avg_integrity_score`, integrity distribution counts
- Automatically excludes assessments without integrity data (`WHERE integrity_score IS NOT NULL`)
- Shows breakdown by integrity level (excellent/good/questionable/poor)

### New View: `high_integrity_assessments`

Pre-filtered view of assessments with `integrity_score >= 70` (excellent or good integrity):

```sql
SELECT * FROM high_integrity_assessments;
-- Returns only reliable assessments with full founder/venture context
```

**Use case**: Quick access to reliable data for cohort analysis without writing WHERE clauses.

---

## TypeScript Type Updates

### `Assessment` Interface

```typescript
export interface Assessment {
  // ... existing fields ...

  // Signal Integrity tracking (NEW)
  integrity_score: number | null;
  integrity_flags: IntegrityFlag[] | null;
  integrity_checks: Record<string, any> | null;
  started_at: string | null;
  duration_seconds: number | null;
}
```

### `AssessmentSubmission` Interface

```typescript
export interface AssessmentSubmission {
  // ... score fields ...

  // Signal Integrity tracking (NEW - REQUIRED)
  integrity_score: number;
  integrity_flags: IntegrityFlag[];
  integrity_checks: SignalIntegrityResult['checks'];
  started_at: string;
  duration_seconds: number;

  // ... metadata ...
}
```

---

## Saving Assessments with Integrity Data

### Full Example

```typescript
import {
  calculateAssessmentScores,
  calculateSignalIntegrity
} from '@/utils/scoring';
import { createAssessment, createAssessmentResponses } from '@/lib/database';

// 1. Track start time when survey begins
const startTime = new Date();

// 2. Collect responses as user completes survey
const responses: QuestionResponse[] = [
  { questionId: 'A1', force: 'thesis_integrity', value: 1 },
  // ... all responses
];

// 3. Track end time when survey completes
const endTime = new Date();

// 4. Calculate scores
const scores = calculateAssessmentScores(responses, questionTypes);

// 5. Calculate integrity
const integrity = calculateSignalIntegrity(responses, startTime, endTime);

// 6. Save to database with integrity tracking
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

  // Integrity tracking (REQUIRED)
  integrity_score: integrity.integrityScore,
  integrity_flags: integrity.flags,
  integrity_checks: integrity.checks,
  started_at: startTime.toISOString(),
  duration_seconds: Math.round((endTime.getTime() - startTime.getTime()) / 1000),

  assessment_version: 'v2.1',
  completed_at: endTime.toISOString()
});

// 7. Save individual responses
await createAssessmentResponses(
  responses.map(r => ({
    assessment_id: assessment.id,
    question_id: r.questionId,
    force: r.force,
    value: r.value,
    question_text: questions.find(q => q.id === r.questionId)?.text || ''
  }))
);
```

---

## Querying by Integrity

### Get High-Integrity Assessments Only

```typescript
import { getHighIntegrityAssessments } from '@/lib/database';

// Get only assessments with integrity >= 70
const reliable = await getHighIntegrityAssessments();
```

### Custom Integrity Threshold

```typescript
import { getAssessmentsByIntegrityThreshold } from '@/lib/database';

// Get only excellent integrity (>= 90)
const excellent = await getAssessmentsByIntegrityThreshold(90);

// Get good or better (>= 70)
const goodOrBetter = await getAssessmentsByIntegrityThreshold(70);
```

### Find Specific Integrity Flags

```typescript
import { getAssessmentsWithFlags } from '@/lib/database';

// Get all assessments flagged for straightlining
const straightliners = await getAssessmentsWithFlags('straightlining');

// Get all assessments flagged for time outliers
const speeders = await getAssessmentsWithFlags('time_outlier');
```

### Get Statistics with Integrity Breakdown

```typescript
import { getAssessmentStats } from '@/lib/database';

const stats = await getAssessmentStats();

console.log(stats);
// {
//   totalAssessments: 100,
//   avgOverallScore: 72,
//   forceAverages: { ... },
//   avgIntegrityScore: 78,
//   integrityDistribution: {
//     excellent: 45,     // 90-100
//     good: 32,          // 70-89
//     questionable: 18,  // 50-69
//     poor: 5            // 0-49
//   },
//   assessmentsWithIntegrity: 100
// }
```

---

## SQL Queries for Analysis

### Filter by Integrity Score

```sql
-- Get all assessments with poor integrity for review
SELECT
  id,
  founder_id,
  overall_score,
  integrity_score,
  integrity_flags,
  duration_seconds
FROM assessments
WHERE integrity_score < 50
ORDER BY created_at DESC;
```

### Integrity Score Distribution

```sql
SELECT
  CASE
    WHEN integrity_score >= 90 THEN 'Excellent (90-100)'
    WHEN integrity_score >= 70 THEN 'Good (70-89)'
    WHEN integrity_score >= 50 THEN 'Questionable (50-69)'
    ELSE 'Poor (0-49)'
  END as integrity_level,
  COUNT(*) as count,
  ROUND(AVG(overall_score), 1) as avg_overall_score
FROM assessments
WHERE integrity_score IS NOT NULL
GROUP BY integrity_level
ORDER BY MIN(integrity_score) DESC;
```

### Find Assessments with Specific Flags

```sql
-- Find all assessments with straightlining flags
SELECT
  id,
  founder_id,
  overall_score,
  integrity_score,
  integrity_flags
FROM assessments
WHERE integrity_flags::text LIKE '%straightlining%'
ORDER BY created_at DESC;
```

### Compare Force Scores by Integrity Level

```sql
SELECT
  CASE
    WHEN integrity_score >= 90 THEN 'Excellent'
    WHEN integrity_score >= 70 THEN 'Good'
    WHEN integrity_score >= 50 THEN 'Questionable'
    ELSE 'Poor'
  END as integrity_level,
  ROUND(AVG(force_thesis_integrity), 1) as avg_thesis,
  ROUND(AVG(force_learning_velocity), 1) as avg_learning,
  ROUND(AVG(force_decision_quality), 1) as avg_decision,
  COUNT(*) as count
FROM assessments
WHERE integrity_score IS NOT NULL
GROUP BY integrity_level
ORDER BY MIN(integrity_score) DESC;
```

---

## Use Cases

### 1. Founder Dashboard
**Show integrity score on results page**

```typescript
const assessment = await getAssessment(assessmentId);

// Display to founder:
// Overall Score: 75
// Integrity Score: 92 (Excellent)
// [Green badge if >= 70, yellow if 50-69, red if < 50]
```

### 2. Admin Panel - Data Quality Monitoring

```typescript
const stats = await getAssessmentStats();

// Dashboard widgets:
// - Total assessments with integrity data
// - Average integrity score (trending over time)
// - Distribution pie chart (excellent/good/questionable/poor)
// - Alert if poor integrity rate > 10%
```

### 3. Cohort Analysis - Filtered by Quality

```typescript
// Only analyze high-integrity assessments
const { data: cohorts } = await supabase
  .from('cohort_analysis')
  .select('*');

// cohort_analysis view automatically filters integrity_score IS NOT NULL
// For stricter filtering:
const highIntegrityOnly = await getHighIntegrityAssessments();
// Then analyze manually
```

### 4. Research - Pattern Analysis

```sql
-- Do straightliners tend to score lower?
SELECT
  CASE
    WHEN integrity_flags::text LIKE '%straightlining%' THEN 'Has straightlining'
    ELSE 'No straightlining'
  END as pattern,
  COUNT(*) as count,
  ROUND(AVG(overall_score), 1) as avg_score,
  ROUND(AVG(integrity_score), 1) as avg_integrity
FROM assessments
WHERE integrity_score IS NOT NULL
GROUP BY pattern;
```

### 5. Founder Communication

If integrity is low, provide helpful feedback:

```typescript
if (integrity.integrityScore < 70) {
  const feedback = getIntegrityAssessment(integrity.integrityScore);

  // Show message to founder:
  // "We noticed some patterns in your responses that may affect result reliability.
  //  For best results, please take your time and answer thoughtfully."

  // List flags with helpful guidance:
  integrity.flags.forEach(flag => {
    if (flag.type === 'time_outlier' && flag.severity === 'high') {
      // "You completed this very quickly. Consider retaking for more accurate results."
    }
  });
}
```

---

## Migration Instructions

### For Existing Deployments

If you already have the initial schema (`001_initial_schema.sql`) running:

1. **Run Migration 002**:
   - Go to Supabase Dashboard > SQL Editor
   - Copy contents of `supabase/migrations/002_add_integrity_tracking.sql`
   - Paste and run

2. **Existing Assessments**:
   - Will have `integrity_score = NULL`
   - Will not appear in `cohort_analysis` view (filters NULL)
   - Will not appear in `high_integrity_assessments` view
   - This is intentional - only track validity for new assessments

3. **Update Application Code**:
   - Ensure all new assessments include integrity data
   - Update results pages to display integrity score
   - Update admin panels to show integrity statistics

### For New Deployments

Run both migrations in order:
1. `001_initial_schema.sql` (creates base tables)
2. `002_add_integrity_tracking.sql` (adds integrity fields)

---

## Benefits

1. **Data Quality Assurance**: Filter out unreliable assessments from analysis
2. **Longitudinal Tracking**: Monitor data quality trends over time
3. **Research Validity**: Support publishable research with documented validity metrics
4. **Founder Feedback**: Provide helpful guidance when integrity is low
5. **Admin Insights**: Understand patterns in low-quality responses
6. **Weighted Analysis**: Use integrity as a weight in cohort studies
7. **Audit Trail**: Full record of assessment validity for compliance

---

## Future Enhancements

1. **Automated Flagging**: Auto-hide or weight low-integrity assessments in cohort reports
2. **Trend Analysis**: Dashboard showing integrity scores over time
3. **Predictive Validity**: Correlate integrity patterns with venture outcomes
4. **Real-Time Feedback**: Warn founders during survey if patterns detected
5. **Adaptive Thresholds**: Adjust integrity thresholds based on observed distributions
6. **Machine Learning**: Train models to detect subtle validity issues

---

**All integrity persistence features are now live and ready for production use.**

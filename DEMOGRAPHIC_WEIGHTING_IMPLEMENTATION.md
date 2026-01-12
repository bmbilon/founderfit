# Demographic-Driven Weighting Implementation

## Overview

Successfully implemented a demographic-first flow where founder demographics determine scoring weights (NOT direct score adjustments). Demographics shape how execution forces are weighted in the final score calculation, and generate narrative context displayed separately from the numeric score.

## Key Principle

**Demographics change WEIGHTING, not SCORING**
- Demographics do NOT add or subtract points from the score
- Demographics determine the WEIGHTS used in calculating the weighted average of force scores
- The final score is a weighted average where weights are driven by demographic profile

## Implementation Summary

### 1. Data & Types

**Created: `src/data/demographics.ts`**
- New demographic types focused on founder context:
  - `CofounderCount`: 'solo' | 'two' | 'three' | 'four_plus'
  - `AgeBracket`: 9 age brackets from under_25 to 60_plus
  - `IndustryExperience`: '0_1' to '11_plus' years
  - `PriorStartups`: '0' to '3_plus'
  - `PriorExits`: '0' to '2_plus' (acquisition or IPO)

- `DemographicAnswers`: Raw answers from users
- `DemographicProfile`: Processed buckets for weighting logic
- `validateDemographicAnswers()`: Validates completeness
- `buildDemographicProfile()`: Converts answers to profile

**Questions Collected:**
1. Co-founder count (drives primary weighting branch)
2. Age bracket
3. Years of relevant industry experience
4. Prior startups founded
5. Prior successful exits

### 2. Weighting Logic

**Created: `src/utils/weighting.ts`**

#### Base Weight Templates

**Solo Founder Weights:**
- Emphasizes: Delivery Control (0.20), Decision Quality (0.18), Resilience (0.18)
- De-emphasizes: Talent Gravity (0.12)
- Rationale: Solo founders must ship alone, make all decisions, avoid burnout

**Two-Three Founder Weights:**
- Balanced with emphasis on Talent Gravity (0.18)
- Rationale: Optimal team size, co-founder dynamics critical

**Four+ Founder Weights:**
- Emphasizes: Thesis Integrity (0.18), Delivery Control (0.20), Decision Quality (0.18)
- De-emphasizes: Talent Gravity (0.14), Learning Velocity (0.14)
- Rationale: Coordination overhead, alignment challenges

#### Delta Adjustments

Applied after base selection, max ±0.02 per adjustment:
- **Industry Experience ≥4 years:**
  - +0.02 to Thesis Integrity
  - +0.01 to Learning Velocity
- **Prior Successful Exits ≥1:**
  - +0.02 to Decision Quality Under Load
  - +0.01 to Delivery Control

#### Normalization

Weights always renormalized to sum = 1.0 after deltas applied.

### 3. Scoring Integration

**Updated: `src/utils/scoring.ts`**

**Key Changes:**
- Removed FAC model references (demographic point adjustments)
- Updated `calculateOverallScore()` to accept optional `demographics` parameter
- Changed from simple average to **weighted average**:
  ```typescript
  // Old: simple average
  overallScore = sum(forceScores) / 6

  // New: weighted average
  overallScore = sum(forceScores[i] * weights[i])
  ```
- Added `getWeightProfile()` for admin access to see weights

**calculateAssessmentScores():**
- Now accepts `demographics` as 3rd parameter
- Passes demographics to `calculateOverallScore()`
- Maintains backward compatibility (undefined demographics = equal weights)

### 4. Narrative Generation

**Created: `src/utils/weighting.ts` (narrative functions)**

Generates context displayed separately from numeric score:

**Four Narrative Dimensions:**
1. **Cofounder Context**: Team structure strengths/risks
2. **Age Context**: Career stage implications
3. **Industry Experience Context**: Opportunity discovery implications
4. **Prior Exits Context**: Credibility and learning context

**Example Narratives:**
- Solo: "High autonomy and speed, but risk of burnout and blind spots..."
- Two founders: "Optimal for speed and decision-making. Ensure clear role division..."
- Deep industry expertise: "Strong pattern recognition and credibility. Guard against over-indexing..."

### 5. Assessment Submission

**Updated: `src/utils/assessmentSubmission.ts`**

**Key Changes:**
- Removed FAC calculation logic
- Updated `loadDemographicData()` to return `DemographicAnswers`
- Pass demographics to `calculateOverallScore()` for weighted scoring
- Store demographics in `metadata.demographics` (JSONB)
- Set FAC-related fields to null:
  ```typescript
  demographic_responses: null,
  fac_score: null,
  demographic_modifier: null,
  ```

**Data Flow:**
1. Load demographics from localStorage
2. Load survey responses
3. Calculate force scores (unchanged)
4. Calculate overall score WITH demographic weights
5. Store assessment with demographics in metadata

### 6. UI Updates

**Updated: `src/pages/DemographicsPage.tsx`**
- Updated to use new `DemographicAnswers` types
- Added helper text display for questions
- Updated subtitle: "shapes how we interpret your assessment results"
- Maintains Step 1 of 2 flow

**Updated: `src/pages/ResultsPage.tsx`**
- Extracts demographics from `assessment.metadata.demographics`
- Builds weight profile and narrative
- Displays new "Your Founder Context" section with:
  - Team Structure context
  - Career Stage context
  - Industry Experience context
  - Founder Experience context
- Note explaining context is separate from execution score

### 7. Testing

**Created: `src/utils/weighting.test.ts`**

10 new tests covering:
- Solo/two-three/four+ weight selection
- Industry experience deltas
- Prior exits deltas
- Weight normalization (sum = 1.0)
- Narrative generation
- Default profile (equal weights)

**Updated: `src/utils/scoring.test.ts`**
- Fixed 5 tests to pass `undefined` for demographics parameter
- All 37 original tests still passing

**Test Results:**
- 47 total tests passing
- 2 test files (scoring + weighting)
- Build passes cleanly (749ms)
- No TypeScript errors

## Database Schema

Demographics stored in `assessments.metadata`:
```json
{
  "metadata": {
    "demographics": {
      "cofounder_count": "solo",
      "age_bracket": "30_34",
      "industry_experience": "7_10",
      "prior_startups": "1",
      "prior_exits": "0"
    }
  }
}
```

Existing columns remain for backward compatibility:
- `demographic_responses`: null
- `fac_score`: null
- `demographic_modifier`: null

## Example: How Weighting Works

**Scenario: Solo founder, 7 years industry experience, no exits**

1. **Base Weights** (solo branch):
   - Thesis Integrity: 0.16
   - Learning Velocity: 0.16
   - Decision Quality: 0.18
   - Talent Gravity: 0.12
   - Delivery Control: 0.20
   - Resilience Economics: 0.18

2. **Apply Delta** (7 years experience):
   - Thesis Integrity: 0.16 + 0.02 = 0.18
   - Learning Velocity: 0.16 + 0.01 = 0.17
   - (Others unchanged)

3. **Normalize** to sum = 1.0:
   - New sum: 1.03
   - Divide all by 1.03
   - Final weights sum to exactly 1.0

4. **Calculate Score**:
   ```
   Overall Score =
     (Thesis * 0.175) +
     (Learning * 0.165) +
     (Decision * 0.175) +
     (Talent * 0.117) +
     (Delivery * 0.194) +
     (Resilience * 0.175)
   ```

5. **Generate Narrative**:
   - Cofounder: "Solo founder: High autonomy..."
   - Age: "Peak-experience founder..."
   - Industry: "Deep industry expertise..."
   - Exits: "Experienced founder without exits..."

## Key Differences from FAC Model

| Aspect | FAC Model (Removed) | Weighting Model (New) |
|--------|-------------------|----------------------|
| **Score Impact** | Added/subtracted points | Changes weights only |
| **Formula** | Score + (modifier) | Weighted average |
| **Range** | ±22 points shift | Weights 0-1, sum=1 |
| **Visibility** | Hidden proprietary | Transparent weighting |
| **Philosophy** | Demographics as advantage | Demographics as context |

## Files Modified

### Created:
- `src/data/demographics.ts` (170 lines) - NEW demographic questions & types
- `src/utils/weighting.ts` (307 lines) - NEW weighting logic & narratives
- `src/utils/weighting.test.ts` (186 lines) - NEW weighting tests

### Updated:
- `src/utils/scoring.ts` - Weighted average scoring
- `src/utils/assessmentSubmission.ts` - Store in metadata, use weights
- `src/pages/DemographicsPage.tsx` - New questions & types
- `src/pages/ResultsPage.tsx` - Display narrative context
- `src/utils/scoring.test.ts` - Fixed parameter order

### Deleted:
- `src/utils/demographicScoring.ts` - Old FAC model removed

## Verification

✅ Build passes (749ms)
✅ All 47 tests pass (9ms)
✅ No TypeScript errors
✅ No breaking changes
✅ Signal integrity unchanged
✅ Backward compatible (demographics optional)

## Next Steps (Not Implemented)

1. **Database Migration**
   - No new columns needed (using metadata JSONB)
   - Consider removing deprecated FAC columns in future

2. **Admin Panel**
   - Display weight profiles for each assessment
   - Show how demographics affected weighting
   - Cohort analysis by demographic buckets

3. **Weight Tuning**
   - Collect outcome data by demographic profile
   - Refine base weights and deltas based on actual correlation
   - A/B test different weight configurations

4. **Extended Narratives**
   - Add coaching recommendations based on profile
   - Provide specific action items per demographic bucket
   - Link to resources tailored to founder context

## Security & Privacy

- Demographics stored in metadata (standard JSONB column)
- Weighting logic is transparent (not proprietary)
- Narrative generation is deterministic and inspectable
- No PII collected (age brackets, not exact ages)
- Users see narrative context explaining how demographics matter

## Summary

Successfully implemented demographic-driven weighting system where:
- Demographics determine HOW execution forces are weighted
- NO points added/subtracted from score
- Narrative context displayed separately from numeric score
- Weighted average calculation replaces simple average
- All tests passing, build clean, no breaking changes
- Signal integrity logic completely unchanged

The system now provides context-aware scoring while maintaining the integrity and fairness of the execution assessment.

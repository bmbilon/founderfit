# FounderFit v5 Acceptance Tests

## Code Enforcement Locations

### A) Attention Check Fail (V1, V7)
**Location:** Line 1793-1813 in `scoreValidity()` function
```javascript
if (v1 && v1.value !== 5) {
    penalties.push({ reason: 'attention_fail_V1', amount: 15 });
    flags.push('attention_fail_V1');
}
if (v7 && v7.value !== 1) {
    penalties.push({ reason: 'attention_fail_V7', amount: 15 });
    flags.push('attention_fail_V7');
}
```
**Test:** Answer V1 with anything other than "Strongly agree" OR V7 with anything other than "Strongly disagree"
**Expected:** validity drops by 15 points, flag appears in results

### B) Too Perfect Signal (V2, V5)
**Location:** Line 1816-1825 in `scoreValidity()` function
```javascript
if (v2 && v2.value === 5) {
    penalties.push({ reason: 'too_perfect_V2', amount: 10 });
    flags.push('too_perfect_signal');
}
if (v5 && v5.value >= 4) {
    penalties.push({ reason: 'too_perfect_V5', amount: 8 });
    flags.push('too_perfect_signal');
}
```
**Test:** Answer V2="Strongly Agree" OR V5="Agree/Strongly Agree"
**Expected:** validity drops by 8-10 points, "too_perfect_signal" flag appears

### C) Consistency Check (A5 vs V3)
**Location:** Line 1828-1833 in `scoreValidity()` function
```javascript
if (a5 && v3 && a5.value >= 4 && v3.value >= 4) {
    penalties.push({ reason: 'inconsistency_openness', amount: 12 });
    flags.push('inconsistency_openness');
}
```
**Test:** Answer A5 (discomfort with uncertainty) high (4-5) AND V3 (comfort with uncertainty) also high (4-5)
**Expected:** validity drops by 12 points, "inconsistency_openness" flag appears

### D) Success Index Gating
**Location:** Line 2207-2215 in `calculateScores()` function
```javascript
if (validity.validity >= 60) {
    const success = scoreSuccessIndex(traits, validity, contextData);
    successResult = success;
} else {
    successResult = { successIndex: null, note: 'Success index suppressed due to low validity' };
}
```
**Test 1:** Achieve validity=55
**Expected:** successIndex is null, suppression message displays

**Test 2:** Achieve validity=85 with average traits
**Expected:** successIndex displays between 0-100

### E) Option Bias Mitigation
**Location:** Line 1574-1596 in `buildQuestionsForSession()` function
```javascript
const SESSION_SEED = Date.now() + Math.random();
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
// Binary option shuffling
if (q.type === 'binary' && q.options.length === 2) {
    const shouldFlip = seededRandom(SESSION_SEED + i) > 0.5;
    if (shouldFlip) {
        q.options = [q.options[1], q.options[0]];
    }
}
```
**Test:** Reload page twice, inspect at least one binary question
**Expected:** Option order differs between sessions but remains stable within same session

## Supabase Schema Requirements

New columns needed in `test_reports` table:

```sql
ALTER TABLE test_reports ADD COLUMN overall_trait_score INTEGER;
ALTER TABLE test_reports ADD COLUMN validity_score INTEGER;
ALTER TABLE test_reports ADD COLUMN validity_flags JSONB;
ALTER TABLE test_reports ADD COLUMN confidence_band TEXT;
ALTER TABLE test_reports ADD COLUMN success_index INTEGER;
ALTER TABLE test_reports ADD COLUMN context JSONB;
```

Note: `overall_score` column can be deprecated in favor of `overall_trait_score`

## Data Flow Verification

1. **Questions:** 30 total (22 core + 8 validity)
2. **Scoring Pipeline:** scoreTraits() → scoreValidity() → scoreSuccessIndex()
3. **Context Required:** ageBucket + domainExp (minimum)
4. **Persistence:** All fields saved to Supabase including responses, context, validity, success_index

## Session Stability

- `SESSION_SEED` created once at line 2063
- `sessionQuestions = buildQuestionsForSession()` called once at line 2064
- `questions` aliased to `sessionQuestions` at line 2065
- Never regenerated during session

## Non-Negotiables Checklist

- [x] 30 questions active (22 core + 8 validity)
- [x] Option shuffling per session (binary only, stable within session)
- [x] Reverse scoring implemented (F3 nonlinear at line 1718)
- [x] Complete scoring pipeline (traits → validity → success)
- [x] Context collection (ageBucket + domainExp required)
- [x] All metrics displayed (traits, validity, success/suppression)
- [x] Full Supabase persistence (all new fields)
- [x] Validity gating enforced (success_index null if validity < 60)

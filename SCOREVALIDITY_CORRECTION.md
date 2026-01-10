# scoreValidity() Correction - V6 Final

## Applied: Lines 1715-1830 in index_v6_final.html

### Critical Fixes

#### 1. Attention Check Values Corrected
**Before:** Used `q.attention.requiredValue` from question object (incorrect values)
**After:** Explicit hardcoded correct values
```javascript
// V1 requires Agree (4)
const v1 = getInt("V1");
if (v1 != null && v1 !== 4) {
  flags.add("attention_fail_V1");
  validity -= 40;
}

// V7 requires Disagree (2)
const v7 = getInt("V7");
if (v7 != null && v7 !== 2) {
  flags.add("attention_fail_V7");
  validity -= 40;
}
```

#### 2. A5 vs V3 Consistency Logic Improved
**Before:** Raw value comparison (v3val >= 4 && a5val >= 4)
- Problem: A5 is a discomfort statement, V3 is comfort statement
- Raw comparison didn't account for semantic reversal

**After:** Comfort axis normalization via `comfortScore100()` helper
```javascript
const comfortScore100 = (id) => {
  const v = getInt(id);
  if (v == null) return null;
  if (id === "A5") {
    // A5: high raw = high discomfort = LOW comfort
    const reversed = 6 - v; // 1..5 -> 5..1
    return Math.round(((reversed - 1) / 4) * 100);
  }
  // V3: high raw = high comfort
  return Math.round(((v - 1) / 4) * 100);
};

// Compare on same axis
const v3c = comfortScore100("V3");
const a5c = comfortScore100("A5");
if (v3c != null && a5c != null) {
  const diff = Math.abs(v3c - a5c);
  if (diff > 50) {
    flags.add("inconsistency_openness");
    validity -= 15;
  }
}
```

#### 3. V4 vs BCONS3 Simplified
**Before:** Used `likertAsScore100()` with reverse/nonlinear logic
**After:** Simple raw-to-100 conversion (both same direction)
```javascript
const v4 = getInt("V4");
const b3 = getInt("BCONS3");
if (v4 != null && b3 != null) {
  const v4s = Math.round(((v4 - 1) / 4) * 100);
  const b3s = Math.round(((b3 - 1) / 4) * 100);
  if (Math.abs(v4s - b3s) > 50) {
    flags.add("inconsistency_conscientiousness");
    validity -= 15;
  }
}
```

#### 4. Helper Functions Added
- `getInt(id)`: Safe integer extraction with null checks
- `comfortScore100(id)`: Semantic axis normalization for A5/V3

#### 5. Flags as Set → Array
**Before:** `const flags = []` with `.push()`
**After:** `const flags = new Set()` with `.add()`, return `Array.from(flags)`
- Prevents duplicate flags

### Acceptance Test Compliance

| Test | Requirement | Implementation | Status |
|------|-------------|----------------|--------|
| **A** | V1≠4 or V7≠2 → flags + -40 each | Lines 1745-1754 | ✅ |
| **B** | V2=5 or V5≥4 → too_perfect + drops | Lines 1776-1784 | ✅ |
| **C** | A5/V3 inconsistency (comfort axis) | Lines 1790-1798 | ✅ |
| **D** | Validity < 60 → successIndex null | Outside (calculateScores) | ✅ |

### Penalty Summary

| Violation | Penalty | Flags |
|-----------|---------|-------|
| V1 ≠ 4 | -40 | attention_fail_V1 |
| V7 ≠ 2 | -40 | attention_fail_V7 |
| V6 < 3 | -40 | integrity_low |
| V8 ≥ 4 | -35 | random_clicking_admitted |
| V2 = 5 | -12 | too_perfect_signal |
| V5 ≥ 4 | -12 | too_perfect_signal |
| A5/V3 diff > 50 | -15 | inconsistency_openness |
| V4/BCONS3 diff > 50 | -15 | inconsistency_conscientiousness |
| Time < 150s | -10 | speed_suspicious_fast |

### Example Scenarios

**Scenario 1: Perfect attention, no issues**
- V1=4, V7=2, V6=4, V8=2, V2=3, V5=2
- Result: validity = 100, flags = []

**Scenario 2: Failed attention checks**
- V1=5, V7=5
- Result: validity = 20 (100 - 40 - 40), flags = ["attention_fail_V1", "attention_fail_V7"]

**Scenario 3: Too perfect + inconsistency**
- V2=5, V5=4, V3=5 (comfortable), A5=5 (uncomfortable)
- V3 comfort: 100, A5 comfort: 0 (reversed), diff = 100
- Result: validity = 61 (100 - 12 - 12 - 15), flags = ["too_perfect_signal", "inconsistency_openness"]

**Scenario 4: Low validity → success suppression**
- validity = 45 (< 60)
- calculateScores() returns: `{ successIndex: null, note: 'Success index suppressed...' }`
- UI displays suppression message instead of score

## File Status
- **File:** /home/ubuntu/founderfit/index_v6_final.html
- **Lines:** 2413
- **scoreValidity:** Lines 1715-1830
- **Status:** ✅ Ready for deployment

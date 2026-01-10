# Blocker Fixes - index_v5_fixed.html

## All 7 Blockers Fixed

### 1. HTML Comment Inside Script Tag ✅
**Line 1234-1239** (was HTML comment, now JavaScript comment)
```javascript
/* FOUNDERFIT V5 INSTRUMENT
   30-question instrument (22 core + 8 validity)
   - option-order shuffling (kills "2nd option always better" + far-right bias)
   - reverse-scoring + nonlinear scoring
   - trait scoring + validity scoring + success index using context priors
*/
```

### 2. Duplicate const questions Declaration ✅
**Removed duplicate at line 1653**
- Kept only: `const sessionQuestions = buildQuestionsForSession();` at line 2063
- Kept alias: `const questions = sessionQuestions;` at line 2064

### 3. showQuestion() Container ID ✅
**Line 2089** - Fixed to use correct ID
```javascript
const container = document.getElementById('questions-container'); // was 'question-container'
```

### 4. showQuestion() Progress Selectors ✅
**Lines 2090-2096** - Fixed to use correct class selectors
```javascript
const progress = document.querySelector('.progress-fill'); // was getElementById('progress-bar')
const currentQText = document.querySelector('.current-question'); // was getElementById('progress-text')
const totalQText = document.querySelector('.total-questions'); // new
```

### 5. selectOption() CSS Class ✅
**Lines 2135-2136** - Changed to match CSS stylesheet
```javascript
document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected')); // was 'checked'
event.target.closest('.option').classList.add('selected'); // was 'checked'
```
CSS uses `.option.selected` at line 427

### 6. Acceptance Test C - Raw A5/V3 Contradiction ✅
**Lines 1776-1791** - Fixed to use raw values
```javascript
// V3 vs A5 (raw contradiction check)
// V3: "I'm comfortable with uncertainty" (high = comfortable)
// A5: "I feel discomfort when outcomes are unpredictable" (high = uncomfortable)
// If BOTH are high (>=4), that's contradictory
{
  const v3 = responsesMap["V3"];
  const a5 = responsesMap["A5"];
  if (v3 && a5) {
    const v3val = parseInt(v3.value, 10);
    const a5val = parseInt(a5.value, 10);
    if (v3val >= 4 && a5val >= 4) {
      flags.push("inconsistency_openness");
      validity -= 15;
    }
  }
}
```

### 7. nextQuestion() Container Hiding ✅
**Lines 2149-2152** - Fixed to hide only questions container, not parent
```javascript
// All questions answered - show context collection
document.getElementById('questions-container').style.display = 'none'; // was 'survey-container'
document.getElementById('button-group').style.display = 'none';
document.getElementById('context-collection').style.display = 'block';
```

Context collection is inside `survey-container` → `content` div, so hiding the parent would prevent context from showing.

## Verification

All fixes verified in index_v5_fixed.html (2361 lines)

### Code Location Summary

- **Session questions built once:** Line 2063
- **Responses keyed by question.id:** Line 2131
- **Validity score computed:** Lines 1715-1850
- **Success index gated:** Lines 2207-2215
- **UI suppression message:** Lines 2280-2289
- **Raw A5/V3 contradiction:** Lines 1776-1791

## Ready for Deployment

File: `/home/ubuntu/founderfit/index_v5_fixed.html`

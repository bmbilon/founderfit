# Assessment Submission Debugging Guide

## Issue Reported
Assessment submission fails silently - no network request is made to Supabase when clicking "Finish" button on the last survey question.

## Debug Logging Added

### 1. SurveyQuestionPage.tsx - Button Click Handler

Added comprehensive logging to the `goNext()` function to trace:
- ✅ When the function is called
- ✅ Current question index and total
- ✅ Whether the question is answered
- ✅ Whether it's the last question (triggers submission)
- ✅ Temporary founder ID being used
- ✅ Success/failure of submission
- ✅ Navigation to results page

**Console output format:**
```
[SurveyQuestionPage] goNext called { answered, currentIndex, total, isLastQuestion }
[SurveyQuestionPage] Last question reached, submitting assessment...
[SurveyQuestionPage] Calling submitAssessment with founderId: temp-founder-xxxxx
[SurveyQuestionPage] ✅ Assessment submitted successfully! <id>
[SurveyQuestionPage] Navigating to results page...
```

### 2. assessmentSubmission.ts - Main Submission Function

Added detailed logging at every step of the submission process:

#### Data Loading Phase
- ✅ Survey responses from localStorage (count, keys)
- ✅ Demographics from localStorage
- ✅ Survey start time

**Console output:**
```
[submitAssessment] Starting submission... { founderId, ventureId }
[submitAssessment] Loaded raw responses: { count, keys }
[submitAssessment] Loaded demographics: <data>
[submitAssessment] Survey start time: <date>
```

#### Validation Phase
- ✅ Check for empty responses (throws error if none found)

**Console output:**
```
[submitAssessment] ERROR: No survey responses found in localStorage
```

#### Processing Phase
- ✅ Response conversion to structured format
- ✅ Question metadata map creation
- ✅ Force score calculation
- ✅ Overall score calculation
- ✅ Signal integrity calculation

**Console output:**
```
[submitAssessment] Converting responses to structured format...
[submitAssessment] Structured responses: { count }
[submitAssessment] Built question metadata map: { size }
[submitAssessment] Calculating force scores...
[submitAssessment] Force scores calculated: <scores>
[submitAssessment] Calculating overall score...
[submitAssessment] Overall score: <score>
[submitAssessment] Calculating signal integrity...
[submitAssessment] Integrity result: { score, flagCount }
```

#### Database Insertion Phase
- ✅ Assessment data preparation
- ✅ Supabase insert attempt
- ✅ Insert result (success/failure)
- ✅ Error details if failed

**Console output:**
```
[submitAssessment] Preparing assessment data...
[submitAssessment] Assessment data prepared: { founderId, overallScore, hasMetadata }
[submitAssessment] Inserting assessment into Supabase...
[submitAssessment] Supabase insert result: { success, hasData, error }
[submitAssessment] Assessment ID received: <id>
```

#### Response Insertion Phase
- ✅ Response data preparation
- ✅ Individual responses insert
- ✅ Success/warning if responses fail

**Console output:**
```
[submitAssessment] Preparing response data...
[submitAssessment] Response data prepared: { count }
[submitAssessment] Inserting responses into Supabase...
[submitAssessment] Responses inserted successfully
```

#### Cleanup Phase
- ✅ localStorage clearing
- ✅ Final success confirmation

**Console output:**
```
[submitAssessment] Clearing localStorage...
[submitAssessment] ✅ Submission complete! { assessmentId, overallScore }
```

### 3. loadSurveyResponses() - Helper Function

Added logging to trace localStorage reading:
- ✅ Storage key being read
- ✅ Raw data preview (first 100 chars)
- ✅ Parsed data keys
- ✅ Any errors during parsing

**Console output:**
```
[loadSurveyResponses] Reading from key: founderfit:survey:draft:v2.1
[loadSurveyResponses] Raw data: {"A1":5,"A2":4,...
[loadSurveyResponses] Parsed data keys: ["A1", "A2", "A3", ...]
```

## How to Use This Debugging

### Step 1: Open Browser Console
Open Chrome DevTools (F12) and go to the Console tab before starting the assessment.

### Step 2: Complete the Assessment
1. Go through demographics page
2. Answer all survey questions
3. Click "Finish" on the last question

### Step 3: Review Console Output

Look for the console logs in this order:

1. **Button Click**
   ```
   [SurveyQuestionPage] goNext called
   ```
   - If you don't see this, the button click handler isn't firing

2. **Submission Start**
   ```
   [submitAssessment] Starting submission...
   ```
   - If you don't see this, the async function isn't being called

3. **Data Loading**
   ```
   [loadSurveyResponses] Reading from key...
   [submitAssessment] Loaded raw responses: { count: X }
   ```
   - If count is 0, responses aren't being saved to localStorage

4. **Database Insert**
   ```
   [submitAssessment] Inserting assessment into Supabase...
   [submitAssessment] Supabase insert result: { success: true/false }
   ```
   - If success is false, check the error details

5. **Completion**
   ```
   [submitAssessment] ✅ Submission complete!
   ```
   - If you see this, submission worked

## Common Failure Points

### 1. No Console Output at All
**Issue:** Button click handler not firing
**Check:**
- Is the button disabled?
- Is the question actually answered?
- Check `answered` variable value

### 2. Empty Responses
**Issue:** `count: 0` in loaded responses
**Check:**
- Are responses being saved during the survey?
- Check localStorage in DevTools > Application > Local Storage
- Look for key: `founderfit:survey:draft:v2.1`

### 3. Supabase Error
**Issue:** `{ success: false, error: {...} }`
**Common causes:**
- Missing Supabase environment variables
- Database table doesn't exist
- Row-level security policies blocking insert
- Invalid data format
- Network/CORS issues

### 4. Silent Failure
**Issue:** Logs stop abruptly
**Check:**
- Look for any uncaught exceptions
- Check browser Network tab for failed requests
- Check if there's an async/await issue

## Next Steps After Identifying Issue

### If No Responses in localStorage:
Check `SurveyQuestionPage.tsx` `saveDraft()` function - is it being called?

### If Supabase Connection Fails:
1. Check `.env` file has correct Supabase URL and anon key
2. Verify database tables exist
3. Check Supabase RLS policies
4. Review Network tab for 401/403 errors

### If Data Format Issues:
1. Check the `assessmentData` object structure
2. Verify it matches the database schema
3. Look for type mismatches or null values

## Removing Debug Logging

Once the issue is identified and fixed, you can remove the console.log statements by:
1. Search for `console.log('[` in both files
2. Delete those lines (but keep `console.error` for production errors)

Or leave them in development - they won't affect performance significantly.

## Files Modified

1. `src/pages/SurveyQuestionPage.tsx` - Added logging to goNext() function
2. `src/utils/assessmentSubmission.ts` - Added logging throughout submission flow
3. `src/utils/assessmentSubmission.ts` - Added logging to loadSurveyResponses()

Build status: ✅ Passing (744ms)

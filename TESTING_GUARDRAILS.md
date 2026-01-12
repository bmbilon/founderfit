# Testing Production Guardrails

Quick guide to manually test the new production stability features.

---

## 1. Testing Health Gate

### Test A: Config Error (Missing Credentials)

**Steps**:
```bash
# 1. Backup your .env
cp .env .env.backup

# 2. Remove .env
rm .env

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

**Expected Result**:
- ⚠️ Full-screen "Configuration Error" displayed
- Error message: "Missing Supabase configuration..."
- Instructions showing how to create .env file
- No app content visible
- No routes accessible

**Cleanup**:
```bash
# Restore .env
mv .env.backup .env
```

---

### Test B: Config Error (Invalid Credentials)

**Steps**:
```bash
# 1. Edit .env with invalid URL
VITE_SUPABASE_URL=https://invalid-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-key

# 2. Restart dev server
npm run dev

# 3. Open http://localhost:3000
```

**Expected Result**:
- 🔌 Full-screen "Cannot Reach Backend" displayed
- Diagnostic status showing:
  - Configuration: ✓ Valid
  - Auth Service: ✗ Unreachable
  - Database: ✗ Unreachable
- "Retry Connection" button visible

**Test Retry Button**:
1. Click "Retry Connection"
2. Button should show "Retrying..." and be disabled
3. Should show same error after ~10 seconds

**Cleanup**:
```bash
# Restore correct URL in .env
VITE_SUPABASE_URL=https://your-project.supabase.co
```

---

### Test C: Healthy State (Normal Operation)

**Steps**:
```bash
# 1. Ensure .env has correct credentials
cat .env
# Should show valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

**Expected Result**:
- Brief flash of "Starting FounderFit..." (<1 second)
- App renders normally
- Landing page displays with "FounderFit Score™ v2.1"
- Can navigate to /login, /signup, etc.

---

### Test D: Network Disconnected

**Steps**:
```bash
# 1. Start app normally (should work)
npm run dev

# 2. Disconnect from internet/WiFi

# 3. Refresh page (Cmd+R or Ctrl+R)
```

**Expected Result**:
- 🔌 "Cannot Reach Backend" error
- Diagnostics show services unreachable
- "Retry Connection" button available

**Reconnect Test**:
1. Reconnect to internet
2. Click "Retry Connection"
3. Should successfully connect and load app

---

## 2. Testing Signal Integrity Index

### Test A: Straightlining Detection

**Setup**: You'll need to complete a full survey flow once questions are implemented.

**Steps**:
1. Start assessment
2. Answer **all questions with the same value** (e.g., all "3" for Likert, all "1" for binary)
3. Complete assessment quickly (under 2 minutes)
4. Check results

**Expected Integrity Result**:
```json
{
  "integrityScore": ~35-60 (reduced from 100),
  "flags": [
    {
      "type": "straightlining",
      "severity": "high",
      "message": "Straightlining detected: 100% of answers are the same value (3)."
    }
  ],
  "checks": {
    "straightlining": {
      "passed": false,
      "straightlinePercentage": 1.0
    }
  }
}
```

---

### Test B: Time Outlier (Too Fast)

**Steps**:
1. Start assessment
2. Answer all questions **as fast as possible** (< 30 seconds total)
3. Complete assessment

**Expected Integrity Result**:
```json
{
  "integrityScore": ~70-85 (reduced),
  "flags": [
    {
      "type": "time_outlier",
      "severity": "high",
      "message": "Assessment completed suspiciously fast (25s). Minimum expected: 60s."
    }
  ]
}
```

---

### Test C: Extreme Pattern Detection

**Steps**:
1. Start assessment
2. For **all Likert questions**: alternate between "1" and "5" only
3. For **all binary questions**: alternate between "0" and "1"
4. Take normal time (~2-5 minutes)

**Expected Integrity Result**:
```json
{
  "integrityScore": ~70-80 (reduced),
  "flags": [
    {
      "type": "extreme_pattern",
      "severity": "medium",
      "message": "Extreme response pattern: 100% of answers are extreme values (only 0, 1, or 5)."
    }
  ]
}
```

---

### Test D: Optimal (High Integrity)

**Steps**:
1. Start assessment
2. Read each question carefully
3. Vary your answers naturally (use 2, 3, 4 on Likert; mix 0 and 1 on binary)
4. Take reasonable time (2-5 minutes for 12 questions)

**Expected Integrity Result**:
```json
{
  "integrityScore": 90-100,
  "flags": [],
  "checks": {
    "timeToComplete": { "passed": true },
    "inconsistentPairs": { "passed": true },
    "straightlining": { "passed": true },
    "extremePatterns": { "passed": true }
  }
}
```

---

### Test E: Inconsistent Pairs (Future)

**Note**: This test requires populating `INCONSISTENT_PAIRS` in `src/utils/scoring.ts` with real question relationships.

**Example Setup**:
```typescript
const INCONSISTENT_PAIRS: InconsistentPair[] = [
  {
    question1Id: 'B1', // "I update my mental models quickly"
    question2Id: 'B3', // "I need extensive validation before changing my approach"
    description: 'Learning velocity contradiction',
    checkFn: (v1, v2) => {
      // If you answer 5 on B1 (very quick) but also 5 on B3 (need extensive validation),
      // that's inconsistent. They should be inversely related.
      return Math.abs(v1 + v2 - 6) <= 2; // v1 + v2 should be close to 6 (inverse)
    },
  },
];
```

**Steps**:
1. Add inconsistent pair definition
2. Complete assessment
3. Answer paired questions inconsistently (e.g., B1=5, B3=5)

**Expected Result**:
```json
{
  "flags": [
    {
      "type": "inconsistent_pair",
      "severity": "medium",
      "message": "Inconsistent responses detected: Learning velocity contradiction"
    }
  ]
}
```

---

## 3. Testing Binary Normalization Fix

### Verification Test

**Setup**: Create a test with known responses

**Test Case 1**: All Binary = 1
```typescript
const responses = [
  { questionId: 'A1', force: 'thesis_integrity', value: 1 }, // binary
  { questionId: 'A2', force: 'thesis_integrity', value: 1 }, // binary
  { questionId: 'A3', force: 'thesis_integrity', value: 1 }, // binary
];

const questionTypes = new Map([
  ['A1', 'binary'],
  ['A2', 'binary'],
  ['A3', 'binary'],
]);

const forceScore = calculateForceScore(responses, 'thesis_integrity', questionTypes);

console.log('Force score:', forceScore);
// Expected: 100 (all binary 1s = 100% on each, avg = 100)
```

**Test Case 2**: Mixed Binary + Likert
```typescript
const responses = [
  { questionId: 'A1', force: 'thesis_integrity', value: 1 },   // binary → 100
  { questionId: 'A2', force: 'thesis_integrity', value: 0 },   // binary → 0
  { questionId: 'A3', force: 'thesis_integrity', value: 5 },   // likert → 100
];

const forceScore = calculateForceScore(responses, 'thesis_integrity', questionTypes);

console.log('Force score:', forceScore);
// Expected: (100 + 0 + 100) / 3 = 67
```

**Test Case 3**: Old Behavior (Verify Fixed)
```typescript
// With OLD normalization (value / 5 * 100):
// Binary 1 → 20, Binary 1 → 20, Likert 5 → 100
// Average: (20 + 20 + 100) / 3 = 47 ❌ WRONG

// With NEW normalization (value * 100):
// Binary 1 → 100, Binary 1 → 100, Likert 5 → 100
// Average: (100 + 100 + 100) / 3 = 100 ✅ CORRECT
```

---

## 4. Integration Test: Full Flow

**Complete End-to-End Test**:

1. **Start Clean**:
   ```bash
   # Ensure valid .env
   npm run dev
   ```

2. **Health Check**:
   - App should load without errors
   - Health gate should pass silently

3. **Sign Up**:
   - Create new account
   - Verify redirect to dashboard

4. **Take Assessment**:
   - Click "Take Assessment"
   - Answer all questions naturally
   - Note start and end times
   - Complete survey

5. **View Results**:
   - Should show overall score
   - Should show 6 force scores
   - (Future) Should display integrity score

6. **Admin Panel** (if admin):
   - Navigate to `/admin`
   - Verify system overview loads
   - Check that force descriptions are correct

7. **Sign Out**:
   - Click sign out
   - Verify redirect to home

8. **Test Protected Route**:
   - While signed out, try to visit `/dashboard`
   - Should redirect to `/login`

---

## Quick Smoke Test Script

Save this as `test-guardrails.sh`:

```bash
#!/bin/bash

echo "🧪 FounderFit Guardrails Smoke Test"
echo ""

# Test 1: Config Error
echo "Test 1: Config Error"
if [ -f .env ]; then
  mv .env .env.backup
fi
echo "✓ Removed .env - visit http://localhost:3000 and verify Configuration Error"
read -p "Press enter when verified..."

# Test 2: Restore and test healthy
echo ""
echo "Test 2: Healthy State"
if [ -f .env.backup ]; then
  mv .env.backup .env
fi
echo "✓ Restored .env - refresh page and verify app loads normally"
read -p "Press enter when verified..."

echo ""
echo "✅ Manual smoke tests complete"
echo "Next: Test Signal Integrity with real assessment"
```

**Usage**:
```bash
chmod +x test-guardrails.sh
./test-guardrails.sh
```

---

## Debugging

### Health Gate Not Showing

**Check**:
1. Is `HealthGate` wrapping the app in `App.tsx`?
2. Are imports correct?
3. Check browser console for errors

### Integrity Checks Not Running

**Check**:
1. Are you passing `startTime` and `endTime` to `calculateSignalIntegrity()`?
2. Are responses in correct format?
3. Check console for calculation errors

### Binary Scores Look Wrong

**Check**:
1. Verify you're using updated `normalizeBinaryValue()` function
2. Log normalized values to see if they're 0 or 100 (not 0 or 20)
3. Check `questionTypes` map is correctly identifying binary questions

---

## Success Criteria

**Health Gate**:
- ✓ Shows config error when .env missing
- ✓ Shows connection error when Supabase unreachable
- ✓ Retry button works and shows loading state
- ✓ Loads app silently when healthy
- ✓ Blocks all routes until healthy

**Integrity Index**:
- ✓ Detects straightlining (>70% same answer)
- ✓ Flags fast completion (<60s)
- ✓ Flags extreme patterns (>80% extremes)
- ✓ Returns score 0-100 with flags array
- ✓ Consistent pairs check works (once populated)

**Binary Normalization**:
- ✓ Binary 0 → 0 points
- ✓ Binary 1 → 100 points
- ✓ Force scores equal for [binary 1, binary 1, likert 5]
- ✓ Mixed questions weight equally

---

**All tests passing = Ready for production deployment**

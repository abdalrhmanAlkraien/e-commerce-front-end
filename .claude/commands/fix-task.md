# Fix Task - Issue Resolution Command with Testing

Fix issues in any completed or in-progress task with comprehensive error handling, automated re-testing, and documentation.

---

## Command Usage

### Fix Last Task (Default)
```
/fix
/fix Port 3000 is already in use
```
Fixes the most recently completed task.

### Fix Specific Task
```
/fix-task 2.1
/fix Task 2.1 - Login validation not working
```
Fixes a specific task by number.

### Fix Tests Only ✨ NEW
```
/fix-tests 2.1
/fix-task 2.1 --tests-only
```
Fixes or updates test scenarios without changing implementation.

### Fix Both Code and Tests ✨ NEW
```
/fix-both 2.1
/fix-task 2.1 --fix-both
```
Fixes both implementation and test scenarios.

### Emergency Fix
```
/fix-urgent
```
Immediately fixes critical issues blocking progress.

---

## When to Use This Command

Use `/fix` when:
- ✅ Task completed but has bugs
- ✅ Tests are failing ✨
- ✅ User found issues during testing
- ✅ Code needs refinement
- ✅ Missing features discovered
- ✅ Performance problems
- ✅ Console errors appear
- ✅ Test scenarios need updating ✨

Do NOT use for:
- ❌ New feature requests (create new task)
- ❌ Design changes (not bugs)
- ❌ Refactoring (unless fixing issue)

---

## Workflow

### Step 1: Identify Task to Fix

**If no task specified:**
```
🔧 FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent completed tasks:
1. Task 3.2: Create Products Hooks (10 min ago)
   Status: ✅ COMPLETED | Tests: ✅ 4/4 passed
   
2. Task 3.1: Create Products API (45 min ago)
   Status: ✅ COMPLETED | Tests: ⚠️ 4/5 passed
   
3. Task 2.3: Create Auth Layout (2 hours ago)
   Status: ✅ COMPLETED | Tests: ✅ 3/3 passed
   
4. Task 2.2: Create Register Page (3 hours ago)
   Status: ✅ COMPLETED | Tests: ✅ 5/5 passed
   
5. Task 2.1: Create Login Page (4 hours ago)
   Status: ✅ COMPLETED | Tests: ❌ 3/5 passed

Which task needs fixing? (1-5 or task number):
```

**If task specified:**
```
🔧 FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Targeting: Task 2.1 - Create Login Page
Status: ✅ COMPLETED (4 hours ago)
Files created: 3 files

✨ TEST STATUS:
  Status: ❌ Failed (3/5 passed)
  Test File: /task/Test2/Task 2.1.md
  Results: .claude/tasks/processed/Task 2.1 - Test Results.md
  
Failed Tests:
  [3/5] Invalid credentials error - FAILED
  [5/5] Loading state - FAILED

Ready to diagnose? (yes/no/show-tests)
```

---

### Step 2: Determine Fix Type ✨ NEW

**Ask user what needs fixing:**
```
🔍 FIX TYPE SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1 has failing tests and may have code issues.

What needs fixing?

1️⃣  fix-code      - Fix implementation code
2️⃣  fix-tests     - Fix/update test scenarios
3️⃣  fix-both      - Fix both code and tests
4️⃣  auto-detect   - Let me analyze and decide
5️⃣  describe      - Let me describe the issue

Your choice (1-5):
```

**User chooses or describes issue:**
```
User: 1

OR

User: Form submits but shows "Network Error" in console
```

---

### Step 3: Gather Issue Information ✨ ENHANCED

**If fixing code:**
```
🔍 CODE ISSUE DIAGNOSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixing: Task 2.1 - Create Login Page

Please describe the issue:
- What's not working?
- What error messages do you see?
- What did you expect to happen?
- When does the issue occur?

You can paste error messages, screenshots descriptions, or 
describe the behavior.

✨ Related Failed Tests:
  [3/5] Invalid credentials error - Expected error message not shown
  [5/5] Loading state - Loading spinner not appearing

These test failures might be related to your issue.

[Waiting for user input...]
```

**If fixing tests:**
```
🔍 TEST ISSUE DIAGNOSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixing Tests: Task 2.1 - Create Login Page

Current failing tests:
  [3/5] Invalid Credentials Error - FAILED
        Issue: Element [role="alert"] not found
        
  [5/5] Loading State - FAILED
        Issue: Loading spinner not visible

What's wrong with the tests?
1. Tests are checking wrong selectors
2. Tests have wrong expectations
3. Tests are checking too fast (timing issue)
4. Tests are correct, code needs fixing
5. Other (describe)

Your choice:
```

---

### Step 4: Analyze the Issue ✨ ENHANCED

**For code issues:**
```
🔍 ANALYZING ISSUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: Network Error on form submission

Reading related files...
✓ src/app/(auth)/login/page.tsx
✓ src/lib/api/auth.ts
✓ src/lib/api/client.ts
✓ .env.local

Checking test results...
✓ Test 2.1 - Test Results.md

Checking browser console...
Error found: "AxiosError: Network Error"

Checking API configuration...
Issue found: NEXT_PUBLIC_API_URL is undefined

Cross-referencing with test failures:
  Test [3/5]: Expects error alert - Code doesn't show alerts
  Test [5/5]: Expects loading state - Code doesn't show loading

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔎 ROOT CAUSE ANALYSIS

Problem: Multiple issues detected
Severity: 🔴 HIGH (Blocks functionality + failing tests)

ISSUE 1: Environment variable not configured
  Location: .env.local file
  Impact: Blocks all API calls
  
ISSUE 2: Missing error alert component
  Location: LoginForm.tsx
  Impact: Tests expect [role="alert"], not present in code
  Related Test: [3/5] Invalid credentials
  
ISSUE 3: Missing loading state
  Location: LoginForm.tsx
  Impact: Tests expect loading spinner, not present
  Related Test: [5/5] Loading state

Related Tasks Affected:
- Task 2.1: Login Page ❌
- Task 2.2: Register Page ❌ (likely)
- Task 1.4: Auth Hooks ⚠️ (depends on API)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**For test issues:**
```
🔍 ANALYZING TEST ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading test file: /task/Test2/Task 2.1.md
Reading test results: Task 2.1 - Test Results.md
Reading implementation: src/app/(auth)/login/page.tsx

ISSUE 1: Wrong selector in test
  Test expects: [role="alert"]
  Code actually uses: [data-testid="error-message"]
  Fix: Update test selector

ISSUE 2: Timing issue in loading test
  Test checks immediately: page.locator('.spinner').isVisible()
  Code shows spinner after 100ms delay
  Fix: Add wait in test

ANALYSIS:
  Tests are checking correctly but using wrong selectors.
  Implementation is correct.
  Tests need updating to match actual code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 5: Propose Solution ✨ ENHANCED

**For code fixes:**
```
💡 PROPOSED SOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIX STRATEGY: Fix code to make tests pass

CHANGES REQUIRED:

1. Add Environment Variable
   File: .env.local (create if missing)
   Action: Add NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

2. Add Error Alert Component
   File: src/app/(auth)/login/page.tsx
   Action: Add <Alert role="alert"> when error occurs
   Why: Test [3/5] expects this element

3. Add Loading State
   File: src/app/(auth)/login/page.tsx
   Action: Add loading spinner during submission
   Why: Test [5/5] expects loading indicator

FILES TO MODIFY:
✓ .env.local (create)
✓ .env.example (update)
✓ src/app/(auth)/login/page.tsx (add error alert & loading)

✨ TESTS TO RE-RUN AFTER FIX:
All 5 test scenarios will be re-run automatically:
  [1/5] Page loads
  [2/5] Successful login
  [3/5] Invalid credentials (currently failing)
  [4/5] Form validation
  [5/5] Loading state (currently failing)

Expected outcome: 5/5 tests pass ✅

TIME ESTIMATE: 8 minutes
TOKEN ESTIMATE: ~2,500 tokens ($0.04)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTERNATIVE SOLUTIONS:

Option 2: Fix tests instead of code
  Change test selectors to match current code
  Pros: Faster (2 min)
  Cons: Assumes current code is correct

Option 3: Meet in the middle
  Fix some code, update some tests
  Pros: Balanced approach
  Cons: More complex

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with main solution? (yes/no/alternative)
```

**For test fixes:**
```
💡 PROPOSED TEST FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIX STRATEGY: Update test selectors to match implementation

CHANGES REQUIRED:

Test File: /task/Test2/Task 2.1.md

1. Fix Scenario 3: Invalid Credentials
   Current: await page.locator('[role="alert"]').textContent()
   Fixed:   await page.locator('[data-testid="error-message"]').textContent()
   Why: Code uses data-testid, not role="alert"

2. Fix Scenario 5: Loading State
   Current: const visible = await page.locator('.spinner').isVisible()
   Fixed:   await page.waitForSelector('.spinner', { timeout: 500 })
           const visible = await page.locator('.spinner').isVisible()
   Why: Spinner appears after delay, need to wait

FILES TO MODIFY:
✓ /task/Test2/Task 2.1.md (test scenarios)

✨ TESTS TO RE-RUN AFTER FIX:
Only affected scenarios will re-run:
  [3/5] Invalid credentials (updated selector)
  [5/5] Loading state (added wait)

Expected outcome: 5/5 tests pass ✅

TIME ESTIMATE: 3 minutes
TOKEN ESTIMATE: ~800 tokens ($0.01)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Note: This assumes implementation is correct.
If code is wrong, choose "fix-code" instead.

Proceed? (yes/no/fix-code-instead)
```

---

### Step 6: Implement Fix ✨ ENHANCED

**For code fixes:**
```
⚙️  IMPLEMENTING CODE FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixing Task 2.1...

Step 1/3: Creating .env.local...
  ✓ File created
  ✓ Added NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

Step 2/3: Updating login page...
  ✓ Added error alert with role="alert"
  ✓ Added loading state with spinner
  ✓ Connected to form submission

Step 3/3: Updating .env.example...
  ✓ Documented environment variable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes Applied:
✓ Created .env.local
✓ Modified src/app/(auth)/login/page.tsx
✓ Updated .env.example

Files Modified: 3 files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Action Required:
Please restart your dev server:
  npm run dev

Then type 'done' to continue with testing
```

**For test fixes:**
```
⚙️  IMPLEMENTING TEST FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating test scenarios...

Step 1/2: Updating Scenario 3...
  ✓ Changed selector from [role="alert"] to [data-testid="error-message"]
  ✓ Updated validation checks

Step 2/2: Updating Scenario 5...
  ✓ Added waitForSelector for spinner
  ✓ Increased timeout to 500ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes Applied:
✓ Updated /task/Test2/Task 2.1.md

Files Modified: 1 file

Ready to re-run tests...
```

---

### Step 7: Re-Run Tests ✨ NEW

**After code fixes:**
```
🧪 RE-RUNNING TESTS AFTER FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test File: /task/Test2/Task 2.1.md
Running all 5 scenarios...

Previous Results: 3/5 passed (2 failed)
Target: 5/5 pass

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/5] Scenario 1: Login Page Loads
      Status: ✅ STILL PASSING (was passing before)
      Duration: 1m 08s

[2/5] Scenario 2: Successful Login
      Status: ✅ STILL PASSING (was passing before)
      Duration: 2m 15s

[3/5] Scenario 3: Invalid Credentials ✨ FIXED
      Status: ✅ NOW PASSES (was failing)
      Previous: Element [role="alert"] not found
      Now: Error alert displays correctly
      Duration: 1m 32s

[4/5] Scenario 4: Form Validation
      Status: ✅ STILL PASSING (was passing before)
      Duration: 1m 45s

[5/5] Scenario 5: Loading State ✨ FIXED
      Status: ✅ NOW PASSES (was failing)
      Previous: Loading spinner not visible
      Now: Loading spinner shows during submission
      Duration: 0m 58s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TEST RESULTS

Previous: 3/5 passed (60%)
Current:  5/5 passed (100%)
Improvement: +2 tests fixed ✨

Quality Checks:
  ✓ Console Errors: 0 (unchanged)
  ✓ Network Errors: 0 (unchanged)
  ✓ All scenarios pass

Test Duration: 7m 38s
Test Cost: $0.03

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALL TESTS NOW PASS!
```

**After test fixes:**
```
🧪 RE-RUNNING AFFECTED TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test File: /task/Test2/Task 2.1.md
Running updated scenarios: [3/5] and [5/5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[3/5] Scenario 3: Invalid Credentials
      Status: ✅ NOW PASSES
      Previous Issue: Wrong selector
      Fix: Updated to [data-testid="error-message"]
      Result: Element found, test passes
      Duration: 1m 28s

[5/5] Scenario 5: Loading State
      Status: ✅ NOW PASSES
      Previous Issue: Timing problem
      Fix: Added waitForSelector
      Result: Spinner detected, test passes
      Duration: 1m 02s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TEST RESULTS

Full Suite: 5/5 passed (100%)
Fixed Tests: 2/2 now pass ✨
Unchanged: 3/3 still pass

Test Duration: 2m 30s
Test Cost: $0.01

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALL TESTS NOW PASS!
```

---

### Step 8: Update Documentation ✨ ENHANCED

**For code fixes:**
```
📝 UPDATING DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating implementation docs...
  ✓ .claude/tasks/processed/Task 2.1.md

Updating test results...
  ✓ .claude/tasks/processed/Task 2.1 - Test Results.md

Updating systemTasks.md...
  ✓ Updated test status: ❌ Failed → ✅ Passed
  ✓ Updated test scenarios: 3/5 → 5/5
  ✓ Added fix notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Added to Task 2.1.md:

## Fixes Applied

### Fix #1: Multiple Issues - Code & Tests
**Date**: Feb 20, 2026 4:15 PM
**Type**: Code Fix (with re-testing)
**Reported By**: Automated test failures + User manual testing

**Issues**:
1. Network Error - Missing environment variable
2. Error alert missing - Tests expected [role="alert"]
3. Loading state missing - Tests expected spinner

**Root Cause**: 
- .env.local not configured
- Error handling incomplete in form
- Loading state not implemented

**Solution Implemented**:
1. Created .env.local with API URL
2. Added error alert with proper role attribute
3. Added loading state with spinner component

**Files Modified**:
- .env.local (created)
- .env.example (updated)
- src/app/(auth)/login/page.tsx (error handling + loading)

**Tests Re-Run**: ✨
  Previous: 3/5 passed
  After Fix: 5/5 passed ✅
  
  Fixed Scenarios:
  - [3/5] Invalid Credentials - Now shows error correctly
  - [5/5] Loading State - Now shows spinner

**Token Usage**:
  Implementation: 2,450 tokens ($0.04)
  Testing: 1,820 tokens ($0.03)
  Total: 4,270 tokens ($0.07)

**Time Spent**: 11 minutes (8 min code + 3 min testing)

**Verification**: All tests passing, issue fully resolved ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**For test fixes:**
```
📝 UPDATING TEST DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating test file...
  ✓ /task/Test2/Task 2.1.md

Updating test results...
  ✓ .claude/tasks/processed/Task 2.1 - Test Results.md

Updating systemTasks.md...
  ✓ Updated test status: ❌ Failed → ✅ Passed
  ✓ Updated test scenarios: 3/5 → 5/5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Added to Test Results:

## Test Updates

### Update #1: Fixed Test Selectors
**Date**: Feb 20, 2026 4:15 PM
**Type**: Test Fix

**Issues**:
- Scenario 3: Using wrong selector [role="alert"]
- Scenario 5: Not waiting for loading spinner

**Changes**:
1. Scenario 3: Updated to [data-testid="error-message"]
2. Scenario 5: Added waitForSelector before check

**Result**: 
  Previous: 3/5 passed
  After: 5/5 passed ✅

**Note**: Implementation was correct, tests were checking wrong elements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 9: Complete Fix ✨ ENHANCED
```
✅ FIX COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1 has been fixed successfully!

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix Type: Code Fix
Issues Fixed: 3 (env var, error alert, loading state)
Files Changed: 3 files

✨ TEST RESULTS:
  Previous: 3/5 passed (60%)
  After Fix: 5/5 passed (100%) ✅
  Tests Fixed: [3/5], [5/5]
  
VERIFICATION:
✓ Login form works
✓ API calls successful
✓ Error handling correct
✓ Loading state shows
✓ No console errors
✓ All tests passing
✓ Documentation updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TOKEN USAGE

Implementation:
  Input: 1,890 tokens
  Output: 560 tokens
  Subtotal: 2,450 tokens ($0.04)

Testing:
  Input: 1,320 tokens
  Output: 500 tokens
  Subtotal: 1,820 tokens ($0.03)

Total Fix Cost: $0.07
Time: 11 minutes

Task 2.1 Total (Original + Fix):
  Original: $0.21
  Fix: $0.07
  Total: $0.28

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 GIT COMMIT (Optional)
Would you like to commit this fix?

Suggested commit message:
"fix(auth): add env var, error alert, and loading state (Task 2.1)

- Added missing NEXT_PUBLIC_API_URL to .env.local
- Implemented error alert with role='alert' attribute
- Added loading spinner during form submission
- Fixed tests: scenarios 3 and 5 now pass
- All 5/5 tests passing"

Commit now? (yes/no/later)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do next?

1️⃣ continue       - Resume normal task execution
2️⃣ test-manually  - Test manually in browser
3️⃣ fix-another    - Fix another task
4️⃣ review-tests   - Review detailed test results
5️⃣ review-changes - Review all code changes
6️⃣ pause          - Stop for now

Your choice:
```

---

## Error Handling ✨ ENHANCED

### If Tests Still Fail After Fix
```
⚠️  TESTS STILL FAILING AFTER FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix applied but tests still fail:

Previous: 3/5 passed
After Fix: 4/5 passed (improved but not complete)

Still Failing:
  [5/5] Loading State
       Issue: Spinner still not detected
       Selector: .spinner
       Error: Element not found after 500ms

This suggests:
1. The fix was partial - loading state still not right
2. Test timeout too short
3. Different selector needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1️⃣ fix-more      - Continue fixing remaining issue
2️⃣ fix-test      - Update test (maybe wrong selector)
3️⃣ investigate   - Debug in browser manually
4️⃣ accept-partial - Accept 4/5, note remaining issue
5️⃣ rollback      - Undo all changes

Your choice:
```

**If user chooses fix-more:**
```
🔍 INVESTIGATING REMAINING FAILURE

Reading code again...
  Checking: src/app/(auth)/login/page.tsx

Loading state code:
  {isLoading && <Spinner className="loading-spinner" />}

Test is checking:
  .spinner

MISMATCH FOUND:
  Code uses: .loading-spinner
  Test checks: .spinner

SOLUTION:
  Option 1: Change code to use .spinner class
  Option 2: Update test to check .loading-spinner

Which fix? (1/2)
```

---

### If Fix Breaks Other Tests
```
⚠️  FIX CAUSED REGRESSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix improved some tests but broke others:

Previous Test Results:
  [1/5] Page loads - ✅ Passing
  [2/5] Successful login - ✅ Passing
  [3/5] Invalid credentials - ❌ Failing
  [4/5] Form validation - ✅ Passing
  [5/5] Loading state - ❌ Failing

After Fix:
  [1/5] Page loads - ✅ Still passing
  [2/5] Successful login - ❌ NOW FAILING ⚠️
  [3/5] Invalid credentials - ✅ Now passing (fixed)
  [4/5] Form validation - ✅ Still passing
  [5/5] Loading state - ✅ Now passing (fixed)

NEW FAILURE in Scenario 2:
  Issue: Login now shows loading spinner forever
  Cause: Loading state not clearing after success

This is a regression introduced by the fix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

1️⃣ fix-regression - Fix the new issue
2️⃣ rollback       - Undo changes, try different approach
3️⃣ debug          - Investigate in detail

Your choice:
```

---

### If Multiple Issues Found
```
⚠️  MULTIPLE ISSUES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 4 issues in Task 2.1:

1. 🔴 HIGH: Missing environment variable
   Impact: Blocks all functionality
   Tests affected: All API-related tests

2. 🟡 MEDIUM: Error alert not showing
   Impact: User doesn't see errors
   Tests affected: [3/5] Invalid credentials

3. 🟡 MEDIUM: Loading state missing
   Impact: No feedback during submission
   Tests affected: [5/5] Loading state

4. 🟢 LOW: Missing error message translation
   Impact: English-only error messages
   Tests affected: None (not tested yet)

Fix approach:

1️⃣ fix-all       - Fix all 4 issues together
2️⃣ fix-critical  - Fix only HIGH + test failures (#1, #2, #3)
3️⃣ fix-tests     - Fix only issues with failing tests (#2, #3)
4️⃣ fix-one       - Let me choose which to fix
5️⃣ cancel        - Cancel fix mode

Your choice:
```

---

## Rollback Capability ✨ ENHANCED

### User Requests Rollback
```
↩️  ROLLING BACK CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Undoing changes to Task 2.1...

Restoring files:
  ↩️  Deleted .env.local
  ↩️  Reverted .env.example
  ↩️  Reverted src/app/(auth)/login/page.tsx
  ↩️  Reverted /task/Test2/Task 2.1.md (if changed)

Verifying rollback:
  ✓ All files restored to pre-fix state
  ✓ No orphaned changes

Restoring test status:
  ✓ Test status back to: ❌ 3/5 passed
  ✓ systemTasks.md updated

ROLLBACK COMPLETE ✅

State: Back to original issues
  - Network errors will occur again
  - Tests will fail again (3/5)

Recommendation: Try alternative solution or investigate more

Ready to try different approach? (yes/no/investigate)
```

---

## Batch Fix (Multiple Tasks) ✨ ENHANCED
```
🔧 BATCH FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Multiple tasks have similar issues:

Tasks with failing tests:
  - Task 2.1: Login Page (3/5 passed)
  - Task 2.2: Register Page (4/5 passed)
  - Task 3.1: Products API (4/5 passed)

Common issue: Missing error handling

Apply same fix to all 3 tasks?

Solution:
  1. Add error alert components
  2. Add loading states
  3. Update .env.local (if missing)

This will:
  ✓ Fix code in all 3 tasks
  ✓ Re-run tests for all 3 tasks
  ✓ Update all documentation files
  
Estimated:
  Time: 25 minutes
  Cost: $0.18
  Expected: All tests passing for all tasks

Proceed with batch fix? (yes/no/one-by-one)
```

**If user proceeds:**
```
⚙️  BATCH FIX IN PROGRESS [1/3]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1: Login Page

Implementation:
  ✓ Added error alert
  ✓ Added loading state
  ✓ Updated .env.local

Testing:
  🧪 Re-running tests...
  ✓ All 5/5 tests now pass

✅ Task 2.1 Fixed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️  BATCH FIX IN PROGRESS [2/3]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.2: Register Page

Implementation:
  ✓ Added error alert
  ✓ Added loading state

Testing:
  🧪 Re-running tests...
  ✓ All 5/5 tests now pass

✅ Task 2.2 Fixed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Continues for Task 3.1...]

✅ BATCH FIX COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed: 3/3 tasks
All tests passing: 15/15 scenarios ✅
Time: 23 minutes
Cost: $0.16
```

---

## Quick Fix Mode ✨ ENHANCED

For simple, obvious fixes with automatic testing:
```
/fix-quick
```
```
⚡ QUICK FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's the issue?
User: Port 3000 in use

Applying standard fix: Update port to 3001

✓ Modified next.config.js
✓ Updated package.json dev script

Restart server: npm run dev

Testing...
  ✓ Server starts on 3001
  ✓ Page loads successfully

Done! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Test-Only Fix Mode ✨ NEW

Dedicated mode for fixing tests without touching code:
```
/fix-tests 2.1
```
```
🧪 TEST FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1 - Test Scenarios Only

Current test file: /task/Test2/Task 2.1.md
Failed scenarios: 2/5

This mode ONLY updates test scenarios.
Implementation code will NOT be changed.

What's wrong with the tests?

1️⃣ wrong-selectors   - Tests checking wrong elements
2️⃣ wrong-timing      - Tests need more wait time
3️⃣ wrong-expectations - Tests expect wrong behavior
4️⃣ describe          - Let me describe the issue

Your choice:
```

---

## Summary of Changes

**What's New:**
- ✅ Automatic test re-running after every fix
- ✅ Test-only fix mode (`/fix-tests`)
- ✅ Fix both code and tests (`/fix-both`)
- ✅ Test status in task selection
- ✅ Test results in fix summary
- ✅ Test cost tracking separate from implementation
- ✅ Regression detection (fix breaking other tests)
- ✅ Batch fix with testing for multiple tasks
- ✅ Test documentation updates
- ✅ Before/after test comparison

**Benefits:**
- 🧪 Ensures fixes actually work (tests prove it)
- 🎯 Can fix tests separately from code
- 📊 Clear visibility of test impact
- 🔍 Detects regressions immediately
- 💰 Tracks testing costs for fixes
- 📝 Complete test documentation
- ✅ Can't close fix without passing tests

---

This comprehensive fix command now includes **full testing integration to verify every fix works!** 🔧✅🧪
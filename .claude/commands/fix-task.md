# Fix Task - Issue Resolution Command

Fix issues in any completed or in-progress task with comprehensive error handling and documentation.

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

### Emergency Fix
```
/fix-urgent
```
Immediately fixes critical issues blocking progress.

---

## When to Use This Command

Use `/fix` when:
- ✅ Task completed but has bugs
- ✅ Tests are failing
- ✅ User found issues during testing
- ✅ Code needs refinement
- ✅ Missing features discovered
- ✅ Performance problems
- ✅ Console errors appear

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
2. Task 3.1: Create Products API (45 min ago)
3. Task 2.3: Create Auth Layout (2 hours ago)
4. Task 2.2: Create Register Page (3 hours ago)
5. Task 2.1: Create Login Page (4 hours ago)

Which task needs fixing? (1-5 or task number):
```

**If task specified:**
```
🔧 FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Targeting: Task 2.1 - Create Login Page
Status: ✅ COMPLETED (4 hours ago)
Files created: 3 files
Tests: All passed initially

Ready to diagnose? (yes/no)
```

---

### Step 2: Gather Issue Information

**Ask user for details:**
```
🔍 ISSUE DIAGNOSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixing: Task 2.1 - Create Login Page

Please describe the issue:
- What's not working?
- What error messages do you see?
- What did you expect to happen?
- When does the issue occur?

You can paste error messages, screenshots descriptions, or 
describe the behavior.

[Waiting for user input...]
```

**User provides description:**
```
User: Form submits but shows "Network Error" in console
```

---

### Step 3: Analyze the Issue
```
🔍 ANALYZING ISSUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: Network Error on form submission

Reading related files...
✓ src/app/(auth)/login/page.tsx
✓ src/lib/api/auth.ts
✓ src/lib/api/client.ts
✓ .env.local

Checking browser console...
Error found: "AxiosError: Network Error"

Checking API configuration...
Issue found: NEXT_PUBLIC_API_URL is undefined

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔎 ROOT CAUSE ANALYSIS

Problem: Environment variable not configured
Location: .env.local file
Severity: 🔴 HIGH (Blocks all API calls)

Impact:
- Login form cannot communicate with backend
- Registration will have same issue
- All API endpoints affected

Related Tasks Affected:
- Task 2.1: Login Page ❌
- Task 2.2: Register Page ❌ (likely)
- Task 1.4: Auth Hooks ⚠️ (depends on API)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4: Propose Solution
```
💡 PROPOSED SOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIX STRATEGY: Add missing environment variable

CHANGES REQUIRED:

1. Create/Update .env.local
   Action: Add NEXT_PUBLIC_API_URL
   Value: http://localhost:8080/api/v1

2. Update .env.example (optional)
   Action: Document the variable
   Purpose: Help other developers

3. Restart dev server
   Action: Kill and restart npm run dev
   Purpose: Load new environment variable

FILES TO MODIFY:
✓ .env.local (create if missing)
✓ .env.example (update)

TESTS TO RUN:
✓ Try login with valid credentials
✓ Check network tab for API call
✓ Verify no console errors
✓ Test registration form (same fix)

TIME ESTIMATE: 2 minutes
TOKEN ESTIMATE: ~500 tokens ($0.01)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTERNATIVE SOLUTIONS:

Option 2: Hardcode URL (not recommended)
  Pros: Quick fix
  Cons: Not configurable, bad practice

Option 3: Use default URL fallback
  Pros: Works without .env
  Cons: Might hide configuration issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with main solution? (yes/no/alternative)
```

---

### Step 5: Get User Approval

Wait for user response:

**If yes:**
- Proceed to Step 6

**If no:**
```
Understood. Would you like to:
1. Try alternative solution
2. Describe a different fix
3. Cancel fix and investigate more

Your choice:
```

**If alternative:**
```
Which alternative? (2 or 3)
```

---

### Step 6: Implement Fix

**Show progress:**
```
⚙️  IMPLEMENTING FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixing Task 2.1...

Step 1/3: Creating .env.local...
  ✓ File created
  ✓ Added NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

Step 2/3: Updating .env.example...
  ✓ Documented environment variable
  ✓ Added usage comment

Step 3/3: Preparing to restart server...
  ⚠️  Please restart dev server:
     npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes Applied:
✓ Created .env.local
✓ Updated .env.example

Files Modified:
  .env.local (new file)
  .env.example (updated)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please restart your dev server, then type 'done'
```

---

### Step 7: Run Tests

**After user restarts:**
```
🧪 TESTING FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running verification tests...

Test 1: Check environment variable loaded
  ✓ NEXT_PUBLIC_API_URL is defined
  ✓ Value: http://localhost:8080/api/v1

Test 2: Manual test - Login form
  Please test the login form:
  1. Open http://localhost:3000/login
  2. Enter credentials
  3. Submit form

Did it work? (yes/no/errors)
```

**If user says yes:**
```
✅ TEST PASSED - Login works correctly
```

**If user says no/errors:**
```
Let's investigate further.

What happened? (describe or paste error)
```

[Go back to Step 3 with new information]

---

### Step 8: Update Documentation
```
📝 UPDATING DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating processed/Task 2.1.md...

Added section: ## Fixes Applied

### Fix #1: Environment Variable Missing
**Date**: Feb 20, 2026 4:15 PM
**Issue**: Network Error on API calls
**Root Cause**: NEXT_PUBLIC_API_URL not configured
**Solution**: Created .env.local with API URL
**Files Modified**: .env.local (new), .env.example (updated)
**Tests**: All passing ✅
**Time**: 3 minutes
**Cost**: $0.01

✓ Documentation updated
✓ Task status remains ✅ COMPLETED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 9: Complete Fix
```
✅ FIX COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1 has been fixed successfully!

SUMMARY:
- Issue: Network Error (missing env var)
- Solution: Added .env.local configuration
- Files Changed: 2 files
- Tests: ✅ All passing
- Time: 3 minutes
- Cost: $0.01

VERIFICATION:
✓ Login form works
✓ API calls successful
✓ No console errors
✓ Documentation updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TOKEN USAGE
Input: 450 tokens
Output: 280 tokens
Total: 730 tokens
Cost: $0.01

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 GIT COMMIT (Optional)
Would you like to commit this fix?

Suggested commit message:
"fix(auth): add missing API URL environment variable (Task 2.1)"

Commit now? (yes/no/later)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do next?

1️⃣ continue     - Resume normal task execution
2️⃣ test-more    - Test other related features
3️⃣ fix-another  - Fix another task
4️⃣ review       - Review all recent changes
5️⃣ pause        - Stop for now

Your choice:
```

---

## Error Handling

### If Fix Fails
```
❌ FIX FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The fix did not resolve the issue.

Original Issue: Network Error
Fix Applied: Added .env.local
Result: Still showing Network Error

NEW ERROR DETECTED:
"TypeError: Cannot read property 'data' of undefined"

This suggests a different problem.

What would you like to do?

1️⃣ rollback    - Undo changes and try different fix
2️⃣ investigate - Dig deeper into the issue
3️⃣ debug       - Step through code with debugger
4️⃣ skip        - Mark as known issue, continue

Your choice:
```

### If Multiple Issues Found
```
⚠️  MULTIPLE ISSUES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 3 issues in Task 2.1:

1. 🔴 HIGH: Missing environment variable
   Impact: Blocks all functionality

2. 🟡 MEDIUM: Form validation too strict
   Impact: User experience issue

3. 🟢 LOW: Missing error message translation
   Impact: English-only error messages

Fix all at once or one by one?

1️⃣ fix-all       - Fix all issues together
2️⃣ fix-critical  - Fix only HIGH priority (issue #1)
3️⃣ fix-one       - Let me choose which to fix
4️⃣ cancel        - Cancel fix mode

Your choice:
```

### If Tests Still Fail
```
⚠️  TESTS STILL FAILING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix applied but some tests still fail:

✅ Environment variable loaded
✅ Dev server restarted
❌ Login form test - "401 Unauthorized"
❌ API call test - "Invalid credentials"

This suggests the fix was correct but revealed a new issue:
Backend authentication is rejecting the request.

POSSIBLE CAUSES:
- Wrong API endpoint
- Backend not running
- Incorrect credentials format
- CORS issue

Would you like to:
1️⃣ investigate-backend - Check backend status
2️⃣ fix-auth-format    - Adjust authentication format
3️⃣ accept-partial     - Accept fix, note remaining issue
4️⃣ rollback           - Undo all changes

Your choice:
```

---

## Rollback Capability

### User Requests Rollback
```
↩️  ROLLING BACK CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Undoing changes to Task 2.1...

Restoring files:
  ↩️  Deleted .env.local
  ↩️  Reverted .env.example

Verifying rollback:
  ✓ All files restored to pre-fix state
  ✓ No orphaned changes

ROLLBACK COMPLETE ✅

State: Back to original issue
Recommendation: Try alternative solution or investigate more

Ready to try again? (yes/no/investigate)
```

---

## Batch Fix (Multiple Tasks)
```
🔧 BATCH FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Multiple tasks have the same issue:
- Task 2.1: Login Page (env var missing)
- Task 2.2: Register Page (env var missing)
- Task 3.1: Products API (env var missing)

Fix all 3 tasks with same solution?

Solution: Add .env.local with API URL

Applying to:
  ✓ Task 2.1 - Login Page
  ✓ Task 2.2 - Register Page
  ✓ Task 3.1 - Products API

This will:
- Apply same fix to all tasks
- Update all 3 processed documentation files
- Run tests for all 3 tasks

Proceed with batch fix? (yes/no/one-by-one)
```

---

## Fix Documentation Template

**Added to processed/Task X.Y.md:**
```markdown
## Fixes Applied

### Fix #1: [Issue Title]
**Date**: Feb 20, 2026 4:15 PM
**Reported By**: User manual testing
**Issue**: [Description of problem]
**Symptoms**:
- [Symptom 1]
- [Symptom 2]

**Root Cause**: [What was actually wrong]

**Solution Implemented**:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Files Modified**:
- file1.ts - [what changed]
- file2.tsx - [what changed]

**Tests Run**:
✅ Test 1 - Passed
✅ Test 2 - Passed
✅ Test 3 - Passed

**Token Usage**:
- Input: 450 tokens
- Output: 280 tokens
- Cost: $0.01

**Time Spent**: 3 minutes

**Verification**: Issue resolved, all tests passing

**Notes**: [Any additional context]

---

### Fix #2: [Next fix if any]
[Same format]
```

---

## Token Tracking for Fixes

Track tokens separately:
```
📊 FIX TOKEN USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This Fix:
  Input: 450 tokens
  Output: 280 tokens
  Total: 730 tokens
  Cost: $0.01

Task 2.1 Total (Original + Fixes):
  Original: 15,200 tokens ($0.24)
  Fix #1: 730 tokens ($0.01)
  Total: 15,930 tokens ($0.25)

Project Total:
  Tasks: $2.88
  Fixes: $0.04
  Total: $2.92

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Quick Fix Mode

For simple, obvious fixes:
```
/fix-quick
```

Skips analysis, goes straight to implementation:
```
⚡ QUICK FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's the issue?
User: Port 3000 in use

Applying standard fix: Update port to 3001

✓ Modified next.config.js
✓ Updated package.json dev script

Done! Dev server now uses port 3001.

Restart server: npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

This comprehensive fix command handles **any issue, any task, with full documentation and safety**! 🔧✅
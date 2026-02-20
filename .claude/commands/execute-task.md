# Execute Single Task - Interactive Mode with Automated Testing

Execute the next pending task, generate test scenarios, run tests, and wait for user review before proceeding.

---

## Workflow Overview
```
Step 1: Identify Next Task → User confirms
Step 2: Read & Display Task → User confirms
Step 3: Execute Implementation → Track progress
Step 4: Generate Test Scenarios ✨ NEW
Step 5: Execute Tests ✨ NEW
Step 6: Record Test Results ✨ NEW
Step 7: Present Results → Show everything
Step 8: User Review & Decision → Wait for choice
Step 9: Handle User Choice → Take action
```

---

## Workflow

### Step 1: Identify Next Task

1. Read `task/systemTasks.md`
2. Find first task with status ⏳ PENDING
3. Display to user:
```
📋 NEXT TASK IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task Number: X.Y
Task Name: [Name]
Phase: Phase X
Task Definition: /task/PhaseX/Task X.Y.md

Status: ⏳ PENDING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to start? (yes/no/skip)
```

4. **Wait for user response**
   - **yes** → Proceed to Step 2
   - **no** → Stop execution
   - **skip** → Mark task as ⚠️ BLOCKED, find next task

---

### Step 2: Read & Display Task Definition

If user says **yes**:

1. **Read task definition from `/task/PhaseX/Task X.Y.md`**
2. **Extract and display the summary:**
```
📖 TASK DETAILS - Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Copy the "Description" section from Task X.Y.md verbatim]

KEY REQUIREMENTS:
[Extract bullet points from "Requirements" section]

EXPECTED OUTPUTS:
[Extract from "Expected Outputs" section]

TEST CRITERIA:
[Extract from "Test Criteria" section]

ESTIMATED DURATION:
[Extract from "Estimated Duration" section]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full task definition: /task/PhaseX/Task X.Y.md

Proceed with execution? (yes/no/read-full)
```

3. **Wait for confirmation**
   - **yes** → Proceed to Step 3
   - **no** → Return to Step 1
   - **read-full** → Display complete task file contents, then ask again

---

### Step 3: Execute Implementation

If user confirms:

1. **Update systemTasks.md:**
   - Status: ⏳ PENDING → 🔄 IN_PROGRESS
   - Assigned: [Current timestamp]

2. **Update .claude/tasks/prompt.md:**
   - Copy full task details to file
   - Set status to IN_PROGRESS
   - Record start timestamp

3. **Track token usage:**
   - Record conversation token count at start
   - Track as task progresses
   - Calculate final: Total = After - Before
   - Compute cost: (Input × $3 + Output × $15) / 1,000,000

4. **Follow the complete requirements from `/task/PhaseX/Task X.Y.md`:**
   - Execute each requirement step by step
   - Create all files listed in "Expected Outputs"
   - Follow all specifications exactly

5. **Show progress updates:**
```
⚙️  IMPLEMENTATION - Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️  Step 1/4: Creating project structure...
    ✓ Created directories
    ✓ Initialized configuration
    
⚙️  Step 2/4: Installing dependencies...
    ✓ Installed @tanstack/react-query
    ✓ Installed zustand
    ✓ Installed axios
    
⚙️  Step 3/4: Configuring tools...
    ✓ shadcn/ui initialized
    
⚙️  Step 4/4: Creating components...
    ✓ LoginForm.tsx created
    ✓ All files generated

✅ IMPLEMENTATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4: Generate Test Scenarios ✨ NEW

After implementation completes, automatically generate test scenarios:
```
🧪 GENERATING TEST SCENARIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading task definition: /task/PhaseX/Task X.Y.md

Extracting test requirements:
  ✓ Identified 5 test scenarios from acceptance criteria
  ✓ Found edge cases to test
  ✓ Extracted validation requirements
  ✓ Noted regression checks needed

Generating test file: /task/TestX/Task X.Y.md

Test scenarios generated:
  1. [Primary Functionality] - Main success path
  2. [Error Handling] - Invalid inputs
  3. [Form Validation] - Client-side validation
  4. [Integration] - API interaction
  5. [Regression] - Previous features still work

✓ Test file created: /task/TestX/Task X.Y.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceeding to test execution...
```

**What happens:**
1. Read task definition file
2. Extract acceptance criteria and requirements
3. Generate test scenarios based on:
   - Expected outputs
   - Test criteria from task definition
   - Common patterns for this type of task
   - Edge cases and error conditions
4. Create `/task/TestX/Task X.Y.md` with:
   - Test setup instructions
   - Playwright test code for each scenario
   - Validation checks
   - Inspection points
   - Success criteria

---

### Step 5: Execute Tests ✨ NEW

Run all generated test scenarios using Playwright (via Computer Use):
```
🧪 EXECUTING TESTS - Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test File: /task/TestX/Task X.Y.md
Total Scenarios: 5
Browser: Chromium (Playwright)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/5] Scenario 1: Login Page Loads Successfully
      Status: 🔄 Running...
      ✓ Navigate to http://localhost:3000/login
      ✓ Page loaded successfully (245ms)
      ✓ Email input visible and enabled
      ✓ Password input visible and enabled
      ✓ Submit button visible and enabled
      ✓ No console errors
      📸 Screenshot: test-X.Y-scenario-1.png
      Status: ✅ PASSED (1m 12s)

[2/5] Scenario 2: Successful Login Flow
      Status: 🔄 Running...
      ✓ Form accepts input
      ✓ POST /api/v1/auth/login → 200 OK (145ms)
      ✓ Redirected to /products
      ✓ Token stored in localStorage
      ✓ User data correct
      ✓ isAuthenticated: true
      📸 Screenshot: test-X.Y-scenario-2.png
      Status: ✅ PASSED (2m 34s)

[3/5] Scenario 3: Invalid Credentials Error
      Status: 🔄 Running...
      ✓ Error message displayed
      ✓ POST /api/v1/auth/login → 401 Unauthorized
      ✓ Remains on /login
      ✓ No token stored
      📸 Screenshot: test-X.Y-scenario-3-error.png
      Status: ✅ PASSED (1m 45s)

[4/5] Scenario 4: Form Validation
      Status: 🔄 Running...
      ✓ Empty email shows error
      ✓ Empty password shows error
      ✓ Invalid email format detected
      ✓ Submit disabled when invalid
      Status: ✅ PASSED (1m 58s)

[5/5] Scenario 5: Loading State
      Status: 🔄 Running...
      ✓ Loading spinner shown
      ✓ Button disabled during load
      Status: ✅ PASSED (0m 54s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INSPECTION RESULTS

Network Analysis:
  ✓ All API calls successful
  ✓ Correct request/response format
  ✓ Status codes as expected

Console Analysis:
  ✓ 0 errors
  ✓ 0 warnings
  ✓ Clean console

Storage Analysis:
  ✓ localStorage structure correct
  ✓ Data persists as expected

Elements Analysis:
  ✓ HTML structure valid
  ✓ Accessibility attributes present

Regression Tests:
  ✓ Homepage still loads
  ✓ API client still works
  ✓ Previous tasks functional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALL TESTS PASSED (5/5)

Test Duration: 8m 23s
Console Errors: 0
Network Errors: 0
Regression Issues: 0
Screenshots: 5 captured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**What happens:**
1. Start dev server if not running
2. Clear browser state (localStorage, cookies)
3. Execute each test scenario from generated test file
4. Use Playwright (via Computer Use) to:
   - Navigate to pages
   - Fill forms
   - Click buttons
   - Check elements
   - Verify responses
   - Take screenshots
5. Monitor console for errors
6. Monitor network for failures
7. Verify data persistence
8. Run quick regression checks

**If tests fail:**
```
❌ TEST FAILURES DETECTED

Test Results: 3/5 passed, 2/5 failed

Failed Scenarios:

[3/5] Scenario 3: Invalid Credentials Error
      Status: ❌ FAILED
      Issue: Error message not displayed
      Expected: [role="alert"] element with error text
      Actual: Element not found
      Screenshot: test-X.Y-scenario-3-failure.png

[4/5] Scenario 4: Form Validation
      Status: ❌ FAILED
      Issue: Email validation not working
      Expected: Error for invalid email format
      Actual: Form submitted without validation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:

The implementation has issues that need fixing before 
this task can be marked complete.

Options:
1️⃣  auto-fix   - Let me analyze and fix automatically
2️⃣  guide-fix  - Guide me through fixing issues
3️⃣  show-code  - Show me the test code to review
4️⃣  skip-tests - Mark complete anyway (not recommended)

Your choice:
```

---

### Step 6: Record Test Results ✨ NEW

Save comprehensive test results:
```
📝 RECORDING TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Creating detailed test report...

File: .claude/tasks/processed/Task X.Y - Test Results.md

Sections included:
  ✓ Executive Summary
  ✓ Detailed Scenario Results (5 scenarios)
  ✓ Network Analysis
  ✓ Console Analysis
  ✓ Storage Analysis
  ✓ Elements Analysis
  ✓ Screenshots (5 captured)
  ✓ Issues Found & Fixed (if any)
  ✓ Regression Test Results
  ✓ Performance Metrics

✓ Test results saved successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Test Results File includes:**
- Executive summary (pass/fail, duration)
- Detailed results for each scenario
- What worked and what didn't
- Network request/response analysis
- Console log analysis
- Storage state verification
- HTML structure validation
- Screenshots for each scenario
- Issues encountered and how they were fixed
- Regression test outcomes
- Performance metrics

---

### Step 7: Present Results

After implementation AND testing complete, display comprehensive results:
```
✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task X.Y: [Name]
Duration: 28 minutes (implementation: 20m, testing: 8m)
Status: ✅ COMPLETED

📁 FILES CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[List each file from "Expected Outputs" section with ✓]
✓ path/to/file1.tsx - [Brief description]
✓ path/to/file2.ts - [Brief description]
✓ path/to/file3.tsx - [Brief description]

📝 FILES MODIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ path/to/existing.ts - [what changed]

✅ TESTS PASSED ✨ NEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Status: ✅ All Passed (5/5 scenarios)
Test File: /task/TestX/Task X.Y.md
Test Duration: 8m 23s

Scenarios Tested:
✓ Scenario 1: Login Page Loads - PASSED
✓ Scenario 2: Successful Login - PASSED
✓ Scenario 3: Invalid Credentials - PASSED
✓ Scenario 4: Form Validation - PASSED
✓ Scenario 5: Loading State - PASSED

Quality Checks:
✓ Console Errors: 0
✓ Network Errors: 0
✓ Regression Tests: All passed
✓ Accessibility: Basic checks passed

Screenshots: 5 captured
Test Results: .claude/tasks/processed/Task X.Y - Test Results.md

📊 TOKEN USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementation:
  Input Tokens:     12,450
  Output Tokens:    8,230
  Total Tokens:     20,680
  Cost:             $0.160

Testing: ✨ NEW
  Input Tokens:     3,200
  Output Tokens:    2,100
  Total Tokens:     5,300
  Cost:             $0.041

Total Task Cost:    $0.201

📈 PROJECT PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase X:          [N/M] ████░░░░░░░░ XX%
Overall:          [N/76] █░░░░░░░░░░ X.X%
Total Cost:       $X.XXX

Testing Stats: ✨ NEW
  Tasks Tested: N
  All Passed: N (XX%)
  Test Pass Rate: XX.X%

📄 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementation: .claude/tasks/processed/Task X.Y.md
Test Results: .claude/tasks/processed/Task X.Y - Test Results.md ✨ NEW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 7.5: Update System Files ✨ UPDATED

Before presenting options to user:

1. **Create Processed Documentation**
   - Create `.claude/tasks/processed/Task X.Y.md`
   - Use template provided at end of this file
   - Include all sections: summary, files, tests, tokens, issues

2. **Create Test Results Documentation** ✨ NEW
   - Create `.claude/tasks/processed/Task X.Y - Test Results.md`
   - Include:
      - Executive summary
      - Detailed scenario results
      - Network/Console/Storage analysis
      - Issues found and fixed
      - Screenshots captured
      - Final verdict

3. **Update systemTasks.md**
   - Change status: 🔄 IN_PROGRESS → ✅ COMPLETED
   - Fill in "Completed" timestamp
   - Calculate and fill "Duration"
   - Add "Input Tokens", "Output Tokens", "Total Tokens"
   - Calculate and add "Cost Estimate"
   - **✨ NEW: Add Testing section:**
```markdown
     - **Test Status**: ✅ PASSED
     - **Test File**: `task/TestX/Task X.Y.md`
     - **Test Scenarios**: 5 total (5 passed, 0 failed)
     - **Test Duration**: 8m 23s
     - **Test Cost**: $0.041
     - **Console Errors**: 0
     - **Network Errors**: 0
     - **Test Results File**: `.claude/tasks/processed/Task X.Y - Test Results.md`
```
- Update "Progress Summary" totals
- Update "Token Usage by Phase" table
- **✨ NEW: Update "Testing Summary" section**
- Add entry to "Recent Activity Log"

4. **Keep prompt.md as-is**
   - Do NOT clear yet
   - Wait for user to choose "continue" first
   - This allows user to review/fix/re-test before moving on

---

### Step 8: User Review & Decision ✨ UPDATED

Present options to user:
```
🔍 REVIEW OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1️⃣  continue       - Start next task (Task X.Y+1)
2️⃣  review         - Show me the code/files created
3️⃣  review-tests   - Review test results in detail ✨ NEW
4️⃣  re-test        - Run tests again ✨ NEW
5️⃣  fix            - Something's wrong, let's fix it
6️⃣  details        - Show more details about this task
7️⃣  pause          - Stop for now, continue later
8️⃣  skip-next      - Skip next task and go to X.Y+2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your choice (1-8 or type command):
```

**Wait for user input**

---

### Step 9: Handle User Choice ✨ UPDATED

#### Option 1: continue

**Actions:**
- Verify all tests passed (if not, warn user)
- Clear `.claude/tasks/prompt.md`
- Set prompt.md status back to READY_FOR_NEXT_TASK
- Proceed to Step 1 with next task
- Auto-detect next pending task

**Flow:**
```
User: continue
  ↓
Check: All tests passed? ✅ Yes
  ↓
Clear prompt.md
  ↓
Go to Step 1 (identify next PENDING task)
  ↓
Show next task to user
  ↓
Wait for confirmation
```

**If tests failed:**
```
⚠️  WARNING: Tests Failed

Task X.Y has 2 failing tests. Proceeding to the next 
task is not recommended as it may cause cascading issues.

Failed Tests:
  - Scenario 3: Invalid Credentials Error
  - Scenario 4: Form Validation

Options:
1️⃣  fix-first   - Fix issues before continuing (recommended)
2️⃣  continue    - Continue anyway (may cause problems)
3️⃣  back        - Go back to review options

Your choice:
```

---

#### Option 2: review

**Actions:**
- Show list of files created
- Ask which file to review: "Which file? (number, filename, or 'all')"
- Display file with syntax highlighting
- Show file info: path, lines, created in which task
- After review, return to options menu

**Example:**
```
📄 FILES CREATED:
1. app/(auth)/login/page.tsx (125 lines)
2. components/auth/LoginForm.tsx (89 lines)
3. lib/hooks/useAuth.ts (42 lines)
4. lib/api/auth.ts (65 lines)

Which to review? (1-4, filename, or 'all')

User: 2

[Shows LoginForm.tsx with syntax highlighting]

Review another file? (yes/no/back)
```

---

#### Option 3: review-tests ✨ NEW

**Actions:**
- Display full test results file
- Show detailed scenario breakdowns
- Display screenshots if requested
- Show network/console analysis
- Return to options menu

**Example:**
```
📊 TEST RESULTS - Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Executive Summary:
  ✅ ALL TESTS PASSED (5/5)
  Duration: 8m 23s
  Console Errors: 0
  Network Errors: 0
  
Detailed Results:

[1/5] Scenario 1: Login Page Loads Successfully
      Status: ✅ PASSED (1m 12s)
      
      Results:
        ✓ Email input visible and enabled
        ✓ Password input visible and enabled
        ✓ Submit button visible and enabled
        ✓ Page title correct
        ✓ No console errors
      
      Screenshot: test-X.Y-scenario-1.png
      
[2/5] Scenario 2: Successful Login Flow
      Status: ✅ PASSED (2m 34s)
      
      Results:
        ✓ Form accepted input
        ✓ POST /api/v1/auth/login → 200 OK (145ms)
        ✓ Redirected to /products
        ✓ Token stored in localStorage
        ✓ User data stored correctly
      
      Auth State Verified:
        - hasToken: true
        - isAuthenticated: true
        - userEmail: test@example.com
      
      Screenshot: test-X.Y-scenario-2-logged-in.png

[... continues for all scenarios ...]

Network Analysis:
  Request: POST /auth/login
  Status: 200 OK
  Duration: 145ms
  Request: {"email":"test@example.com","password":"***"}
  Response: {"accessToken":"eyJ...","user":{...}}

Console Analysis:
  Errors: 0
  Warnings: 0
  Status: ✅ Clean

Storage Analysis:
  localStorage Keys: ['auth-storage']
  Data Structure: ✅ Correct

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View screenshots? (yes/no)
Back to options? (yes)
```

---

#### Option 4: re-test ✨ NEW

**Actions:**
- Ask for confirmation
- Re-run all test scenarios
- Show updated results
- Update test results file
- Return to options menu

**Example:**
```
🔄 RE-TESTING Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will re-run all 5 test scenarios.

Reasons to re-test:
  - You made changes to the code
  - Tests may have been affected by external factors
  - Want to verify consistency

Continue with re-test? (yes/no)

User: yes

[Runs tests again - same as Step 5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RE-TEST COMPLETE

Previous Results: 5/5 passed
Current Results: 5/5 passed
Status: Consistent ✅

Updated: .claude/tasks/processed/Task X.Y - Test Results.md

Back to options? (yes)
```

---

#### Option 5: fix ✨ UPDATED

**Actions:**
- Ask: "What needs to be fixed? (describe the issue)"
- User describes the problem
- Claude analyzes the issue
- Propose solution with specific changes
- Ask for approval: "Proceed with fix? (yes/no)"
- If yes: Execute fix
- **✨ NEW: Re-run affected tests**
- Update both processed files (implementation + test results)
- Show fix results
- Return to options menu

**Example:**
```
🔧 FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What needs to be fixed?

User: The error message isn't showing when login fails

Analyzing...

ISSUE: Missing error alert component
CAUSE: Form doesn't display validation errors

Found in test results:
  - Scenario 3: Invalid Credentials - Failed
  - Expected: [role="alert"] with error message
  - Actual: Element not found

PROPOSED SOLUTION:
1. Add error state to LoginForm component
2. Display error with role="alert" attribute
3. Show error message from API response

Files to modify:
  - components/auth/LoginForm.tsx
  - Add error alert component

Proceed with fix? (yes/no)

User: yes

[Applies fix]

Applying fix...
✓ Modified LoginForm.tsx
✓ Added error alert with proper aria attributes
✓ Tested error display

Re-running affected tests...

🧪 Testing Scenario 3: Invalid Credentials
    ✓ Error message now displayed correctly
    ✓ Has role="alert" attribute
    ✓ Shows correct error text
    Status: ✅ NOW PASSES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ FIX APPLIED & VERIFIED

Updated Files:
  ✓ components/auth/LoginForm.tsx
  ✓ .claude/tasks/processed/Task X.Y.md
  ✓ .claude/tasks/processed/Task X.Y - Test Results.md

Test Status: All tests now pass (5/5) ✅

Back to review options? (yes)
```

---

#### Option 6: details

**Actions:**
- Read and display `.claude/tasks/processed/Task X.Y.md` (full content)
- **✨ NEW: Also show test results summary**
- Show full task definition from `/task/PhaseX/Task X.Y.md`
- Display detailed token usage breakdown with cost calculation
- Show all test results with pass/fail status
- List all files created with line counts and descriptions
- Show any issues encountered and solutions
- Return to options menu

**Example:**
```
📊 DETAILED TASK REPORT - Task X.Y
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPLEMENTATION DOCUMENTATION:
[Full content of processed/Task X.Y.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ TEST RESULTS SUMMARY:
  Status: ✅ All Passed (5/5)
  Duration: 8m 23s
  Test File: /task/TestX/Task X.Y.md
  Results File: .claude/tasks/processed/Task X.Y - Test Results.md
  
  Console Errors: 0
  Network Errors: 0
  Regression Issues: 0
  Screenshots: 5 captured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL TASK DEFINITION:
[Full content of /task/PhaseX/Task X.Y.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View full test results? (yes/no)
Back to review options? (yes)
```

---

#### Option 7: pause

**Actions:**
- Keep all files as-is (don't clear anything)
- Show completion summary including test results
- Show instructions to resume

**Display:**
```
⏸️  PAUSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session saved successfully.

COMPLETED TODAY:
- Task X.Y: [Name] ✅
  Implementation: ✅ Complete
  Tests: ✅ All Passed (5/5) ✨

PROGRESS:
- Phase X: [N/M] tasks done
- Overall: [N/76] tasks (X.X%)
- Total Cost: $X.XX

✨ TESTING PROGRESS:
- Tasks Tested: N
- All Passed: N (XX%)
- Test Pass Rate: XX.X%

TO RESUME LATER:
Say: "Continue from where we left off"
Or: "/execute-task"

The next task will be: Task X.Y+1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### Option 8: skip-next

**Actions:**
- Ask for confirmation: "Are you sure? This will mark Task X.Y+1 as BLOCKED."
- If yes:
   - Find next task (X.Y+1)
   - Update systemTasks.md: Mark as ⚠️ BLOCKED
   - Ask for reason: "Why skip? (will be noted in systemTasks.md)"
   - Add reason to "Notes" field
   - Add to "Blockers & Issues" section
   - Find task after that (X.Y+2)
   - Proceed to Step 1 with X.Y+2

---

## Token Tracking

### How to Track Tokens

**Method 1: Claude.ai Interface**
1. Check usage indicator during conversation
2. Note token count before starting task
3. Note token count after completing task
4. Calculate: Used = After - Before

**Method 2: Ask User**
After task completion, if needed:
```
📊 TOKEN TRACKING NEEDED

To track costs, please provide token usage:
- Input tokens: _____
- Output tokens: _____

(Check Claude.ai usage indicator or API response)
```

**Method 3: API Response** (if using Claude API)
- Token counts returned automatically
- Log during execution

### Cost Calculation Formula
```
Input Cost = (Input Tokens / 1,000,000) × $3.00
Output Cost = (Output Tokens / 1,000,000) × $15.00
Total Cost = Input Cost + Output Cost
```

**Example:**
```
Implementation:
  Input: 12,450 tokens → $0.037
  Output: 8,230 tokens → $0.123
  Subtotal: $0.160

Testing:
  Input: 3,200 tokens → $0.010
  Output: 2,100 tokens → $0.032
  Subtotal: $0.042

Total Task Cost: $0.202
```

---

## Important Rules

### ALWAYS Read Task Definition File

- **NEVER assume** what a task should do
- **ALWAYS read** `/task/PhaseX/Task X.Y.md` first
- **Follow exactly** what the task definition specifies
- **Reference the file** in processed documentation

### Testing is Mandatory ✨ NEW

- **ALWAYS generate** test scenarios after implementation
- **ALWAYS execute** all tests before marking complete
- **NEVER skip** testing unless tests fail and user explicitly approves
- **RE-TEST** after any fixes are applied
- **DOCUMENT** all test results comprehensively

### Display Information from Task File

When showing task details, extract from these sections:
1. **Description** - What the task does
2. **Requirements** - Detailed steps to follow
3. **Expected Outputs** - Files that must be created
4. **Test Criteria** - Tests that must pass
5. **Estimated Duration** - How long it should take
6. **Dependencies** - What must be done before/after
7. **Common Issues** - Known problems and solutions (if present)
8. **Notes** - Important information (if present)

### Create Processed Documentation

After task completion, create TWO files:

1. **`.claude/tasks/processed/Task X.Y.md`** - Implementation documentation
2. **`.claude/tasks/processed/Task X.Y - Test Results.md`** ✨ NEW - Test results

---

## Error Handling

### If Task Definition File Missing
```
❌ ERROR: Task Definition Not Found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expected location: /task/PhaseX/Task X.Y.md
Status: File not found

This task cannot be executed without its definition file.

Options:
1️⃣  skip - Mark task as ⚠️ BLOCKED and continue
2️⃣  create - Let me create a basic task definition
3️⃣  stop - Stop execution

Your choice:
```

---

### If Tests Fail ✨ NEW
```
❌ TESTS FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task X.Y: [Name]
Test Results: 3/5 passed, 2/5 failed

Failed Scenarios:
  [3/5] Scenario 3: Invalid Credentials Error
        Issue: Error message not displayed
        
  [4/5] Scenario 4: Form Validation  
        Issue: Email validation not working

Test File: /task/TestX/Task X.Y.md
Test Results: .claude/tasks/processed/Task X.Y - Test Results.md

What would you like to do?

1️⃣  auto-fix       - Let me analyze and fix issues
2️⃣  guide-fix      - Guide me through fixing
3️⃣  show-tests     - Show me the failing test code
4️⃣  mark-complete  - Mark complete anyway (NOT recommended)
5️⃣  retry          - Retry tests (if you fixed manually)
6️⃣  skip           - Skip this task for now

Your choice:
```

---

### If Implementation Fails
```
❌ IMPLEMENTATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task X.Y: [Name]
Error: [Error description]

What happened:
- [Issue 1]
- [Issue 2]

From task definition "Common Issues" section:
- [Solution from task file if present]

What would you like to do?

1️⃣  retry       - Try the implementation again from start
2️⃣  debug       - Let's investigate the error
3️⃣  skip        - Skip this task for now (mark as BLOCKED)
4️⃣  modify      - Adjust the task requirements

Your choice:
```

---

## Summary of Testing Integration ✨

**What Changed:**
1. Added Step 4: Generate test scenarios automatically
2. Added Step 5: Execute tests using Playwright
3. Added Step 6: Record detailed test results
4. Updated Step 7: Include test results in summary
5. Added Option 3: Review test results
6. Added Option 4: Re-run tests
7. Updated Option 5: Re-test after fixes
8. Enhanced token tracking to include test costs
9. Added test status to all displays
10. Created test results documentation file

**Benefits:**
- ✅ Every task is actually verified to work
- ✅ Catches issues immediately
- ✅ Prevents breaking previous functionality
- ✅ No manual testing needed
- ✅ Complete documentation of what works
- ✅ Clear pass/fail criteria
- ✅ Can re-test anytime
- ✅ Tracks test costs separately

**Files Created Per Task:**
1. Implementation files (as before)
2. `/task/TestX/Task X.Y.md` - Test scenarios (NEW)
3. `.claude/tasks/processed/Task X.Y.md` - Implementation docs
4. `.claude/tasks/processed/Task X.Y - Test Results.md` - Test results (NEW)

---

**This execute-task.md is now complete with full testing integration!** ✅🧪
# Execute Single Task - Interactive Mode

Execute the next pending task and wait for user review before proceeding.

---

## Workflow Overview
```
Step 1: Identify Next Task → User confirms
Step 2: Read & Display Task → User confirms
Step 3: Execute Task → Track progress
Step 4: Present Results → Show everything
Step 5: User Review & Decision → Wait for choice
Step 6: Handle User Choice → Take action
```

---

## Workflow

### Step 1: Identify Next Task

1. Read `.claude/tasks/systemTasks.md`
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

### Step 3: Execute Task

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
   - Run all tests from "Test Criteria"
   - Verify outputs match specifications

5. **Show progress updates:**
```
⚙️  Step 1/4: Creating project structure...
    ✓ Created directories
    ✓ Initialized configuration
⚙️  Step 2/4: Installing dependencies...
    ✓ Installed @tanstack/react-query
    ✓ Installed zustand
    ✓ Installed axios
⚙️  Step 3/4: Configuring tools...
    ✓ shadcn/ui initialized
⚙️  Step 4/4: Running verification tests...
    ✓ All tests passed
```

---

### Step 4: Present Results

After completion, display comprehensive results:
```
✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task X.Y: [Name]
Duration: [time]
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

✅ TESTS PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[List each test from "Test Criteria" section with ✓]
✓ npm run dev - Server starts successfully
✓ http://localhost:3000 - Page loads
✓ Console - No errors
✓ TypeScript - Compilation successful

📊 TOKEN USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input Tokens:     12,450
Output Tokens:    8,230
Total Tokens:     20,680
Cost:             $0.160

(Token counts from conversation usage)

📈 PROJECT PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 0:          [1/4] ████░░░░░░░░ 25%
Overall:          [1/76] █░░░░░░░░░░ 1.3%
Total Cost:       $0.160

📄 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: .claude/tasks/processed/Task X.Y.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4.5: Update System Files

Before presenting options to user:

1. **Create Processed Documentation**
   - Create `.claude/tasks/processed/Task X.Y.md`
   - Use template provided at end of this file
   - Include all sections: summary, files, tests, tokens, issues

2. **Update systemTasks.md**
   - Change status: 🔄 IN_PROGRESS → ✅ COMPLETED
   - Fill in "Completed" timestamp
   - Calculate and fill "Duration"
   - Add "Input Tokens", "Output Tokens", "Total Tokens"
   - Calculate and add "Cost Estimate"
   - Update "Progress Summary" totals
   - Update "Token Usage by Phase" table
   - Add entry to "Recent Activity Log"

3. **Keep prompt.md as-is**
   - Do NOT clear yet
   - Wait for user to choose "continue" first
   - This allows user to review/fix/test before moving on

---

### Step 5: User Review & Decision

Present options to user:
```
🔍 REVIEW OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1️⃣  continue    - Start next task (Task X.Y+1)
2️⃣  review      - Show me the code/files created
3️⃣  test        - Let me test it manually first
4️⃣  fix         - Something's wrong, let's fix it
5️⃣  details     - Show more details about this task
6️⃣  pause       - Stop for now, continue later
7️⃣  skip-next   - Skip next task and go to X.Y+2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your choice (1-7 or type command):
```

**Wait for user input**

---

### Step 6: Handle User Choice

#### Option 1: continue

**Actions:**
- Clear `.claude/tasks/prompt.md`
- Set prompt.md status back to READY_FOR_NEXT_TASK
- Proceed to Step 1 with next task
- Auto-detect next pending task

**Flow:**
```
User: continue
  ↓
Clear prompt.md
  ↓
Go to Step 1 (identify next PENDING task)
  ↓
Show next task to user
  ↓
Wait for confirmation
```

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
1. package.json (125 lines)
2. next.config.js (18 lines)
3. tsconfig.json (42 lines)
4. app/layout.tsx (35 lines)
5. app/page.tsx (28 lines)

Which to review? (1-5, filename, or 'all')

User: 1

[Shows package.json with syntax highlighting]

Review another file? (yes/no/back)
```

#### Option 3: test

**Actions:**
- Display testing instructions from task definition
- If task has "Common Issues" section, show it
- Wait for user to test manually
- Ask: "Tests passed? (yes/no/issues)"
- **If yes**: Return to options menu
- **If no or issues**: Go to fix mode (Option 4)

**Example:**
```
🧪 MANUAL TESTING MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From task definition, please test:
✓ npm run dev - Should start on port 3000
✓ Open http://localhost:3000 - Should load page
✓ Check console - Should have no errors

Common issues to watch for:
- Port 3000 already in use
- Missing dependencies
- TypeScript errors

Take your time to test everything.

Tests passed? (yes/no/issues)
```

#### Option 4: fix

**Actions:**
- Ask: "What needs to be fixed? (describe the issue)"
- User describes the problem
- Claude analyzes the issue
- Propose solution with specific changes
- Ask for approval: "Proceed with fix? (yes/no)"
- If yes: Execute fix
- Re-run affected tests
- Update processed documentation with fix notes
- Show fix results
- Return to options menu

**Example:**
```
🔧 FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What needs to be fixed?

User: Port 3000 is already in use

Analyzing...

ISSUE: Port 3000 conflict
CAUSE: Another process is using the port

PROPOSED SOLUTION:
1. Update next.config.js to use port 3001
2. Update dev script in package.json
3. Re-test with new port

Files to modify:
- next.config.js - Add port configuration
- package.json - Update dev script

Proceed with fix? (yes/no)

User: yes

[Applies fix]

✅ FIX APPLIED
- Modified next.config.js
- Modified package.json
- Tested: Server now runs on port 3001
- Updated processed documentation

Back to review options? (yes)
```

#### Option 5: details

**Actions:**
- Read and display `.claude/tasks/processed/Task X.Y.md` (full content)
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

[Full content of processed/Task X.Y.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL TASK DEFINITION:
[Full content of /task/PhaseX/Task X.Y.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Back to review options? (yes)
```

#### Option 6: pause

**Actions:**
- Keep all files as-is (don't clear anything)
- Show completion summary
- Show instructions to resume

**Display:**
```
⏸️  PAUSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session saved successfully.

COMPLETED TODAY:
- Task X.Y: [Name] ✅

PROGRESS:
- Phase X: [N/M] tasks done
- Overall: [N/76] tasks (X.X%)
- Total Cost: $X.XX

TO RESUME LATER:
Say: "Continue from where we left off"
Or: "/execute-task"

The next task will be: Task X.Y+1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Option 7: skip-next

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

**Example:**
```
⚠️  SKIP CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will skip Task X.Y+1 and mark it as BLOCKED.

Next task will be: Task X.Y+2

Are you sure? (yes/no)

User: yes

Why skip Task X.Y+1? (reason will be noted)

User: Waiting for design mockups

✅ Task X.Y+1 marked as ⚠️ BLOCKED
   Reason: Waiting for design mockups
   Added to systemTasks.md Blockers section

Proceeding to Task X.Y+2...
[Goes to Step 1]
```

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
Input: 12,450 tokens
  → (12,450 / 1,000,000) × $3 = $0.037

Output: 8,230 tokens
  → (8,230 / 1,000,000) × $15 = $0.123

Total: $0.037 + $0.123 = $0.160
```

---

## Important Rules

### ALWAYS Read Task Definition File

- **NEVER assume** what a task should do
- **ALWAYS read** `/task/PhaseX/Task X.Y.md` first
- **Follow exactly** what the task definition specifies
- **Reference the file** in processed documentation

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

After task completion, create `.claude/tasks/processed/Task X.Y.md` with:
- Reference to original task definition
- What was actually done
- Files created (with descriptions)
- Tests performed (with results)
- Token usage and cost
- Any deviations from the plan
- Issues encountered and solutions

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

### If Task Definition Invalid/Incomplete
```
⚠️  WARNING: Task Definition Incomplete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: /task/PhaseX/Task X.Y.md
Issues found:
- Missing "Requirements" section
- Missing "Expected Outputs" section

I can proceed with best effort, but results may not be complete.

Options:
1️⃣  proceed - Execute with available information
2️⃣  skip - Skip this task for now
3️⃣  fix-def - Let's fix the definition first

Your choice:
```

### If Task Fails
```
❌ TASK FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task X.Y: [Name]
Error: [Error description]

What happened:
- [Issue 1]
- [Issue 2]

From task definition "Common Issues" section:
- [Solution from task file if present]

What would you like to do?

1️⃣  retry       - Try the task again from start
2️⃣  debug       - Let's investigate the error
3️⃣  skip        - Skip this task for now
4️⃣  modify      - Adjust the task requirements

Your choice:
```

---

## Example Complete Flow
```
User: /execute-task

Claude:
📋 NEXT TASK IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task Number: 0.1
Task Name: Create Next.js Project
Phase: Phase 0
Task Definition: /task/Phase0/Task 0.1.md
Status: ⏳ PENDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to start? (yes/no/skip)

User: yes

Claude:
[Reads /task/Phase0/Task 0.1.md]

📖 TASK DETAILS - Task 0.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a new Next.js 14 project with TypeScript and 
install all required dependencies for the e-commerce 
frontend.

KEY REQUIREMENTS:
- Initialize Next.js with specific configuration
- Install core dependencies (React Query, Zustand, etc.)
- Initialize shadcn/ui
- Verify installation with dev server

EXPECTED OUTPUTS:
- package.json with all dependencies
- next.config.js configuration file
- tsconfig.json for TypeScript
- tailwind.config.ts for styling
- components.json for shadcn/ui
- Working dev server at localhost:3000

TEST CRITERIA:
✓ npm run dev starts without errors
✓ npm run build completes successfully
✓ Browser loads at localhost:3000
✓ TypeScript compilation works
✓ Tailwind CSS is functional

ESTIMATED DURATION: 15-20 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full task definition: /task/Phase0/Task 0.1.md

Proceed with execution? (yes/no/read-full)

User: yes

Claude:
⚙️  Step 1/4: Creating Next.js project...
    ✓ Running create-next-app
    ✓ Selected TypeScript, Tailwind, App Router

⚙️  Step 2/4: Installing dependencies...
    ✓ Installed @tanstack/react-query
    ✓ Installed zustand
    ✓ Installed axios
    [... etc]

⚙️  Step 3/4: Configuring shadcn/ui...
    ✓ Initialized with default settings

⚙️  Step 4/4: Running verification tests...
    ✓ Dev server started successfully
    ✓ Build completed without errors

✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task 0.1: Create Next.js Project
Duration: 18 minutes
Status: ✅ COMPLETED

📁 FILES CREATED
✓ package.json - All dependencies listed
✓ next.config.js - Configuration complete
✓ tsconfig.json - Strict mode enabled
✓ tailwind.config.ts - Tailwind configured
✓ components.json - shadcn/ui config
✓ app/layout.tsx - Root layout
✓ app/page.tsx - Home page
[... 20 more files]

✅ TESTS PASSED
✓ npm run dev - Server starts successfully
✓ npm run build - Build completes in 45s
✓ http://localhost:3000 - Page loads
✓ TypeScript - No compilation errors
✓ Tailwind CSS - Styles working

📊 TOKEN USAGE
Input Tokens:     12,450
Output Tokens:    8,230
Total Tokens:     20,680
Cost:             $0.160

📈 PROJECT PROGRESS
Phase 0:          [1/4] ████░░░░░░░░ 25%
Overall:          [1/76] █░░░░░░░░░░ 1.3%
Total Cost:       $0.160

📄 DOCUMENTATION
Created: .claude/tasks/processed/Task 0.1.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 REVIEW OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What would you like to do?
1️⃣ continue  2️⃣ review  3️⃣ test  4️⃣ fix  
5️⃣ details  6️⃣ pause  7️⃣ skip-next

Your choice:

User: continue

Claude:
[Clears prompt.md]
[Reads /task/Phase0/Task 0.2.md]

📋 NEXT TASK IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task Number: 0.2
Task Name: Create Project Structure
...
```

---

## Processed Documentation Template
```markdown
# Task X.Y: [Task Name]

**Status**: ✅ COMPLETED
**Task Definition**: `/task/PhaseX/Task X.Y.md`
**Started**: 2026-02-18 10:30:00
**Completed**: 2026-02-18 11:15:00
**Duration**: 45 minutes

---

## Task Summary

[Copy the Description section from the task definition file]

Source: `/task/PhaseX/Task X.Y.md`

---

## What Was Done

[Detailed description of actual implementation]

### Requirements Completed

From task definition:
✓ [Requirement 1] - Completed successfully
✓ [Requirement 2] - Completed successfully
✓ [Requirement 3] - Completed with minor adjustment

[Explain any deviations or adjustments]

---

## Files Created

[List matches "Expected Outputs" from task definition]

✓ package.json - Contains all required dependencies
✓ next.config.js - Configured as specified
✓ tsconfig.json - TypeScript strict mode enabled
[... etc, matching task definition]

---

## Tests Performed

[List matches "Test Criteria" from task definition]

✓ npm run dev - Server starts on port 3000
✓ npm run build - Build completes in 45s
✓ Browser test - Page loads without errors
✓ TypeScript - No compilation errors
✓ Tailwind CSS - Styles applied correctly

All tests from task definition passed ✅

---

## Token Usage

**Input Tokens**: 45,230
**Output Tokens**: 28,450
**Total Tokens**: 73,680

**Cost Breakdown**:
- Input Cost: (45,230 / 1,000,000) × $3 = $0.136
- Output Cost: (28,450 / 1,000,000) × $15 = $0.427
- **Total Cost**: $0.563

---

## Issues Encountered

### Issue 1: [Description]
**Problem**: [What went wrong]
**Solution**: [How it was fixed]
**Reference**: Task definition "Common Issues" section

[If the task definition had a "Common Issues" section 
that helped solve this, reference it]

---

## Deviations from Task Definition

[List any places where actual implementation differs 
from what the task definition specified, with reasoning]

Example:
- Task Definition: "Install date-fns"
- Actual: Installed date-fns v3.0.6 (latest stable)
- Reason: Security updates in newer version

---

## Next Task Dependencies

This task provides for next tasks:
- Task 0.2: Project structure can now be created
- Task 0.3: Configuration files can reference this setup
- All future tasks: Base project is ready

---

## Notes

[Any additional observations or recommendations]
```

---

**This command file is now complete and production-ready!** ✅

The task definition files (`/task/PhaseX/Task X.Y.md`) are the **single source of truth**! 🎯
# Continue Tasks - Batch Execution Mode

Continue executing tasks from where we left off, with options for sequential or batch execution.

---

## Command Usage

### Sequential Mode (Default)
```
/continue-tasks
```
Executes tasks one by one with review options after each task.

### Batch Mode
```
Execute next 5 tasks in batch
Execute all tasks in Phase 0
Continue until Phase 2 complete
```
Executes multiple tasks with minimal interruption.

---

## Workflow

### Step 1: Check Current Status

1. **Read `.claude/tasks/systemTasks.md`**
   - Check for any task with status 🔄 IN_PROGRESS
   - Check for tasks marked ❌ FAILED or ⚠️ BLOCKED

2. **Handle In-Progress Task**
   - If found, ask: "Task X.Y is IN_PROGRESS. Continue or restart?"
   - **Continue** → Resume from where it left off
   - **Restart** → Mark as PENDING, start fresh

3. **Check for Blockers**
   - If any ❌ FAILED tasks found, report them
   - Ask: "Fix failed tasks first? (yes/no/skip)"
   - If ⚠️ BLOCKED tasks found, acknowledge but continue

4. **Display Current Status**
```
📊 CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [12/76] ████░░░░░░░░░░░░ 15.8%
Completed: 12 tasks
Pending: 64 tasks
Failed: 0 tasks
Blocked: 0 tasks

Current Phase: Phase 2
Total Cost: $1.92

Last Completed: Task 1.4 - Create Auth Hooks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next task will be: Task 2.1 - Create Login Page
```

---

### Step 2: Choose Execution Mode

Present options:
```
🎯 EXECUTION MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How would you like to proceed?

1️⃣  sequential  - One task at a time (with review)
2️⃣  batch       - Multiple tasks without stopping
3️⃣  phase       - Complete entire phase
4️⃣  custom      - Specify number of tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your choice:
```

Wait for user input.

---

### Step 3A: Sequential Mode

If user chooses **sequential** (or default):

1. **Execute using `/execute-task` command**
   - Full interactive mode
   - User confirms before each task
   - User gets review options after each task
   - Can choose: continue/review/fix/pause after each

2. **After each task completion:**
```
Task X.Y completed ✅

Continue with next task? (yes/no/pause)
```

3. **If user says yes:**
   - Move to next PENDING task
   - Repeat process

4. **If user says no or pause:**
   - Stop execution
   - Show summary of completed tasks
   - Save state

---

### Step 3B: Batch Mode

If user chooses **batch**:

1. **Ask for batch size:**
```
How many tasks to execute? (number or 'phase' or 'all')
```

2. **Confirm batch:**
```
⚙️  BATCH EXECUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Will execute: 5 tasks
- Task 2.1: Create Login Page
- Task 2.2: Create Register Page
- Task 2.3: Create Auth Layout
- Task 3.1: Create Products API Module
- Task 3.2: Create Products Hooks

Estimated duration: 1-2 hours
Estimated cost: $0.80 - $1.60

Ready to start batch? (yes/no)
```

3. **Execute batch:**
   - Run each task automatically
   - Show progress: "⚙️ [2/5] Task 2.2..."
   - Track all token usage
   - Don't ask for confirmation between tasks
   - **BUT**: Stop on failure and ask what to do

4. **During batch, show updates:**
```
⚙️  BATCH PROGRESS [2/5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Task 2.1 - Complete (12 min, $0.18)
🔄 Task 2.2 - In Progress...

Elapsed: 18 minutes
Cost so far: $0.18
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. **After batch completes:**
```
✅ BATCH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completed 5 tasks in 1h 15min

✅ Task 2.1 - Create Login Page ($0.18)
✅ Task 2.2 - Create Register Page ($0.16)
✅ Task 2.3 - Create Auth Layout ($0.14)
✅ Task 3.1 - Create Products API ($0.22)
✅ Task 3.2 - Create Products Hooks ($0.19)

Total Cost: $0.89
Total Tokens: 59,340

📈 PROGRESS
Phase 2: [3/3] ████████████ 100% ✅
Phase 3: [2/5] ████░░░░░░░░ 40%
Overall: [17/76] ████░░░░░░░░ 22.4%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?
1️⃣ continue    - Start another batch
2️⃣ review-all  - Review what was built
3️⃣ test-all    - Test all features
4️⃣ pause       - Stop for now

Your choice:
```

---

### Step 3C: Phase Mode

If user chooses **phase**:

1. **Show phase tasks:**
```
📦 PHASE EXECUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 2: Authentication Pages
- Task 2.1: Create Login Page ⏳
- Task 2.2: Create Register Page ⏳
- Task 2.3: Create Auth Layout ⏳

Total: 3 tasks
Estimated: 45-60 minutes
Estimated cost: $0.45 - $0.75

Execute entire phase? (yes/no)
```

2. **Execute all tasks in phase**
   - Same as batch mode
   - Stops at phase boundary
   - Shows phase completion

---

## Error Handling During Batch

### If Task Fails Mid-Batch
```
❌ BATCH INTERRUPTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.1 failed during batch execution.

Completed so far:
✅ Task 2.1 (12 min, $0.18)
✅ Task 2.2 (10 min, $0.16)
❌ Task 3.1 - FAILED

Error: Module not found - axios

What would you like to do?

1️⃣ fix-and-continue - Fix this task and resume batch
2️⃣ skip-and-continue - Skip this task, continue batch
3️⃣ stop - Stop batch execution
4️⃣ retry - Retry this task

Your choice:
```

### If User Wants to Interrupt

User can type `stop` or `pause` at any time:
```
⏸️  BATCH PAUSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Paused at: Task 3.2 (in progress)

Completed in this batch:
✅ Task 2.1, 2.2, 2.3, 3.1

Current task saved. You can resume later with:
- "continue Task 3.2"
- "/execute-task" (will resume 3.2)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Progress Tracking

### After Every 5 Tasks

Show comprehensive progress:
```
📊 PROGRESS CHECKPOINT [5 tasks completed]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE PROGRESS:
Phase 0: [4/4] ████████████ 100% ✅
Phase 1: [6/6] ████████████ 100% ✅
Phase 2: [3/3] ████████████ 100% ✅
Phase 3: [2/5] ████░░░░░░░░ 40%

OVERALL:
Completed: 15/76 tasks (19.7%)
Time elapsed: 3h 15min
Total cost: $2.40
Avg per task: $0.16

NEXT UP:
Task 3.3: Create Product Card Component
Task 3.4: Create Products List Page
Task 3.5: Create Product Detail Page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue? (yes/no/pause)
```

---

## Token Tracking Across Tasks

Track cumulative usage:
```
📊 CUMULATIVE TOKEN USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This Session:
- Tasks Completed: 5
- Input Tokens: 62,340
- Output Tokens: 41,280
- Total Tokens: 103,620
- Session Cost: $0.89

Project Total:
- Tasks Completed: 17/76
- Total Tokens: 341,580
- Total Cost: $2.40
- Avg per Task: $0.14

Estimated Remaining:
- Tasks Left: 59
- Est. Total Cost: $10.66
- Budget Alert: On track ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Safety Checks

Before starting any execution:

### Pre-Flight Checklist
```
🔍 SAFETY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking system state...

✅ All previous tasks marked as completed
✅ No tasks marked as failed
✅ No blocking errors detected
✅ System files up to date

⚠️  1 task marked as BLOCKED:
    Task 5.2 - Waiting for API documentation

Ready to proceed with execution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Issue Detection

If issues found:
```
⚠️  ISSUES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before continuing, please address:

❌ Task 2.1 marked as FAILED
   Error: Module not found
   Action needed: Fix or skip

⚠️  2 tasks marked as BLOCKED
   Task 5.2, Task 8.3
   Action needed: Review blockers

Proceed anyway? (yes/no/fix-first)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Git Commits (Optional)

If git integration desired:
```
💾 GIT COMMITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After every 5 tasks, would you like to:
1️⃣ auto-commit - Automatic git commits
2️⃣ manual - You'll commit manually
3️⃣ skip - No git integration

Your choice:

[If auto-commit selected]
After each 5 tasks, I'll suggest:
git add .
git commit -m "feat: complete tasks X.Y through X.Z"

You can review before committing.
```

---

## Resume Instructions

When stopped:
```
⏸️  EXECUTION PAUSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session saved successfully.

TO RESUME:
- /continue-tasks
- "Continue from where we left off"
- "Execute next 5 tasks"

CURRENT STATE:
- Last completed: Task 3.2
- Next task: Task 3.3
- Phase 3 progress: 2/5 tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Example Session
```
User: /continue-tasks

Claude:
📊 CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [8/76] ██░░░░░░░░░░░░░░ 10.5%
Last Completed: Task 1.4 - Create Auth Hooks
Next: Task 2.1 - Create Login Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 EXECUTION MODE
How would you like to proceed?
1️⃣ sequential  2️⃣ batch  3️⃣ phase  4️⃣ custom

User: batch

Claude:
How many tasks to execute? (number or 'phase')

User: 5

Claude:
⚙️  BATCH EXECUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Will execute: 5 tasks
- Task 2.1: Create Login Page
- Task 2.2: Create Register Page
- Task 2.3: Create Auth Layout
- Task 3.1: Create Products API
- Task 3.2: Create Products Hooks

Estimated: 1-2 hours
Estimated cost: $0.80

Ready to start batch? (yes/no)

User: yes

Claude:
[Executes all 5 tasks]

⚙️ [1/5] Task 2.1... ✅ (12 min, $0.18)
⚙️ [2/5] Task 2.2... ✅ (10 min, $0.16)
⚙️ [3/5] Task 2.3... ✅ (8 min, $0.12)
⚙️ [4/5] Task 3.1... ✅ (15 min, $0.22)
⚙️ [5/5] Task 3.2... ✅ (11 min, $0.19)

✅ BATCH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed 5 tasks in 56 minutes
Total Cost: $0.87

What would you like to do?
1️⃣ continue  2️⃣ review-all  3️⃣ test-all  4️⃣ pause

User: continue

Claude:
[Starts next batch...]
```

---

## Important Notes

1. **Batch mode trades speed for control** - tasks execute automatically but user loses per-task review
2. **Always stops on errors** - even in batch mode, failures require user decision
3. **Token tracking continues** - all usage tracked across batch
4. **Can interrupt anytime** - type "stop" or "pause" to halt batch
5. **Sequential mode is safer** - recommended for complex tasks
6. **Phase mode is convenient** - good for completing logical units

---

## When to Use Each Mode

**Sequential Mode** - Use when:
- Tasks are complex or unfamiliar
- You want to review each output
- Testing/debugging is needed
- First time through a phase

**Batch Mode** - Use when:
- Tasks are straightforward
- You trust the process
- Time is limited
- Tasks are similar (e.g., all CRUD pages)

**Phase Mode** - Use when:
- Completing logical unit
- All tasks in phase are similar
- You want clean phase boundaries
- Batch committing to git

---

This command enables efficient multi-task execution while maintaining safety and quality! 🚀
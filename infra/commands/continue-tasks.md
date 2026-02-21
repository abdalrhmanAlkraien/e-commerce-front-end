# Continue Tasks - Batch Execution Mode with Testing

Continue executing tasks from where we left off, with automated testing for each task.

---

## Workflow Overview
```
Check Status → Execute Task → Generate Tests → Run Tests → 
Tests Pass? → Yes → Next Task → Repeat
            ↓ No → Fix → Re-test → Continue
```

---

## Steps

### Step 1: Check Current Status

1. **Read `.claude/tasks/systemTasks.md`**
2. **Find any task with status 🔄 IN_PROGRESS**
   - If found, complete that task first (with testing)
   - Otherwise, find next ⏳ PENDING task
3. **Display current state:**
```
📊 CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tasks Completed: 18/76 (23.7%)
Current Phase: Phase 3 - Products Module

In Progress: None
Next Pending: Task 3.2 - Create Products Hooks

Recent Completions:
  ✅ Task 3.1 - Products API Module
     Tests: 5/5 passed ✅
     Duration: 25 minutes
     Cost: $0.19
     
Last Session:
  - Completed 3 tasks
  - All tests passed
  - Total cost: $0.58

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue from Task 3.2? (yes/no/batch)
```

---

### Step 2: Execute Tasks in Sequence

**Single Task Mode:**

Use the `/execute-task` command for each task:
```
Task 3.2: Create Products Hooks

[Executes implementation - see execute-task.md]
  ✓ Implementation complete
  
[Generates test scenarios]
  ✓ Test file created: /task/Test3/Task 3.2.md
  
[Runs tests]
  ✓ All 4 scenarios passed
  
✅ TASK 3.2 COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implementation: ✅ Complete (18 minutes)
Tests: ✅ Passed (4/4 scenarios, 6 minutes)
Total Duration: 24 minutes
Cost: $0.18

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue with next task? (yes/no/batch/pause)
```

**User Responses:**
- **yes** → Execute Task 3.3 immediately
- **no** → Stop and show summary
- **batch** → Ask "How many?" then enter batch mode
- **pause** → Save and stop

---

### Step 3: Batch Execution Mode ✨ ENHANCED

**When user says:**
- "execute next 5 tasks"
- "batch 5"
- "continue with batch mode"

**Claude responds:**
```
🔄 BATCH MODE - Execute Multiple Tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How many tasks to execute? (1-10)

User: 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BATCH PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Will execute:
  1. Task 3.2 - Create Products Hooks
  2. Task 3.3 - Create Product Card Component
  3. Task 3.4 - Create Products List Page
  4. Task 3.5 - Create Product Detail Page
  5. Task 4.1 - Create Cart API Module

Estimated Duration: ~2 hours
Estimated Cost: ~$0.95

Testing included:
  - All tasks will be tested
  - Batch stops if any test fails
  - You can fix and resume

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with batch? (yes/no)
```

**If user confirms:**
```
⚙️ BATCH EXECUTION [1/5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.2 - Create Products Hooks

Implementation:
  ⚙️ Step 1/3: Creating useProducts hook...
  ⚙️ Step 2/3: Creating useProduct hook...
  ⚙️ Step 3/3: Creating query key factory...
  ✅ Implementation complete (18 minutes)

Testing:
  🧪 Generating test scenarios...
  ✓ Test file created
  
  🧪 Executing tests...
  [1/4] Hook exports correct ✅
  [2/4] Query keys structured ✅
  [3/4] useProducts works ✅
  [4/4] useProduct works ✅
  
  ✅ All tests passed (6 minutes)

✅ TASK 3.2 COMPLETED
  Duration: 24 minutes | Cost: $0.18

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ BATCH EXECUTION [2/5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.3 - Create Product Card Component

Implementation:
  ⚙️ Creating component...
  ✅ Implementation complete (22 minutes)

Testing:
  🧪 Generating test scenarios...
  🧪 Executing tests...
  [1/5] Component renders ✅
  [2/5] Props display correctly ✅
  [3/5] Click handlers work ✅
  [4/5] Responsive design ✅
  [5/5] Accessibility ✅
  
  ✅ All tests passed (7 minutes)

✅ TASK 3.3 COMPLETED
  Duration: 29 minutes | Cost: $0.21

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Continues for remaining tasks...]
```

---

### Step 3.5: If Tests Fail During Batch ✨ NEW

**Scenario: Test failure in middle of batch**
```
❌ BATCH PAUSED - Test Failure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Batch Progress: 2/5 completed

Current Task: Task 3.4 - Products List Page
  Implementation: ✅ Complete
  Tests: ❌ Failed (3/5 passed)
  
Failed Scenarios:
  [3/5] Product grid layout
        Issue: Grid classes not applied correctly
        
  [4/5] Loading state
        Issue: Skeleton not showing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Batch cannot continue with failing tests.

Options:

1️⃣  auto-fix        - Let me fix and resume batch
2️⃣  manual-fix      - I'll fix it, then resume
3️⃣  show-failures   - Show me the failing tests
4️⃣  skip-and-continue - Skip this task, continue batch ⚠️
5️⃣  stop-batch      - Stop batch, review progress

Your choice:
```

**Option 1: auto-fix**
```
User: 1

🔧 AUTO-FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing failures...

Issue 1: Grid layout
  Problem: Missing grid classes on container
  Fix: Add 'grid grid-cols-1 md:grid-cols-3 gap-6'
  
Issue 2: Loading state
  Problem: Skeleton component not imported
  Fix: Import and render <ProductCardSkeleton />

Applying fixes...
  ✓ Updated ProductsList.tsx
  ✓ Added missing imports
  ✓ Fixed grid classes

Re-running tests...
  ✓ [3/5] Grid layout ✅ NOW PASSES
  ✓ [4/5] Loading state ✅ NOW PASSES

✅ ALL TESTS NOW PASS (5/5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TASK 3.4 COMPLETED
  Duration: 35 minutes (including 8 min fix)
  Cost: $0.24

Resuming batch execution...

⚙️ BATCH EXECUTION [4/5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.5 - Create Product Detail Page
...
```

**Option 2: manual-fix**
```
User: 2

⏸️ BATCH PAUSED FOR MANUAL FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.4 has failing tests. Please fix:

Failed Tests:
  - Scenario 3: Grid layout issue
  - Scenario 4: Loading state missing

Files to check:
  - app/(public)/products/page.tsx
  - components/products/ProductsList.tsx

Test file: /task/Test3/Task 3.4.md
Test results: .claude/tasks/processed/Task 3.4 - Test Results.md

When you're done fixing, say:
  "resume batch" or "retry tests"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Waiting for your fix...

[User fixes code manually]

User: retry tests

🧪 Re-running tests for Task 3.4...

[Runs tests again]

✅ ALL TESTS NOW PASS (5/5)

Resuming batch execution...
```

---

### Step 4: Progress Check

**After every task in batch, show brief status:**
```
⚙️ BATCH PROGRESS [3/5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Task 3.2 - Products Hooks
   Implementation: ✅ (18 min)
   Tests: ✅ 4/4 passed (6 min)
   Cost: $0.18

✅ Task 3.3 - Product Card
   Implementation: ✅ (22 min)
   Tests: ✅ 5/5 passed (7 min)
   Cost: $0.21

✅ Task 3.4 - Products List
   Implementation: ✅ (27 min)
   Tests: ✅ 5/5 passed (8 min)
   Cost: $0.24
   Issues: 2 fixed during testing

🔄 Task 3.5 - Product Detail (current)
   Implementation: 🔄 In progress...
   
⏳ Task 4.1 - Cart API

Progress: 60% complete (3/5)
Time: 73 minutes elapsed
Cost: $0.63 so far
Tests: 14/14 scenarios passed (100%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**After batch completes:**
```
✅ BATCH COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Executed: 5 tasks
Duration: 2h 8m

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Task 3.2 - Products Hooks
   Tests: 4/4 ✅ | 24 min | $0.18

✅ Task 3.3 - Product Card  
   Tests: 5/5 ✅ | 29 min | $0.21

✅ Task 3.4 - Products List
   Tests: 5/5 ✅ | 35 min | $0.24
   Note: 2 issues auto-fixed

✅ Task 3.5 - Product Detail
   Tests: 6/6 ✅ | 31 min | $0.23

✅ Task 4.1 - Cart API
   Tests: 4/4 ✅ | 23 min | $0.17

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BATCH RESULTS:
  Total Tasks: 5/5 completed ✅
  All Tests Passed: 24/24 scenarios (100%)
  Issues Fixed: 2 (auto-fixed during testing)
  Total Duration: 2h 8m
  Total Cost: $1.03
  
QUALITY METRICS:
  Console Errors: 0
  Network Errors: 0
  Regression Issues: 0
  Test Pass Rate: 100%

OVERALL PROGRESS:
  Phase 3: 5/5 ████████████ 100% COMPLETE
  Phase 4: 1/6 ██░░░░░░░░░░ 16.7%
  Overall: 23/76 ████░░░░░░░░ 30.3%
  Total Project Cost: $2.84

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
  - Phase 3 complete! 🎉
  - Ready to start Phase 4: Cart Module
  - Next task: Task 4.2 - Create Cart Store

Continue? (yes/pause/review)
```

---

## Safety Checks ✨ ENHANCED

**Before starting batch:**
```
🛡️ PRE-BATCH SAFETY CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking system state...

✓ All previous tasks marked as completed
✓ No tasks marked as failed
✓ No tasks blocked
✓ All previous tests passed
✓ Dev server running (http://localhost:3000)
✓ Backend API accessible (http://localhost:8080)
✓ TypeScript compilation successful
✓ No console errors from previous tasks
✓ Git: All changes committed ✨ NEW
✓ Disk space: 45GB available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ System ready for batch execution
```

**If safety checks fail:**
```
⚠️ SAFETY CHECK FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issues found:

❌ Task 3.1 has failing tests (2/5 failed)
⚠️ Uncommitted changes in git (15 files)
⚠️ Backend API not responding

Cannot start batch with these issues.

Recommendations:
  1. Fix failing tests in Task 3.1
  2. Commit current changes
  3. Start backend server

Fix these issues? (yes/no)
```

---

## Batch Execution Strategies

### Strategy 1: Phase Completion

**Complete an entire phase in one batch:**
```
User: Execute all remaining tasks in Phase 3

📋 PHASE BATCH MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 3: Product Module - Public
  Completed: 1/5
  Remaining: 4 tasks
  
Will execute:
  ✅ 3.1 - Products API (done)
  → 3.2 - Products Hooks
  → 3.3 - Product Card
  → 3.4 - Products List Page
  → 3.5 - Product Detail Page

Estimated: 1h 50m | ~$0.85

Proceed? (yes/no)
```

---

### Strategy 2: Time-Boxed Execution

**Execute tasks for a specific duration:**
```
User: Execute tasks for the next 2 hours

⏱️ TIME-BOXED BATCH MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Duration: 2 hours
Will execute as many tasks as possible

Starting tasks:
  3.2, 3.3, 3.4, 3.5 (estimated 4 tasks)

Time check after each task.
Will stop at 2-hour mark or completion.

Start? (yes/no)
```

**During execution:**
```
⏱️ TIME CHECK [After Task 3.3]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elapsed: 1h 15m / 2h
Remaining: 45 minutes

Completed: 2 tasks
Estimated next task: 35 minutes

Continue? (yes/no/status)
```

---

### Strategy 3: Cost-Limited Execution

**Execute tasks within budget:**
```
User: Execute tasks with $1.00 budget

💰 BUDGET-LIMITED BATCH MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Budget: $1.00
Current cost: $0.58
Available: $0.42

Estimated tasks within budget:
  3.2 ($0.18) ✓
  3.3 ($0.21) ✓
  3.4 ($0.24) ⚠️ Over budget

Will execute: 2 tasks
Remaining budget: $0.03

Proceed? (yes/no)
```

---

## Pause and Resume

**User can pause anytime:**
```
User: pause

⏸️ BATCH PAUSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Batch Progress: 3/5 tasks

Completed:
  ✅ 3.2 - Products Hooks
  ✅ 3.3 - Product Card
  ✅ 3.4 - Products List

Remaining:
  ⏳ 3.5 - Product Detail
  ⏳ 4.1 - Cart API

To resume: "resume batch" or "continue"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Recovery

**If batch encounters errors:**
```
❌ BATCH ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.4 failed during implementation
Error: TypeScript compilation error in ProductsList.tsx

Batch stopped at: 2/5 tasks

Completed:
  ✅ 3.2 - Products Hooks (all tests ✅)
  ✅ 3.3 - Product Card (all tests ✅)

Failed:
  ❌ 3.4 - Products List
     Implementation error (line 45)

Not Started:
  ⏳ 3.5 - Product Detail
  ⏳ 4.1 - Cart API

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

1️⃣  fix-and-resume  - Fix Task 3.4 and continue batch
2️⃣  skip-and-resume - Skip 3.4, continue with 3.5
3️⃣  stop            - Stop batch, review error
4️⃣  rollback        - Undo 3.2 and 3.3, start over

Your choice:
```

---

## Progress Tracking Dashboard

**Show detailed progress anytime during batch:**
```
User: status

📊 BATCH EXECUTION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Batch: 3/5 tasks (60%)

Timeline:
  ✅ 10:00 - 10:24 | Task 3.2 (24m)
  ✅ 10:24 - 10:53 | Task 3.3 (29m)
  ✅ 10:53 - 11:28 | Task 3.4 (35m)
  🔄 11:28 - now   | Task 3.5 (12m so far)
  ⏳ pending      | Task 4.1 (~23m est)

Performance:
  Average: 29 min/task
  Tests: 14/14 passed (100%)
  Issues: 2 auto-fixed
  
Cost:
  Spent: $0.63
  Estimated remaining: $0.40
  Total projected: $1.03
  
Quality:
  Console errors: 0
  Network errors: 0
  Failed tests: 0
  Regression issues: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Batch continues...
```

---

## Batch Completion Options

**After batch finishes:**
```
✅ BATCH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Shows summary as above]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's next?

1️⃣  continue      - Start another batch
2️⃣  review-all    - Review all work from this batch
3️⃣  test-manually - Let me test everything manually
4️⃣  commit        - Commit all changes to git
5️⃣  report        - Generate detailed batch report
6️⃣  pause         - Stop for now

Your choice:
```

---

## Command Variations

**User can start with different commands:**
```bash
# Basic continuation
/continue-tasks
continue

# Specific number
/continue-tasks 5
batch 5

# Until blocked
/continue-tasks until-blocked

# Complete phase
/continue-tasks phase 3

# Time-boxed
/continue-tasks 2h

# Budget-limited
/continue-tasks budget $1.00

# Auto mode (no prompts)
/continue-tasks auto 5
```

---

## Summary

**Key Features:**
- ✅ Batch execution with automatic testing
- ✅ Stops on test failures (with auto-fix option)
- ✅ Progress tracking throughout batch
- ✅ Multiple execution strategies (phase, time, budget)
- ✅ Pause and resume capability
- ✅ Error recovery options
- ✅ Safety checks before starting
- ✅ Comprehensive reporting after completion
- ✅ Token and cost tracking per task and batch

**Benefits:**
- 🚀 Faster development (multiple tasks in one go)
- 🧪 Every task tested automatically
- 🛡️ Safety checks prevent issues
- 📊 Clear progress visibility
- 💰 Cost tracking and limits
- 🔧 Auto-fix for common issues
- 📝 Complete documentation generated

---

**This continue-tasks.md is now complete with full testing integration!** ✅🔄🧪
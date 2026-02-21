# AI Agent Task Execution Guide

**Document Purpose:** Complete instructions for AI agents (Claude Code, etc.) to execute tasks in this project according to the established system.

**Last Updated:** 2026-02-21  
**Version:** 1.0

---

## 📋 Overview

This project uses a **structured task execution system** with:
- 76 tasks across 16 phases
- Automated testing with Playwright
- Comprehensive documentation requirements
- Token usage tracking
- Quality gates at every step

**Your role as an AI agent:** Execute tasks exactly as defined, following all standards, generating tests, and documenting everything.

---

## 🎯 Quick Start

When user says **"execute task"** or **"continue"**, follow this workflow:

```
1. Read .claude/tasks/systemTasks.md → Find next PENDING task
2. Read /task/PhaseX/Task X.Y.md → Understand requirements
3. Verify all dependencies are ✅ COMPLETED
4. Present task summary to user → Wait for confirmation
5. Execute implementation → Follow task definition exactly
6. Generate test scenarios → From acceptance criteria
7. Run Playwright tests → Verify all pass
8. Create documentation → Both implementation + test results
9. Update systemTasks.md → Mark complete with metrics
10. Present results → Show summary, offer next steps
```

**Cannot skip steps. All must complete successfully.**

---

## 📖 Detailed Workflow

### Step 1: Find Next Task

```bash
# Read systemTasks.md
cat .claude/tasks/systemTasks.md

# Find next task with: Status: ⏳ PENDING
# Example: Task 1.3
```

### Step 2: Verify Dependencies

```
Task 1.3 Dependencies:
  - 1.1 ✅ COMPLETED
  - 1.2 ✅ COMPLETED
  - 1.3.1 ✅ COMPLETED

All complete? → Proceed
Any PENDING? → Stop, inform user
```

### Step 3: Read Task Definition

```bash
# Read the specific task file
cat /task/Phase1/Task 1.3.md
```

**Extract:**
- Objective
- File locations
- All requirements (numbered sections)
- Test scenarios
- Acceptance criteria
- Critical notes

### Step 4: Present to User

```
📋 TASK 1.3: Create Auth API Module
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective: Create login, register, logout API functions
Files: src/lib/api/auth.ts (create)
Estimated: 30-35 minutes
Tests: 8 scenarios

Ready to proceed? (yes/no)
```

**Wait for "yes" before continuing.**

### Step 5: Implement

**Read documentation first:**
```bash
cat docs/CODING_STANDARDS.md
cat docs/API_INTEGRATION.md
```

**Then create files exactly as task specifies:**
```typescript
// Task says: Create src/lib/api/auth.ts
// You create: src/lib/api/auth.ts

// Follow code examples in task definition
// But adapt to actual project structure
```

**Verify:**
```bash
# TypeScript compiles
tsc --noEmit

# No errors
echo $?  # Should be 0
```

### Step 6: Generate Tests

**Create:** `/task/Test1/Task 1.3.md`

**Content:**
```markdown
# Test Scenarios - Task 1.3

## Scenario 1: Login with valid credentials
[Test code from task definition]

## Scenario 2: Login with invalid credentials
[Test code from task definition]

... (all 8 scenarios)
```

### Step 7: Execute Tests

```bash
# Run Playwright tests
npx playwright test tests/task-1.3.spec.ts --reporter=json > results.json

# Parse results
cat results.json
```

**If ANY test fails:**
1. Show failure to user
2. Analyze issue
3. Fix code
4. Re-run tests
5. Repeat until ALL pass

### Step 8: Document

**Create TWO files:**

**File 1:** `task/processed/Task 1.3.md`
```markdown
# Task 1.3 - Auth API Module
Status: ✅ COMPLETED
[Implementation details, decisions, code highlights]
```

**File 2:** `task/processed/Task 1.3 - Test Results.md`
```markdown
# Test Results - Task 1.3
Total: 8/8 passed ✅
[Detailed scenario results, screenshots, metrics]
```

### Step 9: Update systemTasks.md

**Change:**
```markdown
### Task 1.3: Create Auth API Module
- **Status**: ⏳ PENDING  → **Status**: ✅ COMPLETED
- **Started**: -          → **Started**: 2026-02-21 10:15
- **Completed**: -        → **Completed**: 2026-02-21 10:40
[Add all actual metrics]

**✨ Testing**:
- **Test Status**: ⏳ NOT_TESTED → **Test Status**: ✅ PASSED
- **Test Scenarios**: 8 estimated → 8 total (8 passed, 0 failed)
[Add all test metrics]
```

### Step 10: Present Results

```
✅ TASK COMPLETED
Task 1.3: Create Auth API Module
Duration: 25 min | Cost: $0.13

📁 FILES: src/lib/api/auth.ts
🧪 TESTS: 8/8 passed ✅
💰 COST: $0.09 impl + $0.04 test

Next: Task 1.4 - Create Auth Hooks

Options:
1️⃣ continue
2️⃣ review
3️⃣ pause
```

---

## 🚨 Critical Rules

### Rule 1: Always Read Task Definition

**NEVER assume** what a task requires. **ALWAYS read** the file.

```bash
# ✅ CORRECT
cat /task/Phase1/Task 1.3.md
# Read entire file, understand requirements, then execute

# ❌ WRONG
# "I remember Task 1.3 is about auth, I'll just create it"
```

### Rule 2: Tests Must Pass

**Cannot mark complete unless ALL tests pass.**

```
8/8 tests passed ✅ → Can mark complete
6/8 tests passed ❌ → CANNOT mark complete
```

### Rule 3: Never Clear SessionId

```typescript
// ✅ CORRECT - Preserves sessionId
authStore.logout();

// ❌ WRONG - Removes sessionId (breaks cart!)
authStore.clearAll();
```

### Rule 4: Backend Returns Data Directly

```typescript
// ✅ CORRECT
const product = response.data;

// ❌ WRONG - No wrapper!
const product = response.data.data;  // undefined!
```

### Rule 5: Follow Documentation

All code must match:
- `docs/CODING_STANDARDS.md`
- `docs/API_INTEGRATION.md`
- `docs/FRONTEND_ARCHITECTURE.md`

### Rule 6: Track Tokens Separately

```
Implementation: 7,000 tokens ($0.09)
Testing: 3,200 tokens ($0.04)
Total: 10,200 tokens ($0.13)
```

Log both in systemTasks.md.

---

## ✅ Quality Checklist

Before marking COMPLETED:

**Code:**
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] No `any` types
- [ ] Proper imports
- [ ] Error handling
- [ ] Comments on public functions

**Testing:**
- [ ] Test scenarios generated
- [ ] ALL tests executed
- [ ] ALL tests passed
- [ ] 0 console errors
- [ ] 0 network errors

**Documentation:**
- [ ] Implementation doc created
- [ ] Test results doc created
- [ ] systemTasks.md updated
- [ ] Phase progress updated

---

## 🔧 Handling Failures

### If Tests Fail

```
❌ 2/8 tests failed

Options:
1️⃣ auto-fix → I analyze and fix
2️⃣ show-failures → Show details
3️⃣ skip → Mark complete anyway (NOT recommended)
```

**Auto-fix process:**
1. Analyze failure reason
2. Identify code issue
3. Apply fix
4. Re-run tests
5. Confirm all pass

### If Dependencies Missing

```
⚠️ Cannot proceed
Task 1.3 needs Task 1.3.1 (PENDING)

Options:
1️⃣ execute-1.3.1 → Do dependency first
2️⃣ skip → Skip 1.3 for now
```

---

## 📊 Example Complete Execution

```
User: execute task

Agent:
  [Reads systemTasks.md]
  [Finds Task 1.3 PENDING]
  [Reads /task/Phase1/Task 1.3.md]
  [Checks dependencies: all ✅]
  
  📋 TASK 1.3: Create Auth API Module
  Ready? (yes/no)
  
User: yes

Agent:
  [Reads CODING_STANDARDS.md]
  [Reads API_INTEGRATION.md]
  [Creates src/lib/api/auth.ts]
  [Implements login, register, logout]
  [Verifies TypeScript compiles]
  
  ⚙️ Implementation complete
  
  [Generates test scenarios]
  [Creates /task/Test1/Task 1.3.md]
  
  🧪 Generated 8 test scenarios
  
  [Runs Playwright tests]
  
  ✅ ALL 8 TESTS PASSED
  
  [Creates task/processed/Task 1.3.md]
  [Creates task/processed/Task 1.3 - Test Results.md]
  [Updates systemTasks.md]
  
  ✅ TASK COMPLETED
  Duration: 25 min
  Cost: $0.13
  Tests: 8/8 ✅
  
  Next: Task 1.4
  
  Options:
  1️⃣ continue
  2️⃣ review
  3️⃣ pause
  
User: continue

Agent:
  [Starts Task 1.4...]
```

---

## 🎯 Success = All These True

1. ✅ Code written per task definition
2. ✅ Files in correct locations
3. ✅ TypeScript compiles
4. ✅ Tests generated
5. ✅ Tests executed
6. ✅ **ALL tests passed**
7. ✅ Both docs created
8. ✅ systemTasks.md updated
9. ✅ User sees results

**Only then:** Status = ✅ COMPLETED

---

**Remember: Quality over speed. Complete, tested, documented. No shortcuts!**
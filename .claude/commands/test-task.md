# Test Task - Execute Tests for Completed Task

Run or re-run tests for any task.

## Usage
```bash
# Test current/most recent task
/test-task

# Test specific task
/test-task 2.1

# Test with options
/test-task 2.1 --verbose
/test-task 2.1 --scenario 3
```

## Workflow

### Step 1: Identify Task
```
🧪 TEST TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: 2.1 - Create Login Page
Status: ✅ COMPLETED
Last Tested: 2 hours ago

Test File: task/Test2/Task 2.1.md
Previous Results: 5/5 passed

Re-run tests? (yes/no):
```

### Step 2: Execute Tests

[Run all scenarios using Playwright]

### Step 3: Show Results
```
✅ ALL TESTS PASSED (5/5)

Changed since last test:
  - None (code unchanged)

Proceed? (yes/done):
```

### Step 4: Update Results

Save to `.claude/tasks/processed/Task 2.1 - Test Results.md`
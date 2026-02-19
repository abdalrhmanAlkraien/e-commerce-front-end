# Current Task Execution

**Last Updated**: Not started
**Current Task Number**: NONE
**Current Phase**: NONE
**Status**: READY_FOR_NEXT_TASK

---

## Purpose

This file holds the current task being executed in the interactive task-by-task workflow.

---

## How This File Works

### State 1: Ready (Current State)
When status is `READY_FOR_NEXT_TASK`:
- File is empty/cleared
- Waiting for user to run `/execute-task`
- No task currently in progress

### State 2: Task Loaded
When user starts a task:
- Task details copied from `/task/PhaseX/Task X.Y.md`
- Status changes to `IN_PROGRESS`
- Timestamps recorded
- Task displayed to user for confirmation

### State 3: Execution
During task execution:
- This file contains full task context
- Claude references this file during work
- Token usage tracked
- Progress shown to user

### State 4: Completion
After task completes:
- Results presented to user
- User chooses action (continue/review/fix/pause)
- If user chooses "continue":
   - This file cleared
   - Status back to `READY_FOR_NEXT_TASK`
   - Ready for next task

---

## Interactive Workflow
```
User: /execute-task
   ↓
Claude reads systemTasks.md
   ↓
Finds next PENDING task
   ↓
Reads /task/PhaseX/Task X.Y.md
   ↓
Copies task details to THIS FILE
   ↓
Shows summary to user
   ↓
User confirms (yes/no/skip)
   ↓
Claude executes task
   ↓
Creates processed/Task X.Y.md
   ↓
Updates systemTasks.md
   ↓
Presents review options
   ↓
User chooses:
  - continue → Clear this file, start next task
  - review → Show files created
  - fix → Enter fix mode
  - pause → Save state, stop
  - test → Manual testing mode
```

---

## Current Task

_No task currently loaded_

**Status**: READY_FOR_NEXT_TASK

---

## Task Format (When Loaded)

When a task is being executed, this file will contain:
```markdown
# Current Task Execution

**Last Updated**: 2026-02-18 14:30:00
**Current Task Number**: X.Y
**Current Phase**: Phase X
**Status**: IN_PROGRESS

---

## Task X.Y: [Task Name]

**Task Definition**: /task/PhaseX/Task X.Y.md
**Started At**: 2026-02-18 14:30:00

---

### Description

[Full description from task definition file]

---

### Requirements

1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]
...

---

### Expected Outputs

- File 1: path/to/file1.tsx
- File 2: path/to/file2.ts
...

---

### Test Criteria

✓ [Test 1]
✓ [Test 2]
✓ [Test 3]
...

---

### Estimated Duration

[Time estimate from task file]

---

### Token Usage (Tracking)

**Start Token Count**: [Recorded at start]
**Current Token Count**: [Updated during execution]

---

## Execution Progress

⚙️ [Current step being executed]

[Progress updates appear here during execution]

---

## Completion

**Finished At**: [Timestamp when done]
**Duration**: [Calculated time]
**Final Token Count**: [Total tokens used]
**Cost**: [Calculated cost]
```

---

## Instructions for Claude

### When Executing `/execute-task`

1. **Check this file first**
   - If status is `READY_FOR_NEXT_TASK` → proceed
   - If status is `IN_PROGRESS` → ask if should continue or restart

2. **Load next task**
   - Read `.claude/tasks/systemTasks.md`
   - Find first task with ⏳ PENDING status
   - Read task definition from `/task/PhaseX/Task X.Y.md`

3. **Update this file**
   - Copy task details here
   - Set status to `IN_PROGRESS`
   - Record start timestamp
   - Display to user for confirmation

4. **Execute task**
   - Follow requirements from task definition exactly
   - Update progress in this file as you work
   - Track token usage

5. **After completion**
   - Create `.claude/tasks/processed/Task X.Y.md`
   - Update `.claude/tasks/systemTasks.md`
   - Present review options to user
   - **Wait for user decision** before clearing this file

6. **User chooses "continue"**
   - Clear this file
   - Reset status to `READY_FOR_NEXT_TASK`
   - Proceed to next pending task

7. **User chooses other option**
   - Keep this file as-is
   - Handle user's choice (review/fix/pause/test)
   - Wait for further instructions

---

## Important Notes

- **Never clear this file until user says "continue"**
- This file is for task execution only
- Task definitions live in `/task/PhaseX/Task X.Y.md`
- Completed task docs go in `.claude/tasks/processed/Task X.Y.md`
- This file should be empty between tasks
- Always reference the task definition file location
- Track token usage throughout execution

---

## Quick Commands

When this file contains an in-progress task:

- `continue` - Complete task and move to next
- `pause` - Stop execution, save state
- `status` - Show current task progress
- `abandon` - Cancel current task, mark as failed

---

**Current State**: Empty, ready for next task via `/execute-task`
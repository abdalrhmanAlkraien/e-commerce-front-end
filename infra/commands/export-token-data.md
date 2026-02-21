# Log Tokens - Manual Token Usage Tracking

Manually log token usage for completed tasks when automatic tracking isn't available.

---

## Command Usage

### Log Current Task
```
/log-tokens
```
Logs tokens for the most recently completed task.

### Log Specific Task
```
/log-tokens 2.1
/log-tokens Task 2.1
```
Logs tokens for a specific task by number.

### Bulk Log
```
/log-tokens --bulk
```
Log tokens for multiple tasks at once.

---

## When to Use This Command

Use `/log-tokens` when:
- ✅ Just completed a task manually
- ✅ Task completed but tokens not automatically tracked
- ✅ Reviewing old tasks without token data
- ✅ Using Claude.ai web interface (tokens shown in UI)
- ✅ Correcting incorrect token counts

Do NOT use when:
- ❌ Task not yet completed
- ❌ Tokens already logged (use update instead)
- ❌ Using API with automatic tracking

---

## Where to Find Token Counts

### Claude.ai Web Interface
1. Look at bottom-right of conversation
2. Usage indicator shows token counts
3. Click for detailed breakdown
4. Note: Shows cumulative for entire conversation

### Claude API Response
Token counts in response headers:
```
x-input-tokens: 12450
x-output-tokens: 8230
```

### Calculate from Conversation
If token counts not visible:
- Before task: Note conversation tokens
- After task: Note new total
- Used = After - Before

---

## Workflow

### Step 1: Identify Task

**If no task specified:**
```
📊 TOKEN LOGGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent completed tasks without token data:

1. Task 3.3: Product Card Component ⚠️ NO TOKENS
2. Task 3.2: Products Hooks ✅ HAS TOKENS
3. Task 3.1: Products API ✅ HAS TOKENS
4. Task 2.3: Auth Layout ✅ HAS TOKENS

Which task to log tokens for? (1 or task number):
```

**If task specified:**
```
📊 TOKEN LOGGING - Task 2.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: 2.1 - Create Login Page
Status: ✅ COMPLETED
Completed: Feb 20, 2:15 PM
Duration: 28 minutes

Current Token Data: ⚠️ NOT LOGGED

Ready to log tokens? (yes/no)
```

---

### Step 2: Request Token Counts
```
📊 TOKEN INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1: Create Login Page

Please provide token counts from your Claude interface:

WHERE TO FIND:
- Claude.ai: Check usage indicator (bottom-right)
- API: Check response headers
- Conversation: Before/After difference

IMPORTANT: Only count tokens used FOR THIS TASK
If logging from ongoing conversation:
  - Before task tokens: _____
  - After task tokens: _____
  - Task tokens = After - Before

Enter token counts:

Input Tokens: _____
Output Tokens: _____

(Or type 'help' for more guidance)
```

**User enters numbers:**
```
Input Tokens: 12450
Output Tokens: 8230
```

---

### Step 3: Validate Input
```
🔍 VALIDATING INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input Tokens:  12,450
Output Tokens: 8,230
Total Tokens:  20,680

Validation:
✓ Numbers are valid
✓ Input/Output ratio: 1.51:1 (healthy)
✓ Total within expected range for this task

Cost Calculation:
  Input:  (12,450 / 1,000,000) × $3.00 = $0.037
  Output: (8,230 / 1,000,000) × $15.00 = $0.123
  Total:  $0.160

Comparison to Averages:
  Task tokens:   20,680
  Project avg:   10,667 tokens
  This task:     94% ABOVE average ⚠️

  Task cost:     $0.160
  Project avg:   $0.162
  This task:     1% BELOW average ✅

Analysis: Higher token count but efficient output ratio

Does this look correct? (yes/no/retry)
```

**If numbers seem wrong:**
```
⚠️  WARNING: Unusual Token Counts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input Tokens:  50,000
Output Tokens: 2,000
Total:         52,000

Issues detected:
⚠️  Very high input tokens (4.7x average)
⚠️  Very low output tokens (0.5x average)
⚠️  Unusual ratio: 25:1 (expect 1-2:1)

Possible causes:
- Included entire conversation instead of just task
- Counted cumulative instead of task-only
- Task involved extensive file reading

Are these counts correct? (yes/no)

If no, let's try again:
  - Check if you counted just THIS task
  - Use Before/After method to isolate task
  - Verify you're looking at the right conversation

Retry? (yes/no)
```

---

### Step 4: Update systemTasks.md
```
💾 UPDATING SYSTEM TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating systemTasks.md...

Step 1/5: Locating Task 2.1...
  ✓ Found in Phase 2

Step 2/5: Updating task fields...
  ✓ Input Tokens: 12,450
  ✓ Output Tokens: 8,230
  ✓ Total Tokens: 20,680
  ✓ Cost Estimate: $0.160

Step 3/5: Updating Phase 2 totals...
  Before: 3 tasks, $0.42 total
  After:  3 tasks, $0.58 total
  ✓ Phase totals updated

Step 4/5: Updating Progress Summary...
  Before: Total Cost: $2.82
  After:  Total Cost: $2.98
  ✓ Grand totals updated

Step 5/5: Updating Token Usage by Phase table...
  Phase 2: Updated with new tokens/cost
  ✓ Table updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes Applied to systemTasks.md:

### Task 2.1: Create Login Page
- **Input Tokens**: 12,450
- **Output Tokens**: 8,230
- **Total Tokens**: 20,680
- **Cost Estimate**: $0.160

Phase 2 Totals:
- Total Cost: $0.58 (was $0.42)

Project Totals:
- Total Tokens: 202,680 (was 182,000)
- Total Cost: $2.98 (was $2.82)

✓ All updates successful
```

---

### Step 5: Update Processed Documentation
```
📝 UPDATING PROCESSED FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating .claude/tasks/processed/Task 2.1.md...

Adding token usage section:

## Token Usage

**Input Tokens**: 12,450
**Output Tokens**: 8,230
**Total Tokens**: 20,680

**Cost Breakdown**:
- Input Cost: (12,450 / 1,000,000) × $3 = $0.037
- Output Cost: (8,230 / 1,000,000) × $15 = $0.123
- **Total Cost**: $0.160

**Logged**: Feb 20, 2026 at 4:45 PM (manual entry)

✓ Processed file updated
```

---

### Step 6: Show Confirmation & Context
```
✅ TOKEN LOGGING COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Successfully logged tokens for Task 2.1!

TASK DETAILS:
  Task:         2.1 - Create Login Page
  Input:        12,450 tokens
  Output:       8,230 tokens
  Total:        20,680 tokens
  Cost:         $0.160

FILES UPDATED:
  ✓ .claude/tasks/systemTasks.md
  ✓ .claude/tasks/processed/Task 2.1.md

PROJECT IMPACT:
  Before: $2.82 total (17 tasks)
  After:  $2.98 total (18 tasks logged)
  Change: +$0.16

AVERAGES:
  Project avg: $0.165/task (was $0.166)
  This task:   $0.160 (3% below avg) ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CURRENT PROJECT STATUS

Total Tokens:  202,680
Total Cost:    $2.98
Tasks Logged:  18 / 18 completed (100%) ✅
Avg per Task:  $0.165

Budget:        $15.00
Spent:         $2.98 (19.9%)
Remaining:     $12.02 (80.1%)
Status:        🟢 On Track

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1️⃣ log-another  - Log tokens for another task
2️⃣ review       - See full token usage report
3️⃣ continue     - Resume task execution
4️⃣ done         - Finish logging

Your choice:
```

---

## Bulk Logging

### Multiple Tasks at Once
```
/log-tokens --bulk
```

Shows:
```
📊 BULK TOKEN LOGGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tasks needing token data:

1. Task 2.1: Login Page ⚠️
2. Task 2.2: Register Page ⚠️
3. Task 2.3: Auth Layout ⚠️

Enter tokens for each task:

Task 2.1 - Login Page:
  Input Tokens: 12450
  Output Tokens: 8230

Task 2.2 - Register Page:
  Input Tokens: 11200
  Output Tokens: 7800

Task 2.3 - Auth Layout:
  Input Tokens: 9600
  Output Tokens: 6400

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
  Total Input:  33,250 tokens
  Total Output: 22,430 tokens
  Total:        55,680 tokens
  Total Cost:   $0.84

Looks correct? (yes/no)

[If yes, updates all at once]

✅ Logged 3 tasks successfully!
  Total added to project: $0.84
  Project total: $3.42
```

---

## Error Handling

### Task Already Has Tokens
```
⚠️  TOKENS ALREADY LOGGED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1 already has token data:

Current:
  Input:  12,450 tokens
  Output: 8,230 tokens
  Total:  20,680 tokens
  Cost:   $0.160

What would you like to do?

1️⃣ update    - Replace with new values
2️⃣ add       - Add to existing (for fixes)
3️⃣ skip      - Keep current, cancel
4️⃣ view      - See full token details

Your choice:
```

### Invalid Numbers Entered
```
❌ INVALID INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input:  "twelve thousand"
Output: "8k"

Error: Please enter numeric values only

Examples of valid input:
  12450
  12,450
  12.45 (treated as 12)

Try again? (yes/no)
```

### Task Not Found
```
❌ TASK NOT FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 99.9 does not exist in systemTasks.md

Valid task range: 0.1 - 15.5 (76 tasks total)

Recent tasks:
  • Task 3.3: Product Card Component
  • Task 3.2: Products Hooks
  • Task 3.1: Products API

Try again? (yes/no)
```

### Task Not Completed
```
⚠️  TASK NOT COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 3.4: Products List Page
Status: ⏳ PENDING (not started)

You can only log tokens for completed tasks.

Current in-progress: Task 3.3
Last completed: Task 3.2

Log tokens for Task 3.2 instead? (yes/no)
```

---

## Update Existing Token Data
```
/log-tokens --update 2.1
```

Shows:
```
🔄 UPDATE TOKEN DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1: Create Login Page

Current Token Data:
  Input:  12,450 tokens
  Output: 8,230 tokens
  Total:  20,680 tokens
  Cost:   $0.160
  Logged: Feb 20, 4:45 PM

Why update?
1️⃣ correction  - Original numbers were wrong
2️⃣ fix-added   - Task was fixed, adding fix tokens
3️⃣ recount     - Recounted conversation tokens

Your choice:

[If fix-added:]
This will ADD to existing tokens (not replace)

Current:  20,680 tokens ($0.160)
Fix tokens to add:
  Input: 450
  Output: 280

New total: 21,410 tokens ($0.167)

Proceed? (yes/no)
```

---

## Quick Log (Fast Entry)
```
/log-tokens 2.1 12450 8230
```

Directly provides:
- Task number: 2.1
- Input tokens: 12,450
- Output tokens: 8,230

Shows confirmation and logs immediately:
```
⚡ QUICK LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1: Login Page
Input:  12,450
Output: 8,230
Total:  20,680
Cost:   $0.160

✓ Logged successfully!

Project total: $2.98
```

---

## Help Guide
```
/log-tokens --help
```

Shows:
```
📖 TOKEN LOGGING HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE:
  /log-tokens              Log current task
  /log-tokens 2.1          Log specific task
  /log-tokens --bulk       Log multiple tasks
  /log-tokens --update 2.1 Update existing data

HOW TO FIND TOKEN COUNTS:

1. Claude.ai Web Interface:
   • Look at bottom-right corner
   • Click usage indicator for details
   • Shows cumulative conversation tokens
   • Calculate: After Task - Before Task

2. Claude API:
   • Check response headers
   • x-input-tokens: 12450
   • x-output-tokens: 8230

3. If Unsure:
   • Estimate based on task complexity
   • Use project averages as guide
   • Simple tasks: 8,000-12,000 tokens
   • Complex tasks: 15,000-25,000 tokens

COST FORMULA:
  Input Cost  = (Input / 1,000,000) × $3
  Output Cost = (Output / 1,000,000) × $15
  Total Cost  = Input Cost + Output Cost

TIPS:
  • Log tokens right after completing task
  • Only count tokens used FOR THAT TASK
  • If conversation includes multiple tasks, subtract
  • Keep browser tab open to see usage indicator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Integration with Other Commands

### After Task Completion

When `/execute-task` completes without automatic token tracking:
```
✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 2.1: Create Login Page

[... results ...]

⚠️  TOKEN TRACKING NEEDED

Would you like to log token usage now?

1️⃣ yes       - Log tokens now
2️⃣ later     - Continue without logging (can log later)
3️⃣ estimate  - Use project average ($0.165)

Your choice:

[If yes, launches /log-tokens]
```

---

This comprehensive log-tokens command provides **robust manual token tracking with validation, error handling, and full integration**! 📊✅
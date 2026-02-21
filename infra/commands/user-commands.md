# User Commands Reference Guide

Complete reference for all commands available in the E-Commerce Frontend task execution system.

---

## Command Types

### 1. Slash Commands (Formal)
Format: `/command-name [options]`
- Full-featured commands
- Access all options
- Recommended for complex operations

Example: `/execute-task`, `/review-progress`

### 2. Quick Commands (Shortcuts)
Format: `command` or `command [args]`
- Natural language shortcuts
- Faster for common actions
- Converted to slash commands internally

Example: `continue`, `status`, `fix`

### 3. Natural Phrases
Format: Natural language
- Conversational commands
- Interpreted by Claude
- Most flexible

Example: "Show me the progress", "Continue from here"

---

## 📋 All Commands Reference

### Task Execution Commands

#### /execute-task
**Purpose**: Execute the next pending task with full interactive workflow

**Usage**:
```
/execute-task
```

**What it does**:
1. Finds next pending task
2. Shows task details
3. Waits for your confirmation
4. Executes task
5. Shows results
6. Offers review options

**When to use**:
- Starting a new task
- Want full control and review
- First time through a phase

**Shortcuts**:
- `start`
- `begin`

---

#### /continue-tasks
**Purpose**: Execute multiple tasks in sequence or batch

**Usage**:
```
/continue-tasks                    # Interactive mode
/continue-tasks --batch 5          # Batch 5 tasks
/continue-tasks --phase            # Complete phase
```

**Options**:
- `--batch N` - Execute N tasks without stopping
- `--phase` - Complete entire current phase
- `--sequential` - One by one with reviews (default)

**When to use**:
- Want to complete multiple tasks
- Have time for batch execution
- Tasks are straightforward

**Shortcuts**:
- `continue` - Interactive mode
- `batch 5` - Batch 5 tasks

---

### Review & Information Commands

#### /review-progress
**Purpose**: Show comprehensive project progress report

**Usage**:
```
/review-progress                   # Full report
/review-progress --quick           # Quick summary
/review-progress --phase 3         # Phase 3 only
```

**Shows**:
- Overall statistics
- Phase breakdown
- Token usage
- Cost analysis
- Timeline
- Blockers

**When to use**:
- Check overall progress
- Weekly/daily status check
- Before/after major milestones
- Stakeholder reporting

**Shortcuts**:
- `status`
- `progress`

**Example**:
```
User: status
→ Shows full progress report
```

---

#### /review-file
**Purpose**: Display contents of a specific file

**Usage**:
```
/review-file [path]
/review-file src/app/layout.tsx
```

**Shows**:
- File contents with syntax highlighting
- Line count
- Which task created it
- Key sections highlighted

**When to use**:
- Reviewing generated code
- Checking specific implementation
- Before making changes

**Shortcuts**:
- `review [filename]`
- `show [filename]`

**Example**:
```
User: review app/layout.tsx
→ Shows file with highlighting
```

---

#### /review-token-usage
**Purpose**: Comprehensive token usage and cost analysis

**Usage**:
```
/review-token-usage                # Full report
/review-token-usage --quick        # Quick summary
/review-token-usage --phase 2      # Phase 2 only
/review-token-usage --export csv   # Export data
```

**Shows**:
- Total tokens and cost
- Cost by phase
- Efficiency metrics
- Projections
- Optimization tips

**When to use**:
- Check spending
- Before major work
- Budget reviews
- Optimization planning

**Shortcuts**:
- `tokens`
- `cost`

**Example**:
```
User: cost
→ Shows token usage summary
```

---

### Fix & Debug Commands

#### /fix-task
**Purpose**: Fix issues in completed tasks

**Usage**:
```
/fix                               # Fix last task
/fix-task 2.1                      # Fix specific task
/fix Port 3000 is in use           # Quick fix
```

**Process**:
1. Identifies task
2. Asks for issue description
3. Analyzes problem
4. Proposes solution
5. Gets approval
6. Implements fix
7. Re-runs tests
8. Updates documentation

**When to use**:
- Task has bugs
- Tests failing
- User found issues
- Need refinement

**Shortcuts**:
- `fix`
- `fix [description]`
- `retry`

**Example**:
```
User: fix "Login button not working"
→ Analyzes and fixes the issue
```

---

### Token Tracking Commands

#### /log-tokens
**Purpose**: Manually log token usage for tasks

**Usage**:
```
/log-tokens                        # Log current task
/log-tokens 2.1                    # Log specific task
/log-tokens 2.1 12450 8230         # Quick log
/log-tokens --bulk                 # Log multiple
```

**When to use**:
- After completing task manually
- Tokens not auto-tracked
- Correcting token data

**Example**:
```
User: /log-tokens

Claude: Task 2.1 needs tokens.
Input tokens: 12450
Output tokens: 8230
→ Logs and confirms
```

---

#### /export-token-data
**Purpose**: Export token data for analysis

**Usage**:
```
/export-token-data                 # CSV export
/export-token-data --json          # JSON format
/export-token-data --xlsx          # Excel format
/export-token-data --phase 2       # Phase 2 only
```

**Exports to**:
- CSV for Excel/Sheets
- JSON for programming
- XLSX with formatting
- Markdown for docs
- Google Sheets (direct)

**When to use**:
- Need external analysis
- Create reports
- Share with team
- Archive data

**Example**:
```
User: /export-token-data --csv
→ Generates and provides download link
```

---

## Quick Command Reference

### Navigation

| Command | Action | Example |
|---------|--------|---------|
| `continue` | Execute next task | `continue` |
| `next` | Same as continue | `next` |
| `skip` | Skip current/next task | `skip` |
| `back` | Go to previous task | `back` |
| `pause` | Save and stop | `pause` |

### Review

| Command | Action | Example |
|---------|--------|---------|
| `review` | Show what was created | `review` |
| `review [file]` | Show specific file | `review app/page.tsx` |
| `files` | List all files | `files` |
| `code` | Show main code files | `code` |
| `tests` | Show test results | `tests` |
| `status` | Show progress | `status` |
| `progress` | Same as status | `progress` |

### Fixes

| Command | Action | Example |
|---------|--------|---------|
| `fix` | Fix something | `fix` |
| `fix [issue]` | Fix specific issue | `fix "Port conflict"` |
| `retry` | Retry current task | `retry` |
| `debug` | Investigate error | `debug` |

### Information

| Command | Action | Example |
|---------|--------|---------|
| `tokens` | Show token usage | `tokens` |
| `cost` | Show cost so far | `cost` |
| `help` | Show all commands | `help` |
| `details` | Show task details | `details` |

### Special

| Command | Action | Example |
|---------|--------|---------|
| `stop` | Stop batch execution | `stop` |
| `cancel` | Cancel current operation | `cancel` |
| `rollback` | Undo last changes | `rollback` |

---

## Natural Language Commands

You can also use natural phrases:

### Execution
- "Start the next task"
- "Continue from where we left off"
- "Execute the next 5 tasks"
- "Complete Phase 3"

### Review
- "Show me the progress"
- "What have we done today?"
- "How much have we spent?"
- "List all the files we created"

### Fixes
- "Something is broken in the login page"
- "The tests are failing"
- "Port 3000 is already in use"
- "Can you fix the authentication?"

### Information
- "What's next?"
- "How are we doing?"
- "Are we on budget?"
- "What tasks are left?"

---

## Command Options & Flags

### Common Flags

| Flag | Purpose | Example |
|------|---------|---------|
| `--quick` | Quick/summary version | `status --quick` |
| `--phase N` | Filter by phase | `tokens --phase 2` |
| `--batch N` | Batch N items | `continue --batch 5` |
| `--export FORMAT` | Export data | `tokens --export csv` |
| `--help` | Show help | `/execute-task --help` |

### Filter Options

| Filter | Purpose | Example |
|--------|---------|---------|
| `--today` | Today's data | `tokens --today` |
| `--week` | This week | `tokens --week` |
| `--completed` | Completed only | `export --completed` |
| `--pending` | Pending only | `status --pending` |
| `--failed` | Failed only | `status --failed` |

---

## Usage Examples

### Starting Work Session
```
User: status

Claude: [Shows progress report]
  18/76 tasks complete (23.7%)
  Cost: $2.98
  Next: Task 3.3

User: continue

Claude: [Executes Task 3.3]
```

---

### Reviewing Progress
```
User: How are we doing?

Claude: [Shows summary]
  ✅ 18 tasks done
  🟢 Under budget ($2.98 / $15)
  🎯 On schedule (ahead by 2 days)

User: Show me token usage

Claude: [Shows token report]
  Total: 192K tokens ($2.98)
  Avg: 10.7K per task
  Status: Efficient ✅
```

---

### Fixing Issues
```
User: The login page isn't working

Claude: Let's fix it.
  
  What's the issue?

User: Form submits but nothing happens

Claude: [Analyzes]
  Found: Missing API URL configuration
  Fix: Add NEXT_PUBLIC_API_URL to .env
  
  Apply fix? (yes/no)

User: yes

Claude: ✅ Fixed! Tests passing.
```

---

### Batch Execution
```
User: Execute the next 5 tasks in batch

Claude: Will execute:
  - Task 3.3: Product Card
  - Task 3.4: Products List
  - Task 3.5: Product Detail
  - Task 4.1: Cart API
  - Task 4.2: Cart Store
  
  Est: 2 hours, $0.80
  
  Proceed? (yes/no)

User: yes

Claude: [Executes all 5]
  ✅ All 5 tasks complete!
  Duration: 1h 45min
  Cost: $0.74
```

---

### Exporting Data
```
User: Export token data to CSV

Claude: [Generates CSV]
  ✅ token-usage-2026-02-20.csv
  18 rows, 12 columns
  
  Download: [link]
  
  Open in Excel? (yes/no)
```

---

## Command Cheat Sheet

### Most Used Commands
```
continue          # Execute next task
status            # Show progress
fix               # Fix issues  
review [file]     # Show file
tokens            # Token usage
pause             # Stop for now
```

### Power User Commands
```
/continue-tasks --batch 5     # Batch execute
/review-progress --quick      # Quick status
/review-token-usage --phase 2 # Phase tokens
/export-token-data --xlsx     # Export Excel
/fix-task 2.1                 # Fix specific task
```

---

## Troubleshooting

### Command Not Working?

**Issue**: Command not recognized

**Solutions**:
1. Try slash version: `/execute-task` instead of `execute-task`
2. Use natural language: "Execute the next task"
3. Type `help` to see available commands
4. Check spelling

**Issue**: Command runs but unexpected result

**Solutions**:
1. Add `--help` flag: `/execute-task --help`
2. Be more specific: `fix "login button"` not just `fix`
3. Check current state: `status` first

**Issue**: Need more options

**Solutions**:
1. Use full slash command for all options
2. Check command documentation
3. Use `--help` flag

---

## Context-Aware Commands

Some commands adapt based on context:

### During Task Execution
- `pause` → Pauses current task
- `stop` → Stops batch execution
- `test` → Enters testing mode

### After Task Completion
- `continue` → Starts next task
- `review` → Reviews last task
- `fix` → Fixes last task

### During Fix Mode
- `rollback` → Undoes changes
- `retry` → Tries fix again
- `skip` → Skips this fix

---

## Getting Help

### General Help
```
help
```
Shows all available commands

### Command-Specific Help
```
/execute-task --help
/review-progress --help
/fix-task --help
```
Shows detailed help for specific command

### Context Help
```
what can I do?
what's next?
how do I...?
```
Gets contextual suggestions

---

## Quick Start Guide

### For Beginners

**Start Simple**:
1. `continue` - Execute tasks one by one
2. `status` - Check progress often
3. `fix` - Fix issues as they come up
4. `pause` - Take breaks

### For Advanced Users

**Use Power Commands**:
1. `/continue-tasks --batch 10` - Batch execute
2. `/review-progress --quick` - Quick checks
3. `/export-token-data --xlsx` - Export for analysis
4. `/fix-task [specific]` - Targeted fixes

---

## Best Practices

### ✅ Do This
- Use `status` frequently to track progress
- Use `continue` for controlled execution
- Use `fix` immediately when issues found
- Use `pause` before long breaks
- Use `tokens` to monitor costs

### ❌ Avoid This
- Don't skip without reason
- Don't ignore failed tasks
- Don't batch without testing first
- Don't continue if uncertain
- Don't forget to `pause` before breaks

---

## Summary

**Essential Commands**:
- `continue` - Keep working
- `status` - Check progress
- `fix` - Fix problems
- `pause` - Take break

**Power Features**:
- `/continue-tasks --batch` - Speed up
- `/review-token-usage` - Track costs
- `/export-token-data` - Analyze data
- `/fix-task [specific]` - Precise fixes

**Remember**: You can always type `help` for guidance!

---

This is your command reference. Bookmark it! 📖✅
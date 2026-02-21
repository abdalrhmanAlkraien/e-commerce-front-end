# E-Commerce Frontend - Task Execution System with Automated Testing

## Project Overview

Building a complete e-commerce frontend with public shopping features and admin management panel, with comprehensive automated testing for every task.

**Project Type**: E-Commerce Platform
**Target Users**: Anonymous shoppers, Authenticated customers, Admin users
**Backend**: Spring Boot REST API (OpenAPI spec provided)
**Testing**: Automated browser testing with Playwright (via Computer Use)

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: react-hook-form + zod validation
- **HTTP Client**: axios
- **i18n**: next-intl (English + Arabic RTL)
- **Testing**: Playwright (via Computer Use) (for browser automation) ✨
- **Backend API**: Spring Boot REST API at http://localhost:8080/api/v1

---


## 🤖 For AI Agents: Task Execution System

**CRITICAL:** Before executing any task, read this complete workflow guide:

### **`.claude/AI-AGENT-EXECUTION-GUIDE.md`** ← READ THIS FIRST!

This file contains the complete 10-step workflow for task execution including:
- ✅ How to identify and read tasks
- ✅ How to generate test scenarios
- ✅ How to execute tests with Playwright
- ✅ How to handle test failures
- ✅ How to update systemTasks.md with test results
- ✅ How to create documentation
- ✅ How to track costs separately
- ✅ Quality gates and standards
- ✅ Critical rules (NEVER/ALWAYS)

**Tasks cannot be marked complete without passing tests!**

### Quick Reference

When user says "execute task" or "/execute-task":

1. **First:** Read `.claude/AI-AGENT-EXECUTION-GUIDE.md` for complete workflow
2. **Then:** Read `.claude/CLAUDE.md` (this file) for project context
3. **Then:** Read `.claude/tasks/systemTasks.md` to find next task
4. **Then:** Follow the 10-step workflow from the guide exactly

**DO NOT skip reading AI-AGENT-EXECUTION-GUIDE.md!** It contains critical instructions that ensure quality and consistency.

---

## Backend Integration Rules

### API Communication

- All API calls go through `/lib/api/client.ts` - never fetch directly
- Use TanStack Query for all server state (no Redux needed)
- JWT tokens sent in `Authorization: Bearer <token>` header
- Anonymous users use `X-SESSION-ID` header for cart operations
- Access token refresh handled automatically by axios interceptor
- **All responses return data directly** - NO StandardApiResponse wrapper ✨ CORRECTED

### Authentication & Session Management

**Two types of users:**
1. **Anonymous Users** - Browse and shop with sessionId
2. **Authenticated Users** - Login with JWT token

**SessionId for Anonymous Users:**
- Auto-generated on first visit (UUID v4)
- Stored in localStorage
- Sent in `X-SESSION-ID` header for cart operations
- Persists even after logout (for cart continuity)
- Backend merges cart when user logs in

**JWT Token for Authenticated Users:**
- Obtained from `/api/v1/auth/login` or `/api/v1/auth/register`
- Stored in authStore (Zustand with localStorage persistence)
- Sent in `Authorization: Bearer <token>` header
- Takes precedence over sessionId when both exist
- Cleared on logout (but sessionId remains)

### Authentication Flow

1. **Anonymous User**:
    - Visits site → sessionId auto-generated
    - Adds items to cart → uses sessionId
    - Cart persists in backend linked to sessionId

2. **User Registers/Logs In**:
    - Login sends credentials to `/api/v1/auth/login`
    - Backend returns JWT token + user data
    - Frontend stores token in authStore
    - Backend merges anonymous cart (using sessionId) with user account
    - User continues shopping with JWT token

3. **User Logs Out**:
    - Token cleared from authStore
    - SessionId kept intact
    - User becomes anonymous again
    - Can continue shopping with same sessionId

4. **API Requests**:
    - If token exists → sends `Authorization: Bearer <token>`
    - If no token but sessionId exists → sends `X-SESSION-ID: <sessionId>`
    - This is handled automatically by axios interceptor

### API Response Format ✨ CORRECTED

**Standard responses return data directly:**
```typescript
// Single item
const product: ProductResponse = response.data;

// Array
const products: ProductResponse[] = response.data;
```

**Pagination responses:**
```typescript
const page: Page<ProductResponse> = response.data;
// Then access: page.content, page.totalElements, etc.
```

**Error responses:**
```typescript
{
  message: string;
  timestamp: string;
  errors?: string[];
}
```

---

## Type Generation from OpenAPI

When generating TypeScript types from the OpenAPI spec:

1. All UUIDs are `string` type with JSDoc comment `// UUID`
2. All date-times are `string` type with JSDoc comment `// ISO-8601`
3. Enums should be TypeScript union types, not enums
4. Optional fields use `?:` syntax
5. Arrays use `Type[]` syntax, not `Array<Type>`
6. Numbers stay as `number` type (not `double`, `float`, etc.)
7. Response wrappers (`Page<T>`) should be generic
8. Never use `any` type
9. **No StandardApiResponse wrapper** - data comes directly ✨

---

## Architecture Rules - NEVER VIOLATE

1. **No API calls in components** - only in custom hooks or React Query
2. **All forms must have zod validation** matching backend DTOs exactly
3. **Every page needs loading.tsx and error.tsx**
4. **Mobile-first responsive design** - test at 375px, 768px, 1440px
5. **RTL support** - use logical CSS properties (`margin-inline-start` not `margin-left`)
6. **No hardcoded strings** - all text through i18n (next-intl)
7. **Type safety** - no `any` types, DTOs must match backend exactly
8. **Token/SessionId automatic** - never manually add auth headers (axios does it)
9. **Cart operations** - always use cartId + appropriate auth method
10. **Error handling** - always handle loading, error, and empty states
11. **Testing mandatory** - every task must have automated tests ✨ NEW
12. **No task complete without passing tests** - all tests must pass ✨ NEW

---

## Task Execution System with Automated Testing ✨

This project uses a structured task system with automated testing for every task.

### Task Locations

**Task Definitions**: `/task/PhaseX/Task X.Y.md`
- Phase 0: Project initialization (4 tasks)
- Phase 1: Core infrastructure (6 tasks)
- Phase 2: Authentication pages (3 tasks)
- Phase 3: Product module public (5 tasks)
- Phase 4: Cart module (6 tasks)
- Phase 5: Checkout & orders (5 tasks)
- Phase 6: Categories module (3 tasks)
- Phase 7: Admin layout (3 tasks)
- Phase 8: Admin products (6 tasks)
- Phase 9: Admin categories (4 tasks)
- Phase 10: Admin orders (4 tasks)
- Phase 11: Admin customers (3 tasks)
- Phase 12: UI polish (6 tasks)
- Phase 13: Testing (5 tasks)
- Phase 14: Performance (4 tasks)
- Phase 15: Final polish (5 tasks)

**Total Tasks**: 76

**Test Scenarios**: `/task/TestX/Task X.Y.md` ✨ NEW
- Auto-generated after task implementation
- Contains Playwright test scenarios
- Based on task acceptance criteria
- Covers success paths, edge cases, error handling
- Includes regression checks

**Task Tracking**: `.claude/tasks/systemTasks.md`
- Master list of all tasks with status
- Includes path to each task definition file
- Updated after each task completion
- Tracks token usage and costs
- **Tracks test status and results** ✨ NEW

**Task Documentation**: `.claude/tasks/processed/Task X.Y.md`
- Created after task completion
- Documents what was done, files created, tests performed
- Permanent record of implementation decisions
- Includes token usage tracking

**Test Results**: `.claude/tasks/processed/Task X.Y - Test Results.md` ✨ NEW
- Detailed test execution results
- Scenario-by-scenario breakdown
- Screenshots captured during tests
- Network/console/storage analysis
- Issues found and resolutions

### Execution Workflow ✨ ENHANCED

1. Read `.claude/tasks/systemTasks.md` to find next pending task
2. Read task definition from `/task/PhaseX/Task X.Y.md`
3. Display task details to user and wait for confirmation
4. Execute task implementation following definition requirements exactly
5. **Generate test scenarios** automatically from task requirements ✨ NEW
6. **Execute automated tests** using Playwright (via Computer Use) ✨ NEW
7. **Verify all tests pass** before marking complete ✨ NEW
8. Track token usage for both implementation and testing
9. Create processed documentation at `.claude/tasks/processed/Task X.Y.md`
10. **Create test results** at `.claude/tasks/processed/Task X.Y - Test Results.md` ✨ NEW
11. Update systemTasks.md with completion status, token usage, and test results
12. Present review options to user (continue/review/review-tests/fix/pause)
13. Wait for user decision before proceeding

### Commands

**Core Execution:**
- `/execute-task` - Execute next pending task with automated testing ✨
- `/continue-tasks` - Execute multiple tasks in batch with testing ✨
- `/review-progress` - Show current progress, statistics, and test results ✨
- `/review-token-usage` - Show token usage and cost report (including tests) ✨

**Testing Commands:** ✨ NEW
- `/test-task [X.Y]` - Run or re-run tests for a specific task
- `/review-tests [X.Y]` - Review detailed test results for a task
- `/fix-tests [X.Y]` - Fix test scenarios without changing code

**Issue Resolution:**
- `/fix-task [X.Y]` - Fix issues in a task (re-tests automatically) ✨
- `/fix [X.Y] --tests` - Fix only test scenarios
- `/fix [X.Y] --both` - Fix both code and tests

### User Shortcuts

When user types a single word command, interpret as:

**Existing:**
- **continue** → Execute next task (with testing)
- **review** → Show files created in last task
- **fix** → Enter fix mode for last task (with re-testing)
- **skip** → Skip next task, mark as blocked
- **status** → Show progress summary (with test status)
- **pause** → Stop and save state
- **help** → Show available commands
- **retry** → Retry last failed task
- **details** → Show full task documentation

**New:** ✨
- **test** → Run tests for last task
- **tests** → Show test results for last task
- **re-test** → Re-run tests for last task

**Existing:**
- **files** → List all files in project
- **tokens** → Show token usage report
- **cost** → Show cost breakdown

---

## Testing System ✨ NEW

Every task includes comprehensive automated testing using Playwright (via Computer Use).

### Test Generation

After completing implementation:
1. Read task definition to extract acceptance criteria
2. Generate test scenarios covering:
    - Primary functionality (success paths)
    - Edge cases and boundary conditions
    - Error handling and validation
    - User experience (loading states, feedback)
    - Integration with previous features
    - Regression checks
3. Save to `/task/TestX/Task X.Y.md`

### Test Execution

Using Playwright (via Computer Use):
1. Start dev server if not running
2. Clear browser state (localStorage, cookies)
3. Execute each test scenario:
    - Navigate to pages
    - Fill forms
    - Click buttons
    - Verify elements
    - Check API calls
    - Capture screenshots
4. Monitor console for errors
5. Monitor network for failures
6. Verify data persistence
7. Run regression checks on previous features

### Test Results

Comprehensive results saved to `.claude/tasks/processed/Task X.Y - Test Results.md`:
- Executive summary (pass/fail rate, duration)
- Detailed scenario results
- Screenshots for each scenario
- Network request/response analysis
- Console log analysis
- Storage state verification
- Issues found and how they were fixed
- Performance metrics

### Test Status in systemTasks.md

Each task tracks:
```markdown
✨ Testing:
- Test Status: ✅ PASSED / ❌ FAILED / ⏳ NOT TESTED
- Test File: /task/TestX/Task X.Y.md
- Test Scenarios: 5 total (5 passed, 0 failed)
- Test Duration: 8m 23s
- Test Cost: $0.04
- Console Errors: 0
- Network Errors: 0
- Regression Issues: 0
- Test Results File: .claude/tasks/processed/Task X.Y - Test Results.md
```

### Quality Gates

**Cannot mark task complete unless:**
- ✅ All test scenarios pass
- ✅ Zero console errors
- ✅ Zero network errors (or expected errors handled)
- ✅ All regression checks pass
- ✅ Data persists correctly

**If tests fail:**
- Show detailed failure information
- Offer to auto-fix or guide through fixing
- Re-run tests after fixes
- Only mark complete when all tests pass

---

## Token Usage Tracking ✨ ENHANCED

Every task execution tracks token usage for both implementation and testing.

### Current Pricing (Claude Sonnet 4.5)

- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

### Tracking Method

**For Each Task:**
1. Note conversation token count before execution
2. Execute implementation
3. Note tokens after implementation
4. **Generate and execute tests** ✨
5. **Note tokens after testing** ✨
6. Calculate separate costs for implementation and testing
7. Log in systemTasks.md with detailed breakdown

**Token Breakdown:**
- **Implementation Tokens:**
    - Input: Context + Files Read + Instructions + Task Definition
    - Output: Code Generated + Documentation + Responses

- **Testing Tokens:** ✨ NEW
    - Input: Test generation + Playwright commands + Results analysis
    - Output: Test scenarios + Test execution logs + Results documentation

### Cost Calculation
```
Implementation Cost:
  Input Cost = (Input Tokens / 1,000,000) × $3
  Output Cost = (Output Tokens / 1,000,000) × $15

Testing Cost:
  Input Cost = (Test Input Tokens / 1,000,000) × $3
  Output Cost = (Test Output Tokens / 1,000,000) × $15

Total Task Cost = Implementation Cost + Testing Cost
```

### Budget Awareness

- Track total spending including testing in systemTasks.md
- Monitor average cost per task (implementation + testing)
- **Track testing cost percentage** (typically 30-40% of total) ✨
- Project remaining cost based on averages
- Flag if approaching budget limits
- Phase-by-phase cost breakdown in progress table
- **Separate testing cost tracking** ✨

### Optimization Tips

**To Reduce Token Usage:**
1. Keep context files concise
2. Reference files by path rather than reading full content
3. Generate code incrementally rather than all at once
4. Use previous task outputs as references
5. Batch similar tasks together
6. Don't repeat code unnecessarily in responses
7. **Efficient test generation** - focus on critical scenarios ✨
8. **Reuse test patterns** across similar tasks ✨

**High Token Tasks:**
- Tasks generating large code files (forms, pages)
- Tasks requiring extensive file reading
- Tasks with complex debugging
- **Tasks with many test scenarios (>5)** ✨
- Admin CRUD pages with tables
- **Integration testing across multiple features** ✨

**Low Token Tasks:**
- Configuration file updates
- Small component creation
- Documentation updates
- Simple bug fixes
- Type definition updates
- **Simple component tests (2-3 scenarios)** ✨

**Testing Cost Estimates:**
- Simple tasks: ~$0.02-0.03 per task (3-4 test scenarios)
- Medium tasks: ~$0.04-0.05 per task (5-6 test scenarios)
- Complex tasks: ~$0.06-0.08 per task (7+ test scenarios)
- Integration tests: ~$0.08-0.10 per task (multiple features)

---

## File Structure Overview ✨ ENHANCED
```
project-root/
├── .claude/
│   ├── CLAUDE.md                    # This file - main context
│   ├── commands/                    # Command definitions
│   │   ├── execute-task.md          # Enhanced with testing
│   │   ├── continue-tasks.md        # Enhanced with testing
│   │   ├── review-progress.md       # Enhanced with test metrics
│   │   ├── fix-task.md              # Enhanced with re-testing
│   │   ├── review-token-usage.md    # Enhanced with test costs
│   │   ├── test-task.md             # NEW: Test execution
│   │   └── review-tests.md          # NEW: Test results review
│   └── tasks/
│       ├── systemTasks.md          # Master tracking (with tests)
│       ├── prompt.md               # Current task state
│       └── processed/              # Completed task docs
│           ├── Task X.Y.md         # Implementation docs
│           └── Task X.Y - Test Results.md  # NEW: Test results
├── task/
│   ├── Phase0/ ... Phase15/        # Task definitions
│   ├── Test0/ ... Test15/          # NEW: Test scenarios
│   └── (76 Task X.Y.md files + 76 Test X.Y.md files)
├── docs/
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   ├── CODING_STANDARDS.md
│   └── TEST_SCENARIOS.md           # NEW: Testing guide
└── src/                            # Next.js application
    ├── app/                        # Next.js App Router
    ├── components/                 # React components
    ├── lib/                        # Core utilities
    │   ├── api/                    # API integration
    │   ├── hooks/                  # Custom hooks
    │   ├── store/                  # Zustand stores
    │   └── utils/                  # Helper functions
    └── types/                      # TypeScript types
```

---

## Current Status

**Project Phase**: Not Started (Task 0.1 pending)

**Module Status**:
- ⏳ Phase 0: Project Initialization - Not Started
- ⏳ Phase 1: Core Infrastructure - Not Started
- ⏳ Phase 2: Authentication - Not Started
- ⏳ Phase 3-15: All Pending

**Progress**:
- Total Tasks: 76
- Completed: 0
- Pending: 76
- Percentage: 0%
- **Tests Passed**: 0/0 ✨

**Token Usage**:
- Total Tokens: 0
- Implementation: $0.00
- **Testing**: $0.00 ✨
- Total Cost: $0.00
- Avg per Task: N/A

---

## Testing Requirements ✨ ENHANCED

### Automated Testing (Every Task)
- **Browser console must be clean** - zero errors or warnings
- **All user interactions tested** - clicks, form submissions, navigation
- **Loading states verified** - spinners/skeletons show during data fetching
- **Error handling tested** - proper error messages and recovery
- **Data persistence verified** - localStorage/sessionStorage correct
- **Network requests validated** - correct endpoints, headers, payloads
- **Responsive design tested** - mobile (375px), tablet (768px), desktop (1440px)
- **Both user types tested** - anonymous and authenticated flows
- **Regression checks** - previous features still work
- **Screenshots captured** - visual documentation of tests

### Test Execution Strategy
1. **After implementation** - tests generated and run automatically
2. **Before marking complete** - all tests must pass
3. **After fixes** - affected tests re-run automatically
4. **Batch execution** - tests run for each task in batch
5. **Manual trigger** - user can re-run tests anytime

### Test Documentation
- Every test scenario documented in `/task/TestX/Task X.Y.md`
- Every test result documented in `.claude/tasks/processed/Task X.Y - Test Results.md`
- Test status tracked in `systemTasks.md`
- Test costs tracked separately from implementation

### Quality Metrics
- **Test pass rate**: Target >95%
- **Console errors**: Target 0
- **Network errors**: Target 0 (excluding expected errors)
- **Regression issues**: Target 0
- **Test coverage**: 100% of completed tasks

---

## Important Reminders

### Always Read Task Definition First
- **NEVER assume** what a task should do
- **ALWAYS read** `/task/PhaseX/Task X.Y.md` before executing
- **Follow exactly** what the task definition specifies
- **Reference the task file** in processed documentation

### Testing is Mandatory ✨ NEW
- **Every task must be tested** - no exceptions
- **Cannot mark complete without passing tests** - all tests must pass
- **Tests prove functionality** - implementation without tests is incomplete
- **Fix until tests pass** - keep iterating until all tests green
- **Re-test after fixes** - verify fixes work with automated tests

### Anonymous + Authenticated User Support
- Every feature must work for both user types
- Cart operations handle both sessionId and JWT
- Checkout works for anonymous users (they provide email)
- Login merges anonymous cart with user account
- Logout preserves sessionId for continued anonymous shopping
- **Both user types tested** in automated tests ✨

### Code Quality Standards
- Follow docs/CODING_STANDARDS.md for all code
- Follow docs/API_INTEGRATION.md for all API calls
- Follow docs/FRONTEND_ARCHITECTURE.md for structure
- **Follow docs/TEST_SCENARIOS.md for testing** ✨
- TypeScript strict mode - no shortcuts
- Mobile-first, responsive, RTL-ready

### Communication Style
- Show progress during long operations
- **Show test progress during test execution** ✨
- Present clear review options after task completion
- **Include test results in completion summary** ✨
- Use emojis for visual clarity (📋 🔄 ✅ ❌ 🧪) ✨
- Wait for user confirmation before proceeding
- Be concise but complete in responses

---
## Example Task Execution Session ✨ ENHANCED
```
User: /execute-task

Claude:
📋 NEXT TASK IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task Number: 2.1
Task Name: Create Login Page
Phase: Phase 2
Task Definition: /task/Phase2/Task 2.1.md
Status: ⏳ PENDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to start? (yes/no/skip)

User: yes

Claude:
[Reads /task/Phase2/Task 2.1.md]

📖 TASK DETAILS - Task 2.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create login page with form validation...
[Shows requirements, outputs, tests]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proceed with execution? (yes/no/read-full)

User: yes

Claude:
⚙️  IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  Creating login page...
⚙️  Creating form component...
⚙️  Adding validation...
✅ Implementation complete (20 minutes)

🧪 GENERATING TEST SCENARIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Identified 5 test scenarios
✓ Test file created: /task/Test2/Task 2.1.md

🧪 EXECUTING TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1/5] Page loads ✅
[2/5] Successful login ✅
[3/5] Invalid credentials ✅
[4/5] Form validation ✅
[5/5] Loading state ✅

✅ ALL TESTS PASSED (5/5)

✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Shows files, tests, tokens, cost, progress]

Implementation: $0.18 (20 min)
Testing: $0.04 (8 min)
Total: $0.22

Tests: 5/5 passed ✅
Console Errors: 0
Network Errors: 0

🔍 REVIEW OPTIONS
What would you like to do?
1️⃣ continue  2️⃣ review  3️⃣ review-tests  4️⃣ fix
5️⃣ details  6️⃣ pause  7️⃣ skip-next

Your choice:

User: continue

Claude:
[Proceeds to Task 2.2...]
```

---

## Quick Start

To begin development:
```
1. Ensure all system files are in place
2. Say: "/execute-task" or "Start Task 0.1"
3. Confirm when prompted
4. Watch as implementation AND tests execute
5. Review results including test outcomes
6. Choose to continue, review, fix, or pause
7. Repeat until all 76 tasks complete (all with passing tests!)
```

---

## Summary of Testing Integration ✨

**What's New:**
- ✅ Automated test generation after every task
- ✅ Playwright (via Computer Use) for browser automation
- ✅ Test scenarios in `/task/TestX/` directories
- ✅ Test results in `.claude/tasks/processed/`
- ✅ Test status tracking in systemTasks.md
- ✅ Separate test cost tracking
- ✅ Cannot complete task without passing tests
- ✅ Re-testing after fixes
- ✅ Quality metrics (console/network errors)
- ✅ Regression testing built-in
- ✅ New commands: test-task, review-tests, fix-tests
- ✅ Enhanced progress reports with test data

**Benefits:**
- 🧪 Every feature proven to work before moving on
- 🚀 Faster development (catch bugs immediately)
- 📊 Clear quality metrics
- 🎯 Confidence in all completed work
- 🔍 Comprehensive test documentation
- ✅ No manual testing needed
- 🛡️ Prevents regressions
- 💰 Predictable testing costs

---

**Remember**: This file is read at the start of every Claude session. Keep it updated with current project status, important decisions, and any critical information Claude needs to know.

**Testing is now a core part of the workflow** - every task includes automated testing to ensure quality and functionality! 🧪✅
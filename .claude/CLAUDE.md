# E-Commerce Frontend - Task Execution System

## Project Overview

Building a complete e-commerce frontend with public shopping features and admin management panel.

**Project Type**: E-Commerce Platform
**Target Users**: Anonymous shoppers, Authenticated customers, Admin users
**Backend**: Spring Boot REST API (OpenAPI spec provided)

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: react-hook-form + zod validation
- **HTTP Client**: axios
- **i18n**: next-intl (English + Arabic RTL)
- **Testing**: Playwright (for browser automation)
- **Backend API**: Spring Boot REST API at http://localhost:8080/api/v1

---

## Backend Integration Rules

### API Communication

- All API calls go through `/lib/api/client.ts` - never fetch directly
- Use TanStack Query for all server state (no Redux needed)
- JWT tokens sent in `Authorization: Bearer <token>` header
- Anonymous users use `X-SESSION-ID` header for cart operations
- Access token refresh handled automatically by axios interceptor
- All responses follow StandardApiResponse wrapper from backend

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

### API Response Format

All endpoints return this structure:
```typescript
{
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errors?: string[];
}
```

**Pagination responses:**
```typescript
{
  success: true,
  data: {
    content: T[],
    totalElements: number,
    totalPages: number,
    number: number,
    size: number,
    first: boolean,
    last: boolean,
    empty: boolean
  }
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

---

## Task Execution System

This project uses a structured task system for organized development.

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

**Task Tracking**: `.claude/tasks/systemTasks.md`
- Master list of all tasks with status
- Includes path to each task definition file
- Updated after each task completion
- Tracks token usage and costs

**Task Documentation**: `.claude/tasks/processed/Task X.Y.md`
- Created after task completion
- Documents what was done, files created, tests performed
- Permanent record of implementation decisions
- Includes token usage tracking

### Execution Workflow

1. Read `.claude/tasks/systemTasks.md` to find next pending task
2. Read task definition from `/task/PhaseX/Task X.Y.md`
3. Display task details to user and wait for confirmation
4. Execute task following definition requirements exactly
5. Track token usage during execution
6. Create processed documentation at `.claude/tasks/processed/Task X.Y.md`
7. Update systemTasks.md with completion status and token usage
8. Present review options to user (continue/review/fix/pause)
9. Wait for user decision before proceeding

### Commands

- `/execute-task` - Execute next pending task (interactive mode)
- `/continue-tasks` - Execute multiple tasks in sequence
- `/review-progress` - Show current progress and statistics
- `/review-token-usage` - Show token usage and cost report
- `/fix-task` - Fix issues in last completed task

### User Shortcuts

When user types a single word command, interpret as:

- **continue** → Execute next task
- **review** → Show files created in last task
- **fix** → Enter fix mode for last task
- **skip** → Skip next task, mark as blocked
- **status** → Show progress summary
- **pause** → Stop and save state
- **help** → Show available commands
- **retry** → Retry last failed task
- **test** → Enter manual testing mode
- **details** → Show full task documentation
- **files** → List all files in project
- **tokens** → Show token usage report
- **cost** → Show cost breakdown

---

## Token Usage Tracking

Every task execution is tracked for token usage and cost.

### Current Pricing (Claude Sonnet 4.5)

- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

### Tracking Method

**For Each Task:**
1. Note conversation token count before execution
2. Execute task completely
3. Note conversation token count after execution
4. Calculate: Tokens Used = After - Before
5. Log in systemTasks.md with cost calculation

**Token Breakdown:**
- Input: Context + Files Read + Instructions + Task Definition
- Output: Code Generated + Documentation + Responses + Tests

### Cost Calculation
```
Input Cost = (Input Tokens / 1,000,000) × $3
Output Cost = (Output Tokens / 1,000,000) × $15
Total Cost = Input Cost + Output Cost
```

### Budget Awareness

- Track total spending in systemTasks.md
- Monitor average cost per task
- Project remaining cost based on averages
- Flag if approaching budget limits
- Phase-by-phase cost breakdown in progress table

### Optimization Tips

**To Reduce Token Usage:**
1. Keep context files concise
2. Reference files by path rather than reading full content
3. Generate code incrementally rather than all at once
4. Use previous task outputs as references
5. Batch similar tasks together
6. Don't repeat code unnecessarily in responses

**High Token Tasks:**
- Tasks generating large code files (forms, pages)
- Tasks requiring extensive file reading
- Tasks with complex debugging
- Tasks involving browser automation (screenshots, logs)
- Admin CRUD pages with tables

**Low Token Tasks:**
- Configuration file updates
- Small component creation
- Documentation updates
- Simple bug fixes
- Type definition updates

---

## File Structure Overview
```
project-root/
├── .claude/
│   ├── CLAUDE.md                    # This file - main context
│   ├── commands/                    # Command definitions
│   │   ├── execute-task.md
│   │   ├── continue-tasks.md
│   │   ├── review-progress.md
│   │   ├── fix-task.md
│   │   └── review-token-usage.md
│   └── tasks/
│       ├── systemTasks.md          # Master tracking file
│       ├── prompt.md               # Current task state
│       └── processed/              # Completed task docs
├── task/
│   ├── Phase0/ ... Phase15/        # Task definitions
│   └── (76 Task X.Y.md files)
├── docs/
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   ├── CODING_STANDARDS.md
│   └── TEST_SCENARIOS.md
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

**Token Usage**:
- Total Tokens: 0
- Total Cost: $0.00
- Avg per Task: N/A

---

## Testing Requirements

### Manual Testing Checklist
- Browser console must be clean (no errors or warnings)
- Forms must show validation errors
- Loading states required for all data fetching
- Error boundaries catch and display errors properly
- Test on Chrome and Safari
- Test on mobile (375px) and desktop (1440px)
- Test both anonymous and authenticated user flows

### Browser Automation (Playwright)
- Setup in Phase 13
- Automated testing of critical user flows
- Regression testing after major features
- Responsive design testing at multiple breakpoints

---

## Important Reminders

### Always Read Task Definition First
- **NEVER assume** what a task should do
- **ALWAYS read** `/task/PhaseX/Task X.Y.md` before executing
- **Follow exactly** what the task definition specifies
- **Reference the task file** in processed documentation

### Anonymous + Authenticated User Support
- Every feature must work for both user types
- Cart operations handle both sessionId and JWT
- Checkout works for anonymous users (they provide email)
- Login merges anonymous cart with user account
- Logout preserves sessionId for continued anonymous shopping

### Code Quality Standards
- Follow docs/CODING_STANDARDS.md for all code
- Follow docs/API_INTEGRATION.md for all API calls
- Follow docs/FRONTEND_ARCHITECTURE.md for structure
- TypeScript strict mode - no shortcuts
- Mobile-first, responsive, RTL-ready

### Communication Style
- Show progress during long operations
- Present clear review options after task completion
- Use emojis for visual clarity (📋 🔄 ✅ ❌)
- Wait for user confirmation before proceeding
- Be concise but complete in responses

---

## Example Task Execution Session
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
Create a new Next.js 14 project with TypeScript...
[Shows requirements, outputs, tests]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proceed with execution? (yes/no/read-full)

User: yes

Claude:
⚙️  Creating Next.js project...
⚙️  Installing dependencies...
⚙️  Running tests...

✅ TASK COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Shows files, tests, tokens, cost, progress]

🔍 REVIEW OPTIONS
What would you like to do?
1️⃣ continue  2️⃣ review  3️⃣ test  4️⃣ fix
5️⃣ details  6️⃣ pause  7️⃣ skip-next

Your choice:

User: continue

Claude:
[Proceeds to Task 0.2...]
```

---

## Quick Start

To begin development:
```
1. Ensure all system files are in place
2. Say: "/execute-task" or "Start Task 0.1"
3. Confirm when prompted
4. Review results after each task
5. Choose to continue, review, fix, or pause
6. Repeat until all 76 tasks complete
```

---

**Remember**: This file is read at the start of every Claude session. Keep it updated with current project status, important decisions, and any critical information Claude needs to know.
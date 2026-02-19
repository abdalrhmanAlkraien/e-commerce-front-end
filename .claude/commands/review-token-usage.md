# Review Token Usage - Cost Analysis & Optimization

Generate comprehensive token usage reports with cost analysis, trends, efficiency metrics, and optimization recommendations.

---

## Command Usage

### Full Report (Default)
```
/review-token-usage
```
Complete analysis with all sections.

### Quick Summary
```
/review-token-usage --quick
```
Just the key numbers.

### Specific Phase
```
/review-token-usage --phase 3
```
Detailed analysis of one phase.

### Date Range
```
/review-token-usage --today
/review-token-usage --week
/review-token-usage --month
```
Filter by time period.

### Export
```
/review-token-usage --export csv
```
Export data to CSV file.

---

## Report Sections

The complete report includes:
1. Executive Summary
2. Overall Statistics
3. Cost Breakdown by Phase
4. Task-Level Analysis
5. Efficiency Metrics
6. Trend Analysis
7. Cost Projections
8. Budget Tracking
9. Optimization Recommendations
10. Export Options

---

## Workflow

### Step 1: Read & Parse systemTasks.md

1. **Extract token data for all tasks:**
   - Task number and name
   - Input tokens
   - Output tokens
   - Total tokens
   - Cost
   - Completion timestamp
   - Duration

2. **Calculate aggregates:**
   - Total tokens (input + output)
   - Total cost
   - Average per task
   - Cost by phase
   - Tokens by phase
   - Daily/weekly spending rate

3. **Identify patterns:**
   - Highest cost tasks
   - Lowest cost tasks
   - Outliers (unusually high/low)
   - Trends over time

---

### Step 2: Generate Comprehensive Report
```
╔══════════════════════════════════════════════════════════╗
║         TOKEN USAGE & COST ANALYSIS REPORT               ║
╚══════════════════════════════════════════════════════════╝

Generated: Friday, February 20, 2026 at 4:30 PM
Report Period: Feb 19-20, 2026 (2 days)
Tasks Analyzed: 18 of 76 completed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 EXECUTIVE SUMMARY

Total Spent:        $2.92
Tasks Completed:    18 (23.7%)
Avg Cost per Task:  $0.162
Status:             🟢 Under Budget

Key Findings:
  ✓ Costs tracking 6% below initial estimate
  ✓ Efficiency improving (Phase 2 vs Phase 1)
  ⚠️ Phase 3 tasks running 15% over estimate
  ✓ On track for $12.16 total (below $15 budget)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 OVERALL STATISTICS

┌─────────────────────────────────────────────────────────┐
│ TOTAL USAGE                                             │
├─────────────────────────────────────────────────────────┤
│ Input Tokens:      115,200 ($0.346)                    │
│ Output Tokens:      76,800 ($1.152)                    │
│ Total Tokens:      192,000                             │
│ Total Cost:        $2.92                               │
│                                                          │
│ Fix Tokens:         3,240 ($0.054)                     │
│ Fix Cost:          $0.05 (1.7% of total)               │
│                                                          │
│ GRAND TOTAL:       $2.97                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ AVERAGES (Per Task)                                     │
├─────────────────────────────────────────────────────────┤
│ Avg Input:         6,400 tokens                        │
│ Avg Output:        4,267 tokens                        │
│ Avg Total:         10,667 tokens                       │
│ Avg Cost:          $0.162                              │
│ Avg Duration:      27.5 minutes                        │
│ Cost per Hour:     $0.35                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ COMPLETION STATUS                                        │
├─────────────────────────────────────────────────────────┤
│ Completed:         18 / 76 tasks (23.7%)               │
│ Remaining:         58 tasks                            │
│ Est. Remaining:    619,866 tokens                      │
│ Est. Cost:         $9.40                               │
│ PROJECTED TOTAL:   $12.37                              │
└─────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 COST BREAKDOWN BY PHASE

Phase 0: Project Initialization
[████████████] 4/4 (100%) ✅ COMPLETE
┌──────────────────────────────────────────────────────┐
│ Tasks:         4                                     │
│ Input:         25,600 tokens ($0.077)               │
│ Output:        17,067 tokens ($0.256)               │
│ Total:         42,667 tokens                        │
│ Cost:          $0.61                                │
│ Avg/Task:      $0.153 (2% under estimate)          │
│ Efficiency:    🟢 EXCELLENT                         │
└──────────────────────────────────────────────────────┘

Tasks:
  • 0.1: Create Next.js Project     - 12,800 tok ($0.16)
  • 0.2: Create Project Structure   - 9,600 tok ($0.12)
  • 0.3: Setup Configuration Files  - 13,333 tok ($0.19)
  • 0.4: Generate TypeScript Types  - 6,934 tok ($0.14)

Phase 1: Core Infrastructure
[████████████] 6/6 (100%) ✅ COMPLETE
┌──────────────────────────────────────────────────────┐
│ Tasks:         6                                     │
│ Input:         38,400 tokens ($0.115)               │
│ Output:        25,600 tokens ($0.384)               │
│ Total:         64,000 tokens                        │
│ Cost:          $0.95                                │
│ Avg/Task:      $0.158 (5% under estimate)          │
│ Efficiency:    🟢 EXCELLENT                         │
└──────────────────────────────────────────────────────┘

Tasks:
  • 1.1: Setup API Client           - 11,733 tok ($0.18)
  • 1.2: Setup Auth Store            - 9,600 tok ($0.15)
  • 1.3: Create Auth API Module     - 10,667 tok ($0.17)
  • 1.3.1: API Client Dual Auth      - 8,533 tok ($0.13)
  • 1.3.2: Auth Helper Utilities     - 7,467 tok ($0.11)
  • 1.4: Create Auth Hooks          - 16,000 tok ($0.21)

Phase 2: Authentication Pages
[████████████] 3/3 (100%) ✅ COMPLETE
┌──────────────────────────────────────────────────────┐
│ Tasks:         3                                     │
│ Input:         29,867 tokens ($0.090)               │
│ Output:        19,911 tokens ($0.299)               │
│ Total:         49,778 tokens                        │
│ Cost:          $0.58                                │
│ Avg/Task:      $0.193 (12% over estimate)          │
│ Efficiency:    🟡 GOOD                              │
└──────────────────────────────────────────────────────┘

Tasks:
  • 2.1: Create Login Page          - 14,667 tok ($0.22)
  • 2.2: Create Register Page       - 13,333 tok ($0.20)
  • 2.3: Create Auth Layout         - 10,667 tok ($0.16)

Note: Higher cost due to form validation complexity

Phase 3: Product Module - Public
[████░░░░░░░░] 2/5 (40%) 🔄 IN PROGRESS
┌──────────────────────────────────────────────────────┐
│ Tasks:         2 / 5                                 │
│ Input:         21,333 tokens ($0.064)               │
│ Output:        14,222 tokens ($0.213)               │
│ Total:         35,555 tokens                        │
│ Cost:          $0.32                                │
│ Avg/Task:      $0.160 (projected)                   │
│ Efficiency:    🟢 EXCELLENT                         │
└──────────────────────────────────────────────────────┘

Completed Tasks:
  • 3.1: Create Products API        - 11,333 tok ($0.17)
  • 3.2: Create Products Hooks      - 10,000 tok ($0.15)

Remaining Tasks (Estimated):
  • 3.3: Product Card Component     - ~10,667 tok (~$0.16)
  • 3.4: Products List Page         - ~18,667 tok (~$0.28)
  • 3.5: Product Detail Page        - ~16,000 tok (~$0.24)

Phase 4-15: Pending
┌──────────────────────────────────────────────────────┐
│ Remaining:     58 tasks                              │
│ Est. Tokens:   619,866 tokens                       │
│ Est. Cost:     $9.40                                │
│ Status:        ⏳ NOT STARTED                        │
└──────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TASK-LEVEL ANALYSIS

┌─────────────────────────────────────────────────────────┐
│ TOP 10 MOST EXPENSIVE TASKS                             │
├─────────────────────────────────────────────────────────┤
│ 1. Task 1.4: Auth Hooks           21,333 tok  $0.21    │
│ 2. Task 2.1: Login Page           14,667 tok  $0.22    │
│ 3. Task 2.2: Register Page        13,333 tok  $0.20    │
│ 4. Task 0.3: Config Files         13,333 tok  $0.19    │
│ 5. Task 0.1: Next.js Project      12,800 tok  $0.16    │
│ 6. Task 1.1: API Client           11,733 tok  $0.18    │
│ 7. Task 3.1: Products API         11,333 tok  $0.17    │
│ 8. Task 1.3: Auth API Module      10,667 tok  $0.17    │
│ 9. Task 2.3: Auth Layout          10,667 tok  $0.16    │
│ 10. Task 3.2: Products Hooks      10,000 tok  $0.15    │
└─────────────────────────────────────────────────────────┘

Analysis:
  • Auth tasks consistently higher (complex state management)
  • Form-heavy pages cost ~15% more (validation logic)
  • Infrastructure tasks variable (0.1 vs 1.4)

┌─────────────────────────────────────────────────────────┐
│ TOP 5 MOST EFFICIENT TASKS (Best Value)                 │
├─────────────────────────────────────────────────────────┤
│ 1. Task 0.4: TypeScript Types     6,934 tok   $0.14    │
│ 2. Task 1.3.2: Auth Utilities     7,467 tok   $0.11    │
│ 3. Task 1.3.1: Dual Auth          8,533 tok   $0.13    │
│ 4. Task 1.2: Auth Store           9,600 tok   $0.15    │
│ 5. Task 0.2: Project Structure    9,600 tok   $0.12    │
└─────────────────────────────────────────────────────────┘

Why efficient:
  • Clear, focused scope
  • Minimal file generation
  • Reusable patterns
  • Good documentation reference

┌─────────────────────────────────────────────────────────┐
│ OUTLIERS (Significantly Above/Below Average)             │
├─────────────────────────────────────────────────────────┤
│ HIGH: Task 1.4 (Auth Hooks) - 100% over avg            │
│       Reason: Multiple hooks + complex error handling   │
│                                                          │
│ LOW:  Task 1.3.2 (Utilities) - 30% under avg           │
│       Reason: Simple helper functions                   │
└─────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 EFFICIENCY METRICS

┌─────────────────────────────────────────────────────────┐
│ TOKEN EFFICIENCY SCORE: 8.2/10 (GOOD)                   │
└─────────────────────────────────────────────────────────┘

Metrics:
  • Tokens per Feature:     10,667 avg (target: <12,000) ✅
  • Cost per Feature:       $0.162 avg (target: <$0.18)  ✅
  • Input/Output Ratio:     1.5:1 (healthy balance)      ✅
  • Fix Overhead:           1.7% (target: <5%)           ✅
  • Consistency:            σ=4,200 tokens (good)        ✅

┌─────────────────────────────────────────────────────────┐
│ EFFICIENCY BY CATEGORY                                   │
├─────────────────────────────────────────────────────────┤
│ Setup Tasks (0.1-0.4):        10,667 tok/task  🟢      │
│ API Integration (1.1-1.3):    10,311 tok/task  🟢      │
│ State Management (1.2,1.4):   12,800 tok/task  🟡      │
│ UI Components (2.1-2.3):      12,889 tok/task  🟡      │
│ Hooks (1.4, 3.2):             15,667 tok/task  🟡      │
└─────────────────────────────────────────────────────────┘

Interpretation:
  🟢 Excellent (<11k tokens)
  🟡 Good (11-15k tokens)
  🟠 Acceptable (15-20k tokens)
  🔴 Review needed (>20k tokens)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📉 TREND ANALYSIS

Cost Trend Over Time:
Week 1 (Feb 19-20):
  Day 1: $1.56 (10 tasks)
  Day 2: $1.36 (8 tasks)
  Trend: 📉 -13% (improving efficiency)

Daily Average:
  Day 1: $0.156/task
  Day 2: $0.170/task
  Overall: $0.162/task
  Trend: 🟡 Stable (±9% variance acceptable)

Phase-over-Phase:
  Phase 0: $0.153/task (baseline)
  Phase 1: $0.158/task (+3%)
  Phase 2: $0.193/task (+22% - complexity spike)
  Phase 3: $0.160/task (-17% - back to baseline)
  
  Trend: 📈 Learning curve evident, stabilizing

Token Usage Pattern:
```
Cost ($)
0.25 |                    ●
0.20 |           ●  ●  ●  |  
0.15 |  ●  ●  ●  |        |  ●  ●
0.10 |     |              |
└─────┴──────────────┴──────→
P0    P1      P2      P3   Phase

Phases 0-1: Setup (low complexity)
Phase 2: Spike (forms + validation)
Phase 3: Normalize (established patterns)
```

Velocity vs Cost:
  Tasks/Day: 9 avg
  Cost/Day: $1.46 avg
  Efficiency improving with experience ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 COST PROJECTIONS

┌─────────────────────────────────────────────────────────┐
│ BASED ON CURRENT AVERAGES                                │
├─────────────────────────────────────────────────────────┤
│ Completed:        18 tasks                              │
│ Avg Cost:         $0.162/task                           │
│ Remaining:        58 tasks                              │
│ Est. Remaining:   $9.40                                 │
│ PROJECTED TOTAL:  $12.37                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ BEST CASE SCENARIO (Optimistic)                          │
├─────────────────────────────────────────────────────────┤
│ Assumption: Efficiency improves 15%                     │
│ Avg Cost: $0.138/task                                   │
│ Remaining: $8.00                                        │
│ Total: $10.97                                           │
│ Savings: $1.40 (11%)                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ WORST CASE SCENARIO (Conservative)                       │
├─────────────────────────────────────────────────────────┤
│ Assumption: Complex tasks (admin, testing)              │
│ Avg Cost: $0.200/task                                   │
│ Remaining: $11.60                                       │
│ Total: $14.57                                           │
│ Overage: $2.20 (18%)                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PHASE-BY-PHASE PROJECTION                                │
├─────────────────────────────────────────────────────────┤
│ Phase 4: Cart (6 tasks)           ~$0.95               │
│ Phase 5: Checkout (5 tasks)       ~$0.85               │
│ Phase 6: Categories (3 tasks)     ~$0.48               │
│ Phase 7: Admin Layout (3 tasks)   ~$0.52               │
│ Phase 8: Admin Products (6 tasks) ~$1.10               │
│ Phase 9: Admin Categories (4)     ~$0.70               │
│ Phase 10: Admin Orders (4)        ~$0.85               │
│ Phase 11: Admin Customers (3)     ~$0.55               │
│ Phase 12: UI Polish (6)           ~$0.90               │
│ Phase 13: Testing (5)             ~$1.25 (complex)     │
│ Phase 14: Performance (4)         ~$0.65               │
│ Phase 15: Final Polish (5)        ~$0.60               │
│                                                          │
│ TOTAL PROJECTED:                  $12.37                │
└─────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 BUDGET TRACKING

┌─────────────────────────────────────────────────────────┐
│ BUDGET STATUS                                            │
├─────────────────────────────────────────────────────────┤
│ Original Budget:   $15.00                               │
│ Spent So Far:      $2.97 (19.8%)                        │
│ Remaining Budget:  $12.03 (80.2%)                       │
│ Projected Total:   $12.37 (82.5%)                       │
│ Buffer Remaining:  $2.63 (17.5%)                        │
│                                                          │
│ Status: 🟢 UNDER BUDGET                                 │
│                                                          │
│ Budget Progress:                                         │
│ [████░░░░░░░░░░░░░░░░░░░░░░░░░░] 19.8%                 │
│                                                          │
│ Projected at Completion:                                 │
│ [████████████████░░░░░░░░░░░░░░] 82.5%                 │
└─────────────────────────────────────────────────────────┘

Budget Alerts:
  ✅ On track - 18% under budget
  ✅ Healthy buffer remaining ($2.63)
  ✅ No overspend risk detected

Burn Rate:
  Daily Spend: $1.49/day avg
  Days Remaining: ~6 days (at current pace)
  Projected Finish: Feb 26, 2026

Budget Milestones:
  ✅ 25% tasks done, 20% budget used (on track)
  ⏳ 50% tasks - projected $6.19 (target: $7.50)
  ⏳ 75% tasks - projected $9.28 (target: $11.25)
  ⏳ 100% tasks - projected $12.37 (target: $15.00)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 OPTIMIZATION RECOMMENDATIONS

🔴 HIGH PRIORITY (Immediate Action)

1. **Standardize Form Components**
   Current: Each form task costs $0.19-0.22 (22% over avg)
   Opportunity: Create reusable form template
   Est. Savings: $1.50 across remaining form tasks
   Action: Build form component library in next session

2. **Batch Similar Tasks**
   Current: Setup time per task adds ~10% overhead
   Opportunity: Group cart/admin CRUD operations
   Est. Savings: $0.80 (15 min setup time × 8 tasks)
   Action: Execute Phase 4 and 8 in batch mode

🟡 MEDIUM PRIORITY (Plan For)

3. **Optimize Hook Generation**
   Current: Hook tasks 47% more expensive than avg
   Pattern: Repetitive error handling boilerplate
   Opportunity: Create hook template/generator
   Est. Savings: $0.60 across 6 remaining hook tasks

4. **Reference Previous Work**
   Current: Some repetition in similar tasks
   Opportunity: Point to existing files rather than recreating
   Est. Savings: $0.40 (reduced context)

5. **Document Patterns Early**
   Current: Learning curve in each phase
   Opportunity: Document patterns after Phase 3
   Est. Savings: $0.70 (faster Phase 7-11 execution)

🟢 LOW PRIORITY (Nice to Have)

6. **Compress Task Descriptions**
   Current: Some tasks have verbose requirements
   Opportunity: More concise task definitions
   Est. Savings: $0.30 (reduced input tokens)

7. **Cache Common Imports**
   Opportunity: Reference import patterns file
   Est. Savings: $0.20 (minor input reduction)

TOTAL POTENTIAL SAVINGS: $4.50 (36% of remaining cost)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DETAILED BREAKDOWN (Optional)

Include full task-by-task breakdown? (yes/no)

[If yes, shows every single task with:]
  • Task number and name
  • Input tokens
  • Output tokens
  • Total tokens
  • Cost
  • Duration
  • Cost per minute
  • Efficiency rating

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 EXPORT OPTIONS

1️⃣  Export Full Report (Markdown)
    File: token-report-2026-02-20.md

2️⃣  Export Data (CSV)
    File: token-data-2026-02-20.csv
    Fields: Task, Phase, Tokens, Cost, Date, Duration

3️⃣  Export Summary (JSON)
    File: token-summary-2026-02-20.json
    For programmatic analysis

4️⃣  Copy to Clipboard
    Quick copy for sharing

5️⃣  No Export
    Just view the report

Your choice (1-5):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SUMMARY & NEXT STEPS

HEALTH: 🟢 EXCELLENT

Key Takeaways:
  ✅ 18% under budget with 24% of work done
  ✅ Efficiency stabilizing after Phase 2 spike
  ✅ On track for $12.37 total (18% under budget)
  ✅ High-value optimization opportunities identified

Immediate Actions:
  1. Continue current pace (sustainable)
  2. Build form component template (save $1.50)
  3. Plan Phase 4 batch execution (save $0.80)

Long-term Strategy:
  • Document patterns after Phase 3
  • Batch admin CRUD tasks (Phases 8-11)
  • Review after 50% completion

Next Command:
  /execute-task  (continue normal execution)
  /continue-tasks --batch  (optimize with batching)

╚══════════════════════════════════════════════════════════╝
```

---

### Step 3: Generate Optimization Suggestions

[Included in main report above under "Optimization Recommendations"]

---

### Step 4: Export Data

**CSV Format** (`token-data-2026-02-20.csv`):
```csv
Task,Phase,Name,Input_Tokens,Output_Tokens,Total_Tokens,Cost,Date,Duration_Min
0.1,0,Create Next.js Project,7680,5120,12800,0.16,2026-02-19,18
0.2,0,Create Project Structure,5760,3840,9600,0.12,2026-02-19,12
0.3,0,Setup Configuration Files,8000,5333,13333,0.19,2026-02-19,25
0.4,0,Generate TypeScript Types,4160,2774,6934,0.14,2026-02-19,15
1.1,1,Setup API Client,7040,4693,11733,0.18,2026-02-19,22
...
```

**JSON Format** (`token-summary-2026-02-20.json`):
```json
{
  "generated": "2026-02-20T16:30:00Z",
  "period": {
    "start": "2026-02-19",
    "end": "2026-02-20",
    "days": 2
  },
  "totals": {
    "tasks_completed": 18,
    "tasks_total": 76,
    "completion_pct": 23.7,
    "input_tokens": 115200,
    "output_tokens": 76800,
    "total_tokens": 192000,
    "total_cost": 2.92,
    "fix_cost": 0.05,
    "grand_total": 2.97
  },
  "averages": {
    "tokens_per_task": 10667,
    "cost_per_task": 0.162,
    "duration_min": 27.5
  },
  "projections": {
    "remaining_tasks": 58,
    "estimated_cost": 9.40,
    "projected_total": 12.37
  },
  "budget": {
    "original": 15.00,
    "spent": 2.97,
    "remaining": 12.03,
    "projected_usage_pct": 82.5,
    "status": "under_budget"
  },
  "phases": [ /* ... */ ],
  "tasks": [ /* ... */ ]
}
```

---

## Quick Summary Version
```
/review-token-usage --quick
```

Displays:
```
📊 TOKEN USAGE - QUICK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Spent:      $2.97 / $15.00 (19.8%)
Tasks:      18 / 76 (23.7%)
Avg/Task:   $0.162
Projected:  $12.37 (under budget ✅)

Status: 🟢 EXCELLENT

Top Costs:
  1. Auth Hooks ($0.21)
  2. Login Page ($0.22)
  3. Register Page ($0.20)

Savings Opportunity: $4.50 (see full report)

For detailed report: /review-token-usage
```

---

This comprehensive token usage command provides **complete visibility into costs with actionable optimization recommendations**! 💰📊✅
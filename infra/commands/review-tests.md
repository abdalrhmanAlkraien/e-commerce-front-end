# Review Test Results

View detailed test results for any task.

## Usage
```bash
/review-tests              # Show recent test results
/review-tests 2.1          # Show specific task results
/review-tests --failed     # Show only failed tests
```

## Display Format
```
📊 TEST RESULTS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent Tests (Last 10):

Task 2.1 - Login Page
  ✅ 5/5 passed | 8m 23s | 2 hours ago
  
Task 2.2 - Register Page  
  ⚠️ 4/5 passed | 9m 45s | 1 hour ago
  Failed: Scenario 3 (duplicate email)
  
Task 2.3 - Auth Layout
  ✅ 3/3 passed | 3m 12s | 45 minutes ago

Overall:
  Pass Rate: 92.3%
  Total Scenarios: 13
  Total Time: 21m 20s
```
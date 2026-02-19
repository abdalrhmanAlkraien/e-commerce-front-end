Use Playwright to test complete authentication flow.

Test scenarios:
1. Register new user → verify redirect to /products
2. Login with valid credentials → verify redirect
3. Login with invalid credentials → verify error message
4. Logout → verify redirect to /login
5. Access admin route as CUSTOMER → verify redirect to /unauthorized
6. Access admin route as ADMIN → verify access granted

Report any issues found
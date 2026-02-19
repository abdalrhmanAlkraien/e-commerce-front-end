Create utility functions for auth-related operations.

Create src/lib/utils/auth.ts:

1. Function: isAuthenticated() → boolean
    - Check if user has valid token in authStore
    - Returns true if token exists

2. Function: isAnonymous() → boolean
    - Check if user has sessionId but no token
    - Returns true if sessionId exists but no token

3. Function: requireAuth() → void
    - Throws error if not authenticated
    - Use in components that require login

4. Function: getUserRole() → UserRole | null
    - Return user role from authStore
    - Returns null if not authenticated

5. Function: isAdmin() → boolean
    - Check if user role is ADMIN
    - Returns false if not authenticated

6. Function: canAccessAdminPanel() → boolean
    - Check if user can access admin routes
    - Returns isAuthenticated() && isAdmin()

7. Constant: AUTH_ROUTES
    - Array of public auth routes: ['/login', '/register']

8. Constant: ADMIN_ROUTES
    - Array of admin routes: ['/admin/*']

Export all utilities

Test all helper functions with different auth states
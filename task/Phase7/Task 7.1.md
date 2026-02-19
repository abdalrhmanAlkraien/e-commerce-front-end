Create middleware to protect admin routes.

Create src/middleware.ts:
1. Check if user is authenticated
2. Check if user has ADMIN role
3. Redirect to /login if not authenticated
4. Redirect to /unauthorized if not admin
5. Allow access to admin routes for ADMIN users

Test access control for both CUSTOMER and ADMIN users
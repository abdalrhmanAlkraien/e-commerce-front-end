📄 Task 1.3.2 — Authentication Helper Utilities
================================================

🎯 Objective
------------

Create a comprehensive utility library for authentication-related operations including:
- User authentication state checks (authenticated, anonymous, admin)
- Route protection helpers
- Role-based access control utilities
- Predefined route constants for auth and admin pages

📂 File Locations
=================
```
src/lib/utils/auth.ts (create)
```

1️⃣ Type Definitions
====================

Import Required Types
---------------------

```typescript
import type { UserRole } from '@/lib/store/auth';
import type { User } from '@/types';
```

**Note:** UserRole should already be defined in auth store (Task 1.2).

2️⃣ Authentication State Functions
==================================

isAuthenticated()
-----------------

**Signature:**
```typescript
export function isAuthenticated(): boolean
```

**Purpose:**
- Check if user is currently authenticated
- Quick check for protected routes
- Used in middleware and guards

**Implementation:**
```typescript
export function isAuthenticated(): boolean {
  const token = useAuthStore.getState().token;
  return !!token;
}
```

**Logic:**
1. Get token from auth store
2. Return true if token exists
3. Return false if no token

**Usage:**
```typescript
if (!isAuthenticated()) {
  redirect('/login');
}
```

**Note:**
- Does NOT validate token expiration
- Just checks if token exists in store
- For actual validation, backend returns 401

isAnonymous()
-------------

**Signature:**
```typescript
export function isAnonymous(): boolean
```

**Purpose:**
- Check if user is browsing anonymously
- Has sessionId but no JWT token
- Used to show "Sign in to continue" messages

**Implementation:**
```typescript
export function isAnonymous(): boolean {
  const { token, sessionId } = useAuthStore.getState();
  return !token && !!sessionId;
}
```

**Logic:**
1. Get token and sessionId from auth store
2. Return true if NO token AND sessionId exists
3. Return false otherwise

**Usage:**
```typescript
if (isAnonymous()) {
  showMessage('Sign in to save your cart');
}
```

**States:**
- `isAuthenticated()` = true → User logged in
- `isAnonymous()` = true → User has sessionId, not logged in
- Both false → Fresh user, no sessionId yet

requireAuth()
-------------

**Signature:**
```typescript
export function requireAuth(): void
```

**Purpose:**
- Throw error if user not authenticated
- Use in functions that require login
- Guards against unauthorized access

**Implementation:**
```typescript
export function requireAuth(): void {
  if (!isAuthenticated()) {
    throw new Error('Authentication required. Please log in to continue.');
  }
}
```

**Logic:**
1. Check if authenticated
2. If not → throw descriptive error
3. If yes → do nothing (continue)

**Usage:**
```typescript
export function getUserOrders() {
  requireAuth(); // Throws if not authenticated
  
  // Continue with authenticated logic
  return apiClient.get('/orders');
}
```

**Error Handling:**
```typescript
try {
  requireAuth();
  // Protected code
} catch (error) {
  toast.error(error.message);
  router.push('/login');
}
```

3️⃣ User Role Functions
=======================

getUserRole()
-------------

**Signature:**
```typescript
export function getUserRole(): UserRole | null
```

**Purpose:**
- Get current user's role
- Returns null if not authenticated
- Used for role-based UI logic

**Implementation:**
```typescript
export function getUserRole(): UserRole | null {
  const user = useAuthStore.getState().user;
  
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }
  
  // Return first role (users typically have one primary role)
  return user.roles[0];
}
```

**Logic:**
1. Get user from auth store
2. Check if user exists and has roles
3. Return first role (primary role)
4. Return null if no user or no roles

**Usage:**
```typescript
const role = getUserRole();

if (role === 'ADMIN') {
  showAdminFeatures();
} else if (role === 'CUSTOMER') {
  showCustomerFeatures();
}
```

**Note:**
- Assumes users have one primary role
- If multiple roles needed, modify to return array
- Backend defines role structure

isAdmin()
---------

**Signature:**
```typescript
export function isAdmin(): boolean
```

**Purpose:**
- Quick check if user is admin
- Used for admin-only UI elements
- Used in route guards

**Implementation:**
```typescript
export function isAdmin(): boolean {
  const user = useAuthStore.getState().user;
  
  if (!user || !user.roles) {
    return false;
  }
  
  return user.roles.includes('ADMIN');
}
```

**Logic:**
1. Get user from auth store
2. Check if user exists and has roles
3. Check if 'ADMIN' is in roles array
4. Return true if admin, false otherwise

**Usage:**
```typescript
// Conditional rendering
{isAdmin() && <AdminPanel />}

// Route guard
if (pathname.startsWith('/admin') && !isAdmin()) {
  redirect('/');
}
```

**Note:**
- Returns false if not authenticated
- Backend controls who has ADMIN role
- Don't rely solely on frontend checks (backend validates too)

canAccessAdminPanel()
---------------------

**Signature:**
```typescript
export function canAccessAdminPanel(): boolean
```

**Purpose:**
- Combined check: authenticated AND admin
- Used for admin route protection
- More explicit than just isAdmin()

**Implementation:**
```typescript
export function canAccessAdminPanel(): boolean {
  return isAuthenticated() && isAdmin();
}
```

**Logic:**
1. Check if user is authenticated
2. Check if user is admin
3. Both must be true

**Usage:**
```typescript
// Middleware
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!canAccessAdminPanel()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

// Component
if (!canAccessAdminPanel()) {
  return <AccessDenied />;
}
```

**Why separate from isAdmin()?**
- More explicit intent
- Combines two checks
- Better readability
- Can add more conditions later (e.g., subscription status)

4️⃣ Route Constants
===================

AUTH_ROUTES
-----------

**Definition:**
```typescript
export const AUTH_ROUTES = [
  '/login',
  '/register',
] as const;
```

**Purpose:**
- Define public authentication routes
- Used in middleware to allow unauthenticated access
- Used to prevent redirect loops

**Type:**
```typescript
export type AuthRoute = typeof AUTH_ROUTES[number];
// Type: '/login' | '/register'
```

**Usage:**
```typescript
// In middleware
const isAuthRoute = AUTH_ROUTES.includes(pathname as AuthRoute);

if (isAuthRoute) {
  // Allow access even if not authenticated
  return NextResponse.next();
}

// Check if on auth route
export function isOnAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route);
}
```

**Note:**
- Use `as const` for type narrowing
- Add more auth routes if needed (forgot-password, verify-email, etc.)

ADMIN_ROUTES
------------

**Definition:**
```typescript
export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/customers',
] as const;
```

**Purpose:**
- Define admin-only routes
- Used in middleware for protection
- Used for navigation menu logic

**Type:**
```typescript
export type AdminRoute = typeof ADMIN_ROUTES[number];
```

**Usage:**
```typescript
// In middleware
const isAdminRoute = pathname.startsWith('/admin');

if (isAdminRoute && !canAccessAdminPanel()) {
  return NextResponse.redirect(new URL('/login', request.url));
}

// Helper function
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}
```

**Pattern Matching:**
```typescript
// More flexible - matches any admin path
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

// Strict - only matches defined routes
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}
```

5️⃣ Helper Functions
====================

isOnAuthRoute()
---------------

**Additional helper (optional but useful):**

```typescript
export function isOnAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route);
}
```

**Purpose:**
- Check if current path is an auth route
- Prevent redirect loops
- Used in middleware

**Usage:**
```typescript
if (!isAuthenticated() && !isOnAuthRoute(pathname)) {
  redirect('/login');
}
```

getRedirectPath()
-----------------

**Additional helper (optional but useful):**

```typescript
export function getRedirectPath(pathname: string): string {
  // If already on login, don't redirect
  if (pathname === '/login') {
    return '/';
  }
  
  // Redirect to login with return URL
  return `/login?returnUrl=${encodeURIComponent(pathname)}`;
}
```

**Purpose:**
- Generate login redirect URL
- Preserve intended destination
- Better UX (return after login)

**Usage:**
```typescript
if (!isAuthenticated()) {
  const redirectPath = getRedirectPath(pathname);
  router.push(redirectPath);
}
```

6️⃣ Code Example
================

Complete Implementation
-----------------------

```typescript
// src/lib/utils/auth.ts

import { useAuthStore } from '@/lib/store/auth';
import type { UserRole } from '@/lib/store/auth';

// ========================================
// AUTHENTICATION STATE FUNCTIONS
// ========================================

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = useAuthStore.getState().token;
  return !!token;
}

/**
 * Check if user is browsing anonymously (has sessionId but no token)
 */
export function isAnonymous(): boolean {
  const { token, sessionId } = useAuthStore.getState();
  return !token && !!sessionId;
}

/**
 * Throw error if user is not authenticated
 * Use in functions that require login
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    throw new Error('Authentication required. Please log in to continue.');
  }
}

// ========================================
// USER ROLE FUNCTIONS
// ========================================

/**
 * Get current user's role
 * Returns null if not authenticated or no role assigned
 */
export function getUserRole(): UserRole | null {
  const user = useAuthStore.getState().user;
  
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }
  
  return user.roles[0]; // Primary role
}

/**
 * Check if user has ADMIN role
 */
export function isAdmin(): boolean {
  const user = useAuthStore.getState().user;
  
  if (!user || !user.roles) {
    return false;
  }
  
  return user.roles.includes('ADMIN');
}

/**
 * Check if user can access admin panel
 * Requires both authentication and admin role
 */
export function canAccessAdminPanel(): boolean {
  return isAuthenticated() && isAdmin();
}

// ========================================
// ROUTE CONSTANTS
// ========================================

/**
 * Public authentication routes
 * These routes are accessible without authentication
 */
export const AUTH_ROUTES = [
  '/login',
  '/register',
] as const;

export type AuthRoute = typeof AUTH_ROUTES[number];

/**
 * Admin-only routes
 * These routes require admin role
 */
export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/customers',
] as const;

export type AdminRoute = typeof ADMIN_ROUTES[number];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if pathname is an auth route
 */
export function isOnAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route);
}

/**
 * Check if pathname is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

/**
 * Get redirect path for login
 * Preserves intended destination
 */
export function getRedirectPath(pathname: string): string {
  if (pathname === '/login') {
    return '/';
  }
  
  return `/login?returnUrl=${encodeURIComponent(pathname)}`;
}
```

7️⃣ Usage Examples
==================

In Middleware
-------------

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  isAuthenticated, 
  canAccessAdminPanel, 
  isOnAuthRoute,
  isAdminRoute,
  getRedirectPath 
} from '@/lib/utils/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin routes require admin access
  if (isAdminRoute(pathname)) {
    if (!canAccessAdminPanel()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Protected routes require authentication
  const publicRoutes = ['/', '/products', ...AUTH_ROUTES];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (!isPublicRoute && !isAuthenticated()) {
    const redirectPath = getRedirectPath(pathname);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

In Components
-------------

```typescript
// components/AdminPanel.tsx
import { canAccessAdminPanel } from '@/lib/utils/auth';

export function AdminPanel() {
  if (!canAccessAdminPanel()) {
    return <AccessDenied />;
  }
  
  return <div>Admin Panel Content</div>;
}
```

```typescript
// components/Header.tsx
import { isAuthenticated, isAdmin } from '@/lib/utils/auth';

export function Header() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      
      {isAuthenticated() ? (
        <>
          <Link href="/orders">My Orders</Link>
          {isAdmin() && <Link href="/admin">Admin</Link>}
          <LogoutButton />
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
```

In API Functions
----------------

```typescript
// lib/api/orders.ts
import { requireAuth } from '@/lib/utils/auth';

export async function getMyOrders() {
  requireAuth(); // Throws if not authenticated
  
  return apiClient.get('/orders');
}

export async function cancelOrder(orderId: string) {
  requireAuth();
  
  return apiClient.post(`/orders/${orderId}/cancel`);
}
```

In Page Components
------------------

```typescript
// app/admin/page.tsx
import { redirect } from 'next/navigation';
import { canAccessAdminPanel } from '@/lib/utils/auth';

export default function AdminPage() {
  if (!canAccessAdminPanel()) {
    redirect('/login');
  }
  
  return <AdminDashboard />;
}
```

Conditional Rendering
---------------------

```typescript
// components/ProductCard.tsx
import { isAuthenticated, isAnonymous } from '@/lib/utils/auth';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
      
      {isAnonymous() && (
        <p className="text-sm text-gray-500">
          Sign in to save your cart
        </p>
      )}
      
      {isAuthenticated() && (
        <button onClick={handleAddToWishlist}>
          Add to Wishlist
        </button>
      )}
    </div>
  );
}
```

🧪 Test Scenarios
=================

### Scenario 1: isAuthenticated() - User Logged In
**Action:**
```typescript
// Login user
await login({ email: 'user@example.com', password: 'pass' });

// Check authentication
const result = isAuthenticated();
```

**Expected Result:**
- Returns `true`

**Validation:**
```typescript
expect(result).toBe(true);
```

### Scenario 2: isAuthenticated() - User Not Logged In
**Action:**
```typescript
// No login
const result = isAuthenticated();
```

**Expected Result:**
- Returns `false`

**Validation:**
```typescript
expect(result).toBe(false);
```

### Scenario 3: isAnonymous() - Has SessionId, No Token
**Action:**
```typescript
// Fresh user with auto-generated sessionId
const { token, sessionId } = useAuthStore.getState();
const result = isAnonymous();
```

**Expected Result:**
- Returns `true`
- Has sessionId but no token

**Validation:**
```typescript
expect(result).toBe(true);
expect(token).toBeNull();
expect(sessionId).toBeTruthy();
```

### Scenario 4: isAnonymous() - Authenticated User
**Action:**
```typescript
// Login user
await login({ email: 'user@example.com', password: 'pass' });

// Check if anonymous
const result = isAnonymous();
```

**Expected Result:**
- Returns `false`
- Has both token and sessionId

**Validation:**
```typescript
expect(result).toBe(false);
expect(isAuthenticated()).toBe(true);
```

### Scenario 5: requireAuth() - Authenticated
**Action:**
```typescript
await login({ email: 'user@example.com', password: 'pass' });

try {
  requireAuth();
  // Should not throw
} catch (error) {
  fail('Should not throw when authenticated');
}
```

**Expected Result:**
- No error thrown
- Execution continues

**Validation:**
```typescript
expect(() => requireAuth()).not.toThrow();
```

### Scenario 6: requireAuth() - Not Authenticated
**Action:**
```typescript
// No login
try {
  requireAuth();
  fail('Should have thrown');
} catch (error) {
  // Should throw
}
```

**Expected Result:**
- Throws error with message

**Validation:**
```typescript
expect(() => requireAuth()).toThrow('Authentication required');
```

### Scenario 7: getUserRole() - Admin User
**Action:**
```typescript
// Login as admin
await login({ email: 'admin@example.com', password: 'pass' });

const role = getUserRole();
```

**Expected Result:**
- Returns `'ADMIN'`

**Validation:**
```typescript
expect(role).toBe('ADMIN');
```

### Scenario 8: getUserRole() - Not Authenticated
**Action:**
```typescript
// No login
const role = getUserRole();
```

**Expected Result:**
- Returns `null`

**Validation:**
```typescript
expect(role).toBeNull();
```

### Scenario 9: isAdmin() - Admin User
**Action:**
```typescript
// Login as admin
await login({ email: 'admin@example.com', password: 'pass' });

const result = isAdmin();
```

**Expected Result:**
- Returns `true`

**Validation:**
```typescript
expect(result).toBe(true);
```

### Scenario 10: isAdmin() - Regular User
**Action:**
```typescript
// Login as customer
await login({ email: 'customer@example.com', password: 'pass' });

const result = isAdmin();
```

**Expected Result:**
- Returns `false`

**Validation:**
```typescript
expect(result).toBe(false);
```

### Scenario 11: canAccessAdminPanel() - Admin Logged In
**Action:**
```typescript
await login({ email: 'admin@example.com', password: 'pass' });

const result = canAccessAdminPanel();
```

**Expected Result:**
- Returns `true`

**Validation:**
```typescript
expect(result).toBe(true);
expect(isAuthenticated()).toBe(true);
expect(isAdmin()).toBe(true);
```

### Scenario 12: canAccessAdminPanel() - Not Admin
**Action:**
```typescript
await login({ email: 'customer@example.com', password: 'pass' });

const result = canAccessAdminPanel();
```

**Expected Result:**
- Returns `false` (authenticated but not admin)

**Validation:**
```typescript
expect(result).toBe(false);
expect(isAuthenticated()).toBe(true);
expect(isAdmin()).toBe(false);
```

### Scenario 13: isOnAuthRoute() - On Login Page
**Action:**
```typescript
const result = isOnAuthRoute('/login');
```

**Expected Result:**
- Returns `true`

**Validation:**
```typescript
expect(result).toBe(true);
```

### Scenario 14: isOnAuthRoute() - On Products Page
**Action:**
```typescript
const result = isOnAuthRoute('/products');
```

**Expected Result:**
- Returns `false`

**Validation:**
```typescript
expect(result).toBe(false);
```

### Scenario 15: isAdminRoute() - Admin Path
**Action:**
```typescript
const result = isAdminRoute('/admin/products');
```

**Expected Result:**
- Returns `true`

**Validation:**
```typescript
expect(result).toBe(true);
```

🔒 Non-Functional Requirements
===============================

**Code Quality:**
- ✅ Fully typed (no `any` types)
- ✅ Pure functions (no side effects except store reads)
- ✅ Clear, descriptive function names
- ✅ Consistent return types

**Performance:**
- ✅ Lightweight functions (no heavy computations)
- ✅ Efficient store access
- ✅ No unnecessary re-computations

**Security:**
- ✅ Frontend checks only for UX
- ✅ Backend must validate all permissions
- ✅ Don't rely solely on frontend role checks

**Reliability:**
- ✅ Handles missing user gracefully
- ✅ Handles missing roles gracefully
- ✅ No errors if store not initialized

✅ Deliverable
==============

**Created file:**
```
src/lib/utils/auth.ts
```

**Exports:**
```typescript
// Functions
export function isAuthenticated(): boolean;
export function isAnonymous(): boolean;
export function requireAuth(): void;
export function getUserRole(): UserRole | null;
export function isAdmin(): boolean;
export function canAccessAdminPanel(): boolean;
export function isOnAuthRoute(pathname: string): boolean;
export function isAdminRoute(pathname: string): boolean;
export function getRedirectPath(pathname: string): string;

// Constants
export const AUTH_ROUTES;
export const ADMIN_ROUTES;

// Types
export type AuthRoute;
export type AdminRoute;
```

**Integration:**
- Used in middleware for route protection
- Used in components for conditional rendering
- Used in API functions for auth checks
- Works with auth store (Task 1.2)

📊 Acceptance Criteria
======================

**File Creation:**
- [ ] `src/lib/utils/auth.ts` created
- [ ] All functions implemented
- [ ] All constants defined
- [ ] All exports present
- [ ] No TypeScript errors

**Functionality:**
- [ ] isAuthenticated() returns correct boolean
- [ ] isAnonymous() detects anonymous users
- [ ] requireAuth() throws when not authenticated
- [ ] getUserRole() returns correct role or null
- [ ] isAdmin() detects admin users
- [ ] canAccessAdminPanel() checks both auth and role
- [ ] Route constants defined correctly
- [ ] Helper functions work

**Testing:**
- [ ] All 15 test scenarios pass
- [ ] Works with different user states
- [ ] Works with admin and customer roles
- [ ] Route checks work correctly

**Integration:**
- [ ] Works with auth store (Task 1.2)
- [ ] Can be used in middleware
- [ ] Can be used in components
- [ ] Can be used in API functions

**Quality:**
- [ ] Clean, readable code
- [ ] Proper TypeScript types
- [ ] No side effects (except store reads)
- [ ] Functions are pure

⏱️ Estimated Duration
=====================
20-25 minutes

🔗 Dependencies
===============

**Requires (must be complete first):**
- Task 1.2 - Setup Auth Store (needs useAuthStore, UserRole type)

**Blocks (waiting on this task):**
- Middleware implementation (route protection)
- Protected page components
- Admin panel pages
- Conditional UI rendering throughout app

📝 Notes
========

**Critical:**
- These are **frontend checks only** for UX
- **Backend must validate** all permissions
- Don't trust frontend role checks for security
- Always verify on backend

**Common Mistakes:**
- ❌ Relying only on frontend auth checks (insecure!)
- ❌ Not handling null user gracefully
- ❌ Forgetting to check both auth and role for admin
- ❌ Using requireAuth() in components (causes errors)

**Best Practices:**
- Use `isAuthenticated()` in middleware and guards
- Use `canAccessAdminPanel()` for admin routes (not just isAdmin)
- Use `requireAuth()` in API functions (throws clear error)
- Use `isAnonymous()` for "Sign in" prompts
- Backend always validates permissions

**Security Notes:**
- Frontend checks improve UX (hide buttons, redirect)
- Backend checks enforce security (validate every request)
- JWT token validated on backend for each request
- Role checked on backend for admin operations
- Don't expose sensitive data based on frontend role

**Usage Tips:**
- Use in middleware for route protection
- Use in components for conditional rendering
- Use in API wrappers for clear error messages
- Combine with React hooks for reactive updates

**Testing Tips:**
- Test all user states (authenticated, anonymous, admin, customer)
- Test route constants with various paths
- Test requireAuth() throwing behavior
- Verify works with auth store updates
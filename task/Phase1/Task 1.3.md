📄 Task 1.3 — Authentication API Module
========================================

🎯 Objective
------------

Create a production-ready authentication API module that supports:
- User login and registration with JWT tokens
- Anonymous cart merging (preserving sessionId)
- Proper error handling and type safety
- Integration with auth store for state management
- Helper functions for header generation

📂 File Locations
=================
```
src/lib/api/auth.ts (create)
```

1️⃣ Type Definitions
====================

Import Required Types
---------------------

```typescript
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  UserDto 
} from '@/types';
```

**From backend OpenAPI spec:**
- `LoginRequest` - { email: string, password: string }
- `RegisterRequest` - { firstName: string, lastName: string, email: string, password: string }
- `AuthResponse` - { accessToken: string, refreshToken: string, user: UserDto }
- `UserDto` - Complete user object

Local Types (if needed)
-----------------------

```typescript
// Optional: convenience types
type LoginCredentials = LoginRequest;
type RegistrationData = RegisterRequest;
```

2️⃣ Authentication Functions
============================

login()
-------

**Signature:**
```typescript
async function login(credentials: LoginRequest): Promise<AuthResponse>
```

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```typescript
{
  email: string;    // User's email
  password: string; // User's password
}
```

**Response:**
```typescript
{
  accessToken: string;   // JWT access token
  refreshToken: string;  // JWT refresh token
  user: UserDto;        // Complete user object
}
```

**Implementation:**
```typescript
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    
    const authData = response.data;
    
    // Store auth data in store
    const authStore = useAuthStore.getState();
    authStore.setUser(authData.user, authData.accessToken);
    
    // IMPORTANT: Don't clear sessionId - backend uses it for cart merge
    
    return authData;
  } catch (error) {
    throw error; // Let error interceptor handle it
  }
}
```

**Success Flow:**
1. Send credentials to backend
2. Receive `AuthResponse` with token and user
3. Store `token` in auth store using `setUser()`
4. Store `user` object in auth store
5. **Keep existing sessionId** (critical for cart merge)
6. Backend automatically merges anonymous cart using sessionId
7. Return `AuthResponse` to caller

**Error Handling:**
- 400 → Invalid credentials ("Email or password is incorrect")
- 401 → Unauthorized ("Invalid credentials")
- 422 → Validation error ("Email format invalid")
- 500 → Server error

register()
----------

**Signature:**
```typescript
async function register(data: RegisterRequest): Promise<AuthResponse>
```

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

**Response:** Same as login - `AuthResponse`

**Implementation:**
```typescript
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data
    );
    
    const authData = response.data;
    
    // Store auth data in store
    const authStore = useAuthStore.getState();
    authStore.setUser(authData.user, authData.accessToken);
    
    // Keep sessionId - backend merges anonymous cart
    
    return authData;
  } catch (error) {
    throw error;
  }
}
```

**Success Flow:**
1. Send registration data to backend
2. Backend creates new user account
3. Receive `AuthResponse` (auto-login)
4. Store token and user in auth store
5. **Keep sessionId** for cart merge
6. Backend merges anonymous cart to new account
7. Return `AuthResponse`

**Error Handling:**
- 400 → Email already exists ("Email is already registered")
- 422 → Validation errors ("Password must be at least 8 characters")
- 500 → Server error

logout()
--------

**Signature:**
```typescript
async function logout(): Promise<void>
```

**Endpoint:** `POST /api/v1/auth/logout` (optional - if backend requires)

**Implementation:**
```typescript
export async function logout(): Promise<void> {
  try {
    // Optional: notify backend (if endpoint exists)
    await apiClient.post('/auth/logout').catch(() => {
      // Ignore errors - logout locally anyway
    });
  } catch (error) {
    // Ignore errors during logout
  } finally {
    // Always clear local auth state
    const authStore = useAuthStore.getState();
    authStore.logout(); // Clears token/user, keeps sessionId
  }
}
```

**Flow:**
1. Optionally notify backend (invalidate token)
2. Clear `token` from auth store
3. Clear `user` from auth store
4. **Keep `sessionId` intact** (critical!)
5. User continues as anonymous with same sessionId
6. Anonymous cart still accessible

**Why keep sessionId:**
- User may have items in cart
- Want cart to persist after logout
- User can continue shopping anonymously
- Can login again later and cart is still there

3️⃣ Helper Functions
====================

getAuthHeaders()
----------------

**Signature:**
```typescript
function getAuthHeaders(): Record<string, string>
```

**Purpose:**
- Generate correct auth headers for API requests
- Used by other API modules (cart, checkout, etc.)
- Supports both authenticated and anonymous users

**Implementation:**
```typescript
export function getAuthHeaders(): Record<string, string> {
  const { token, sessionId } = useAuthStore.getState();
  
  if (token) {
    // Authenticated user - JWT takes priority
    return {
      'Authorization': `Bearer ${token}`
    };
  } else if (sessionId) {
    // Anonymous user - use session ID
    return {
      'X-SESSION-ID': sessionId
    };
  }
  
  // No auth (shouldn't normally happen)
  return {};
}
```

**Logic:**
1. Get current auth state
2. If token exists → return Authorization header
3. Else if sessionId exists → return X-SESSION-ID header
4. Else → return empty object

**Usage by other modules:**
```typescript
// In cart API
import { getAuthHeaders } from './auth';

export async function addToCart(item: CartItem) {
  const headers = getAuthHeaders();
  return apiClient.post('/cart/items', item, { headers });
}
```

4️⃣ API Module Export
=====================

Export Structure
----------------

```typescript
export const authApi = {
  login,
  register,
  logout,
  getAuthHeaders,
};

// Also export individual functions for flexibility
export { login, register, logout, getAuthHeaders };
```

**Usage:**
```typescript
// Option 1: Use authApi object
import { authApi } from '@/lib/api/auth';
await authApi.login({ email, password });

// Option 2: Use individual functions
import { login } from '@/lib/api/auth';
await login({ email, password });
```

5️⃣ Integration with Auth Store
================================

Store Actions Used
------------------

**setUser(user, token):**
```typescript
// Called after login/register
authStore.setUser(authData.user, authData.accessToken);
```

**logout():**
```typescript
// Called during logout
authStore.logout(); // Clears token/user, keeps sessionId
```

**getState():**
```typescript
// Access current auth state
const { token, sessionId } = useAuthStore.getState();
```

**Critical Rule:**
- NEVER call `authStore.clearAll()` from API functions
- Use `authStore.logout()` to preserve sessionId
- Only `clearAll()` in special cases (security cleanup)

6️⃣ Cart Merge Flow
===================

How Anonymous Cart Merging Works
---------------------------------

**Step 1: Anonymous User**
```
User browses → sessionId generated → adds to cart → cart stored with sessionId
```

**Step 2: User Registers/Logs In**
```
Frontend sends login request with sessionId in headers (automatic via interceptor)
Backend receives: credentials + X-SESSION-ID header
Backend authenticates user + finds anonymous cart by sessionId
Backend merges anonymous cart into user's account
Backend returns: AuthResponse with token
```

**Step 3: Frontend After Login**
```
Frontend stores token + user
Frontend keeps sessionId
Future requests use token (takes priority)
User's cart now includes previous anonymous items
```

**Step 4: User Logs Out**
```
Frontend clears token/user
Frontend keeps sessionId
User becomes anonymous again with same sessionId
Can continue shopping with preserved cart
```

**Backend Responsibilities:**
- Detect sessionId in login/register requests
- Merge anonymous cart to user account
- Preserve cart items during merge

**Frontend Responsibilities:**
- Always send sessionId (via interceptor)
- Never clear sessionId during login/logout
- Use `logout()` not `clearAll()`

7️⃣ Error Handling
==================

Error Response Format
---------------------

**From backend:**
```typescript
{
  message: string;      // User-friendly error message
  timestamp: string;    // ISO-8601 timestamp
  errors?: string[];    // Optional validation errors
}
```

**Handling in API functions:**
```typescript
try {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
} catch (error) {
  // Error interceptor already handled it
  // Just re-throw for caller to handle
  throw error;
}
```

Common Error Messages
---------------------

**Login:**
- "Invalid email or password" (401)
- "Email format is invalid" (400)
- "Account is locked" (403)

**Register:**
- "Email is already registered" (400)
- "Password must be at least 8 characters" (422)
- "Invalid email format" (422)

**Logout:**
- Generally silent - always succeeds locally

8️⃣ Code Example
================

Complete Implementation
-----------------------

```typescript
// src/lib/api/auth.ts

import { apiClient } from './client';
import { useAuthStore } from '@/lib/store/auth';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types';

/**
 * Login user with email and password
 * Automatically stores token and user in auth store
 * Preserves sessionId for cart merge
 */
export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/login',
    credentials
  );
  
  const authData = response.data;
  
  // Store auth data (token + user)
  const authStore = useAuthStore.getState();
  authStore.setUser(authData.user, authData.accessToken);
  
  // sessionId is preserved automatically
  
  return authData;
}

/**
 * Register new user account
 * Automatically logs in and stores auth data
 * Preserves sessionId for cart merge
 */
export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/register',
    data
  );
  
  const authData = response.data;
  
  // Store auth data (token + user)
  const authStore = useAuthStore.getState();
  authStore.setUser(authData.user, authData.accessToken);
  
  return authData;
}

/**
 * Logout current user
 * Clears token and user but preserves sessionId
 * User continues as anonymous
 */
export async function logout(): Promise<void> {
  try {
    // Optional backend notification
    await apiClient.post('/auth/logout').catch(() => {});
  } finally {
    // Always clear local state
    const authStore = useAuthStore.getState();
    authStore.logout(); // Keeps sessionId intact
  }
}

/**
 * Get auth headers for API requests
 * Returns JWT token for authenticated users
 * Returns sessionId for anonymous users
 */
export function getAuthHeaders(): Record<string, string> {
  const { token, sessionId } = useAuthStore.getState();
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else if (sessionId) {
    return { 'X-SESSION-ID': sessionId };
  }
  
  return {};
}

// Export as object for convenience
export const authApi = {
  login,
  register,
  logout,
  getAuthHeaders,
};
```

9️⃣ Usage Examples
==================

In Login Component
------------------

```typescript
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  
  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data);
      
      // User is now authenticated
      router.push('/products');
    } catch (error) {
      // Show error message
      toast.error('Login failed. Please check your credentials.');
    }
  };
  
  return <form onSubmit={handleSubmit(handleLogin)}>...</form>;
}
```

In Register Component
---------------------

```typescript
import { register } from '@/lib/api/auth';

function RegisterForm() {
  const handleRegister = async (data: RegisterRequest) => {
    try {
      await register(data);
      
      // User is registered and logged in
      router.push('/products');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Email is already registered');
      } else {
        toast.error('Registration failed');
      }
    }
  };
  
  return <form onSubmit={handleSubmit(handleRegister)}>...</form>;
}
```

In Logout Button
----------------

```typescript
import { logout } from '@/lib/api/auth';

function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    
    // User is now anonymous
    router.push('/');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

In Other API Modules
--------------------

```typescript
// In cart API module
import { getAuthHeaders } from '@/lib/api/auth';

export async function addToCart(item: CartItem) {
  const headers = getAuthHeaders();
  
  return apiClient.post('/cart/items', item, {
    headers, // Automatically includes correct auth
  });
}
```

🧪 Test Scenarios
=================

### Scenario 1: Login with Valid Credentials
**Action:**
```typescript
const credentials = {
  email: 'user@example.com',
  password: 'password123'
};
const response = await login(credentials);
```

**Expected Result:**
- API call to POST `/auth/login`
- Receives AuthResponse with token + user
- Token stored in auth store
- User stored in auth store
- SessionId preserved (not cleared)
- isAuthenticated = true
- Returns AuthResponse object

**Validation:**
```typescript
const { token, user, sessionId } = useAuthStore.getState();
expect(token).toBeTruthy();
expect(user?.email).toBe('user@example.com');
expect(sessionId).toBeTruthy(); // Still exists
expect(response.accessToken).toBeTruthy();
```

### Scenario 2: Login with Invalid Credentials
**Action:**
```typescript
const badCredentials = {
  email: 'wrong@example.com',
  password: 'wrongpass'
};
await login(badCredentials);
```

**Expected Result:**
- API call fails with 401
- Error thrown with message
- No token stored
- No user stored
- SessionId unchanged

**Validation:**
```typescript
try {
  await login(badCredentials);
  fail('Should have thrown error');
} catch (error) {
  expect(error.response?.status).toBe(401);
  const { token, user } = useAuthStore.getState();
  expect(token).toBeNull();
  expect(user).toBeNull();
}
```

### Scenario 3: Register New User
**Action:**
```typescript
const registrationData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'securepass123'
};
const response = await register(registrationData);
```

**Expected Result:**
- API call to POST `/auth/register`
- User account created
- Auto-logged in with token
- Token + user stored
- SessionId preserved
- Returns AuthResponse

**Validation:**
```typescript
const { token, user, sessionId } = useAuthStore.getState();
expect(token).toBeTruthy();
expect(user?.email).toBe('john@example.com');
expect(user?.firstName).toBe('John');
expect(sessionId).toBeTruthy();
```

### Scenario 4: Register with Existing Email
**Action:**
```typescript
const duplicateData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'existing@example.com', // Already registered
  password: 'password123'
};
await register(duplicateData);
```

**Expected Result:**
- API call fails with 400
- Error message: "Email is already registered"
- No token stored
- User not created

**Validation:**
```typescript
try {
  await register(duplicateData);
  fail('Should have thrown');
} catch (error) {
  expect(error.response?.status).toBe(400);
  expect(error.response?.data?.message).toContain('already registered');
}
```

### Scenario 5: Logout Preserves SessionId
**Action:**
```typescript
// Login first
await login({ email: 'user@example.com', password: 'pass' });
const sessionIdBeforeLogout = useAuthStore.getState().sessionId;

// Then logout
await logout();
const sessionIdAfterLogout = useAuthStore.getState().sessionId;
```

**Expected Result:**
- Token cleared
- User cleared
- SessionId preserved (same UUID)
- isAuthenticated = false
- Can still use cart

**Validation:**
```typescript
expect(sessionIdAfterLogout).toBe(sessionIdBeforeLogout);
const { token, user } = useAuthStore.getState();
expect(token).toBeNull();
expect(user).toBeNull();
```

### Scenario 6: getAuthHeaders() - Authenticated
**Action:**
```typescript
// After login
await login({ email: 'user@example.com', password: 'pass' });
const headers = getAuthHeaders();
```

**Expected Result:**
- Returns object with Authorization header
- Header value: "Bearer {token}"
- No X-SESSION-ID header

**Validation:**
```typescript
expect(headers['Authorization']).toBeTruthy();
expect(headers['Authorization']).toMatch(/^Bearer /);
expect(headers['X-SESSION-ID']).toBeUndefined();
```

### Scenario 7: getAuthHeaders() - Anonymous
**Action:**
```typescript
// No login, just sessionId
const headers = getAuthHeaders();
```

**Expected Result:**
- Returns object with X-SESSION-ID header
- Header value: sessionId UUID
- No Authorization header

**Validation:**
```typescript
expect(headers['X-SESSION-ID']).toBeTruthy();
expect(headers['Authorization']).toBeUndefined();
```

### Scenario 8: Cart Merge Flow (Integration)
**Action:**
```typescript
// 1. Anonymous user adds to cart
const sessionId = useAuthStore.getState().sessionId;
await addToCart({ productId: '123', quantity: 1 });

// 2. User logs in
await login({ email: 'user@example.com', password: 'pass' });

// 3. Fetch cart
const cart = await getCart();
```

**Expected Result:**
- Cart contains item added while anonymous
- Backend merged cart using sessionId
- Now associated with user account
- SessionId still same

**Validation:**
```typescript
expect(cart.items).toHaveLength(1);
expect(cart.items[0].productId).toBe('123');
```

🔒 Non-Functional Requirements
===============================

**Code Quality:**
- ✅ Fully typed (no `any` types)
- ✅ Clean, readable code
- ✅ Proper error handling
- ✅ Follows project patterns

**Security:**
- ✅ Never log passwords or tokens
- ✅ Tokens stored securely in auth store
- ✅ SessionId preserved for cart continuity
- ✅ HTTPS only in production

**Performance:**
- ✅ Minimal API calls
- ✅ Efficient state updates
- ✅ No unnecessary re-renders

**Reliability:**
- ✅ Handles network errors gracefully
- ✅ Always clears local state on logout
- ✅ Cart merge works reliably

✅ Deliverable
==============

**Created file:**
```
src/lib/api/auth.ts
```

**Exports:**
```typescript
export const authApi;         // Object with all functions
export const login;           // Individual function
export const register;        // Individual function
export const logout;          // Individual function
export const getAuthHeaders;  // Helper function
```

**Integration:**
- Works with auth store (Task 1.2)
- Uses API client (Task 1.1)
- Used by auth hooks (Task 1.4)
- Used by login/register pages (Tasks 2.1, 2.2)
- Provides headers for cart/checkout (Tasks 4.x, 5.x)

📊 Acceptance Criteria
======================

**File Creation:**
- [ ] `src/lib/api/auth.ts` created
- [ ] All functions implemented
- [ ] All exports present
- [ ] No TypeScript errors

**Functionality:**
- [ ] login() works with valid credentials
- [ ] login() throws on invalid credentials
- [ ] register() creates account and auto-logs in
- [ ] register() throws on duplicate email
- [ ] logout() clears token/user
- [ ] logout() preserves sessionId
- [ ] getAuthHeaders() returns correct headers

**Testing:**
- [ ] All 8 test scenarios pass
- [ ] Manual browser testing complete
- [ ] Network tab shows correct requests
- [ ] Auth store updates correctly

**Integration:**
- [ ] Works with Task 1.1 (API client)
- [ ] Works with Task 1.2 (Auth store)
- [ ] Ready for Task 1.4 (Auth hooks)
- [ ] Ready for Tasks 2.1, 2.2 (Login/Register pages)

**Quality:**
- [ ] No console errors
- [ ] Proper error messages shown
- [ ] SessionId preserved throughout
- [ ] Cart merge works

⏱️ Estimated Duration
=====================
30-35 minutes

🔗 Dependencies
===============

**Requires (must be complete first):**
- Task 1.1 - Setup API Client (needs apiClient)
- Task 1.2 - Setup Auth Store (needs useAuthStore)
- Task 1.3.1 - Update API Client for Dual Auth (needs interceptors)

**Blocks (waiting on this task):**
- Task 1.4 - Create Auth Hooks (needs login/register/logout)
- Task 2.1 - Create Login Page (needs login function)
- Task 2.2 - Create Register Page (needs register function)
- Task 4.x - Cart Module (needs getAuthHeaders)

📝 Notes
========

**Critical:**
- NEVER call `clearAll()` - use `logout()` to preserve sessionId
- SessionId is the key to cart merge functionality
- Backend must support cart merge via sessionId header
- Always keep sessionId intact during login/logout

**Common Mistakes:**
- ❌ Clearing sessionId on logout (breaks cart!)
- ❌ Not storing token after login (user not authenticated)
- ❌ Calling clearAll() instead of logout()
- ❌ Forgetting to return AuthResponse

**Cart Merge Important:**
- Anonymous cart stored with sessionId on backend
- Login/register includes sessionId in headers (automatic)
- Backend finds cart by sessionId and merges to user account
- User keeps all items added while anonymous
- SessionId continues to exist after login for continuity

**Error Handling:**
- Let error interceptor handle formatting
- Just re-throw errors to caller
- Caller (components/hooks) shows toast/message
- Don't duplicate error handling logic

**Testing Tips:**
- Test in incognito for fresh sessionId
- Add items to cart before login
- Verify cart persists after login
- Test logout and verify cart still accessible
- Use Network tab to verify headers
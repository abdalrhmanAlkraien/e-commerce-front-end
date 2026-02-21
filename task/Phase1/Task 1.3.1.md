📄 Task 1.3.1 — Update API Client for Dual Authentication
============================================================

🎯 Objective
------------

Update the existing API client to support **dual authentication** system:
- Automatic JWT token injection for authenticated users
- Automatic sessionId injection for anonymous users
- Proper 401 error handling (logout but preserve sessionId)
- Handle unwrapped response format from backend

📂 File Locations
=================
```
src/lib/api/client.ts (modify - update interceptors)
```

1️⃣ Import Dependencies
=======================

Required Imports
----------------

Add to top of `client.ts`:

```typescript
import { useAuthStore } from '@/lib/store/auth';
```

**Note:** This assumes Task 1.2 (Auth Store) is complete.

2️⃣ Request Interceptor Updates
===============================

Authentication Header Injection
--------------------------------

**Update existing request interceptor** to automatically add correct auth headers:

**Logic:**
1. Get current auth state using `useAuthStore.getState()`
2. Extract `token` and `sessionId` from state
3. Apply header priority:
   - If `token` exists → Add `Authorization: Bearer {token}`
   - Else if `sessionId` exists → Add `X-SESSION-ID: {sessionId}`
   - Else → No auth headers

**Implementation:**
```typescript
apiClient.interceptors.request.use(
  (config) => {
    const { token, sessionId } = useAuthStore.getState();
    
    if (token) {
      // Authenticated user - JWT takes priority
      config.headers.Authorization = `Bearer ${token}`;
    } else if (sessionId) {
      // Anonymous user - use session ID
      config.headers['X-SESSION-ID'] = sessionId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Rules:**
- Token ALWAYS takes precedence over sessionId
- Both headers should NEVER be sent together
- If neither exists, no auth headers are added
- This runs automatically for ALL requests

Development Logging (Optional)
-------------------------------

```typescript
if (process.env.NODE_ENV === 'development') {
  const authType = token ? 'JWT' : sessionId ? 'SessionID' : 'None';
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} (Auth: ${authType})`);
}
```

**Rules:**
- Log ONLY in development mode
- Never log actual token/sessionId values (security)
- Keep logging minimal and useful

3️⃣ Response Interceptor Updates
=================================

Success Response Handling
--------------------------

**CRITICAL:** Backend returns data **directly** without wrapper.

**NO changes needed for success responses** - they already work correctly:

```typescript
// ✅ Correct - backend returns data directly
const products = response.data; // This is already the array

// ❌ Wrong - don't unwrap twice
const products = response.data.data; // This would be undefined
```

**Response formats:**
- Single item: `response.data = ItemObject`
- Array: `response.data = ItemObject[]`
- Paginated: `response.data = { content: [], totalElements: 10, ... }`

401 Error Handling
------------------

**Update existing error handler** to handle 401 (Unauthorized):

**Requirements:**
1. Clear token from auth store (user logged out)
2. **Keep sessionId intact** (critical for cart continuity)
3. Redirect to `/login` page
4. Show optional message: "Session expired, please log in"

**Implementation:**
```typescript
apiClient.interceptors.response.use(
  (response) => {
    // Success - data already unwrapped, return as-is
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Get auth store
      const authStore = useAuthStore.getState();
      
      // Clear ONLY token (logout), keep sessionId
      authStore.logout(); // This keeps sessionId intact
      
      // Optional: Show toast notification
      // toast.error('Session expired. Please log in again.');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Return error for other status codes
    return Promise.reject(error);
  }
);
```

**Critical Rules:**
- Use `authStore.logout()` NOT `authStore.clearAll()`
- `logout()` keeps sessionId, `clearAll()` removes it
- Only redirect on client-side (check `typeof window !== 'undefined'`)
- Do NOT attempt token refresh in this task (handled in Task 1.1)

Other Error Codes
-----------------

**Existing error handlers should remain:**
- 400 Bad Request → Extract validation errors
- 403 Forbidden → Show permission error
- 404 Not Found → Pass through to calling code
- 500+ Server Error → Show generic error

**No changes needed** for these (already implemented in Task 1.1).

4️⃣ Helper Function
===================

isAuthenticated()
-----------------

**Add new exported helper function:**

```typescript
/**
 * Check if user is currently authenticated (has valid token)
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = useAuthStore.getState().token;
  return !!token;
};
```

**Purpose:**
- Quick auth check outside React components
- Used in:
   - Middleware/guards
   - Conditional rendering
   - Route protection

**Usage Examples:**
```typescript
// In middleware
if (!isAuthenticated()) {
  redirect('/login');
}

// In component (use hook instead when possible)
if (isAuthenticated()) {
  // Show admin panel
}
```

**Note:** In React components, prefer using the hook:
```typescript
// ✅ Better in components
const token = useAuthStore((state) => state.token);
const isAuth = !!token;

// ⚠️ Works but not reactive
const isAuth = isAuthenticated();
```

5️⃣ Response Format Documentation
==================================

Add Comment Block
-----------------

Add this comment near the response interceptor:

```typescript
/**
 * IMPORTANT: Response Format
 * 
 * Backend returns data DIRECTLY (no StandardApiResponse wrapper)
 * 
 * ✅ Correct usage:
 *   const product = response.data;           // Single item
 *   const products = response.data;          // Array
 *   const page = response.data;              // Paginated (Page<T>)
 * 
 * ❌ Wrong usage:
 *   const product = response.data.data;      // Undefined!
 * 
 * Response formats:
 *   - Single item:  response.data = ProductResponse
 *   - Array:        response.data = ProductResponse[]
 *   - Paginated:    response.data = Page<ProductResponse>
 *   - Error:        response.data = { message, timestamp, errors? }
 */
```

Type Examples
-------------

```typescript
// Single item
const response = await apiClient.get<ProductResponse>('/products/123');
const product = response.data; // ProductResponse

// Array
const response = await apiClient.get<ProductResponse[]>('/products');
const products = response.data; // ProductResponse[]

// Paginated
const response = await apiClient.get<Page<ProductResponse>>('/products?page=0');
const page = response.data; // Page<ProductResponse>
const items = page.content; // ProductResponse[]
```

6️⃣ Code Example
================

Complete Updated Interceptors
------------------------------

```typescript
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// REQUEST INTERCEPTOR - Dual Auth Headers
// ========================================
apiClient.interceptors.request.use(
  (config) => {
    const { token, sessionId } = useAuthStore.getState();
    
    if (token) {
      // Authenticated user - JWT takes priority
      config.headers.Authorization = `Bearer ${token}`;
    } else if (sessionId) {
      // Anonymous user - use session ID
      config.headers['X-SESSION-ID'] = sessionId;
    }
    
    // Optional development logging
    if (process.env.NODE_ENV === 'development') {
      const authType = token ? 'JWT' : sessionId ? 'SessionID' : 'None';
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url} (${authType})`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================
// RESPONSE INTERCEPTOR - 401 Handling
// ========================================
apiClient.interceptors.response.use(
  (response) => {
    // Success - data already unwrapped
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      
      // Logout (clears token, keeps sessionId)
      authStore.logout();
      
      // Redirect to login (client-side only)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Pass through other errors
    return Promise.reject(error);
  }
);

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = useAuthStore.getState().token;
  return !!token;
};

export { apiClient };
```

🧪 Test Scenarios
=================

### Scenario 1: Authenticated User Request
**Action:**
1. Login user (get token)
2. Make API request:
```typescript
const response = await apiClient.get('/orders');
```

**Expected Result:**
- Request includes header: `Authorization: Bearer {token}`
- No `X-SESSION-ID` header present
- Backend recognizes authenticated user
- Returns user's orders

**Validation:**
```typescript
// Check request headers (in browser Network tab)
// Should see: Authorization: Bearer eyJ...
// Should NOT see: X-SESSION-ID
```

### Scenario 2: Anonymous User Request
**Action:**
1. No login (no token)
2. Ensure sessionId exists
3. Make API request:
```typescript
const response = await apiClient.post('/cart/items', { productId: '123' });
```

**Expected Result:**
- Request includes header: `X-SESSION-ID: {sessionId}`
- No `Authorization` header present
- Backend associates cart with sessionId
- Item added to anonymous cart

**Validation:**
```typescript
const { token, sessionId } = useAuthStore.getState();
expect(token).toBeNull();
expect(sessionId).toBeTruthy();
// Check Network tab: X-SESSION-ID: {uuid}
```

### Scenario 3: 401 Response - Token Expired
**Action:**
1. Login user (get token)
2. Wait for token to expire (or force 401)
3. Make API request that returns 401

**Expected Result:**
- 401 triggers error interceptor
- `authStore.logout()` called
- Token cleared from store
- **SessionId preserved**
- Redirected to `/login`
- User sees login page

**Validation:**
```typescript
const sessionIdBefore = useAuthStore.getState().sessionId;
// ... 401 occurs
const { token, sessionId } = useAuthStore.getState();
expect(token).toBeNull(); // Token cleared
expect(sessionId).toBe(sessionIdBefore); // SessionId unchanged
expect(window.location.href).toContain('/login');
```

### Scenario 4: isAuthenticated() Helper
**Action:**
```typescript
// Before login
const beforeLogin = isAuthenticated();

// After login
useAuthStore.getState().setUser(user, token);
const afterLogin = isAuthenticated();

// After logout
useAuthStore.getState().logout();
const afterLogout = isAuthenticated();
```

**Expected Result:**
- `beforeLogin = false`
- `afterLogin = true`
- `afterLogout = false`

**Validation:**
```typescript
expect(beforeLogin).toBe(false);
expect(afterLogin).toBe(true);
expect(afterLogout).toBe(false);
```

### Scenario 5: Response Data Access (No Wrapper)
**Action:**
```typescript
// Get single product
const response = await apiClient.get<ProductResponse>('/products/123');
const product = response.data;

// Get product list
const response2 = await apiClient.get<ProductResponse[]>('/products');
const products = response2.data;

// Get paginated products
const response3 = await apiClient.get<Page<ProductResponse>>('/products?page=0');
const page = response3.data;
```

**Expected Result:**
- `product` is ProductResponse object (not undefined)
- `products` is array (not wrapped object)
- `page` is Page object with content array

**Validation:**
```typescript
expect(product.id).toBeTruthy(); // Direct access
expect(Array.isArray(products)).toBe(true);
expect(page.content).toBeTruthy();
expect(page.totalElements).toBeGreaterThan(0);
```

### Scenario 6: Header Priority (Token Over SessionId)
**Action:**
1. Login user (has token)
2. Ensure sessionId also exists
3. Make API request

**Expected Result:**
- Only `Authorization: Bearer {token}` header sent
- `X-SESSION-ID` header NOT sent
- Backend uses token for authentication

**Validation:**
```typescript
const { token, sessionId } = useAuthStore.getState();
expect(token).toBeTruthy();
expect(sessionId).toBeTruthy();
// Check Network tab: Should only see Authorization header
```

### Scenario 7: No Auth Headers (Fresh User)
**Action:**
1. Fresh browser (no token, no sessionId yet)
2. Make public API request:
```typescript
const response = await apiClient.get('/products');
```

**Expected Result:**
- No `Authorization` header
- No `X-SESSION-ID` header (sessionId not yet initialized)
- Public endpoint still works

**Validation:**
```typescript
const { token, sessionId } = useAuthStore.getState();
expect(token).toBeNull();
expect(sessionId).toBeNull();
// Request succeeds anyway (public endpoint)
```

### Scenario 8: Logout Preserves SessionId
**Action:**
1. User is logged in with token
2. User has sessionId from anonymous browsing
3. Click logout

**Expected Result:**
- Token removed
- SessionId preserved
- Can still add to cart (anonymous)
- Previous anonymous cart accessible

**Validation:**
```typescript
const sessionIdBeforeLogout = useAuthStore.getState().sessionId;
useAuthStore.getState().logout();
const sessionIdAfterLogout = useAuthStore.getState().sessionId;
expect(sessionIdAfterLogout).toBe(sessionIdBeforeLogout);
```

🔒 Non-Functional Requirements
===============================

**Code Quality:**
- ✅ No breaking changes to existing code
- ✅ Backward compatible with Task 1.1
- ✅ Clean, readable interceptor code
- ✅ Proper TypeScript types

**Security:**
- ✅ Never log actual token/sessionId values
- ✅ Token takes priority over sessionId
- ✅ SessionId preserved on logout (cart continuity)
- ✅ Client-side only window access check

**Performance:**
- ✅ Minimal overhead (just header addition)
- ✅ No unnecessary store reads
- ✅ Efficient error handling

**Reliability:**
- ✅ Handles missing token/sessionId gracefully
- ✅ No errors if store not initialized
- ✅ SSR-safe (window check)

✅ Deliverable
==============

**Updated file:**
```
src/lib/api/client.ts (modified)
```

**New exports:**
```typescript
export const isAuthenticated; // Helper function
```

**Existing exports (unchanged):**
```typescript
export const apiClient;       // Axios instance
export const getErrorMessage; // Error helper (from Task 1.1)
```

**Integration:**
- Request interceptor adds correct auth headers automatically
- Response interceptor handles 401 properly (logout + redirect)
- Auth store integration complete
- Ready for all API modules to use

📊 Acceptance Criteria
======================

**Functionality:**
- [ ] Request interceptor adds Authorization header when token exists
- [ ] Request interceptor adds X-SESSION-ID header when only sessionId exists
- [ ] Token takes priority over sessionId
- [ ] 401 response clears token via `logout()`
- [ ] 401 response preserves sessionId
- [ ] 401 response redirects to /login
- [ ] isAuthenticated() helper works correctly

**Code Quality:**
- [ ] No TypeScript errors
- [ ] No breaking changes to existing code
- [ ] Works with Task 1.1 (API client base)
- [ ] Works with Task 1.2 (Auth store)

**Testing:**
- [ ] All 8 test scenarios pass
- [ ] Manual browser testing complete
- [ ] Network tab shows correct headers
- [ ] No console errors

**Documentation:**
- [ ] Response format comment added
- [ ] Code is well-commented
- [ ] Clear explanation of header priority

⏱️ Estimated Duration
=====================
20-25 minutes

🔗 Dependencies
===============

**Requires (must be complete first):**
- Task 1.1 - Setup API Client (needs base interceptors)
- Task 1.2 - Setup Auth Store (needs useAuthStore)

**Blocks (waiting on this task):**
- Task 1.3 - Create Auth API Module (needs dual auth headers)
- Task 4.1 - Create Cart API Module (needs sessionId support)
- All API modules that use authentication

📝 Notes
========

**Critical:**
- Use `logout()` NOT `clearAll()` on 401 (preserves sessionId)
- Token ALWAYS takes priority over sessionId
- Backend returns data directly (no wrapper to unwrap)
- Check `typeof window !== 'undefined'` before redirecting

**Common Mistakes:**
- ❌ Calling `clearAll()` on 401 (loses cart!)
- ❌ Trying to unwrap `response.data.data` (undefined!)
- ❌ Sending both headers (only send one)
- ❌ Redirecting on server-side (causes errors)

**Integration Notes:**
- This completes the auth infrastructure (Tasks 1.1 + 1.2 + 1.3.1)
- After this, all API modules can use automatic auth
- Cart operations will automatically use sessionId
- Login merges anonymous cart using sessionId

**Testing Tips:**
- Use browser Network tab to verify headers
- Test in incognito for fresh sessionId generation
- Use Redux DevTools to watch auth store state
- Test both anonymous and authenticated flows

**Backend Coordination:**
- Backend must support both auth methods
- Backend merges carts on login using sessionId
- Backend returns 401 when token expires
- Backend returns data directly (no wrapper)
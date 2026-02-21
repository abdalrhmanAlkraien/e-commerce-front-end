📄 Task 1.1 — API Client Setup (Axios)
=======================================

🎯 Objective
------------
Create a production-ready API client using **Axios** with:
- Automatic authentication header injection
- Token refresh on 401 errors
- Comprehensive error handling
- Full TypeScript support
- Request/response interceptors

📂 File Location
================
```
src/lib/api/client.ts
```

1️⃣ Axios Instance Configuration
================================

Base Configuration
------------------
```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Requirements:**
- baseURL from environment variable `NEXT_PUBLIC_API_URL`
- Default timeout: 15 seconds (15000ms)
- Default Content-Type: application/json
- DO NOT set `withCredentials: true` (backend doesn't use cookies)

2️⃣ Request Interceptor
=======================

Authentication Header Injection
--------------------------------
**Logic:**
1. Get auth state from `useAuthStore.getState()`
2. If `token` exists (authenticated user):
   - Add header: `Authorization: Bearer ${token}`
3. Else if `sessionId` exists (anonymous user):
   - Add header: `X-SESSION-ID: ${sessionId}`
4. Return modified config

**Example:**
```typescript
apiClient.interceptors.request.use(
  (config) => {
    const { token, sessionId } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (sessionId) {
      config.headers['X-SESSION-ID'] = sessionId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

Development Logging
-------------------
- Log requests ONLY in development mode
- Use: `if (process.env.NODE_ENV === 'development')`
- Log: method, URL, headers (redact sensitive data)

3️⃣ Response Interceptor
========================

Success Response Handling
--------------------------
**IMPORTANT:** Backend returns data **directly** (no wrapper)

```typescript
// ✅ Correct - data is already unwrapped
const product = response.data;

// ❌ Wrong - no StandardApiResponse wrapper
const product = response.data.data; // DON'T DO THIS
```

**Response format:**
- Single item: `response.data = Item`
- Array: `response.data = Item[]`
- Paginated: `response.data = Page<Item>`

Error Response Handling
-----------------------

### 400 Bad Request
- Extract validation errors from response
- Format for display to user
- Return structured error object

### 401 Unauthorized
**Critical Logic:**
1. Attempt token refresh (ONE TIME ONLY)
2. If refresh succeeds:
   - Update token in auth store
   - Retry original request with new token
3. If refresh fails:
   - Clear token from auth store
   - Keep sessionId (user becomes anonymous)
   - Redirect to `/login`
   - Show message: "Session expired, please log in"

**Prevent Multiple Refresh Calls:**
- Queue pending requests during refresh
- Use flag: `isRefreshing`
- Process queue after refresh completes

### 403 Forbidden
- Show error: "You don't have permission to access this resource"
- Do NOT logout user
- Do NOT redirect

### 404 Not Found
- Return error message
- Let calling code handle display

### 500+ Server Errors
- Show generic error: "Server error, please try again"
- Log error for debugging (development only)

4️⃣ Token Refresh Logic
=======================

Requirements
------------
**Endpoint:** `POST /api/v1/auth/refresh`
**Request Body:**
```typescript
{
  refreshToken: string // From auth store
}
```

**Response:**
```typescript
{
  accessToken: string,
  refreshToken: string,
  user: UserDto
}
```

Implementation Rules
--------------------
1. **Prevent concurrent refresh calls:**
   - Use `isRefreshing` flag
   - Queue requests while refreshing
   - Process queue after refresh completes

2. **Store new tokens:**
   - Update `token` in auth store
   - Update `refreshToken` in auth store
   - Update `user` if returned

3. **Handle refresh failure:**
   - If 401 on refresh → full logout
   - Clear all auth data
   - Redirect to login

**Example Structure:**
```typescript
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }
  
  isRefreshing = true;
  
  try {
    const { refreshToken } = useAuthStore.getState();
    const response = await axios.post('/auth/refresh', { refreshToken });
    
    // Update store
    useAuthStore.getState().setUser(response.data.user, response.data.accessToken);
    
    // Process queue
    failedQueue.forEach(({ resolve }) => resolve());
    failedQueue = [];
    
    return response.data.accessToken;
  } catch (error) {
    // Clear auth and redirect
    useAuthStore.getState().logout();
    failedQueue.forEach(({ reject }) => reject(error));
    failedQueue = [];
    
    window.location.href = '/login';
    throw error;
  } finally {
    isRefreshing = false;
  }
}
```

5️⃣ Helper Functions
====================

### getErrorMessage(error: unknown): string

**Purpose:** Extract user-friendly error message from any error type

**Logic:**
```typescript
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // API error response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Network error
    if (error.message) {
      return error.message;
    }
  }
  
  // Generic error
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
```

**Return examples:**
- API validation: "Email is already registered"
- Network error: "Network Error"
- Generic: "An unexpected error occurred"

6️⃣ Type Safety
===============

Import Shared Types
-------------------
**DO NOT redefine:**
- `Page<T>` - Pagination wrapper
- Response DTOs (Product, User, etc.)

**Import from:**
```typescript
import type { Page } from '@/types';
import type { ProductResponse } from '@/types';
```

Generic Support
---------------
**All methods must support generics:**

```typescript
// ✅ Correct - typed response
const response = await apiClient.get<ProductResponse>('/products/123');
// response.data is ProductResponse

const response = await apiClient.get<Page<ProductResponse>>('/products');
// response.data is Page<ProductResponse>
```

7️⃣ Exports
===========

**Must export:**
```typescript
export const apiClient; // Axios instance
export const getErrorMessage; // Error helper
```

**Optional typed helpers:**
```typescript
export const api = {
  get: <T>(url: string, config?) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?, config?) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?, config?) => apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?) => apiClient.delete<T>(url, config),
};
```

🧪 Test Scenarios
=================

### Scenario 1: Public API Call (No Auth)
**Action:**
```typescript
const response = await apiClient.get('/products');
```
**Expected:**
- No Authorization header
- No X-SESSION-ID header (if no sessionId exists)
- Returns product data directly

### Scenario 2: Authenticated API Call
**Action:**
1. Login (get token)
2. Make API call
```typescript
const response = await apiClient.get('/orders');
```
**Expected:**
- Header: `Authorization: Bearer {token}`
- No X-SESSION-ID header
- Returns order data

### Scenario 3: Anonymous User with SessionId
**Action:**
1. Generate sessionId (no login)
2. Make API call
```typescript
const response = await apiClient.post('/cart/items', { productId: '123' });
```
**Expected:**
- Header: `X-SESSION-ID: {sessionId}`
- No Authorization header
- Cart item added

### Scenario 4: Token Refresh on 401
**Action:**
1. Login (get token)
2. Wait for token expiry
3. Make API call that returns 401
   **Expected:**
- Automatic refresh token call
- Original request retried with new token
- Succeeds without user intervention

### Scenario 5: Refresh Fails (Full Logout)
**Action:**
1. Login
2. Invalidate refresh token on backend
3. Make API call that triggers refresh
   **Expected:**
- Refresh fails with 401
- User logged out completely
- Redirected to /login
- SessionId remains (if existed)

### Scenario 6: Multiple 401s (Queue Test)
**Action:**
1. Make 3 simultaneous API calls
2. All return 401
   **Expected:**
- Only ONE refresh token call
- All 3 requests queued
- After refresh, all 3 retry
- All 3 succeed

### Scenario 7: Validation Error (400)
**Action:**
```typescript
await apiClient.post('/auth/register', {
  email: 'invalid-email',
  password: '123'
});
```
**Expected:**
- Error caught
- `getErrorMessage()` extracts: "Invalid email format"
- User sees friendly error

### Scenario 8: Network Error
**Action:**
- Disconnect internet
- Make API call
  **Expected:**
- Error caught
- `getErrorMessage()` returns: "Network Error"

🔒 Non-Functional Requirements
===============================
- ✅ Fully typed (no `any` types)
- ✅ Production-ready error handling
- ✅ No memory leaks (clean up interceptors if needed)
- ✅ No infinite refresh loops
- ✅ Secure token storage (via auth store, not in API client)
- ✅ Development logging only (not in production)

✅ Deliverable
==============
Export from `src/lib/api/client.ts`:
```typescript
export const apiClient; // Configured axios instance
export const getErrorMessage; // Error message extractor
```

Integration with auth store for:
- Token injection
- SessionId injection
- Token refresh
- Logout on auth failure

📊 Acceptance Criteria
======================
- [ ] API client created at `src/lib/api/client.ts`
- [ ] Request interceptor adds correct auth headers
- [ ] Response interceptor handles all error codes
- [ ] Token refresh works (with queue prevention)
- [ ] All 8 test scenarios pass
- [ ] No TypeScript errors
- [ ] No console errors in production
- [ ] Error messages are user-friendly
- [ ] Fully typed with generics support

⏱️ Estimated Duration
=====================
30-35 minutes

🔗 Dependencies
===============
**Requires:**
- Task 0.2 (Project structure)
- Task 0.3 (Environment variables)
- Task 0.4 (TypeScript types)

**Blocks:**
- Task 1.2 (Auth store - needs apiClient)
- Task 1.3 (Auth API - uses apiClient)
- All future API modules

📝 Notes
========
**Critical:**
- Backend returns data directly (NO wrapper)
- Access as: `response.data` not `response.data.data`
- Token takes precedence over sessionId
- SessionId persists after logout

**Security:**
- Never log tokens/passwords
- Use environment variables for API URL
- Implement request timeout to prevent hanging

**Testing:**
- Test refresh logic thoroughly
- Test queue mechanism with concurrent requests
- Verify sessionId continuity after logout
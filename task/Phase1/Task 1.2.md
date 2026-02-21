📄 Task 1.2 — Authentication Store (Zustand)
============================================

🎯 Objective
------------

Create a production-ready authentication store using **Zustand** that supports:
- Anonymous users (session-based browsing)
- Authenticated users (JWT-based authentication)
- Cart continuity between anonymous and authenticated sessions
- Strongly typed roles (ADMIN, CUSTOMER)
- Safe persistence with hydration handling

📂 File Locations
=================
```
src/lib/store/auth.ts (create)
```

1️⃣ Type Definitions
====================

UserRole
--------

```typescript
export type UserRole = 'ADMIN' | 'CUSTOMER';
```

**Requirements:**
- Must be a union type (NOT enum)
- Only two roles supported
- Used in User type

User Interface
--------------

```typescript
interface User {
  id: string; // UUID
  email: string;
  name: string;
  roles: UserRole[];
  createdAt: string; // ISO-8601
}
```

**Import from types:**
```typescript
import type { User } from '@/types';
```

AuthState Interface
-------------------

```typescript
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  
  // Actions
  setUser: (user: User | null, token: string | null) => void;
  setSessionId: (sessionId: string) => void;
  logout: () => void;
  clearAll: () => void;
  setHydrated: (value: boolean) => void;
}
```

2️⃣ Functional Requirements
===========================

Anonymous User Behavior
------------------------

**On First Application Load:**
1. Check if `sessionId` exists in persisted storage
2. If NOT exist:
    - Generate new UUID v4 using `crypto.randomUUID()`
    - Store in state
    - Persist to localStorage
3. If exists:
    - Load from storage
    - Use existing sessionId

**SessionId Rules:**
- Must persist after logout (user remains anonymous)
- Used for anonymous cart operations
- Sent in `X-SESSION-ID` header when no JWT token exists
- Never cleared unless `clearAll()` is called

Authenticated User Behavior
----------------------------

**When User Logs In:**
1. Store `user` object in state
2. Store `token` (JWT) in state
3. **KEEP existing sessionId** (do not regenerate)
4. Set `isAuthenticated = true`
5. Persist `token` to localStorage

**Token Priority:**
- Token takes precedence over sessionId for API requests
- If both exist, API client uses token
- Backend merges anonymous cart when login occurs

**After Logout:**
- Clear `user` and `token`
- Keep `sessionId` intact
- User continues as anonymous with same sessionId

3️⃣ Store Actions
=================

setUser(user, token)
--------------------

**Parameters:**
- `user: User | null` - User object from backend
- `token: string | null` - JWT access token

**Logic:**
```typescript
setUser: (user, token) => {
  set({
    user,
    token,
    isAuthenticated: !!token,
  });
}
```

**Rules:**
- If token exists → set `isAuthenticated = true`
- If token is null → set `isAuthenticated = false`
- Do NOT modify sessionId

setSessionId(sessionId)
-----------------------

**Parameters:**
- `sessionId: string` - UUID v4

**Logic:**
```typescript
setSessionId: (sessionId) => {
  set({ sessionId });
}
```

**Rules:**
- Only called during initialization
- Should not be called manually after app start

logout()
--------

**Logic:**
```typescript
logout: () => {
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    // sessionId stays intact
  });
}
```

**Rules:**
- Clear user
- Clear token
- Set isAuthenticated = false
- **DO NOT clear sessionId** (critical for cart continuity)

clearAll()
----------

**Logic:**
```typescript
clearAll: () => {
  set({
    user: null,
    token: null,
    sessionId: null,
    isAuthenticated: false,
  });
}
```

**Use Cases:**
- Hard reset (security cleanup)
- User explicitly requests data clearing
- Testing/debugging

**Warning:**
- This clears everything including sessionId
- Anonymous cart will be lost
- Should be used sparingly

setHydrated(value)
------------------

**Parameters:**
- `value: boolean` - Hydration state

**Logic:**
```typescript
setHydrated: (value) => {
  set({ isHydrated: value });
}
```

**Purpose:**
- Prevents UI rendering before auth state restoration
- Avoids auth flicker
- Prevents redirect loops

4️⃣ Persistence Configuration
=============================

Zustand Persist Middleware
---------------------------

**Configuration:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ... state and actions
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

Persist ONLY
------------
- ✅ `token` - JWT access token
- ✅ `sessionId` - Anonymous user identifier

DO NOT Persist
--------------
- ❌ `user` object - Avoid stale sensitive data
- ❌ `isAuthenticated` - Derived from token
- ❌ `isHydrated` - Runtime state

Storage Configuration
---------------------
- **Storage key:** `'auth-storage'`
- **Storage:** `localStorage`
- **Hydration callback:** Set `isHydrated = true` after restoration

5️⃣ Helper Functions (Must Be Exported)
========================================

getToken()
----------

**Signature:**
```typescript
export const getToken = (): string | null => {
  return useAuthStore.getState().token;
}
```

**Purpose:**
- Access token outside React components
- Used in API client interceptors

getSessionId()
--------------

**Signature:**
```typescript
export const getSessionId = (): string | null => {
  return useAuthStore.getState().sessionId;
}
```

**Purpose:**
- Access sessionId outside React components
- Used in API client interceptors

getAuthHeaders()
----------------

**Signature:**
```typescript
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const sessionId = getSessionId();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else if (sessionId) {
    return { 'X-SESSION-ID': sessionId };
  }
  
  return {};
}
```

**Logic:**
1. If token exists → return `{ Authorization: 'Bearer {token}' }`
2. Else if sessionId exists → return `{ 'X-SESSION-ID': '{sessionId}' }`
3. Else → return empty object

**Usage:**
```typescript
// In API client
const headers = getAuthHeaders();
```

generateSessionId()
-------------------

**Signature:**
```typescript
export const generateSessionId = (): string => {
  return crypto.randomUUID();
}
```

**Requirements:**
- Must use `crypto.randomUUID()` (browser native)
- No custom UUID generators
- Returns UUID v4 format

initializeSession()
-------------------

**Signature:**
```typescript
export const initializeSession = (): void => {
  const { sessionId, setSessionId } = useAuthStore.getState();
  
  if (!sessionId) {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }
}
```

**Purpose:**
- Initialize sessionId on app bootstrap
- Should run once in root layout/provider

**Usage:**
```typescript
// In app/layout.tsx
useEffect(() => {
  initializeSession();
}, []);
```

6️⃣ Hydration Handling
======================

**Purpose:**
- Prevent redirect loops during SSR/hydration
- Avoid auth flicker (user sees logged out then logged in)
- Handle race conditions between storage restoration and component rendering

**Implementation:**
```typescript
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  
  if (!isHydrated) {
    return <LoadingScreen />; // or null
  }
  
  return <>{children}</>;
};
```

**Rules:**
- Use `isHydrated` flag to wait for restoration
- Don't render protected routes until hydrated
- Don't check auth status until hydrated
- Set to `true` in `onRehydrateStorage` callback

7️⃣ Role Handling
=================

Supported Roles
---------------
- `ADMIN` - Administrative access
- `CUSTOMER` - Regular user access

Type Safety
-----------
**Correct:**
```typescript
type UserRole = 'ADMIN' | 'CUSTOMER'; // ✅ Union type
user.roles.includes('ADMIN'); // ✅ Type-safe
```

**Incorrect:**
```typescript
enum UserRole { ADMIN, CUSTOMER } // ❌ Don't use enum
roles: string[] // ❌ Not type-safe
```

Role Checking
-------------
**Example:**
```typescript
const isAdmin = (user: User | null): boolean => {
  return user?.roles.includes('ADMIN') ?? false;
}

const isCustomer = (user: User | null): boolean => {
  return user?.roles.includes('CUSTOMER') ?? false;
}
```

8️⃣ API Integration Rules
=========================

Header Priority
---------------
1. **If token exists** → Send `Authorization: Bearer {token}`
2. **Else if sessionId exists** → Send `X-SESSION-ID: {sessionId}`
3. **Else** → No auth headers

Integration with API Client
----------------------------
**In `src/lib/api/client.ts`:**
```typescript
import { getAuthHeaders } from '@/lib/store/auth';

apiClient.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders();
  config.headers = {
    ...config.headers,
    ...authHeaders,
  };
  return config;
});
```

Backend Behavior
----------------
- Token takes precedence over sessionId
- SessionId only used for anonymous operations
- Backend merges anonymous cart on login (using sessionId)

9️⃣ Code Example
================

**Complete Store Implementation:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

export type UserRole = 'ADMIN' | 'CUSTOMER';

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User | null, token: string | null) => void;
  setSessionId: (sessionId: string) => void;
  logout: () => void;
  clearAll: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      sessionId: null,
      isAuthenticated: false,
      isHydrated: false,
      
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: !!token,
        });
      },
      
      setSessionId: (sessionId) => {
        set({ sessionId });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      clearAll: () => {
        set({
          user: null,
          token: null,
          sessionId: null,
          isAuthenticated: false,
        });
      },
      
      setHydrated: (value) => {
        set({ isHydrated: value });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Helper functions
export const getToken = () => useAuthStore.getState().token;
export const getSessionId = () => useAuthStore.getState().sessionId;
export const getAuthHeaders = () => {
  const token = getToken();
  const sessionId = getSessionId();
  if (token) return { Authorization: `Bearer ${token}` };
  if (sessionId) return { 'X-SESSION-ID': sessionId };
  return {};
};
export const generateSessionId = () => crypto.randomUUID();
export const initializeSession = () => {
  const { sessionId, setSessionId } = useAuthStore.getState();
  if (!sessionId) setSessionId(generateSessionId());
};
```

🧪 Test Scenarios
=================

### Scenario 1: Fresh User (First Visit)
**Action:**
1. User visits app for first time
2. No localStorage data exists

**Expected Result:**
- sessionId auto-generated (UUID v4)
- sessionId persisted to localStorage
- token = null
- user = null
- isAuthenticated = false
- isHydrated = true (after restoration)

**Validation:**
```typescript
const { sessionId, token, isAuthenticated } = useAuthStore.getState();
expect(sessionId).toBeTruthy();
expect(token).toBeNull();
expect(isAuthenticated).toBe(false);
```

### Scenario 2: Login Flow
**Action:**
1. User has sessionId (anonymous)
2. User logs in with email/password
3. Backend returns user + token

**Expected Result:**
- user stored in state
- token stored in state
- isAuthenticated = true
- **sessionId unchanged** (same as before login)
- Both token and sessionId persisted

**Validation:**
```typescript
const oldSessionId = getSessionId();
// ... login happens
const newSessionId = getSessionId();
expect(newSessionId).toBe(oldSessionId); // Must be same
expect(getToken()).toBeTruthy();
```

### Scenario 3: Page Reload (Hydration)
**Action:**
1. User is logged in
2. Refresh page
3. App reloads

**Expected Result:**
- token restored from localStorage
- sessionId restored from localStorage
- user = null initially (not persisted)
- isAuthenticated = true (derived from token)
- isHydrated = true after restoration

**Validation:**
```typescript
// After page reload
const { token, sessionId, isHydrated } = useAuthStore.getState();
expect(token).toBeTruthy();
expect(sessionId).toBeTruthy();
expect(isHydrated).toBe(true);
```

### Scenario 4: Logout
**Action:**
1. User is logged in
2. User clicks logout

**Expected Result:**
- user = null
- token = null
- isAuthenticated = false
- **sessionId remains** (not cleared)
- User can continue browsing as anonymous

**Validation:**
```typescript
const sessionIdBeforeLogout = getSessionId();
logout();
const sessionIdAfterLogout = getSessionId();
expect(sessionIdAfterLogout).toBe(sessionIdBeforeLogout);
expect(getToken()).toBeNull();
```

### Scenario 5: clearAll() - Hard Reset
**Action:**
1. User is logged in with sessionId
2. Call `clearAll()`

**Expected Result:**
- user = null
- token = null
- sessionId = null (cleared)
- isAuthenticated = false
- localStorage cleared

**Validation:**
```typescript
clearAll();
const { user, token, sessionId } = useAuthStore.getState();
expect(user).toBeNull();
expect(token).toBeNull();
expect(sessionId).toBeNull();
```

### Scenario 6: getAuthHeaders() - Token Priority
**Action:**
1. User has both token and sessionId

**Expected Result:**
- Returns Authorization header (token takes priority)
- Does NOT return X-SESSION-ID header

**Validation:**
```typescript
// With token
const headers = getAuthHeaders();
expect(headers.Authorization).toBeTruthy();
expect(headers['X-SESSION-ID']).toBeUndefined();
```

### Scenario 7: getAuthHeaders() - Anonymous User
**Action:**
1. User has sessionId but no token

**Expected Result:**
- Returns X-SESSION-ID header
- Does NOT return Authorization header

**Validation:**
```typescript
// No token, has sessionId
const headers = getAuthHeaders();
expect(headers['X-SESSION-ID']).toBeTruthy();
expect(headers.Authorization).toBeUndefined();
```

### Scenario 8: Hydration Prevention
**Action:**
1. App loads
2. Check isHydrated before rendering

**Expected Result:**
- isHydrated starts as false
- After storage restoration, isHydrated = true
- No auth flicker in UI

**Validation:**
```typescript
// In component
const isHydrated = useAuthStore((state) => state.isHydrated);
if (!isHydrated) return <Loading />;
```

🔒 Non-Functional Requirements
===============================

**Code Quality:**
- ✅ Fully typed (no `any` types)
- ✅ No ESLint warnings
- ✅ Proper error handling
- ✅ Clean, readable code

**Security:**
- ✅ No sensitive data in localStorage (only token + sessionId)
- ✅ User object not persisted (fetched fresh after login)
- ✅ Tokens never logged to console

**Performance:**
- ✅ No unnecessary re-renders
- ✅ Efficient state updates
- ✅ Minimal localStorage operations

**Reliability:**
- ✅ No hydration mismatches
- ✅ No race conditions
- ✅ No infinite loops
- ✅ Production-ready

✅ Deliverable
==============

**Exports from `src/lib/store/auth.ts`:**
```typescript
export const useAuthStore;        // Zustand store hook
export const getToken;            // Helper function
export const getSessionId;        // Helper function
export const getAuthHeaders;      // Helper function
export const generateSessionId;   // Helper function
export const initializeSession;   // Initialization function
export type UserRole;             // Type export
```

**Integration Points:**
- API client uses `getAuthHeaders()`
- Root layout calls `initializeSession()`
- Auth provider checks `isHydrated`
- Login/logout flows use store actions

📊 Acceptance Criteria
======================

**File Creation:**
- [ ] `src/lib/store/auth.ts` created
- [ ] All exports present and typed
- [ ] No TypeScript errors

**Functionality:**
- [ ] All 8 test scenarios pass
- [ ] sessionId auto-generated on first visit
- [ ] sessionId persists after logout
- [ ] token takes priority over sessionId
- [ ] Hydration handled correctly

**Quality:**
- [ ] No `any` types used
- [ ] No console warnings/errors
- [ ] localStorage only stores token + sessionId
- [ ] User object not persisted

**Integration:**
- [ ] Works with API client (Task 1.1)
- [ ] Can be used in components
- [ ] Helper functions work outside React

⏱️ Estimated Duration
=====================
25-30 minutes

🔗 Dependencies
===============

**Requires (must be complete first):**
- Task 0.2 - Project structure (needs src/lib/store/)
- Task 0.4 - TypeScript types (needs User type)

**Blocks (waiting on this task):**
- Task 1.1 - API Client (needs getAuthHeaders)
- Task 1.3 - Auth API Module (needs useAuthStore)
- Task 1.4 - Auth Hooks (needs useAuthStore)
- Task 2.1 - Login Page (needs useAuthStore)
- All auth-related tasks

📝 Notes
========

**Critical:**
- sessionId MUST persist after logout (cart continuity)
- User object should NOT be persisted (security)
- Token takes priority over sessionId in API calls
- Use `crypto.randomUUID()` (browser native, no libraries)

**Common Mistakes to Avoid:**
- ❌ Clearing sessionId on logout (breaks cart continuity)
- ❌ Persisting user object (stale data risk)
- ❌ Not checking isHydrated (causes auth flicker)
- ❌ Using custom UUID generator (use native crypto)

**Best Practices:**
- Initialize session in root layout (runs once)
- Wait for hydration before rendering protected routes
- Use helper functions in API client (not direct store access)
- Keep store simple (no complex logic)

**Debugging Tips:**
- Check localStorage for 'auth-storage' key
- Verify sessionId format is valid UUID
- Check isHydrated before testing auth state
- Use Zustand DevTools for state inspection
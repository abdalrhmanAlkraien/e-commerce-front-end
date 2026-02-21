📄 Task 1.4 — Authentication Hooks (React Query)
=================================================

🎯 Objective
------------

Create production-ready React Query mutation hooks for authentication operations:
- Login, register, and logout mutations with TanStack Query
- Automatic auth store updates on success
- Toast notifications for user feedback
- Proper error handling and loading states
- Type-safe hooks for use throughout the application

📂 File Locations
=================
```
src/lib/hooks/useAuth.ts (create)
```

1️⃣ Type Definitions
====================

Import Required Types
---------------------

```typescript
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types';
import type { UseMutationResult } from '@tanstack/react-query';
```

Hook Return Types
-----------------

```typescript
// Login hook return type
type UseLoginResult = UseMutationResult<
  AuthResponse,      // Data returned on success
  Error,             // Error type
  LoginRequest,      // Variables passed to mutation
  unknown            // Context (not used)
>;

// Register hook return type
type UseRegisterResult = UseMutationResult<
  AuthResponse,
  Error,
  RegisterRequest,
  unknown
>;

// Logout hook return type
type UseLogoutResult = UseMutationResult<
  void,              // No data returned
  Error,
  void,              // No variables needed
  unknown
>;
```

2️⃣ useLogin Hook
=================

Hook Signature
--------------

```typescript
export function useLogin(): UseLoginResult
```

**Purpose:**
- Handle user login with email/password
- Update auth store on success
- Show toast notifications
- Provide loading/error states
- Enable navigation after login

Implementation
--------------

```typescript
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login } from '@/lib/api/auth';

export function useLogin() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: login, // API function from Task 1.3
    
    onSuccess: (data) => {
      // Auth store already updated by login() function
      toast.success('Login successful! Welcome back.');
      
      // Redirect to products or intended destination
      router.push('/products');
    },
    
    onError: (error: Error) => {
      // Show user-friendly error message
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
}
```

**Flow:**
1. Component calls `loginMutation.mutate({ email, password })`
2. `mutationFn` calls `login()` API function
3. On success:
    - Auth store updated (by login function)
    - Success toast shown
    - User redirected to /products
4. On error:
    - Error toast shown
    - User stays on login page

**Usage:**
```typescript
function LoginForm() {
  const loginMutation = useLogin();
  
  const handleSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... form fields ... */}
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**States:**
- `isPending` - Request in progress
- `isError` - Request failed
- `isSuccess` - Request succeeded
- `error` - Error object if failed
- `data` - AuthResponse if successful

3️⃣ useRegister Hook
====================

Hook Signature
--------------

```typescript
export function useRegister(): UseRegisterResult
```

**Purpose:**
- Handle user registration
- Auto-login after successful registration
- Update auth store with new user
- Show toast notifications
- Navigate to products page

Implementation
--------------

```typescript
export function useRegister() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: register, // API function from Task 1.3
    
    onSuccess: (data) => {
      // Auth store already updated by register() function
      toast.success(`Welcome, ${data.user.firstName}! Your account has been created.`);
      
      // Redirect to products page
      router.push('/products');
    },
    
    onError: (error: Error) => {
      // Show specific error message
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
}
```

**Flow:**
1. Component calls `registerMutation.mutate({ firstName, lastName, email, password })`
2. `mutationFn` calls `register()` API function
3. Backend creates account and returns token
4. On success:
    - Auth store updated (user logged in)
    - Welcome toast shown with user's first name
    - User redirected to /products
5. On error:
    - Error toast shown (e.g., "Email already registered")
    - User stays on registration page

**Usage:**
```typescript
function RegisterForm() {
  const registerMutation = useRegister();
  
  const handleSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... form fields ... */}
      <button 
        type="submit" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Register'}
      </button>
      
      {registerMutation.isError && (
        <p className="text-red-500 text-sm">
          {registerMutation.error.message}
        </p>
      )}
    </form>
  );
}
```

4️⃣ useLogout Hook
==================

Hook Signature
--------------

```typescript
export function useLogout(): UseLogoutResult
```

**Purpose:**
- Handle user logout
- Clear auth data from store
- Preserve sessionId (for cart continuity)
- Show confirmation toast
- Redirect to homepage

Implementation
--------------

```typescript
export function useLogout() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: logout, // API function from Task 1.3
    
    onSuccess: () => {
      // Auth store already cleared by logout() function
      toast.success('You have been logged out.');
      
      // Redirect to homepage
      router.push('/');
    },
    
    onError: (error: Error) => {
      // Even if backend logout fails, clear locally
      toast.info('Logged out locally.');
      router.push('/');
    },
  });
}
```

**Flow:**
1. Component calls `logoutMutation.mutate()`
2. `mutationFn` calls `logout()` API function
3. Backend invalidates token (optional)
4. Auth store cleared (token + user removed, sessionId kept)
5. Success toast shown
6. User redirected to homepage
7. User can continue browsing as anonymous

**Usage:**
```typescript
function LogoutButton() {
  const logoutMutation = useLogout();
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate();
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

5️⃣ Additional Helper Hooks (Optional)
======================================

useCurrentUser()
----------------

**Purpose:** Get current user from store reactively

```typescript
export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}
```

**Usage:**
```typescript
function UserProfile() {
  const user = useCurrentUser();
  
  if (!user) return null;
  
  return <div>Welcome, {user.firstName}!</div>;
}
```

useIsAuthenticated()
--------------------

**Purpose:** Get authentication status reactively

```typescript
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}
```

**Usage:**
```typescript
function Header() {
  const isAuthenticated = useIsAuthenticated();
  
  return (
    <nav>
      {isAuthenticated ? <UserMenu /> : <LoginButton />}
    </nav>
  );
}
```

useAuthToken()
--------------

**Purpose:** Get current token reactively

```typescript
export function useAuthToken() {
  return useAuthStore((state) => state.token);
}
```

**Usage:**
```typescript
function DebugPanel() {
  const token = useAuthToken();
  
  return <div>Token: {token ? 'Present' : 'None'}</div>;
}
```

6️⃣ Code Example
================

Complete Implementation
-----------------------

```typescript
// src/lib/hooks/useAuth.ts

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login, register, logout } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types';

// ========================================
// MUTATION HOOKS
// ========================================

/**
 * Login mutation hook
 * Handles user authentication with email/password
 */
export function useLogin() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: login,
    
    onSuccess: (data: AuthResponse) => {
      toast.success('Login successful! Welcome back.');
      router.push('/products');
    },
    
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
}

/**
 * Register mutation hook
 * Handles new user registration and auto-login
 */
export function useRegister() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: register,
    
    onSuccess: (data: AuthResponse) => {
      toast.success(
        `Welcome, ${data.user.firstName}! Your account has been created.`
      );
      router.push('/products');
    },
    
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
}

/**
 * Logout mutation hook
 * Handles user logout and cleanup
 */
export function useLogout() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: logout,
    
    onSuccess: () => {
      toast.success('You have been logged out.');
      router.push('/');
    },
    
    onError: () => {
      // Clear locally even if backend fails
      toast.info('Logged out locally.');
      router.push('/');
    },
  });
}

// ========================================
// SELECTOR HOOKS (Optional but useful)
// ========================================

/**
 * Get current user from auth store
 * Updates reactively when user changes
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}

/**
 * Get authentication status
 * Updates reactively when auth state changes
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Get current auth token
 * Updates reactively when token changes
 */
export function useAuthToken() {
  return useAuthStore((state) => state.token);
}
```

7️⃣ Usage Examples
==================

Login Form Component
--------------------

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/lib/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const loginMutation = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          disabled={loginMutation.isPending}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          disabled={loginMutation.isPending}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

Register Form Component
-----------------------

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/lib/hooks/useAuth';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>First Name</label>
          <input {...register('firstName')} />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        
        <div>
          <label>Last Name</label>
          <input {...register('lastName')} />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
```

Logout Button Component
-----------------------

```typescript
'use client';

import { useLogout, useCurrentUser } from '@/lib/hooks/useAuth';

export function LogoutButton() {
  const logoutMutation = useLogout();
  const user = useCurrentUser();
  
  if (!user) return null;
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate();
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="text-red-500 hover:text-red-700"
    >
      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

User Profile Display
--------------------

```typescript
'use client';

import { useCurrentUser, useIsAuthenticated } from '@/lib/hooks/useAuth';

export function UserProfile() {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();
  
  if (!isAuthenticated || !user) {
    return <p>Please log in to view your profile.</p>;
  }
  
  return (
    <div>
      <h2>Welcome, {user.firstName} {user.lastName}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.roles.join(', ')}</p>
    </div>
  );
}
```

🧪 Test Scenarios
=================

### Scenario 1: useLogin - Successful Login
**Action:**
```typescript
const { result } = renderHook(() => useLogin(), {
  wrapper: QueryClientProvider,
});

act(() => {
  result.current.mutate({
    email: 'user@example.com',
    password: 'password123',
  });
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

**Expected Result:**
- `isPending` = true during request
- API called with credentials
- Success toast shown
- Router navigates to /products
- Auth store updated with user + token
- `isSuccess` = true
- `data` contains AuthResponse

**Validation:**
```typescript
expect(result.current.isSuccess).toBe(true);
expect(result.current.data?.user.email).toBe('user@example.com');
expect(toast.success).toHaveBeenCalledWith('Login successful! Welcome back.');
expect(router.push).toHaveBeenCalledWith('/products');
```

### Scenario 2: useLogin - Invalid Credentials
**Action:**
```typescript
const { result } = renderHook(() => useLogin());

act(() => {
  result.current.mutate({
    email: 'wrong@example.com',
    password: 'wrongpassword',
  });
});

await waitFor(() => expect(result.current.isError).toBe(true));
```

**Expected Result:**
- `isPending` = true during request
- API returns 401 error
- Error toast shown
- No navigation
- Auth store NOT updated
- `isError` = true
- User stays on login page

**Validation:**
```typescript
expect(result.current.isError).toBe(true);
expect(result.current.error?.message).toBeTruthy();
expect(toast.error).toHaveBeenCalled();
expect(router.push).not.toHaveBeenCalled();
```

### Scenario 3: useRegister - Successful Registration
**Action:**
```typescript
const { result } = renderHook(() => useRegister());

act(() => {
  result.current.mutate({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'securepass123',
  });
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

**Expected Result:**
- Account created on backend
- Auto-logged in with token
- Welcome toast with first name
- Router navigates to /products
- Auth store updated
- `isSuccess` = true

**Validation:**
```typescript
expect(result.current.isSuccess).toBe(true);
expect(result.current.data?.user.firstName).toBe('John');
expect(toast.success).toHaveBeenCalledWith(
  expect.stringContaining('Welcome, John!')
);
expect(router.push).toHaveBeenCalledWith('/products');
```

### Scenario 4: useRegister - Email Already Exists
**Action:**
```typescript
const { result } = renderHook(() => useRegister());

act(() => {
  result.current.mutate({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'existing@example.com',
    password: 'password123',
  });
});

await waitFor(() => expect(result.current.isError).toBe(true));
```

**Expected Result:**
- API returns 400 error
- Error toast shown
- No account created
- No navigation
- `isError` = true

**Validation:**
```typescript
expect(result.current.isError).toBe(true);
expect(toast.error).toHaveBeenCalled();
expect(router.push).not.toHaveBeenCalled();
```

### Scenario 5: useLogout - Successful Logout
**Action:**
```typescript
// First login
const loginResult = renderHook(() => useLogin());
act(() => {
  loginResult.result.current.mutate({
    email: 'user@example.com',
    password: 'pass',
  });
});

await waitFor(() => loginResult.result.current.isSuccess);

// Then logout
const logoutResult = renderHook(() => useLogout());
act(() => {
  logoutResult.result.current.mutate();
});

await waitFor(() => logoutResult.result.current.isSuccess);
```

**Expected Result:**
- Token cleared from store
- User cleared from store
- SessionId preserved
- Success toast shown
- Router navigates to /
- `isSuccess` = true

**Validation:**
```typescript
const authState = useAuthStore.getState();
expect(authState.token).toBeNull();
expect(authState.user).toBeNull();
expect(authState.sessionId).toBeTruthy(); // Preserved!
expect(toast.success).toHaveBeenCalledWith('You have been logged out.');
expect(router.push).toHaveBeenCalledWith('/');
```

### Scenario 6: useCurrentUser - Reactive Updates
**Action:**
```typescript
const { result, rerender } = renderHook(() => useCurrentUser());

// Initially no user
expect(result.current).toBeNull();

// Login
act(() => {
  useAuthStore.getState().setUser(mockUser, 'token123');
});

rerender();
```

**Expected Result:**
- Initial render: null
- After login: user object
- Hook updates reactively

**Validation:**
```typescript
expect(result.current).toBeNull(); // Before
act(() => useAuthStore.getState().setUser(mockUser, 'token'));
rerender();
expect(result.current).toEqual(mockUser); // After
```

### Scenario 7: useIsAuthenticated - Reactive Updates
**Action:**
```typescript
const { result, rerender } = renderHook(() => useIsAuthenticated());

// Initially false
expect(result.current).toBe(false);

// Login
act(() => {
  useAuthStore.getState().setUser(mockUser, 'token123');
});

rerender();
```

**Expected Result:**
- Initial: false
- After login: true
- After logout: false

**Validation:**
```typescript
expect(result.current).toBe(false);
act(() => useAuthStore.getState().setUser(mockUser, 'token'));
rerender();
expect(result.current).toBe(true);
act(() => useAuthStore.getState().logout());
rerender();
expect(result.current).toBe(false);
```

### Scenario 8: Loading States
**Action:**
```typescript
const { result } = renderHook(() => useLogin());

// Not loading initially
expect(result.current.isPending).toBe(false);

// Start mutation
act(() => {
  result.current.mutate({ email: 'test@test.com', password: 'pass' });
});

// Loading during request
expect(result.current.isPending).toBe(true);

await waitFor(() => expect(result.current.isPending).toBe(false));
```

**Expected Result:**
- `isPending` = false initially
- `isPending` = true during request
- `isPending` = false after completion

**Validation:**
```typescript
expect(result.current.isPending).toBe(false); // Before
act(() => result.current.mutate(credentials));
expect(result.current.isPending).toBe(true); // During
await waitFor(() => expect(result.current.isPending).toBe(false)); // After
```

🔒 Non-Functional Requirements
===============================

**Code Quality:**
- ✅ Fully typed (no `any` types)
- ✅ Clean hook composition
- ✅ Follows React Query best practices
- ✅ Proper error handling

**User Experience:**
- ✅ Toast notifications for all actions
- ✅ Loading states during mutations
- ✅ Error messages are user-friendly
- ✅ Automatic navigation after success

**Performance:**
- ✅ Efficient re-renders (Zustand selectors)
- ✅ No unnecessary API calls
- ✅ Proper mutation invalidation

**Reliability:**
- ✅ Handles network errors gracefully
- ✅ Clears state on logout
- ✅ Preserves sessionId throughout

✅ Deliverable
==============

**Created file:**
```
src/lib/hooks/useAuth.ts
```

**Exports:**
```typescript
// Mutation Hooks
export function useLogin(): UseLoginResult;
export function useRegister(): UseRegisterResult;
export function useLogout(): UseLogoutResult;

// Selector Hooks (Optional)
export function useCurrentUser(): User | null;
export function useIsAuthenticated(): boolean;
export function useAuthToken(): string | null;
```

**Integration:**
- Used in login page (Task 2.1)
- Used in register page (Task 2.2)
- Used in header/navigation components
- Works with auth store (Task 1.2)
- Works with auth API (Task 1.3)

📊 Acceptance Criteria
======================

**File Creation:**
- [ ] `src/lib/hooks/useAuth.ts` created
- [ ] All hooks implemented
- [ ] All exports present
- [ ] No TypeScript errors

**Functionality:**
- [ ] useLogin hook works with valid credentials
- [ ] useLogin shows error on invalid credentials
- [ ] useRegister creates account and logs in
- [ ] useRegister shows error on duplicate email
- [ ] useLogout clears auth state
- [ ] useLogout preserves sessionId
- [ ] Selector hooks update reactively

**User Experience:**
- [ ] Toast notifications show on all actions
- [ ] Loading states work during mutations
- [ ] Navigation happens after success
- [ ] Error messages are clear

**Testing:**
- [ ] All 8 test scenarios pass
- [ ] Hooks work in components
- [ ] React Query integration works
- [ ] Auth store updates correctly

**Quality:**
- [ ] Clean, readable code
- [ ] Proper TypeScript types
- [ ] Follows React Query patterns
- [ ] No memory leaks

⏱️ Estimated Duration
=====================
25-30 minutes

🔗 Dependencies
===============

**Requires (must be complete first):**
- Task 0.1 - Create Next.js Project (needs React Query setup)
- Task 1.2 - Setup Auth Store (needs useAuthStore)
- Task 1.3 - Auth API Module (needs login, register, logout functions)

**Blocks (waiting on this task):**
- Task 2.1 - Create Login Page (needs useLogin hook)
- Task 2.2 - Create Register Page (needs useRegister hook)
- Header/navigation components (need useCurrentUser, useLogout)

📝 Notes
========

**Critical:**
- Auth store updates happen in API functions (Task 1.3), not in hooks
- Hooks just handle UI concerns (toast, navigation, loading)
- SessionId preservation is critical (handled by API layer)
- Use React Query DevTools for debugging

**Common Mistakes:**
- ❌ Updating auth store in hooks (should be in API functions)
- ❌ Not showing loading states (poor UX)
- ❌ Missing error messages (user doesn't know what happened)
- ❌ Not using router.push() (navigation doesn't work)

**React Query Patterns:**
- Use `useMutation` for create/update/delete operations
- Use `useQuery` for fetching data (not needed for auth)
- `onSuccess` is perfect for navigation and toasts
- `onError` is perfect for error toasts
- `isPending` for loading states

**Toast Notifications:**
- Success: Green toast, positive message
- Error: Red toast, helpful message
- Info: Blue toast, neutral message
- Keep messages concise and actionable

**Navigation:**
- Login success → /products
- Register success → /products
- Logout → / (homepage)
- Can add returnUrl parameter for better UX

**Testing Tips:**
- Mock React Query's QueryClientProvider
- Mock Next.js router
- Mock toast notifications
- Test loading states
- Test error states
- Test success states
- Verify auth store updates

**Performance:**
- Selector hooks (useCurrentUser, etc.) use Zustand's built-in optimization
- Only re-render when selected state changes
- React Query handles caching and deduplication
- No manual optimization needed
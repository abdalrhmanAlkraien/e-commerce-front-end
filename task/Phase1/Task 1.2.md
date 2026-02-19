Create Zustand store for authentication state with support for both anonymous and authenticated users.

Create src/lib/store/auth.ts:

1. Define AuthState interface with:
    - user: User | null (authenticated user)
    - isAuthenticated: boolean
    - token: string | null (JWT token)
    - sessionId: string | null (for anonymous users)

2. Implement actions:
    - setUser(user: User | null, token: string | null)
    - setSessionId(sessionId: string)
    - logout() - clears user, token, but KEEPS sessionId for anonymous browsing
    - clearAll() - clears everything including sessionId

3. Add persist middleware:
    - Persist token and sessionId to localStorage
    - Use storage key: 'auth-storage'
    - Hydrate on app load

4. Add helper functions:
    - getToken() → string | null
    - getSessionId() → string | null
    - generateSessionId() → string (UUID v4)
    - initializeSession() - creates sessionId if none exists

5. Auto-generate sessionId on first load if not present

6. Export useAuthStore hook

Implementation notes:
- sessionId should persist even after logout (for cart continuity)
- When user logs in, keep existing sessionId to merge anonymous cart
- Token takes precedence over sessionId for API calls

Test cases:
1. Fresh user → verify sessionId auto-generated
2. Set user + token → verify persists on reload
3. Logout → verify sessionId remains but token cleared
4. clearAll → verify everything removed
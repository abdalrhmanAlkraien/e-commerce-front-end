Create authentication API functions with support for anonymous cart merging.

Create src/lib/api/auth.ts:

1. Implement login(credentials) → AuthResponse
    - POST /api/v1/auth/login
    - Body: { email, password }
    - On success:
        * Store token in authStore
        * Store user in authStore
        * Keep existing sessionId (don't clear it)
        * Return AuthResponse
    - On error: throw with proper error message

2. Implement register(data) → AuthResponse
    - POST /api/v1/auth/register
    - Body: { firstName, lastName, email, password }
    - On success:
        * Store token in authStore
        * Store user in authStore
        * Keep existing sessionId
        * Return AuthResponse
    - On error: throw with proper error message

3. Implement logout() → void
    - POST /api/v1/auth/logout (if endpoint exists)
    - Clear token and user from authStore
    - Keep sessionId intact (don't clear)
    - User continues as anonymous

4. Helper function: getAuthHeaders() → object
    - If authenticated: return { Authorization: `Bearer ${token}` }
    - If anonymous: return { 'X-SESSION-ID': sessionId }
    - This will be used by cart/checkout APIs

5. Export authApi object with all functions:
    - login
    - register
    - logout
    - getAuthHeaders

Flow explanation:
- Anonymous user browses → uses sessionId for cart
- User registers/logs in → token added, sessionId kept
- Backend merges anonymous cart to user account using sessionId
- User logs out → becomes anonymous again with same sessionId

Follow the pattern shown in docs/API_INTEGRATION.md
Use apiClient from client.ts

Test scenarios:
1. Login with valid credentials → verify token stored
2. Login with invalid credentials → verify error thrown
3. Register new user → verify token stored
4. Logout → verify token cleared but sessionId remains
5. getAuthHeaders when authenticated → returns Bearer token
6. getAuthHeaders when anonymous → returns X-SESSION-ID header
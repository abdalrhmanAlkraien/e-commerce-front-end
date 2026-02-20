Update the API client to automatically include correct auth headers.

Update src/lib/api/client.ts:

1. Import useAuthStore from store/auth

2. Update request interceptor:
    - Get auth state from useAuthStore.getState()
    - If token exists (authenticated):
        * Add: Authorization: Bearer ${token}
    - Else if sessionId exists (anonymous):
        * Add: X-SESSION-ID: ${sessionId}
    - This happens automatically for all requests

3. Update response interceptor for 401 handling:
    - On 401 error:
        * Clear token from authStore (logout)
        * Keep sessionId (user continues as anonymous)
        * Redirect to /login
    - Do NOT clear sessionId on 401

4. Add helper: isAuthenticated() → boolean
    - Check if token exists in authStore
    - Used to conditionally show UI elements

Example interceptor code structure:
```typescript
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  const token = authStore.token;
  const sessionId = authStore.sessionId;

  if (token) {
    // Authenticated user
    config.headers.Authorization = `Bearer ${token}`;
  } else if (sessionId) {
    // Anonymous user
    config.headers['X-SESSION-ID'] = sessionId;
  }

  return config;
});

5. Update response interceptor to handle unwrapped responses:
    - Backend returns data directly (no StandardApiResponse wrapper)
    - Access response data as: response.data
    - For paginated responses: response.data will be Page<T>
    - For single items: response.data will be the item itself
    - For arrays: response.data will be the array

Example response handling:
```typescript
apiClient.interceptors.response.use(
  (response) => {
    // Data is already unwrapped, just return it
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.clearToken(); // Clear token
      // Keep sessionId intact
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

6. Add note about response format:
   - No need to unwrap response.data.data
   - Backend returns: response.data = actual data
   - Error responses have: { message, timestamp, errors? }
```

Test cases:
1. Make request as authenticated user → verify Authorization header
2. Make request as anonymous user → verify X-SESSION-ID header
3. 401 response → verify token cleared, sessionId remains
4. isAuthenticated() returns correct boolean
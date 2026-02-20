Create the API client with axios configuration and interceptors.

Create src/lib/api/client.ts:

1. Configure axios instance:
    - baseURL from VITE_API_BASE_URL
    - timeout (e.g. 15000ms)
    - withCredentials only if backend uses cookies

2. Add request interceptor:
    - Attach Authorization: Bearer <accessToken> if exists
    - Log request in development mode only
    - Support request cancellation

3. Add response interceptor:
    - Handle 400 validation errors
    - On 401:
        - Attempt token refresh once
        - Retry original request
        - If refresh fails → clear auth + redirect to login
    - Handle 403 with proper error message
    - Normalize error response using getErrorMessage()

4. Implement token refresh logic:
    - Prevent multiple refresh calls (queue pending requests)
    - Store refreshed token securely

5. Implement helper:
   getErrorMessage(error: unknown): string

6. Do NOT redefine ApiResponse<T> or Page<T>.
   Import shared types from src/types.

7. Export:
    - axios instance
    - typed helper methods (get, post, put, delete)

8. Ensure fully typed generics support:
   api.get<ApiResponse<Product>>(...)

**Test:**

- Public endpoint: GET /api/v1/public/products

- Secured endpoint (after login)

- Force 401 to verify refresh logic
Create the API client with axios configuration and interceptors.

Create src/lib/api/client.ts:
1. Configure axios instance with base URL from env
2. Add request interceptor for logging in development
3. Add response interceptor for error handling
4. Implement token refresh logic on 401 errors
5. Add helper function getErrorMessage(error)
6. Export ApiResponse<T> and PaginatedResponse<T> types
7. Configure withCredentials if needed

Test by making a simple GET request to /api/v1/public/products
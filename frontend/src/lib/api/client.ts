import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/store/auth';

// ==================================
// 1️⃣ Axios Instance Configuration
// ==================================

/**
 * Base API client configured with:
 * - Base URL from environment variable
 * - 15 second timeout
 * - JSON content type headers
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================================
// 4️⃣ Token Refresh Logic
// ==================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Processes the queue of failed requests after token refresh
 */
const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Refreshes the access token using the refresh token
 * Prevents concurrent refresh calls by queueing requests
 */
async function refreshAccessToken(): Promise<string> {
  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call refresh endpoint (without interceptors to avoid infinite loop)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    // Update auth store with new tokens
    useAuthStore.getState().setUser(user, accessToken, newRefreshToken);

    // Process queued requests
    processQueue();

    return accessToken;
  } catch (error) {
    // Refresh failed - logout user
    processQueue(error);
    useAuthStore.getState().logout();

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw error;
  } finally {
    isRefreshing = false;
  }
}

// ==================================
// 2️⃣ Request Interceptor
// ==================================

/**
 * Request interceptor that automatically injects authentication headers
 * - Bearer token for authenticated users
 * - X-SESSION-ID for anonymous users
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, sessionId } = useAuthStore.getState();

    // Add authentication header (token takes precedence over sessionId)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (sessionId) {
      config.headers['X-SESSION-ID'] = sessionId;
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      const headers = { ...config.headers };
      // Redact sensitive data
      if (headers.Authorization) {
        headers.Authorization = 'Bearer ***REDACTED***';
      }
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================================
// 3️⃣ Response Interceptor
// ==================================

/**
 * Response interceptor that handles:
 * - Success responses (data is already unwrapped)
 * - Error responses with automatic retry for 401
 * - User-friendly error messages
 */
apiClient.interceptors.response.use(
  // Success response - return as-is (backend returns data directly)
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },

  // Error response handling
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Development error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle different error status codes
    if (error.response) {
      const { status } = error.response;

      // 400 Bad Request - Validation errors
      if (status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid request';
        const validationErrors = error.response.data?.errors || [];

        return Promise.reject({
          message: errorMessage,
          errors: validationErrors,
          status: 400,
        });
      }

      // 401 Unauthorized - Token expired, attempt refresh
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the token
          const newToken = await refreshAccessToken();

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, user has been logged out
          return Promise.reject({
            message: 'Session expired, please log in',
            status: 401,
          });
        }
      }

      // 403 Forbidden - No permission
      if (status === 403) {
        return Promise.reject({
          message: "You don't have permission to access this resource",
          status: 403,
        });
      }

      // 404 Not Found
      if (status === 404) {
        return Promise.reject({
          message: error.response.data?.message || 'Resource not found',
          status: 404,
        });
      }

      // 500+ Server Errors
      if (status >= 500) {
        return Promise.reject({
          message: 'Server error, please try again',
          status,
        });
      }
    }

    // Network error or other errors
    return Promise.reject(error);
  }
);

// ==================================
// 5️⃣ Helper Functions
// ==================================

/**
 * Extracts a user-friendly error message from any error type
 * @param error - The error object (can be AxiosError, Error, or unknown)
 * @returns User-friendly error message string
 */
export function getErrorMessage(error: unknown): string {
  // Check if it's an Axios error
  if (axios.isAxiosError(error)) {
    // API error response with message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Network error
    if (error.message) {
      return error.message;
    }
  }

  // Custom error object from interceptor
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
}

// ==================================
// 7️⃣ Typed API Helpers (Optional)
// ==================================

/**
 * Typed API helper methods that preserve type safety
 * Use these for cleaner, type-safe API calls
 */
export const api = {
  get: <T>(url: string, config?: any) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: any) =>
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) =>
    apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: any) => apiClient.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: any) =>
    apiClient.patch<T>(url, data, config),
};

// frontend/src/lib/api/auth.ts

import { apiClient } from './client';
import { useAuthStore } from '@/lib/store/auth';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from '@/types';

/**
 * Login user with email and password
 * Automatically stores token and user in auth store
 * Preserves sessionId for cart merge
 *
 * @param credentials - User email and password
 * @returns AuthResponse with token, refreshToken, and user data
 * @throws Error on invalid credentials or network issues
 */
export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/login',
    credentials
  );

  const authData = response.data;

  // Store auth data (token + user) in store
  const authStore = useAuthStore.getState();
  authStore.setUser(authData.user, authData.accessToken);

  // sessionId is preserved automatically for cart merge

  return authData;
}

/**
 * Register new user account
 * Automatically logs in and stores auth data
 * Preserves sessionId for cart merge
 *
 * @param data - Registration data (firstName, lastName, email, password)
 * @returns AuthResponse with token, refreshToken, and user data
 * @throws Error on duplicate email or validation errors
 */
export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/register',
    data
  );

  const authData = response.data;

  // Store auth data (token + user) in store
  const authStore = useAuthStore.getState();
  authStore.setUser(authData.user, authData.accessToken);

  // sessionId is preserved for cart merge

  return authData;
}

/**
 * Logout current user
 * Clears token and user but preserves sessionId
 * User continues as anonymous with cart intact
 *
 * @returns Promise<void>
 */
export async function logout(): Promise<void> {
  try {
    // Optional: Notify backend to invalidate token
    // Backend may not have this endpoint, so we catch and ignore errors
    await apiClient.post('/auth/logout').catch(() => {
      // Ignore errors - logout locally anyway
    });
  } finally {
    // Always clear local auth state
    const authStore = useAuthStore.getState();
    authStore.logout(); // Clears token/user, keeps sessionId intact
  }
}

/**
 * Get authentication headers for API requests
 * Returns JWT token for authenticated users
 * Returns sessionId for anonymous users
 *
 * Used by other API modules (cart, orders, etc.)
 *
 * @returns Record with Authorization or X-SESSION-ID header
 */
export function getAuthHeaders(): Record<string, string> {
  const { token, sessionId } = useAuthStore.getState();

  if (token) {
    // Authenticated user - JWT takes priority
    return { 'Authorization': `Bearer ${token}` };
  } else if (sessionId) {
    // Anonymous user - use session ID
    return { 'X-SESSION-ID': sessionId };
  }

  // No auth (shouldn't normally happen as sessionId auto-generates)
  return {};
}

// Export as object for convenience
export const authApi = {
  login,
  register,
  logout,
  getAuthHeaders,
};

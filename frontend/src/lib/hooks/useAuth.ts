'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login, register, logout } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth';
import { getErrorMessage } from '@/lib/api/client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '@/types';
import type { User } from '@/types';

interface UseLoginOptions {
  redirectTo?: string;
  onSuccess?: (data: AuthResponse) => void;
}

// ========================================
// MUTATION HOOKS
// ========================================

/**
 * Login mutation hook.
 * Handles user authentication with email/password; updates auth store via login().
 * Shows toast and redirects on success.
 */
export function useLogin(options: UseLoginOptions = {}) {
  const router = useRouter();
  const redirectTo = options.redirectTo ?? '/products';

  return useMutation({
    mutationFn: login,

    onSuccess: (data: AuthResponse) => {
      toast.success('Login successful! Welcome back.');
      options.onSuccess?.(data);
      router.push(redirectTo);
    },

    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || 'Login failed. Please try again.');
    },
  });
}

/**
 * Register mutation hook.
 * Handles new user registration and auto-login; updates auth store via register().
 * Shows welcome toast and redirects to /products on success.
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
      toast.error(
        getErrorMessage(error) || 'Registration failed. Please try again.'
      );
    },
  });
}

/**
 * Logout mutation hook.
 * Clears auth state via logout() (keeps sessionId). Redirects to / on success or error.
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
      toast.info('Logged out locally.');
      router.push('/');
    },
  });
}

// ========================================
// SELECTOR HOOKS
// ========================================

/**
 * Current user from auth store (reactive).
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * Authentication status from auth store (reactive).
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Current auth token from auth store (reactive).
 */
export function useAuthToken(): string | null {
  return useAuthStore((state) => state.token);
}

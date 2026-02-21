import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

// ==================================
// Type Definitions
// ==================================

/**
 * User role type - strongly typed union
 */
export type UserRole = 'ADMIN' | 'CUSTOMER';

/**
 * Authentication state interface
 */
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setUser: (user: User | null, token: string | null, refreshToken?: string | null) => void;
  setSessionId: (sessionId: string) => void;
  logout: () => void;
  clearAll: () => void;
  setHydrated: (value: boolean) => void;
}

// ==================================
// Zustand Store with Persist Middleware
// ==================================

/**
 * Authentication store
 * - Manages user authentication state
 * - Supports both authenticated users (JWT) and anonymous users (sessionId)
 * - Persists token and sessionId to localStorage
 * - Does NOT persist user object (security best practice)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      sessionId: null,
      isAuthenticated: false,
      isHydrated: false,

      /**
       * Set user and tokens
       * Called after successful login or when restoring user data
       * Does NOT modify sessionId (cart continuity)
       */
      setUser: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken: refreshToken ?? null,
          isAuthenticated: !!token,
        });
      },

      /**
       * Set session ID for anonymous users
       * Should only be called during initialization
       */
      setSessionId: (sessionId) => {
        set({ sessionId });
      },

      /**
       * Logout user
       * Clears user, token, and refreshToken but KEEPS sessionId intact
       * User continues as anonymous with same sessionId for cart continuity
       */
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          // sessionId stays intact - critical for cart continuity
        });
      },

      /**
       * Clear all authentication data including sessionId
       * Use sparingly - only for hard reset or security cleanup
       * WARNING: This will clear anonymous cart data
       */
      clearAll: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          sessionId: null,
          isAuthenticated: false,
        });
      },

      /**
       * Set hydration state
       * Called after localStorage restoration completes
       * Prevents auth flicker and redirect loops
       */
      setHydrated: (value) => {
        set({ isHydrated: value });
      },
    }),
    {
      // Persist configuration
      name: 'auth-storage',

      // Only persist token, refreshToken, and sessionId (not user object)
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
      }),

      // Set hydrated flag after storage restoration
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// ==================================
// Helper Functions
// ==================================

/**
 * Get current JWT token
 * Can be called outside React components
 * @returns Current token or null
 */
export const getToken = (): string | null => {
  return useAuthStore.getState().token;
};

/**
 * Get current refresh token
 * Can be called outside React components
 * @returns Current refreshToken or null
 */
export const getRefreshToken = (): string | null => {
  return useAuthStore.getState().refreshToken;
};

/**
 * Get current session ID
 * Can be called outside React components
 * @returns Current sessionId or null
 */
export const getSessionId = (): string | null => {
  return useAuthStore.getState().sessionId;
};

/**
 * Get authentication headers for API requests
 * Priority: token > sessionId > empty
 * @returns Headers object with Authorization or X-SESSION-ID
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const sessionId = getSessionId();

  // Token takes precedence over sessionId
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else if (sessionId) {
    return { 'X-SESSION-ID': sessionId };
  }

  return {};
};

/**
 * Generate a new session ID using browser's native crypto API
 * @returns UUID v4 string
 */
export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

/**
 * Initialize session for anonymous users
 * Should be called once during app bootstrap (e.g., in root layout)
 * Generates and stores new sessionId if one doesn't exist
 */
export const initializeSession = (): void => {
  const { sessionId, setSessionId } = useAuthStore.getState();

  if (!sessionId) {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }
};

// ==================================
// Role Checking Utilities (Optional)
// ==================================

/**
 * Check if user has admin role
 * @param user - User object or null
 * @returns true if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};

/**
 * Check if user has customer role
 * @param user - User object or null
 * @returns true if user is customer
 */
export const isCustomer = (user: User | null): boolean => {
  return user?.role === 'CUSTOMER';
};

/**
 * Authentication helper utilities
 * Used in middleware, components, and API functions for auth checks and route constants.
 * Frontend checks only — backend must validate all permissions.
 */

import { useAuthStore } from '@/lib/store/auth';
import type { UserRole } from '@/lib/store/auth';

// ========================================
// AUTHENTICATION STATE FUNCTIONS
// ========================================

/**
 * Check if user is authenticated (has valid token in store).
 * Does not validate token expiration; backend returns 401 when expired.
 */
export function isAuthenticated(): boolean {
  const token = useAuthStore.getState().token;
  return !!token;
}

/**
 * Check if user is browsing anonymously (has sessionId but no JWT token).
 */
export function isAnonymous(): boolean {
  const { token, sessionId } = useAuthStore.getState();
  return !token && !!sessionId;
}

/**
 * Throw if user is not authenticated.
 * Use in functions that require login (e.g. API wrappers).
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    throw new Error('Authentication required. Please log in to continue.');
  }
}

// ========================================
// USER ROLE FUNCTIONS
// ========================================

/**
 * Get current user's role.
 * Returns null if not authenticated or no role assigned.
 * User type has single `role` (string), not `roles` array.
 */
export function getUserRole(): UserRole | null {
  const user = useAuthStore.getState().user;
  if (!user?.role) return null;
  const role = user.role.toUpperCase();
  if (role === 'ADMIN' || role === 'CUSTOMER') return role as UserRole;
  return null;
}

/**
 * Check if current user has ADMIN role.
 */
export function isAdmin(): boolean {
  const user = useAuthStore.getState().user;
  if (!user?.role) return false;
  return user.role.toUpperCase() === 'ADMIN';
}

/**
 * Check if user can access admin panel (authenticated and admin).
 */
export function canAccessAdminPanel(): boolean {
  return isAuthenticated() && isAdmin();
}

// ========================================
// ROUTE CONSTANTS
// ========================================

/**
 * Public authentication routes (accessible without login).
 */
export const AUTH_ROUTES = ['/login', '/register'] as const;

export type AuthRoute = (typeof AUTH_ROUTES)[number];

/**
 * Admin-only route prefixes/paths.
 */
export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/customers',
] as const;

export type AdminRoute = (typeof ADMIN_ROUTES)[number];

// ========================================
// ROUTE HELPER FUNCTIONS
// ========================================

/**
 * Check if pathname is an auth route (exact match).
 */
export function isOnAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

/**
 * Check if pathname is under /admin.
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

/**
 * Get redirect path for login, preserving intended destination.
 */
export function getRedirectPath(pathname: string): string {
  if (pathname === '/login') return '/';
  return `/login?returnUrl=${encodeURIComponent(pathname)}`;
}

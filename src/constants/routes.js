// Centralized route constants used by routing/auth/guards.
// Keep these paths in sync with AppRoutes in src/App.jsx.

export const PUBLIC_ROUTES = Object.freeze([
  '/landing',
  '/login',
  '/register',
  '/terms',
  '/auth/confirm',
  '/auth/callback',
  '/oauth-success',
  '/complete-profile',
]);

// Pages where the top navigation bar should not be shown.
export const NO_NAVBAR_ROUTES = Object.freeze([
  '/landing',
  '/login',
  '/register',
  '/auth/confirm',
  '/auth/callback',
  '/oauth-success',
  '/complete-profile',
]);

export function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function isNoNavBarRoute(pathname) {
  return NO_NAVBAR_ROUTES.includes(pathname);
}

export const HOME_ROUTE = '/';

// The root path is the marketing landing for visitors and the profile for
// signed-in users. The landing ships its own header, so the app navbar is
// hidden whenever it is the one being rendered.
export function isLandingRoot(pathname, isAuthenticated) {
  return pathname === HOME_ROUTE && !isAuthenticated;
}

/**
 * Routes that paint correctly with the backend still asleep. They render static
 * or marketing content and make no session probe, so holding them behind the
 * warm-up splash would be pure cost — a visitor waiting on an API they may
 * never talk to. The probe still runs in the background on these routes, so the
 * backend is warm by the time they press Login.
 */
export const NO_BACKEND_ROUTES = Object.freeze(['/landing', '/terms']);

/**
 * Whether boot must wait for the backend before rendering the application.
 *
 * @param {string} pathname
 * @param {{ hasCachedUser?: boolean }} [options] Whether a session was cached by
 *   a previous visit. Passed in rather than read here so this module stays free
 *   of imports and side effects, like the predicates above.
 * @returns {boolean}
 */
export function requiresWarmBackend(pathname, { hasCachedUser = false } = {}) {
  if (NO_BACKEND_ROUTES.includes(pathname)) return false;
  // '/' is the marketing landing for a visitor with nothing cached — same deal.
  if (isLandingRoot(pathname, hasCachedUser)) return false;
  return true;
}

export const ADMIN_ROLES = Object.freeze(['org_admin']);

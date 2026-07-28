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

export const ADMIN_ROLES = Object.freeze(['org_admin']);

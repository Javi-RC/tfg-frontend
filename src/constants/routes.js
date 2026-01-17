// Centralized route constants used by routing/auth/guards.
// Keep these paths in sync with AppRoutes in src/App.jsx.

export const PUBLIC_ROUTES = Object.freeze([
  '/login',
  '/register',
  '/terms',
  '/auth/confirm',
  '/auth/callback',
  '/oauth-success',
  '/complete-profile'
]);

// Pages where the top navigation bar should not be shown.
export const NO_NAVBAR_ROUTES = Object.freeze([
  '/login',
  '/register',
  '/auth/confirm',
  '/auth/callback',
  '/oauth-success',
  '/complete-profile'
]);

export function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function isNoNavBarRoute(pathname) {
  return NO_NAVBAR_ROUTES.includes(pathname);
}

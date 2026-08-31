/**
 * Lifecycle of the client's knowledge about the session.
 *
 * The distinction that matters is CHECKING vs ANONYMOUS. Collapsing them into a
 * single "no user yet" boolean is what let a tampered `user:v1` in localStorage
 * open a role-gated route: the guard decided before the server had answered.
 */
export const SESSION_STATUS = Object.freeze({
  /** The session probe is in flight. Nothing has been confirmed — decide nothing. */
  CHECKING: 'checking',
  /** The server answered with a user. Its `role` is authoritative. */
  AUTHENTICATED: 'authenticated',
  /** No live session: the probe failed, was skipped, or the user signed out. */
  ANONYMOUS: 'anonymous',
});

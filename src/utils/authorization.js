import { SESSION_STATUS } from '../constants/session';

/**
 * The client's single authorization predicate.
 *
 * Kept pure and free of React so the rule can be asserted directly, and so the
 * context, the route guard and the tests cannot drift into three slightly
 * different notions of "is this person allowed".
 *
 * Two properties matter:
 *  - It is false unless the session is AUTHENTICATED. A role that has not been
 *    confirmed by the server this page-load never grants anything, which is what
 *    makes a hand-edited `user:v1` in localStorage inert.
 *  - It fails closed: unknown status, missing user or missing role all deny.
 *
 * @param {object} params
 * @param {string} params.sessionStatus One of SESSION_STATUS.
 * @param {string} [params.role] The server-confirmed role of the current user.
 * @param {string[]} [params.allowedRoles] Roles that grant access. Omit to require only a session.
 * @returns {boolean}
 */
export function canAccess({ sessionStatus, role, allowedRoles }) {
  if (sessionStatus !== SESSION_STATUS.AUTHENTICATED) return false;
  if (!role) return false;
  if (!allowedRoles) return true;
  return allowedRoles.includes(role);
}

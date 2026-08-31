import { canAccess } from './authorization';
import { SESSION_STATUS } from '../constants/session';

const AUTHENTICATED = SESSION_STATUS.AUTHENTICATED;

describe('canAccess', () => {
  describe('session gating', () => {
    it('grants access to a confirmed session when no roles are required', () => {
      expect(canAccess({ sessionStatus: AUTHENTICATED, role: 'employee' })).toBe(true);
    });

    it('denies while the session probe is still in flight', () => {
      expect(
        canAccess({ sessionStatus: SESSION_STATUS.CHECKING, role: 'org_admin' })
      ).toBe(false);
    });

    it('denies an anonymous session', () => {
      expect(
        canAccess({ sessionStatus: SESSION_STATUS.ANONYMOUS, role: 'org_admin' })
      ).toBe(false);
    });

    it('fails closed on an unknown status', () => {
      expect(canAccess({ sessionStatus: undefined, role: 'org_admin' })).toBe(false);
      expect(canAccess({ sessionStatus: 'something-else', role: 'org_admin' })).toBe(false);
    });

    it('denies when there is no role at all', () => {
      expect(canAccess({ sessionStatus: AUTHENTICATED, role: undefined })).toBe(false);
      expect(canAccess({ sessionStatus: AUTHENTICATED, role: '' })).toBe(false);
    });
  });

  describe('role gating', () => {
    it('grants when the role is listed', () => {
      expect(
        canAccess({ sessionStatus: AUTHENTICATED, role: 'org_admin', allowedRoles: ['org_admin'] })
      ).toBe(true);
    });

    it('denies when the role is not listed', () => {
      expect(
        canAccess({ sessionStatus: AUTHENTICATED, role: 'employee', allowedRoles: ['org_admin'] })
      ).toBe(false);
    });

    it('denies every role when the allowed list is empty', () => {
      expect(
        canAccess({ sessionStatus: AUTHENTICATED, role: 'org_admin', allowedRoles: [] })
      ).toBe(false);
    });
  });

  describe('localStorage tampering', () => {
    // The attack this predicate exists to stop: editing `user:v1` in the console
    // to claim org_admin. On boot the cached role is dropped and the status is
    // CHECKING, so neither the forged role nor the real one grants anything
    // until the server has answered.
    it('ignores a forged admin role while the session is unconfirmed', () => {
      expect(
        canAccess({
          sessionStatus: SESSION_STATUS.CHECKING,
          role: 'org_admin',
          allowedRoles: ['org_admin'],
        })
      ).toBe(false);
    });

    it('ignores a forged admin role once the probe comes back anonymous', () => {
      expect(
        canAccess({
          sessionStatus: SESSION_STATUS.ANONYMOUS,
          role: 'org_admin',
          allowedRoles: ['org_admin'],
        })
      ).toBe(false);
    });

    it('admits only the role the server confirmed, not the one that was cached', () => {
      // Server said "employee"; the cache claimed "org_admin" and was discarded.
      expect(
        canAccess({ sessionStatus: AUTHENTICATED, role: 'employee', allowedRoles: ['org_admin'] })
      ).toBe(false);
    });
  });
});

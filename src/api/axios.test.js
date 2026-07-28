import { shouldRedirectToLogin } from './axios';

const PROFILE_PROBE = '/api/profile';

describe('shouldRedirectToLogin', () => {
  it('redirects when a protected page loses its session', () => {
    expect(
      shouldRedirectToLogin({
        requestUrl: PROFILE_PROBE,
        pathname: '/projects',
        hasUser: true,
      })
    ).toBe(true);
  });

  it('leaves a visitor on the landing at "/" alone', () => {
    expect(
      shouldRedirectToLogin({ requestUrl: PROFILE_PROBE, pathname: '/', hasUser: false })
    ).toBe(false);
  });

  it('leaves a visitor on an unknown path alone, so the router can show the landing', () => {
    expect(
      shouldRedirectToLogin({
        requestUrl: PROFILE_PROBE,
        pathname: '/does-not-exist',
        hasUser: false,
      })
    ).toBe(false);
  });

  it('bounces a signed-in user on an unknown path only when the session expired', () => {
    expect(
      shouldRedirectToLogin({
        requestUrl: PROFILE_PROBE,
        pathname: '/does-not-exist',
        hasUser: true,
      })
    ).toBe(true);
  });

  it('still redirects from "/" when a known session expired', () => {
    expect(shouldRedirectToLogin({ requestUrl: PROFILE_PROBE, pathname: '/', hasUser: true })).toBe(
      true
    );
  });

  it('leaves visitors on public pages alone', () => {
    expect(
      shouldRedirectToLogin({ requestUrl: PROFILE_PROBE, pathname: '/landing', hasUser: false })
    ).toBe(false);
    expect(
      shouldRedirectToLogin({ requestUrl: PROFILE_PROBE, pathname: '/terms', hasUser: false })
    ).toBe(false);
  });

  it('lets auth endpoints handle their own 401', () => {
    expect(
      shouldRedirectToLogin({
        requestUrl: '/auth/login',
        pathname: '/login',
        hasUser: false,
      })
    ).toBe(false);
  });
});

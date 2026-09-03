import {
  isLandingRoot,
  isNoNavBarRoute,
  isPublicRoute,
  requiresWarmBackend,
} from './routes';

describe('isLandingRoot', () => {
  it('is true at the root path for a visitor', () => {
    expect(isLandingRoot('/', false)).toBe(true);
  });

  it('is false at the root path for a signed-in user', () => {
    expect(isLandingRoot('/', true)).toBe(false);
  });

  it('is false anywhere else', () => {
    expect(isLandingRoot('/projects', false)).toBe(false);
    expect(isLandingRoot('/login', false)).toBe(false);
  });
});

describe('route classification', () => {
  it('treats /landing as public and navbar-free', () => {
    expect(isPublicRoute('/landing')).toBe(true);
    expect(isNoNavBarRoute('/landing')).toBe(true);
  });

  it('keeps the root path non-public so the session can still be restored', () => {
    expect(isPublicRoute('/')).toBe(false);
  });
});

describe('requiresWarmBackend', () => {
  it('lets the backend-free pages paint without waiting', () => {
    expect(requiresWarmBackend('/landing')).toBe(false);
    expect(requiresWarmBackend('/terms')).toBe(false);
  });

  it('lets a visitor straight into the root landing', () => {
    expect(requiresWarmBackend('/', { hasCachedUser: false })).toBe(false);
  });

  it('defaults to treating the caller as a visitor', () => {
    expect(requiresWarmBackend('/')).toBe(false);
  });

  it('waits at the root path when a session was cached, since that renders the profile', () => {
    expect(requiresWarmBackend('/', { hasCachedUser: true })).toBe(true);
  });

  it('waits on the application routes', () => {
    expect(requiresWarmBackend('/projects')).toBe(true);
    expect(requiresWarmBackend('/my-cv')).toBe(true);
    expect(requiresWarmBackend('/settings')).toBe(true);
  });

  it('waits on the sign-in pages, so submitting credentials hits a warm backend', () => {
    expect(requiresWarmBackend('/login')).toBe(true);
    expect(requiresWarmBackend('/register')).toBe(true);
  });
});

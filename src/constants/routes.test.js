import { isLandingRoot, isNoNavBarRoute, isPublicRoute } from './routes';

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

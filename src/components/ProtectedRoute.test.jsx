import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../contexts/AuthContextObj';
import { SESSION_STATUS } from '../constants/session';
import { canAccess } from '../utils/authorization';

const ProtectedContent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const HomePage = () => <div>Home Page</div>;

/**
 * Builds a context value the same way AuthProvider does, so these tests exercise
 * the real authorization predicate instead of a lookalike that could drift.
 */
const makeAuthValue = (user, sessionStatus) => ({
  user,
  sessionStatus,
  authenticated: sessionStatus === SESSION_STATUS.AUTHENTICATED,
  hasRole: (roles) =>
    canAccess({ sessionStatus, role: user?.role, allowedRoles: roles }),
  token: null,
});

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (
    user = null,
    {
      allowedRoles,
      route = '/protected',
      sessionStatus = user ? SESSION_STATUS.AUTHENTICATED : SESSION_STATUS.ANONYMOUS,
    } = {}
  ) => {
    return render(
      <AuthContext.Provider value={makeAuthValue(user, sessionStatus)}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders children for a server-confirmed session', () => {
    renderProtectedRoute({ role: 'employee' });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children even though token is always null (cookie-based auth)', () => {
    renderProtectedRoute({ role: 'employee' });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null', async () => {
    renderProtectedRoute(null);

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is undefined', async () => {
    renderProtectedRoute(undefined);

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('preserves children props', () => {
    const ChildWithProps = ({ testProp }) => <div>Child: {testProp}</div>;

    render(
      <AuthContext.Provider
        value={makeAuthValue({ role: 'employee' }, SESSION_STATUS.AUTHENTICATED)}
      >
        <MemoryRouter>
          <ProtectedRoute>
            <ChildWithProps testProp="test-value" />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Child: test-value')).toBeInTheDocument();
  });

  it('works with multiple children', () => {
    render(
      <AuthContext.Provider
        value={makeAuthValue({ role: 'employee' }, SESSION_STATUS.AUTHENTICATED)}
      >
        <MemoryRouter>
          <ProtectedRoute>
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('handles session changes reactively', async () => {
    const renderWith = (user, sessionStatus) => (
      <AuthContext.Provider value={makeAuthValue(user, sessionStatus)}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const { rerender } = render(
      renderWith({ role: 'employee' }, SESSION_STATUS.AUTHENTICATED)
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    rerender(renderWith(null, SESSION_STATUS.ANONYMOUS));

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('while the session is being checked', () => {
    it('decides nothing and shows a loading state', () => {
      renderProtectedRoute(null, { sessionStatus: SESSION_STATUS.CHECKING });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('does not admit a cached user before the server has confirmed it', () => {
      renderProtectedRoute(
        { role: 'employee' },
        { sessionStatus: SESSION_STATUS.CHECKING }
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('admits once the probe resolves to an authenticated session', async () => {
      const { rerender } = render(
        <AuthContext.Provider value={makeAuthValue(null, SESSION_STATUS.CHECKING)}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <ProtectedContent />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

      rerender(
        <AuthContext.Provider
          value={makeAuthValue({ role: 'employee' }, SESSION_STATUS.AUTHENTICATED)}
        >
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <ProtectedContent />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });

  describe('role-based access', () => {
    it('renders children when user role is in allowedRoles', () => {
      renderProtectedRoute({ role: 'org_admin' }, { allowedRoles: ['org_admin'] });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to / when user role is not in allowedRoles', async () => {
      renderProtectedRoute({ role: 'employee' }, { allowedRoles: ['org_admin'] });

      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login first when there is no user, even with allowedRoles', async () => {
      renderProtectedRoute(null, { allowedRoles: ['org_admin'] });

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    });

    it('allows access when allowedRoles is omitted (backwards compatible)', () => {
      renderProtectedRoute({ role: 'employee' });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('allows access when user has unassigned role and allowedRoles includes it', () => {
      renderProtectedRoute({ role: 'unassigned' }, { allowedRoles: ['unassigned', 'org_admin'] });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to / when allowedRoles is empty array', async () => {
      renderProtectedRoute({ role: 'org_admin' }, { allowedRoles: [] });

      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });
  });

  describe('a role forged in localStorage', () => {
    it('does not open an admin route while the session is unconfirmed', () => {
      // What a tampered `user:v1` looks like on first paint.
      renderProtectedRoute(
        { role: 'org_admin' },
        { allowedRoles: ['org_admin'], sessionStatus: SESSION_STATUS.CHECKING }
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('does not open an admin route once the probe comes back anonymous', async () => {
      renderProtectedRoute(
        { role: 'org_admin' },
        { allowedRoles: ['org_admin'], sessionStatus: SESSION_STATUS.ANONYMOUS }
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});

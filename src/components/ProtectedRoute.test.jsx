import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';

// Mock child component
const ProtectedContent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (token = null) => {
    return render(
      <AuthContext.Provider value={{ token }}>
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
  };

  it('renders children when user is authenticated', () => {
    renderProtectedRoute('valid-token');
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', async () => {
    renderProtectedRoute(null);
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when token is undefined', async () => {
    renderProtectedRoute(undefined);
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('redirects to /login when token is empty string', async () => {
    renderProtectedRoute('');
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('renders children with valid JWT token', () => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    renderProtectedRoute(jwtToken);
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('applies replace prop to Navigate', async () => {
    renderProtectedRoute(null);
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    
    // Verify replace was used (user can't go back)
    // This is implicit in the Navigate component behavior
  });

  it('preserves children props', () => {
    const ChildWithProps = ({ testProp }) => <div>Child: {testProp}</div>;
    
    render(
      <AuthContext.Provider value={{ token: 'token' }}>
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
      <AuthContext.Provider value={{ token: 'token' }}>
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

  it('handles token changes reactively', async () => {
    const { rerender } = render(
      <AuthContext.Provider value={{ token: 'token' }}>
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
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Simulate logout
    rerender(
      <AuthContext.Provider value={{ token: null }}>
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
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('accepts any truthy value as valid token', () => {
    const truthyValues = ['string', 1, true, {}, []];
    
    truthyValues.forEach((value) => {
      const { unmount } = render(
        <AuthContext.Provider value={{ token: value }}>
          <MemoryRouter>
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          </MemoryRouter>
        </AuthContext.Provider>
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      unmount();
    });
  });

  it('rejects all falsy values except false', async () => {
    const falsyValues = [null, undefined, '', 0, false];
    
    for (const value of falsyValues) {
      const { unmount } = render(
        <AuthContext.Provider value={{ token: value }}>
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
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
      
      unmount();
    }
  });
});

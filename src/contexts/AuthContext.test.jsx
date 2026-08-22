import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthContext } from './AuthContextObj';
import { AuthProvider } from './AuthContext';
import * as authApi from '../api/auth';
import * as tokenStore from '../api/tokenStore';
import { isPublicRoute } from '../constants/routes';

jest.mock('../api/auth');
jest.mock('../constants/routes');

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockUseNavigate };
});

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

const validUser = { _id: '1', name: 'Test User', email: 'test@example.com', role: 'employee' };

let resolveGetProfile;

function createDeferred() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
}

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
  tokenStore.setUser(null);
  isPublicRoute.mockReturnValue(false);

  const deferred = createDeferred();
  resolveGetProfile = deferred.resolve;

  authApi.getProfile.mockReturnValue(deferred.promise);
  authApi.login.mockResolvedValue({ data: { user: validUser } });
  authApi.patchProfile.mockResolvedValue({ data: { user: validUser } });
  authApi.completeProfile.mockResolvedValue({ data: { user: validUser } });
  authApi.logout.mockResolvedValue({});
});

afterEach(() => {
  localStorage.clear();
  tokenStore.setUser(null);
});

async function resolveInitialProfile(user = validUser) {
  await act(async () => {
    resolveGetProfile({ data: { user } });
    await Promise.resolve();
  });
}

describe('AuthProvider', () => {
  describe('initialization', () => {
    it('loads cached user from localStorage and calls getProfile to validate session', async () => {
      localStorage.setItem('user:v1', JSON.stringify(validUser));

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      expect(result.current.user).toEqual(validUser);

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await resolveInitialProfile();
    });

    it('handles missing localStorage values gracefully', async () => {
      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();

      await resolveInitialProfile();
    });

    it('handles corrupted JSON in localStorage', () => {
      localStorage.setItem('user:v1', 'not-valid-json');

      expect(() => {
        renderHook(() => React.useContext(AuthContext), { wrapper });
      }).toThrow();
    });
  });

  describe('login(credentials)', () => {
    it('calls apiLogin with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'pass123' };

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.login(credentials);
      });

      expect(authApi.login).toHaveBeenCalledWith(credentials);
    });

    it('stores user in state after login', async () => {
      authApi.login.mockResolvedValueOnce({
        data: { user: validUser },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'pass' });
      });

      expect(result.current.user).toEqual(expect.objectContaining({ name: 'Test User' }));
    });

    it('token is always null (cookie-based auth)', async () => {
      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.login({ email: 'a@b.com', password: 'x' });
      });

      expect(result.current.token).toBeNull();
    });

    it('returns response data', async () => {
      const responseData = { user: validUser };
      authApi.login.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      let returnValue;
      await act(async () => {
        returnValue = await result.current.login({ email: 'a@b.com', password: 'x' });
      });

      expect(returnValue).toEqual(responseData);
    });

    it('normalizes role from login response', async () => {
      const userWithBadRole = { ...validUser, role: 'super_admin' };
      authApi.login.mockResolvedValueOnce({
        data: { user: userWithBadRole },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.login({ email: 'a@b.com', password: 'x' });
      });

      expect(result.current.user.role).toBe('unassigned');
    });

    it('propagates apiLogin errors', async () => {
      authApi.login.mockRejectedValueOnce(new Error('Invalid credentials'));

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await expect(
        act(async () => {
          await result.current.login({ email: 'a@b.com', password: 'x' });
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout()', () => {
    it('clears user from state and calls apiLogout', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).toEqual(expect.objectContaining({ name: 'Test User' }));
      });

      authApi.getProfile.mockRejectedValue(new Error('no re-auth'));

      await act(async () => {
        await result.current.logout();
      });

      expect(authApi.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('removes user from localStorage', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      authApi.getProfile.mockRejectedValue(new Error('no re-auth'));

      await act(async () => {
        await result.current.logout();
      });

      expect(localStorage.getItem('user:v1')).toBeNull();
    });

    it('proceeds with local cleanup even if backend logout fails', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });
      authApi.logout.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      authApi.getProfile.mockRejectedValue(new Error('no re-auth'));

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('user:v1')).toBeNull();
    });
  });

  describe('setSession(tokenValue, userData)', () => {
    it('stores normalized user in state and localStorage', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      act(() => {
        result.current.setSession(null, validUser);
      });

      expect(result.current.user.role).toBe('employee');
      expect(JSON.parse(localStorage.getItem('user:v1')).role).toBe('employee');
    });

    it('normalizes valid role "org_admin"', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      act(() => {
        result.current.setSession(null, { ...validUser, role: 'org_admin' });
      });

      expect(result.current.user.role).toBe('org_admin');
    });

    it('normalizes valid role "unassigned"', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      act(() => {
        result.current.setSession(null, { ...validUser, role: 'unassigned' });
      });

      expect(result.current.user.role).toBe('unassigned');
    });

    it('maps unknown role to "unassigned"', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      act(() => {
        result.current.setSession(null, { ...validUser, role: 'admin' });
      });

      expect(result.current.user.role).toBe('unassigned');
    });

    it('maps undefined role to "unassigned"', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      act(() => {
        result.current.setSession(null, { ...validUser, role: undefined });
      });

      expect(result.current.user.role).toBe('unassigned');
    });

    it('maps empty string role to "unassigned"', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      act(() => {
        result.current.setSession(null, { ...validUser, role: '' });
      });

      expect(result.current.user.role).toBe('unassigned');
    });
  });

  describe('updateProfile(profileData)', () => {
    it('normalizes role before sending to API', async () => {
      authApi.patchProfile.mockResolvedValueOnce({
        data: { user: { ...validUser, role: 'employee' } },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.updateProfile({ role: 'invalid_role' });
      });

      expect(authApi.patchProfile).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'unassigned' })
      );
    });

    it('updates user state and localStorage with response', async () => {
      const updatedUser = { ...validUser, name: 'Updated Name', role: 'org_admin' };
      authApi.patchProfile.mockResolvedValueOnce({
        data: { user: updatedUser },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.updateProfile({ name: 'Updated Name' });
      });

      expect(result.current.user.name).toBe('Updated Name');
      expect(result.current.user.role).toBe('org_admin');
      expect(JSON.parse(localStorage.getItem('user:v1')).name).toBe('Updated Name');
    });

    it('returns response data', async () => {
      const responseData = { user: validUser };
      authApi.patchProfile.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      let returnValue;
      await act(async () => {
        returnValue = await result.current.updateProfile({ name: 'X' });
      });

      expect(returnValue).toEqual(responseData);
    });

    it('handles response where user is at res.data directly', async () => {
      authApi.patchProfile.mockResolvedValueOnce({
        data: { ...validUser, name: 'Direct' },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.updateProfile({ name: 'Direct' });
      });

      expect(result.current.user.name).toBe('Direct');
    });

    it('propagates API errors', async () => {
      authApi.patchProfile.mockRejectedValueOnce(new Error('Update failed'));

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await expect(
        act(async () => {
          await result.current.updateProfile({ name: 'X' });
        })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('refreshProfile()', () => {
    it('returns null when there is no authenticated user', async () => {
      authApi.getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => { expect(authApi.getProfile).toHaveBeenCalled(); });

      let returnValue;
      await act(async () => {
        returnValue = await result.current.refreshProfile();
      });

      expect(returnValue).toBeNull();
    });

    it('fetches fresh profile and merges with existing user', async () => {
      authApi.getProfile
        .mockResolvedValueOnce({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).toEqual(expect.objectContaining({ name: 'Test User' }));
      });

      const freshUser = { _id: '1', name: 'Refreshed', role: 'employee', extra: 'field' };
      authApi.getProfile.mockResolvedValueOnce({
        data: { user: freshUser },
      });

      let returnValue;
      await act(async () => {
        returnValue = await result.current.refreshProfile();
      });

      expect(returnValue).toEqual(
        expect.objectContaining({ name: 'Refreshed', extra: 'field', email: 'test@example.com' })
      );
      expect(result.current.user.name).toBe('Refreshed');
      expect(result.current.user.email).toBe('test@example.com');
    });

    it('normalizes role from API response', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      authApi.getProfile.mockResolvedValueOnce({
        data: { user: { ...validUser, role: 'bad_role' } },
      });

      let returnValue;
      await act(async () => {
        returnValue = await result.current.refreshProfile();
      });

      expect(returnValue.role).toBe('unassigned');
    });

    it('returns current user when API returns no user data', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).toEqual(expect.objectContaining({ name: 'Test User' }));
      });

      authApi.getProfile.mockResolvedValueOnce({ data: null });

      let returnValue;
      await act(async () => {
        returnValue = await result.current.refreshProfile();
      });

      expect(returnValue).toEqual(expect.objectContaining({ name: 'Test User' }));
    });
  });

  describe('loginWithOAuth(provider)', () => {
    const originalEnv = import.meta.env;

    afterEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: originalEnv,
        configurable: true,
        writable: true,
      });
    });

    const expectNoApiUrlErrors = (consoleSpy) => {
      const appErrors = consoleSpy.mock.calls.filter(
        (call) => typeof call[0] === 'string' && call[0].includes('VITE_API_URL')
      );
      expect(appErrors).toHaveLength(0);
    };

    it('redirects to correct OAuth URL', async () => {
      Object.defineProperty(import.meta.env, 'VITE_API_URL', {
        value: 'https://api.example.com',
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      act(() => {
        result.current.loginWithOAuth('google');
      });

      expectNoApiUrlErrors(consoleSpy);
      consoleSpy.mockRestore();

      await resolveInitialProfile();
    });

    it('navigates to relative /auth/:provider when VITE_API_URL is not set', async () => {
      Object.defineProperty(import.meta.env, 'VITE_API_URL', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() =>
        act(() => {
          result.current.loginWithOAuth('google');
        })
      ).not.toThrow();

      expectNoApiUrlErrors(consoleSpy);
      consoleSpy.mockRestore();

      await resolveInitialProfile();
    });
  });

  describe('profile auto-loading on mount', () => {
    it('calls getProfile when not on public route', async () => {
      renderHook(() => React.useContext(AuthContext), { wrapper });

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await resolveInitialProfile();
    });

    it('handles getProfile failure by clearing state', async () => {
      authApi.getProfile.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });

    it('skips profile loading on public routes', async () => {
      isPublicRoute.mockReturnValue(true);

      renderHook(() => React.useContext(AuthContext), { wrapper });

      await waitFor(() => {
        expect(authApi.getProfile).not.toHaveBeenCalled();
      });
    });

    it('normalizes role from profile response', async () => {
      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await act(async () => {
        resolveGetProfile({ data: { user: { ...validUser, role: 'superadmin' } } });
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.user.role).toBe('unassigned');
      });
    });

    it('sets authenticated to true when getProfile succeeds', async () => {
      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await resolveInitialProfile();

      await waitFor(() => {
        expect(result.current.user).toEqual(expect.objectContaining({ name: 'Test User' }));
      });
    });

    it('background-refreshes when user already loaded from localStorage', async () => {
      localStorage.setItem('user:v1', JSON.stringify(validUser));
      tokenStore.setUser(validUser);

      const freshUser = { ...validUser, name: 'Refreshed' };
      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      expect(result.current.user.name).toBe('Test User');

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await act(async () => {
        resolveGetProfile({ data: { user: freshUser } });
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.user.name).toBe('Refreshed');
      });
    });

    it('does not clear cached user when background refresh fails', async () => {
      localStorage.setItem('user:v1', JSON.stringify(validUser));
      tokenStore.setUser(validUser);

      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      expect(result.current.user.name).toBe('Test User');

      await waitFor(() => {
        expect(authApi.getProfile).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(validUser);
      });

      authApi.getProfile.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.refreshProfile();
      });

      expect(result.current.user).toEqual(validUser);
    });
  });

  describe('completeOAuthProfile(profileData)', () => {
    it('normalizes invalid role to "employee" before sending', async () => {
      authApi.completeProfile.mockResolvedValueOnce({
        data: { user: validUser },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.completeOAuthProfile({ role: 'superadmin', name: 'OAuth User' });
      });

      expect(authApi.completeProfile).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'employee' })
      );
    });

    it('keeps valid role "org_admin" unchanged', async () => {
      authApi.completeProfile.mockResolvedValueOnce({
        data: { user: { ...validUser, role: 'org_admin' } },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.completeOAuthProfile({ role: 'org_admin' });
      });

      expect(authApi.completeProfile).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'org_admin' })
      );
    });

    it('sets user when response contains user data', async () => {
      const newUser = { ...validUser, name: 'OAuth User' };
      authApi.completeProfile.mockResolvedValueOnce({
        data: { user: newUser },
      });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      await act(async () => {
        await result.current.completeOAuthProfile({ role: 'employee' });
      });

      expect(result.current.user.name).toBe('OAuth User');
    });

    it('returns response data', async () => {
      const responseData = { user: validUser };
      authApi.completeProfile.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await resolveInitialProfile();

      let returnValue;
      await act(async () => {
        returnValue = await result.current.completeOAuthProfile({ role: 'employee' });
      });

      expect(returnValue).toEqual(responseData);
    });
  });

  describe('context value', () => {
    it('exposes all expected context values', async () => {
      authApi.getProfile.mockResolvedValue({ data: { user: validUser } });

      const { result } = renderHook(
        () => React.useContext(AuthContext),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('token');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('setSession');
      expect(result.current).toHaveProperty('loginWithOAuth');
      expect(result.current).toHaveProperty('updateProfile');
      expect(result.current).toHaveProperty('completeOAuthProfile');
      expect(result.current).toHaveProperty('refreshProfile');
      expect(result.current.token).toBeNull();
    });

    it('provides null context outside of provider', () => {
      const { result } = renderHook(() => React.useContext(AuthContext));

      expect(result.current).toBeNull();
    });
  });
});

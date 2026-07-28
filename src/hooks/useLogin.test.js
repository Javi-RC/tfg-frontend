import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLogin } from './useLogin';
import { AuthContext } from '../contexts/AuthContextObj';
import { validateLoginForm } from '../validators/authValidators';

jest.mock('../validators/authValidators', () => ({
  validateLoginForm: jest.fn(),
}));
jest.mock('../i18n', () => ({
  default: { use: jest.fn().mockReturnThis(), init: jest.fn(), language: 'en' },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      const translations = {
        'auth.invalidCredentials': 'Invalid email or password',
        'auth.loginError': 'An error occurred during login',
        'auth.oauthError': `OAuth error: ${opts?.detail || ''}`,
      };
      return translations[key] || key;
    },
  }),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
const mockLoginWithOAuth = jest.fn();

const mockAuthContext = {
  login: mockLogin,
  loginWithOAuth: mockLoginWithOAuth,
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
  </MemoryRouter>
);

describe('useLogin Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial state', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      expect(result.current.form).toEqual({ email: '', password: '' });
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.showPassword).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('validates form and calls login on success', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      mockLogin.mockResolvedValueOnce();

      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(validateLoginForm).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('sets validation error when form is invalid', async () => {
      validateLoginForm.mockReturnValue({ isValid: false, error: 'Email is required' });

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('Email is required');
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('handles "Invalid credentials" error with translated message', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      const error = new Error('Login failed');
      error.response = { data: { error: 'Invalid credentials' } };
      mockLogin.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('Invalid email or password');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles other backend errors', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      const error = new Error('Server error');
      error.response = { data: { error: 'Account locked' } };
      mockLogin.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('Account locked');
    });

    it('handles errors with no response data', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      const error = new Error('Network error');
      mockLogin.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('An error occurred during login');
    });

    it('sets isLoading during login and clears it after', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      let resolveLogin;
      mockLogin.mockImplementationOnce(
        () => new Promise((resolve) => { resolveLogin = resolve; })
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        resolveLogin();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('clears previous error before validation', async () => {
      validateLoginForm
        .mockReturnValueOnce({ isValid: false, error: 'Email is required' })
        .mockReturnValueOnce({ isValid: true, error: null });
      mockLogin.mockResolvedValueOnce();

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('Email is required');

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('updateField', () => {
    it('updates form field values', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      expect(result.current.form.email).toBe('test@example.com');
    });

    it('clears error when typing', async () => {
      validateLoginForm.mockReturnValue({ isValid: false, error: 'Email is required' });

      const { result } = renderHook(() => useLogin(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(result.current.error).toBe('Email is required');

      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      expect(result.current.error).toBeNull();
    });

    it('does not crash when clearing error if no error exists', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('togglePasswordVisibility', () => {
    it('toggles showPassword from false to true', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      expect(result.current.showPassword).toBe(false);

      act(() => {
        result.current.togglePasswordVisibility();
      });

      expect(result.current.showPassword).toBe(true);
    });

    it('toggles showPassword from true back to false', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.togglePasswordVisibility();
      });
      act(() => {
        result.current.togglePasswordVisibility();
      });

      expect(result.current.showPassword).toBe(false);
    });
  });

  describe('handleOAuthLogin', () => {
    it('calls loginWithOAuth with the provider', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.handleOAuthLogin('google');
      });

      expect(mockLoginWithOAuth).toHaveBeenCalledWith('google');
    });

    it('does not call loginWithOAuth when isLoading is true', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      let resolveLogin;
      mockLogin.mockImplementationOnce(
        () => new Promise((resolve) => { resolveLogin = resolve; })
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      act(() => {
        result.current.handleOAuthLogin('github');
      });

      expect(mockLoginWithOAuth).not.toHaveBeenCalled();

      await act(async () => {
        resolveLogin();
      });
    });
  });

  describe('navigateToRegister', () => {
    it('navigates to /register', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.navigateToRegister();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('does not navigate when isLoading', async () => {
      validateLoginForm.mockReturnValue({ isValid: true, error: null });
      let resolveLogin;
      mockLogin.mockImplementationOnce(
        () => new Promise((resolve) => { resolveLogin = resolve; })
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      mockNavigate.mockClear();

      act(() => {
        result.current.navigateToRegister();
      });

      expect(mockNavigate).not.toHaveBeenCalled();

      await act(async () => {
        resolveLogin();
      });
    });
  });

  describe('oauth_error from URL', () => {
    it('reads oauth_error from URL search params on mount', () => {
      const OriginalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: jest.fn((key) => (key === 'oauth_error' ? 'token_expired' : null)),
      }));

      renderHook(() => useLogin(), { wrapper });

      expect(window.history.replaceState).toHaveBeenCalled();
      global.URLSearchParams = OriginalURLSearchParams;
    });

    it('reads error param as fallback', () => {
      const OriginalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: jest.fn((key) => (key === 'error' ? 'access_denied' : null)),
      }));

      renderHook(() => useLogin(), { wrapper });

      expect(window.history.replaceState).toHaveBeenCalled();
      global.URLSearchParams = OriginalURLSearchParams;
    });

    it('does nothing when no oauth_error in URL', () => {
      const OriginalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: jest.fn(() => null),
      }));

      renderHook(() => useLogin(), { wrapper });

      expect(window.history.replaceState).not.toHaveBeenCalled();
      global.URLSearchParams = OriginalURLSearchParams;
    });
  });
});

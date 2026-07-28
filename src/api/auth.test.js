import api from './axios';
import {
  register,
  login,
  confirmAccount,
  resendConfirmation,
  getProfile,
  updateProfile,
  patchProfile,
} from './auth';

jest.mock('./axios');

describe('auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('sends POST request to /auth/register with user data', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        role: 'candidate',
      };
      const mockResponse = { data: { message: 'User registered' } };
      api.post.mockResolvedValue(mockResponse);

      const result = await register(userData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });

    it('handles registration errors', async () => {
      const userData = { email: 'test@example.com' };
      const mockError = new Error('Email already exists');
      api.post.mockRejectedValue(mockError);

      await expect(register(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('sends POST request to /auth/login with credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = { data: { token: 'jwt-token', user: {} } };
      api.post.mockResolvedValue(mockResponse);

      const result = await login(credentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });

    it('handles login errors', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      const mockError = new Error('Invalid credentials');
      api.post.mockRejectedValue(mockError);

      await expect(login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('confirmAccount', () => {
    it('sends GET request to /auth/confirm with token', async () => {
      const token = 'confirmation-token-123';
      const mockResponse = { data: { message: 'Account confirmed' } };
      api.get.mockResolvedValue(mockResponse);

      const result = await confirmAccount(token);

      expect(api.get).toHaveBeenCalledWith(`/auth/confirm?token=${encodeURIComponent(token)}`);
      expect(result).toEqual(mockResponse);
    });

    it('encodes special characters in token', async () => {
      const token = 'token+with/special=chars';
      const mockResponse = { data: {} };
      api.get.mockResolvedValue(mockResponse);

      await confirmAccount(token);

      expect(api.get).toHaveBeenCalledWith(`/auth/confirm?token=${encodeURIComponent(token)}`);
    });

    it('handles confirmation errors', async () => {
      const token = 'invalid-token';
      const mockError = new Error('Invalid or expired token');
      api.get.mockRejectedValue(mockError);

      await expect(confirmAccount(token)).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('resendConfirmation', () => {
    it('sends POST request to /auth/send-confirmation', async () => {
      const data = { email: 'test@example.com' };
      const mockResponse = { data: { message: 'Confirmation email sent' } };
      api.post.mockResolvedValue(mockResponse);

      const result = await resendConfirmation(data);

      expect(api.post).toHaveBeenCalledWith('/auth/send-confirmation', data);
      expect(result).toEqual(mockResponse);
    });

    it('handles resend errors', async () => {
      const data = { email: 'nonexistent@example.com' };
      const mockError = new Error('User not found');
      api.post.mockRejectedValue(mockError);

      await expect(resendConfirmation(data)).rejects.toThrow('User not found');
    });
  });

  describe('getProfile', () => {
    it('sends GET request to /api/profile', async () => {
      const mockProfile = {
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
          },
        },
      };
      api.get.mockResolvedValue(mockProfile);

      const result = await getProfile();

      expect(api.get).toHaveBeenCalledWith('/api/profile');
      expect(result).toEqual(mockProfile);
    });

    it('handles unauthorized errors', async () => {
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(getProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('sends PUT request to /auth/profile with profile data', async () => {
      const profileData = {
        username: 'newusername',
        bio: 'New bio',
      };
      const mockResponse = { data: { user: { ...profileData } } };
      api.put.mockResolvedValue(mockResponse);

      const result = await updateProfile(profileData);

      expect(api.put).toHaveBeenCalledWith('/auth/profile', profileData);
      expect(result).toEqual(mockResponse);
    });

    it('handles update errors', async () => {
      const profileData = { username: 'taken' };
      const mockError = new Error('Username already taken');
      api.put.mockRejectedValue(mockError);

      await expect(updateProfile(profileData)).rejects.toThrow('Username already taken');
    });
  });

  describe('patchProfile', () => {
    it('sends PATCH request to /api/profile with partial data', async () => {
      const profileData = { bio: 'Updated bio only' };
      const mockResponse = { data: { user: { bio: 'Updated bio only' } } };
      api.patch.mockResolvedValue(mockResponse);

      const result = await patchProfile(profileData);

      expect(api.patch).toHaveBeenCalledWith('/api/profile', profileData);
      expect(result).toEqual(mockResponse);
    });

    it('allows updating single field', async () => {
      const profileData = { username: 'newnameonly' };
      const mockResponse = { data: { user: { username: 'newnameonly' } } };
      api.patch.mockResolvedValue(mockResponse);

      await patchProfile(profileData);

      expect(api.patch).toHaveBeenCalledWith('/api/profile', profileData);
    });

    it('handles patch errors', async () => {
      const profileData = { invalid: 'field' };
      const mockError = new Error('Invalid field');
      api.patch.mockRejectedValue(mockError);

      await expect(patchProfile(profileData)).rejects.toThrow('Invalid field');
    });
  });
});

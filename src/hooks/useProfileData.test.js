import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfileData } from './useProfileData';
import { getProfile } from '../api/auth';

jest.mock('../api/auth');

describe('useProfileData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('initial state', () => {
    it('starts with loading true and profile null', () => {
      getProfile.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProfileData());

      expect(result.current.loading).toBe(true);
      expect(result.current.profile).toBeNull();
      expect(result.current.profileUser).toBeNull();
    });
  });

  describe('calls loadProfile on mount', () => {
    it('calls getProfile automatically on mount', () => {
      getProfile.mockResolvedValue({ data: { user: { name: 'Test' } } });
      renderHook(() => useProfileData());

      expect(getProfile).toHaveBeenCalledTimes(1);
    });

    it('sets loading to false after successful fetch', async () => {
      getProfile.mockResolvedValue({ data: { user: { name: 'Test' } } });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('sets profile from response.data', async () => {
      const profileData = { user: { name: 'Alice' } };
      getProfile.mockResolvedValue({ data: profileData });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.profile).toEqual(profileData);
      });
    });
  });

  describe('derives profileUser', () => {
    it('derives profileUser from data.data.user shape', async () => {
      const user = { name: 'Alice', role: 'employee' };
      getProfile.mockResolvedValue({ data: { data: { user } } });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.profileUser).toEqual(user);
      });
    });

    it('derives profileUser from data.user shape', async () => {
      const user = { name: 'Bob', role: 'org_admin' };
      getProfile.mockResolvedValue({ data: { user } });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.profileUser).toEqual(user);
      });
    });

    it('derives profileUser from raw data shape (no nesting)', async () => {
      const user = { name: 'Charlie' };
      getProfile.mockResolvedValue({ data: user });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.profileUser).toEqual(user);
      });
    });

    it('returns null profileUser when profile is null', () => {
      getProfile.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useProfileData());

      expect(result.current.profileUser).toBeNull();
    });
  });

  describe('handles API errors', () => {
    it('sets loading false and logs error on failure', async () => {
      const error = new Error('Network error');
      getProfile.mockRejectedValue(error);

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error loading profile:', error);
    });
  });

  describe('manual loadProfile', () => {
    it('can be called manually to reload profile', async () => {
      getProfile.mockResolvedValue({ data: { user: { name: 'Alice' } } });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      getProfile.mockResolvedValue({ data: { user: { name: 'Alice Updated' } } });

      await act(async () => {
        await result.current.loadProfile();
      });

      await waitFor(() => {
        expect(result.current.profileUser).toEqual({ name: 'Alice Updated' });
      });
      expect(getProfile).toHaveBeenCalledTimes(2);
    });
  });

  describe('null/undefined responses', () => {
    it('handles null response data', async () => {
      getProfile.mockResolvedValue({ data: null });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.profileUser).toBeNull();
    });

    it('handles undefined response data', async () => {
      getProfile.mockResolvedValue({ data: undefined });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeUndefined();
      expect(result.current.profileUser).toBeNull();
    });

    it('handles response with empty data object', async () => {
      getProfile.mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toEqual({});
      expect(result.current.profileUser).toEqual({});
    });
  });

  describe('setProfile', () => {
    it('allows setting profile directly', async () => {
      getProfile.mockResolvedValue({ data: { user: { name: 'Alice' } } });

      const { result } = renderHook(() => useProfileData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setProfile({ user: { name: 'Manual' } });
      });

      expect(result.current.profile).toEqual({ user: { name: 'Manual' } });
    });
  });
});

import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useProfileEdit } from './useProfileEdit';
import { getProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContextObj';

jest.mock('i18next', () => {
  const i18n = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn(),
    t: jest.fn((key) => key),
    language: 'en',
  };
  return { default: i18n, __esModule: true };
});

jest.mock('i18next-browser-languagedetector', () => ({
  default: jest.fn().mockImplementation(() => ({ type: 'languageDetector', init: () => {}, detect: () => 'en' })),
  __esModule: true,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  initReactI18next: { type: 'languageDetector', init: () => {} },
}));

jest.mock('../api/auth');

const mockUpdateProfile = jest.fn();

const createWrapper = (updateProfile = mockUpdateProfile) => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={{ updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
  return wrapper;
};

const fullProfileUser = {
  name: 'Alice',
  username: 'alice01',
  country: 'Spain',
  timezone: 'Europe/Madrid',
  flexibleSchedule: true,
  preferredWorkingHours: { start: '09:00', end: '17:00' },
  notificationPreferences: { email: false, inApp: true },
};

const minimalProfileUser = {
  name: 'Minimal',
  country: '',
  timezone: '',
  flexibleSchedule: false,
  preferredWorkingHours: {},
  notificationPreferences: {},
};

const usernameOnlyUser = { username: 'fallback_user' };

describe('useProfileEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultOpts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };

  describe('startEditing', () => {
    it('sets editMode to true', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.editMode).toBe(true);
    });

    it('builds draft from profileUser', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.draft).toEqual({
        name: 'Alice',
        jobTitle: '',
        bio: '',
        country: 'Spain',
        timezone: 'Europe/Madrid',
        flexibleSchedule: true,
        preferredWorkingHours: { start: '09:00', end: '17:00' },
        notificationPreferences: { email: false, inApp: true },
      });
    });

    it('clears saveError and saveSuccess', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.saveError).toBeNull();
      expect(result.current.saveSuccess).toBeNull();
    });
  });

  describe('cancelEditing', () => {
    it('resets editMode to false', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.editMode).toBe(false);
    });

    it('resets draft back to profileUser values', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateDraftField('name', 'Modified');
      });
      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.draft.name).toBe('Alice');
    });

    it('clears saveError and saveSuccess', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.saveError).toBeNull();
      expect(result.current.saveSuccess).toBeNull();
    });
  });

  describe('updateDraftField', () => {
    it('updates a top-level field', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateDraftField('name', 'Bob');
      });

      expect(result.current.draft.name).toBe('Bob');
    });

    it('updates country field', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateDraftField('country', 'France');
      });

      expect(result.current.draft.country).toBe('France');
    });

    it('updates timezone field', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateDraftField('timezone', 'America/New_York');
      });

      expect(result.current.draft.timezone).toBe('America/New_York');
    });
  });

  describe('updateNestedField', () => {
    it('updates a nested field within preferredWorkingHours', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateNestedField('preferredWorkingHours', 'start', '08:00');
      });

      expect(result.current.draft.preferredWorkingHours.start).toBe('08:00');
      expect(result.current.draft.preferredWorkingHours.end).toBe('17:00');
    });

    it('updates a nested field within notificationPreferences', () => {
      const { result } = renderHook(() => useProfileEdit(defaultOpts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateNestedField('notificationPreferences', 'email', true);
      });

      expect(result.current.draft.notificationPreferences.email).toBe(true);
    });
  });

  describe('saveProfile - validation', () => {
    it('rejects name shorter than 2 characters', async () => {
      const opts = { profileUser: { ...fullProfileUser, name: 'A' }, onProfileUpdated: jest.fn() };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.nameLength');
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });

    it('rejects empty name when no username fallback', async () => {
      const emptyNameUser = { name: '', username: '', country: 'Spain', timezone: 'Europe/Madrid' };
      const opts = { profileUser: emptyNameUser, onProfileUpdated: jest.fn() };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.draft.name).toBe('');

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.nameLength');
    });

    it('rejects invalid timezone format', async () => {
      const opts = { profileUser: { ...fullProfileUser, timezone: 'invalid-tz' }, onProfileUpdated: jest.fn() };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.timezoneInvalid');
    });

    it('accepts valid IANA timezone', async () => {
      const opts = { profileUser: { ...fullProfileUser, name: 'ValidUser' }, onProfileUpdated: jest.fn() };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue({ data: { user: { name: 'ValidUser' } } });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.saveError).toBeNull();
    });

    it('rejects incomplete working hours (start without end)', async () => {
      const opts = {
        profileUser: { ...fullProfileUser, preferredWorkingHours: { start: '09:00', end: '' } },
        onProfileUpdated: jest.fn(),
      };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.workHoursIncomplete');
    });

    it('rejects incomplete working hours (end without start)', async () => {
      const opts = {
        profileUser: { ...fullProfileUser, preferredWorkingHours: { start: '', end: '17:00' } },
        onProfileUpdated: jest.fn(),
      };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.workHoursIncomplete');
    });

    it('rejects invalid working hours format', async () => {
      const opts = {
        profileUser: { ...fullProfileUser, preferredWorkingHours: { start: '9am', end: '5pm' } },
        onProfileUpdated: jest.fn(),
      };
      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('profile.validation.workHoursFormat');
    });
  });

  describe('saveProfile - successful save', () => {
    it('calls updateAuthProfile and getProfile on success', async () => {
      const onProfileUpdated = jest.fn();
      const refreshedData = { user: { name: 'Alice', country: 'Spain' } };
      const opts = { profileUser: fullProfileUser, onProfileUpdated };

      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue({ data: refreshedData });

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(true);
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
      expect(getProfile).toHaveBeenCalledTimes(1);
      expect(onProfileUpdated).toHaveBeenCalledWith(refreshedData);
    });

    it('builds correct payload from draft', async () => {
      const opts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };
      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue({ data: { user: fullProfileUser } });

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'Alice',
        jobTitle: '',
        bio: '',
        flexibleSchedule: true,
        notificationPreferences: { email: false, inApp: true },
        country: 'Spain',
        timezone: 'Europe/Madrid',
        preferredWorkingHours: { start: '09:00', end: '17:00' },
      });
    });

    it('omits optional fields when empty', async () => {
      const profileNoOptional = { name: 'Minimal', country: '', timezone: '' };
      const opts = { profileUser: profileNoOptional, onProfileUpdated: jest.fn() };
      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue({ data: { user: profileNoOptional } });

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      const payload = mockUpdateProfile.mock.calls[0][0];
      expect(payload).not.toHaveProperty('country');
      expect(payload).not.toHaveProperty('timezone');
      expect(payload).not.toHaveProperty('preferredWorkingHours');
    });

    it('sets editMode to false and saveSuccess on success', async () => {
      const opts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };
      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue({ data: { user: fullProfileUser } });

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.editMode).toBe(false);
      expect(result.current.saveSuccess).toBe('profile.updateSuccess');
    });

    it('calls onProfileUpdated callback with refreshed data', async () => {
      const onProfileUpdated = jest.fn();
      const refreshedData = { data: { user: { name: 'Alice' } } };
      const opts = { profileUser: fullProfileUser, onProfileUpdated };

      mockUpdateProfile.mockResolvedValue({});
      getProfile.mockResolvedValue(refreshedData);

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(onProfileUpdated).toHaveBeenCalledWith(refreshedData.data);
    });
  });

  describe('saveProfile - error handling', () => {
    it('sets saveError on updateAuthProfile failure', async () => {
      const opts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };
      const error = { response: { data: { message: 'Server error' } } };
      mockUpdateProfile.mockRejectedValue(error);

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
      expect(result.current.saveError).toBe('Server error');
      expect(result.current.saving).toBe(false);
    });

    it('returns false on failure', async () => {
      const opts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };
      mockUpdateProfile.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toBe(false);
    });

    it('sets saving to true during save and false after', async () => {
      const opts = { profileUser: fullProfileUser, onProfileUpdated: jest.fn() };
      let resolveUpdate;
      mockUpdateProfile.mockImplementation(
        () => new Promise((resolve) => { resolveUpdate = resolve; })
      );

      const { result } = renderHook(() => useProfileEdit(opts), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.saveProfile();
      });

      await waitFor(() => {
        expect(result.current.saving).toBe(true);
      });

      getProfile.mockResolvedValue({ data: { user: fullProfileUser } });

      await act(async () => {
        resolveUpdate({});
      });

      await waitFor(() => {
        expect(result.current.saving).toBe(false);
      });
    });
  });

  describe('profileUser changes rebuild draft', () => {
    it('rebuilds draft when profileUser changes outside editMode', async () => {
      const initialUser = { ...fullProfileUser, name: 'Alice' };
      const updatedUser = { ...fullProfileUser, name: 'Bob' };
      const onProfileUpdated = jest.fn();

      const { result, rerender } = renderHook(
        ({ profileUser }) => useProfileEdit({ profileUser, onProfileUpdated }),
        {
          wrapper: createWrapper(),
          initialProps: { profileUser: initialUser },
        }
      );

      await waitFor(() => {
        expect(result.current.draft.name).toBe('Alice');
      });

      rerender({ profileUser: updatedUser });

      await waitFor(() => {
        expect(result.current.draft.name).toBe('Bob');
      });
    });

    it('does not rebuild draft when profileUser changes in editMode', async () => {
      const initialUser = { ...fullProfileUser, name: 'Alice' };
      const updatedUser = { ...fullProfileUser, name: 'Bob' };
      const onProfileUpdated = jest.fn();

      const { result, rerender } = renderHook(
        ({ profileUser }) => useProfileEdit({ profileUser, onProfileUpdated }),
        {
          wrapper: createWrapper(),
          initialProps: { profileUser: initialUser },
        }
      );

      act(() => {
        result.current.startEditing();
      });
      act(() => {
        result.current.updateDraftField('name', 'Editing');
      });

      rerender({ profileUser: updatedUser });

      expect(result.current.draft.name).toBe('Editing');
    });
  });

  describe('null profileUser', () => {
    it('does not crash with null profileUser', () => {
      const opts = { profileUser: null, onProfileUpdated: jest.fn() };
      const { result } = renderHook(
        () => useProfileEdit(opts),
        { wrapper: createWrapper() }
      );

      expect(result.current.editMode).toBe(false);
      expect(result.current.draft).toEqual({
        name: '',
        jobTitle: '',
        bio: '',
        country: '',
        timezone: '',
        flexibleSchedule: false,
        preferredWorkingHours: { start: '', end: '' },
        notificationPreferences: { email: true, inApp: true },
      });
    });
  });

  describe('extractApiErrorMessage', () => {
    const getSaveError = async (error) => {
      const opts = { profileUser: { ...fullProfileUser, name: 'TestUser' }, onProfileUpdated: jest.fn() };
      mockUpdateProfile.mockRejectedValue(error);

      const { result } = renderHook(
        () => useProfileEdit(opts),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.startEditing();
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      return result.current.saveError;
    };

    it('extracts message from response.data.message', async () => {
      const err = await getSaveError({ response: { data: { message: 'Custom msg' } } });
      expect(err).toBe('Custom msg');
    });

    it('extracts message from response.data.error', async () => {
      const err = await getSaveError({ response: { data: { error: 'Error field' } } });
      expect(err).toBe('Error field');
    });

    it('extracts message when response.data is a string', async () => {
      const err = await getSaveError({ response: { data: 'String error' } });
      expect(err).toBe('String error');
    });

    it('returns default when response.data is missing', async () => {
      const err = await getSaveError(new Error('no data'));
      expect(err).toBe('profile.errors.updateFailed');
    });

    it('returns default when error has no response', async () => {
      const err = await getSaveError({});
      expect(err).toBe('profile.errors.updateFailed');
    });
  });

  describe('buildDraftFromUser edge cases', () => {
    it('falls back to username when name is missing', async () => {
      const opts = { profileUser: usernameOnlyUser, onProfileUpdated: jest.fn() };
      const { result } = renderHook(
        () => useProfileEdit(opts),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.draft.name).toBe('fallback_user');
      });
    });

    it('defaults fields when profileUser has no optional fields', async () => {
      const opts = { profileUser: minimalProfileUser, onProfileUpdated: jest.fn() };
      const { result } = renderHook(
        () => useProfileEdit(opts),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.draft).toEqual({
          name: 'Minimal',
          jobTitle: '',
          bio: '',
          country: '',
          timezone: '',
          flexibleSchedule: false,
          preferredWorkingHours: { start: '', end: '' },
          notificationPreferences: { email: true, inApp: true },
        });
      });
    });
  });
});

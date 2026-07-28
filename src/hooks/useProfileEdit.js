import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

const buildDraftFromUser = (u) => {
  const preferredWorkingHours = u?.preferredWorkingHours || {};
  const notificationPreferences = u?.notificationPreferences || {};

  return {
    name: u?.name || u?.username || '',
    country: u?.country || '',
    timezone: u?.timezone || '',
    flexibleSchedule: Boolean(u?.flexibleSchedule),
    preferredWorkingHours: {
      start: preferredWorkingHours?.start || '',
      end: preferredWorkingHours?.end || '',
    },
    notificationPreferences: {
      email: notificationPreferences?.email ?? true,
      inApp: notificationPreferences?.inApp ?? true,
    },
  };
};

/**
 * Custom hook for draft editing, validation & saving
 * @param {Object} options
 * @param {Object|null} options.profileUser - Current profile user object
 * @param {Function} options.onProfileUpdated - Callback to update profile state after save
 */
export function useProfileEdit({ profileUser, onProfileUpdated }) {
  const { t } = useTranslation();
  const { updateProfile: updateAuthProfile } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [draft, setDraft] = useState({
    name: '',
    country: '',
    timezone: '',
    flexibleSchedule: false,
    preferredWorkingHours: { start: '', end: '' },
    notificationPreferences: { email: true, inApp: true },
  });

  const effectiveDraft = editMode ? draft : (profileUser ? buildDraftFromUser(profileUser) : draft);

  const validateDraft = (data) => {
    const trimmedName = (data.name || '').trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return t('profile.validation.nameLength');
    }

    const tz = (data.timezone || '').trim();
    if (tz) {
      const ianaLike = /^[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+$/;
      if (!ianaLike.test(tz)) {
        return t('profile.validation.timezoneInvalid');
      }
    }

    const start = (data.preferredWorkingHours?.start || '').trim();
    const end = (data.preferredWorkingHours?.end || '').trim();
    const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
    if ((start && !end) || (!start && end)) {
      return t('profile.validation.workHoursIncomplete');
    }
    if (start && end) {
      if (!hhmm.test(start) || !hhmm.test(end)) {
        return t('profile.validation.workHoursFormat');
      }
    }

    return null;
  };

  const extractApiErrorMessage = (err) => {
    const data = err?.response?.data;
    if (!data) return t('profile.errors.updateFailed');
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return t('profile.errors.updateFailed');
  };

  /**
   * Start editing profile
   */
  const startEditing = () => {
    setDraft(buildDraftFromUser(profileUser));
    setEditMode(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    setDraft(buildDraftFromUser(profileUser));
    setEditMode(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  /**
   * Update draft field
   */
  const updateDraftField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Update nested draft field
   */
  const updateNestedField = (parent, child, value) => {
    setDraft((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };

  /**
   * Save profile changes
   */
  const saveProfile = async () => {
    setSaveError(null);
    setSaveSuccess(null);

    const validationError = validateDraft(effectiveDraft);
    if (validationError) {
      setSaveError(validationError);
      return false;
    }

    const payload = {
      name: (effectiveDraft.name || '').trim(),
      flexibleSchedule: Boolean(effectiveDraft.flexibleSchedule),
      notificationPreferences: {
        email: Boolean(effectiveDraft.notificationPreferences?.email),
        inApp: Boolean(effectiveDraft.notificationPreferences?.inApp),
      },
    };

    const country = (effectiveDraft.country || '').trim();
    if (country) payload.country = country;

    const timezone = (effectiveDraft.timezone || '').trim();
    if (timezone) payload.timezone = timezone;

    const start = (effectiveDraft.preferredWorkingHours?.start || '').trim();
    const end = (effectiveDraft.preferredWorkingHours?.end || '').trim();
    if (start && end) {
      payload.preferredWorkingHours = { start, end };
    }

    setSaving(true);
    try {
      await updateAuthProfile(payload);
      const refreshed = await getProfile();
      onProfileUpdated(refreshed.data);
      setEditMode(false);
      setSaveSuccess(t('profile.updateSuccess'));
      return true;
    } catch (err) {
      setSaveError(extractApiErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    editMode,
    saving,
    saveError,
    saveSuccess,
    draft: effectiveDraft,
    startEditing,
    cancelEditing,
    updateDraftField,
    updateNestedField,
    saveProfile,
  };
}

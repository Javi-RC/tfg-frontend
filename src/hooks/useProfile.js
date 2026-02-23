import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';
import { getCVConsent, updateCVConsent } from '../api/cvConsent';
import { getPersonalityConsent, updatePersonalityConsent } from '../api/personalityConsent';
import { normalizeConsentResponse } from '../utils/consent';
import { getMyOrganizations, getOrganizationById } from '../api/organization';

/**
 * Custom hook for Profile page business logic
 * Manages user profile, consent, and preferences
 */
export function useProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: authUser, updateProfile: updateAuthProfile } = useContext(AuthContext);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [consentLoading, setConsentLoading] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [consentSuccess, setConsentSuccess] = useState(null);
  const [consentData, setConsentData] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Personality consent state
  const [personalityConsentLoading, setPersonalityConsentLoading] = useState(false);
  const [personalityConsentError, setPersonalityConsentError] = useState(null);
  const [personalityConsentSuccess, setPersonalityConsentSuccess] = useState(null);
  const [personalityConsentData, setPersonalityConsentData] = useState(null);
  const [hasPersonalityConsent, setHasPersonalityConsent] = useState(false);
  const [showPersonalityConsentModal, setShowPersonalityConsentModal] = useState(false);

  const [resolvedOrganizationName, setResolvedOrganizationName] = useState(null);
  const [resolvingOrganization, setResolvingOrganization] = useState(false);
  
  const [draft, setDraft] = useState({
    name: '',
    country: '',
    timezone: '',
    flexibleSchedule: false,
    preferredWorkingHours: { start: '', end: '' },
    notificationPreferences: { email: true, inApp: true}
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadConsent(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    
    loadPersonalityConsent(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        end: preferredWorkingHours?.end || ''
      },
      notificationPreferences: {
        email: notificationPreferences?.email ?? true,
        inApp: notificationPreferences?.inApp ?? true,
      }
    };
  };

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
   * Load user profile
   */
  const loadProfile = async () => {
    try {
      const res = await getProfile();
      console.log('[useProfile] Full response:', res);
      console.log('[useProfile] res.data:', res.data);
      console.log('[useProfile] res.data.data:', res.data?.data);
      console.log('[useProfile] res.data.data.user:', res.data?.data?.user);
      setProfile(res.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load CV consent status
   */
  const loadConsent = async () => {
    setConsentLoading(true);
    setConsentError(null);
    
    try {
      const res = await getCVConsent();
      const normalized = normalizeConsentResponse(res?.data);
      setHasConsent(normalized.hasConsent);
      setConsentData(normalized.consent);
    } catch (err) {
      setHasConsent(false);
      setConsentData(null);
      setConsentError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        t('profile.errors.consentLoadFailed')
      );
    } finally {
      setConsentLoading(false);
    }
  };

  /**
   * Get profile user (memoized)
   */
  const profileUser = useMemo(() => {
    if (!profile) return null;
    console.log('[useProfile] profile object:', profile);
    // Handle nested response: { success: true, data: { user: {...} } }
    if (profile.data?.user) {
      console.log('[useProfile] Using profile.data.user:', profile.data.user);
      return profile.data.user;
    }
    // Handle direct response: { user: {...} }
    if (profile.user) {
      console.log('[useProfile] Using profile.user:', profile.user);
      return profile.user;
    }
    // Fallback to profile itself
    console.log('[useProfile] Using profile directly:', profile);
    return profile;
  }, [profile]);

  const isLikelyObjectId = (value) =>
    typeof value === 'string' && /^[a-f\d]{24}$/i.test(value.trim());

  const getOrganizationValue = (primaryUser, fallbackUser) => {
    const candidate =
      primaryUser?.organization ??
      primaryUser?.organizationId ??
      primaryUser?.organization_id ??
      primaryUser?.orgId ??
      primaryUser?.org ??
      primaryUser?.organizationRef ??
      fallbackUser?.organization ??
      fallbackUser?.organizationId ??
      fallbackUser?.organization_id ??
      fallbackUser?.orgId ??
      fallbackUser?.org ??
      fallbackUser?.organizationRef;

    if (Array.isArray(candidate)) {
      if (candidate.length === 0) return null;
      return candidate[0];
    }

    if (primaryUser?.organizations && Array.isArray(primaryUser.organizations) && primaryUser.organizations.length > 0) {
      return primaryUser.organizations[0];
    }

    if (fallbackUser?.organizations && Array.isArray(fallbackUser.organizations) && fallbackUser.organizations.length > 0) {
      return fallbackUser.organizations[0];
    }

    return candidate ?? null;
  };

  useEffect(() => {
    let mounted = true;

    const resolveOrganization = async () => {
      setResolvedOrganizationName(null);
      setResolvingOrganization(false);

      const orgValue = getOrganizationValue(profileUser, authUser);
      console.log('[useProfile] Resolving organization:', orgValue);
      console.log('[useProfile] orgValue type:', typeof orgValue);
      
      if (!orgValue) {
        console.log('[useProfile] No organization value, checking my organizations');
        setResolvingOrganization(true);
        try {
          const res = await getMyOrganizations();
          const list = res?.data?.success ? res?.data?.data : res?.data;
          const firstOrg = Array.isArray(list) ? list[0] : null;
          const name = firstOrg?.name || firstOrg?.title || null;
          if (mounted) setResolvedOrganizationName(name);
        } catch (err) {
          console.error('Error loading my organizations:', err);
          if (mounted) setResolvedOrganizationName(null);
        } finally {
          if (mounted) setResolvingOrganization(false);
        }
        return;
      }

      if (typeof orgValue === 'object') {
        console.log('[useProfile] Organization is object:', orgValue);
        const name = orgValue?.name || orgValue?.title || orgValue?.organizationName;
        console.log('[useProfile] Extracted name:', name);
        if (mounted) setResolvedOrganizationName(name || null);
        return;
      }

      if (!isLikelyObjectId(orgValue)) {
        if (mounted) setResolvedOrganizationName(String(orgValue));
        return;
      }

      setResolvingOrganization(true);
      try {
        const res = await getOrganizationById(orgValue);
        const org = (res?.data?.success && res?.data?.data) ? res.data.data : res?.data;
        const name = org?.name || org?.title || null;
        if (mounted) setResolvedOrganizationName(name);
      } catch (err) {
        console.error('Error resolving organization:', err);
        if (mounted) setResolvedOrganizationName(null);
      } finally {
        if (mounted) setResolvingOrganization(false);
      }
    };

    resolveOrganization();
    return () => {
      mounted = false;
    };
  }, [profileUser, authUser]);

  useEffect(() => {
    if (!profileUser) return;
    if (editMode) return;
    setDraft(buildDraftFromUser(profileUser));
  }, [profileUser, editMode]);

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
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Update nested draft field
   */
  const updateNestedField = (parent, child, value) => {
    setDraft(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  /**
   * Save profile changes
   */
  const saveProfile = async () => {
    setSaveError(null);
    setSaveSuccess(null);

    const validationError = validateDraft(draft);
    if (validationError) {
      setSaveError(validationError);
      return false;
    }

    const payload = {
      name: (draft.name || '').trim(),
      flexibleSchedule: Boolean(draft.flexibleSchedule),
      notificationPreferences: {
        email: Boolean(draft.notificationPreferences?.email),
        inApp: Boolean(draft.notificationPreferences?.inApp),
      }
    };

    const country = (draft.country || '').trim();
    if (country) payload.country = country;

    const timezone = (draft.timezone || '').trim();
    if (timezone) payload.timezone = timezone;

    const start = (draft.preferredWorkingHours?.start || '').trim();
    const end = (draft.preferredWorkingHours?.end || '').trim();
    if (start && end) {
      payload.preferredWorkingHours = { start, end };
    }

    setSaving(true);
    try {
      await updateAuthProfile(payload);
      const refreshed = await getProfile();
      setProfile(refreshed.data);
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

  const openConsentModal = () => {
    setConsentError(null);
    setConsentSuccess(null);
    setShowConsentModal(true);
  };

  const closeConsentModal = () => {
    setShowConsentModal(false);
  };

  const handleConsentAccepted = async () => {
    setShowConsentModal(false);
    setConsentSuccess(t('profile.success.consentSaved'));
    await loadConsent();
  };

  const revokeConsent = async () => {
    setConsentError(null);
    setConsentSuccess(null);
    setConsentLoading(true);

    try {
      const res = await updateCVConsent({ accepted: false });
      const normalized = normalizeConsentResponse(res?.data);
      setHasConsent(normalized.hasConsent);
      setConsentData(normalized.consent);
      setConsentSuccess(
        t('profile.consentRevokedDetail')
      );
      return true;
    } catch (err) {
      setConsentError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          t('profile.consentRevokeError')
      );
      return false;
    } finally {
      setConsentLoading(false);
    }
  };

  /**
   * Navigate to CV page
   */
  const navigateToCV = () => {
    navigate('/my-cv');
  };

  const navigateToCVStats = () => {
    navigate('/cv-stats');
  };

  const navigateToAdminCVs = () => {
    navigate('/admin/cvs');
  };

  /**
   * Load personality consent status
   */
  const loadPersonalityConsent = async () => {
    setPersonalityConsentLoading(true);
    setPersonalityConsentError(null);

    try {
      const res = await getPersonalityConsent();
      const normalized = normalizeConsentResponse(res?.data);
      setHasPersonalityConsent(normalized.hasConsent);
      setPersonalityConsentData(normalized.consent);
    } catch (err) {
      // Only log error, don't reset consent state — preserves optimistic updates
      setPersonalityConsentError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        t('profile.errors.personalityConsentLoadFailed')
      );
    } finally {
      setPersonalityConsentLoading(false);
    }
  };

  const openPersonalityConsentModal = () => {
    setPersonalityConsentError(null);
    setPersonalityConsentSuccess(null);
    setShowPersonalityConsentModal(true);
  };

  const closePersonalityConsentModal = () => {
    setShowPersonalityConsentModal(false);
  };

  const handlePersonalityConsentAccepted = async (responseData) => {
    setShowPersonalityConsentModal(false);
    const normalized = normalizeConsentResponse(responseData);
    setHasPersonalityConsent(normalized.hasConsent || true);
    setPersonalityConsentData(normalized.consent || null);
    setPersonalityConsentSuccess(t('profile.personalityConsent.granted'));

    try {
      await loadPersonalityConsent();
    } catch {
      // Keep the optimistic update even if refresh fails
    }
  };

  const revokePersonalityConsent = async () => {
    setPersonalityConsentError(null);
    setPersonalityConsentSuccess(null);
    setPersonalityConsentLoading(true);

    try {
      await updatePersonalityConsent({ accepted: false });
      setHasPersonalityConsent(false);
      setPersonalityConsentData(null);
      setPersonalityConsentSuccess(t('profile.personalityConsent.revoked'));
      return true;
    } catch (err) {
      setPersonalityConsentError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          t('profile.personalityConsent.revokeError')
      );
      return false;
    } finally {
      setPersonalityConsentLoading(false);
    }
  };

  return {
    authUser,
    // State
    profile,
    profileUser,
    loading,
    editMode,
    saving,
    saveError,
    saveSuccess,
    draft,
    
    // Consent state
    consentLoading,
    consentError,
    consentSuccess,
    consentData,
    hasConsent,
    showConsentModal,
    
    // Organization state
    resolvedOrganizationName,
    resolvingOrganization,
    
    // Actions
    startEditing,
    cancelEditing,
    updateDraftField,
    updateNestedField,
    saveProfile,
    openConsentModal,
    closeConsentModal,
    handleConsentAccepted,
    revokeConsent,
    navigateToCV,
    navigateToCVStats,
    navigateToAdminCVs,
    loadProfile,
    loadConsent,

    // Personality consent state
    personalityConsentLoading,
    personalityConsentError,
    personalityConsentSuccess,
    personalityConsentData,
    hasPersonalityConsent,
    showPersonalityConsentModal,

    // Personality consent actions
    loadPersonalityConsent,
    openPersonalityConsentModal,
    closePersonalityConsentModal,
    handlePersonalityConsentAccepted,
    revokePersonalityConsent
  };
}

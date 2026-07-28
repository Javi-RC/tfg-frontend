import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPersonalityConsent, updatePersonalityConsent } from '../api/personalityConsent';
import { normalizeConsentResponse } from '../utils/consent';

/**
 * Custom hook for personality consent CRUD & modal
 */
export function usePersonalityConsent() {
  const { t } = useTranslation();

  const [personalityConsentLoading, setPersonalityConsentLoading] = useState(false);
  const [personalityConsentError, setPersonalityConsentError] = useState(null);
  const [personalityConsentSuccess, setPersonalityConsentSuccess] = useState(null);
  const [personalityConsentData, setPersonalityConsentData] = useState(null);
  const [hasPersonalityConsent, setHasPersonalityConsent] = useState(false);
  const [showPersonalityConsentModal, setShowPersonalityConsentModal] = useState(false);

  useEffect(() => {
    loadPersonalityConsent(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    personalityConsentLoading,
    personalityConsentError,
    personalityConsentSuccess,
    personalityConsentData,
    hasPersonalityConsent,
    showPersonalityConsentModal,
    loadPersonalityConsent,
    openPersonalityConsentModal,
    closePersonalityConsentModal,
    handlePersonalityConsentAccepted,
    revokePersonalityConsent,
  };
}

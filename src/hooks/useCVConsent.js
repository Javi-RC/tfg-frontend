import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCVConsent, updateCVConsent } from '../api/cvConsent';
import { normalizeConsentResponse } from '../utils/consent';

/**
 * Custom hook for CV consent CRUD & modal
 */
export function useCVConsent() {
  const { t } = useTranslation();

  const [consentLoading, setConsentLoading] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [consentSuccess, setConsentSuccess] = useState(null);
  const [consentData, setConsentData] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    loadConsent(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setConsentSuccess(t('profile.consentRevokedDetail'));
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

  return {
    consentLoading,
    consentError,
    consentSuccess,
    consentData,
    hasConsent,
    showConsentModal,
    openConsentModal,
    closeConsentModal,
    handleConsentAccepted,
    revokeConsent,
    loadConsent,
  };
}

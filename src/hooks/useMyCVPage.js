import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyCV, deleteCV, updateCV } from '../api/cv';
import { validateCV } from '../services/cvService';

/**
 * Custom hook for MyCVPage business logic
 * Manages CV loading, editing, deletion, and upload
 */
export function useMyCVPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showSubmitToOrg, setShowSubmitToOrg] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('upload') === 'true') {
      setShowUpload(true);
      params.delete('upload');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load user's CV
   */
  const loadCV = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyCV();
      const cvData = response.data?.cv || response.data;
      setCV(cvData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(t('cv.noCVFoundUploadOne'));
      } else {
        setError(err.response?.data?.error || t('cv.errorLoadingCV'));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  /**
   * Delete CV
   */
  const handleDelete = async () => {
    if (!cv?._id) return;

    const accepted = await confirm({
      message: t('cv.confirmDeleteCV'),
      confirmLabel: t('common.delete'),
      destructive: true,
    });
    if (!accepted) return;

    try {
      await deleteCV(cv._id);
      setCV(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || t('cv.errorDeletingCV'));
    }
  };

  /**
   * Handle successful CV upload
   */
  const handleUploadSuccess = async () => {
    setShowUpload(false);
    setError(null);
    await loadCV();
  };

  /**
   * Save CV changes
   */
  const handleSaveCV = async (editData) => {
    if (!cv?._id) return { success: false, errors: [t('cv.noCVFound')] };

    // Validate CV data
    const validationErrors = validateCV(editData);

    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return { success: false, errors: validationErrors };
    }

    try {
      await updateCV(cv._id, editData);
      setError(null);
      await loadCV();
      return { success: true, errors: [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || t('cv.errorUpdatingCV');
      setError(errorMsg);
      return { success: false, errors: [errorMsg] };
    }
  };

  /**
   * Toggle upload modal
   */
  const toggleUploadModal = () => {
    setShowUpload((prev) => !prev);
  };

  /**
   * Toggle submit to organization modal
   */
  const toggleSubmitToOrgModal = () => {
    setShowSubmitToOrg((prev) => !prev);
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    cv,
    loading,
    error,
    showUpload,
    showSubmitToOrg,

    // Actions
    loadCV,
    handleDelete,
    handleUploadSuccess,
    handleSaveCV,
    toggleUploadModal,
    toggleSubmitToOrgModal,
    clearError,
    setShowUpload,
    setShowSubmitToOrg,
  };
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, X } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import CVConsentModal from './cv/CVConsentModal';
import QuestionnaireModal from '../pages/CVUpload/QuestionnaireModal';
import { getCVConsent } from '../api/cvConsent';

/**
 * CVUpload Component
 * Handles CV file upload with drag-and-drop support
 * @param {Function} onUploadSuccess - Callback when upload succeeds
 * @param {Function} onCancel - Optional callback to cancel upload
 */
export default function CVUpload({ onUploadSuccess, onCancel }) {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [uploadedCv, setUploadedCv] = useState(null);

  const [checkingConsent, setCheckingConsent] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    let mounted = true;

    const loadConsent = async () => {
      setCheckingConsent(true);
      try {
        const res = await getCVConsent();
        const nextHasConsent = Boolean(res?.data?.hasConsent);
        if (!mounted) return;
        setHasConsent(nextHasConsent);
        setShowConsentModal(!nextHasConsent);
      } catch (err) {
        if (!mounted) return;
        // Fail closed: if we cannot verify consent, block upload and show message.
        setHasConsent(false);
        setShowConsentModal(false);
        setError(
          err?.response?.data?.error ||
            t('cv.couldNotVerifyConsent')
        );
      } finally {
        if (mounted) setCheckingConsent(false);
      }
    };

    loadConsent();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError(t('cv.upload.errors.noFileSelected'));
      return false;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(t('cv.upload.errors.invalidFileType'));
      return false;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError(t('cv.upload.errors.fileTooLarge'));
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError(t('cv.upload.errors.noFileSelected'));
      return;
    }

    if (!hasConsent) {
      setShowConsentModal(true);
      setError(t('cv.upload.errors.consentRequired'));
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { uploadCV } = await import('../api/cv');
      const preferredLanguage = (i18n?.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
      const response = await uploadCV(file, preferredLanguage);
      const data = response?.data;

      console.log('========== CV UPLOAD BACKEND RESPONSE ==========');
      console.log('Full Response:', response);
      console.log('Response Data:', data);
      console.log('Questionnaire:', data?.questionnaire);
      console.log('Needs Completion:', data?.questionnaire?.needsCompletion);
      console.log('Completeness:', data?.completeness);
      console.log('Completeness Score:', data?.completeness?.score);
      console.log('================================================');

      // New backend response supports questionnaire flow
      if (data?.success && data?.cv) {
        setUploadedCv(data.cv);

        if (data?.questionnaire?.needsCompletion) {
          setQuestionnaireData(data.questionnaire);
          setShowQuestionnaire(true);
          return;
        }

        if (onUploadSuccess) {
          onUploadSuccess(data.cv);
        }
        return;
      }

      throw new Error('Invalid response format');
    } catch (err) {
      if (err?.response?.status === 403) {
        setHasConsent(false);
        setShowConsentModal(true);
      }
      setError(
        err.response?.data?.error || 
        err.message ||
        t('cv.upload.errors.uploadFailed')
      );
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setQuestionnaireData(null);

    if (onUploadSuccess) {
      onUploadSuccess(uploadedCv);
    }
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaire(false);
    setQuestionnaireData(null);

    if (questionnaireData?.sessionId) {
      localStorage.setItem(
        'pendingQuestionnaire',
        JSON.stringify({
          sessionId: questionnaireData.sessionId,
          timestamp: new Date().toISOString()
        })
      );
    }

    if (onUploadSuccess) {
      onUploadSuccess(uploadedCv);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <>
    <CVConsentModal
      show={showConsentModal}
      onClose={() => {
        setShowConsentModal(false);
        if (!hasConsent && typeof onCancel === 'function') {
          onCancel();
        }
      }}
      onAccepted={() => {
        setHasConsent(true);
        setShowConsentModal(false);
        setError(null);
      }}
    />

    {showQuestionnaire && questionnaireData && (
      <QuestionnaireModal
        initialData={questionnaireData}
        onComplete={handleQuestionnaireComplete}
        onSkip={handleQuestionnaireSkip}
      />
    )}

    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '32px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
}} role="region" aria-label={t('cv.upload.aria.form')}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#1a1a1a'
      }}>
        {t('cv.upload.title')}
      </h2>
      
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '32px'
      }}>
        {t('cv.upload.description')}
      </p>

      {checkingConsent && (
        <div style={{
          padding: '12px 16px',
          background: '#f5f5f5',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          color: '#333',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          {t('cv.upload.checkingConsent')}
        </div>
      )}

      {!checkingConsent && !hasConsent && (
        <div style={{
          padding: '12px 16px',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: '8px',
          color: '#9a3412',
          fontSize: '14px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span>
            {t('cv.upload.consentWarning')}
          </span>
          <SecondaryButton onClick={() => setShowConsentModal(true)}>
            {t('cv.upload.reviewConsent')}
          </SecondaryButton>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={t('cv.upload.aria.dragDrop')}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('cv-file-input').click();
          }
        }}
        style={{
          border: `2px dashed ${isDragging ? '#111' : '#e0e0e0'}`,
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          background: isDragging ? '#f8f8f8' : '#fafafa',
          transition: 'all 0.2s',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
        onClick={() => document.getElementById('cv-file-input').click()}
      >
        {!file ? (
          <>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px',
              opacity: 0.3
            }} aria-hidden="true">
              📄
            </div>
            <p style={{
              fontSize: '15px',
              color: '#333',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              {t('cv.upload.dragDrop')}
            </p>
            <p style={{
              fontSize: '13px',
              color: '#999'
            }}>
              {t('cv.upload.orClickToBrowse')}
            </p>
            <input
              id="cv-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              aria-label={t('cv.upload.aria.selectFile')}
            />
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'white',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '4px'
              }}>
                {file.name}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#999'
              }}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#c0392b',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center'
              }}
              title={t('cv.upload.removeFile')}
              aria-label={t('cv.upload.aria.removeFile', { fileName: file.name })}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c0392b',
          fontSize: '14px',
          marginBottom: '20px'
        }} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        {onCancel && (
          <SecondaryButton
            onClick={onCancel}
            disabled={uploading}
            aria-label={t('cv.upload.aria.cancel')}
            leftIcon={<X size={16} />}
          >
            {t('cv.upload.cancel')}
          </SecondaryButton>
        )}
        <PrimaryButton
          onClick={handleUpload}
          disabled={!file || uploading || checkingConsent || !hasConsent}
          aria-label={uploading ? t('cv.upload.aria.uploading') : t('cv.upload.aria.upload')}
          leftIcon={<Upload size={16} />}
        >
          {uploading ? t('cv.upload.uploading') : t('cv.upload.button')}
        </PrimaryButton>
      </div>
    </div>
    </>
  );
}

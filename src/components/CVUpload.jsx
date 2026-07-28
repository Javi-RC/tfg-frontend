import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, X } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import CVConsentModal from './cv/CVConsentModal';
import QuestionnaireModal from '../pages/CVUpload/QuestionnaireModal';
import { getCVConsent } from '../api/cvConsent';
import { normalizeConsentResponse } from '../utils/consent';
import './CVUpload.css';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024;

function validateFile(selectedFile, setError, t) {
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
}

function ConsentWarning({ onReviewConsent }) {
  const { t } = useTranslation();
  return (
    <div className="cv-upload-consent-warning">
      <span>{t('cv.upload.consentWarning')}</span>
      <SecondaryButton onClick={onReviewConsent}>
        {t('cv.upload.reviewConsent')}
      </SecondaryButton>
    </div>
  );
}

function DropzoneArea({ isDragging, file, onFileChange, onRemoveFile, onDragOver, onDragLeave, onDrop }) {
  const { t } = useTranslation();
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      aria-label={t('cv.upload.aria.dragDrop')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.getElementById('cv-file-input').click();
        }
      }}
      className={`cv-upload-dropzone${isDragging ? ' cv-upload-dropzone--dragging' : ''}`}
      onClick={() => document.getElementById('cv-file-input').click()}
    >
      {!file ? (
        <>
          <div className="cv-upload-dropzone-icon" aria-hidden="true">
            📄
          </div>
          <p className="cv-upload-dropzone-text">
            {t('cv.upload.dragDrop')}
          </p>
          <p className="cv-upload-dropzone-hint">
            {t('cv.upload.orClickToBrowse')}
          </p>
          <input
            id="cv-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
            className="cv-upload-file-input-hidden"
            aria-label={t('cv.upload.aria.selectFile')}
          />
        </>
      ) : (
        <div className="cv-upload-file-info">
          <div className="cv-upload-file-info-body">
            <p className="cv-upload-file-name">
              {file.name}
            </p>
            <p className="cv-upload-file-size">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile();
            }}
            className="cv-upload-remove-btn"
            title={t('cv.upload.removeFile')}
            aria-label={t('cv.upload.aria.removeFile', { fileName: file.name })}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CVUpload({ onUploadSuccess, onCancel }) {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const uploadedCvRef = useRef(null);

  const [checkingConsent, setCheckingConsent] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadConsent = async () => {
      setCheckingConsent(true);
      try {
        const res = await getCVConsent();
        const normalized = normalizeConsentResponse(res?.data);
        const nextHasConsent = normalized.hasConsent;
        if (!mounted) return;
        setHasConsent(nextHasConsent);
        setShowConsentModal(!nextHasConsent);
      } catch (err) {
        if (!mounted) return;
        setHasConsent(false);
        setShowConsentModal(false);
        setError(err?.response?.data?.error || t('cv.couldNotVerifyConsent'));
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    if (validateFile(selectedFile, setError, t)) {
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
    if (validateFile(droppedFile, setError, t)) {
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
      const preferredLanguage = (i18n?.language || 'en').toLowerCase().startsWith('es')
        ? 'es'
        : 'en';
      const response = await uploadCV(file, preferredLanguage);
      const data = response?.data;

      if (data?.success && data?.cv) {
        uploadedCvRef.current = data.cv;

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

      throw new Error(t('cv.upload.invalidResponseFormat'));
    } catch (err) {
      if (err?.response?.status === 403) {
        setHasConsent(false);
        setShowConsentModal(true);
      }
      setError(err.response?.data?.error || err.message || t('cv.upload.errors.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setQuestionnaireData(null);
    if (onUploadSuccess) {
      onUploadSuccess(uploadedCvRef.current);
    }
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaire(false);
    setQuestionnaireData(null);

    if (questionnaireData?.sessionId) {
      localStorage.setItem(
        'pendingQuestionnaire:v1',
        JSON.stringify({
          sessionId: questionnaireData.sessionId,
          timestamp: new Date().toISOString(),
        })
      );
    }

    if (onUploadSuccess) {
      onUploadSuccess(uploadedCvRef.current);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <>
      <CVConsentModal
        key={showConsentModal ? 'open' : 'closed'}
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

      <section
        className="cv-upload-section"
        aria-label={t('cv.upload.aria.form')}
      >
        <h2 className="cv-upload-title">
          {t('cv.upload.title')}
        </h2>

        <p className="cv-upload-description">
          {t('cv.upload.description')}
        </p>

        {checkingConsent && (
          <div className="cv-upload-consent-checking">
            {t('cv.upload.checkingConsent')}
          </div>
        )}

        {!checkingConsent && !hasConsent && (
          <ConsentWarning onReviewConsent={() => setShowConsentModal(true)} />
        )}

        <DropzoneArea
          isDragging={isDragging}
          file={file}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        {error && (
          <div className="cv-upload-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="cv-upload-actions">
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
      </section>
    </>
  );
}

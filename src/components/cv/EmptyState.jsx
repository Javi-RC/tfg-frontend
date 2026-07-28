import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import './EmptyState.css';

/**
 * EmptyState Component
 * Displays when no CV is found
 */
export default function EmptyState({ error, onUpload }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div
      className="emptystate-container"
    >
      {/* Back button at the top */}
      <div className="emptystate-back-btn">
        <SecondaryButton
          onClick={handleBack}
          aria-label={t('cv.backToDashboard')}
          leftIcon={<ArrowLeft size={18} />}
        >
          {t('cv.backToDashboard')}
        </SecondaryButton>
      </div>

      <div
        className="emptystate-card"
        role="alert"
      >
        <div
          className="emptystate-icon-wrapper"
          aria-hidden="true"
        >
          <FileText size={64} color="#666" />
        </div>
        <h2 className="emptystate-title">
          {t('cv.noCVFound')}
        </h2>
        <p className="emptystate-message">
          {error || t('cv.uploadToGetStarted')}
        </p>
        <div className="emptystate-action">
          <PrimaryButton
            onClick={onUpload}
            aria-label={t('cv.aria.openUploadDialog')}
            leftIcon={<Upload size={18} />}
          >
            {t('cv.uploadCV')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

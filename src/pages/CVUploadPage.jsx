import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FileUploader from './CVUpload/FileUploader';
import QuestionnaireModal from './CVUpload/QuestionnaireModal';
import { uploadCV } from '../api/cv';
import './CVUploadPage.css';

/**
 * CVUploadPage - Main page for CV upload and questionnaire flow
 */
const CVUploadPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [uploadResponse, setUploadResponse] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadCV(file);
      const data = response.data;

      setUploadResponse(data);

      if (data.questionnaire?.needsCompletion) {
        setShowQuestionnaire(true);
      } else {
        setTimeout(() => {
          navigate('/my-cv');
        }, 1500);
      }
    } catch (err) {
      console.error('Error uploading CV:', err);
      setError(err.response?.data?.message || t('cv.upload.errorFallback'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    navigate('/my-cv');
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaire(false);
    // Save in localStorage for reminder
    localStorage.setItem(
      'pendingQuestionnaire:v1',
      JSON.stringify({
        sessionId: uploadResponse.questionnaire.sessionId,
        timestamp: new Date().toISOString(),
      })
    );
    navigate('/my-cv');
  };

  return (
    <div className="cv-upload-page">
      <div className="upload-container">
        <h1>{t('cv.upload.pageTitle')}</h1>
        <p className="subtitle">{t('cv.upload.pageSubtitle')}</p>

        <FileUploader onFileSelect={handleFileSelect} isUploading={isUploading} />

        {error && <div className="error-banner">{error}</div>}

        {uploadResponse?.completeness && !showQuestionnaire && (
          <div className="upload-result">
            <div className="success-icon">✓</div>
            <h3>{t('cv.upload.processedSuccessfully')}</h3>
            <div className="completeness-badge">
              {t('cv.upload.percentComplete', { score: uploadResponse.completeness.score })}
            </div>
            {uploadResponse.completeness.missingFieldsCount > 0 ? (
              <p>
                {t('cv.upload.fieldsRemaining', {
                  count: uploadResponse.completeness.missingFieldsCount,
                })}
              </p>
            ) : (
              <p>{t('cv.upload.profileComplete')}</p>
            )}
          </div>
        )}
      </div>

      {showQuestionnaire && uploadResponse && (
        <QuestionnaireModal
          initialData={uploadResponse.questionnaire}
          onComplete={handleQuestionnaireComplete}
          onSkip={handleQuestionnaireSkip}
        />
      )}
    </div>
  );
};

export default CVUploadPage;

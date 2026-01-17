import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from './CVUpload/FileUploader';
import QuestionnaireModal from './CVUpload/QuestionnaireModal';
import { uploadCV } from '../api/cv';
import './CVUploadPage.css';

/**
 * CVUploadPage - Main page for CV upload and questionnaire flow
 */
const CVUploadPage = () => {
  const navigate = useNavigate();
  const [uploadResponse, setUploadResponse] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    console.log('CVUploadPage - handleFileSelect called with file:', file);
    setIsUploading(true);
    setError(null);
    
    try {
      console.log('CVUploadPage - Calling uploadCV API...');
      const response = await uploadCV(file, 'en'); // or 'es' based on user preference
      const data = response.data;
      
      console.log('========== BACKEND RESPONSE ==========');
      console.log('Full Response:', response);
      console.log('Response Data:', data);
      console.log('Questionnaire:', data.questionnaire);
      console.log('Needs Completion:', data.questionnaire?.needsCompletion);
      console.log('Completeness:', data.completeness);
      console.log('Completeness Score:', data.completeness?.score);
      console.log('=====================================');
      
      setUploadResponse(data);

      if (data.questionnaire?.needsCompletion) {
        // CV incomplete - show questionnaire
        console.log('✗ CV incomplete - showing questionnaire');
        setShowQuestionnaire(true);
      } else {
        // CV complete - redirect to dashboard
        console.log('✓ CV complete - redirecting to dashboard');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Error uploading CV:', err);
      console.error('Error Response:', err.response);
      console.error('Error Data:', err.response?.data);
      setError(err.response?.data?.message || 'Error uploading CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    navigate('/dashboard');
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaire(false);
    // Save in localStorage for reminder
    localStorage.setItem('pendingQuestionnaire', JSON.stringify({
      sessionId: uploadResponse.questionnaire.sessionId,
      timestamp: new Date().toISOString()
    }));
    navigate('/dashboard');
  };

  return (
    <div className="cv-upload-page">
      <div className="upload-container">
        <h1>Upload Your CV</h1>
        <p className="subtitle">Upload your CV in PDF or TXT format to get started</p>
        
        <FileUploader 
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {uploadResponse?.completeness && !showQuestionnaire && (
          <div className="upload-result">
            <div className="success-icon">✓</div>
            <h3>CV Processed Successfully</h3>
            <div className="completeness-badge">
              {uploadResponse.completeness.score}% complete
            </div>
            {uploadResponse.completeness.missingFieldsCount > 0 ? (
              <p>
                {uploadResponse.completeness.missingFieldsCount} fields remaining
              </p>
            ) : (
              <p>Your profile is complete! Redirecting to dashboard...</p>
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

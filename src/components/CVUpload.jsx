import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

/**
 * CVUpload Component
 * Handles CV file upload with drag-and-drop support
 * @param {Function} onUploadSuccess - Callback when upload succeeds
 * @param {Function} onCancel - Optional callback to cancel upload
 */
export default function CVUpload({ onUploadSuccess, onCancel }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError('Please select a file');
      return false;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Only PDF and Word documents are allowed');
      return false;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError('File size must be less than 5MB');
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
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { uploadCV } = await import('../api/cv');
      const response = await uploadCV(file);
      
      // Backend response: { success: true, message: "...", cv: {...} }
      if (response.data?.success && response.data?.cv) {
        if (onUploadSuccess) {
          onUploadSuccess(response.data.cv);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.message ||
        'Error uploading CV. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '32px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }} role="region" aria-label="CV upload form">
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#1a1a1a'
      }}>
        Upload Your CV
      </h2>
      
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '32px'
      }}>
        Upload your CV in PDF or Word format (max 5MB)
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Click to select file or drag and drop CV file here"
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
              Drag and drop your CV here
            </p>
            <p style={{
              fontSize: '13px',
              color: '#999'
            }}>
              or click to browse
            </p>
            <input
              id="cv-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              aria-label="Select CV file to upload"
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
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title="Remove file"
              aria-label={`Remove selected file: ${file.name}`}
            >
              ×
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
            aria-label="Cancel CV upload"
          >
            Cancel
          </SecondaryButton>
        )}
        <PrimaryButton
          onClick={handleUpload}
          disabled={!file || uploading}
          aria-label={uploading ? 'Uploading CV file' : 'Upload selected CV file'}
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </PrimaryButton>
      </div>
    </div>
  );
}

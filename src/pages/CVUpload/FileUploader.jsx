import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { showError } from '../../utils/toast';
import './FileUploader.css';

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * FileUploader - Drag and drop file uploader
 */
const FileUploader = ({ onFileSelect, isUploading }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const ALLOWED_TYPES = ['application/pdf', 'text/plain'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showError(t('cv.upload.invalidFormat'));
      return;
    }

    if (file.size > MAX_SIZE) {
      showError(t('cv.upload.fileTooLarge'));
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="file-uploader">
      <div
        className={`drop-zone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!selectedFile) fileInputRef.current?.click(); } }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => handleFileChange(e.target.files[0])}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <>
            <Upload className="upload-icon" size={48} />
            <p className="drop-zone-text">{t('cv.upload.dragHere')}</p>
            <span className="file-types">{t('cv.upload.fileFormats')}</span>
          </>
        ) : (
          <>
            <div className="file-selected">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
              <button type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          </>
        )}
      </div>

      {selectedFile && (
        <button type="button" onClick={handleUpload} disabled={isUploading} className="btn-upload">
          {isUploading ? t('cv.upload.processing') : t('cv.upload.uploadButton')}
        </button>
      )}
    </div>
  );
};

export default FileUploader;

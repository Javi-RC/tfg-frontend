import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

export default function AnalysisErrorState({ error, onRetry }) {
  const { t } = useTranslation();

  return (
    <div style={styles.errorContainer}>
      <AlertTriangle size={64} color="#dc3545" style={{ marginBottom: '16px' }} />
      <p style={styles.errorText}>{error}</p>
      <button type="button" onClick={onRetry} style={styles.retryButton}>
        {t('common.tryAgain')}
      </button>
    </div>
  );
}

const styles = {
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  errorText: {
    fontSize: '15px',
    color: 'var(--color-danger)',
    marginBottom: '24px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LoadingState Component
 * Displays while CV is loading
 */
export default function LoadingState() {
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">
        {t('cv.loadingCV')}
      </p>
    </div>
  );
}

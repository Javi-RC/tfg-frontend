import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LoadingState() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-page)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'cv-spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }} role="status" aria-live="polite">
          {t('cv.loadingCV')}
        </p>
      </div>
      <style>{`
        @keyframes cv-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
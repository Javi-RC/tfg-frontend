import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LoadingState Component
 * Display while loading data with a real spinner animation
 */
const sizeMap = {
  small: { container: { padding: '20px' }, spinner: 20, text: '14px' },
  medium: { container: { padding: '60px' }, spinner: 36, text: '16px' },
  large: { container: { padding: '100px' }, spinner: 48, text: '18px' },
};

export default function LoadingState({ message, size = 'medium', centered = true }) {
  const { t } = useTranslation();
  const config = sizeMap[size] || sizeMap.medium;
  const displayMessage = message ?? t('common.loading');

  return (
    <div
      style={{
        width: '100%',
        ...config.container,
        ...(centered ? { textAlign: 'center' } : {}),
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          display: 'inline-block',
          width: `${config.spinner}px`,
          height: `${config.spinner}px`,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: displayMessage ? '12px' : 0,
        }}
        aria-hidden="true"
      />
      {displayMessage && (
        <p
          style={{
            color: 'var(--color-text-muted)',
            margin: 0,
            fontSize: config.text,
          }}
        >
          {displayMessage}
        </p>
      )}
    </div>
  );
}

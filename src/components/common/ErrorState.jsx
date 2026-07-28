import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

/**
 * ErrorState Component
 * Display error messages with optional action
 */

export default function ErrorState({
  message,
  action,
  onRetry,
  centered = true,
  variant = 'default',
}) {
  const { t } = useTranslation();
  const displayMessage = message ?? t('common.errorOccurred');
  return (
    <div
      className={`errorstate-container ${centered ? 'errorstate-container--centered' : ''} errorstate-container--${variant}`}
    >
      {variant === 'default' && (
        <AlertCircle size={48} color="#c0392b" className="errorstate-icon" />
      )}
      <p className="errorstate-message">{displayMessage}</p>
      {action && <div className="errorstate-action">{action}</div>}
      {!action && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="errorstate-retry-btn"
        >
          <RefreshCw size={14} />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}


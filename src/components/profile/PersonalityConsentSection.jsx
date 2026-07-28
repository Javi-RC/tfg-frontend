import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';

/**
 * PersonalityConsentSection Component
 * Displays personality profiling consent status and revoke/grant actions.
 */
export default function PersonalityConsentSection({
  loading,
  error,
  success,
  hasConsent,
  consentData,
  onRefresh,
  onOpenConsentModal,
  onRevokeConsent,
}) {
  const { t, i18n } = useTranslation();

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString(i18n.language);
  };

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><Brain size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.personalityConsent.title')}</span>
      </div>
      <p className="sara-card-desc">{t('profile.personalityConsent.description')}</p>

      {error && (
        <div className="sara-alert error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {success && (
        <div className="sara-alert success" role="status" aria-live="polite">
          {success}
        </div>
      )}

      <div className="sara-consent-meta">
        <div>
          <div className="sara-info-label">{t('profile.personalityConsent.labels.status')}</div>
          <span className={`sara-status-badge ${hasConsent ? 'ok' : 'no'}`}>
            <span className="sara-status-dot" />
            {loading
              ? t('common.loading')
              : hasConsent
                ? t('profile.personalityConsent.status.accepted')
                : t('profile.personalityConsent.status.notAccepted')}
          </span>
        </div>

        <div>
          <div className="sara-info-label">
            {t('profile.personalityConsent.labels.acceptedAt')}
          </div>
          <div className="sara-info-value">{formatDateTime(consentData?.acceptedAt)}</div>
        </div>
      </div>

      <div className="sara-card-actions">
        <button
          type="button"
          className="sara-btn-outline"
          onClick={onRefresh}
          disabled={loading}
          aria-label={t('profile.personalityConsent.aria.refresh')}
        >
          {t('common.refresh')}
        </button>

        {!hasConsent ? (
          <button
            type="button"
            className="sara-btn-primary"
            onClick={onOpenConsentModal}
            disabled={loading}
            aria-label={t('profile.personalityConsent.aria.reviewAndAccept')}
          >
            {t('profile.personalityConsent.reviewAndAccept')}
          </button>
        ) : (
          <button
            type="button"
            className="sara-btn-outline"
            onClick={async () => {
              const confirmed = window.confirm(t('profile.personalityConsent.revokeConfirm'));
              if (!confirmed) return;
              await onRevokeConsent();
            }}
            disabled={loading}
            aria-label={t('profile.personalityConsent.aria.revoke')}
          >
            {t('profile.personalityConsent.revoke')}
          </button>
        )}
      </div>
    </section>
  );
}

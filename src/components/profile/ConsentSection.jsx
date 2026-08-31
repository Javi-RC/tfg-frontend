import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

const formatText = (value) => (typeof value === 'string' && value.trim() ? value : '—');

/**
 * ConsentSection Component
 * Displays CV AI processing consent status and actions.
 */
export default function ConsentSection({
  consentLoading,
  consentError,
  consentSuccess,
  hasConsent,
  consentData,
  onLoadConsent,
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
        <span className="sara-card-head-icon"><ShieldCheck size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.dataConsent')}</span>
      </div>
      <p className="sara-card-desc">{t('profile.consentSection.description')}</p>

      {consentError && (
        <div className="sara-alert error" role="alert" aria-live="assertive">
          {consentError}
        </div>
      )}
      {consentSuccess && (
        <div className="sara-alert success" role="status" aria-live="polite">
          {consentSuccess}
        </div>
      )}

      <div className="sara-consent-meta">
        <div>
          <div className="sara-info-label">
            {t('profile.consentSection.labels.cvAiProcessingConsent')}
          </div>
          <span className={`sara-status-badge ${hasConsent ? 'ok' : 'no'}`}>
            <span className="sara-status-dot" />
            {consentLoading
              ? t('common.loading')
              : hasConsent
                ? t('profile.consentSection.status.accepted')
                : t('profile.consentSection.status.notAccepted')}
          </span>
        </div>

        <div>
          <div className="sara-info-label">{t('profile.consentSection.labels.acceptedAt')}</div>
          <div className="sara-info-value">{formatDateTime(consentData?.acceptedAt)}</div>
        </div>

        <div>
          <div className="sara-info-label">{t('profile.consentSection.labels.termsVersion')}</div>
          <div className="sara-info-value">{formatText(consentData?.version)}</div>
        </div>
      </div>

      <div className="sara-card-actions">
        <button
          type="button"
          className="sara-btn-outline"
          onClick={onLoadConsent}
          disabled={consentLoading}
          aria-label={t('profile.consentSection.aria.refresh')}
        >
          {t('common.refresh')}
        </button>

        {!hasConsent ? (
          <button
            type="button"
            className="sara-btn-primary"
            onClick={onOpenConsentModal}
            disabled={consentLoading}
            aria-label={t('profile.consentSection.aria.reviewAndAccept')}
          >
            {t('profile.consentSection.reviewAndAccept')}
          </button>
        ) : (
          <button
            type="button"
            className="sara-btn-outline"
            onClick={async () => {
              const confirmed = await confirm({
                message: t('profile.consentSection.revokeConfirm'),
                destructive: true,
              });
              if (!confirmed) return;
              await onRevokeConsent();
            }}
            disabled={consentLoading}
            aria-label={t('profile.consentSection.aria.revoke')}
          >
            {t('profile.revokeConsent')}
          </button>
        )}
      </div>
    </section>
  );
}

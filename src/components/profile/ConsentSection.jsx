import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * ConsentSection Component
 * Displays CV AI processing consent status and actions
 */
export default function ConsentSection({
  consentLoading,
  consentError,
  consentSuccess,
  hasConsent,
  consentData,
  onLoadConsent,
  onOpenConsentModal,
  onRevokeConsent
}) {
  const { t } = useTranslation();

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const formatText = (value) => (typeof value === 'string' && value.trim() ? value : '—');

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  return (
    <div style={{
      padding: '32px 40px',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px'
        }}>
          {t('profile.dataConsent')}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          lineHeight: '1.6'
        }}>
          {t('profile.consentSection.description')}
        </p>
      </div>

      {consentError && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c0392b',
          fontSize: '14px',
          marginBottom: '16px'
        }} role="alert" aria-live="assertive">
          {consentError}
        </div>
      )}

      {consentSuccess && (
        <div style={{
          padding: '12px 16px',
          background: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '8px',
          color: '#065f46',
          fontSize: '14px',
          marginBottom: '16px'
        }} role="status" aria-live="polite">
          {consentSuccess}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={labelStyle}>{t('profile.consentSection.labels.cvAiProcessingConsent')}</div>
          <p style={{ fontSize: '15px', color: hasConsent ? '#065f46' : '#9a3412', lineHeight: '1.6' }}>
            {consentLoading
              ? t('common.loading')
              : hasConsent
                ? t('profile.consentSection.status.accepted')
                : t('profile.consentSection.status.notAccepted')}
          </p>
        </div>

        <div>
          <div style={labelStyle}>{t('profile.consentSection.labels.acceptedAt')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
            {formatDateTime(consentData?.acceptedAt)}
          </p>
        </div>

        <div>
          <div style={labelStyle}>{t('profile.consentSection.labels.termsVersion')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
            {formatText(consentData?.version)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <SecondaryButton
          onClick={onLoadConsent}
          disabled={consentLoading}
          aria-label={t('profile.consentSection.aria.refresh')}
        >
          {t('common.refresh')}
        </SecondaryButton>

        {!hasConsent ? (
          <PrimaryButton
            onClick={onOpenConsentModal}
            disabled={consentLoading}
            aria-label={t('profile.consentSection.aria.reviewAndAccept')}
          >
            {t('profile.consentSection.reviewAndAccept')}
          </PrimaryButton>
        ) : (
          <SecondaryButton
            onClick={async () => {
              const confirmed = window.confirm(
                t('profile.consentSection.revokeConfirm')
              );
              if (!confirmed) return;

              await onRevokeConsent();
            }}
            disabled={consentLoading}
            aria-label={t('profile.consentSection.aria.revoke')}
          >
            {t('profile.revokeConsent')}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

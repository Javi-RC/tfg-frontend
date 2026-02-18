import React from 'react';
import { useTranslation } from 'react-i18next';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';

/**
 * PersonalityConsentSection Component
 * Displays personality profiling consent status and revoke/grant actions in the profile page.
 */
export default function PersonalityConsentSection({
  loading,
  error,
  success,
  hasConsent,
  consentData,
  onRefresh,
  onOpenConsentModal,
  onRevokeConsent
}) {
  const { t, i18n } = useTranslation();

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString(i18n.language);
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
          {t('profile.personalityConsent.title')}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          lineHeight: '1.6'
        }}>
          {t('profile.personalityConsent.description')}
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c0392b',
          fontSize: '14px',
          marginBottom: '16px'
        }} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px 16px',
          background: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '8px',
          color: '#065f46',
          fontSize: '14px',
          marginBottom: '16px'
        }} role="status" aria-live="polite">
          {success}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={labelStyle}>{t('profile.personalityConsent.labels.status')}</div>
          <p style={{ fontSize: '15px', color: hasConsent ? '#065f46' : '#9a3412', lineHeight: '1.6' }}>
            {loading
              ? t('common.loading')
              : hasConsent
                ? t('profile.personalityConsent.status.accepted')
                : t('profile.personalityConsent.status.notAccepted')}
          </p>
        </div>

        <div>
          <div style={labelStyle}>{t('profile.personalityConsent.labels.acceptedAt')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
            {formatDateTime(consentData?.acceptedAt)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <SecondaryButton
          onClick={onRefresh}
          disabled={loading}
          aria-label={t('profile.personalityConsent.aria.refresh')}
        >
          {t('common.refresh')}
        </SecondaryButton>

        {!hasConsent ? (
          <PrimaryButton
            onClick={onOpenConsentModal}
            disabled={loading}
            aria-label={t('profile.personalityConsent.aria.reviewAndAccept')}
          >
            {t('profile.personalityConsent.reviewAndAccept')}
          </PrimaryButton>
        ) : (
          <SecondaryButton
            onClick={async () => {
              const confirmed = window.confirm(
                t('profile.personalityConsent.revokeConfirm')
              );
              if (!confirmed) return;
              await onRevokeConsent();
            }}
            disabled={loading}
            aria-label={t('profile.personalityConsent.aria.revoke')}
          >
            {t('profile.personalityConsent.revoke')}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

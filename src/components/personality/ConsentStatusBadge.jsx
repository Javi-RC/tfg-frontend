import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

/**
 * ConsentStatusBadge Component
 * Visual indicator showing whether personality consent is active.
 */
export default function ConsentStatusBadge({ hasConsent, onClick }) {
  const { t } = useTranslation();

  const badgeStyle = hasConsent ? styles.activeBadge : styles.inactiveBadge;
  const Icon = hasConsent ? ShieldCheck : ShieldAlert;
  const label = hasConsent
    ? t('personalityConsent.statusBadge.active')
    : t('personalityConsent.statusBadge.inactive');

  const content = (
    <>
      <Icon size={14} />
      <span>{label}</span>
    </>
  );

  if (onClick && !hasConsent) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ ...styles.base, ...badgeStyle, ...styles.clickable }}
        aria-label={t('personalityConsent.statusBadge.grantConsent')}
      >
        {content}
      </button>
    );
  }

  return <span style={{ ...styles.base, ...badgeStyle }}>{content}</span>;
}

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
  },
  activeBadge: {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success-dark)',
  },
  inactiveBadge: {
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning-dark)',
  },
  clickable: {
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};

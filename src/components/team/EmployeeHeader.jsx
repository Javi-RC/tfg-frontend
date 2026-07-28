import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function EmployeeHeader({ safeDisplayName, avatarInitial, email, onClose }) {
  const { t } = useTranslation();

  return (
    <div style={styles.headerContent}>
      <div style={styles.avatar}>{avatarInitial}</div>
      <div style={styles.headerInfo}>
        <h2 style={styles.name}>{safeDisplayName}</h2>
        <p style={styles.email}>{email}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        style={styles.closeButton}
        title={t('team.employeeDetail.aria.closePanel')}
        aria-label={t('team.employeeDetail.aria.closePanel')}
      >
        <X size={20} />
      </button>
    </div>
  );
}

const styles = {
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent-gradient-start)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  email: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#fff',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
};

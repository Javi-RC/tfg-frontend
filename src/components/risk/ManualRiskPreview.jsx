import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function ManualRiskPreview({ isEditing, onCancel, children }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      data-testid="manual-risk-form-overlay"
      aria-label={isEditing ? t('risk.form.editTitle') : t('risk.form.addTitle')}
      style={{
        ...styles.modal,
        border: 'none',
      }}
    >
      <style>{`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {isEditing ? t('risk.form.editTitle') : t('risk.form.addTitle')}
        </h2>
        <button type="button" onClick={onCancel} style={styles.closeButton} aria-label={t('common.close')}>
          <X size={20} />
        </button>
      </div>

      {children}
    </dialog>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: 'var(--color-text-heading)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function ManualRiskActions({ isEditing, loading, onDelete, onCancel }) {
  const { t } = useTranslation();

  return (
    <div style={styles.buttonGroup}>
      {isEditing && typeof onDelete === 'function' && (
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          style={styles.dangerButton}
        >
          {t('risk.form.deleteRisk')}
        </button>
      )}
      <SecondaryButton onClick={onCancel} disabled={loading}>
        {t('common.cancel')}
      </SecondaryButton>
      <PrimaryButton type="submit" disabled={loading}>
        {loading
          ? t('risk.form.saving')
          : isEditing
            ? t('risk.form.updateRisk')
            : t('risk.form.addRiskButton')}
      </PrimaryButton>
    </div>
  );
}

const styles = {
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-border)',
  },
  dangerButton: {
    marginRight: 'auto',
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger-strong)',
    border: '1px solid #FCA5A5',
    padding: '10px 14px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

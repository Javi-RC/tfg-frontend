import React, { useRef, useEffect } from 'react';
import { AlertTriangle, Lock, ShieldX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
  isDeleting,
  password,
  confirmation,
  onPasswordChange,
  onConfirmationChange,
  errors,
  confirmationKeyword,
  requiresPassword = true,
}) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={t('accountDeletion.confirmation.title')}
      style={{
        width: '100%',
        maxWidth: '520px',
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 20px 48px rgba(15, 23, 42, 0.3)',
        border: 'none',
      }}
    >
      <style>{`
        dialog::backdrop {
          background: rgba(15, 23, 42, 0.45);
        }
      `}</style>
      <div
        style={{
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <ShieldX size={24} color="#dc2626" aria-hidden="true" />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {t('accountDeletion.confirmation.title')}
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            background: '#fef2f2',
            border: '1px solid var(--color-danger-bg)',
            borderRadius: '12px',
            marginBottom: '18px',
          }}
        >
          <AlertTriangle size={20} color="#dc2626" aria-hidden="true" />
          <div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-danger-hover)', marginBottom: '4px' }}
            >
              {t('accountDeletion.confirmation.warningTitle')}
            </div>
            <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
              {t('accountDeletion.confirmation.warningBody')}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {requiresPassword && (
            <label
              style={{
                display: 'grid',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
              }}
            >
              {t('accountDeletion.confirmation.passwordLabel')}
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#9ca3af"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder={t('accountDeletion.confirmation.passwordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 36px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                  }}
                  aria-invalid={Boolean(errors.password)}
                />
              </div>
              {errors.password && (
                <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.password}</span>
              )}
            </label>
          )}

          <label
            style={{
              display: 'grid',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
            }}
          >
            {t('accountDeletion.confirmation.confirmationLabel', { keyword: confirmationKeyword })}
            <input
              type="text"
              value={confirmation}
              onChange={(event) => onConfirmationChange(event.target.value)}
              placeholder={t('accountDeletion.confirmation.confirmationPlaceholder')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                fontSize: '14px',
              }}
              aria-invalid={Boolean(errors.confirmation)}
            />
            {errors.confirmation && (
              <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.confirmation}</span>
            )}
          </label>
        </div>

        {errors.submit && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-bg)',
              borderRadius: '10px',
              color: 'var(--color-danger-hover)',
              fontSize: '13px',
            }}
          >
            {errors.submit}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          <SecondaryButton onClick={onClose} disabled={isDeleting}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ background: 'var(--color-danger)' }}
          >
            {isDeleting ? t('common.deleting') : t('accountDeletion.actions.confirmDelete')}
          </PrimaryButton>
        </div>
      </div>
    </dialog>
  );
}

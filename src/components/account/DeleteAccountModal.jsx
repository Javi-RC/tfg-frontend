import React from 'react';
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
  requiresPassword = true
}) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('accountDeletion.confirmation.title')}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 48px rgba(15, 23, 42, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <ShieldX size={24} color="#dc2626" aria-hidden="true" />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111' }}>
            {t('accountDeletion.confirmation.title')}
          </h2>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '14px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          marginBottom: '18px'
        }}>
          <AlertTriangle size={20} color="#dc2626" aria-hidden="true" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#b91c1c', marginBottom: '4px' }}>
              {t('accountDeletion.confirmation.warningTitle')}
            </div>
            <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
              {t('accountDeletion.confirmation.warningBody')}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {requiresPassword && (
            <label style={{ display: 'grid', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#111' }}>
              {t('accountDeletion.confirmation.passwordLabel')}
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#9ca3af"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
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
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  aria-invalid={Boolean(errors.password)}
                />
              </div>
              {errors.password && (
                <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.password}</span>
              )}
            </label>
          )}

          <label style={{ display: 'grid', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#111' }}>
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
                border: '1px solid #e5e7eb',
                fontSize: '14px'
              }}
              aria-invalid={Boolean(errors.confirmation)}
            />
            {errors.confirmation && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.confirmation}</span>
            )}
          </label>
        </div>

        {errors.submit && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#b91c1c',
            fontSize: '13px'
          }}>
            {errors.submit}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px'
        }}>
          <SecondaryButton
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ background: '#dc2626' }}
          >
            {isDeleting ? t('common.deleting') : t('accountDeletion.actions.confirmDelete')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

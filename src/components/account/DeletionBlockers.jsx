import React from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SecondaryButton from '../SecondaryButton';

export default function DeletionBlockers({ blockers = [], onRetry, loading = false }) {
  const { t } = useTranslation();
  const hasBlockers = blockers.length > 0;
  const isLoading = loading && blockers.length === 0;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: hasBlockers ? '1px solid #fde68a' : '1px solid #d1fae5'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        {hasBlockers ? (
          <AlertTriangle size={22} color="#b45309" aria-hidden="true" />
        ) : (
          <CheckCircle2 size={22} color="#059669" aria-hidden="true" />
        )}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111'
        }}>
          {hasBlockers
            ? t('accountDeletion.prerequisites.blockedTitle')
            : isLoading
              ? t('common.loading')
              : t('accountDeletion.prerequisites.clearTitle')}
        </h2>
      </div>

      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '16px'
      }}>
        {hasBlockers
          ? t('accountDeletion.prerequisites.blockedDescription')
          : isLoading
            ? t('accountDeletion.prerequisites.loadingDescription')
            : t('accountDeletion.prerequisites.clearDescription')}
      </p>

      {hasBlockers && (
        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {blockers.map((blocker) => (
            <div
              key={blocker.id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #fde68a',
                background: '#fffbeb'
              }}
            >
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '6px'
              }}>
                {blocker.title}
              </div>
              {blocker.description && (
                <p style={{ fontSize: '14px', color: '#78350f', marginBottom: blocker.action ? '8px' : 0 }}>
                  {blocker.description}
                </p>
              )}
              {blocker.action && (
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  {blocker.action}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SecondaryButton
        onClick={onRetry}
        disabled={loading}
        leftIcon={<RefreshCw size={16} />}
        style={{ padding: '10px 18px' }}
        aria-label={t('accountDeletion.prerequisites.retry')}
      >
        {loading ? t('common.loading') : t('accountDeletion.prerequisites.retry')}
      </SecondaryButton>
    </div>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * CVManagementSection Component
 * Quick access to CV management and statistics
 */
export default function CVManagementSection({
  isAdmin,
  onNavigateToCV,
  onNavigateToCVStats,
  onNavigateToAdminCVs
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* CV Management */}
      <div style={{
        padding: '32px 40px',
        borderBottom: isAdmin ? 'none' : '1px solid #e2e8f0'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            {t('profile.cvManagement')}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            lineHeight: '1.6'
          }}>
            {t('profile.cvManagementSection.description')}
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          <PrimaryButton
            onClick={onNavigateToCV}
            style={{ width: '100%', padding: '12px 20px', fontSize: '14px', fontWeight: '500' }}
            aria-label={t('profile.cvManagementSection.aria.goToMyCv')}
          >
            {t('cv.myCV')}
          </PrimaryButton>
          <SecondaryButton
            onClick={onNavigateToCVStats}
            style={{ width: '100%', padding: '12px 20px', fontSize: '14px', fontWeight: '500' }}
            aria-label={t('profile.cvManagementSection.aria.viewCvStatistics')}
          >
            {t('profile.cvManagementSection.viewStatistics')}
          </SecondaryButton>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
          padding: '32px 40px',
          borderTop: '2px solid rgba(102, 126, 234, 0.15)',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              {t('profile.cvManagementSection.adminPanelTitle')}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              lineHeight: '1.6'
            }}>
              {t('profile.cvManagementSection.adminDescription')}
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            <PrimaryButton
              onClick={onNavigateToAdminCVs}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
              aria-label={t('profile.cvManagementSection.aria.viewAllCvsAdmin')}
            >
              {t('profile.cvManagementSection.viewAllCvs')}
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
}

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
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '16px'
        }}>
          {t('profile.cvManagement')}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '20px'
        }}>
          {t('profile.cvManagementSection.description')}
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <PrimaryButton
            onClick={onNavigateToCV}
            style={{ width: '100%' }}
            aria-label={t('profile.cvManagementSection.aria.goToMyCv')}
          >
            {t('cv.myCV')}
          </PrimaryButton>
          <SecondaryButton
            onClick={onNavigateToCVStats}
            style={{ width: '100%' }}
            aria-label={t('profile.cvManagementSection.aria.viewCvStatistics')}
          >
            {t('profile.cvManagementSection.viewStatistics')}
          </SecondaryButton>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '2px solid #e8f4f8'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>
            {t('profile.cvManagementSection.adminPanelTitle')}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            {t('profile.cvManagementSection.adminDescription')}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <PrimaryButton
              onClick={onNavigateToAdminCVs}
              style={{
                width: '100%',
                background: '#0066cc'
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Database } from 'lucide-react';

/**
 * CVManagementSection Component
 * Quick access to CV management and statistics, plus the admin CV panel.
 */
export default function CVManagementSection({
  isAdmin,
  onNavigateToCV,
  onNavigateToCVStats,
  onNavigateToAdminCVs,
}) {
  const { t } = useTranslation();

  return (
    <>
      <section className="sara-card sara-card-pad">
        <div className="sara-card-head">
          <span className="sara-card-head-icon"><FileText size={19} aria-hidden="true" /></span>
          <span className="sara-card-title">{t('profile.cvManagement')}</span>
        </div>
        <p className="sara-card-desc">{t('profile.cvManagementSection.description')}</p>

        <div className="sara-card-actions">
          <button
            type="button"
            className="sara-btn-primary"
            onClick={onNavigateToCV}
            aria-label={t('profile.cvManagementSection.aria.goToMyCv')}
          >
            {t('cv.myCV')}
          </button>
          <button
            type="button"
            className="sara-btn-outline"
            onClick={onNavigateToCVStats}
            aria-label={t('profile.cvManagementSection.aria.viewCvStatistics')}
          >
            {t('profile.cvManagementSection.viewStatistics')}
          </button>
        </div>
      </section>

      {isAdmin && (
        <section className="sara-card sara-card-pad">
          <div className="sara-card-head">
            <span className="sara-card-head-icon"><Database size={19} aria-hidden="true" /></span>
            <span className="sara-card-title">
              {t('profile.cvManagementSection.adminPanelTitle')}
            </span>
          </div>
          <p className="sara-card-desc">{t('profile.cvManagementSection.adminDescription')}</p>

          <div className="sara-card-actions">
            <button
              type="button"
              className="sara-btn-primary"
              onClick={onNavigateToAdminCVs}
              aria-label={t('profile.cvManagementSection.aria.viewAllCvsAdmin')}
            >
              {t('profile.cvManagementSection.viewAllCvs')}
            </button>
          </div>
        </section>
      )}
    </>
  );
}

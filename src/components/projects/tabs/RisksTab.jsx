import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, AlertCircle } from 'lucide-react';
import PrimaryButton from '../../PrimaryButton';
import ManualRisksList from '../../risk/ManualRisksList';
import CBRInsightsPanel from '../../risk/CBRInsightsPanel';
import { PROJECT_STATUS } from '../../../types/projectTypes';

export default function RisksTab({
  project,
  canEdit,
  manualRisks,
  risksLoading,
  risksError,
  onOpenAddRisk,
  onOpenEditRisk,
  onDeleteRisk,
  onRepredictRisks,
  onClearError,
  onLoadRisks,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div style={styles.section}>
        <div style={styles.risksSectionHeader}>
          <div style={styles.risksHeaderInfo}>
            <h3 style={styles.sectionTitle}>{t('projects.detailPage.risksSection.title')}</h3>
            <p style={styles.sectionDescription}>
              {project.status === PROJECT_STATUS.ACTIVE
                ? t('projects.detailPage.risksSection.descriptionActive')
                : t('projects.detailPage.risksSection.descriptionInactive')}
            </p>

            {manualRisks && manualRisks.length > 0 && (
              <div style={styles.riskStats}>
                <div style={styles.statItem}>
                  <span style={styles.statValue}>
                    {
                      manualRisks.filter((r) => r.severity === 'high' || r.severity === 'critical')
                        .length
                    }
                  </span>
                  <span style={styles.statLabel}>
                    {t('projects.detailPage.risksSection.stats.highCritical')}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statValue}>
                    {manualRisks.filter((r) => r.status === 'predicted').length}
                  </span>
                  <span style={styles.statLabel}>
                    {t('projects.detailPage.risksSection.stats.predicted')}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statValue}>
                    {manualRisks.filter((r) => r.source === 'manual').length}
                  </span>
                  <span style={styles.statLabel}>
                    {t('projects.detailPage.risksSection.stats.manual')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {canEdit && project.status === PROJECT_STATUS.ACTIVE && (
            <PrimaryButton onClick={onOpenAddRisk} leftIcon={<Plus size={16} />}>
              {t('risk.form.addRiskButton')}
            </PrimaryButton>
          )}
        </div>

        {project.status === PROJECT_STATUS.COMPLETED && (
          <div style={styles.infoBanner}>
            <AlertCircle size={20} color="#3B82F6" />
            <div style={styles.infoBannerText}>
              <strong>{t('projects.detailPage.risksSection.completedBanner.title')}</strong>{' '}
              {t('projects.detailPage.risksSection.completedBanner.description')}
            </div>
          </div>
        )}

        {risksError && (
          <div style={styles.errorBanner}>
            <AlertCircle size={20} />
            <div>{risksError}</div>
            <button type="button"
              onClick={() => {
                onClearError();
                onLoadRisks();
              }}
              style={styles.errorRetryButton}
            >
              {t('projects.detailPage.risksSection.retry')}
            </button>
          </div>
        )}

        <ManualRisksList
          risks={manualRisks}
          loading={risksLoading}
          error={risksError}
          onEdit={onOpenEditRisk}
          onDelete={onDeleteRisk}
          onRefresh={onRepredictRisks}
          canManage={canEdit && project.status === PROJECT_STATUS.ACTIVE}
        />

        <CBRInsightsPanel projectId={project._id} canEdit={canEdit} />
      </div>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
  },
  sectionDescription: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: '6px 0 0 0',
    lineHeight: '1.5',
  },
  risksSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '24px',
  },
  risksHeaderInfo: {
    flex: 1,
  },
  riskStats: {
    display: 'flex',
    gap: '24px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#EFF6FF',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #BFDBFE',
  },
  infoBannerText: {
    fontSize: '14px',
    color: '#1E40AF',
    lineHeight: '1.5',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--color-danger-bg)',
    borderRadius: '8px',
    marginBottom: '16px',
    color: 'var(--color-danger-strong)',
    fontSize: '14px',
  },
  errorRetryButton: {
    marginLeft: 'auto',
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-danger-bg)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-danger)',
    whiteSpace: 'nowrap',
  },
};

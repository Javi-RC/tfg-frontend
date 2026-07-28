import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, List, Network } from 'lucide-react';
import Tooltip from '../../common/Tooltip';

export default function RiskAnalysisHeader({
  overallRisk,
  overallColor,
  criticalRisks,
  highRisks,
  mediumRisks,
  lowRisks,
  teamCount,
  risksLength,
  viewMode,
  setViewMode,
  handleExport,
}) {
  const { t } = useTranslation();

  return (
    <section
      style={{ ...styles.summaryCard, borderLeft: `4px solid ${overallColor}` }}
      aria-label={t('projects.riskAnalysisTab.summary.aria')}
      className="risk-analysis-tab"
    >
      <div style={styles.summaryHeader} className="summaryHeader">
        <div style={styles.summaryLeft}>
          <h3 style={styles.summaryTitle}>{t('projects.riskAnalysisTab.summary.title')}</h3>
          <p style={styles.summarySubtext}>
            {t('projects.riskAnalysisTab.summary.basedOn')}{' '}
            {t('projects.riskAnalysisTab.summary.teamMembers', { count: teamCount })} •{' '}
            {t('projects.riskAnalysisTab.summary.risksIdentified', { count: risksLength })}
          </p>
        </div>
        <div style={styles.summaryRight} className="summaryRight">
          <Tooltip content={t('projects.riskAnalysisTab.export.tooltip')}>
            <button
              type="button"
              onClick={() => handleExport('csv')}
              style={styles.exportButton}
              aria-label={t('projects.riskAnalysisTab.export.ariaCsv')}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Download size={18} />
            </button>
          </Tooltip>

          <div
            style={styles.viewToggle}
            role="group"
            aria-label={t('projects.riskAnalysisTab.viewToggle.aria')}
            className="viewToggle"
          >
            <Tooltip content={t('projects.riskAnalysisTab.viewToggle.listTooltip')}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'list' ? styles.viewButtonActive : {}),
                }}
                aria-label={t('projects.riskAnalysisTab.viewToggle.switchToListAria')}
                aria-pressed={viewMode === 'list'}
                onMouseEnter={(e) =>
                  !e.currentTarget.getAttribute('aria-pressed') === 'true' &&
                  (e.currentTarget.style.backgroundColor = '#E5E7EB')
                }
                onMouseLeave={(e) =>
                  viewMode !== 'list' && (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <List size={18} aria-hidden="true" />
                <span className="sr-only">
                  {t('projects.riskAnalysisTab.viewToggle.listLabel')}
                </span>
              </button>
            </Tooltip>
            <Tooltip content={t('projects.riskAnalysisTab.viewToggle.flowTooltip')}>
              <button
                type="button"
                onClick={() => setViewMode('flow')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'flow' ? styles.viewButtonActive : {}),
                }}
                aria-label={t('projects.riskAnalysisTab.viewToggle.switchToFlowAria')}
                aria-pressed={viewMode === 'flow'}
                onMouseEnter={(e) =>
                  viewMode !== 'flow' && (e.currentTarget.style.backgroundColor = '#E5E7EB')
                }
                onMouseLeave={(e) =>
                  viewMode !== 'flow' && (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <Network size={18} aria-hidden="true" />
                <span className="sr-only">
                  {t('projects.riskAnalysisTab.viewToggle.flowLabel')}
                </span>
              </button>
            </Tooltip>
          </div>

          <Tooltip
            content={t('projects.riskAnalysisTab.summary.overallRiskLevel', {
              level: overallRisk,
            })}
          >
            <div
              style={{ ...styles.riskBadge, backgroundColor: overallColor }}
              role="status"
              aria-label={t('projects.riskAnalysisTab.summary.overallRiskLevel', {
                level: overallRisk,
              })}
            >
              {overallRisk}
            </div>
          </Tooltip>
        </div>
      </div>

      <ul
        style={{ ...styles.riskCounts, listStyle: 'none', padding: 0, margin: 0 }}
        aria-label={t('projects.riskAnalysisTab.severityCounts.aria')}
        className="riskCounts"
      >
        {criticalRisks.length > 0 && (
          <li style={styles.riskCount}>
            <Tooltip content={t('projects.riskAnalysisTab.severityHelp.critical')}>
              <span
                style={{ ...styles.countBadge, backgroundColor: 'var(--color-danger)' }}
                aria-label={t('projects.riskAnalysisTab.severityCount.critical', {
                  count: criticalRisks.length,
                })}
              >
                {criticalRisks.length}
              </span>
            </Tooltip>
            <span style={styles.countLabel}>{t('risk.severity.critical')}</span>
          </li>
        )}
        {highRisks.length > 0 && (
          <li style={styles.riskCount}>
            <Tooltip content={t('projects.riskAnalysisTab.severityHelp.high')}>
              <span
                style={{ ...styles.countBadge, backgroundColor: '#fd7e14' }}
                aria-label={t('projects.riskAnalysisTab.severityCount.high', {
                  count: highRisks.length,
                })}
              >
                {highRisks.length}
              </span>
            </Tooltip>
            <span style={styles.countLabel}>{t('risk.severity.high')}</span>
          </li>
        )}
        {mediumRisks.length > 0 && (
          <li style={styles.riskCount}>
            <Tooltip content={t('projects.riskAnalysisTab.severityHelp.medium')}>
              <span
                style={{ ...styles.countBadge, backgroundColor: 'var(--color-warning)' }}
                aria-label={t('projects.riskAnalysisTab.severityCount.medium', {
                  count: mediumRisks.length,
                })}
              >
                {mediumRisks.length}
              </span>
            </Tooltip>
            <span style={styles.countLabel}>{t('risk.severity.medium')}</span>
          </li>
        )}
        {lowRisks.length > 0 && (
          <li style={styles.riskCount}>
            <Tooltip content={t('projects.riskAnalysisTab.severityHelp.low')}>
              <span
                style={{ ...styles.countBadge, backgroundColor: 'var(--color-success)' }}
                aria-label={t('projects.riskAnalysisTab.severityCount.low', {
                  count: lowRisks.length,
                })}
              >
                {lowRisks.length}
              </span>
            </Tooltip>
            <span style={styles.countLabel}>{t('risk.severity.low')}</span>
          </li>
        )}
      </ul>
    </section>
  );
}

const styles = {
  summaryCard: {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  summaryTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  summarySubtext: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  riskBadge: {
    padding: '8px 20px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  riskCounts: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  riskCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  countBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
  },
  countLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    border: '1px solid var(--color-border-strong)',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'var(--color-text-strong)',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  viewToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    padding: '4px',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
  },
  viewButtonActive: {
    backgroundColor: '#fff',
    color: '#0366d6',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};

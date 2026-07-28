import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Target,
  Activity,
} from 'lucide-react';

export default function RiskCardDetails({ risk }) {
  const { t } = useTranslation();

  return (
    <div style={styles.expandedContent}>
      {risk.reasoning && risk.reasoning.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Target size={16} />
            <span>{t('risk.card.reasoning')}</span>
          </div>
          <ul style={styles.list}>
            {risk.reasoning.map((reason) => (
              <li key={reason} style={styles.listItem}>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risk.indicators && risk.indicators.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Activity size={16} />
            <span>{t('risk.card.indicatorsDetected')}</span>
          </div>
          <div style={styles.chipContainer}>
            {risk.indicators.map((indicator) => (
              <span key={indicator} style={styles.chip}>
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {risk.basedOnCases && risk.basedOnCases.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <BookOpen size={16} />
            <span>{t('risk.card.basedOnCases', { count: risk.basedOnCases.length })}</span>
          </div>
          <div style={styles.casesList}>
            {risk.basedOnCases.map((caseItem, idx) => {
              const projectName =
                caseItem.projectName ||
                caseItem.problem?.projectName ||
                caseItem.problem?.name ||
                caseItem.description ||
                t('common.caseFallback', { id: caseItem.caseId || caseItem._id || idx + 1 });

              const similarity = caseItem.similarity || caseItem.similarityIndex?.overall || 0;

              return (
                <div key={caseItem.caseId || caseItem._id} style={styles.caseItem}>
                  <div style={styles.caseInfo}>
                    <div style={styles.caseName}>{projectName}</div>
                    {caseItem.description && (
                      <div style={styles.caseDescription}>{caseItem.description}</div>
                    )}
                    {caseItem.problem?.description && !caseItem.description && (
                      <div style={styles.caseDescription}>{caseItem.problem.description}</div>
                    )}
                  </div>
                  <div style={styles.caseSimilarity}>
                    <div style={styles.similarityBar}>
                      <div
                        style={{
                          ...styles.similarityFill,
                          width: `${similarity * 100}%`,
                        }}
                      />
                    </div>
                    <span style={styles.similarityText}>{Math.round(similarity * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {risk.similarityBreakdown && Object.keys(risk.similarityBreakdown).length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <TrendingUp size={16} />
            <span>{t('risk.card.similarityBreakdown')}</span>
          </div>
          <div style={styles.breakdownGrid}>
            {Object.entries(risk.similarityBreakdown).map(([key, value]) => {
              const displayKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/_/g, ' ')
                .trim()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

              return (
                <div key={key} style={styles.breakdownItem}>
                  <span style={styles.breakdownLabel}>{displayKey}</span>
                  <div style={styles.breakdownBar}>
                    <div
                      style={{
                        ...styles.breakdownFill,
                        width: `${value * 100}%`,
                      }}
                    />
                  </div>
                  <span style={styles.breakdownValue}>{Math.round(value * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {risk.recommendations && risk.recommendations.length > 0 && risk.source !== 'cbr' && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Shield size={16} />
            <span>{t('risk.card.mitigationRecommendations')}</span>
          </div>
          <ul style={styles.list}>
            {risk.recommendations.map((rec) => (
              <li key={rec} style={styles.listItem}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risk.earlyWarningSignals && risk.earlyWarningSignals.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <AlertTriangle size={16} />
            <span>{t('risk.card.earlyWarningSignals')}</span>
          </div>
          <div style={styles.warningsList}>
            {risk.earlyWarningSignals.map((warning) => (
              <div key={warning.signal} style={styles.warningItem}>
                <div style={styles.warningSignal}>{warning.signal}</div>
                <div style={styles.warningDetails}>
                  <span style={styles.warningLabel}>{t('risk.card.threshold')}</span>
                  <span style={styles.warningValue}>{warning.threshold}</span>
                  <span style={styles.warningSeparator}>•</span>
                  <span style={styles.warningLabel}>{t('risk.card.check')}</span>
                  <span style={styles.warningValue}>{warning.checkFrequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {risk.occurred && risk.actualImpact && (
        <div style={styles.section}>
          <div
            style={{
              ...styles.sectionTitle,
              color: 'var(--color-danger-icon)',
            }}
          >
            <AlertTriangle size={16} />
            <span>{t('risk.card.riskOccurred')}</span>
          </div>
          <div style={styles.actualImpactBox}>
            <div style={styles.actualImpactItem}>
              <span style={styles.actualLabel}>{t('risk.card.scheduleDelay')}</span>
              <span style={styles.actualValue}>
                {t('risk.card.days', { count: risk.actualImpact.scheduleDelayDays })}
              </span>
            </div>
            <div style={styles.actualImpactItem}>
              <span style={styles.actualLabel}>{t('risk.card.budgetOverrun')}</span>
              <span style={styles.actualValue}>{risk.actualImpact.budgetOverrunPercent}%</span>
            </div>
            <div style={styles.actualImpactItem}>
              <span style={styles.actualLabel}>{t('risk.card.qualityScore')}</span>
              <span style={styles.actualValue}>{risk.actualImpact.qualityScore}</span>
            </div>
            {risk.actualImpact.description && (
              <div style={styles.actualDescription}>{risk.actualImpact.description}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  expandedContent: {
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    marginBottom: '4px',
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  listItem: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-text-strong)',
    backgroundColor: 'var(--color-bg-subtle)',
    border: '1px solid var(--color-border)',
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  caseItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
  },
  caseInfo: {
    flex: 1,
    minWidth: 0,
  },
  caseName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    marginBottom: '2px',
  },
  caseDescription: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },
  caseSimilarity: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '100px',
  },
  similarityBar: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  similarityFill: {
    height: '100%',
    backgroundColor: 'var(--color-success)',
    transition: 'width 0.3s ease',
  },
  similarityText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-success)',
    minWidth: '40px',
    textAlign: 'right',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
  },
  breakdownLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    minWidth: '80px',
  },
  breakdownBar: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: 'var(--color-success)',
    transition: 'width 0.3s ease',
  },
  breakdownValue: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-success)',
    minWidth: '40px',
    textAlign: 'right',
  },
  warningsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  warningItem: {
    padding: '10px',
    backgroundColor: 'var(--color-warning-bg)',
    border: '1px solid var(--color-warning-bg)',
    borderRadius: '6px',
  },
  warningSignal: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-warning-dark)',
    marginBottom: '6px',
  },
  warningDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#78350F',
  },
  warningLabel: {
    fontWeight: '600',
  },
  warningValue: {
    fontWeight: '400',
  },
  warningSeparator: {
    color: '#D97706',
  },
  actualImpactBox: {
    padding: '12px',
    backgroundColor: 'var(--color-danger-bg)',
    border: '1px solid var(--color-danger-bg)',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  actualImpactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actualLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-danger-strong)',
  },
  actualValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-danger)',
  },
  actualDescription: {
    fontSize: '12px',
    color: 'var(--color-danger-strong)',
    lineHeight: '1.5',
    marginTop: '4px',
    paddingTop: '8px',
    borderTop: '1px solid var(--color-danger-bg)',
  },
};

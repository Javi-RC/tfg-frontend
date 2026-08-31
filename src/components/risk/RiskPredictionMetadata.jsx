import React from 'react';
import { Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PhaseIndicator from './PhaseIndicator';
import { extractProjectName, extractSimilarity } from '../../utils/cbrCaseHelpers';
import { getStrategyLabel } from '../../utils/strategyHelpers';

/**
 * Risk Prediction Metadata Component
 * Displays metadata from risk prediction including:
 * - Similar cases from CBR
 * - Case base statistics
 * - System weights and sources
 * - Team insights
 */
export default function RiskPredictionMetadata({ metadata }) {
  const { t } = useTranslation();

  if (!metadata) {
    return null;
  }

  const { phase, strategy, phaseDescription, caseBaseSize, similarCases = [] } = metadata;

  const sanitizedPhaseDescription =
    typeof phaseDescription === 'string'
      ? phaseDescription.replace(/\bDT\b/g, 'alertas del sistema')
      : phaseDescription;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <Database size={20} />
          <h3 style={styles.title}>{t('risk.metadata.title')}</h3>
        </div>
      </div>

      {/* System Phase & Strategy */}
      {phase && strategy && (
        <div style={styles.phaseSection}>
          <PhaseIndicator
            phase={phase}
            strategy={strategy}
            caseCount={caseBaseSize}
            description={sanitizedPhaseDescription}
          />
          <div style={styles.strategyInfo}>
            <div style={styles.strategyLabel}>{t('risk.metadata.currentStrategy')}:</div>
            <div style={styles.strategyValue}>{getStrategyLabel(strategy, 'es')}</div>
          </div>
          {sanitizedPhaseDescription && (
            <div style={styles.phaseDescription}>{sanitizedPhaseDescription}</div>
          )}
        </div>
      )}

      {/* Similar Cases */}
      {similarCases && similarCases.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <Database size={16} />
            <span>{t('risk.metadata.similarCases', { count: similarCases.length })}</span>
          </div>
          <div style={styles.sectionDescription}>{t('risk.metadata.similarCasesDescription')}</div>

          <div style={styles.casesList}>
            {similarCases.map((caseItem) => {
              const projectName = extractProjectName(caseItem);
              const similarity = extractSimilarity(caseItem);

              return (
                <div key={caseItem.caseId || caseItem._id} style={styles.caseCard}>
                  <div style={styles.caseHeader}>
                    <div style={styles.caseInfo}>
                      <div style={styles.caseName}>{projectName}</div>
                      <div style={styles.caseSimilarityRow}>
                        <span style={styles.similarityLabel}>{t('risk.metadata.similarity')}:</span>
                        <div style={styles.similarityBar}>
                          <div
                            style={{
                              ...styles.similarityFill,
                              width: `${similarity * 100}%`,
                            }}
                          />
                        </div>
                        <span style={styles.similarityValue}>{(similarity * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    paddingBottom: '16px',
    borderBottom: '2px solid var(--color-border)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  systemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  systemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  systemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  systemContent: {
    flex: 1,
  },
  systemLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  systemValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  phaseSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  strategyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  strategyLabel: {
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  strategyValue: {
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  phaseDescription: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    borderLeft: '3px solid var(--color-accent-gradient-start)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  sectionDescription: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
    marginTop: '-4px',
  },
  weightsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  weightItem: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr 60px',
    alignItems: 'center',
    gap: '12px',
  },
  weightLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
  },
  weightBar: {
    height: '8px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  weightFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  weightValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    textAlign: 'right',
  },
  sourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  sourceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  sourceIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
  },
  sourceContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sourceLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  sourceValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  caseCard: {
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  caseHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  caseInfo: {
    flex: 1,
    minWidth: 0,
  },
  caseName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  caseDescription: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  caseSimilarityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  similarityLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    minWidth: '70px',
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
  similarityValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-success)',
    minWidth: '50px',
    textAlign: 'right',
  },
  outcomeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid currentColor',
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  outcomeDetails: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  outcomeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  outcomeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
  },
  outcomeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    flexShrink: 0,
  },
  outcomeContent: {
    flex: 1,
  },
  outcomeLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  outcomeValue: {
    fontSize: '15px',
    fontWeight: '700',
  },
  outcomeDescription: {
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  outcomeDescLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
  },
  outcomeDescText: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },
  insightsBox: {
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  insightKey: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
    textTransform: 'capitalize',
  },
  insightValue: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
};

import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PhaseIndicator from './PhaseIndicator';
import { getNextThreshold, getPhaseConfig } from '../../utils/strategyHelpers';

/**
 * System Maturity Panel Component
 * Displays the system's maturity level and progress towards next phase
 * 
 * @param {Object} props
 * @param {Object} props.metadata - Risk prediction metadata
 */
export default function SystemMaturityPanel({ metadata }) {
  const { t } = useTranslation();
  
  if (!metadata) {
    return null;
  }

  const { phase, strategy, caseBaseSize, phaseDescription } = metadata;
  const nextThreshold = getNextThreshold(caseBaseSize);
  const phaseConfig = getPhaseConfig(phase);

  const progressPercentage = nextThreshold 
    ? Math.min(100, (caseBaseSize / nextThreshold.threshold) * 100)
    : 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <TrendingUp size={20} color="#667EEA" />
        <h3 style={styles.title}>{t('risk.maturity.title')}</h3>
      </div>

      {/* Phase Indicator */}
      <div style={styles.phaseSection}>
        <PhaseIndicator 
          phase={phase}
          strategy={strategy}
          caseCount={caseBaseSize}
          description={phaseDescription}
        />
      </div>

      {/* Phase Description */}
      {phaseDescription && (
        <div style={styles.description}>
          {phaseDescription}
        </div>
      )}

      {/* Progress Bar */}
      {nextThreshold ? (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>
              {t('risk.maturity.progressLabel')}
            </span>
            <span style={styles.progressValue}>
              {t('risk.maturity.cases', { current: caseBaseSize, target: nextThreshold.threshold })}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
                backgroundColor: phaseConfig.color
              }}
            />
          </div>
          <div style={styles.progressInfo}>
            <span style={styles.remainingText}>
              {t('risk.maturity.remaining', { 
                count: nextThreshold.remaining,
                phase: nextThreshold.nextPhase,
                label: nextThreshold.nextLabel 
              })}
            </span>
          </div>
        </div>
      ) : (
        <div style={styles.maxPhaseSection}>
          <Award size={24} color="#8B5CF6" />
          <span style={styles.maxPhaseText}>
            {t('risk.maturity.maxPhase')}
          </span>
        </div>
      )}

      {/* Case Base Info */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{caseBaseSize}</div>
          <div style={styles.statLabel}>{t('risk.maturity.completedProjects')}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{t('risk.maturity.phaseLevel', { phase })}</div>
          <div style={styles.statLabel}>{t('risk.maturity.systemLevel')}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  phaseSection: {
    marginBottom: '16px'
  },
  description: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    borderLeft: '3px solid #667EEA'
  },
  progressSection: {
    marginBottom: '20px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  },
  progressValue: {
    fontSize: '13px',
    color: '#111',
    fontWeight: '600'
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#E5E7EB',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '6px'
  },
  progressInfo: {
    fontSize: '12px',
    color: '#6B7280'
  },
  remainingText: {
    fontWeight: '500'
  },
  maxPhaseSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F5F3FF',
    borderRadius: '12px',
    border: '1px solid #DDD6FE',
    marginBottom: '20px'
  },
  maxPhaseText: {
    fontSize: '14px',
    color: '#6B21A8',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
  },
  statCard: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500'
  }
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Target, AlertTriangle, Info } from 'lucide-react';
import { getStrategyLabel, usesDT, usesCBR } from '../../utils/strategyHelpers';

/**
 * Risk Statistics Card Component
 * Displays overall statistics for risk predictions
 */
export default function RiskStatsCard({ prediction, loading }) {
  const { t, i18n } = useTranslation();
  if (loading || !prediction) {
    return null;
  }

  const { risks, metadata } = prediction;

  const stats = {
    total: risks?.length || 0,
    high: risks?.filter(r => r.severity === 'high').length || 0,
    medium: risks?.filter(r => r.severity.includes('medium')).length || 0,
    low: risks?.filter(r => r.severity === 'low').length || 0,
    similarCases: metadata?.similarCases?.length || 0
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} />
          {t('riskStats.title')}
        </h3>
        <div style={styles.date}>
          {new Date(metadata?.predictionDate).toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><Target size={32} color="#667eea" /></div>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>{t('riskStats.detectedRisks')}</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.highCard }}>
          <div style={styles.statIcon}><AlertTriangle size={32} color="#dc2626" /></div>
          <div style={styles.statValue}>{stats.high}</div>
          <div style={styles.statLabel}>{t('riskStats.highSeverity')}</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.mediumCard }}>
          <div style={styles.statIcon}><AlertTriangle size={32} color="#f59e0b" /></div>
          <div style={styles.statValue}>{stats.medium}</div>
          <div style={styles.statLabel}>{t('riskStats.mediumSeverity')}</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.lowCard }}>
          <div style={styles.statIcon}><Info size={32} color="#10b981" /></div>
          <div style={styles.statValue}>{stats.low}</div>
          <div style={styles.statLabel}>{t('riskStats.lowSeverity')}</div>
        </div>

      </div>

      {/* System Phase & Strategy */}
      {metadata?.phase && metadata?.strategy && (
        <div style={styles.metadata}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>{t('riskStats.phase')}</span>
            <span style={styles.metaValue}>Fase {metadata.phase}/4</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>{t('riskStats.strategy')}</span>
            <span style={styles.metaValue}>{getStrategyLabel(metadata.strategy, 'es')}</span>
          </div>
          {metadata?.caseBaseSize !== undefined && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('riskStats.casesLearned')}</span>
              <span style={styles.metaValue}>{metadata.caseBaseSize}</span>
            </div>
          )}
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>{t('riskStats.dtActive')}</span>
            <span style={styles.metaValue}>
              {usesDT(metadata.strategy) ? t('riskStats.yes') : t('riskStats.no')}
            </span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>{t('riskStats.cbrActive')}</span>
            <span style={styles.metaValue}>
              {usesCBR(metadata.strategy) ? t('riskStats.yes') : t('riskStats.no')}
            </span>
          </div>
          {stats.similarCases > 0 && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('riskStats.similarCases')}</span>
              <span style={styles.metaValue}>{stats.similarCases}</span>
            </div>
          )}
        </div>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  date: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  statCard: {
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  highCard: {
    background: '#FEF2F2',
    border: '1px solid #FEE2E2'
  },
  mediumCard: {
    background: '#FFFBEB',
    border: '1px solid #FEF3C7'
  },
  lowCard: {
    background: '#F0FDF4',
    border: '1px solid #D1FAE5'
  },
  statIcon: {
    fontSize: '24px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
    fontWeight: '600'
  },
  metadata: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '13px'
  },
  metaItem: {
    display: 'flex',
    gap: '6px'
  },
  metaLabel: {
    color: '#6B7280',
    fontWeight: '500'
  },
  metaValue: {
    color: '#111',
    fontWeight: '600'
  }
};

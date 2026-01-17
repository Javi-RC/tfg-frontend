import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../common/StatCard';
import RiskItem from './RiskItem';
import SeverityBar from './SeverityBar';

function calculateRiskStats(predictedRisks, actualizedRisks) {
  const total = predictedRisks.length;
  const actualizedWithOutcome = actualizedRisks.filter((r) => r.occurred !== undefined);
  const occurred = actualizedRisks.filter((r) => r.occurred).length;
  const notOccurred = actualizedRisks.filter((r) => r.occurred === false).length;
  const pending = total - actualizedWithOutcome.length;

  const bySeverity = {
    critical: predictedRisks.filter((r) => r.severity === 'critical').length,
    high: predictedRisks.filter((r) => r.severity === 'high').length,
    medium: predictedRisks.filter((r) => r.severity === 'medium').length,
    low: predictedRisks.filter((r) => r.severity === 'low').length
  };

  const accuracy = actualizedWithOutcome.length > 0
    ? ((occurred / actualizedWithOutcome.length) * 100).toFixed(1)
    : 0;

  return {
    total,
    occurred,
    notOccurred,
    pending,
    bySeverity,
    accuracy
  };
}

/**
 * RiskStatsSection
 * Renders risk statistics cards, severity distribution and predicted risks list.
 */
export default function RiskStatsSection({ predictedRisks = [], actualizedRisks = [] }) {
  const { t } = useTranslation();
  const stats = useMemo(
    () => calculateRiskStats(predictedRisks, actualizedRisks),
    [predictedRisks, actualizedRisks]
  );

  const getRiskId = (risk, index) => {
    const candidate = risk?.id ?? risk?._id;
    if (candidate) return String(candidate);
    if (risk?.type) return `${String(risk.type)}-${index}`;
    return String(index);
  };

  return (
    <div style={styles.statsSection}>
      {/* Quick Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          value={stats.total}
          label={t('risk.stats.totalRisks')}
          icon={AlertTriangle}
          borderColor="#3B82F6"
          iconColor="#3B82F6"
        />
        <StatCard
          value={stats.occurred}
          label={t('risk.stats.occurred')}
          icon={Activity}
          borderColor="#10B981"
          iconColor="#10B981"
        />
        <StatCard
          value={stats.notOccurred}
          label={t('risk.stats.notOccurred')}
          icon={Activity}
          borderColor="#6B7280"
          iconColor="#6B7280"
        />
        <StatCard
          value={`${stats.accuracy}%`}
          label={t('risk.stats.predictionRate')}
          icon={TrendingUp}
          borderColor="#F59E0B"
          iconColor="#F59E0B"
        />
      </div>

      {/* Severity Distribution */}
      <div style={styles.distributionCard}>
        <h3 style={styles.distributionTitle}>{t('risk.stats.distributionTitle')}</h3>
        <div style={styles.severityBars}>
          <SeverityBar
            label={t('risk.severity.critical')}
            count={stats.bySeverity.critical}
            total={stats.total}
            color="#DC2626"
          />
          <SeverityBar
            label={t('risk.severity.high')}
            count={stats.bySeverity.high}
            total={stats.total}
            color="#F59E0B"
          />
          <SeverityBar
            label={t('risk.severity.medium')}
            count={stats.bySeverity.medium}
            total={stats.total}
            color="#EAB308"
          />
          <SeverityBar
            label={t('risk.severity.low')}
            count={stats.bySeverity.low}
            total={stats.total}
            color="#10B981"
          />
        </div>
      </div>

      {/* Risk List */}
      <div style={styles.riskListCard}>
        <h3 style={styles.riskListTitle}>{t('risk.stats.predictedRisksTitle')}</h3>
        <div style={styles.riskList}>
          {predictedRisks.map((risk, index) => {
            const riskId = getRiskId(risk, index);
            const actualized = actualizedRisks.find((ar) => String(ar.riskId) === riskId);
            return (
              <RiskItem
                key={riskId}
                risk={risk}
                actualized={actualized}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  distributionCard: {
    padding: '24px',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  distributionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  severityBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  riskListCard: {
    padding: '24px',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  riskListTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  riskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
};

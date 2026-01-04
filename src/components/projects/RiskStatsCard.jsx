import React from 'react';
import { BarChart3, Target, AlertTriangle, Info, CheckCircle } from 'lucide-react';

/**
 * Risk Statistics Card Component
 * Displays overall statistics for risk predictions
 */
export default function RiskStatsCard({ prediction, loading }) {
  if (loading || !prediction) {
    return null;
  }

  const { risks, metadata } = prediction;

  const stats = {
    total: risks?.length || 0,
    high: risks?.filter(r => r.severity === 'high').length || 0,
    medium: risks?.filter(r => r.severity.includes('medium')).length || 0,
    low: risks?.filter(r => r.severity === 'low').length || 0,
    confidence: metadata?.overallConfidence || 0,
    similarCases: metadata?.similarCases?.length || 0
  };

  const avgProbability = risks?.length > 0
    ? risks.reduce((sum, r) => sum + (r.probability || 0), 0) / risks.length
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} />
          Risk Summary
        </h3>
        <div style={styles.date}>
          {new Date(metadata?.predictionDate).toLocaleDateString('en-US', {
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
          <div style={styles.statLabel}>Detected Risks</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.highCard }}>
          <div style={styles.statIcon}><AlertTriangle size={32} color="#dc2626" /></div>
          <div style={styles.statValue}>{stats.high}</div>
          <div style={styles.statLabel}>High Severity</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.mediumCard }}>
          <div style={styles.statIcon}><AlertTriangle size={32} color="#f59e0b" /></div>
          <div style={styles.statValue}>{stats.medium}</div>
          <div style={styles.statLabel}>Medium Severity</div>
        </div>

        <div style={{ ...styles.statCard, ...styles.lowCard }}>
          <div style={styles.statIcon}><Info size={32} color="#10b981" /></div>
          <div style={styles.statValue}>{stats.low}</div>
          <div style={styles.statLabel}>Low Severity</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><Target size={32} color="#8b5cf6" /></div>
          <div style={styles.statValue}>{(avgProbability * 100).toFixed(0)}%</div>
          <div style={styles.statLabel}>Average Probability</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><CheckCircle size={32} color="#10b981" /></div>
          <div style={styles.statValue}>{(stats.confidence * 100).toFixed(0)}%</div>
          <div style={styles.statLabel}>Confidence</div>
        </div>
      </div>

      {/* System Phase & Weights */}
      {metadata?.systemPhase && (
        <div style={styles.metadata}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>System Phase:</span>
            <span style={styles.metaValue}>{metadata.systemPhase}</span>
          </div>
          {metadata.weights && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Weights:</span>
              <span style={styles.metaValue}>
                Tree: {(metadata.weights.treeWeight * 100).toFixed(0)}% | 
                CBR: {(metadata.weights.cbrWeight * 100).toFixed(0)}%
              </span>
            </div>
          )}
          {stats.similarCases > 0 && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Similar Cases:</span>
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

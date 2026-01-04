import React from 'react';
import TeamInsightCard from './TeamInsightCard';

/**
 * Team Insights Panel Component
 * Displays comprehensive team analysis with insights
 */
export default function TeamInsightsPanel({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const highSeverityInsights = insights.filter(i => i.severity === 'high');
  const mediumSeverityInsights = insights.filter(i => i.severity === 'medium');
  const lowSeverityInsights = insights.filter(i => i.severity === 'low');

  const getPanelStyle = () => {
    if (highSeverityInsights.length > 0) {
      return {
        ...styles.panel,
        background: '#FEF2F2',
        border: '2px solid #FEE2E2'
      };
    }
    if (mediumSeverityInsights.length > 0) {
      return {
        ...styles.panel,
        background: '#FFFBEB',
        border: '2px solid #FEF3C7'
      };
    }
    return {
      ...styles.panel,
      background: '#F0FDF4',
      border: '2px solid #D1FAE5'
    };
  };

  const getTitleStyle = () => {
    if (highSeverityInsights.length > 0) {
      return { ...styles.title, color: '#DC2626' };
    }
    if (mediumSeverityInsights.length > 0) {
      return { ...styles.title, color: '#D97706' };
    }
    return { ...styles.title, color: '#059669' };
  };

  return (
    <div style={getPanelStyle()}>
      <div style={styles.header}>
        <h3 style={getTitleStyle()}>
          👥 Team Analysis
        </h3>
        <div style={styles.summary}>
          {highSeverityInsights.length > 0 && (
            <span style={styles.summaryItem}>
              <span style={{ ...styles.badge, ...styles.highBadge }}>
                {highSeverityInsights.length}
              </span>
                <span style={styles.summaryLabel}>Critical</span>
            </span>
          )}
          {mediumSeverityInsights.length > 0 && (
            <span style={styles.summaryItem}>
              <span style={{ ...styles.badge, ...styles.mediumBadge }}>
                {mediumSeverityInsights.length}
              </span>
                <span style={styles.summaryLabel}>Moderate</span>
            </span>
          )}
          {lowSeverityInsights.length > 0 && (
            <span style={styles.summaryItem}>
              <span style={{ ...styles.badge, ...styles.lowBadge }}>
                {lowSeverityInsights.length}
              </span>
                <span style={styles.summaryLabel}>Low</span>
            </span>
          )}
        </div>
      </div>

      <div style={styles.insightsList}>
        {insights.map((insight, idx) => (
          <TeamInsightCard key={idx} insight={insight} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  summary: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700'
  },
  highBadge: {
    background: '#FEE2E2',
    color: '#DC2626'
  },
  mediumBadge: {
    background: '#FEF3C7',
    color: '#D97706'
  },
  lowBadge: {
    background: '#D1FAE5',
    color: '#059669'
  },
  summaryLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
};

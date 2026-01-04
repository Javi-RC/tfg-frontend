import React from 'react';
import { Target, BarChart3, Globe, AlertTriangle, RefreshCw, MessageCircle, ClipboardList } from 'lucide-react';

/**
 * Team Insight Card Component
 * Displays insights about team capabilities and gaps
 */
export default function TeamInsightCard({ insight }) {
  const getSeverityStyle = (severity) => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    };

    switch (severity) {
      case 'high':
        return {
          ...baseStyle,
          background: '#FEF2F2',
          borderColor: '#FEE2E2'
        };
      case 'medium':
        return {
          ...baseStyle,
          background: '#FFFBEB',
          borderColor: '#FEF3C7'
        };
      case 'low':
        return {
          ...baseStyle,
          background: '#F0FDF4',
          borderColor: '#D1FAE5'
        };
      default:
        return {
          ...baseStyle,
          background: '#F9FAFB',
          borderColor: '#E5E7EB'
        };
    }
  };

  const getIcon = (type) => {
    const icons = {
      skill_gap: <Target size={24} />,
      experience_gap: <BarChart3 size={24} />,
      language_barrier: <Globe size={24} />,
      team_overload: <AlertTriangle size={24} />,
      coordination_issues: <RefreshCw size={24} />,
      communication_breakdown: <MessageCircle size={24} />
    };
    return icons[type] || <ClipboardList size={24} />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      skill_gap: 'Skill gap',
      experience_gap: 'Experience gap',
      language_barrier: 'Language barrier',
      team_overload: 'Team overload',
      coordination_issues: 'Coordination issues',
      communication_breakdown: 'Communication breakdown'
    };
    return labels[type] || type.replace(/_/g, ' ');
  };

  return (
    <div style={getSeverityStyle(insight.severity)}>
      <div style={styles.icon}>
        {getIcon(insight.type)}
      </div>
      <div style={styles.content}>
        <div style={styles.header}>
          <h5 style={styles.type}>{getTypeLabel(insight.type)}</h5>
        </div>
        <p style={styles.message}>{insight.message}</p>
        <div style={styles.recommendation}>
          <strong style={styles.recommendationLabel}>Recommendation:</strong>
          <span style={styles.recommendationText}>{insight.recommendation}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  icon: {
    fontSize: '24px',
    flexShrink: 0
  },
  content: {
    flex: 1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  type: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  message: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
    margin: '0 0 12px 0'
  },
  recommendation: {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.6)',
    borderRadius: '6px',
    fontSize: '13px',
    lineHeight: '1.5'
  },
  recommendationLabel: {
    color: '#111',
    marginRight: '4px'
  },
  recommendationText: {
    color: '#374151'
  }
};

import React from 'react';
import { Circle, AlertTriangle, Calendar, DollarSign, Sparkles, Users } from 'lucide-react';
import RiskSeverityBadge from './RiskSeverityBadge';

/**
 * Risk Card Component
 * Displays detailed information about a specific risk with confidence indicators
 */
export default function RiskCard({ risk, dataCompleteness }) {
  const [expanded, setExpanded] = React.useState(false);

  const getRiskTypeLabel = (type) => {
    const labels = {
      skill_gap: 'Skill Gap',
      communication_breakdown: 'Communication Breakdown',
      team_overload: 'Team Overload',
      coordination_issues: 'Coordination Issues',
      technical_debt: 'Technical Debt',
      resource_constraints: 'Resource Constraints',
      schedule_pressure: 'Schedule Pressure',
      quality_issues: 'Quality Issues',
      km_knowledge_gap: 'Knowledge Management Gap',
      remote_work_gap: 'Remote Work Challenges',
      role_clarity_issue: 'Role Clarity Issue',
      compliance_risk: 'Compliance Risk',
      timezone_coordination: 'Timezone Coordination Issue'
    };
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium-high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  // Get confidence level indicator
  const getConfidenceIndicator = (confidence) => {
    if (confidence >= 0.75) return { emoji: '🟢', label: 'High Confidence', color: '#10B981' };
    if (confidence >= 0.50) return { emoji: '🟡', label: 'Medium Confidence', color: '#F59E0B' };
    return { emoji: '🔴', label: 'Low Confidence', color: '#EF4444' };
  };

  const confidenceInfo = getConfidenceIndicator(risk.confidence);
  const showDataWarning = dataCompleteness && dataCompleteness < 60;

  return (
    <div style={styles.card}>
      {/* Data Quality Warning */}
      {showDataWarning && (
        <div style={styles.dataWarning}>
          <span style={styles.warningIcon}><AlertTriangle size={16} color="#f59e0b" /></span>
          <span style={styles.warningText}>
            Limited data available ({dataCompleteness}% complete). Add more project details for improved accuracy.
          </span>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <RiskSeverityBadge severity={risk.severity} />
          <h4 style={styles.title}>{getRiskTypeLabel(risk.type)}</h4>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.probability}>
            <span style={styles.probabilityLabel}>Probability</span>
            <span style={{
              ...styles.probabilityValue,
              color: getSeverityColor(risk.severity)
            }}>
              {(risk.probability * 100).toFixed(0)}%
            </span>
          </div>
          <div style={styles.confidence}>
            <span style={styles.confidenceLabel}>
              {confidenceInfo.emoji} {confidenceInfo.label}
            </span>
            <span style={{
              ...styles.confidenceValue,
              color: confidenceInfo.color,
              fontWeight: '600'
            }}>
              {(risk.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div style={styles.section}>
        <h5 style={styles.sectionTitle}>Why does this risk exist?</h5>
        <ul style={styles.list}>
          {risk.reasoning.map((reason, idx) => (
            <li 
              key={idx} 
              style={{
                ...styles.listItem,
                color: (reason.startsWith('CRÍTICO') || reason.startsWith('CRITICAL')) ? '#DC2626' : '#374151'
              }}
            >
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Indicators */}
      {risk.indicators && risk.indicators.length > 0 && (
        <div style={styles.section}>
          <h5 style={styles.sectionTitle}>Indicators</h5>
          <div style={styles.indicatorsGrid}>
            {risk.indicators.map((indicator, idx) => (
              <div key={idx} style={styles.indicator}>
                {indicator}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact */}
      {risk.predictedImpact && (
        <div style={styles.section}>
          <h5 style={styles.sectionTitle}>Expected Impact</h5>
          <div style={styles.impactGrid}>
            {risk.predictedImpact.scheduleDelay && (
              <div style={styles.impactItem}>
                <div style={styles.impactLabel}>📅 Schedule Delay</div>
                <div style={styles.impactValue}>
                  {risk.predictedImpact.scheduleDelay.min}-{risk.predictedImpact.scheduleDelay.max} days
                </div>
                {risk.predictedImpact.scheduleDelay.description && (
                  <div style={styles.impactDescription}>
                    {risk.predictedImpact.scheduleDelay.description}
                  </div>
                )}
              </div>
            )}
            {risk.predictedImpact.budgetOverrun && (
              <div style={styles.impactItem}>
                <div style={styles.impactLabel}>💰 Budget Overrun</div>
                <div style={styles.impactValue}>
                  {risk.predictedImpact.budgetOverrun.min}-{risk.predictedImpact.budgetOverrun.max}%
                </div>
                {risk.predictedImpact.budgetOverrun.description && (
                  <div style={styles.impactDescription}>
                    {risk.predictedImpact.budgetOverrun.description}
                  </div>
                )}
              </div>
            )}
            {risk.predictedImpact.qualityImpact && (
              <div style={styles.impactItem}>
                <div style={styles.impactLabel}>✨ Quality Impact</div>
                <div style={styles.impactValue}>
                  {risk.predictedImpact.qualityImpact.toUpperCase()}
                </div>
              </div>
            )}
            {risk.predictedImpact.teamMoraleImpact && (
              <div style={styles.impactItem}>
                <div style={styles.impactLabel}>👥 Team Morale Impact</div>
                <div style={styles.impactValue}>
                  {risk.predictedImpact.teamMoraleImpact.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {risk.recommendations && risk.recommendations.length > 0 && (
        <div style={styles.section}>
          <h5 style={styles.sectionTitle}>Recommendations</h5>
          <div style={styles.recommendationsList}>
            {risk.recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.recommendation,
                  background: rec.startsWith('URGENTE') ? '#FEE2E2' : '#F9FAFB',
                  borderLeft: rec.startsWith('URGENTE') 
                    ? '3px solid #DC2626' 
                    : '3px solid #3B82F6'
                }}
              >
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Early Warning Signals - Collapsible */}
      {risk.earlyWarningSignals && risk.earlyWarningSignals.length > 0 && (
        <div style={styles.section}>
          <button
            style={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            <span style={styles.expandIcon}>{expanded ? '▼' : '▶'}</span>
            <span>Early Warning Signals ({risk.earlyWarningSignals.length})</span>
          </button>
          {expanded && (
            <div style={styles.signalsList}>
              {risk.earlyWarningSignals.map((signal, idx) => (
                <div key={idx} style={styles.signal}>
                  <div style={styles.signalHeader}>
                    <span style={styles.signalName}>{signal.signal}</span>
                    <span style={styles.signalFrequency}>{signal.checkFrequency}</span>
                  </div>
                  {signal.threshold && (
                    <div style={styles.signalThreshold}>
                      Threshold: {signal.threshold}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source */}
      <div style={styles.footer}>
        <span style={styles.source}>Source: {risk.source}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    gap: '16px'
  },
  probability: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  probabilityLabel: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  probabilityValue: {
    fontSize: '20px',
    fontWeight: '700'
  },
  confidence: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  confidenceLabel: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  confidenceValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  dataWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#FEF3C7',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #FCD34D'
  },
  warningIcon: {
    fontSize: '16px'
  },
  warningText: {
    fontSize: '13px',
    color: '#92400E',
    lineHeight: '1.5'
  },
  section: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #F3F4F6'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  list: {
    margin: 0,
    paddingLeft: '20px'
  },
  listItem: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '8px'
  },
  indicatorsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  indicator: {
    padding: '6px 12px',
    background: '#F3F4F6',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500'
  },
  impactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  impactItem: {
    padding: '12px',
    background: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  impactLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '4px',
    fontWeight: '600'
  },
  impactValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '4px'
  },
  impactDescription: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '1.5'
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  recommendation: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#111'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  expandIcon: {
    fontSize: '10px',
    transition: 'transform 0.2s'
  },
  signalsList: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  signal: {
    padding: '12px',
    background: '#FEF3C7',
    borderRadius: '8px',
    border: '1px solid #FCD34D'
  },
  signalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  signalName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#92400E'
  },
  signalFrequency: {
    fontSize: '11px',
    color: '#92400E',
    background: '#FDE68A',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  signalThreshold: {
    fontSize: '12px',
    color: '#92400E'
  },
  footer: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #F3F4F6'
  },
  source: {
    fontSize: '11px',
    color: '#9CA3AF',
    fontStyle: 'italic'
  }
};

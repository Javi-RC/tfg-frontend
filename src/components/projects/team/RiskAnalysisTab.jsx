import React from 'react';
import { Users, CheckCircle, AlertTriangle, Lightbulb, Shield, Circle } from 'lucide-react';

/**
 * RiskAnalysisTab - Risk analysis and predictions interface
 * 
 * Features:
 * - Overall risk assessment
 * - Categorized risk display
 * - Risk severity indicators
 * - Mitigation recommendations
 */
export default function RiskAnalysisTab({
  project,
  riskAnalysis,
  riskLoading,
  teamCount
}) {
  // Show loading state
  if (riskLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Analyzing project risks...</p>
      </div>
    );
  }

  // Show empty state if no team
  if (teamCount === 0) {
    return (
      <div style={styles.emptyState}>
        <Users size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
        <h3 style={styles.emptyTitle}>No Team Assigned Yet</h3>
        <p style={styles.emptyText}>
          Assign team members first to analyze potential project risks
        </p>
      </div>
    );
  }

  // Show no risks found
  if (!riskAnalysis || !riskAnalysis.risks || riskAnalysis.risks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <CheckCircle size={48} color="#28a745" style={{ opacity: 0.5, marginBottom: '16px' }} />
        <h3 style={styles.emptyTitle}>No Significant Risks Detected</h3>
        <p style={styles.emptyText}>
          The current team composition shows low risk indicators. Continue monitoring as the project progresses.
        </p>
      </div>
    );
  }

  // Calculate risk summary
  const risks = riskAnalysis.risks || [];
  const criticalRisks = risks.filter(r => r.severity === 'critical');
  const highRisks = risks.filter(r => r.severity === 'high');
  const mediumRisks = risks.filter(r => r.severity === 'medium');
  const lowRisks = risks.filter(r => r.severity === 'low');

  // Determine overall risk level
  let overallRisk = 'LOW';
  let overallColor = '#28a745';
  if (criticalRisks.length > 0) {
    overallRisk = 'CRITICAL';
    overallColor = '#dc3545';
  } else if (highRisks.length > 2) {
    overallRisk = 'HIGH';
    overallColor = '#fd7e14';
  } else if (highRisks.length > 0) {
    overallRisk = 'MEDIUM';
    overallColor = '#ffc107';
  }

  return (
    <div style={styles.container}>
      {/* Overall Risk Summary */}
      <div style={{...styles.summaryCard, borderLeft: `4px solid ${overallColor}`}}>
        <div style={styles.summaryHeader}>
          <div style={styles.summaryLeft}>
            <h3 style={styles.summaryTitle}>Overall Risk Assessment</h3>
            <p style={styles.summarySubtext}>
              Based on {teamCount} team members • {risks.length} risks identified
            </p>
          </div>
          <div style={{...styles.riskBadge, backgroundColor: overallColor}}>
            {overallRisk}
          </div>
        </div>

        {/* Risk Counts */}
        <div style={styles.riskCounts}>
          {criticalRisks.length > 0 && (
            <div style={styles.riskCount}>
              <span style={{...styles.countBadge, backgroundColor: '#dc3545'}}>
                {criticalRisks.length}
              </span>
              <span style={styles.countLabel}>Critical</span>
            </div>
          )}
          {highRisks.length > 0 && (
            <div style={styles.riskCount}>
              <span style={{...styles.countBadge, backgroundColor: '#fd7e14'}}>
                {highRisks.length}
              </span>
              <span style={styles.countLabel}>High</span>
            </div>
          )}
          {mediumRisks.length > 0 && (
            <div style={styles.riskCount}>
              <span style={{...styles.countBadge, backgroundColor: '#ffc107'}}>
                {mediumRisks.length}
              </span>
              <span style={styles.countLabel}>Medium</span>
            </div>
          )}
          {lowRisks.length > 0 && (
            <div style={styles.riskCount}>
              <span style={{...styles.countBadge, backgroundColor: '#28a745'}}>
                {lowRisks.length}
              </span>
              <span style={styles.countLabel}>Low</span>
            </div>
          )}
        </div>
      </div>

      {/* Risk Details */}
      <div style={styles.risksSection}>
        <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} />
          Identified Risks
        </h3>

        <div style={styles.risksList}>
          {/* Critical Risks First */}
          {criticalRisks.map((risk, idx) => (
            <RiskCard key={`critical-${idx}`} risk={risk} />
          ))}
          
          {/* High Risks */}
          {highRisks.map((risk, idx) => (
            <RiskCard key={`high-${idx}`} risk={risk} />
          ))}
          
          {/* Medium Risks */}
          {mediumRisks.map((risk, idx) => (
            <RiskCard key={`medium-${idx}`} risk={risk} />
          ))}
          
          {/* Low Risks */}
          {lowRisks.map((risk, idx) => (
            <RiskCard key={`low-${idx}`} risk={risk} />
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
        <div style={styles.recommendationsSection}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} />
            Recommendations
          </h3>
          <div style={styles.recommendationsList}>
            {riskAnalysis.recommendations.map((rec, idx) => (
              <div key={idx} style={styles.recommendationCard}>
                <CheckCircle size={16} color="#28a745" style={{ flexShrink: 0 }} />
                <p style={styles.recommendationText}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * RiskCard - Individual risk display component
 */
function RiskCard({ risk }) {
  const severityConfig = {
    critical: { color: '#dc3545', icon: <Circle size={12} fill="#dc3545" color="#dc3545" />, label: 'Critical' },
    high: { color: '#fd7e14', icon: <Circle size={12} fill="#fd7e14" color="#fd7e14" />, label: 'High' },
    medium: { color: '#ffc107', icon: <Circle size={12} fill="#ffc107" color="#ffc107" />, label: 'Medium' },
    low: { color: '#28a745', icon: <Circle size={12} fill="#28a745" color="#28a745" />, label: 'Low' },
  };

  const config = severityConfig[risk.severity] || severityConfig.medium;

  return (
    <div style={{...styles.riskCard, borderLeftColor: config.color}}>
      <div style={styles.riskHeader}>
        <div style={styles.riskTitle}>
          <span style={styles.riskIcon}>{config.icon}</span>
          {risk.name || risk.title || 'Unnamed Risk'}
        </div>
        <span style={{...styles.severityBadge, backgroundColor: config.color}}>
          {config.label}
        </span>
      </div>

      <p style={styles.riskDescription}>
        {risk.description || 'No description available'}
      </p>

      {/* Impact */}
      {risk.impact && (
        <div style={styles.riskDetail}>
          <span style={styles.detailLabel}>Impact:</span>
          <span style={styles.detailValue}>{risk.impact}</span>
        </div>
      )}

      {/* Mitigation */}
      {risk.mitigation && (
        <div style={styles.mitigationBox}>
          <div style={styles.mitigationLabel}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} />
              Mitigation Strategy
            </span>
          </div>
          <p style={styles.mitigationText}>{risk.mitigation}</p>
        </div>
      )}

      {/* Related Factors */}
      {risk.factors && risk.factors.length > 0 && (
        <div style={styles.factorsSection}>
          <span style={styles.factorsLabel}>Related Factors:</span>
          <div style={styles.factorsList}>
            {risk.factors.map((factor, idx) => (
              <span key={idx} style={styles.factorChip}>
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  // Loading State
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '15px',
    color: '#6c757d',
    margin: 0,
  },
  
  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '72px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#24292e',
    margin: '0 0 12px 0',
  },
  emptyText: {
    fontSize: '15px',
    color: '#586069',
    margin: 0,
    maxWidth: '400px',
    lineHeight: '1.6',
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
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
  summaryTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#24292e',
  },
  summarySubtext: {
    margin: 0,
    fontSize: '14px',
    color: '#586069',
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
    color: '#586069',
  },
  
  // Sections
  risksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e1e4e8',
  },
  titleIcon: {
    fontSize: '20px',
  },
  
  // Risks List
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  riskCard: {
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderLeft: '4px solid',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.2s ease',
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    gap: '16px',
  },
  riskTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  riskIcon: {
    fontSize: '18px',
  },
  severityBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  riskDescription: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#586069',
    lineHeight: '1.6',
  },
  riskDetail: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#24292e',
  },
  detailValue: {
    color: '#586069',
  },
  
  // Mitigation
  mitigationBox: {
    backgroundColor: '#f6f8fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    padding: '12px',
    marginTop: '12px',
  },
  mitigationLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#24292e',
    marginBottom: '6px',
  },
  mitigationIcon: {
    fontSize: '14px',
  },
  mitigationText: {
    margin: 0,
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.5',
  },
  
  // Factors
  factorsSection: {
    marginTop: '12px',
  },
  factorsLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#24292e',
    display: 'block',
    marginBottom: '8px',
  },
  factorsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  factorChip: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  
  // Recommendations
  recommendationsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recommendationCard: {
    backgroundColor: '#f0f7ff',
    border: '1px solid #c8e1ff',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
  },
  recommendationIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  recommendationText: {
    margin: 0,
    fontSize: '14px',
    color: '#0366d6',
    lineHeight: '1.6',
    flex: 1,
  },
};

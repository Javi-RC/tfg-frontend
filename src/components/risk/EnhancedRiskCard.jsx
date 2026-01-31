import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  Target,
  Clock,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import Tooltip from '../common/Tooltip';
import RiskSourceBadge from './RiskSourceBadge';

/**
 * Enhanced Risk Card Component
 * Displays comprehensive risk information including:
 * - Source differentiation (CBR vs Expert Rules)
 * - Probability and confidence metrics
 * - Based on cases (for CBR risks)
 * - Similarity breakdown
 * - Predicted impact (schedule, budget, quality, team morale)
 * - Recommendations and early warning signals
 * - Reasoning and indicators
 */
export default function EnhancedRiskCard({ risk, isExpanded, onToggle, metadata }) {
  const { t } = useTranslation();

  const severityConfig = {
    critical: { 
      color: '#dc3545', 
      labelKey: 'risk.severity.critical',
      bgColor: '#FEE2E2'
    },
    high: { 
      color: '#fd7e14', 
      labelKey: 'risk.severity.high',
      bgColor: '#FED7AA'
    },
    'medium-high': { 
      color: '#F59E0B', 
      labelKey: 'risk.severity.mediumHigh',
      bgColor: '#FEF3C7'
    },
    medium: { 
      color: '#ffc107', 
      labelKey: 'risk.severity.medium',
      bgColor: '#FEF9C3'
    },
    low: { 
      color: '#28a745', 
      labelKey: 'risk.severity.low',
      bgColor: '#D1FAE5'
    },
    emerging: { 
      color: '#667EEA', 
      labelKey: 'risk.severity.emerging',
      bgColor: '#E0E7FF'
    },
  };

  const config = severityConfig[risk.severity] || severityConfig.medium;
  const severityLabel = t(config.labelKey);

  return (
    <article 
      style={{
        ...styles.riskCard, 
        borderLeftColor: config.color
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'}
    >
      {/* Risk Header */}
      <div style={styles.riskHeader}>
        <div style={styles.riskTitleRow}>
          <Circle size={12} fill={config.color} color={config.color} aria-hidden="true" />
          <h4 style={styles.riskTitle}>
            {risk.title || risk.name || t('risk.card.unnamedRisk', { defaultValue: 'Unnamed risk' })}
          </h4>
        </div>
        
        <div style={styles.badges}>
          {/* Source Badge */}
          <RiskSourceBadge 
            risk={risk}
            strategy={metadata?.strategy}
            size="md"
          />

          {/* Severity Badge */}
          <Tooltip content={`${severityLabel} ${t('risk.severity.label', 'severity risk')}`}>
            <span style={{
              ...styles.severityBadge, 
              backgroundColor: config.color
            }}>
              {severityLabel}
            </span>
          </Tooltip>

        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggle}
          style={styles.expandButton}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Description */}
      <p style={styles.riskDescription}>
        {risk.description || t('risk.card.noDescription')}
      </p>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={styles.expandedContent}>
          {/* Reasoning */}
          {risk.reasoning && risk.reasoning.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <Target size={16} />
                <span>{t('risk.card.reasoning')}</span>
              </div>
              <ul style={styles.list}>
                {risk.reasoning.map((reason, idx) => (
                  <li key={idx} style={styles.listItem}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Indicators */}
          {risk.indicators && risk.indicators.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <Activity size={16} />
                <span>{t('risk.card.indicatorsDetected')}</span>
              </div>
              <div style={styles.chipContainer}>
                {risk.indicators.map((indicator, idx) => (
                  <span key={idx} style={styles.chip}>{indicator}</span>
                ))}
              </div>
            </div>
          )}

          {/* Based On Cases (CBR only) */}
          {risk.basedOnCases && risk.basedOnCases.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <BookOpen size={16} />
                <span>{t('risk.card.basedOnCases', { count: risk.basedOnCases.length })}</span>
              </div>
              <div style={styles.casesList}>
                {risk.basedOnCases.map((caseItem, idx) => {
                  // Extract project name from case structure
                  const projectName = caseItem.projectName || 
                                    caseItem.problem?.projectName || 
                                    caseItem.problem?.name || 
                                    caseItem.description || 
                                    `Case ${caseItem.caseId || caseItem._id || idx + 1}`;
                  
                  // Get similarity from various possible locations
                  const similarity = caseItem.similarity || 
                                   caseItem.similarityIndex?.overall || 
                                   0;
                  
                  return (
                    <div key={caseItem.caseId || caseItem._id || idx} style={styles.caseItem}>
                      <div style={styles.caseInfo}>
                        <div style={styles.caseName}>
                          {projectName}
                        </div>
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
                              width: `${similarity * 100}%`
                            }}
                          />
                        </div>
                        <span style={styles.similarityText}>
                          {Math.round(similarity * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Similarity Breakdown (CBR only) */}
          {risk.similarityBreakdown && Object.keys(risk.similarityBreakdown).length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <TrendingUp size={16} />
                <span>{t('risk.card.similarityBreakdown')}</span>
              </div>
              <div style={styles.breakdownGrid}>
                {Object.entries(risk.similarityBreakdown).map(([key, value]) => {
                  // Format key for display
                  const displayKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/_/g, ' ')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                    <div key={key} style={styles.breakdownItem}>
                      <span style={styles.breakdownLabel}>
                        {displayKey}
                      </span>
                      <div style={styles.breakdownBar}>
                        <div 
                          style={{
                            ...styles.breakdownFill,
                            width: `${value * 100}%`
                          }}
                        />
                      </div>
                      <span style={styles.breakdownValue}>
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations (not shown for CBR risks) */}
          {risk.recommendations && risk.recommendations.length > 0 && risk.source !== 'cbr' && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <Shield size={16} />
                <span>{t('risk.card.mitigationRecommendations')}</span>
              </div>
              <ul style={styles.list}>
                {risk.recommendations.map((rec, idx) => (
                  <li key={idx} style={styles.listItem}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Early Warning Signals */}
          {risk.earlyWarningSignals && risk.earlyWarningSignals.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <AlertTriangle size={16} />
                <span>{t('risk.card.earlyWarningSignals')}</span>
              </div>
              <div style={styles.warningsList}>
                {risk.earlyWarningSignals.map((warning, idx) => (
                  <div key={idx} style={styles.warningItem}>
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

          {/* Actual Impact (if occurred) */}
          {risk.occurred && risk.actualImpact && (
            <div style={styles.section}>
              <div style={{
                ...styles.sectionTitle,
                color: '#EF4444'
              }}>
                <AlertTriangle size={16} />
                <span>{t('risk.card.riskOccurred')}</span>
              </div>
              <div style={styles.actualImpactBox}>
                <div style={styles.actualImpactItem}>
                  <span style={styles.actualLabel}>{t('risk.card.scheduleDelay')}</span>
                  <span style={styles.actualValue}>{t('risk.card.days', { count: risk.actualImpact.scheduleDelayDays })}</span>
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
                  <div style={styles.actualDescription}>
                    {risk.actualImpact.description}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

const styles = {
  riskCard: {
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderLeft: '4px solid',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap'
  },
  riskTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0
  },
  riskTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    wordBreak: 'break-word'
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  sourceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid currentColor'
  },
  severityBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s'
  },
  riskDescription: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
    margin: '0 0 16px 0'
  },
  expandedContent: {
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  listItem: {
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: '1.5'
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  chip: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#F3F4F6',
    border: '1px solid #E5E7EB'
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  caseItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '6px'
  },
  caseInfo: {
    flex: 1,
    minWidth: 0
  },
  caseName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '2px'
  },
  caseDescription: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '1.4'
  },
  caseSimilarity: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '100px'
  },
  similarityBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  similarityFill: {
    height: '100%',
    backgroundColor: '#10B981',
    transition: 'width 0.3s ease'
  },
  similarityText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#10B981',
    minWidth: '40px',
    textAlign: 'right'
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px'
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '6px'
  },
  breakdownLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    minWidth: '80px'
  },
  breakdownBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: '#10B981',
    transition: 'width 0.3s ease'
  },
  breakdownValue: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#10B981',
    minWidth: '40px',
    textAlign: 'right'
  },
  impactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
  },
  impactCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '6px'
  },
  impactIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    flexShrink: 0
  },
  impactContent: {
    flex: 1
  },
  impactLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  impactValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px'
  },
  impactDesc: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '1.4'
  },
  warningsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  warningItem: {
    padding: '10px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: '6px'
  },
  warningSignal: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#92400E',
    marginBottom: '6px'
  },
  warningDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#78350F'
  },
  warningLabel: {
    fontWeight: '600'
  },
  warningValue: {
    fontWeight: '400'
  },
  warningSeparator: {
    color: '#D97706'
  },
  actualImpactBox: {
    padding: '12px',
    backgroundColor: '#FEE2E2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  actualImpactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actualLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#991B1B'
  },
  actualValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#DC2626'
  },
  actualDescription: {
    fontSize: '12px',
    color: '#991B1B',
    lineHeight: '1.5',
    marginTop: '4px',
    paddingTop: '8px',
    borderTop: '1px solid #FECACA'
  }
};

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SeverityLevels } from '../../types/risk.types';

/**
 * CBR Learned Risks Component
 * Displays risks detected by Case-Based Reasoning with probability and similar cases
 */
export default function CbrLearnedRisks({ risks = [], loading = false }) {
  const { t } = useTranslation();
  const [expandedRisk, setExpandedRisk] = useState(null);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p>{t('risk.cbr.learning')}</p>
        </div>
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <BookOpen size={32} style={{ color: '#10B981', marginBottom: '8px' }} />
          <p style={styles.emptyTitle}>{t('risk.cbr.noLearnedRisks')}</p>
          <p style={styles.emptySubtitle}>
            {t('risk.cbr.noLearnedRisksDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <BookOpen size={20} style={{ color: '#10B981' }} />
          <span>{t('risk.cbr.title')}</span>
        </div>
        <span style={styles.badge}>{t('risk.cbr.identified', { count: risks.length })}</span>
      </div>

      {/* Description */}
      <p style={styles.description}>
        {t('risk.cbr.description')}
      </p>

      {/* Risks List */}
      <div style={styles.risksList}>
        {risks.map((risk) => {
          const severity = SeverityLevels[risk.severity];
          const isExpanded = expandedRisk === risk.id;

          return (
            <div
              key={risk.id}
              style={{
                ...styles.riskCard,
                borderLeftColor: severity.color
              }}
            >
              {/* Risk Header */}
              <div style={styles.riskHeader}>
                <div
                  style={{
                    ...styles.severityDot,
                    background: severity.color
                  }}
                />

                <div style={styles.riskInfo}>
                  <div style={styles.riskTitle}>{risk.title}</div>
                  <div style={styles.riskType}>{risk.type.replace(/_/g, ' ')}</div>
                </div>

                <div style={styles.riskMetrics}>
                  <div
                    style={{
                      ...styles.badge,
                      background: severity.color,
                      color: 'white'
                    }}
                  >
                    {severity.label}
                  </div>
                </div>

                <button
                  style={styles.expandButton}
                  onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                >
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={styles.riskDetails}>
                  {/* Description */}
                  <div style={styles.detailSection}>
                    <div style={styles.detailLabel}>{t('risk.cbr.description')}</div>
                    <div style={styles.detailValue}>{risk.description}</div>
                  </div>

                  {/* Based On Cases */}
                  {risk.basedOnCases && risk.basedOnCases.length > 0 && (
                    <div style={styles.detailSection}>
                      <div style={styles.detailLabel}>
                        {t('risk.cbr.basedOn', { count: risk.basedOnCases.length })}
                      </div>
                      <div style={styles.casesList}>
                        {risk.basedOnCases.map((caseItem, idx) => (
                          <div key={idx} style={styles.caseItem}>
                            <div style={styles.caseName}>{caseItem.projectName}</div>
                            <div style={styles.caseSimilarityContainer}>
                              <div style={styles.caseSimilarityBar}>
                                <div
                                  style={{
                                    width: `${caseItem.similarity * 100}%`,
                                    height: '100%',
                                    background: '#10B981',
                                    borderRadius: '2px'
                                  }}
                                />
                              </div>
                              <span style={styles.caseSimilarity}>
                                {(caseItem.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Similarity Breakdown */}
                  {risk.similarityBreakdown && (
                    <div style={styles.detailSection}>
                      <div style={styles.detailLabel}>{t('risk.cbr.similarityBreakdown')}</div>
                      <div style={styles.breakdownGrid}>
                        {Object.entries(risk.similarityBreakdown).map(([key, value]) => (
                          <div key={key} style={styles.breakdownItem}>
                            <div style={styles.breakdownLabel}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div style={styles.breakdownValue}>
                              {(value * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {risk.recommendations && risk.recommendations.length > 0 && (
                    <div style={styles.detailSection}>
                      <div style={styles.detailLabel}>{t('risk.cbr.recommendations')}</div>
                      <ul style={styles.recommendationsList}>
                        {risk.recommendations.map((rec, idx) => (
                          <li key={idx} style={styles.recommendationItem}>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Badge */}
                  <div style={styles.detailSection}>
                    <div style={styles.learningBadge}>
                      <span style={styles.learningIcon}>📚</span>
                      <span>
                        {t('risk.cbr.learningBadge')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          💼 <strong>{t('risk.cbr.tip')}:</strong> {t('risk.cbr.tipText')}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    padding: '24px'
  },
  loadingState: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  spinner: {
    display: 'inline-block',
    width: '32px',
    height: '32px',
    border: '3px solid #E5E7EB',
    borderTop: '3px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6B7280'
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
    margin: '8px 0 4px 0'
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#111'
  },
  badge: {
    background: '#F3F4F6',
    color: '#6B7280',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  description: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  riskCard: {
    border: '1px solid #E5E7EB',
    borderLeft: '4px solid',
    borderRadius: '8px',
    padding: '16px',
    background: '#F9FAFB',
    transition: 'all 0.2s ease'
  },
  riskHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  severityDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0
  },
  riskInfo: {
    flex: 1
  },
  riskTitle: {
    fontWeight: '600',
    color: '#111',
    fontSize: '14px'
  },
  riskType: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '2px'
  },
  riskMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  probability: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#10B981',
    minWidth: '45px',
    textAlign: 'right'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center'
  },
  riskDetails: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailSection: {
    fontSize: '12px'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#111',
    marginBottom: '6px'
  },
  detailValue: {
    color: '#6B7280',
    lineHeight: '1.5'
  },
  probabilityBar: {
    height: '6px',
    background: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px'
  },
  probabilityBarFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  probabilityText: {
    fontSize: '12px',
    color: '#6B7280'
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
    padding: '8px',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '4px'
  },
  caseName: {
    flex: 1,
    fontSize: '12px',
    color: '#111',
    fontWeight: '500'
  },
  caseSimilarityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '80px'
  },
  caseSimilarityBar: {
    flex: 1,
    height: '4px',
    background: '#E5E7EB',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  caseSimilarity: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#10B981',
    minWidth: '35px',
    textAlign: 'right'
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 8px',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '4px'
  },
  breakdownLabel: {
    fontSize: '11px',
    color: '#6B7280'
  },
  breakdownValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#10B981'
  },
  recommendationsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#6B7280'
  },
  recommendationItem: {
    marginBottom: '4px',
    fontSize: '12px'
  },
  learningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#F0FDF4',
    border: '1px solid #DCFCE7',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#10B981'
  },
  learningIcon: {
    fontSize: '14px'
  },
  footer: {
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
  },
  footerText: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0,
    lineHeight: '1.5'
  }
};

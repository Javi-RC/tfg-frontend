import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SeverityLevels } from '../../types/risk.types';

/**
 * DT Indicators Component
 * Displays expert rules detected risks (early warnings without learned cases)
 */
export default function DTIndicators({ risks = [], loading = false }) {
  const { t } = useTranslation();
  const [expandedRisk, setExpandedRisk] = useState(null);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p>{t('risk.dt.analyzing')}</p>
        </div>
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <AlertTriangle size={32} style={{ color: '#10B981', marginBottom: '8px' }} />
          <p style={styles.emptyTitle}>{t('risk.dt.noWarnings')}</p>
          <p style={styles.emptySubtitle}>
            {t('risk.dt.noWarningsDescription')}
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
          <AlertTriangle size={20} style={{ color: '#667EEA' }} />
          <span>{t('risk.dt.title')}</span>
        </div>
        <span style={styles.badge}>{t('risk.dt.detected', { count: risks.length })}</span>
      </div>

      {/* Description */}
      <p style={styles.description}>
        {t('risk.dt.description')}
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
                  <div style={styles.confidence}>
                    {(risk.confidence * 100).toFixed(0)}%
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
                    <div style={styles.detailLabel}>{t('risk.dt.description')}</div>
                    <div style={styles.detailValue}>{risk.description}</div>
                  </div>

                  {/* Confidence Explanation */}
                  <div style={styles.detailSection}>
                    <div style={styles.detailLabel}>{t('risk.dt.confidence')}</div>
                    <div style={styles.confidenceBar}>
                      <div
                        style={{
                          ...styles.confidenceBarFill,
                          width: `${risk.confidence * 100}%`,
                          background: severity.color
                        }}
                      />
                    </div>
                    <div style={styles.confidenceText}>
                      {t('risk.dt.confidenceText', { percent: (risk.confidence * 100).toFixed(0) })}
                    </div>
                  </div>

                  {/* Indicators/Patterns */}
                  {risk.indicators && risk.indicators.length > 0 && (
                    <div style={styles.detailSection}>
                      <div style={styles.detailLabel}>{t('risk.dt.detectedPatterns')}</div>
                      <div style={styles.indicatorsList}>
                        {risk.indicators.map((indicator, idx) => (
                          <div key={idx} style={styles.indicatorItem}>
                            <span style={styles.indicatorDot}>•</span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={styles.detailSection}>
                    <div style={styles.statusBadge}>
                      <span style={styles.statusIcon}>ℹ️</span>
                      <span>
                        {t('risk.dt.statusBadge')}
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
          💡 <strong>{t('risk.dt.tip')}:</strong> {t('risk.dt.tipText')}
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
    borderTop: '3px solid #667EEA',
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
  confidence: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#667EEA',
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
  confidenceBar: {
    height: '6px',
    background: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px'
  },
  confidenceBarFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  confidenceText: {
    fontSize: '12px',
    color: '#6B7280'
  },
  indicatorsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  indicatorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    background: '#F3F4F6',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#6B7280'
  },
  indicatorDot: {
    color: '#667EEA',
    fontWeight: 'bold'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#F0F4FF',
    border: '1px solid #DDD6FE',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#667EEA'
  },
  statusIcon: {
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

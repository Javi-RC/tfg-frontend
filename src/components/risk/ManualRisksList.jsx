import React, { useState } from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import LoadingState from '../common/LoadingState';

const getSeverityColor = (severity) => {
  const colors = {
    critical: { bg: '#FEE2E2', text: '#991B1B' },
    high: { bg: '#FEF3C7', text: '#92400E' },
    medium: { bg: '#FEF08A', text: '#713F12' },
    low: { bg: '#DBEAFE', text: '#1E3A8A' },
  };
  return colors[severity] || { bg: '#F3F4F6', text: '#374151' };
};

const getStatusColor = (status) => {
  const colors = {
    predicted: '#3B82F6', // Blue - risk is predicted and being monitored
    occurred: '#EF4444', // Red - risk occurred (retrospective only)
    not_occurred: '#10B981', // Green - risk did not occur (retrospective only)
    closed: '#6B7280', // Gray - project closed
  };
  return colors[status] || '#6B7280';
};

/**
 * ManualRisksList Component
 * Display manual risks for a project with edit/delete actions
 */
export default function ManualRisksList({
  risks,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onRefresh,
  canManage = false,
}) {
  const { t, i18n } = useTranslation();
  const [expandedRiskId, setExpandedRiskId] = useState(null);
  const [deletingRiskId, setDeletingRiskId] = useState(null);

  const translateSeverity = (severity, severityLabel) => {
    if (severityLabel) return severityLabel;
    if (!severity) return t('common.notAvailable');
    const severityKey = severity.toLowerCase();
    return t(`risk.severity.${severityKey}`, { defaultValue: severity });
  };

  const translateStatus = (status, statusLabel) => {
    if (statusLabel) return statusLabel;
    if (!status) return t('common.notAvailable');
    const statusMap = {
      predicted: 'completionPage.risks.predicted',
      occurred: 'completionPage.risks.occurred',
      not_occurred: 'completionPage.risks.didNotOccur',
      active: 'completionPage.risks.predicted',
      closed: 'common.closed',
    };
    const translationKey = statusMap[status] || status;
    return t(translationKey, { defaultValue: status });
  };

  const translateRiskType = (type, typeLabel) => {
    if (typeLabel) return typeLabel;
    if (!type) return t('risk.manual.unknownRisk');

    const rawType = String(type).trim();
    const normalizedSnake = rawType.includes('_')
      ? rawType.toLowerCase()
      : rawType
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .replace(/[\s-]+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '')
          .toLowerCase();

    const camelCaseType = normalizedSnake.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const translationKey = `projects.risks.types.${camelCaseType}`;
    const translated = t(translationKey, { defaultValue: null });

    if (translated && translated !== translationKey) {
      return translated;
    }

    return rawType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const translateCategory = (category, categoryLabel) => {
    if (categoryLabel) return categoryLabel;
    if (!category) return t('common.notAvailable');
    const categoryKey = category.toLowerCase();

    // Try translating from teamAnalysis.cbr (where categories are defined)
    const translationKey = `teamAnalysis.cbr.${categoryKey}`;
    const translated = t(translationKey, { defaultValue: null });

    if (translated && translated !== translationKey) {
      return translated;
    }

    // Fallback: capitalize first letter
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleDeleteConfirm = async (riskId) => {
    if (deletingRiskId === riskId) {
      await onDelete(riskId);
      setDeletingRiskId(null);
    } else {
      setDeletingRiskId(riskId);
    }
  };

  if (loading) {
    return <LoadingState message={t('risk.manual.loading')} />;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertTriangle size={20} color="#EF4444" />
        <div style={styles.errorMessage}>{error}</div>
        {onRefresh && (
          <button type="button" onClick={onRefresh} style={styles.retryButton}>
            {t('risk.manual.tryAgain')}
          </button>
        )}
      </div>
    );
  }

  if (!risks || risks.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>⚠️</div>
        <h3 style={styles.emptyTitle}>{t('risk.manual.noRisks')}</h3>
        <p style={styles.emptyDescription}>{t('risk.manual.noRisksDescription')}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{t('risk.manual.title', { count: risks.length })}</h3>
        <p style={styles.subtitle}>{t('risk.manual.subtitle')}</p>
      </div>

      <div style={styles.list}>
        {risks.map((risk) => (
          <div key={risk._id} style={styles.riskCard}>
            <div
              style={{
                ...styles.riskHeader,
                cursor: 'pointer',
                backgroundColor: expandedRiskId === risk._id ? '#F9FAFB' : 'transparent',
              }}
              role="button"
              tabIndex={0}
              onClick={() => setExpandedRiskId(expandedRiskId === risk._id ? null : risk._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedRiskId(expandedRiskId === risk._id ? null : risk._id);
                }
              }}
            >
              <div style={styles.riskTitleSection}>
                <div
                  style={{
                    ...styles.severityDot,
                    backgroundColor: getSeverityColor(risk.severity).bg,
                    borderLeft: `4px solid ${getSeverityColor(risk.severity).text}`,
                  }}
                />
                <div style={styles.riskInfo}>
                  <h4 style={styles.riskTitle}>{risk.title}</h4>
                  <div style={styles.riskMeta}>
                    <Badge
                      style={{
                        backgroundColor: getSeverityColor(risk.severity).bg,
                        color: getSeverityColor(risk.severity).text,
                      }}
                    >
                      {translateSeverity(risk.severity, risk.severityLabel)}
                    </Badge>
                    {risk.type && (
                      <Badge
                        style={{
                          backgroundColor: 'var(--color-bg-subtle)',
                          color: 'var(--color-text-strong)',
                        }}
                      >
                        {translateRiskType(risk.type, risk.typeLabel)}
                      </Badge>
                    )}
                    <Badge
                      style={{
                        backgroundColor: '#F0F9FF',
                        color: getStatusColor(risk.status),
                      }}
                    >
                      {translateStatus(risk.status, risk.statusLabel)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div style={styles.riskActions}>
                {canManage && risk.source === 'manual' && (
                  <>
                    <button type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(risk);
                      }}
                      style={styles.actionButton}
                      title={t('risk.manual.editRisk')}
                    >
                      <Edit size={16} />
                    </button>
                    <button type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConfirm(risk._id);
                      }}
                      style={{
                        ...styles.actionButton,
                        color: deletingRiskId === risk._id ? '#DC2626' : '#6B7280',
                      }}
                      title={
                        deletingRiskId === risk._id
                          ? t('risk.manual.confirmDelete')
                          : t('risk.manual.deleteRisk')
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedRiskId === risk._id && (
              <div style={styles.riskDetails}>
                {risk.description && (
                  <div style={styles.detailSection}>
                    <h5 style={styles.detailLabel}>{t('risk.manual.description')}</h5>
                    <p style={styles.detailText}>{risk.description}</p>
                  </div>
                )}

                <div style={styles.detailRow}>
                  <div style={styles.detailColumn}>
                    <h5 style={styles.detailLabel}>{t('risk.manual.category')}</h5>
                    <p style={styles.detailText}>
                      {translateCategory(risk.category, risk.categoryLabel)}
                    </p>
                  </div>
                </div>

                {risk.rootCause && (
                  <div style={styles.detailSection}>
                    <h5 style={styles.detailLabel}>{t('risk.manual.rootCause')}</h5>
                    <p style={styles.detailText}>{risk.rootCause}</p>
                  </div>
                )}

                {risk.indicators && risk.indicators.length > 0 && (
                  <div style={styles.detailSection}>
                    <h5 style={styles.detailLabel}>{t('risk.manual.indicators')}</h5>
                    <ul style={styles.list}>
                      {risk.indicators.map((indicator) => (
                        <li key={indicator} style={styles.listItem}>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {risk.recommendations && risk.recommendations.length > 0 && (
                  <div style={styles.detailSection}>
                    <h5 style={styles.detailLabel}>{t('risk.manual.recommendations')}</h5>
                    <ul style={styles.list}>
                      {risk.recommendations.map((rec) => (
                        <li key={rec} style={styles.listItem}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {risk.createdAt && (
                  <div style={styles.detailFooter}>
                    <small style={styles.detailFooterText}>
                      {t('risk.manual.addedOn', {
                        date: new Date(risk.createdAt).toLocaleDateString(i18n.language),
                      })}
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  riskCard: {
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  riskHeader: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'background-color 0.2s',
  },
  riskTitleSection: {
    display: 'flex',
    gap: '12px',
    flex: 1,
    minWidth: 0,
  },
  severityDot: {
    width: '4px',
    minWidth: '4px',
    height: 'auto',
    borderRadius: '2px',
    marginTop: '2px',
  },
  riskInfo: {
    flex: 1,
    minWidth: 0,
  },
  riskTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    margin: '0 0 6px 0',
    wordBreak: 'break-word',
  },
  riskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  riskType: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  riskActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  riskDetails: {
    padding: '16px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailText: {
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    margin: 0,
    lineHeight: '1.5',
  },
  listItem: {
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    marginLeft: '20px',
    lineHeight: '1.5',
  },
  detailFooter: {
    paddingTop: '8px',
    borderTop: '1px solid var(--color-border)',
  },
  detailFooterText: {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
  },
  errorContainer: {
    padding: '16px',
    backgroundColor: 'var(--color-danger-bg)',
    border: '1px solid var(--color-danger-bg)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  errorMessage: {
    flex: 1,
    color: 'var(--color-danger-strong)',
    fontSize: '14px',
  },
  retryButton: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-danger-bg)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-danger)',
    whiteSpace: 'nowrap',
  },
  emptyContainer: {
    padding: '32px 16px',
    textAlign: 'center',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
    margin: '0 0 6px 0',
  },
  emptyDescription: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};

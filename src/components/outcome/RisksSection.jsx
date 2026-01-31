import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RiskEvaluationModal from './RiskEvaluationModal';

/**
 * RisksSection Component
 * Retrospective evaluation for predicted + manual risks.
 * Matches the UX: list of risks + per-risk evaluation modal (occurred yes/no).
 */
export default function RisksSection({ formData, setFormData, predictedRisks = [], manualRisks = [] }) {
  const { t } = useTranslation();
  const [selectedRiskMeta, setSelectedRiskMeta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRiskTypeLabel = useCallback((type) => {
    const labels = {
      communication_issues: t('outcome.risks.types.communicationIssues'),
      communication_breakdown: t('outcome.risks.types.communicationBreakdown'),
      skill_gap: t('outcome.risks.types.skillGap'),
      team_overload: t('outcome.risks.types.teamOverload'),
      dependency_blockage: t('outcome.risks.types.dependencyBlockage'),
      scope_creep: t('outcome.risks.types.scopeCreep'),
      process_mismatch: t('outcome.risks.types.processMismatch'),
      technical_infrastructure: t('outcome.risks.types.technicalInfrastructure'),
      quality_degradation: t('outcome.risks.types.qualityDegradation'),
      vendor_issue: t('outcome.risks.types.vendorIssue'),
      resource_unavailability: t('outcome.risks.types.resourceUnavailability'),
      other: t('outcome.risks.types.other')
    };
    return labels[type] || type;
  }, [t]);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#EAB308',
      low: '#10B981'
    };
    return colors[severity] || '#6B7280';
  };

  const actualizedById = useMemo(() => {
    const map = new Map();
    for (const r of formData.actualizedRisks || []) {
      if (r?.riskId !== undefined && r?.riskId !== null) {
        map.set(String(r.riskId), r);
      }
    }
    return map;
  }, [formData.actualizedRisks]);

  const predictedItems = useMemo(() => {
    return (predictedRisks || []).map((risk, index) => {
      const riskId = String(risk?._id ?? risk?.id ?? (risk?.type ? `${risk.type}-${index}` : index));
      const severity = risk?.severity || 'medium';
      const source = risk?.source || 'system';
      const sourceLabel = source === 'CBR' ? t('outcome.risks.sourceCBR') : source === 'DT' ? t('outcome.risks.sourceDT') : t('outcome.risks.sourceSystem');
      return {
        riskId,
        kind: 'predicted',
        title: risk?.title || getRiskTypeLabel(risk?.type),
        description: risk?.description,
        type: risk?.type || 'other',
        severity,
        rootCause: risk?.rootCause,
        recommendations: risk?.recommendations,
        indicators: risk?.indicators,
        source,
        sourceLabel
      };
    });
  }, [predictedRisks, t, getRiskTypeLabel]);

  const manualItems = useMemo(() => {
    return (manualRisks || []).map((risk, index) => {
      const riskId = String(risk?._id ?? risk?.id ?? `manual-${index}`);
      const severity = risk?.severity || 'medium';
      return {
        riskId,
        kind: 'manual',
        title: risk?.title || getRiskTypeLabel(risk?.type),
        description: risk?.description,
        type: risk?.type || 'other',
        severity,
        source: 'manual',
        sourceLabel: t('outcome.risks.sourceManual'),
        rootCause: risk?.rootCause,
        recommendations: risk?.recommendations,
        indicators: risk?.indicators
      };
    });
  }, [manualRisks, t, getRiskTypeLabel]);

  const allItems = useMemo(() => [...predictedItems, ...manualItems], [predictedItems, manualItems]);

  const progress = useMemo(() => {
    const total = allItems.length;
    const evaluated = allItems.filter((item) => {
      const v = actualizedById.get(item.riskId);
      return v?.occurred === true || v?.occurred === false;
    }).length;
    return {
      total,
      evaluated,
      percent: total > 0 ? Math.round((evaluated / total) * 100) : 0
    };
  }, [allItems, actualizedById]);

  const upsertActualizedRisk = (riskMeta, patch) => {
    setFormData((prev) => {
      const list = prev.actualizedRisks || [];
      const riskId = String(riskMeta.riskId);
      const idx = list.findIndex((r) => String(r.riskId) === riskId);

      const base = idx >= 0 ? list[idx] : {
        riskId,
        type: riskMeta.type,
        severity: riskMeta.severity,
        source: riskMeta.kind === 'manual' ? 'manual' : (riskMeta.source || 'predicted')
      };

      const merged = { ...base, ...patch };

      // If user explicitly marks as avoided, drop any occurred-only details to keep payloads clean.
      if (merged.occurred === false) {
        delete merged.title;
        delete merged.description;
        delete merged.rootCause;
        delete merged.recommendations;
        delete merged.indicators;
      }
      // Remove undefined keys so we don't keep stale fields around
      for (const key of Object.keys(merged)) {
        if (merged[key] === undefined) delete merged[key];
      }

      const next = [...list];
      if (idx >= 0) next[idx] = merged;
      else next.push(merged);

      return { ...prev, actualizedRisks: next };
    });
  };

  const openEvaluation = (riskMeta) => {
    setSelectedRiskMeta(riskMeta);
    setIsModalOpen(true);
  };

  const closeEvaluation = () => {
    setIsModalOpen(false);
    setSelectedRiskMeta(null);
  };

  const renderRiskRow = (riskMeta) => {
    const evaluation = actualizedById.get(riskMeta.riskId);
    const occurred = evaluation?.occurred;

    const status = occurred === true ? 'occurred' : occurred === false ? 'avoided' : 'pending';
    const statusIcon =
      status === 'occurred' ? (
        <CheckCircle size={18} color="#10B981" />
      ) : status === 'avoided' ? (
        <XCircle size={18} color="#EF4444" />
      ) : (
        <AlertTriangle size={18} color="#F59E0B" />
      );

    const summary =
      status === 'occurred'
        ? t('outcome.risks.occurred')
        : status === 'avoided'
          ? t('outcome.risks.didNotOccur')
          : t('outcome.risks.notEvaluatedYet');

    return (
      <div key={riskMeta.riskId} style={styles.riskCard}>
        <div style={styles.riskHeader}>
          <div style={styles.riskHeaderLeft}>
            {statusIcon}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={styles.riskTitle}>{riskMeta.title}</div>
              <div style={styles.riskMetaLine}>
                <span
                  style={{
                    ...styles.severityBadge,
                    background: getSeverityColor(riskMeta.severity)
                  }}
                >
                  {t(`risk.severity.${riskMeta.severity || 'medium'}`).toUpperCase()}
                </span>
                <span style={styles.metaSeparator}>|</span>
                <span style={styles.riskType}>{getRiskTypeLabel(riskMeta.type)}</span>
                <span style={styles.metaSeparator}>|</span>
                <span style={styles.sourceText}>{riskMeta.sourceLabel}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openEvaluation(riskMeta)}
            style={styles.evaluateButton}
          >
            {status === 'pending' ? t('outcome.risks.evaluateRisk') : t('outcome.risks.viewEdit')}
          </button>
        </div>

        <div style={styles.riskSummary}>{summary}</div>
      </div>
    );
  };

  return (
    <div style={styles.section}>
      <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={22} />
        {t('outcome.risks.title')}
      </h3>

      <div style={styles.progressRow}>
        <div style={styles.progressText}>
          {t('outcome.risks.progress', { evaluated: progress.evaluated, total: progress.total, percent: progress.percent })}
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress.percent}%` }} />
        </div>
      </div>

      <div style={styles.subsection}>
        <h4 style={styles.subsectionTitle}>{t('outcome.risks.predictedRisks', { count: predictedItems.length })}</h4>
        <div style={styles.risksList}>{predictedItems.map(renderRiskRow)}</div>
      </div>

      <div style={styles.subsection}>
        <h4 style={styles.subsectionTitle}>{t('outcome.risks.manualRisks', { count: manualItems.length })}</h4>
        <div style={styles.risksList}>{manualItems.map(renderRiskRow)}</div>
      </div>

      <RiskEvaluationModal
        isOpen={isModalOpen}
        onClose={closeEvaluation}
        riskMeta={selectedRiskMeta}
        value={selectedRiskMeta ? actualizedById.get(selectedRiskMeta.riskId) : undefined}
        onSave={async (patch) => {
          if (!selectedRiskMeta) return;
          upsertActualizedRisk(selectedRiskMeta, patch);
        }}
      />
    </div>
  );
}
 
const styles = {
  section: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '28px',
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#111827'
  },
  progressRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px'
  },
  progressText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#374151'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    borderRadius: '999px',
    background: '#E5E7EB',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#3B82F6'
  },
  subsection: {
    marginTop: '24px'
  },
  subsectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '800',
    color: '#111827'
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  riskCard: {
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '16px',
    background: '#F9FAFB'
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },
  riskHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    flex: 1
  },
  riskTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#111827'
  },
  riskMetaLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  severityBadge: {
    padding: '3px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  metaSeparator: {
    color: '#9CA3AF'
  },
  riskType: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#374151'
  },
  sourceText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6B7280'
  },
  evaluateButton: {
    background: '#111827',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  riskSummary: {
    marginTop: '10px',
    fontSize: '13px',
    color: '#6B7280'
  }
};


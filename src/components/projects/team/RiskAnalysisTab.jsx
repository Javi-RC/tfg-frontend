import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import RiskErrorMessage from '../../risk/RiskErrorMessage';
import CompletenessIndicator from '../../risk/CompletenessIndicator';
import RiskAnalysisHeader from './RiskAnalysisHeader';
import RiskAnalysisContent from './RiskAnalysisContent';
import RiskAnalysisEmpty from './RiskAnalysisEmpty';
import { SEVERITY, OVERALL_RISK, normalizeSeverity, deriveOverallRisk } from '../../../utils/riskSeverity';
import { toCsv } from '../../../utils/csv';
import { downloadBlob, toSafeFilename } from '../../../utils/downloadFile';
import './RiskAnalysisTab.css';

/**
 * RiskAnalysisTab - Risk analysis and predictions interface
 *
 * Features:
 * - Overall risk assessment with accessibility
 * - Categorized risk display with filters
 * - Risk severity indicators
 * - Mitigation recommendations
 * - Data completeness tracking
 * - Export functionality
 * - Responsive design
 *
 * Severity normalization and the overall-risk thresholds live in
 * utils/riskSeverity so they can be asserted without rendering this component.
 */

/** Badge colour per headline level. Presentation only. */
const OVERALL_RISK_COLORS = Object.freeze({
  [OVERALL_RISK.CRITICAL]: '#dc3545',
  [OVERALL_RISK.HIGH]: '#fd7e14',
  [OVERALL_RISK.MEDIUM]: '#ffc107',
  [OVERALL_RISK.LOW]: '#28a745',
});

/** Byte order mark, so Excel opens the export as UTF-8 instead of mangling accents. */
const UTF8_BOM = '\uFEFF';

/** Fields exported to CSV, in column order. */
const CSV_COLUMNS = [
  { headerKey: 'projects.riskAnalysisTab.csvName', fallback: 'Name' },
  { headerKey: 'projects.riskAnalysisTab.csvSeverity', fallback: 'Severity' },
  { headerKey: 'projects.riskAnalysisTab.csvType', fallback: 'Type' },
  { headerKey: 'projects.riskAnalysisTab.csvDescription', fallback: 'Description' },
  { headerKey: 'projects.riskAnalysisTab.impact', fallback: 'Impact' },
  { headerKey: 'projects.riskAnalysisTab.csvMitigation', fallback: 'Mitigation' },
];

export default function RiskAnalysisTab({
  project,
  riskAnalysis,
  riskLoading,
  teamCount,
  onRetryAnalysis,
  onEditProject,
}) {
  const { t, i18n } = useTranslation();
  const previousLanguage = useRef(i18n.language);

  // Reload risks when language changes
  useEffect(() => {
    const currentLanguage = i18n.language;
    if (
      previousLanguage.current &&
      previousLanguage.current !== currentLanguage &&
      riskAnalysis?.risks?.length > 0
    ) {
      onRetryAnalysis();
    }
    previousLanguage.current = currentLanguage;
  }, [i18n.language, onRetryAnalysis, riskAnalysis?.risks?.length]);

  // View mode toggle: 'list' or 'flow'
  const [viewMode, setViewMode] = useState('list');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Calculate risk summary - Always call hooks, even if we return early later
  const risks = useMemo(() => {
    const rawRisks = riskAnalysis?.risks || [];

    return rawRisks.map((risk) => ({
      ...risk,
      severity: normalizeSeverity(risk.severity),
    }));
  }, [riskAnalysis]);

  // Get available risk types for filters
  const availableTypes = useMemo(() => {
    const types = new Set(risks.flatMap((r) => (r.type ? [r.type] : [])));
    return Array.from(types);
  }, [risks]);

  // Filter risks based on search and filters
  const filteredRisks = useMemo(() => {
    const severitySet = new Set(selectedSeverities);
    const typeSet = new Set(selectedTypes);
    return risks.filter((risk) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = (risk.name || '').toLowerCase().includes(searchLower);
        const descMatch = (risk.description || '').toLowerCase().includes(searchLower);
        const typeMatch = (risk.type || '').toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch && !typeMatch) return false;
      }

      // Severity filter
      if (severitySet.size > 0 && !severitySet.has(risk.severity)) {
        return false;
      }

      // Type filter
      if (typeSet.size > 0 && !typeSet.has(risk.type)) {
        return false;
      }

      return true;
    });
  }, [risks, searchTerm, selectedSeverities, selectedTypes]);

  // One pass over the risks instead of four independent filters per render.
  const bySeverity = useMemo(
    () => ({
      critical: risks.filter((r) => r.severity === SEVERITY.CRITICAL),
      high: risks.filter((r) => r.severity === SEVERITY.HIGH),
      medium: risks.filter((r) => r.severity === SEVERITY.MEDIUM),
      low: risks.filter((r) => r.severity === SEVERITY.LOW),
    }),
    [risks]
  );

  const overallRisk = useMemo(() => deriveOverallRisk(risks), [risks]);

  const exportFilename = useCallback(
    (extension) =>
      `${toSafeFilename(
        'risk-analysis',
        project.projectName || 'project',
        new Date().toISOString().split('T')[0]
      )}.${extension}`,
    [project.projectName]
  );

  const handleExport = useCallback(
    (format) => {
      if (format === 'csv') {
        const headers = CSV_COLUMNS.map((column) => t(column.headerKey, column.fallback));
        const rows = risks.map((risk) => [
          risk.name || risk.title || t('common.unnamed'),
          risk.severity || t('common.notAvailable'),
          risk.type || t('common.notAvailable'),
          risk.description || '',
          risk.impact || '',
          risk.mitigation || '',
        ]);

        // A BOM keeps Excel from mangling accented characters on open.
        const blob = new Blob([UTF8_BOM + toCsv(headers, rows)], {
          type: 'text/csv;charset=utf-8;',
        });
        downloadBlob(blob, exportFilename('csv'));
        return;
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(riskAnalysis, null, 2)], {
          type: 'application/json',
        });
        downloadBlob(blob, exportFilename('json'));
      }
    },
    [risks, riskAnalysis, exportFilename, t]
  );

  // Show loading state with accessibility
  if (riskLoading) {
    return (
      <div style={styles.loadingContainer} role="status" aria-live="polite">
        <div style={styles.spinner} aria-hidden="true"></div>
        <p style={styles.loadingText}>{t('projects.analyzingRisks')}</p>
        <span className="sr-only">{t('projects.riskAnalysisTab.loading.srPleaseWait')}</span>
      </div>
    );
  }

  // Show error state
  if (riskAnalysis?.error) {
    return (
      <RiskErrorMessage
        error={riskAnalysis.error}
        onRetry={onRetryAnalysis}
        onEditProject={onEditProject}
      />
    );
  }

  // Show no risks found (allow analysis even without team)
  if (!riskAnalysis || !riskAnalysis.risks || riskAnalysis.risks.length === 0) {
    return <RiskAnalysisEmpty />;
  }

  return (
    <div style={styles.container} className="risk-analysis-tab">
      {riskAnalysis.dataCompleteness !== undefined && (
        <CompletenessIndicator
          completeness={riskAnalysis.dataCompleteness}
          completedFields={riskAnalysis.completedFields}
          totalFields={riskAnalysis.totalFields}
          suggestions={riskAnalysis.suggestions || []}
          message={
            riskAnalysis.dataCompleteness < 30
              ? t('projects.riskAnalysisTab.completenessMessages.limited')
              : riskAnalysis.dataCompleteness < 60
                ? t('projects.riskAnalysisTab.completenessMessages.goodStart')
                : riskAnalysis.dataCompleteness < 90
                  ? t('projects.riskAnalysisTab.completenessMessages.great')
                  : t('projects.riskAnalysisTab.completenessMessages.excellent')
          }
        />
      )}

      <RiskAnalysisHeader
        overallRisk={overallRisk}
        overallColor={OVERALL_RISK_COLORS[overallRisk]}
        criticalRisks={bySeverity.critical}
        highRisks={bySeverity.high}
        mediumRisks={bySeverity.medium}
        lowRisks={bySeverity.low}
        teamCount={teamCount}
        risksLength={risks.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleExport={handleExport}
      />

      <RiskAnalysisContent
        viewMode={viewMode}
        risks={risks}
        filteredRisks={filteredRisks}
        riskAnalysis={riskAnalysis}
        project={project}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSeverities={selectedSeverities}
        setSelectedSeverities={setSelectedSeverities}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        availableTypes={availableTypes}
      />
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
    borderTop: '4px solid var(--color-accent-gradient-start)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};

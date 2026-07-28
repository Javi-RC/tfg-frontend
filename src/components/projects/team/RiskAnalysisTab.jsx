import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import RiskErrorMessage from '../../risk/RiskErrorMessage';
import CompletenessIndicator from '../../risk/CompletenessIndicator';
import RiskAnalysisHeader from './RiskAnalysisHeader';
import RiskAnalysisContent from './RiskAnalysisContent';
import RiskAnalysisEmpty from './RiskAnalysisEmpty';

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
 */
const normalizeSeverity = (severity) => {
  const value = String(severity ?? '')
    .trim()
    .toLowerCase();
  if (!value) return 'medium';

  if (value === 'critical' || value === 'crit' || value === 'severe') return 'critical';
  if (value === 'high' || value === 'alto' || value === 'alta') return 'high';
  if (
    value === 'medium' ||
    value === 'med' ||
    value === 'moderate' ||
    value === 'medio' ||
    value === 'media'
  ) {
    return 'medium';
  }
  if (value === 'low' || value === 'bajo' || value === 'baja' || value === 'minor') return 'low';

  // Fail-safe: keep UI stable by treating unknown severities as medium.
  return 'medium';
};

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

    const processedRisks = rawRisks.map((risk) => ({
      ...risk,
      severity: normalizeSeverity(risk.severity),
    }));

    return processedRisks;
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

  const criticalRisks = risks.filter((r) => r.severity === 'critical');
  const highRisks = risks.filter((r) => r.severity === 'high');
  const mediumRisks = risks.filter((r) => r.severity === 'medium');
  const lowRisks = risks.filter((r) => r.severity === 'low');

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

  // Export functionality
  const handleExport = (format) => {
    if (format === 'csv') {
      exportToCSV(risks);
    } else if (format === 'json') {
      exportToJSON(riskAnalysis);
    }
  };

  const exportToCSV = (risks) => {
    const headers = [
      t('projects.riskAnalysisTab.csvName', 'Name'),
      t('projects.riskAnalysisTab.csvSeverity', 'Severity'),
      t('projects.riskAnalysisTab.csvType', 'Type'),
      t('projects.riskAnalysisTab.csvDescription', 'Description'),
      t('projects.riskAnalysisTab.impact'),
      t('projects.riskAnalysisTab.csvMitigation', 'Mitigation'),
    ];
    const rows = risks.map((risk) => [
      risk.name || risk.title || t('common.unnamed'),
      risk.severity || t('common.notAvailable'),
      risk.type || t('common.notAvailable'),
      (risk.description || '').replace(/,/g, ';'),
      (risk.impact || '').replace(/,/g, ';'),
      (risk.mitigation || '').replace(/,/g, ';'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `risk-analysis-${project.projectName || 'project'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `risk-analysis-${project.projectName || 'project'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

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
        overallColor={overallColor}
        criticalRisks={criticalRisks}
        highRisks={highRisks}
        mediumRisks={mediumRisks}
        lowRisks={lowRisks}
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

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .risk-analysis-tab .summaryHeader {
        flex-direction: column;
        gap: 16px;
      }

      .risk-analysis-tab .summaryRight {
        width: 100%;
        justify-content: space-between;
      }

      .risk-analysis-tab .riskCounts {
        justify-content: space-between;
      }

      .risk-analysis-tab .flowMapContainer {
        height: clamp(400px, 60vh, 600px) !important;
      }
    }

    @media (max-width: 480px) {
      .risk-analysis-tab .summaryRight {
        flex-wrap: wrap;
      }

      .risk-analysis-tab .riskHeader {
        flex-direction: column;
        align-items: flex-start;
      }

      .risk-analysis-tab .viewToggle {
        order: -1;
        width: 100%;
      }
    }

    /* Focus styles for accessibility */
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid #3B82F6;
      outline-offset: 2px;
    }

    /* Hover effects */
    button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }
  `;

  if (!document.head.querySelector('#risk-analysis-styles')) {
    styleSheet.id = 'risk-analysis-styles';
    document.head.appendChild(styleSheet);
  }
}

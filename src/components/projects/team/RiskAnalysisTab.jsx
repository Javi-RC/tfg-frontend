import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, AlertTriangle, Lightbulb, Shield, Circle, List, Network, Download } from 'lucide-react';
import RiskFlowMap from '../../outcome/RiskFlowMap';
import Tooltip from '../../common/Tooltip';
import RiskErrorMessage from '../../risk/RiskErrorMessage';
import CompletenessIndicator from '../../risk/CompletenessIndicator';
import RiskFilters from '../../risk/RiskFilters';

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
export default function RiskAnalysisTab({
  project,
  riskAnalysis,
  riskLoading,
  teamCount,
  onRetryAnalysis,
  onEditProject
}) {
  const { t } = useTranslation();
  
  // View mode toggle: 'list' or 'flow'
  const [viewMode, setViewMode] = useState('list');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const normalizeSeverity = (severity) => {
    const value = String(severity ?? '').trim().toLowerCase();
    if (!value) return 'medium';

    if (value === 'critical' || value === 'crit' || value === 'severe') return 'critical';
    if (value === 'high' || value === 'alto' || value === 'alta') return 'high';
    if (value === 'medium' || value === 'med' || value === 'moderate' || value === 'medio' || value === 'media') {
      return 'medium';
    }
    if (value === 'low' || value === 'bajo' || value === 'baja' || value === 'minor') return 'low';

    // Fail-safe: keep UI stable by treating unknown severities as medium.
    return 'medium';
  };

  // Calculate risk summary - Always call hooks, even if we return early later
  const risks = useMemo(() => {
    const rawRisks = riskAnalysis?.risks || [];
    return rawRisks.map(risk => ({
      ...risk,
      severity: normalizeSeverity(risk.severity),
    }));
  }, [riskAnalysis]);

  // Get available risk types for filters
  const availableTypes = useMemo(() => {
    const types = new Set(risks.map(r => r.type).filter(Boolean));
    return Array.from(types);
  }, [risks]);

  // Filter risks based on search and filters
  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = (risk.name || '').toLowerCase().includes(searchLower);
        const descMatch = (risk.description || '').toLowerCase().includes(searchLower);
        const typeMatch = (risk.type || '').toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch && !typeMatch) return false;
      }

      // Severity filter
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(risk.severity)) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(risk.type)) {
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

  // Show empty state if no team
  if (teamCount === 0) {
    return (
      <div style={styles.emptyState} role="status">
        <Users size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} aria-hidden="true" />
        <h3 style={styles.emptyTitle}>{t('projects.riskAnalysisTab.empty.noTeamTitle')}</h3>
        <p style={styles.emptyText}>
          {t('projects.assignTeamForRisk')}
        </p>
      </div>
    );
  }

  // Show no risks found
  if (!riskAnalysis || !riskAnalysis.risks || riskAnalysis.risks.length === 0) {
    return (
      <div style={styles.emptyState} role="status">
        <CheckCircle size={48} color="#28a745" style={{ opacity: 0.5, marginBottom: '16px' }} aria-hidden="true" />
        <h3 style={styles.emptyTitle}>{t('projects.riskAnalysisTab.empty.noRisksTitle')}</h3>
        <p style={styles.emptyText}>{t('projects.riskAnalysisTab.empty.noRisksText')}</p>
      </div>
    );
  }

  const criticalRisks = risks.filter(r => r.severity === 'critical');
  const highRisks = risks.filter(r => r.severity === 'high');
  const mediumRisks = risks.filter(r => r.severity === 'medium');
  const lowRisks = risks.filter(r => r.severity === 'low');

  // Categorize filtered risks
  const filteredCritical = filteredRisks.filter(r => r.severity === 'critical');
  const filteredHigh = filteredRisks.filter(r => r.severity === 'high');
  const filteredMedium = filteredRisks.filter(r => r.severity === 'medium');
  const filteredLow = filteredRisks.filter(r => r.severity === 'low');

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
    const headers = ['Name', 'Severity', 'Type', 'Description', 'Impact', 'Mitigation'];
    const rows = risks.map(risk => [
      risk.name || risk.title || 'Unnamed',
      risk.severity || 'N/A',
      risk.type || 'N/A',
      (risk.description || '').replace(/,/g, ';'),
      (risk.impact || '').replace(/,/g, ';'),
      (risk.mitigation || '').replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
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
      {/* Data Completeness Indicator */}
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

      {/* Overall Risk Summary */}
      <div 
        style={{...styles.summaryCard, borderLeft: `4px solid ${overallColor}`}}
        role="region"
        aria-label={t('projects.riskAnalysisTab.summary.aria')}
        className="risk-analysis-tab"
      >
        <div style={styles.summaryHeader} className="summaryHeader">
          <div style={styles.summaryLeft}>
            <h3 style={styles.summaryTitle}>{t('projects.riskAnalysisTab.summary.title')}</h3>
            <p style={styles.summarySubtext}>
              {t('projects.riskAnalysisTab.summary.basedOn')}{' '}
              {t('projects.riskAnalysisTab.summary.teamMembers', { count: teamCount })}{' '}
              • {t('projects.riskAnalysisTab.summary.risksIdentified', { count: risks.length })}
            </p>
          </div>
          <div style={styles.summaryRight} className="summaryRight">
            {/* Export Button */}
            <Tooltip content={t('projects.riskAnalysisTab.export.tooltip')}>
              <button
                onClick={() => handleExport('csv')}
                style={styles.exportButton}
                aria-label={t('projects.riskAnalysisTab.export.ariaCsv')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download size={18} />
              </button>
            </Tooltip>

            {/* View Toggle */}
            <div style={styles.viewToggle} role="group" aria-label={t('projects.riskAnalysisTab.viewToggle.aria')} className="viewToggle">
              <Tooltip content={t('projects.riskAnalysisTab.viewToggle.listTooltip')}>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'list' ? styles.viewButtonActive : {})
                  }}
                  aria-label={t('projects.riskAnalysisTab.viewToggle.switchToListAria')}
                  aria-pressed={viewMode === 'list'}
                  onMouseEnter={(e) => !e.currentTarget.getAttribute('aria-pressed') === 'true' && (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                  onMouseLeave={(e) => viewMode !== 'list' && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <List size={18} aria-hidden="true" />
                  <span className="sr-only">{t('projects.riskAnalysisTab.viewToggle.listLabel')}</span>
                </button>
              </Tooltip>
              <Tooltip content={t('projects.riskAnalysisTab.viewToggle.flowTooltip')}>
                <button
                  onClick={() => setViewMode('flow')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'flow' ? styles.viewButtonActive : {})
                  }}
                  aria-label={t('projects.riskAnalysisTab.viewToggle.switchToFlowAria')}
                  aria-pressed={viewMode === 'flow'}
                  onMouseEnter={(e) => viewMode !== 'flow' && (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                  onMouseLeave={(e) => viewMode !== 'flow' && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Network size={18} aria-hidden="true" />
                  <span className="sr-only">{t('projects.riskAnalysisTab.viewToggle.flowLabel')}</span>
                </button>
              </Tooltip>
            </div>
            
            <Tooltip content={t('projects.riskAnalysisTab.summary.overallRiskLevel', { level: overallRisk })}>
              <div 
                style={{...styles.riskBadge, backgroundColor: overallColor}}
                role="status"
                aria-label={t('projects.riskAnalysisTab.summary.overallRiskLevel', { level: overallRisk })}
              >
                {overallRisk}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Risk Counts */}
        <div style={styles.riskCounts} role="list" aria-label={t('projects.riskAnalysisTab.severityCounts.aria')} className="riskCounts">
          {criticalRisks.length > 0 && (
            <div style={styles.riskCount} role="listitem">
              <Tooltip content={t('projects.riskAnalysisTab.severityHelp.critical')}>
                <span style={{...styles.countBadge, backgroundColor: '#dc3545'}} aria-label={t('projects.riskAnalysisTab.severityCount.critical', { count: criticalRisks.length })}>
                  {criticalRisks.length}
                </span>
              </Tooltip>
              <span style={styles.countLabel}>{t('risk.severity.critical')}</span>
            </div>
          )}
          {highRisks.length > 0 && (
            <div style={styles.riskCount} role="listitem">
              <Tooltip content={t('projects.riskAnalysisTab.severityHelp.high')}>
                <span style={{...styles.countBadge, backgroundColor: '#fd7e14'}} aria-label={t('projects.riskAnalysisTab.severityCount.high', { count: highRisks.length })}>
                  {highRisks.length}
                </span>
              </Tooltip>
              <span style={styles.countLabel}>{t('risk.severity.high')}</span>
            </div>
          )}
          {mediumRisks.length > 0 && (
            <div style={styles.riskCount} role="listitem">
              <Tooltip content={t('projects.riskAnalysisTab.severityHelp.medium')}>
                <span style={{...styles.countBadge, backgroundColor: '#ffc107'}} aria-label={t('projects.riskAnalysisTab.severityCount.medium', { count: mediumRisks.length })}>
                  {mediumRisks.length}
                </span>
              </Tooltip>
              <span style={styles.countLabel}>{t('risk.severity.medium')}</span>
            </div>
          )}
          {lowRisks.length > 0 && (
            <div style={styles.riskCount} role="listitem">
              <Tooltip content={t('projects.riskAnalysisTab.severityHelp.low')}>
                <span style={{...styles.countBadge, backgroundColor: '#28a745'}} aria-label={t('projects.riskAnalysisTab.severityCount.low', { count: lowRisks.length })}>
                  {lowRisks.length}
                </span>
              </Tooltip>
              <span style={styles.countLabel}>{t('risk.severity.low')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering: Flow Map or List */}
      {viewMode === 'flow' ? (
        <div style={styles.flowMapSection}>
          <div style={styles.flowMapDescription} role="note">
            <AlertTriangle size={18} color="#F59E0B" aria-hidden="true" />
            <span>
              Interactive risk visualization - Explore relationships between risks and their severity. 
              {risks.length} risk{risks.length !== 1 ? 's' : ''} visualized. Use mouse wheel to zoom, click and drag to pan.
            </span>
          </div>
          <div style={styles.flowMapContainer} className="flowMapContainer">
            <RiskFlowMap
              predictedRisks={risks.map(risk => ({
                ...risk,
                id: risk.id || risk.type || `risk-${Math.random()}`,
                type: risk.type || risk.name || 'Unknown Risk',
              }))}
              actualizedRisks={[]}
              projectName={project.projectName || 'Project'}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <RiskFilters
            onSearchChange={setSearchTerm}
            onSeverityFilter={setSelectedSeverities}
            onTypeFilter={setSelectedTypes}
            searchValue={searchTerm}
            selectedSeverities={selectedSeverities}
            selectedTypes={selectedTypes}
            availableTypes={availableTypes}
          />

          {/* Results Count */}
          {(searchTerm || selectedSeverities.length > 0 || selectedTypes.length > 0) && (
            <div style={styles.resultsCount} role="status" aria-live="polite">
              Showing {filteredRisks.length} of {risks.length} risk{risks.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Risk Details */}
          {filteredRisks.length > 0 ? (
            <div style={styles.risksSection}>
              <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} aria-hidden="true" />
                Identified Risks
              </h3>

              <div style={styles.risksList} role="list">
                {/* Critical Risks First */}
                {filteredCritical.map((risk, idx) => (
                  <RiskCard key={`critical-${idx}`} risk={risk} />
                ))}
                
                {/* High Risks */}
                {filteredHigh.map((risk, idx) => (
                  <RiskCard key={`high-${idx}`} risk={risk} />
                ))}
                
                {/* Medium Risks */}
                {filteredMedium.map((risk, idx) => (
                  <RiskCard key={`medium-${idx}`} risk={risk} />
                ))}
                
                {/* Low Risks */}
                {filteredLow.map((risk, idx) => (
                  <RiskCard key={`low-${idx}`} risk={risk} />
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.noResults} role="status" className="riskHeader">
              <p>No risks match your current filters. Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Recommendations Section */}
          {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
            <div style={styles.recommendationsSection}>
              <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={20} aria-hidden="true" />
                Recommendations
              </h3>
              <div style={styles.recommendationsList} role="list">
                {riskAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} style={styles.recommendationCard} role="listitem">
                    <CheckCircle size={16} color="#28a745" style={{ flexShrink: 0 }} aria-hidden="true" />
                    <p style={styles.recommendationText}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * RiskCard - Individual risk display component with improved accessibility
 */
function RiskCard({ risk }) {

  const severityConfig = {
    critical: { 
      color: '#dc3545', 
      icon: <Circle size={12} fill="#dc3545" color="#dc3545" aria-hidden="true" />, 
      label: 'Critical',
      description: 'Critical severity - Requires immediate attention'
    },
    high: { 
      color: '#fd7e14', 
      icon: <Circle size={12} fill="#fd7e14" color="#fd7e14" aria-hidden="true" />, 
      label: 'High',
      description: 'High severity - Needs urgent attention'
    },
    medium: { 
      color: '#ffc107', 
      icon: <Circle size={12} fill="#ffc107" color="#ffc107" aria-hidden="true" />, 
      label: 'Medium',
      description: 'Medium severity - Should be monitored'
    },
    low: { 
      color: '#28a745', 
      icon: <Circle size={12} fill="#28a745" color="#28a745" aria-hidden="true" />, 
      label: 'Low',
      description: 'Low severity - Informational'
    },
  };

  const config = severityConfig[risk.severity] || severityConfig.medium;

  return (
    <article 
      style={{
        ...styles.riskCard, 
        borderLeftColor: config.color
      }}
      role="listitem"
      aria-label={`${config.label} severity risk: ${risk.name || risk.title || 'Unnamed Risk'}`}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={styles.riskHeader}>
        <div style={styles.riskTitle}>
          <span style={styles.riskIcon}>{config.icon}</span>
          {risk.name || risk.title || 'Unnamed Risk'}
        </div>
        <Tooltip content={config.description}>
          <span 
            style={{...styles.severityBadge, backgroundColor: config.color}}
            role="status"
          >
            {config.label}
          </span>
        </Tooltip>
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
              <Shield size={16} aria-hidden="true" />
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
          <div style={styles.factorsList} role="list">
            {risk.factors.map((factor, idx) => (
              <span key={idx} style={styles.factorChip} role="listitem">
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
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
  summaryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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

  // View Toggle
  viewToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    padding: '4px',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#586069',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
  },
  viewButtonActive: {
    backgroundColor: '#fff',
    color: '#0366d6',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  // Flow Map Section
  flowMapSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  flowMapDescription: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#FFF8E6',
    border: '1px solid #FFE8A3',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#856404',
  },
  flowMapContainer: {
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderRadius: '12px',
    overflow: 'hidden',
    height: 'clamp(500px, 70vh, 850px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },

  // Export Button
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s ease',
    outline: 'none'
  },

  // Results Count
  resultsCount: {
    padding: '12px 16px',
    backgroundColor: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#075985',
    fontWeight: '500'
  },

  // No Results
  noResults: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  }
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

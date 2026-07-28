import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import RiskFlowMap from '../../outcome/RiskFlowMap';
import RiskPredictionMetadata from '../../risk/RiskPredictionMetadata';
import RiskFilters from '../../risk/RiskFilters';
import SeparatedRisksView from '../../risk/SeparatedRisksView';

export default function RiskAnalysisContent({
  viewMode,
  risks,
  filteredRisks,
  riskAnalysis,
  project,
  searchTerm,
  setSearchTerm,
  selectedSeverities,
  setSelectedSeverities,
  selectedTypes,
  setSelectedTypes,
  availableTypes,
}) {
  const { t } = useTranslation();

  if (viewMode === 'flow') {
    return (
      <div style={styles.flowMapSection}>
        <div style={styles.flowMapDescription} role="note">
          <AlertTriangle size={18} color="#F59E0B" aria-hidden="true" />
          <span>
            {t('projects.riskAnalysisTab.interactiveVisualization')}{' '}
            {t('projects.riskAnalysisTab.risksVisualized', { count: risks.length })}
          </span>
        </div>
        <div style={styles.flowMapContainer} className="flowMapContainer">
          <RiskFlowMap
            predictedRisks={risks.map((risk) => ({
              ...risk,
              id: risk.id || risk.type || `risk-${Math.random()}`,
              type: risk.type || risk.name || t('common.unknownRisk'),
            }))}
            actualizedRisks={[]}
            projectName={project.projectName || t('common.project')}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {riskAnalysis.metadata && <RiskPredictionMetadata metadata={riskAnalysis.metadata} />}

      <RiskFilters
        onSearchChange={setSearchTerm}
        onSeverityFilter={setSelectedSeverities}
        onTypeFilter={setSelectedTypes}
        searchValue={searchTerm}
        selectedSeverities={selectedSeverities}
        selectedTypes={selectedTypes}
        availableTypes={availableTypes}
      />

      {(searchTerm || selectedSeverities.length > 0 || selectedTypes.length > 0) && (
        <div style={styles.resultsCount} role="status" aria-live="polite">
          {t('projects.riskAnalysisTab.showingRisks', {
            n: filteredRisks.length,
            m: risks.length,
          })}
        </div>
      )}

      {filteredRisks.length > 0 ? (
        <SeparatedRisksView
          cbrRisks={
            riskAnalysis.cbrRisks
              ? filteredRisks.filter((r) => {
                  const isCbr = riskAnalysis.cbrRisks.some(
                    (cbr) =>
                      (cbr.id && r.id && cbr.id === r.id) ||
                      (cbr.type === r.type && cbr.title === r.title)
                  );
                  return isCbr;
                })
              : []
          }
          dtRisks={
            riskAnalysis.dtRisks
              ? filteredRisks.filter((r) => {
                  const isDt = riskAnalysis.dtRisks.some(
                    (dt) =>
                      (dt.id && r.id && dt.id === r.id) ||
                      (dt.type === r.type && dt.title === r.title)
                  );
                  const isCbr =
                    riskAnalysis.cbrRisks &&
                    riskAnalysis.cbrRisks.some(
                      (cbr) =>
                        (cbr.id && r.id && cbr.id === r.id) ||
                        (cbr.type === r.type && cbr.title === r.title)
                    );
                  return isDt && !isCbr;
                })
              : []
          }
          allRisks={filteredRisks}
          metadata={riskAnalysis.metadata}
        />
      ) : (
        <div style={styles.noResults} role="status" className="riskHeader">
          <p>{t('projects.riskAnalysisTab.noRisksMatch')}</p>
        </div>
      )}

      {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
        <div style={styles.recommendationsSection}>
          <h3
            style={{
              ...styles.sectionTitle,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Lightbulb size={20} aria-hidden="true" />
            {t('projects.riskAnalysisTab.recommendations')}
          </h3>
          <ul style={{ ...styles.recommendationsList, listStyle: 'none', padding: 0, margin: 0 }}>
            {riskAnalysis.recommendations.map((rec) => (
              <li key={rec} style={styles.recommendationCard}>
                <CheckCircle
                  size={16}
                  color="#28a745"
                  style={{ flexShrink: 0 }}
                  aria-hidden="true"
                />
                <p style={styles.recommendationText}>{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

const styles = {
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
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    height: 'clamp(500px, 70vh, 850px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  resultsCount: {
    padding: '12px 16px',
    backgroundColor: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#075985',
    fontWeight: '500',
  },
  noResults: {
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '2px solid var(--color-border)',
  },
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
  recommendationText: {
    margin: 0,
    fontSize: '14px',
    color: '#0366d6',
    lineHeight: '1.6',
    flex: 1,
  },
};

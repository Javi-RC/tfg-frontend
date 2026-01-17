import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network, AlertTriangle, Activity } from 'lucide-react';
import RiskFlowMap from '../outcome/RiskFlowMap';
import ViewToggle from '../common/ViewToggle';
import RiskStatsSection from '../risk/RiskStatsSection';

/**
 * RiskAnalysisView Component
 * Standalone view for analyzing project risks
 * Can be used in project detail pages or dashboards
 */
export default function RiskAnalysisView({ 
  predictedRisks = [], 
  actualizedRisks = [],
  projectName = 'Project',
  showViewToggle = true 
}) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('flow'); // 'flow' or 'stats'

  return (
    <div style={styles.container}>
      {/* Header with toggle */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <AlertTriangle size={24} color="#F59E0B" />
          <div>
            <h2 style={styles.title}>{t('riskAnalysisView.title')}</h2>
            <p style={styles.subtitle}>{t('riskAnalysisView.subtitle')}</p>
          </div>
        </div>
        
        {showViewToggle && (
          <ViewToggle
            options={[
              { value: 'flow', icon: Network, label: t('riskAnalysisView.visualMap') },
              { value: 'stats', icon: Activity, label: t('riskAnalysisView.statistics') }
            ]}
            activeView={viewMode}
            onChange={setViewMode}
            ariaLabel={t('riskAnalysisView.viewToggleLabel')}
          />
        )}
      </div>

      {/* Content */}
      {viewMode === 'flow' ? (
        <div style={styles.flowSection}>
          <RiskFlowMap
            predictedRisks={predictedRisks}
            actualizedRisks={actualizedRisks}
            projectName={projectName}
          />
        </div>
      ) : (
        <RiskStatsSection predictedRisks={predictedRisks} actualizedRisks={actualizedRisks} />
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  flowSection: {
    minHeight: '600px'
  },
  // Note: Stats section extracted to RiskStatsSection
};

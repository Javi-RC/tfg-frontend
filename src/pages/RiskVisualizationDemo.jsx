import React from 'react';
import { useTranslation } from 'react-i18next';
import RiskAnalysisView from '../components/projects/RiskAnalysisView';

/**
 * Risk Visualization Demo Page
 * Standalone page to test and showcase the Risk Flow visualization
 * Useful for development and TFG demonstration
 */
export default function RiskVisualizationDemo() {
  const { t } = useTranslation();
  // Sample data matching your project structure
  const samplePredictedRisks = [
    {
      id: 'risk-1',
      type: 'communication_breakdown',
      severity: 'critical',
      probability: 0.75,
      description: 'Team distributed across multiple time zones without proper communication protocols'
    },
    {
      id: 'risk-2',
      type: 'skill_gap',
      severity: 'high',
      probability: 0.60,
      description: 'React and Node.js expertise missing in current team composition'
    },
    {
      id: 'risk-3',
      type: 'team_overload',
      severity: 'medium',
      probability: 0.45,
      description: 'Insufficient team size for scope and timeline'
    },
    {
      id: 'risk-4',
      type: 'dependency_blockage',
      severity: 'high',
      probability: 0.55,
      description: 'Third-party API dependencies with known reliability issues'
    },
    {
      id: 'risk-5',
      type: 'technical_infrastructure',
      severity: 'critical',
      probability: 0.80,
      description: 'Legacy infrastructure not compatible with modern tech stack'
    },
    {
      id: 'risk-6',
      type: 'quality_degradation',
      severity: 'medium',
      probability: 0.40,
      description: 'Insufficient automated testing coverage'
    },
    {
      id: 'risk-7',
      type: 'scope_creep',
      severity: 'high',
      probability: 0.70,
      description: 'Unclear requirements and frequent change requests from stakeholders'
    },
    {
      id: 'risk-8',
      type: 'process_mismatch',
      severity: 'low',
      probability: 0.30,
      description: 'Team unfamiliar with Agile/Scrum methodology'
    },
    {
      id: 'risk-9',
      type: 'communication_breakdown',
      severity: 'medium',
      probability: 0.50,
      description: 'Insufficient documentation standards'
    },
    {
      id: 'risk-10',
      type: 'technical_infrastructure',
      severity: 'low',
      probability: 0.25,
      description: 'CI/CD pipeline not yet established'
    }
  ];

  const sampleActualizedRisks = [
    {
      riskId: 'risk-1',
      type: 'communication_breakdown',
      occurred: true,
      severity: 'critical'
    },
    {
      riskId: 'risk-2',
      type: 'skill_gap',
      occurred: true,
      severity: 'high'
    },
    {
      riskId: 'risk-3',
      type: 'team_overload',
      occurred: false,
      severity: 'medium'
    },
    {
      riskId: 'risk-4',
      type: 'dependency_blockage',
      occurred: true,
      severity: 'high'
    },
    {
      riskId: 'risk-5',
      type: 'technical_infrastructure',
      occurred: false,
      severity: 'critical'
    },
    {
      riskId: 'risk-7',
      type: 'scope_creep',
      occurred: true,
      severity: 'high'
    }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{t('riskVisualizationDemo.title')}</h1>
          <p style={styles.subtitle}>
            {t('riskVisualizationDemo.subtitle')}
          </p>
        </div>

        {/* Info Banner */}
        <div style={styles.infoBanner}>
          <div style={styles.infoIcon}>ℹ️</div>
          <div>
            <div style={styles.infoTitle}>{t('riskVisualizationDemo.about.title')}</div>
            <ul style={styles.infoList}>
              <li>{t('riskVisualizationDemo.about.item1')}</li>
              <li>
                {t('riskVisualizationDemo.about.item2Prefix')}{' '}
                <strong>{t('riskVisualizationDemo.about.visualMap')}</strong>{' '}
                {t('riskVisualizationDemo.about.item2Between')}{' '}
                <strong>{t('riskVisualizationDemo.about.statistics')}</strong>{' '}
                {t('riskVisualizationDemo.about.item2Suffix')}
              </li>
              <li>{t('riskVisualizationDemo.about.item3')}</li>
              <li>{t('riskVisualizationDemo.about.item4')}</li>
              <li>{t('riskVisualizationDemo.about.item5')}</li>
              <li>{t('riskVisualizationDemo.about.item6')}</li>
            </ul>
          </div>
        </div>

        {/* Statistics Summary */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t('riskVisualizationDemo.stats.totalRisks')}</span>
            <span style={styles.statValue}>{samplePredictedRisks.length}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t('riskVisualizationDemo.stats.occurred')}</span>
            <span style={{ ...styles.statValue, color: '#10B981' }}>
              {sampleActualizedRisks.filter(r => r.occurred).length}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t('riskVisualizationDemo.stats.notOccurred')}</span>
            <span style={{ ...styles.statValue, color: '#6B7280' }}>
              {sampleActualizedRisks.filter(r => r.occurred === false).length}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t('riskVisualizationDemo.stats.unknown')}</span>
            <span style={{ ...styles.statValue, color: '#9CA3AF' }}>
              {samplePredictedRisks.length - sampleActualizedRisks.length}
            </span>
          </div>
        </div>

        {/* Risk Visualization Component */}
        <RiskAnalysisView
          predictedRisks={samplePredictedRisks}
          actualizedRisks={sampleActualizedRisks}
          projectName="E-Commerce Platform Migration"
          showViewToggle={true}
        />

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>{t('riskVisualizationDemo.features.title')}</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎯</div>
              <h3 style={styles.featureTitle}>{t('riskVisualizationDemo.features.visualHierarchy.title')}</h3>
              <p style={styles.featureDesc}>
                {t('riskVisualizationDemo.features.visualHierarchy.desc')}
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎨</div>
              <h3 style={styles.featureTitle}>{t('riskVisualizationDemo.features.colorCoded.title')}</h3>
              <p style={styles.featureDesc}>
                {t('riskVisualizationDemo.features.colorCoded.desc')}
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>{t('riskVisualizationDemo.features.realTime.title')}</h3>
              <p style={styles.featureDesc}>
                {t('riskVisualizationDemo.features.realTime.desc')}
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>{t('riskVisualizationDemo.features.controls.title')}</h3>
              <p style={styles.featureDesc}>
                {t('riskVisualizationDemo.features.controls.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div style={styles.techSection}>
          <h2 style={styles.techTitle}>{t('riskVisualizationDemo.technical.title')}</h2>
          <div style={styles.techContent}>
            <div style={styles.techItem}>
              <strong>{t('riskVisualizationDemo.technical.libraryLabel')}</strong> @xyflow/react (React Flow v12)
            </div>
            <div style={styles.techItem}>
              <strong>{t('riskVisualizationDemo.technical.componentsLabel')}</strong> RiskNode, RiskFlowMap, RiskAnalysisView
            </div>
            <div style={styles.techItem}>
              <strong>{t('riskVisualizationDemo.technical.dataFlowLabel')}</strong> API → Transform → Nodes/Edges → React Flow
            </div>
            <div style={styles.techItem}>
              <strong>{t('riskVisualizationDemo.technical.featuresLabel')}</strong> Custom nodes, animated edges, MiniMap, Controls, Background
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    color: 'white'
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '18px',
    margin: 0,
    opacity: 0.9
  },
  infoBanner: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    background: 'white',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  infoIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  infoList: {
    margin: '8px 0 0 0',
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#4B5563',
    lineHeight: '1.8'
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827'
  },
  featuresSection: {
    marginTop: '32px',
    padding: '32px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  featuresTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px',
    textAlign: 'center'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    padding: '24px',
    background: '#F9FAFB',
    borderRadius: '8px',
    textAlign: 'center'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  featureDesc: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6'
  },
  techSection: {
    marginTop: '24px',
    padding: '24px',
    background: '#1F2937',
    borderRadius: '12px',
    color: 'white'
  },
  techTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  techContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontFamily: 'monospace',
    fontSize: '14px'
  },
  techItem: {
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '6px'
  }
};

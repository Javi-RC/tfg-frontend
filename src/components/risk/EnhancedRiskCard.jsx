import React from 'react';
import { useTranslation } from 'react-i18next';
import RiskCardHeader from './RiskCardHeader';
import RiskCardDetails from './RiskCardDetails';
import RiskCardActions from './RiskCardActions';

const severityConfig = {
  critical: {
    color: 'var(--color-danger)',
    labelKey: 'risk.severity.critical',
    bgColor: 'var(--color-danger-bg)',
  },
  high: {
    color: '#fd7e14',
    labelKey: 'risk.severity.high',
    bgColor: 'var(--color-warning-bg)',
  },
  'medium-high': {
    color: 'var(--color-warning)',
    labelKey: 'risk.severity.mediumHigh',
    bgColor: 'var(--color-warning-bg)',
  },
  medium: {
    color: 'var(--color-warning)',
    labelKey: 'risk.severity.medium',
    bgColor: 'var(--color-warning-bg)',
  },
  low: {
    color: 'var(--color-success)',
    labelKey: 'risk.severity.low',
    bgColor: 'var(--color-success-bg)',
  },
  emerging: {
    color: 'var(--color-accent-gradient-start)',
    labelKey: 'risk.severity.emerging',
    bgColor: 'var(--color-primary-light)',
  },
};

/**
 * Enhanced Risk Card Component
 * Displays comprehensive risk information including:
 * - Source differentiation (CBR vs Expert Rules)
 * - Probability and confidence metrics
 * - Based on cases (for CBR risks)
 * - Similarity breakdown
 * - Predicted impact (schedule, budget, quality, team morale)
 * - Recommendations and early warning signals
 * - Reasoning and indicators
 */
export default function EnhancedRiskCard({ risk, isExpanded, onToggle, metadata }) {
  const { t } = useTranslation();

  const config = severityConfig[risk.severity] || severityConfig.medium;
  const severityLabel = t(config.labelKey);

  return (
    <article
      style={{
        ...styles.riskCard,
        borderLeftColor: config.color,
      }}
    >
      <div style={styles.riskHeaderRow}>
        <RiskCardHeader risk={risk} config={config} severityLabel={severityLabel} metadata={metadata} />
        <RiskCardActions isExpanded={isExpanded} onToggle={onToggle} />
      </div>

      <p style={styles.riskDescription}>{risk.description || t('risk.card.noDescription')}</p>

      {isExpanded && <RiskCardDetails risk={risk} />}
    </article>
  );
}

const styles = {
  riskCard: {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderLeft: '4px solid',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  riskHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  riskDescription: {
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
};

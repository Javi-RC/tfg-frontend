import React from 'react';
import { useTranslation } from 'react-i18next';
import { Circle } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import RiskSourceBadge from './RiskSourceBadge';

export default function RiskCardHeader({ risk, config, severityLabel, metadata }) {
  const { t } = useTranslation();

  return (
    <div style={styles.riskHeader}>
      <div style={styles.riskTitleRow}>
        <Circle size={12} fill={config.color} color={config.color} aria-hidden="true" />
        <h4 style={styles.riskTitle}>
          {risk.title ||
            risk.name ||
            t('risk.card.unnamedRisk', { defaultValue: 'Unnamed risk' })}
        </h4>
      </div>

      <div style={styles.badges}>
        <RiskSourceBadge risk={risk} strategy={metadata?.strategy} size="md" />

        <Tooltip content={`${severityLabel} ${t('risk.severity.label', 'severity risk')}`}>
          <span
            style={{
              ...styles.severityBadge,
              backgroundColor: config.color,
            }}
          >
            {severityLabel}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

const styles = {
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  riskTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  riskTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    wordBreak: 'break-word',
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  severityBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
  },
};

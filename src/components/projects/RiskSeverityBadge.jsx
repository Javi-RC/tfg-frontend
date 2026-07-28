import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Risk Severity Badge Component
 * Displays severity level with appropriate styling
 */
export default function RiskSeverityBadge({ severity }) {
  const { t } = useTranslation();

  const getBadgeStyle = () => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };

    switch (severity) {
      case 'high':
        return {
          ...baseStyle,
          background: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
        };
      case 'medium-high':
        return {
          ...baseStyle,
          background: '#FED7AA',
          color: '#EA580C',
        };
      case 'medium':
        return {
          ...baseStyle,
          background: 'var(--color-warning-bg)',
          color: '#D97706',
        };
      case 'low':
        return {
          ...baseStyle,
          background: 'var(--color-success-bg)',
          color: '#059669',
        };
      default:
        return {
          ...baseStyle,
          background: 'var(--color-bg-subtle)',
          color: 'var(--color-text-muted)',
        };
    }
  };

  return <span style={getBadgeStyle()}>{t(`riskSeverity.${severity}`) || severity}</span>;
}

import React from 'react';

/**
 * Risk Severity Badge Component
 * Displays severity level with appropriate styling
 */
export default function RiskSeverityBadge({ severity }) {
  const getBadgeStyle = () => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    switch (severity) {
      case 'high':
        return {
          ...baseStyle,
          background: '#FEE2E2',
          color: '#DC2626'
        };
      case 'medium-high':
        return {
          ...baseStyle,
          background: '#FED7AA',
          color: '#EA580C'
        };
      case 'medium':
        return {
          ...baseStyle,
          background: '#FEF3C7',
          color: '#D97706'
        };
      case 'low':
        return {
          ...baseStyle,
          background: '#D1FAE5',
          color: '#059669'
        };
      default:
        return {
          ...baseStyle,
          background: '#F3F4F6',
          color: '#6B7280'
        };
    }
  };

  return (
    <span style={getBadgeStyle()}>
      {severity}
    </span>
  );
}

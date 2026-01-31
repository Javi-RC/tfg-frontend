import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import RiskSourceBadge from './RiskSourceBadge';

/**
 * RiskItem Component
 * Display individual risk with status and probability
 * Enhanced with hover effects and accessibility
 */
export default function RiskItem({ risk, actualized, onClick, metadata }) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#EAB308',
      low: '#10B981'
    };
    return colors[severity] || '#6B7280';
  };

  const formatRiskType = (type) => {
    if (!type) return t('risk.item.unknownRisk');
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleClick = () => {
    if (onClick) onClick(risk);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 4px 12px rgba(0, 0, 0, 0.12)' 
          : '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${formatRiskType(risk.type)} - ${risk.severity} severity risk`}
    >
      <div style={styles.left}>
        <div
          style={{
            ...styles.dot,
            background: getSeverityColor(risk.severity)
          }}
          aria-hidden="true"
        />
        <div>
          <div style={styles.title}>{formatRiskType(risk.type)}</div>
          <div style={styles.description}>{risk.description}</div>
        </div>
      </div>
      <div style={styles.right}>
        <RiskSourceBadge 
          risk={risk}
          strategy={metadata?.strategy}
          size="sm"
        />
        {actualized?.occurred === true && (
          <Badge color="#D1FAE5" textColor="#065F46">
            ✓ {t('risk.item.occurred')}
          </Badge>
        )}
        {actualized?.occurred === false && (
          <Badge variant="neutral">
            ✗ {t('risk.item.notOccurred')}
          </Badge>
        )}
        {risk.probability && (
          <Badge variant="info">
            {Math.round(risk.probability * 100)}%
          </Badge>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: '1px solid transparent'
  },
  left: {
    display: 'flex',
    alignItems: 'start',
    gap: '12px',
    flex: 1,
    minWidth: 0
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    wordBreak: 'break-word'
  },
  description: {
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  right: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  }
};

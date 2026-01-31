import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, BookOpen, Target, Star } from 'lucide-react';
import Tooltip from '../common/Tooltip';

/**
 * Phase Indicator Component
 * Displays the current system phase with appropriate icon and color
 * 
 * @param {Object} props
 * @param {number} props.phase - System phase (1-4)
 * @param {string} props.strategy - Current strategy (dt_only, dt_priority, cbr_priority, cbr_only)
 * @param {number} props.caseCount - Number of cases in the case base
 * @param {string} props.description - Phase description from backend
 */
export default function PhaseIndicator({ phase, caseCount, description }) {
  const { t } = useTranslation();
  
  const phaseConfig = {
    1: { 
      color: '#3B82F6', 
      bgColor: '#DBEAFE',
      icon: Sprout, 
      labelKey: 'risk.phases.initial'
    },
    2: { 
      color: '#06B6D4', 
      bgColor: '#CFFAFE',
      icon: BookOpen, 
      labelKey: 'risk.phases.learning'
    },
    3: { 
      color: '#10B981', 
      bgColor: '#D1FAE5',
      icon: Target, 
      labelKey: 'risk.phases.mature'
    },
    4: { 
      color: '#8B5CF6', 
      bgColor: '#EDE9FE',
      icon: Star, 
      labelKey: 'risk.phases.expert'
    }
  };

  const config = phaseConfig[phase] || phaseConfig[1];
  const Icon = config.icon;
  const label = t(config.labelKey);

  const tooltipContent = description || `${t('risk.phaseLabel')} ${phase}: ${label}`;

  return (
    <Tooltip content={tooltipContent}>
      <div style={{
        ...styles.badge,
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}40`
      }}>
        <Icon size={16} />
        <span style={styles.badgeText}>
          {t('risk.phaseLabel')} {phase}: {label}
        </span>
        {caseCount !== undefined && (
          <span style={styles.caseCount}>
            ({caseCount} {t('risk.cases', { count: caseCount })})
          </span>
        )}
      </div>
    </Tooltip>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    cursor: 'help'
  },
  badgeText: {
    whiteSpace: 'nowrap'
  },
  caseCount: {
    fontSize: '12px',
    fontWeight: '500',
    opacity: 0.8
  }
};

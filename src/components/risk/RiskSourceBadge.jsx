import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Database, Target } from 'lucide-react';
import Tooltip from '../common/Tooltip';

/**
 * Risk Source Badge Component
 * Displays the source of a risk based on the current system strategy
 *
 * @param {Object} props
 * @param {Object} props.risk - Risk object with source and similarity
 * @param {string} props.strategy - Current system strategy
 * @param {string} props.size - Badge size ('sm', 'md', 'lg')
 */
const sizeStyles = {
  sm: { fontSize: '11px', padding: '4px 8px', iconSize: 12 },
  md: { fontSize: '12px', padding: '6px 10px', iconSize: 14 },
  lg: { fontSize: '13px', padding: '8px 12px', iconSize: 16 },
};

export default function RiskSourceBadge({ risk, strategy, size = 'md' }) {
  const { t } = useTranslation();

  if (!risk || !strategy) {
    return null;
  }

  const currentSize = sizeStyles[size];

  // Strategy: dt_only - Only Expert Rules
  if (strategy === 'dt_only') {
    return (
      <Tooltip content={t('risk.source.expertRulesDesc')}>
        <div
          style={{
            ...styles.badge,
            ...currentSize,
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #93C5FD',
          }}
        >
          <AlertTriangle size={currentSize.iconSize} />
          <span>{t('risk.source.expertRules')}</span>
        </div>
      </Tooltip>
    );
  }

  // Strategy: cbr_only - Only CBR Experience
  if (strategy === 'cbr_only') {
    const similarity = risk.similarity ? (risk.similarity * 100).toFixed(0) : t('common.notAvailable');
    return (
      <Tooltip content={t('risk.source.cbrDesc', { similarity })}>
        <div
          style={{
            ...styles.badge,
            ...currentSize,
            backgroundColor: '#F3E8FF',
            color: '#6B21A8',
            border: '1px solid #D8B4FE',
          }}
        >
          <Database size={currentSize.iconSize} />
          <span>
            {t('risk.source.experience')} ({similarity}%)
          </span>
        </div>
      </Tooltip>
    );
  }

  // Mixed strategies: dt_priority or cbr_priority
  const isDTPriority = strategy === 'dt_priority';
  const isCBRPriority = strategy === 'cbr_priority';

  // Check risk source
  if (risk.source === 'expert_rules' || risk.source === 'decision_tree') {
    const priorityText = isDTPriority ? ` (${t('risk.source.priority')})` : '';
    return (
      <Tooltip
        content={t('risk.source.expertRulesIdentified', {
          priority: isDTPriority ? ` - ${t('risk.source.prioritizedPhase')}` : '',
        })}
      >
        <div
          style={{
            ...styles.badge,
            ...currentSize,
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            border: `2px solid ${isDTPriority ? '#3B82F6' : '#93C5FD'}`,
            fontWeight: isDTPriority ? '600' : '500',
          }}
        >
          <AlertTriangle size={currentSize.iconSize} />
          <span>{t('risk.source.expertRules')}{priorityText}</span>
        </div>
      </Tooltip>
    );
  }

  if (risk.source === 'cbr') {
    const similarity = risk.similarity ? (risk.similarity * 100).toFixed(0) : t('common.notAvailable');
    const priorityText = isCBRPriority ? ` (${t('risk.source.priority')})` : '';
    return (
      <Tooltip
        content={t('risk.source.cbrLearnedDesc', {
          similarity,
          priority: isCBRPriority ? ` - ${t('risk.source.prioritizedPhase')}` : '',
        })}
      >
        <div
          style={{
            ...styles.badge,
            ...currentSize,
            backgroundColor: '#F3E8FF',
            color: '#6B21A8',
            border: `2px solid ${isCBRPriority ? '#8B5CF6' : '#D8B4FE'}`,
            fontWeight: isCBRPriority ? '600' : '500',
          }}
        >
          <Database size={currentSize.iconSize} />
          <span>
            {t('risk.source.experience')} ({similarity}%){priorityText}
          </span>
        </div>
      </Tooltip>
    );
  }

  // Fallback for unknown source
  return (
    <div
      style={{
        ...styles.badge,
        ...currentSize,
        backgroundColor: 'var(--color-bg-subtle)',
        color: 'var(--color-text-muted)',
        border: '1px solid var(--color-border-strong)',
      }}
    >
      <Target size={currentSize.iconSize} />
      <span>{t('risk.source.hybrid')}</span>
    </div>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '6px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    cursor: 'help',
  },
};

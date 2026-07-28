import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

/**
 * Impact indicator for adding a specific candidate.
 * @param {Object} props
 * @param {import('../../types/personality.jsdoc').SynergyValidation} props.validation
 */
export default function SynergyImpactIndicator({ validation }) {
  const { t } = useTranslation();
  // If no validation object at all, show default message
  if (!validation) {
    return (
      <div style={styles.noData}>
        <Info size={14} />
        <span>{t('team.synergy.noPersonalityData')}</span>
      </div>
    );
  }

  const impact = validation.synergyImpact;

  // If synergyImpact is null/undefined, show no data message
  if (impact === null || impact === undefined) {
    return (
      <div style={styles.noData}>
        <Info size={14} />
        <span>{t('team.synergy.noPersonalityData')}</span>
      </div>
    );
  }

  const isPositive = impact > 0;
  const isNeutral = impact === 0;

  const containerStyle = isPositive
    ? styles.positive
    : isNeutral
      ? styles.neutral
      : styles.negative;

  // Always use frontend translations for consistent i18n
  const displayMessage = getImpactMessage(impact, t);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.pill, ...containerStyle }}>
        {isPositive ? (
          <ArrowUp size={14} />
        ) : isNeutral ? (
          <Info size={14} />
        ) : (
          <ArrowDown size={14} />
        )}
        <span style={styles.pillText}>
          {isPositive ? '+' : ''}
          {Number(impact).toFixed(1)} {t('team.synergy.synergy')}
        </span>
      </div>
      <span style={styles.message}>{displayMessage}</span>
    </div>
  );
}

/**
 * Returns the appropriate i18n impact message based on the synergy impact value.
 * @param {number} impact - Synergy impact value
 * @param {Function} t - i18n translation function
 * @returns {string} Translated impact message
 */
function getImpactMessage(impact, t) {
  if (impact >= 5) return t('team.synergy.excellentImpact');
  if (impact > 0) return t('team.synergy.positiveImpact');
  if (impact === 0) return t('team.synergy.neutralImpact');
  if (impact > -5) return t('team.synergy.slightNegativeImpact');
  return t('team.synergy.negativeImpact');
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid transparent',
  },
  pillText: {
    lineHeight: 1,
  },
  message: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  noData: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  positive: {
    backgroundColor: '#dafbe1',
    color: '#116329',
    borderColor: '#2da44e33',
  },
  neutral: {
    backgroundColor: 'var(--color-bg-muted)',
    color: 'var(--color-text-primary)',
    borderColor: '#d0d7de',
  },
  negative: {
    backgroundColor: '#fff8c5',
    color: '#7d4e00',
    borderColor: '#d4a72c33',
  },
};

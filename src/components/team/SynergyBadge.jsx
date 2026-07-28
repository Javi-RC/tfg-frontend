import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

/**
 * Small badge to show a synergy score.
 * @param {Object} props
 * @param {number|null|undefined} props.score
 * @param {boolean} [props.showLabel=true]
 */
export default function SynergyBadge({ score, showLabel = true }) {
  const { t } = useTranslation();

  if (score === null || score === undefined) {
    return (
      <span style={{ ...styles.badgeBase, ...styles.badgeNA }}>
        <Star size={12} />
        {showLabel ? t('team.synergy.badge.notAvailable') : ''}
      </span>
    );
  }

  return (
    <span style={{ ...styles.badgeBase, ...getVariant(score) }}>
      <Star size={12} />
      {showLabel ? t('team.synergy.badge.label', { score }) : score}
    </span>
  );
}

const getVariant = (score) => {
  if (score >= 80) return styles.badgeExcellent;
  if (score >= 60) return styles.badgeGood;
  if (score >= 40) return styles.badgeFair;
  return styles.badgePoor;
};

const styles = {
  badgeBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
  },
  badgeNA: {
    backgroundColor: 'var(--color-bg-muted)',
    color: 'var(--color-text-secondary)',
    borderColor: '#d0d7de',
  },
  badgeExcellent: {
    backgroundColor: '#dafbe1',
    color: '#116329',
    borderColor: '#2da44e33',
  },
  badgeGood: {
    backgroundColor: '#ddf4ff',
    color: '#0550ae',
    borderColor: '#0969da33',
  },
  badgeFair: {
    backgroundColor: '#fff8c5',
    color: '#7d4e00',
    borderColor: '#d4a72c33',
  },
  badgePoor: {
    backgroundColor: '#ffebe9',
    color: '#82071e',
    borderColor: '#cf222e33',
  },
};

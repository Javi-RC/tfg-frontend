import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

/**
 * Impact indicator for adding a specific candidate.
 * @param {Object} props
 * @param {import('../../types/personality.jsdoc').SynergyValidation} props.validation
 */
export default function SynergyImpactIndicator({ validation }) {
  // If no validation object at all, show default message
  if (!validation) {
    return (
      <div style={styles.noData}>
        <Info size={14} />
        <span>No personality data available</span>
      </div>
    );
  }

  const impact = validation.synergyImpact;

  // If synergyImpact is null/undefined, show no data message
  if (impact === null || impact === undefined) {
    return (
      <div style={styles.noData}>
        <Info size={14} />
        <span>No personality data</span>
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

  // Provide default message when backend doesn't send one
  const displayMessage = validation.message || 
    (isPositive ? 'Good addition - improves team synergy' :
     isNeutral ? 'Neutral addition - maintains current synergy level' :
     'May impact team synergy negatively');

  return (
    <div style={styles.container}>
      <div style={{ ...styles.pill, ...containerStyle }}>
        {isPositive ? <ArrowUp size={14} /> : isNeutral ? <Info size={14} /> : <ArrowDown size={14} />}
        <span style={styles.pillText}>
          {isPositive ? '+' : ''}{Number(impact).toFixed(1)} synergy
        </span>
      </div>
      <span style={styles.message}>{displayMessage}</span>
    </div>
  );
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
    color: '#57606a',
  },
  noData: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#57606a',
  },
  positive: {
    backgroundColor: '#dafbe1',
    color: '#116329',
    borderColor: '#2da44e33',
  },
  neutral: {
    backgroundColor: '#f6f8fa',
    color: '#24292f',
    borderColor: '#d0d7de',
  },
  negative: {
    backgroundColor: '#fff8c5',
    color: '#7d4e00',
    borderColor: '#d4a72c33',
  },
};

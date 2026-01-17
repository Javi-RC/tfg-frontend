import React from 'react';

/**
 * SeverityBar Component
 * Display severity distribution with a progress bar
 */
export default function SeverityBar({
  label,
  count,
  total,
  color,
  showPercentage = false
}) {
  const percentage = total > 0 ? (count / total * 100) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.label}>
        <span style={{ ...styles.dot, background: color }} />
        {label}
      </div>
      <div style={styles.barContainer}>
        <div
          style={{
            ...styles.bar,
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>
      <div style={styles.count}>
        {showPercentage ? `${percentage.toFixed(0)}%` : count}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#4B5563',
    minWidth: '100px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  barContainer: {
    flex: 1,
    height: '24px',
    background: '#F3F4F6',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  bar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  count: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    minWidth: '30px',
    textAlign: 'right'
  }
};

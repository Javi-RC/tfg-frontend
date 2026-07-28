import React from 'react';

/**
 * InfoGrid
 * Displays labeled values in a responsive grid.
 */
export default function InfoGrid({ items = [] }) {
  return (
    <div style={styles.infoGrid}>
      {items.map((item) => (
        <div key={item.key} style={styles.infoItem}>
          <span style={styles.infoLabel}>{item.label}</span>
          <span style={styles.infoValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  infoLabel: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '15px',
    color: 'var(--color-text-primary)',
    fontWeight: '600',
  },
};

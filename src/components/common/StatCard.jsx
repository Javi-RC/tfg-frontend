import React from 'react';

/**
 * StatCard Component
 * Reusable card for displaying statistics
 */
export default function StatCard({
  value,
  label,
  icon: Icon,
  borderColor,
  iconColor,
  backgroundColor = '#F9FAFB',
  valueColor = '#111827',
  labelColor = '#6B7280',
}) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${borderColor}` }}>
      <div style={{ ...styles.iconWrapper, background: backgroundColor }}>
        {Icon && <Icon size={24} color={iconColor} />}
      </div>
      <div>
        <div style={{ ...styles.value, color: valueColor }}>{value}</div>
        <div style={{ ...styles.label, color: labelColor }}>{label}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0,
  },
  value: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: 1,
  },
  label: {
    fontSize: '14px',
    marginTop: '4px',
  },
};

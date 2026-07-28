import React from 'react';

/**
 * Badge Component
 * Reusable badge for status indicators and labels
 */
const variantStyles = {
  success: { background: 'var(--color-success-bg)', color: 'var(--color-success-dark)' },
  error: { background: 'var(--color-danger-bg)', color: 'var(--color-danger-strong)' },
  warning: { background: 'var(--color-warning-bg)', color: 'var(--color-warning-dark)' },
  info: { background: '#DBEAFE', color: '#1E40AF' },
  neutral: { background: 'var(--color-bg-subtle)', color: 'var(--color-text-strong)' },
  primary: { background: '#EFF6FF', color: '#1E40AF' },
};

const sizeStyles = {
  small: { padding: '2px 8px', fontSize: '11px' },
  medium: { padding: '4px 12px', fontSize: '12px' },
  large: { padding: '6px 16px', fontSize: '14px' },
};

export default function Badge({ children, variant, color, textColor, size = 'medium' }) {
  const customStyles = color && textColor ? { background: color, color: textColor } : {};
  const finalVariantStyles = variant ? variantStyles[variant] : {};

  return (
    <span
      style={{
        ...styles.badge,
        ...sizeStyles[size],
        ...finalVariantStyles,
        ...customStyles,
      }}
    >
      {children}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    borderRadius: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};

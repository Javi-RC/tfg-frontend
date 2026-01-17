import React from 'react';

/**
 * Badge Component
 * Reusable badge for status indicators and labels
 */
export default function Badge({
  children,
  variant,
  color,
  textColor,
  size = 'medium'
}) {
  const variantStyles = {
    success: { background: '#D1FAE5', color: '#065F46' },
    error: { background: '#FEE2E2', color: '#991B1B' },
    warning: { background: '#FEF3C7', color: '#92400E' },
    info: { background: '#DBEAFE', color: '#1E40AF' },
    neutral: { background: '#F3F4F6', color: '#374151' },
    primary: { background: '#EFF6FF', color: '#1E40AF' }
  };

  const sizeStyles = {
    small: { padding: '2px 8px', fontSize: '11px' },
    medium: { padding: '4px 12px', fontSize: '12px' },
    large: { padding: '6px 16px', fontSize: '14px' }
  };

  const customStyles = color && textColor ? { background: color, color: textColor } : {};
  const finalVariantStyles = variant ? variantStyles[variant] : {};

  return (
    <span
      style={{
        ...styles.badge,
        ...sizeStyles[size],
        ...finalVariantStyles,
        ...customStyles
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
    whiteSpace: 'nowrap'
  }
};

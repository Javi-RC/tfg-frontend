import React from 'react';

export default function PrimaryButton({ children, onClick, disabled = false, style = {}, type = 'button', leftIcon = null, rightIcon = null }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: '#111',
        color: 'white',
        borderRadius: '32px',
        padding: '14px 40px',
        fontWeight: '600',
        fontSize: '15px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
      }}
    >
      {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}

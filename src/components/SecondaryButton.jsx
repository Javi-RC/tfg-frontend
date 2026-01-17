import React from 'react';

export default function SecondaryButton({ children, onClick, disabled = false, style = {}, type = 'button', leftIcon = null, rightIcon = null }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: '1px solid rgba(0,0,0,0.12)',
        color: '#111',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '15px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.background = 'rgba(0,0,0,0.04)';
      }}
      onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
    >
      {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}

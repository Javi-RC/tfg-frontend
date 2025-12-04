import React from 'react';

export default function PrimaryButton({ children, onClick, disabled = false, style = {}, type = 'button' }) {
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
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}

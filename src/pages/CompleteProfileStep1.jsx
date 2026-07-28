import React from 'react';
import saraIcon from '../assets/icon.png';

export default function CompleteProfileStep1() {
  return (
    <header className="header">
      <div className="brand">
        <img
          src={saraIcon}
          alt="Sara"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }}
        />
        <span
          className="brand-name"
          style={{
            fontSize: '28px',
            fontWeight: '400',
            color: 'var(--color-primary)',
            fontFamily: "'Pacifico', cursive",
          }}
        >
          Sara
        </span>
      </div>
    </header>
  );
}

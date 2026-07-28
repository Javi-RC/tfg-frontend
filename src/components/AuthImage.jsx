import React from 'react';
import Portada from '../assets/Portada.jpg';

export default function AuthImage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
      }}
    >
      <img
        src={Portada}
        alt=""
        role="presentation"
        style={{
          width: '100%',
          maxWidth: '550px',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '20px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      />
    </div>
  );
}

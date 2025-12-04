import React from 'react';
import AuthHeader from './AuthHeader';
import AuthImage from './AuthImage';

export default function AuthLayout({ children, onLoginClick, onSignupClick }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      color: '#222',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AuthHeader onLoginClick={onLoginClick} onSignupClick={onSignupClick} />

      <main role="main" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 72px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative dot pattern background */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
          zIndex: 0
        }} />

        {/* Decorative colored blocks - Left side */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '20%',
          left: '8%',
          width: '90px',
          height: '90px',
          background: '#dbeafe',
          borderRadius: '14px',
          transform: 'rotate(-12deg)',
          zIndex: 0
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '50%',
          left: '6%',
          width: '90px',
          height: '90px',
          background: '#fce7f3',
          borderRadius: '14px',
          transform: 'rotate(15deg)',
          zIndex: 0
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: '18%',
          left: '10%',
          width: '90px',
          height: '90px',
          background: '#fef3c7',
          borderRadius: '14px',
          transform: 'rotate(8deg)',
          zIndex: 0
        }} />

        <div style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '80px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Image section - Left */}
          <div style={{ flex: '0 0 auto', maxWidth: '500px' }}>
            <AuthImage />
          </div>

          {/* Form section - Center */}
          <div style={{
            flex: '0 1 520px',
            width: '100%',
            background: '#ffffff',
            padding: '48px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            {children}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1200px) {
          main > div {
            flex-direction: column !important;
            gap: 40px !important;
          }
          main > div > div:first-child {
            order: 1;
            max-width: 450px;
          }
          main > div > div:last-child {
            order: 2;
          }
        }
        @media (max-width: 640px) {
          main > div > div:last-child {
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

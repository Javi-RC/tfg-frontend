import React from 'react';
import AuthHeader from './AuthHeader';
import AuthImage from './AuthImage';
import './AuthLayout.css';

export default function AuthLayout({ children, onLoginClick, onSignupClick }) {
  return (
    <div className="auth-layout">
      <AuthHeader onLoginClick={onLoginClick} onSignupClick={onSignupClick} />

      <main className="auth-layout-main">
        {/* Decorative dot pattern background */}
        <div
          aria-hidden="true"
          className="auth-layout-dot-pattern"
        />

        <div className="auth-layout-content">
          {/* Image section - Left */}
          <div className="auth-layout-image-section">
            <AuthImage />
          </div>

          {/* Form section - Center */}
          <div className="auth-layout-form-section">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

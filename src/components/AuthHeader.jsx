import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function AuthHeader({ onLoginClick, onSignupClick, disableLogin = false, disableSignup = false }) {
  const { t } = useTranslation();
  return (
    <header role="banner" style={{
      position: 'sticky',
      top: 0,
      zIndex: 5,
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'white',
      borderBottom: '1px solid rgba(102,102,102,0.12)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} role="img" aria-label={t('auth.header.aria.logo')}>
        <div aria-hidden="true" style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%'
        }} />
        <span style={{ fontSize: '18px', color: '#000', fontWeight: '600' }}>{t('auth.header.home')}</span>
      </div>

      <nav aria-label={t('auth.header.aria.nav')} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <LanguageSwitcher />
        <button
          onClick={onLoginClick}
          disabled={disableLogin}
          aria-label={t('auth.header.aria.navigateToLogin')}
          style={{
            height: '40px',
            padding: '0 20px',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: disableLogin ? 'not-allowed' : 'pointer',
            background: 'white',
            border: '1px solid #111',
            color: '#111',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {t('auth.login')}
        </button>
        <button
          onClick={onSignupClick}
          disabled={disableSignup}
          aria-label={t('auth.header.aria.navigateToSignup')}
          style={{
            height: '40px',
            padding: '0 20px',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: disableSignup ? 'not-allowed' : 'pointer',
            background: '#111',
            color: 'white',
            border: '1px solid #111',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {t('auth.signup')}
        </button>
      </nav>
    </header>
  );
}

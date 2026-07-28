import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import saraIcon from '../assets/icon.png';
import './AuthHeader.css';

export default function AuthHeader({
  onLoginClick,
  onSignupClick,
  disableLogin = false,
  disableSignup = false,
}) {
  const { t } = useTranslation();
  return (
    <header className="auth-header">
      <div
        className="auth-header-logo"
        role="img"
        aria-label={t('auth.header.aria.logo')}
      >
        <img
          src={saraIcon}
          alt="Sara"
        />
        <span>
          Sara
        </span>
      </div>

      <nav
        aria-label={t('auth.header.aria.nav')}
        className="auth-header-nav"
      >
        <LanguageSwitcher />
        <button
          type="button"
          onClick={onLoginClick}
          disabled={disableLogin}
          aria-label={t('auth.header.aria.navigateToLogin')}
          className="auth-header-login-btn"
        >
          {t('auth.login')}
        </button>
        <button
          type="button"
          onClick={onSignupClick}
          disabled={disableSignup}
          aria-label={t('auth.header.aria.navigateToSignup')}
          className="auth-header-signup-btn"
        >
          {t('auth.signup')}
        </button>
      </nav>
    </header>
  );
}

import React from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import FormField from '../components/form/FormField';
import PasswordField from '../components/form/PasswordField';
import ErrorState from '../components/common/ErrorState';
import { useLogin } from '../hooks/useLogin';
import './Login.css';

// Inline SVG icons (safe fallback if project icons aren't available)
function GoogleIcon({ width = 18, height = 18 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="-0.5 0 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs>{' '}
        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          {' '}
          <g id="Color-" transform="translate(-401.000000, -860.000000)">
            {' '}
            <g id="Google" transform="translate(401.000000, 860.000000)">
              {' '}
              <path
                d="M9.83,24 C9.83,22.48 10.08,21.01 10.53,19.64 L2.62,13.6 C1.08,16.73 0.21,20.26 0.21,24 C0.21,27.74 1.08,31.26 2.62,34.39 L10.52,28.34 C10.08,26.97 9.83,25.52 9.83,24"
                id="Fill-1"
                fill="#FBBC05"
              >
                {' '}
              </path>{' '}
              <path
                d="M23.71,10.13 C27.03,10.13 30.02,11.31 32.37,13.23 L39.2,6.4 C35.04,2.77 29.7,0.53 23.71,0.53 C14.43,0.53 6.45,5.84 2.62,13.6 L10.53,19.64 C12.35,14.11 17.55,10.13 23.71,10.13"
                id="Fill-2"
                fill="#EB4335"
              >
                {' '}
              </path>{' '}
              <path
                d="M23.71,37.87 C17.55,37.87 12.35,33.89 10.53,28.36 L2.62,34.39 C6.45,42.16 14.43,47.47 23.71,47.47 C29.45,47.47 34.92,45.43 39.02,41.62 L31.52,35.81 C29.4,37.15 26.73,37.87 23.71,37.87"
                id="Fill-3"
                fill="#34A853"
              >
                {' '}
              </path>{' '}
              <path
                d="M46.15,24 C46.15,22.61 45.93,21.12 45.61,19.73 L23.71,19.73 L23.71,28.8 L36.32,28.8 C35.69,31.89 33.97,34.27 31.52,35.81 L39.02,41.62 C43.34,37.61 46.15,31.65 46.15,24"
                id="Fill-4"
                fill="#4285F4"
              >
                {' '}
              </path>{' '}
            </g>{' '}
          </g>{' '}
        </g>{' '}
      </g>
    </svg>
  );
}

/**
 * Login Page Component
 * Pure presentation component - all business logic in useLogin hook
 */
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    form,
    error,
    isLoading,
    showPassword,
    handleSubmit,
    updateField,
    togglePasswordVisibility,
    handleOAuthLogin,
    navigateToRegister,
    navigateToHome,
  } = useLogin();

  return (
    <AuthLayout onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/register')}>
      <div className="login-wrapper">
        <h1 className="login-title">
          {t('auth.signInTitle')}
        </h1>
        <p className="login-subtitle">
          {t('auth.dontHaveAccount')}{' '}
          <button
            type="button"
            onClick={navigateToRegister}
            className="login-register-link"
            disabled={isLoading}
            aria-label={t('auth.aria.navigateToSignup')}
          >
            {t('auth.signup')}
          </button>
        </p>
        <div className="login-divider" aria-hidden="true" />
      </div>

      <form
        onSubmit={handleSubmit}
        aria-busy={isLoading}
        className="login-form"
      >
        <fieldset className="login-fieldset">
          <legend className="sr-only">{t('auth.loginCredentials')}</legend>

          <FormField
            id="email"
            type="email"
            label={t('auth.emailAddress')}
            placeholder={t('auth.emailPlaceholder')}
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            icon={Mail}
            required
            disabled={isLoading}
            autoComplete="email"
            error={error && !form.email.trim()}
            ariaDescribedBy={error ? 'login-error' : undefined}
          />

          <PasswordField
            id="password"
            label={t('auth.password')}
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            required
            disabled={isLoading}
            error={error && !form.password}
            ariaDescribedBy={error ? 'login-error' : undefined}
            controlled
            showPasswordProp={showPassword}
            onTogglePassword={togglePasswordVisibility}
          />
        </fieldset>

        {error && (
          <div id="login-error">
            <ErrorState message={error} variant="inline" centered={false} />
          </div>
        )}

        <div className="login-buttons">
          <PrimaryButton type="submit" disabled={isLoading} className="login-btn-flex">
            {isLoading ? t('auth.loading') : t('auth.login')}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={navigateToHome}
            disabled={isLoading}
            className="login-btn-flex"
          >
            {t('common.back')}
          </SecondaryButton>
        </div>

        <div className="login-oauth-section">
          <div className="login-oauth-divider">
            <div className="login-oauth-divider-line" aria-hidden="true" />
            <span className="login-oauth-divider-text">{t('auth.orContinueWith')}</span>
            <div className="login-oauth-divider-line" aria-hidden="true" />
          </div>

          <div className="login-oauth-buttons">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              aria-label={t('auth.googleLogin')}
              className="login-google-btn"
            >
              <GoogleIcon aria-hidden="true" />
              <span>Google</span>
            </button>
          </div>
        </div>
      </form>

      {/* Status announcements for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="login-sr-only"
      >
        {isLoading && t('common.loading')}
      </div>
    </AuthLayout>
  );
}

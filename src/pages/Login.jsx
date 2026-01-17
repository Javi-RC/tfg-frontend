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

// Inline SVG icons (safe fallback if project icons aren't available)
function GoogleIcon({ width = 18, height = 18 }) {
  return (
    <svg width={width} height={height} viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>
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
    navigateToHome
  } = useLogin();

  return (
    <AuthLayout onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/register')}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
        <h1 style={{ color: '#1a1a1a', fontSize: '32px', fontWeight: '500', textAlign: 'center', margin: 0 }}>{t('auth.signInTitle')}</h1>
        <p style={{ color: '#1a1a1a', fontSize: '15px', margin: 0 }}>{t('auth.dontHaveAccount')} <button onClick={navigateToRegister} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: '#0369a1', textDecoration: 'underline' }} disabled={isLoading} aria-label={t('auth.aria.navigateToSignup')}>{t('auth.signup')}</button></p>
        <div style={{ alignSelf: 'stretch', height: '1px', background: '#D9D9D9', outline: '1px #0F172A solid', outlineOffset: '-0.5px', margin: '16px 0' }} aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} aria-busy={isLoading} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend className="sr-only">{t('auth.loginCredentials')}</legend>
          
          <FormField
            id="email"
            type="email"
            label={t('auth.emailAddress')}
            placeholder={t('auth.emailPlaceholder')}
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            icon={Mail}
            required
            disabled={isLoading}
            autoComplete="email"
            error={error && !form.email.trim()}
            ariaDescribedBy={error ? "login-error" : undefined}
          />

          <PasswordField
            id="password"
            label={t('auth.password')}
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            required
            disabled={isLoading}
            error={error && !form.password}
            ariaDescribedBy={error ? "login-error" : undefined}
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

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <PrimaryButton type="submit" disabled={isLoading} style={{ flex: 1 }}>{isLoading ? t('auth.loading') : t('auth.login')}</PrimaryButton>
          <SecondaryButton type="button" onClick={navigateToHome} disabled={isLoading} style={{ flex: 1 }}>{t('common.back')}</SecondaryButton>
        </div>

        <div style={{ margin: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#1a1a1a', fontSize: '14px' }}>
            <div style={{ flex: 1, borderBottom: '1px solid rgba(102,102,102,0.25)' }} aria-hidden="true" />
            <span style={{ padding: '0 16px' }}>{t('auth.orContinueWith')}</span>
            <div style={{ flex: 1, borderBottom: '1px solid rgba(102,102,102,0.25)' }} aria-hidden="true" />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => handleOAuthLogin('google')} disabled={isLoading} aria-label={t('auth.googleLogin')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', border: '1px solid rgba(102,102,102,0.25)', borderRadius: '12px', background: 'white', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontSize: '14px', fontWeight: '500', opacity: isLoading ? 0.6 : 1 }} onMouseEnter={(e) => { if (!isLoading) { e.target.style.borderColor = '#111'; e.target.style.background = '#f8f9fa'; } }} onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(102,102,102,0.25)'; e.target.style.background = 'white'; }}>
              <GoogleIcon aria-hidden="true" />
              <span>Google</span>
            </button>
          </div>
        </div>
      </form>

      {/* Status announcements for screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        {isLoading && t('common.loading')}
      </div>
    </AuthLayout>
  );
}
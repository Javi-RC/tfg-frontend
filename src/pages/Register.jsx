import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import FormField from '../components/form/FormField';
import PasswordField from '../components/form/PasswordField';
import { useRegister } from '../hooks/useRegister';
import './register.css';

function Step1AccountInfo({ formData, updateField, handleKeyPress, error }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <FormField
        id="username"
        type="text"
        label={t('auth.username')}
        value={formData.username}
        onChange={(e) => updateField('username', e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={t('register.usernamePlaceholder')}
        autoFocus
        required
        error={error && (!formData.username || formData.username.trim().length < 3)}
        ariaDescribedBy={error ? 'register-error' : undefined}
      />

      <fieldset style={{ border: 'none', padding: 0, margin: '16px 0 0 0', width: '100%' }}>
        <legend
          style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: '500', marginBottom: 12 }}
        >
          {t('register.roleQuestion')}{' '}
          <span style={{ color: 'var(--color-error)' }} aria-label={t('common.required')}>
            *
          </span>
        </legend>
        <div
          style={{ display: 'flex', gap: 12, marginTop: 6 }}
          role="group"
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="org_admin"
              checked={formData.role === 'org_admin'}
              onChange={(e) => updateField('role', e.target.value)}
              aria-describedby={error ? 'register-error' : undefined}
            />
            <span style={{ color: 'var(--color-text-primary)' }}>{t('register.organizationAdmin')}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={formData.role === 'employee'}
              onChange={(e) => updateField('role', e.target.value)}
              aria-describedby={error ? 'register-error' : undefined}
            />
            <span style={{ color: 'var(--color-text-primary)' }}>{t('register.employee')}</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function Step2Password({ formData, updateField, handleKeyPress, passwordRules, isPasswordValid, error }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <PasswordField
        id="password"
        label={t('auth.password')}
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={t('register.passwordPlaceholder')}
        required
        error={error && !isPasswordValid}
        ariaDescribedBy="password-requirements"
      />

      <PasswordField
        id="confirm-password"
        label={t('auth.confirmPassword')}
        value={formData.confirm}
        onChange={(e) => updateField('confirm', e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={t('register.confirmPasswordPlaceholder')}
        required
        error={formData.confirm && formData.password !== formData.confirm}
        ariaDescribedBy="password-requirements"
      />

      <div id="password-requirements" style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
        <div style={{ marginBottom: '8px', fontWeight: '500' }}>
          {t('register.passwordRequirements')}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
          <li
            style={{
              color: passwordRules.length ? '#15803d' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {passwordRules.length ? <CheckCircle size={16} /> : <Circle size={16} />}
            {t('register.minLength')}
          </li>
          <li
            style={{
              color: passwordRules.uppercase ? '#15803d' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {passwordRules.uppercase ? <CheckCircle size={16} /> : <Circle size={16} />}
            {t('register.hasUppercase')}
          </li>
          <li
            style={{
              color: passwordRules.lowercase ? '#15803d' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {passwordRules.lowercase ? <CheckCircle size={16} /> : <Circle size={16} />}
            {t('register.hasLowercase')}
          </li>
          <li
            style={{
              color: passwordRules.number ? '#15803d' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {passwordRules.number ? <CheckCircle size={16} /> : <Circle size={16} />}
            {t('register.hasNumber')}
          </li>
          <li
            style={{
              color: passwordRules.special ? '#15803d' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {passwordRules.special ? <CheckCircle size={16} /> : <Circle size={16} />}
            {t('register.hasSpecialChar')}
          </li>
        </ul>
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color:
              formData.confirm && formData.password !== formData.confirm
                ? '#b91c1c'
                : '#1a1a1a',
          }}
        >
          {formData.confirm
            ? formData.password === formData.confirm
              ? t('register.passwordsMatch')
              : t('errors.passwordsDoNotMatch')
            : t('auth.confirmPassword')}
        </div>
      </div>
    </div>
  );
}

function Step3Email({ formData, updateField, handleKeyPress, error }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <FormField
        id="email"
        type="email"
        label={t('auth.emailAddress')}
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={t('register.emailPlaceholder')}
        autoFocus
        required
        error={error}
        ariaDescribedBy="email-help register-error"
      />
      <div id="email-help" style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
        {t('register.clickToVerify')}
      </div>
    </div>
  );
}

function VerificationBanner({ email, resendLoading, resendMessage, handleResend }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '10px',
        background: '#eef6ff',
        border: '1px solid rgba(59,130,246,0.12)',
        color: '#0369a1',
        fontSize: '14px',
      }}
    >
      <div>
        {t('register.verificationSent')} <strong>{email || '(no email)'}</strong>.
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          aria-label={t('register.aria.resendEmail')}
          style={{
            background: '#0369a1',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 12px',
            border: 'none',
            cursor: resendLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {resendLoading ? t('register.resending') : t('register.resendEmail')}
        </button>
        {resendMessage && (
          <div
            role="status"
            aria-live="polite"
            style={{ alignSelf: 'center', color: '#075985' }}
          >
            {resendMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    formData,
    step,
    error,
    loading,
    registered,
    resendLoading,
    resendMessage,
    passwordRules,
    isPasswordValid,
    updateField,
    handleNext,
    handleBack,
    handleKeyPress,
    handleResend,
  } = useRegister();

  return (
    <AuthLayout onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/register')}>
      <div className="welcome-block">
        <div className="welcome-title">{t('register.title')}</div>

        <div className="welcome-subtext">
          <span className="already">{t('auth.alreadyHaveAccount')}</span>
          <a
            href="/login"
            className="login-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            {t('auth.login')}
          </a>
        </div>

        <div className="welcome-divider" aria-hidden="true" />
      </div>

      <nav
        className="stepper"
        role="progressbar"
        aria-label={t('register.aria.progress')}
        aria-valuenow={step}
        aria-valuemin="1"
        aria-valuemax="3"
        aria-valuetext={t('register.aria.stepOf', { current: step, total: 3 })}
      >
        <div
          className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}
          aria-current={step === 1 ? 'step' : undefined}
        >
          <div className="step-circle">{step > 1 ? <CheckCircle size={16} /> : '1'}</div>
          <div className="step-label">{t('register.step1Label')}</div>
        </div>
        <div className={`connector ${step > 1 ? 'filled' : ''}`} aria-hidden="true" />
        <div
          className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}
          aria-current={step === 2 ? 'step' : undefined}
        >
          <div className="step-circle">{step > 2 ? <CheckCircle size={16} /> : '2'}</div>
          <div className="step-label">{t('register.step2Label')}</div>
        </div>
        <div className={`connector ${step > 2 ? 'filled' : ''}`} aria-hidden="true" />
        <div
          className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}
          aria-current={step === 3 ? 'step' : undefined}
        >
          <div className="step-circle">3</div>
          <div className="step-label">{t('register.step3Label')}</div>
        </div>
      </nav>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'transparent' }}
      >
        {step === 1 && (
          <Step1AccountInfo
            formData={formData}
            updateField={updateField}
            handleKeyPress={handleKeyPress}
            error={error}
          />
        )}

        {step === 2 && (
          <Step2Password
            formData={formData}
            updateField={updateField}
            handleKeyPress={handleKeyPress}
            passwordRules={passwordRules}
            isPasswordValid={isPasswordValid}
            error={error}
          />
        )}

        {step === 3 && (
          <Step3Email
            formData={formData}
            updateField={updateField}
            handleKeyPress={handleKeyPress}
            error={error}
          />
        )}

        {registered && (
          <VerificationBanner
            email={formData.email}
            resendLoading={resendLoading}
            resendMessage={resendMessage}
            handleResend={handleResend}
          />
        )}

        {error && (
          <div
            id="register-error"
            role="alert"
            aria-live="assertive"
            style={{
              color: 'var(--color-error)',
              background: 'rgba(192,57,43,0.08)',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              border: '1px solid rgba(192,57,43,0.2)',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            gap: '12px',
          }}
        >
          <SecondaryButton onClick={handleBack} disabled={step === 1}>
            {t('common.back')}
          </SecondaryButton>
          <PrimaryButton onClick={handleNext} disabled={loading}>
            {loading ? t('auth.loading') : step === 3 ? t('register.finish') : t('common.next')}
          </PrimaryButton>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;

import React, { useState } from 'react';
import { CheckCircle, Circle, Mail, User, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { register as apiRegister, resendConfirmation } from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleNext = async () => {
    setError('');
    if (step === 1) {
      if (!username || username.trim().length < 3) {
        setError('Please select a username with at least 3 characters.');
        return;
      }
      if (!role) {
        setError('Please indicate what type of user you are.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!isPasswordValid) {
        setError('The password does not meet the requirements.');
        return;
      }
      if (password !== confirm) {
        setError('The passwords do not match.');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      setError('');
      try {
        setLoading(true);
        const payload = { email, username, role, password, name: username };
        console.log('Register payload:', payload);
        const res = await apiRegister(payload);
        setRegistered(true);
        setResendMessage(res.data?.message || 'Account created. Check your email to verify.');
      } catch (err) {
        setError(err.response?.data?.error || 'Error creating account');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep(step - 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleNext();
  };

  const handleResend = async () => {
    setResendMessage('');
    if (!email) {
      setResendMessage('Please provide an email address to resend.');
      return;
    }
    try {
      setResendLoading(true);
      const res = await resendConfirmation({ email, name: username, role });
      setResendMessage(res.data?.message || 'Verification email resent.');
    } catch (err) {
      setResendMessage(err.response?.data?.error || 'Error resending the email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout onLoginClick={() => window.location.href = '/login'} onSignupClick={() => window.location.href = '/register'}>
      <div className="welcome-block">
        <div className="welcome-title">Welcome!</div>

        <div className="welcome-subtext">
          <span className="already">Already have an account?</span>
          <a href="/login" className="login-link">Log in</a>
        </div>

        <div className="welcome-divider" aria-hidden="true" />
      </div>

      <nav className="stepper" role="progressbar" aria-label="Registration progress" aria-valuenow={step} aria-valuemin="1" aria-valuemax="3" aria-valuetext={`Step ${step} of 3`}>
        <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`} aria-current={step === 1 ? 'step' : undefined}>
          <div className="step-circle">{step > 1 ? <CheckCircle size={16} /> : '1'}</div>
          <div className="step-label">Enter your personal data</div>
        </div>
        <div className={`connector ${step > 1 ? 'filled' : ''}`} aria-hidden="true" />
        <div className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`} aria-current={step === 2 ? 'step' : undefined}>
          <div className="step-circle">{step > 2 ? <CheckCircle size={16} /> : '2'}</div>
          <div className="step-label">Create your password</div>
        </div>
        <div className={`connector ${step > 2 ? 'filled' : ''}`} aria-hidden="true" />
        <div className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`} aria-current={step === 3 ? 'step' : undefined}>
          <div className="step-circle">3</div>
          <div className="step-label">Verify email</div>
        </div>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'transparent' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <label htmlFor="username" style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500', width: '100%', marginBottom: '4px' }}>Username <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your username"
              autoFocus
              required
              aria-required="true"
              aria-invalid={error && (!username || username.trim().length < 3) ? "true" : "false"}
              aria-describedby={error ? "register-error" : undefined}
              style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 16px', fontSize: '16px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#111'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(102,102,102,0.25)'}
            />

            <fieldset style={{ border: 'none', padding: 0, margin: '16px 0 0 0', width: '100%' }}>
              <legend style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500', marginBottom: 12 }}>What type of user are you? <span style={{ color: '#c0392b' }} aria-label="required">*</span></legend>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }} role="group" aria-required="true">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="role" value="org_admin" checked={role === 'org_admin'} onChange={(e) => setRole(e.target.value)} aria-describedby={error ? "register-error" : undefined} />
                  <span style={{ color: '#1a1a1a' }}>Organization Admin</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="role" value="employee" checked={role === 'employee'} onChange={(e) => setRole(e.target.value)} aria-describedby={error ? "register-error" : undefined} />
                  <span style={{ color: '#1a1a1a' }}>Employee</span>
                </label>
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <label htmlFor="password" style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500', width: '100%', marginBottom: '4px' }}>Password <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  required
                  aria-required="true"
                  aria-invalid={error && !isPasswordValid ? "true" : "false"}
                  aria-describedby="password-requirements"
                  style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 16px', paddingRight: '48px', fontSize: '16px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102,102,102,0.25)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <label htmlFor="confirm-password" style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500', width: '100%', marginBottom: '4px' }}>Repeat Password <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Repeat password"
                  required
                  aria-required="true"
                  aria-invalid={confirm && password !== confirm ? "true" : "false"}
                  aria-describedby="password-requirements"
                  style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 16px', paddingRight: '48px', fontSize: '16px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102,102,102,0.25)'}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide password" : "Show password"} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {showConfirm ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div id="password-requirements" role="region" aria-label="Password requirements" style={{ padding: 12, borderRadius: 8, background: '#fafafa', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 14, marginBottom: 8, color: '#1a1a1a' }}>Password requirements:</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
                <li style={{ color: passwordRules.length ? '#15803d' : '#1a1a1a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  {passwordRules.length ? <CheckCircle size={16} /> : <Circle size={16} />}
                  8 or more characters
                </li>
                <li style={{ color: passwordRules.uppercase ? '#15803d' : '#1a1a1a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  {passwordRules.uppercase ? <CheckCircle size={16} /> : <Circle size={16} />}
                  One uppercase character
                </li>
                <li style={{ color: passwordRules.lowercase ? '#15803d' : '#1a1a1a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  {passwordRules.lowercase ? <CheckCircle size={16} /> : <Circle size={16} />}
                  One lowercase character
                </li>
                <li style={{ color: passwordRules.number ? '#15803d' : '#1a1a1a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  {passwordRules.number ? <CheckCircle size={16} /> : <Circle size={16} />}
                  One number
                </li>
                <li style={{ color: passwordRules.special ? '#15803d' : '#1a1a1a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordRules.special ? <CheckCircle size={16} /> : <Circle size={16} />}
                  One special character
                </li>
              </ul>
              <div style={{ marginTop: 8, fontSize: 13, color: (confirm && password !== confirm) ? '#b91c1c' : '#1a1a1a' }}>
                {confirm ? (password === confirm ? 'Passwords match' : 'Passwords do not match') : 'Repeat password to confirm'}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <label htmlFor="email" style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500', width: '100%', marginBottom: '4px' }}>Email address <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="you@example.com"
                autoFocus
                required
                aria-required="true"
                aria-invalid={error && !validateEmail(email) ? "true" : "false"}
                aria-describedby="email-help register-error"
                style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 16px', fontSize: '16px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#111'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(102,102,102,0.25)'}
              />
            </div>
            <div id="email-help" style={{ fontSize: 13, color: '#1a1a1a' }}>Please verify your email is correct; you will receive a link to verify your account.</div>
          </div>
        )}

        {registered && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#eef6ff', border: '1px solid rgba(59,130,246,0.12)', color: '#0369a1', fontSize: '14px' }}>
            <div>We have sent a verification email to <strong>{email || '(no email)'}</strong>.</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={handleResend} disabled={resendLoading} aria-label="Resend verification email" style={{ background: '#0369a1', color: 'white', borderRadius: '8px', padding: '8px 12px', border: 'none', cursor: resendLoading ? 'not-allowed' : 'pointer' }}>{resendLoading ? 'Resending...' : 'Resend email'}</button>
              {resendMessage && (<div role="status" aria-live="polite" style={{ alignSelf: 'center', color: '#075985' }}>{resendMessage}</div>)}
            </div>
          </div>
        )}

        {error && (
          <div id="register-error" role="alert" aria-live="assertive" style={{ color: '#c0392b', background: 'rgba(192,57,43,0.08)', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', border: '1px solid rgba(192,57,43,0.2)' }}>{error}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', gap: '12px' }}>
          <SecondaryButton onClick={handleBack} disabled={step === 1}>Back</SecondaryButton>
          <PrimaryButton onClick={handleNext} disabled={loading}>{loading ? (step === 3 ? 'Loading...' : 'Loading...') : (step === 3 ? 'Create account' : 'Next')}</PrimaryButton>
        </div>
      </div>

      <style>{`
        :root{ --dot-color: #333333; --dot-inactive: #f0f0f0; --connector-inactive: rgba(51,51,51,0.12); --connector-active: rgba(51,51,51,0.35); }
        .stepper{ display: flex; align-items: center; margin-bottom: 24px; width: 100%; }
        .step{ display: flex; flex-direction: column; align-items: center; gap: 12px; justify-content: flex-start; flex: 1 1 0%; min-width: 0; }
        .connector{ flex: 1 1 0%; height: 1px; background: var(--connector-inactive); margin: 0 16px; }
        .connector.filled{ background: var(--connector-active); }
        .step-circle{ width: 28px; height: 28px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; background: var(--dot-inactive); color: #999; font-size: 13px; font-family: 'Avenir', system-ui, -apple-system, 'Helvetica Neue', Arial; font-weight: 600; }
        .step.completed .step-circle, .step.active .step-circle{ background: var(--dot-color); color: #fff; }
        .step-label{ font-size: 14px; font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Arial; font-weight: 300; color: var(--dot-color); text-align: center; white-space: normal; overflow: visible; text-overflow: unset; max-width: none; padding: 0 6px; line-height: 1.2; word-break: break-word; }
        .welcome-block{ width: 100%; display: inline-flex; flex-direction: column; align-items: center; gap: 20px; justify-content: center; }
        .welcome-title{ color: #1a1a1a; font-size: 32px; font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Arial; font-weight: 500; word-wrap: break-word; text-align: center; }
        .welcome-subtext{ display: inline-flex; padding: 2px; gap: 10px; align-items: flex-start; justify-content: flex-start; }
        .welcome-subtext .already{ color: #1a1a1a; font-size: 16px; font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Arial; font-weight: 400; word-wrap: break-word; margin-right: 6px; }
        .welcome-subtext .login-link{ color: #111111; font-size: 16px; font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Arial; font-weight: 400; text-decoration: underline; }
        .welcome-divider{ align-self: stretch; height: 1px; background: #D9D9D9; outline: 1px #0F172A solid; outline-offset: -0.5px; margin: 16px 0; }
        @media (max-width: 1024px) { main { grid-template-columns: 1fr !important; } main > div:last-child { display: none; } }
        @media (max-width: 520px){ .connector{ width: 40px } .step-label{ font-size: 14px } }
      `}</style>
    </AuthLayout>
  );
}

export default Register;
import React, { useState, useContext, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
// Inline SVG icons (safe fallback if project icons aren't available)
function GoogleIcon({ width = 18, height = 18 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17.64 9.2045c0-.638-.0576-1.251-.164-1.836H9v3.48h4.844c-.208 1.12-.84 2.07-1.78 2.712v2.26h2.876c1.684-1.55 2.68-3.84 2.68-6.616z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.876-2.26c-.8.54-1.82.86-3.084.86-2.37 0-4.376-1.6-5.095-3.75H1.96v2.36C3.45 15.9 6.03 18 9 18z" fill="#34A853"/>
      <path d="M3.905 10.68A5.397 5.397 0 0 1 3.6 9c0-.64.11-1.26.305-1.84V4.8H1.96A8.997 8.997 0 0 0 0 9c0 1.46.36 2.84 1.01 4.04l2.895-2.36z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.45.96 11.41 0 9 0 6.03 0 3.45 2.1 1.96 4.8l2.395 1.36C4.624 5.18 6.63 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithOAuth } = useContext(AuthContext);

  // Check for OAuth redirect errors in the URL (e.g. ?oauth_error=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get('oauth_error') || params.get('error');
      if (oauthError) {
        // decodeURIComponent because the backend may URL-encode the message
        let decoded;
        try {
          decoded = decodeURIComponent(oauthError);
        } catch {
          decoded = oauthError;
        }
        setError(
          `Authentication error: ${decoded}. If the issue persists, complete your profile or contact support.`
        );

        // Remove the oauth_error param from the URL so it doesn't persist on refresh
        const url = new URL(window.location.href);
        url.searchParams.delete('oauth_error');
        url.searchParams.delete('error');
        window.history.replaceState(null, '', url.toString());
      }
    } catch (e) {
      // silent fallback - don't break the page
    }
  }, []);

  const validateForm = () => {
    if (!form.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!form.password) {
      setError('Password is required');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(form);
      // Use router navigation in your actual app
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Error logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (error) setError(null);
  };

  const navigateToRegister = () => {
    if (!isLoading) window.location.href = '/register';
  };

  const navigateToHome = () => {
    if (!isLoading) window.location.href = '/';
  };

  return (
    <AuthLayout onLoginClick={() => window.location.href = '/login'} onSignupClick={() => window.location.href = '/register'}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
        <h1 style={{ color: '#1a1a1a', fontSize: '32px', fontWeight: '500', textAlign: 'center', margin: 0 }}>Sign in to your account</h1>
        <p style={{ color: '#1a1a1a', fontSize: '15px', margin: 0 }}>Don't have an account? <button onClick={() => window.location.href = '/register'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: '#0369a1', textDecoration: 'underline' }} disabled={isLoading} aria-label="Navigate to sign up page">Sign up</button></p>
        <div style={{ alignSelf: 'stretch', height: '1px', background: '#D9D9D9', outline: '1px #0F172A solid', outlineOffset: '-0.5px', margin: '16px 0' }} aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} aria-busy={isLoading} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ width: '100%' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#1a1a1a', width: '100%' }}>Email address <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
          <div style={{ position: 'relative', width: '100%' }}>
            <Mail size={18} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
            <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleInputChange('email')} onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)} disabled={isLoading} autoComplete="email" required aria-required="true" aria-invalid={error && !form.email.trim() ? "true" : "false"} aria-describedby={error ? "login-error" : undefined} style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 16px 0 48px', fontSize: '16px', outline: 'none', transition: 'all 0.15s', fontFamily: 'inherit', background: isLoading ? '#f5f5f5' : 'white', boxSizing: 'border-box' }} onFocus={(e) => { e.target.style.borderColor = '#111'; e.target.style.boxShadow = '0 0 0 3px rgba(17,17,17,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(102,102,102,0.25)'; e.target.style.boxShadow = 'none'; }} />
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#1a1a1a', width: '100%' }}>Password <span style={{ color: '#c0392b' }} aria-label="required">*</span></label>
          <div style={{ position: 'relative', width: '100%' }}>
            <Lock size={18} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
            <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={handleInputChange('password')} onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)} disabled={isLoading} autoComplete="current-password" required aria-required="true" aria-invalid={error && !form.password ? "true" : "false"} aria-describedby={error ? "login-error" : undefined} style={{ width: '100%', height: '56px', borderRadius: '12px', border: '1px solid rgba(102,102,102,0.25)', padding: '0 48px', fontSize: '16px', outline: 'none', transition: 'all 0.15s', fontFamily: 'inherit', background: isLoading ? '#f5f5f5' : 'white', boxSizing: 'border-box' }} onFocus={(e) => { e.target.style.borderColor = '#111'; e.target.style.boxShadow = '0 0 0 3px rgba(17,17,17,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(102,102,102,0.25)'; e.target.style.boxShadow = 'none'; }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} aria-label={showPassword ? "Hide password" : "Show password"} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLoading ? 0.5 : 1 }}>
              {showPassword ? <EyeOff size={20} color="#1a1a1a" /> : <Eye size={20} color="#1a1a1a" />}
            </button>
          </div>
        </div>

        {error && (<div id="login-error" role="alert" aria-live="assertive" style={{ color: '#c0392b', background: 'rgba(192,57,43,0.08)', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', border: '1px solid rgba(192,57,43,0.2)' }}>{error}</div>)}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <PrimaryButton type="submit" disabled={isLoading} style={{ flex: 1 }}>{isLoading ? 'Loading...' : 'Sign in'}</PrimaryButton>
          <SecondaryButton type="button" onClick={() => window.location.href = '/'} disabled={isLoading} style={{ flex: 1 }}>Back</SecondaryButton>
        </div>

        <div style={{ margin: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#1a1a1a', fontSize: '14px' }}>
            <div style={{ flex: 1, borderBottom: '1px solid rgba(102,102,102,0.25)' }} aria-hidden="true" />
            <span style={{ padding: '0 16px' }}>Or sign in with</span>
            <div style={{ flex: 1, borderBottom: '1px solid rgba(102,102,102,0.25)' }} aria-hidden="true" />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => loginWithOAuth('google')} disabled={isLoading} aria-label="Sign in with Google" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', border: '1px solid rgba(102,102,102,0.25)', borderRadius: '12px', background: 'white', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontSize: '14px', fontWeight: '500', opacity: isLoading ? 0.6 : 1 }} onMouseEnter={(e) => { if (!isLoading) { e.target.style.borderColor = '#111'; e.target.style.background = '#f8f9fa'; } }} onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(102,102,102,0.25)'; e.target.style.background = 'white'; }}>
              <GoogleIcon />
              <span>Google</span>
            </button>
          </div>
        </div>
      </form>

      {/* Status announcements for screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        {isLoading && 'Loading, please wait'}
      </div>
    </AuthLayout>
  );
}
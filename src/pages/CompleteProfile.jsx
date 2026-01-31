import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../contexts/AuthContext';
import saraIcon from '../assets/icon.png';

function CompleteProfile() {
  const { t } = useTranslation();
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // CRITICAL: Extract token from URL and save to localStorage FIRST
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    console.log('[CompleteProfile] Token from URL:', tokenFromUrl ? 'present' : 'missing');
    
    if (tokenFromUrl) {
      console.log('[CompleteProfile] Saving token from URL to localStorage');
      try {
        // Decode and validate token
        const decoded = jwtDecode(tokenFromUrl);
        console.log('[CompleteProfile] Decoded token:', decoded);
        const userData = decoded.user || decoded;
        
        // Save to localStorage immediately
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('[CompleteProfile] Token saved to localStorage');
        
        // Update context
        if (auth?.setSession) {
          auth.setSession(tokenFromUrl, userData);
        }
        
        // Clean URL (remove token from query string for security)
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState(null, '', url.toString());
      } catch (err) {
        console.error('[CompleteProfile] Error processing token from URL:', err);
        setError('Invalid authentication token. Please try logging in again.');
      }
    }
  }, [searchParams, auth]);

  // Debug: Check localStorage on component mount
  useEffect(() => {
    console.log('[CompleteProfile] Component mounted');
    console.log('[CompleteProfile] Token in localStorage:', localStorage.getItem('token') ? 'present' : 'missing');
    console.log('[CompleteProfile] User in localStorage:', localStorage.getItem('user'));
    console.log('[CompleteProfile] Auth context user:', auth?.user);
    console.log('[CompleteProfile] Auth context token:', auth?.token ? 'present' : 'missing');
  }, [auth]);

  // Redirect if no context available
  useEffect(() => {
    if (!auth) {
      navigate('/login', { replace: true });
    }
  }, [auth, navigate]);

  if (!auth) {
    return null;
  }

  const { user, updateProfile, completeOAuthProfile } = auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role) {
      setError(t('form.required'));
      return;
    }

    console.log('[CompleteProfile] About to update profile with role:', role);
    console.log('[CompleteProfile] Token in localStorage:', localStorage.getItem('token') ? 'present' : 'missing');
    console.log('[CompleteProfile] User in context:', user);
    
    setIsLoading(true);
    try {
      // Use completeOAuthProfile for OAuth flow, which uses /auth/complete-profile endpoint
      await completeOAuthProfile({ role });
      navigate('/', { replace: true });
    } catch (err) {
      // Log full error for debugging
      console.error('Error updating profile:', err);
      console.error('Error response:', err?.response);

      // Prefer explicit backend message if available, otherwise stringify response
      const backendMessage = err?.response?.data?.error || err?.response?.data?.message;
      const status = err?.response?.status;
      const details = err?.response?.data && typeof err.response.data === 'object'
        ? JSON.stringify(err.response.data)
        : err?.response?.data;

      const userMessage = backendMessage || (status ? `Server responded ${status}` : err.message) || 'Error saving profile';
      setError(userMessage + (details ? ` — ${details}` : ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="brand">
          <img 
            src={saraIcon} 
            alt="Sara" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain'
            }}
          />
          <span className="brand-name" style={{ 
            fontSize: '28px', 
            fontWeight: '400',
            color: '#2563eb',
            fontFamily: "'Pacifico', cursive"
          }}>
            Sara
          </span>
        </div>
      </header>

      <main className="main-content">
        <div className="login-card">
          <div className="welcome-block">
            <h1 className="welcome-title">{t('completeProfile.title')}</h1>
              <p style={{ color: '#666', fontSize: '15px', textAlign: 'center' }}>
                {t('completeProfile.greeting', { name: user?.name })}
              </p>
          </div>

          <div className="form-body">
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '16px', 
                fontSize: '16px',
                fontWeight: 500,
                color: '#333'
              }}>
                {t('completeProfile.userType')}
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  className={`role-button ${role === 'employee' ? 'role-button-selected' : ''}`}
                  onClick={() => setRole('employee')}
                  disabled={isLoading}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{t('completeProfile.employee')}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {t('completeProfile.employeeDesc')}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`role-button ${role === 'org_admin' ? 'role-button-selected' : ''}`}
                  onClick={() => setRole('org_admin')}
                  disabled={isLoading}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{t('completeProfile.orgAdmin')}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {t('completeProfile.orgAdminDesc')}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-box" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="button"
              className="primary-btn"
              onClick={handleSubmit}
              disabled={isLoading || !role}
              style={{ width: '100%', marginTop: '24px' }}
            >
              {isLoading ? t('common.saving') : t('common.continue')}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .role-button {
          width: 100%;
          padding: 20px;
          border: 2px solid rgba(102,102,102,0.25);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .role-button:hover:not(:disabled) {
          border-color: #111;
          background: #f8f9fa;
        }

        .role-button-selected {
          border-color: #111;
          background: #f8f9fa;
          box-shadow: 0 0 0 3px rgba(17,17,17,0.1);
        }

        .role-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Reuse the same styles as login */
        .login-page {
          position: relative;
          min-height: 100vh;
          background: #fff;
          font-family: 'Poppins', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
          color: #222;
          margin: 0;
          padding: 0;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 5;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: white;
          border-bottom: 1px solid rgba(102,102,102,0.12);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
        }

        .main-content {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 80px 20px;
          z-index: 2;
          position: relative;
        }

        .login-card {
          width: 100%;
          max-width: 520px;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          justify-content: center;
        }

        .welcome-title {
          color: #333333;
          font-size: 32px;
          font-weight: 500;
          text-align: center;
          margin: 0;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .primary-btn {
          background: #111;
          color: white;
          border-radius: 32px;
          padding: 14px 40px;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .primary-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .error-box {
          color: #c0392b;
          background: rgba(192,57,43,0.08);
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          border: 1px solid rgba(192,57,43,0.2);
        }

        @media (max-width: 520px) {
          .welcome-title {
            font-size: 24px;
          }
          
          .header {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default CompleteProfile;
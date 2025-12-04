import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // If context is not available (HMR or not wrapped), redirect to login
  if (!auth) {
    navigate('/login', { replace: true });
    return null;
  }

  const { user, updateProfile } = auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role) {
      setError('Please select your user type');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ role });
      window.location.href = '/';
    } catch (err) {
      // Log full error for debugging
      console.error('Error updating profile:', err);

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
      <div className="decorative-circle" aria-hidden="true" />
      
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true" />
          <span className="brand-name" style={{ fontSize: '18px', fontWeight: 600 }}>
            Home
          </span>
        </div>
      </header>

      <main className="main-content">
        <div className="login-card">
          <div className="welcome-block">
            <h1 className="welcome-title">Complete your profile</h1>
              <p style={{ color: '#666', fontSize: '15px', textAlign: 'center' }}>
                Hi {user?.name}! We need to know how you'll use our platform
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
                What type of user are you?
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  className={`role-button ${role === 'employee' ? 'role-button-selected' : ''}`}
                  onClick={() => setRole('employee')}
                  disabled={isLoading}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>Employee</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      I'm looking for job opportunities and want to manage my career
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
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>Organization Admin</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      I represent an organization and want to manage employees
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
              {isLoading ? 'Saving...' : 'Continue'}
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

        .decorative-circle {
          position: absolute;
          width: 1014px;
          height: 914px;
          left: -452px;
          top: 82px;
          background: #AFF4C6;
          border-radius: 9999px;
          z-index: 0;
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
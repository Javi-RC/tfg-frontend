import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import CompleteProfileStep1 from './CompleteProfileStep1';
import CompleteProfileStep2 from './CompleteProfileStep2';

function CompleteProfile() {
  const { t } = useTranslation();
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const { user, completeOAuthProfile } = auth;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setError(t('form.required'));
      return;
    }

    setIsLoading(true);
    try {
      await completeOAuthProfile({ role });
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error updating profile:', err);

      const backendMessage = err?.response?.data?.error || err?.response?.data?.message;
      const status = err?.response?.status;
      const details =
        err?.response?.data && typeof err.response.data === 'object'
          ? JSON.stringify(err.response.data)
          : err?.response?.data;

      const userMessage =
        backendMessage ||
        (status ? t('auth.completeProfile.serverResponded', { status }) : err.message) ||
        t('auth.completeProfile.saveFailed');
      setError(userMessage + (details ? ` — ${details}` : ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <CompleteProfileStep1 />

      <CompleteProfileStep2
        t={t}
        user={user}
        role={role}
        setRole={setRole}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        error={error}
      />

      <style>{`
        .role-selection-label {
          display: block;
          margin-bottom: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .role-selection-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

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
          background: var(--color-primary);
          color: white;
          border-radius: 32px;
          padding: 14px 40px;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-primary-sm);
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .primary-btn:hover:not(:disabled) {
          background: var(--color-primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(124, 92, 255, 0.36);
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

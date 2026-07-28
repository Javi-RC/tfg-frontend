import React from 'react';
import RoleSelectionForm from '../components/RoleSelectionForm';

export default function CompleteProfileStep2({ t, user, role, setRole, isLoading, handleSubmit, error }) {
  return (
    <main className="main-content">
      <div className="login-card">
        <div className="welcome-block">
          <h1 className="welcome-title">{t('completeProfile.title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', textAlign: 'center' }}>
            {t('completeProfile.greeting', { name: user?.name })}
          </p>
        </div>

        <div className="form-body">
          <RoleSelectionForm
            role={role}
            setRole={setRole}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />

          {error && (
            <div className="error-box" role="alert" aria-live="polite">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RoleSelectionForm({ role, setRole, isLoading, onSubmit }) {
  const { t } = useTranslation();

  return (
    <div>
      <label
        htmlFor="role-employee"
        className="role-selection-label"
      >
        {t('completeProfile.userType')}
      </label>

      <div className="role-selection-group">
        <button
          id="role-employee"
          type="button"
          className={`role-button ${role === 'employee' ? 'role-button-selected' : ''}`}
          onClick={() => setRole('employee')}
          disabled={isLoading}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>
              {t('completeProfile.employee')}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
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
            <div style={{ fontWeight: 600, fontSize: '16px' }}>
              {t('completeProfile.orgAdmin')}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {t('completeProfile.orgAdminDesc')}
            </div>
          </div>
        </button>
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={onSubmit}
        disabled={isLoading || !role}
        style={{ width: '100%', marginTop: '24px' }}
      >
        {isLoading ? t('common.saving') : t('common.continue')}
      </button>
    </div>
  );
}

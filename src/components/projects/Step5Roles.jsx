import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea, FormNumber } from './FormComponents';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Step 5: Roles and Responsibilities
 */
export default function Step5Roles({ formData, onChange }) {
  const { t } = useTranslation();

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...(formData.keyRoles || [])];
    newRoles[index] = { ...newRoles[index], [field]: value };
    onChange({ keyRoles: newRoles });
  };

  const addRole = () => {
    const newRoles = [...(formData.keyRoles || []), { roleName: '', responsibilities: '', clarityLevel: 3 }];
    onChange({ keyRoles: newRoles });
  };

  const removeRole = (index) => {
    const newRoles = formData.keyRoles.filter((_, i) => i !== index);
    onChange({ keyRoles: newRoles });
  };

  const handleDependenciesChange = (e) => {
    const value = e.target.value;
    const dependencies = value.split('\n').map(d => d.trim()).filter(d => d);
    onChange({ criticalDependencies: dependencies });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step5.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step5.description')}
      </p>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{t('projects.steps.step5.keyRoles')}</h3>
          <PrimaryButton onClick={addRole}>{t('projects.steps.step5.addRole')}</PrimaryButton>
        </div>

        {formData.keyRoles && formData.keyRoles.length > 0 ? (
          formData.keyRoles.map((role, index) => (
            <div key={index} style={styles.roleCard}>
              <div style={styles.roleHeader}>
                <span style={styles.roleNumber}>{t('projects.steps.step5.role')} {index + 1}</span>
                <button
                  style={styles.removeButton}
                  onClick={() => removeRole(index)}
                >
                  {t('projects.steps.step5.remove')}
                </button>
              </div>

              <FormInput
                label={t('projects.steps.step5.roleName')}
                name={`roleName-${index}`}
                value={role.roleName || ''}
                onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
                required
                placeholder={t('projects.steps.step5.roleNamePlaceholder')}
              />

              <FormTextarea
                label={t('projects.steps.step5.responsibilities')}
                name={`responsibilities-${index}`}
                value={role.responsibilities || ''}
                onChange={(e) => handleRoleChange(index, 'responsibilities', e.target.value)}
                placeholder={t('projects.steps.step5.responsibilitiesPlaceholder')}
                rows={3}
                maxLength={1000}
              />

              <div style={styles.claritySection}>
                <label style={styles.label}>
                  Clarity Level: {role.clarityLevel || 3}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={role.clarityLevel || 3}
                  onChange={(e) => handleRoleChange(index, 'clarityLevel', parseInt(e.target.value))}
                  style={styles.slider}
                />
                <div style={styles.sliderLabels}>
                  <span>1 - Unclear</span>
                  <span>5 - Very Clear</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyText}>No roles added yet. Click "Add Role" to start.</p>
        )}
      </div>

      <FormTextarea
        label="Critical Dependencies"
        name="criticalDependencies"
        value={formData.criticalDependencies?.join('\n') || ''}
        onChange={handleDependenciesChange}
        placeholder="Enter each dependency on a new line..."
        rows={4}
      />
    </div>
  );
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  stepDescription: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '32px'
  },
  section: {
    marginBottom: '32px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    margin: 0
  },
  roleCard: {
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #E5E7EB'
  },
  roleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  roleNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280'
  },
  removeButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEE2E2',
    color: '#DC2626',
    transition: 'all 0.2s'
  },
  claritySection: {
    marginTop: '16px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
    display: 'block'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9CA3AF',
    marginTop: '4px'
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px'
  }
};

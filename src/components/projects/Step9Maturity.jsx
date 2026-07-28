import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { FormSelect, FormTextarea } from './FormComponents';
import { YES_NO_PARTIAL, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 9: Organizational Maturity
 */
export default function Step9Maturity({ formData, onChange }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  };

  const handleComplianceChange = (e) => {
    const value = e.target.value;
    const standards = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    onChange({ complianceStandardsText: value, complianceStandards: standards });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step9.title')}</h2>
      <p style={styles.stepDescription}>{t('projects.steps.step9.description')}</p>

      <FormSelect
        label={t('projects.steps.step9.hasOnboardingProcesses')}
        name="hasOnboardingProcesses"
        value={formData.hasOnboardingProcesses || 'partial'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: t('projects.yesNoPartial.yes') },
          { value: YES_NO_PARTIAL.NO, label: t('projects.yesNoPartial.no') },
          { value: YES_NO_PARTIAL.PARTIAL, label: t('projects.yesNoPartial.partial') },
        ]}
      />

      <FormSelect
        label={t('projects.steps.step9.hasVersionControlAndCICD')}
        name="hasVersionControlAndCICD"
        value={formData.hasVersionControlAndCICD || 'yes'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: t('projects.yesNoPartial.yes') },
          { value: YES_NO_PARTIAL.NO, label: t('projects.yesNoPartial.no') },
          { value: YES_NO_PARTIAL.PARTIAL, label: t('projects.yesNoPartial.partial') },
        ]}
      />

      <FormSelect
        label={t('projects.steps.step9.internalToolsFragmentation')}
        name="internalToolsFragmentation"
        value={formData.internalToolsFragmentation || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: t('projects.steps.step9.wellIntegrated') },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: t('projects.steps.step9.someFragmentation') },
          { value: COMPLEXITY_LEVELS.HIGH, label: t('projects.steps.step9.highlyFragmented') },
        ]}
      />

      <div style={styles.checkboxSection}>
        <label style={styles.checkboxLabel} htmlFor="hasOrganizationalChart">
          <input
            type="checkbox"
            name="hasOrganizationalChart"
            id="hasOrganizationalChart"
            checked={formData.hasOrganizationalChart || false}
            onChange={handleChange}
            style={styles.checkbox}
          />
          {t('projects.steps.step9.hasOrganizationalChart')}
        </label>

        <label style={styles.checkboxLabel} htmlFor="hasStandardizedProcedures">
          <input
            type="checkbox"
            name="hasStandardizedProcedures"
            id="hasStandardizedProcedures"
            checked={formData.hasStandardizedProcedures || false}
            onChange={handleChange}
            style={styles.checkbox}
          />
          {t('projects.steps.step9.hasStandardizedProcedures')}
        </label>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.steps.step9.complianceTitle')}</h3>

        <label style={styles.checkboxLabel} htmlFor="requiresRegulatoryCompliance">
          <input
            type="checkbox"
            name="requiresRegulatoryCompliance"
            id="requiresRegulatoryCompliance"
            checked={formData.requiresRegulatoryCompliance || false}
            onChange={handleChange}
            style={styles.checkbox}
          />
          {t('projects.steps.step9.requiresRegulatoryCompliance')}
        </label>

        {formData.requiresRegulatoryCompliance && (
          <>
            <FormTextarea
              label={t('projects.steps.step9.complianceStandards')}
              name="complianceStandards"
              value={
                formData.complianceStandardsText ?? formData.complianceStandards?.join(', ') ?? ''
              }
              onChange={handleComplianceChange}
              placeholder={t('projects.steps.step9.complianceStandardsPlaceholder')}
              rows={2}
            />

            <FormTextarea
              label={t('projects.steps.step9.standardsDocumentation')}
              name="standardsDocumentation"
              value={formData.standardsDocumentation || ''}
              onChange={handleChange}
              placeholder={t('projects.steps.step9.standardsDocumentationPlaceholder')}
              rows={4}
              maxLength={2000}
            />
          </>
        )}
      </div>

      <div style={styles.completionCard}>
        <div style={styles.completionIcon}>
          <CheckCircle size={48} color="#10b981" />
        </div>
        <h3 style={styles.completionTitle}>{t('projects.steps.step9.formComplete')}</h3>
        <p style={styles.completionText}>{t('projects.steps.step9.formCompleteDesc')}</p>
      </div>
    </div>
  );
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 8px 0',
  },
  stepDescription: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    marginBottom: '32px',
  },
  completionCard: {
    marginTop: '40px',
    padding: '32px',
    background: 'linear-gradient(135deg, var(--color-accent-gradient-start) 0%, var(--color-accent-gradient-end) 100%)',
    borderRadius: '16px',
    textAlign: 'center',
    color: 'white',
  },
  completionIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  completionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  completionText: {
    fontSize: '15px',
    lineHeight: '1.6',
    opacity: 0.95,
  },
  section: {
    marginTop: '32px',
    padding: '24px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
  },
  checkboxSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
};

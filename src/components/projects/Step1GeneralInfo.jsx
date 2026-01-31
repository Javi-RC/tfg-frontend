import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea } from './FormComponents';

/**
 * Step 1: General Information
 */
export default function Step1GeneralInfo({ formData, onChange, errors = {} }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step1.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step1.description')}
      </p>

      <FormInput
        label={t('projects.steps.step1.projectName')}
        name="projectName"
        value={formData.projectName || ''}
        onChange={handleChange}
        required
        placeholder={t('projects.steps.step1.projectNamePlaceholder')}
        maxLength={200}
        error={errors.projectName}
      />

      <FormTextarea
        label={t('projects.steps.step1.briefDescription')}
        name="briefDescription"
        value={formData.briefDescription || ''}
        onChange={handleChange}
        required
        placeholder={t('projects.steps.step1.briefDescriptionPlaceholder')}
        rows={5}
        maxLength={2000}
        error={errors.briefDescription}
      />

      <div style={styles.row}>
        <FormInput
          label={t('projects.steps.step1.estimatedStartDate')}
          name="estimatedStartDate"
          type="date"
          value={formData.estimatedStartDate || ''}
          onChange={handleChange}
          required
          error={errors.estimatedStartDate}
        />

        <FormInput
          label={t('projects.steps.step1.estimatedEndDate')}
          name="estimatedEndDate"
          type="date"
          value={formData.estimatedEndDate || ''}
          onChange={handleChange}
          required
          error={errors.estimatedEndDate}
        />
      </div>
      
      {errors.dateRange && (
        <div style={styles.dateRangeError}>
          {errors.dateRange}
        </div>
      )}

      <FormInput
        label={t('projects.steps.step1.teamSize')}
        name="teamSize"
        type="number"
        value={formData.teamSize || 5}
        onChange={handleChange}
        required
        min={1}
        max={100}
        placeholder={t('projects.steps.step1.teamSizePlaceholder')}
        error={errors.teamSize}
      />
      {!errors.teamSize && (
        <p style={styles.helperText}>
          {t('projects.steps.step1.teamSizeHelper')}
        </p>
      )}
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  dateRangeError: {
    color: '#EF4444',
    fontSize: '13px',
    marginTop: '8px',
    fontWeight: '500'
  },
  helperText: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '-16px',
    marginBottom: '16px'
  },
  section: {
    marginBottom: '20px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
    display: 'block'
  },
  required: {
    color: '#EF4444'
  }
};

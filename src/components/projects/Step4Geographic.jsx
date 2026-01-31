import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormTextarea, FormSelect, FormNumber } from './FormComponents';
import { COMMUNICATION_LEVELS, TIME_UNITS, WORK_MODE } from '../../types/projectTypes';

/**
 * Step 4: Geographic Distribution
 */
export default function Step4Geographic({ formData, onChange, errors = {} }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCountriesChange = (e) => {
    const value = e.target.value;
    const countries = value.split(',').map(r => r.trim()).filter(r => r);
    onChange({ involvedCountriesText: value, involvedCountries: countries });
  };

  const handleTimeOverlapChange = (field, value) => {
    onChange({
      expectedTimeOverlap: {
        ...formData.expectedTimeOverlap,
        [field]: value
      }
    });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step4.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step4.description')}
      </p>

      <FormTextarea
        label={t('projects.steps.step4.involvedCountries')}
        name="involvedCountries"
        value={formData.involvedCountriesText ?? formData.involvedCountries?.join(', ') ?? ''}
        onChange={handleCountriesChange}
        placeholder={t('projects.steps.step4.countriesPlaceholder')}
        rows={2}
      />

      <FormSelect
        label={t('projects.steps.step4.workMode')}
        name="workMode"
        value={formData.workMode || WORK_MODE.OFFICE_MODE}
        onChange={handleChange}
        required
        error={errors.workMode}
        options={[
          { value: WORK_MODE.OFFICE_MODE, label: t('projects.workMode.officeMode') },
          { value: WORK_MODE.OFFICE_FIRST, label: t('projects.workMode.officeFirst') },
          { value: WORK_MODE.OFFICE_REMOTE_MIX, label: t('projects.workMode.officeMix') },
          { value: WORK_MODE.REMOTE_FIRST, label: t('projects.workMode.remoteFirst') },
          { value: WORK_MODE.REMOTE_MODE, label: t('projects.workMode.remoteMode') }
        ]}
      />

      <FormSelect
        label={t('projects.steps.step4.distributedWorkExperienceLevel')}
        name="distributedWorkExperienceLevel"
        value={formData.distributedWorkExperienceLevel || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: t('projects.levels.low') },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: t('projects.levels.medium') },
          { value: COMMUNICATION_LEVELS.HIGH, label: t('projects.levels.high') }
        ]}
      />

      <div style={styles.section}>
        <label style={styles.label}>{t('projects.steps.step4.expectedTimeOverlap')}</label>
        <div style={styles.row}>
          <FormNumber
            label=""
            name="timeOverlapValue"
            value={formData.expectedTimeOverlap?.value || 4}
            onChange={(e) => handleTimeOverlapChange('value', parseInt(e.target.value) || 0)}
            min={0}
            max={24}
          />
          <FormSelect
            label=""
            name="timeOverlapUnit"
            value={formData.expectedTimeOverlap?.unit || 'hours'}
            onChange={(e) => handleTimeOverlapChange('unit', e.target.value)}
            options={[
              { value: TIME_UNITS.HOURS, label: t('projects.timeUnits.hours') }
            ]}
          />
        </div>
      </div>

      <FormSelect
        label={t('projects.steps.step4.culturalDiversityLevel')}
        name="culturalDiversityLevel"
        value={formData.culturalDiversityLevel || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: t('projects.levels.low') },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: t('projects.levels.medium') },
          { value: COMMUNICATION_LEVELS.HIGH, label: t('projects.levels.high') }
        ]}
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
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
  }
};

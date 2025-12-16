import React from 'react';
import { FormInput, FormTextarea, FormSelect, FormNumber } from './FormComponents';
import { TIME_UNITS } from '../../types/projectTypes';

/**
 * Step 1: General Information
 */
export default function Step1GeneralInfo({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleDurationChange = (field, value) => {
    onChange({
      expectedDuration: {
        ...formData.expectedDuration,
        [field]: value
      }
    });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>General Information</h2>
      <p style={styles.stepDescription}>
        Provide basic information about your project
      </p>

      <FormInput
        label="Project Name"
        name="projectName"
        value={formData.projectName || ''}
        onChange={handleChange}
        required
        placeholder="Enter project name..."
        maxLength={200}
        error={errors.projectName}
      />

      <FormTextarea
        label="Brief Description"
        name="briefDescription"
        value={formData.briefDescription || ''}
        onChange={handleChange}
        required
        placeholder="Describe your project..."
        rows={5}
        maxLength={2000}
        error={errors.briefDescription}
      />

      <div style={styles.row}>
        <FormInput
          label="Estimated Start Date"
          name="estimatedStartDate"
          type="date"
          value={formData.estimatedStartDate || ''}
          onChange={handleChange}
          required
          error={errors.estimatedStartDate}
        />

        <FormInput
          label="Estimated End Date"
          name="estimatedEndDate"
          type="date"
          value={formData.estimatedEndDate || ''}
          onChange={handleChange}
          required
          error={errors.estimatedEndDate}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>
          Expected Duration <span style={styles.required}>*</span>
        </label>
        <div style={styles.row}>
          <FormNumber
            label=""
            name="durationValue"
            value={formData.expectedDuration?.value || ''}
            onChange={(e) => handleDurationChange('value', parseInt(e.target.value) || 1)}
            min={1}
            required
            error={errors.expectedDuration}
          />

          <FormSelect
            label=""
            name="durationUnit"
            value={formData.expectedDuration?.unit || ''}
            onChange={(e) => handleDurationChange('unit', e.target.value)}
            required
            options={[
              { value: TIME_UNITS.DAYS, label: 'Days' },
              { value: TIME_UNITS.WEEKS, label: 'Weeks' },
              { value: TIME_UNITS.MONTHS, label: 'Months' },
              { value: TIME_UNITS.YEARS, label: 'Years' }
            ]}
            placeholder="Select unit"
          />
        </div>
      </div>
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
  },
  required: {
    color: '#EF4444'
  }
};

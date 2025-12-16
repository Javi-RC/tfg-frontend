import React from 'react';
import { FormTextarea, FormSelect, FormNumber } from './FormComponents';
import { COMMUNICATION_LEVELS, TIME_UNITS } from '../../types/projectTypes';

/**
 * Step 4: Geographic Distribution
 */
export default function Step4Geographic({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleRegionsChange = (e) => {
    const value = e.target.value;
    const regions = value.split(',').map(r => r.trim()).filter(r => r);
    onChange({ teamRegions: regions });
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
      <h2 style={styles.stepTitle}>Geographic Distribution</h2>
      <p style={styles.stepDescription}>
        Define the geographic aspects of your distributed team
      </p>

      <FormTextarea
        label="Team Regions"
        name="teamRegions"
        value={formData.teamRegions?.join(', ') || ''}
        onChange={handleRegionsChange}
        placeholder="Enter regions/countries separated by commas (e.g., USA, Spain, Germany)"
        rows={2}
      />

      <FormSelect
        label="Distributed Work Experience Level"
        name="distributedWorkExperienceLevel"
        value={formData.distributedWorkExperienceLevel || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: 'Low' },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: 'Medium' },
          { value: COMMUNICATION_LEVELS.HIGH, label: 'High' }
        ]}
      />

      <div style={styles.section}>
        <label style={styles.label}>Expected Time Overlap</label>
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
              { value: TIME_UNITS.HOURS, label: 'Hours' }
            ]}
          />
        </div>
      </div>

      <FormSelect
        label="Cultural Diversity Level"
        name="culturalDiversityLevel"
        value={formData.culturalDiversityLevel || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: 'Low' },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: 'Medium' },
          { value: COMMUNICATION_LEVELS.HIGH, label: 'High' }
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

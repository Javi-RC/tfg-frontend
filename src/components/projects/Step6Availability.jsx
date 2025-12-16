import React from 'react';
import { FormNumber, FormSelect, FormInput } from './FormComponents';
import { AFTER_HOURS_OPTIONS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 6: Availability Requirements
 */
export default function Step6Availability({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handlePeriodChange = (index, field, value) => {
    const newPeriods = [...(formData.highLoadPeriods || [])];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    onChange({ highLoadPeriods: newPeriods });
  };

  const addPeriod = () => {
    const newPeriods = [...(formData.highLoadPeriods || []), { description: '', startDate: '', endDate: '' }];
    onChange({ highLoadPeriods: newPeriods });
  };

  const removePeriod = (index) => {
    const newPeriods = formData.highLoadPeriods.filter((_, i) => i !== index);
    onChange({ highLoadPeriods: newPeriods });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Availability Requirements</h2>
      <p style={styles.stepDescription}>
        Define time commitment and availability needs
      </p>

      <FormNumber
        label="Weekly Hours per Member"
        name="weeklyHoursPerMember"
        value={formData.weeklyHoursPerMember || 40}
        onChange={handleChange}
        required
        min={1}
        max={168}
      />

      <FormSelect
        label="Requires After-Hours Availability"
        name="requiresAfterHoursAvailability"
        value={formData.requiresAfterHoursAvailability || 'no'}
        onChange={handleChange}
        options={[
          { value: AFTER_HOURS_OPTIONS.YES, label: 'Yes' },
          { value: AFTER_HOURS_OPTIONS.NO, label: 'No' },
          { value: AFTER_HOURS_OPTIONS.OCCASIONAL, label: 'Occasional' }
        ]}
      />

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>High Load Periods</h3>
          <PrimaryButton onClick={addPeriod}>+ Add Period</PrimaryButton>
        </div>

        {formData.highLoadPeriods && formData.highLoadPeriods.length > 0 ? (
          formData.highLoadPeriods.map((period, index) => (
            <div key={index} style={styles.periodCard}>
              <div style={styles.periodHeader}>
                <span style={styles.periodNumber}>Period {index + 1}</span>
                <button
                  style={styles.removeButton}
                  onClick={() => removePeriod(index)}
                >
                  Remove
                </button>
              </div>

              <FormInput
                label="Description"
                name={`periodDescription-${index}`}
                value={period.description || ''}
                onChange={(e) => handlePeriodChange(index, 'description', e.target.value)}
                placeholder="e.g., Product Launch Sprint"
              />

              <div style={styles.row}>
                <FormInput
                  label="Start Date"
                  name={`periodStart-${index}`}
                  type="date"
                  value={period.startDate || ''}
                  onChange={(e) => handlePeriodChange(index, 'startDate', e.target.value)}
                />

                <FormInput
                  label="End Date"
                  name={`periodEnd-${index}`}
                  type="date"
                  value={period.endDate || ''}
                  onChange={(e) => handlePeriodChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyText}>No high load periods defined.</p>
        )}
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
  section: {
    marginTop: '32px'
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
  periodCard: {
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #E5E7EB'
  },
  periodHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  periodNumber: {
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px'
  }
};

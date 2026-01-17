import React from 'react';
import { FormNumber, FormSelect, FormInput } from './FormComponents';
import { AFTER_HOURS_OPTIONS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 8: Availability Requirements
 * Define time commitment and team availability needs
 */
export default function Step8Availability({ formData, onChange }) {
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

  const weeklyHours = formData.weeklyHoursPerMember || 40;
  const isOvertime = weeklyHours > 40;
  const isPartTime = weeklyHours < 30;

  return (
    <div>
      <h2 style={{...styles.stepTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Clock size={24} />
        Availability Requirements
      </h2>
      <p style={styles.stepDescription}>
        Define time commitment and availability needs for team members
      </p>

      <FormNumber
        label="Weekly Hours per Member"
        name="weeklyHoursPerMember"
        value={weeklyHours}
        onChange={handleChange}
        required
        min={1}
        max={168}
        helperText="Standard full-time is 40 hours per week"
      />

      {isOvertime && (
        <div style={styles.warningBox}>
          <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
          <div>
            <strong>Overtime Detected</strong>
            <p>
              {weeklyHours} hours/week exceeds standard full-time. This may impact team 
              morale and increase burnout risk.
            </p>
          </div>
        </div>
      )}

      {isPartTime && (
        <div style={styles.infoBox}>
          <AlertCircle size={20} color="#004085" style={{ flexShrink: 0 }} />
          <div>
            <strong>Part-Time Commitment</strong>
            <p>
              {weeklyHours} hours/week is part-time. Ensure project timeline accounts 
              for reduced availability.
            </p>
          </div>
        </div>
      )}

      <FormSelect
        label="Requires After-Hours Availability"
        name="requiresAfterHoursAvailability"
        value={formData.requiresAfterHoursAvailability || 'no'}
        onChange={handleChange}
        options={[
          { value: AFTER_HOURS_OPTIONS.NO, label: 'No - Standard hours only' },
          { value: AFTER_HOURS_OPTIONS.OCCASIONAL, label: 'Occasional - For emergencies' },
          { value: AFTER_HOURS_OPTIONS.YES, label: 'Yes - Regular after-hours work' }
        ]}
        helperText="After-hours availability can increase stress and reduce work-life balance"
      />

      {formData.requiresAfterHoursAvailability === 'yes' && (
        <div style={styles.alertBox}>
          <AlertCircle size={20} color="#721c24" style={{ flexShrink: 0 }} />
          <div>
            <strong>High Risk: After-Hours Requirements</strong>
            <p>
              Regular after-hours work significantly increases team burnout risk and may 
              reduce productivity. Consider restructuring work to fit within standard hours.
            </p>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>High Load Periods</h3>
            <p style={styles.sectionSubtitle}>
              Define periods requiring extra effort or extended hours
            </p>
          </div>
          <PrimaryButton onClick={addPeriod}>+ Add Period</PrimaryButton>
        </div>

        {formData.highLoadPeriods && formData.highLoadPeriods.length > 0 ? (
          <>
            {formData.highLoadPeriods.map((period, index) => (
              <div key={index} style={styles.periodCard}>
                <div style={styles.periodHeader}>
                  <span style={{ ...styles.periodNumber, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={16} />
                    Period {index + 1}
                  </span>
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
                  placeholder="e.g., Product Launch Sprint, Year-End Release"
                  required
                />

                <div style={styles.row}>
                  <FormInput
                    label="Start Date"
                    name={`periodStart-${index}`}
                    type="date"
                    value={period.startDate || ''}
                    onChange={(e) => handlePeriodChange(index, 'startDate', e.target.value)}
                    required
                  />

                  <FormInput
                    label="End Date"
                    name={`periodEnd-${index}`}
                    type="date"
                    value={period.endDate || ''}
                    onChange={(e) => handlePeriodChange(index, 'endDate', e.target.value)}
                    required
                  />
                </div>

                {period.startDate && period.endDate && (
                  <div style={styles.periodDuration}>
                    Duration: {calculateDays(period.startDate, period.endDate)} days
                  </div>
                )}
              </div>
            ))}

            {formData.highLoadPeriods.length > 2 && (
              <div style={styles.warningBox}>
                <span style={styles.warningIcon}><AlertTriangle size={20} color="#f59e0b" /></span>
                <div>
                  <strong>Multiple High-Load Periods</strong>
                  <p>
                    {formData.highLoadPeriods.length} high-load periods detected. Ensure adequate 
                    recovery time between periods to prevent team burnout.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📅</span>
            <p style={styles.emptyText}>No high-load periods defined</p>
            <p style={styles.emptySubtext}>
              Add periods where the team needs to work extra hours or with higher intensity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate days between dates
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '8px'
  },
  stepDescription: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '32px'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#DBEAFE',
    border: '1px solid #3B82F6',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  infoIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #F59E0B',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  warningIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  alertBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEE2E2',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  alertIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  section: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    margin: '0 0 4px 0'
  },
  sectionSubtitle: {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0
  },
  periodCard: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px'
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
    color: '#374151'
  },
  periodDuration: {
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#F3F4F6',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center'
  },
  removeButton: {
    padding: '6px 12px',
    fontSize: '13px',
    color: '#EF4444',
    backgroundColor: 'white',
    border: '1px solid #EF4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px dashed #D1D5DB'
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#374151',
    fontWeight: '500',
    margin: '0 0 8px 0'
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0
  }
};

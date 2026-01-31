import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { WORK_MODEL_TYPES } from '../../types/projectTypes';

/**
 * Step 4: Work Model & Remote Configuration
 * NEW CRITICAL STEP - Handles remote work and timezone management
 */
export default function Step4WorkModel({ formData, onChange, errors }) {
  const handleWorkModeChange = (mode) => {
    onChange({ workMode: mode });
  };

  const handleCountriesChange = (countries) => {
    const countriesArray = countries.split(',').map(r => r.trim()).filter(r => r.length > 0);
    onChange({ involvedCountriesText: countries, involvedCountries: countriesArray });
  };

  const handleCoreHoursChange = (field, value) => {
    onChange({
      coreHours: {
        ...formData.coreHours,
        [field]: value
      }
    });
  };

  const showTimezoneWarning = formData.workMode === 'remote_mode' && 
                               (!formData.coreHours?.start || !formData.coreHours?.end);
  
  const showOverlapWarning = (formData.involvedCountries?.length || 0) > 2 && 
                              (formData.expectedTimeOverlap?.value || 0) < 4;

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Work Model & Remote Configuration</h2>
      <p style={styles.description}>
        Configure how the team will work together, especially for distributed teams
      </p>

      {/* Work Mode Type */}
      <div style={styles.formGroup}>
        <label style={styles.label} id="workMode-label">
          Work Mode <span style={styles.required}>*</span>
        </label>
        <div style={styles.radioGroup} role="radiogroup" aria-labelledby="workMode-label">
          <label style={styles.radioLabel} htmlFor="workMode-inherit">
            <input
              type="radio"
              name="workMode"
              value="inherit_from_organization"
              id="workMode-inherit"
              checked={formData.workMode === 'inherit_from_organization'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Inherit from Organization
          </label>
          <label style={styles.radioLabel} htmlFor="workMode-office">
            <input
              type="radio"
              name="workMode"
              value="office_mode"
              id="workMode-office"
              checked={formData.workMode === 'office_mode'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Office Mode
          </label>
          <label style={styles.radioLabel} htmlFor="workMode-office-first">
            <input
              type="radio"
              name="workMode"
              value="office_first"
              id="workMode-office-first"
              checked={formData.workMode === 'office_first'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Office First
          </label>
          <label style={styles.radioLabel} htmlFor="workMode-office-remote-mix">
            <input
              type="radio"
              name="workMode"
              value="office_remote_mix"
              id="workMode-office-remote-mix"
              checked={formData.workMode === 'office_remote_mix'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Office/Remote Mix
          </label>
          <label style={styles.radioLabel} htmlFor="workMode-remote-first">
            <input
              type="radio"
              name="workMode"
              value="remote_first"
              id="workMode-remote-first"
              checked={formData.workMode === 'remote_first'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Remote First
          </label>
          <label style={styles.radioLabel} htmlFor="workMode-remote-mode">
            <input
              type="radio"
              name="workMode"
              value="remote_mode"
              id="workMode-remote-mode"
              checked={formData.workMode === 'remote_mode'}
              onChange={(e) => handleWorkModeChange(e.target.value)}
              style={styles.radio}
            />
            Remote Mode
          </label>
        </div>
        {errors?.workMode && <span style={styles.error}>{errors.workMode}</span>}
      </div>

      {/* Work Mode Details */}
      {formData.workMode && formData.workMode !== 'inherit_from_organization' && (
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="workModeDetails">Work Mode Details</label>
          <textarea
            id="workModeDetails"
            value={formData.workModeDetails || ''}
            onChange={(e) => onChange({ workModeDetails: e.target.value })}
            placeholder="Describe the work mode specifics (e.g., required office days, flexibility policies)..."
            maxLength="500"
            rows="3"
            style={styles.textarea}
            aria-label="Work mode details"
          />
          <small style={styles.helpText}>
            {(formData.workModeDetails || '').length}/500 characters
          </small>
        </div>
      )}

      {/* Warning for Remote Work */}
      {showTimezoneWarning && (
        <div style={styles.warningBox}>
          <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
          <div>
            <strong>Warning: No Timezone Scheduling Policy</strong>
            <p>Remote projects without timezone management may face coordination challenges.</p>
          </div>
        </div>
      )}

      {/* Involved Countries */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="involvedCountries">
          Involved Countries
          <span style={styles.hint}> (comma-separated, e.g., "USA, Spain, India")</span>
        </label>
        <input
          type="text"
          id="involvedCountries"
          value={formData.involvedCountriesText ?? (formData.involvedCountries || []).join(', ')}
          onChange={(e) => handleCountriesChange(e.target.value)}
          placeholder="e.g., United States, Spain, India"
          style={styles.input}
          aria-label="Involved countries"
        />
        <small style={styles.helpText}>
          Current countries: {formData.involvedCountries?.length || 0}
        </small>
      </div>

      {/* Geographic Distribution Options */}
      {(formData.involvedCountries?.length || 0) > 0 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="distributedWorkExperienceLevel">Distributed Work Experience Level</label>
            <select
              id="distributedWorkExperienceLevel"
              value={formData.distributedWorkExperienceLevel || 'medium'}
              onChange={(e) => onChange({ distributedWorkExperienceLevel: e.target.value })}
              style={styles.select}
              aria-label="Distributed work experience level"
            >
              <option value="low">Low - Little remote experience</option>
              <option value="medium">Medium - Some remote experience</option>
              <option value="high">High - Extensive remote experience</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="expectedTimeOverlap">Expected Time Overlap (hours per day)</label>
            <div style={styles.durationContainer}>
              <input
                type="number"
                id="expectedTimeOverlap"
                min="0"
                max="24"
                value={formData.expectedTimeOverlap?.value || 4}
                onChange={(e) => onChange({
                  expectedTimeOverlap: {
                    value: parseInt(e.target.value) || 0,
                    unit: 'hours'
                  }
                })}
                style={styles.numberInput}
                aria-label="Expected time overlap"
              />
              <span style={styles.unit}>hours</span>
            </div>
            {showOverlapWarning && (
              <div style={{ ...styles.warningInline, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                Low time overlap with {formData.involvedCountries.length} countries may cause delays
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="culturalDiversityLevel">Cultural Diversity Level</label>
            <select
              id="culturalDiversityLevel"
              value={formData.culturalDiversityLevel || 'medium'}
              onChange={(e) => onChange({ culturalDiversityLevel: e.target.value })}
              style={styles.select}
              aria-label="Cultural diversity level"
            >
              <option value="low">Low - Similar cultures</option>
              <option value="medium">Medium - Some diversity</option>
              <option value="high">High - Very diverse team</option>
            </select>
          </div>
        </>
      )}

      {/* Timezone Management */}
      {(formData.involvedCountries?.length || 0) > 1 && (
        <>
          <div style={styles.subSection}>
            <h4 style={styles.subSectionTitle}>Core Hours Configuration</h4>
            <p style={styles.helpText}>Define overlapping working hours for all team members</p>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="coreHoursStart">Start Time</label>
                <input
                  type="time"
                    id="coreHoursStart"
                  value={formData.coreHours?.start || ''}
                  onChange={(e) => handleCoreHoursChange('start', e.target.value)}
                  style={styles.input}
                  placeholder="09:00"
                    aria-label="Core hours start time"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="coreHoursEnd">End Time</label>
                <input
                  type="time"
                  id="coreHoursEnd"
                  value={formData.coreHours?.end || ''}
                  onChange={(e) => handleCoreHoursChange('end', e.target.value)}
                  style={styles.input}
                  placeholder="17:00"
                  aria-label="Core hours end time"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="coreHoursTimezone">Timezone</label>
                <input
                  type="text"
                  id="coreHoursTimezone"
                  value={formData.coreHours?.timezone || ''}
                  onChange={(e) => handleCoreHoursChange('timezone', e.target.value)}
                  placeholder="e.g., UTC, America/New_York"
                  style={styles.input}
                  aria-label="Core hours timezone"
                />
              </div>
            </div>
          </div>

          {(formData.involvedCountries?.length || 0) > 2 && (
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel} htmlFor="meetingRotationPolicy">
                <input
                  type="checkbox"
                  id="meetingRotationPolicy"
                  checked={formData.meetingRotationPolicy || false}
                  onChange={(e) => onChange({ meetingRotationPolicy: e.target.checked })}
                  style={styles.checkbox}
                />
                Has Meeting Rotation Policy
              </label>
              <small style={styles.helpText}>
                Rotates meeting times to be fair to all timezones
              </small>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="timezoneConsiderations">Timezone Considerations</label>
            <textarea
              id="timezoneConsiderations"
              value={formData.timezoneConsiderations || ''}
              onChange={(e) => onChange({ timezoneConsiderations: e.target.value })}
              placeholder="Describe how you'll manage different timezones (max 1000 chars)..."
              maxLength="1000"
              rows="4"
              style={styles.textarea}
              aria-label="Timezone considerations"
            />
            <small style={styles.helpText}>
              {(formData.timezoneConsiderations || '').length}/1000 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="asyncCommunicationStrategy">Async Communication Strategy</label>
            <textarea
              id="asyncCommunicationStrategy"
              value={formData.asyncCommunicationStrategy || ''}
              onChange={(e) => onChange({ asyncCommunicationStrategy: e.target.value })}
              placeholder="Describe your asynchronous communication approach for distributed teams (max 1000 chars)..."
              maxLength="1000"
              rows="4"
              style={styles.textarea}
              aria-label="Async communication strategy"
            />
            <small style={styles.helpText}>
              {(formData.asyncCommunicationStrategy || '').length}/1000 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel} htmlFor="requiresOffHoursReporting">
              <input
                type="checkbox"
                id="requiresOffHoursReporting"
                checked={formData.requiresOffHoursReporting || false}
                onChange={(e) => onChange({ requiresOffHoursReporting: e.target.checked })}
                style={styles.checkbox}
              />
              Requires Off-Hours Reporting/Updates
            </label>
            <small style={styles.helpText}>
              Team members may need to provide updates outside their working hours
            </small>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#111827'
  },
  description: {
    color: '#6B7280',
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#374151'
  },
  required: {
    color: '#EF4444'
  },
  hint: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: 400
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  radioGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer'
  },
  radio: {
    marginRight: '6px',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer'
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  slider: {
    flex: 1,
    height: '6px',
    cursor: 'pointer'
  },
  sliderValue: {
    fontSize: '16px',
    fontWeight: 600,
    minWidth: '50px',
    textAlign: 'right'
  },
  durationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  numberInput: {
    width: '100px',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none'
  },
  unit: {
    fontSize: '14px',
    color: '#6B7280'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  subSection: {
    backgroundColor: '#F9FAFB',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '12px'
  },
  subSectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#111827'
  },
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FCD34D',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  warningIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  warningInline: {
    fontSize: '13px',
    color: '#D97706',
    marginTop: '4px',
    fontStyle: 'italic'
  },
  helpText: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'block',
    marginTop: '4px'
  },
  error: {
    fontSize: '13px',
    color: '#EF4444',
    display: 'block',
    marginTop: '4px'
  }
};

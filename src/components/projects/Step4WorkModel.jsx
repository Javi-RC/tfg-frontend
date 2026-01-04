import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { WORK_MODEL_TYPES } from '../../types/projectTypes';

/**
 * Step 4: Work Model & Remote Configuration
 * NEW CRITICAL STEP - Handles remote work and timezone management
 */
export default function Step4WorkModel({ formData, onChange, errors }) {
  const handleWorkModelChange = (type) => {
    onChange({
      workModel: {
        ...formData.workModel,
        type,
        remotePercentage: type === 'on-site' ? 0 : (formData.workModel?.remotePercentage || 100)
      }
    });
  };

  const handleRemotePercentageChange = (value) => {
    onChange({
      workModel: {
        ...formData.workModel,
        remotePercentage: parseInt(value) || 0
      }
    });
  };

  const handleTeamRegionsChange = (regions) => {
    const regionsArray = regions.split(',').map(r => r.trim()).filter(r => r.length > 0);
    onChange({ teamRegions: regionsArray });
  };

  const handleTimezoneToggle = (checked) => {
    onChange({
      hasTimezoneSchedulingPolicy: checked,
      ...(checked ? {} : { coreHours: undefined })
    });
  };

  const handleCoreHoursChange = (field, value) => {
    onChange({
      coreHours: {
        ...formData.coreHours,
        [field]: value
      }
    });
  };

  const showTimezoneWarning = formData.workModel?.type === 'remote' && 
                               !formData.hasTimezoneSchedulingPolicy;
  
  const showOverlapWarning = (formData.teamRegions?.length || 0) > 2 && 
                              (formData.expectedTimeOverlap?.value || 0) < 4;

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Work Model & Remote Configuration</h2>
      <p style={styles.description}>
        Configure how the team will work together, especially for distributed teams
      </p>

      {/* Work Model Type */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Work Model Type <span style={styles.required}>*</span>
        </label>
        <div style={styles.radioGroup}>
          {Object.entries(WORK_MODEL_TYPES).map(([key, value]) => (
            <label key={value} style={styles.radioLabel}>
              <input
                type="radio"
                name="workModelType"
                value={value}
                checked={formData.workModel?.type === value}
                onChange={(e) => handleWorkModelChange(e.target.value)}
                style={styles.radio}
              />
              {value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
            </label>
          ))}
        </div>
        {errors?.workModel && <span style={styles.error}>{errors.workModel}</span>}
      </div>

      {/* Remote Percentage */}
      {formData.workModel?.type !== 'on-site' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Remote Work Percentage <span style={styles.required}>*</span>
          </label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.workModel?.remotePercentage || 0}
              onChange={(e) => handleRemotePercentageChange(e.target.value)}
              style={styles.slider}
            />
            <span style={styles.sliderValue}>{formData.workModel?.remotePercentage || 0}%</span>
          </div>
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

      {/* Team Regions */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Team Regions/Locations
          <span style={styles.hint}> (comma-separated, e.g., "USA, Europe, Asia")</span>
        </label>
        <input
          type="text"
          value={(formData.teamRegions || []).join(', ')}
          onChange={(e) => handleTeamRegionsChange(e.target.value)}
          placeholder="e.g., North America, Europe, Asia"
          style={styles.input}
        />
        <small style={styles.helpText}>
          Current regions: {formData.teamRegions?.length || 0}
        </small>
      </div>

      {/* Geographic Distribution Options */}
      {(formData.teamRegions?.length || 0) > 0 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Distributed Work Experience Level</label>
            <select
              value={formData.distributedWorkExperienceLevel || 'medium'}
              onChange={(e) => onChange({ distributedWorkExperienceLevel: e.target.value })}
              style={styles.select}
            >
              <option value="low">Low - Little remote experience</option>
              <option value="medium">Medium - Some remote experience</option>
              <option value="high">High - Extensive remote experience</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Expected Time Overlap (hours per day)</label>
            <div style={styles.durationContainer}>
              <input
                type="number"
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
              />
              <span style={styles.unit}>hours</span>
            </div>
            {showOverlapWarning && (
              <div style={{ ...styles.warningInline, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                Low time overlap with {formData.teamRegions.length} regions may cause delays
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cultural Diversity Level</label>
            <select
              value={formData.culturalDiversityLevel || 'medium'}
              onChange={(e) => onChange({ culturalDiversityLevel: e.target.value })}
              style={styles.select}
            >
              <option value="low">Low - Similar cultures</option>
              <option value="medium">Medium - Some diversity</option>
              <option value="high">High - Very diverse team</option>
            </select>
          </div>
        </>
      )}

      {/* Timezone Management */}
      {(formData.teamRegions?.length || 0) > 1 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.hasTimezoneSchedulingPolicy || false}
                onChange={(e) => handleTimezoneToggle(e.target.checked)}
                style={styles.checkbox}
              />
              Has Timezone Scheduling Policy
            </label>
            <small style={styles.helpText}>
              Defines core hours and meeting rotation for distributed teams
            </small>
          </div>

          {formData.hasTimezoneSchedulingPolicy && (
            <div style={styles.subSection}>
              <h4 style={styles.subSectionTitle}>Core Hours Configuration</h4>
              
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input
                    type="time"
                    value={formData.coreHours?.start || '09:00'}
                    onChange={(e) => handleCoreHoursChange('start', e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time</label>
                  <input
                    type="time"
                    value={formData.coreHours?.end || '17:00'}
                    onChange={(e) => handleCoreHoursChange('end', e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Timezone</label>
                  <input
                    type="text"
                    value={formData.coreHours?.timezone || 'UTC'}
                    onChange={(e) => handleCoreHoursChange('timezone', e.target.value)}
                    placeholder="e.g., UTC, America/New_York"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {(formData.teamRegions?.length || 0) > 2 && (
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
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
            <label style={styles.label}>Timezone Considerations</label>
            <textarea
              value={formData.timezoneConsiderations || ''}
              onChange={(e) => onChange({ timezoneConsiderations: e.target.value })}
              placeholder="Describe how you'll manage different timezones (max 1000 chars)..."
              maxLength="1000"
              rows="4"
              style={styles.textarea}
            />
            <small style={styles.helpText}>
              {(formData.timezoneConsiderations || '').length}/1000 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
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

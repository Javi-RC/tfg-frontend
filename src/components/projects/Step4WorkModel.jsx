import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { WORK_MODEL_TYPES } from '../../types/projectTypes';

/**
 * Step 4: Work Model & Remote Configuration
 * NEW CRITICAL STEP - Handles remote work and timezone management
 */
export default function Step4WorkModel({ formData, onChange, errors }) {
  const { t } = useTranslation();

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
      <h2 style={styles.sectionTitle}>{t('projects.steps.step4.workModelTitle')}</h2>
      <p style={styles.description}>
        {t('projects.steps.step4.workModelDescription')}
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
            {t('projects.steps.step4.inherit')}
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
            {t('projects.steps.step4.office')}
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
            {t('projects.steps.step4.officeFirst')}
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
            {t('projects.steps.step4.hybrid')}
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
            {t('projects.steps.step4.remoteFirst')}
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
            {t('projects.steps.step4.remote')}
          </label>
        </div>
        {errors?.workMode && <span style={styles.error}>{errors.workMode}</span>}
      </div>

      {/* Work Mode Details */}
      {formData.workMode && formData.workMode !== 'inherit_from_organization' && (
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="workModeDetails">{t('projects.steps.step4.workModeDetails')}</label>
          <textarea
            id="workModeDetails"
            value={formData.workModeDetails || ''}
            onChange={(e) => onChange({ workModeDetails: e.target.value })}
            placeholder={t('projects.steps.step4.workModeDetailsPlaceholder')}
            maxLength="500"
            rows="3"
            style={styles.textarea}
            aria-label={t('projects.steps.step4.workModeDetailsAria')}
          />
          <small style={styles.helpText}>
            {t('projects.steps.step4.charCount', { current: (formData.workModeDetails || '').length, max: 500 })}
          </small>
        </div>
      )}

      {/* Warning for Remote Work */}
      {showTimezoneWarning && (
        <div style={styles.warningBox}>
          <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
          <div>
            <strong>{t('projects.steps.step4.noTimezoneWarning')}</strong>
            <p>{t('projects.steps.step4.noTimezoneWarningDesc')}</p>
          </div>
        </div>
      )}

      {/* Involved Countries */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="involvedCountries">
          {t('projects.steps.step4.involvedCountries')}
          <span style={styles.hint}> {t('projects.steps.step4.countriesHint')}</span>
        </label>
        <input
          type="text"
          id="involvedCountries"
          value={formData.involvedCountriesText ?? (formData.involvedCountries || []).join(', ')}
          onChange={(e) => handleCountriesChange(e.target.value)}
          placeholder={t('projects.steps.step4.countriesPlaceholder')}
          style={styles.input}
          aria-label={t('projects.steps.step4.involvedCountriesAria')}
        />
        <small style={styles.helpText}>
          {t('projects.steps.step4.currentCountries', { countries: formData.involvedCountries?.length || 0 })}
        </small>
      </div>

      {/* Geographic Distribution Options */}
      {(formData.involvedCountries?.length || 0) > 0 && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="distributedWorkExperienceLevel">{t('projects.steps.step4.distributedExperience')}</label>
            <select
              id="distributedWorkExperienceLevel"
              value={formData.distributedWorkExperienceLevel || 'medium'}
              onChange={(e) => onChange({ distributedWorkExperienceLevel: e.target.value })}
              style={styles.select}
              aria-label={t('projects.steps.step4.distributedExperienceAria')}
            >
              <option value="low">{t('projects.steps.step4.distributedExpLow')}</option>
              <option value="medium">{t('projects.steps.step4.distributedExpMedium')}</option>
              <option value="high">{t('projects.steps.step4.distributedExpHigh')}</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="expectedTimeOverlap">{t('projects.steps.step4.timeOverlap')}</label>
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
                aria-label={t('projects.steps.step4.timeOverlapAria')}
              />
              <span style={styles.unit}>{t('projects.steps.step4.hours')}</span>
            </div>
            {showOverlapWarning && (
              <div style={{ ...styles.warningInline, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                {t('projects.steps.step4.lowOverlapWarning', { count: formData.involvedCountries.length })}
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="culturalDiversityLevel">{t('projects.steps.step4.culturalDiversity')}</label>
            <select
              id="culturalDiversityLevel"
              value={formData.culturalDiversityLevel || 'medium'}
              onChange={(e) => onChange({ culturalDiversityLevel: e.target.value })}
              style={styles.select}
              aria-label={t('projects.steps.step4.culturalDiversityAria')}
            >
              <option value="low">{t('projects.steps.step4.culturalDivLow')}</option>
              <option value="medium">{t('projects.steps.step4.culturalDivMedium')}</option>
              <option value="high">{t('projects.steps.step4.culturalDivHigh')}</option>
            </select>
          </div>
        </>
      )}

      {/* Timezone Management */}
      {(formData.involvedCountries?.length || 0) > 1 && (
        <>
          <div style={styles.subSection}>
            <h4 style={styles.subSectionTitle}>{t('projects.steps.step4.coreHoursTitle')}</h4>
            <p style={styles.helpText}>{t('projects.steps.step4.coreHoursDescription')}</p>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="coreHoursStart">{t('projects.steps.step4.startTime')}</label>
                <input
                  type="time"
                    id="coreHoursStart"
                  value={formData.coreHours?.start || ''}
                  onChange={(e) => handleCoreHoursChange('start', e.target.value)}
                  style={styles.input}
                  placeholder="09:00"
                    aria-label={t('projects.steps.step4.coreHoursStartAria')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="coreHoursEnd">{t('projects.steps.step4.endTime')}</label>
                <input
                  type="time"
                  id="coreHoursEnd"
                  value={formData.coreHours?.end || ''}
                  onChange={(e) => handleCoreHoursChange('end', e.target.value)}
                  style={styles.input}
                  placeholder="17:00"
                  aria-label={t('projects.steps.step4.coreHoursEndAria')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="coreHoursTimezone">{t('projects.steps.step4.timezone')}</label>
                <input
                  type="text"
                  id="coreHoursTimezone"
                  value={formData.coreHours?.timezone || ''}
                  onChange={(e) => handleCoreHoursChange('timezone', e.target.value)}
                  placeholder={t('projects.steps.step4.timezonePlaceholder')}
                  style={styles.input}
                  aria-label={t('projects.steps.step4.coreHoursTimezoneAria')}
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
                {t('projects.steps.step4.meetingRotation')}
              </label>
              <small style={styles.helpText}>
                {t('projects.steps.step4.meetingRotationDesc')}
              </small>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="timezoneConsiderations">{t('projects.steps.step4.timezoneConsiderations')}</label>
            <textarea
              id="timezoneConsiderations"
              value={formData.timezoneConsiderations || ''}
              onChange={(e) => onChange({ timezoneConsiderations: e.target.value })}
              placeholder={t('projects.steps.step4.timezoneConsiderationsPlaceholder')}
              maxLength="1000"
              rows="4"
              style={styles.textarea}
              aria-label={t('projects.steps.step4.timezoneConsiderationsAria')}
            />
            <small style={styles.helpText}>
              {t('projects.steps.step4.charCount', { current: (formData.timezoneConsiderations || '').length, max: 1000 })}
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="asyncCommunicationStrategy">{t('projects.steps.step4.asyncStrategy')}</label>
            <textarea
              id="asyncCommunicationStrategy"
              value={formData.asyncCommunicationStrategy || ''}
              onChange={(e) => onChange({ asyncCommunicationStrategy: e.target.value })}
              placeholder={t('projects.steps.step4.asyncStrategyPlaceholder')}
              maxLength="1000"
              rows="4"
              style={styles.textarea}
              aria-label={t('projects.steps.step4.asyncStrategyAria')}
            />
            <small style={styles.helpText}>
              {t('projects.steps.step4.charCount', { current: (formData.asyncCommunicationStrategy || '').length, max: 1000 })}
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
              {t('projects.steps.step4.offHoursReporting')}
            </label>
            <small style={styles.helpText}>
              {t('projects.steps.step4.offHoursReportingDesc')}
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormTextarea, FormSelect, FormCheckbox } from './FormComponents';
import { 
  EXPERIENCE_LEVELS,
  COMPLEXITY_LEVELS,
  DOCUMENTATION_LEVELS
} from '../../types/projectTypes';

/**
 * Step 3: Technical Requirements
 */
export default function Step3Technical({ formData, onChange, errors = {} }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleTechnologiesChange = (e) => {
    const value = e.target.value;
    const technologies = value.split(',').map(t => t.trim()).filter(t => t);
    onChange({ mainTechnologiesText: value, mainTechnologies: technologies });
  };

  const handleSpecializedToolsChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'specializedToolsNeeded') {
      onChange({
        requiresSpecializedTools: {
          ...formData.requiresSpecializedTools,
          needed: checked
        }
      });
    } else {
      onChange({
        requiresSpecializedTools: {
          ...formData.requiresSpecializedTools,
          description: value
        }
      });
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step3.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step3.description')}
      </p>

      <FormTextarea
        label={t('projects.steps.step3.mainTechnologies')}
        name="mainTechnologies"
        value={formData.mainTechnologiesText ?? formData.mainTechnologies?.join(', ') ?? ''}
        onChange={handleTechnologiesChange}
        placeholder={t('projects.steps.step3.technologiesPlaceholder')}
        rows={3}
        error={errors.mainTechnologies}
      />

      <FormSelect
        label={t('projects.steps.step3.requiredExperienceLevel')}
        name="requiredExperienceLevel"
        value={formData.requiredExperienceLevel || 'mid'}
        onChange={handleChange}
        required
        error={errors.requiredExperienceLevel}
        options={[
          { value: EXPERIENCE_LEVELS.JUNIOR, label: t('projects.levels.junior') },
          { value: EXPERIENCE_LEVELS.MID, label: t('projects.levels.mid') },
          { value: EXPERIENCE_LEVELS.SENIOR, label: t('projects.levels.senior') },
          { value: EXPERIENCE_LEVELS.EXPERT, label: t('projects.levels.expert') }
        ]}
      />

      <div style={styles.sliderSection}>
        <label style={styles.sliderLabel} htmlFor="requiredAutonomyLevel">
          {t('projects.steps.step3.requiredAutonomyLevel')}: {formData.requiredAutonomyLevel || 3}
        </label>
        <input
          type="range"
          id="requiredAutonomyLevel"
          min="1"
          max="5"
          value={formData.requiredAutonomyLevel || 3}
          onChange={(e) => onChange({ requiredAutonomyLevel: parseInt(e.target.value) })}
          style={styles.slider}
          aria-label={t('projects.steps.step3.requiredAutonomyLevel')}
        />
        <div style={styles.sliderLabels}>
          <span>1 - {t('projects.steps.step3.lowAutonomy')}</span>
          <span>5 - {t('projects.steps.step3.highAutonomy')}</span>
        </div>
      </div>

      <div style={styles.sliderSection}>
        <label style={styles.sliderLabel} htmlFor="requiredScheduleFlexibility">
          {t('projects.steps.step3.requiredScheduleFlexibility')}: {formData.requiredScheduleFlexibility || 3}
        </label>
        <input
          type="range"
          id="requiredScheduleFlexibility"
          min="1"
          max="5"
          value={formData.requiredScheduleFlexibility || 3}
          onChange={(e) => onChange({ requiredScheduleFlexibility: parseInt(e.target.value) })}
          style={styles.slider}
          aria-label={t('projects.steps.step3.requiredScheduleFlexibility')}
        />
        <div style={styles.sliderLabels}>
          <span>1 - {t('projects.steps.step3.lowFlexibility')}</span>
          <span>5 - {t('projects.steps.step3.highFlexibility')}</span>
        </div>
      </div>

      <div style={styles.sliderSection}>
        <label style={styles.sliderLabel} htmlFor="requiredTravelAvailability">
          {t('projects.steps.step3.requiredTravelAvailability')}: {formData.requiredTravelAvailability || 3}
        </label>
        <input
          type="range"
          id="requiredTravelAvailability"
          min="1"
          max="5"
          value={formData.requiredTravelAvailability || 3}
          onChange={(e) => onChange({ requiredTravelAvailability: parseInt(e.target.value) })}
          style={styles.slider}
          aria-label={t('projects.steps.step3.requiredTravelAvailability')}
        />
        <div style={styles.sliderLabels}>
          <span>1 - {t('projects.steps.step3.noTravel')}</span>
          <span>5 - {t('projects.steps.step3.frequentTravel')}</span>
        </div>
      </div>

      <FormTextarea
        label={t('projects.steps.step3.sharedInfrastructureDependency')}
        name="sharedInfrastructureDependency"
        value={formData.sharedInfrastructureDependency || ''}
        onChange={handleChange}
        placeholder={t('projects.steps.step3.infrastructurePlaceholder')}
        rows={3}
        maxLength={500}
      />

      <div style={styles.section}>
        <FormCheckbox
          label={t('projects.steps.step3.requiresSpecializedTools')}
          name="specializedToolsNeeded"
          checked={formData.requiresSpecializedTools?.needed || false}
          onChange={handleSpecializedToolsChange}
        />

        {formData.requiresSpecializedTools?.needed && (
          <FormTextarea
            label={t('projects.steps.step3.describeSpecializedTools')}
            name="specializedToolsDescription"
            value={formData.requiresSpecializedTools?.description || ''}
            onChange={handleSpecializedToolsChange}
            placeholder={t('projects.steps.step3.specializedToolsPlaceholder')}
            rows={3}
            maxLength={500}
          />
        )}
      </div>

      <FormSelect
        label={t('projects.steps.step3.documentationLevel')}
        name="documentationLevel"
        value={formData.documentationLevel || 'partial'}
        onChange={handleChange}
        required
        options={[
          { value: DOCUMENTATION_LEVELS.COMPLETE, label: t('projects.steps.step3.complete') },
          { value: DOCUMENTATION_LEVELS.PARTIAL, label: t('projects.steps.step3.partial') },
          { value: DOCUMENTATION_LEVELS.MINIMAL, label: t('projects.steps.step3.minimal') },
          { value: DOCUMENTATION_LEVELS.NONE, label: t('projects.steps.step3.none') }
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
  section: {
    marginBottom: '20px'
  },
  sliderSection: {
    marginBottom: '24px'
  },
  sliderLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
    display: 'block'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9CA3AF',
    marginTop: '4px'
  }
};

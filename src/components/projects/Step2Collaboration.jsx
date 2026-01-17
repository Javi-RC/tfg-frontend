import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea, FormSelect, FormNumber } from './FormComponents';
import { 
  SYNCHRONOUS_COMMUNICATION, 
  COMMUNICATION_LEVELS,
  LANGUAGE_PROFICIENCY,
  TIME_UNITS
} from '../../types/projectTypes';

/**
 * Step 2: Collaboration Requirements
 */
export default function Step2Collaboration({ formData, onChange }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleMeetingDurationChange = (field, value) => {
    onChange({
      averageMeetingDuration: {
        ...formData.averageMeetingDuration,
        [field]: value
      }
    });
  };

  const handleLanguagesChange = (e) => {
    const value = e.target.value;
    const languages = value.split(',').map(l => l.trim()).filter(l => l);
    onChange({ requiredLanguagesText: value, requiredLanguages: languages });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step2.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step2.description')}
      </p>

      <FormSelect
        label={t('projects.steps.step2.requiresSynchronousCommunication')}
        name="requiresSynchronousCommunication"
        value={formData.requiresSynchronousCommunication || 'yes'}
        onChange={handleChange}
        required
        options={[
          { value: SYNCHRONOUS_COMMUNICATION.YES, label: t('projects.yesNoPartial.yes') },
          { value: SYNCHRONOUS_COMMUNICATION.NO, label: t('projects.yesNoPartial.no') },
          { value: SYNCHRONOUS_COMMUNICATION.ONLY_CRITICAL, label: t('projects.steps.step2.onlyCritical') }
        ]}
      />

      <FormSelect
        label={t('projects.steps.step2.realTimeCommunicationLevel')}
        name="realTimeCommunicationLevel"
        value={formData.realTimeCommunicationLevel || 'medium'}
        onChange={handleChange}
        required
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: t('projects.levels.low') },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: t('projects.levels.medium') },
          { value: COMMUNICATION_LEVELS.HIGH, label: t('projects.levels.high') }
        ]}
      />

      <FormNumber
        label={t('projects.steps.step2.weeklyMeetingsCount')}
        name="weeklyMeetingsCount"
        value={formData.weeklyMeetingsCount || 0}
        onChange={handleChange}
        required
        min={0}
      />

      <div style={styles.section}>
        <label style={styles.label}>{t('projects.steps.step2.averageMeetingDuration')}</label>
        <div style={styles.row}>
          <FormNumber
            label=""
            name="meetingDurationValue"
            value={formData.averageMeetingDuration?.value || 60}
            onChange={(e) => handleMeetingDurationChange('value', parseInt(e.target.value) || 60)}
            min={1}
          />

          <FormSelect
            label=""
            name="meetingDurationUnit"
            value={formData.averageMeetingDuration?.unit || 'minutes'}
            onChange={(e) => handleMeetingDurationChange('unit', e.target.value)}
            options={[
              { value: TIME_UNITS.MINUTES, label: t('projects.timeUnits.minutes') },
              { value: TIME_UNITS.HOURS, label: t('projects.timeUnits.hours') }
            ]}
          />
        </div>
      </div>

      <FormInput
        label={t('projects.steps.step2.requiredAvailabilitySchedule')}
        name="requiredAvailabilitySchedule"
        value={formData.requiredAvailabilitySchedule || ''}
        onChange={handleChange}
        placeholder={t('projects.steps.step2.availabilityPlaceholder')}
        maxLength={200}
      />

      <FormTextarea
        label={t('projects.steps.step2.requiredLanguages')}
        name="requiredLanguages"
        value={formData.requiredLanguagesText ?? formData.requiredLanguages?.join(', ') ?? ''}
        onChange={handleLanguagesChange}
        placeholder={t('projects.steps.step2.languagesPlaceholder')}
        rows={2}
      />

      <FormSelect
        label={t('projects.steps.step2.minimumLanguageProficiency')}
        name="minimumLanguageProficiency"
        value={formData.minimumLanguageProficiency || 'B1'}
        onChange={handleChange}
        options={[
          { value: LANGUAGE_PROFICIENCY.A1, label: t('projects.languageProficiency.a1') },
          { value: LANGUAGE_PROFICIENCY.A2, label: t('projects.languageProficiency.a2') },
          { value: LANGUAGE_PROFICIENCY.B1, label: t('projects.languageProficiency.b1') },
          { value: LANGUAGE_PROFICIENCY.B2, label: t('projects.languageProficiency.b2') },
          { value: LANGUAGE_PROFICIENCY.C1, label: t('projects.languageProficiency.c1') },
          { value: LANGUAGE_PROFICIENCY.C2, label: t('projects.languageProficiency.c2') },
          { value: LANGUAGE_PROFICIENCY.NATIVE, label: t('projects.languageProficiency.native') },
          { value: LANGUAGE_PROFICIENCY.BILINGUAL, label: t('projects.languageProficiency.bilingual') }
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

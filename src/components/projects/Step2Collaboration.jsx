import React from 'react';
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
export default function Step2Collaboration({ formData, onChange, errors = {} }) {
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
    onChange({ requiredLanguages: languages });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Collaboration Requirements</h2>
      <p style={styles.stepDescription}>
        Define how team members will collaborate
      </p>

      <FormSelect
        label="Requires Synchronous Communication"
        name="requiresSynchronousCommunication"
        value={formData.requiresSynchronousCommunication || 'yes'}
        onChange={handleChange}
        required
        options={[
          { value: SYNCHRONOUS_COMMUNICATION.YES, label: 'Yes' },
          { value: SYNCHRONOUS_COMMUNICATION.NO, label: 'No' },
          { value: SYNCHRONOUS_COMMUNICATION.ONLY_CRITICAL, label: 'Only Critical Moments' }
        ]}
      />

      <FormSelect
        label="Real-Time Communication Level"
        name="realTimeCommunicationLevel"
        value={formData.realTimeCommunicationLevel || 'medium'}
        onChange={handleChange}
        required
        options={[
          { value: COMMUNICATION_LEVELS.LOW, label: 'Low' },
          { value: COMMUNICATION_LEVELS.MEDIUM, label: 'Medium' },
          { value: COMMUNICATION_LEVELS.HIGH, label: 'High' }
        ]}
      />

      <FormNumber
        label="Weekly Meetings Count"
        name="weeklyMeetingsCount"
        value={formData.weeklyMeetingsCount || 0}
        onChange={handleChange}
        required
        min={0}
      />

      <div style={styles.section}>
        <label style={styles.label}>Average Meeting Duration</label>
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
              { value: TIME_UNITS.MINUTES, label: 'Minutes' },
              { value: TIME_UNITS.HOURS, label: 'Hours' }
            ]}
          />
        </div>
      </div>

      <FormInput
        label="Required Availability Schedule"
        name="requiredAvailabilitySchedule"
        value={formData.requiredAvailabilitySchedule || ''}
        onChange={handleChange}
        placeholder="e.g., 9-17 UTC"
        maxLength={200}
      />

      <FormTextarea
        label="Required Languages"
        name="requiredLanguages"
        value={formData.requiredLanguages?.join(', ') || ''}
        onChange={handleLanguagesChange}
        placeholder="Enter languages separated by commas (e.g., English, Spanish, French)"
        rows={2}
      />

      <FormSelect
        label="Minimum Language Proficiency"
        name="minimumLanguageProficiency"
        value={formData.minimumLanguageProficiency || 'B1'}
        onChange={handleChange}
        options={[
          { value: LANGUAGE_PROFICIENCY.A1, label: 'A1 - Beginner' },
          { value: LANGUAGE_PROFICIENCY.A2, label: 'A2 - Elementary' },
          { value: LANGUAGE_PROFICIENCY.B1, label: 'B1 - Intermediate' },
          { value: LANGUAGE_PROFICIENCY.B2, label: 'B2 - Upper Intermediate' },
          { value: LANGUAGE_PROFICIENCY.C1, label: 'C1 - Advanced' },
          { value: LANGUAGE_PROFICIENCY.C2, label: 'C2 - Proficient' },
          { value: LANGUAGE_PROFICIENCY.NATIVE, label: 'Native' },
          { value: LANGUAGE_PROFICIENCY.BILINGUAL, label: 'Bilingual' }
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

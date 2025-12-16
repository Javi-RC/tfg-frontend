import React from 'react';
import { FormTextarea, FormSelect } from './FormComponents';
import { MANAGEMENT_METHODS, FREQUENCY_OPTIONS, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 7: Coordination and Management
 */
export default function Step7Coordination({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleFollowUpChange = (type, value) => {
    onChange({
      followUpFrequency: {
        ...formData.followUpFrequency,
        [type]: { frequency: value }
      }
    });
  };

  const handleToolsChange = (field, value) => {
    const tools = value.split(',').map(t => t.trim()).filter(t => t);
    onChange({ [field]: tools });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Coordination and Management</h2>
      <p style={styles.stepDescription}>
        Define how the project will be managed and coordinated
      </p>

      <FormSelect
        label="Management Method"
        name="managementMethod"
        value={formData.managementMethod || 'scrum'}
        onChange={handleChange}
        required
        options={[
          { value: MANAGEMENT_METHODS.SCRUM, label: 'Scrum' },
          { value: MANAGEMENT_METHODS.KANBAN, label: 'Kanban' },
          { value: MANAGEMENT_METHODS.WATERFALL, label: 'Waterfall' },
          { value: MANAGEMENT_METHODS.HYBRID, label: 'Hybrid' },
          { value: MANAGEMENT_METHODS.OTHER, label: 'Other' }
        ]}
      />

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Follow-Up Frequency</h3>

        <FormSelect
          label="Daily Standups"
          name="standupFrequency"
          value={formData.followUpFrequency?.standups?.frequency || 'daily'}
          onChange={(e) => handleFollowUpChange('standups', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.DAILY, label: 'Daily' },
            { value: FREQUENCY_OPTIONS.WEEKLY, label: 'Weekly' },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: 'Biweekly' },
            { value: FREQUENCY_OPTIONS.NONE, label: 'None' }
          ]}
        />

        <FormSelect
          label="Sprint Reviews"
          name="reviewFrequency"
          value={formData.followUpFrequency?.reviews?.frequency || 'weekly'}
          onChange={(e) => handleFollowUpChange('reviews', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.WEEKLY, label: 'Weekly' },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: 'Biweekly' },
            { value: FREQUENCY_OPTIONS.MONTHLY, label: 'Monthly' },
            { value: FREQUENCY_OPTIONS.NONE, label: 'None' }
          ]}
        />

        <FormSelect
          label="Retrospectives"
          name="retroFrequency"
          value={formData.followUpFrequency?.retrospectives?.frequency || 'biweekly'}
          onChange={(e) => handleFollowUpChange('retrospectives', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.WEEKLY, label: 'Weekly' },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: 'Biweekly' },
            { value: FREQUENCY_OPTIONS.MONTHLY, label: 'Monthly' },
            { value: FREQUENCY_OPTIONS.NONE, label: 'None' }
          ]}
        />
      </div>

      <FormTextarea
        label="Communication Tools"
        name="communicationTools"
        value={formData.communicationTools?.join(', ') || ''}
        onChange={(e) => handleToolsChange('communicationTools', e.target.value)}
        placeholder="Enter tools separated by commas (e.g., Slack, Microsoft Teams, Zoom)"
        rows={2}
      />

      <FormTextarea
        label="Task Management Tools"
        name="taskManagementTools"
        value={formData.taskManagementTools?.join(', ') || ''}
        onChange={(e) => handleToolsChange('taskManagementTools', e.target.value)}
        placeholder="Enter tools separated by commas (e.g., Jira, Trello, Asana)"
        rows={2}
      />

      <FormSelect
        label="Documentation Standardization"
        name="documentationStandardization"
        value={formData.documentationStandardization || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.HIGH, label: 'High' },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: 'Medium' },
          { value: COMPLEXITY_LEVELS.LOW, label: 'Low' }
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
    marginBottom: '32px',
    padding: '24px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '20px'
  }
};

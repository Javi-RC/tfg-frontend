import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormTextarea, FormSelect } from './FormComponents';
import { MANAGEMENT_METHODS, FREQUENCY_OPTIONS, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 7: Coordination and Management
 */
export default function Step7Coordination({ formData, onChange }) {
  const { t } = useTranslation();
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
    const textField = field === 'communicationTools'
      ? 'communicationToolsText'
      : field === 'taskManagementTools'
        ? 'taskManagementToolsText'
        : null;

    if (textField) {
      onChange({ [textField]: value, [field]: tools });
      return;
    }

    onChange({ [field]: tools });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step7.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step7.description')}
      </p>

      <FormSelect
        label={t('projects.steps.step7.managementMethod')}
        name="managementMethod"
        value={formData.managementMethod || 'scrum'}
        onChange={handleChange}
        required
        options={[
          { value: MANAGEMENT_METHODS.SCRUM, label: t('projects.steps.step7.scrum') },
          { value: MANAGEMENT_METHODS.KANBAN, label: t('projects.steps.step7.kanban') },
          { value: MANAGEMENT_METHODS.WATERFALL, label: t('projects.steps.step7.waterfall') },
          { value: MANAGEMENT_METHODS.HYBRID, label: t('projects.steps.step7.hybrid') },
          { value: MANAGEMENT_METHODS.OTHER, label: t('projects.steps.step7.other') }
        ]}
      />

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.steps.step7.followUpFrequency')}</h3>

        <FormSelect
          label={t('projects.steps.step7.dailyStandups')}
          name="standupFrequency"
          value={formData.followUpFrequency?.standups?.frequency || 'daily'}
          onChange={(e) => handleFollowUpChange('standups', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.DAILY, label: t('projects.steps.step7.daily') },
            { value: FREQUENCY_OPTIONS.WEEKLY, label: t('projects.steps.step7.weekly') },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: t('projects.steps.step7.biweekly') },
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') }
          ]}
        />

        <FormSelect
          label={t('projects.steps.step7.sprintReviews')}
          name="reviewFrequency"
          value={formData.followUpFrequency?.reviews?.frequency || 'weekly'}
          onChange={(e) => handleFollowUpChange('reviews', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.WEEKLY, label: t('projects.steps.step7.weekly') },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: t('projects.steps.step7.biweekly') },
            { value: FREQUENCY_OPTIONS.MONTHLY, label: t('projects.steps.step7.monthly') },
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') }
          ]}
        />

        <FormSelect
          label={t('projects.steps.step7.retrospectives')}
          name="retroFrequency"
          value={formData.followUpFrequency?.retrospectives?.frequency || 'biweekly'}
          onChange={(e) => handleFollowUpChange('retrospectives', e.target.value)}
          options={[
            { value: FREQUENCY_OPTIONS.WEEKLY, label: t('projects.steps.step7.weekly') },
            { value: FREQUENCY_OPTIONS.BIWEEKLY, label: t('projects.steps.step7.biweekly') },
            { value: FREQUENCY_OPTIONS.MONTHLY, label: t('projects.steps.step7.monthly') },
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') }
          ]}
        />
      </div>

      <FormTextarea
        label={t('projects.steps.step7.communicationTools')}
        name="communicationTools"
        value={formData.communicationToolsText ?? formData.communicationTools?.join(', ') ?? ''}
        onChange={(e) => handleToolsChange('communicationTools', e.target.value)}
        placeholder={t('projects.steps.step7.communicationToolsPlaceholder')}
        rows={2}
      />

      <FormTextarea
        label={t('projects.steps.step7.taskManagementTools')}
        name="taskManagementTools"
        value={formData.taskManagementToolsText ?? formData.taskManagementTools?.join(', ') ?? ''}
        onChange={(e) => handleToolsChange('taskManagementTools', e.target.value)}
        placeholder={t('projects.steps.step7.taskManagementToolsPlaceholder')}
        rows={2}
      />

      <FormSelect
        label={t('projects.steps.step7.documentationStandardization')}
        name="documentationStandardization"
        value={formData.documentationStandardization || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.HIGH, label: t('projects.levels.high') },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: t('projects.levels.medium') },
          { value: COMPLEXITY_LEVELS.LOW, label: t('projects.levels.low') }
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

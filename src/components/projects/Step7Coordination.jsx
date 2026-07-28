import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea, FormSelect } from './FormComponents';
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
        [type]: { frequency: value },
      },
    });
  };

  const handleToolsChange = (field, value) => {
    const tools = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    const textField =
      field === 'communicationTools'
        ? 'communicationToolsText'
        : field === 'taskManagementTools'
          ? 'taskManagementToolsText'
          : field === 'knowledgeManagementTools'
            ? 'knowledgeManagementToolsText'
            : null;

    if (textField) {
      onChange({ [textField]: value, [field]: tools });
      return;
    }

    onChange({ [field]: tools });
  };

  const handleDocProcessChange = (field, checked) => {
    onChange({
      documentationProcesses: {
        ...formData.documentationProcesses,
        [field]: checked,
      },
    });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step7.title')}</h2>
      <p style={styles.stepDescription}>{t('projects.steps.step7.description')}</p>

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
          { value: MANAGEMENT_METHODS.OTHER, label: t('projects.steps.step7.other') },
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
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') },
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
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') },
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
            { value: FREQUENCY_OPTIONS.NONE, label: t('projects.steps.step7.none') },
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

      <FormInput
        label={t('projects.steps.step7.taskTrackingSystem')}
        name="taskTrackingSystem"
        value={formData.taskTrackingSystem || ''}
        onChange={handleChange}
        placeholder={t('projects.steps.step7.taskTrackingSystemPlaceholder')}
      />

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.steps.step7.knowledgeManagement')}</h3>

        <FormInput
          label={t('projects.steps.step7.knowledgeManagementSystem')}
          name="knowledgeManagementSystem"
          value={formData.knowledgeManagementSystem || ''}
          onChange={handleChange}
          placeholder={t('projects.steps.step7.knowledgeManagementSystemPlaceholder')}
        />

        <FormTextarea
          label={t('projects.steps.step7.knowledgeManagementTools')}
          name="knowledgeManagementTools"
          value={
            formData.knowledgeManagementToolsText ??
            formData.knowledgeManagementTools?.join(', ') ??
            ''
          }
          onChange={(e) => handleToolsChange('knowledgeManagementTools', e.target.value)}
          placeholder={t('projects.steps.step7.knowledgeManagementToolsPlaceholder')}
          rows={2}
        />

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel} htmlFor="docProcess-standardization">
            <input
              type="checkbox"
              id="docProcess-standardization"
              checked={formData.documentationProcesses?.hasStandardization || false}
              onChange={(e) => handleDocProcessChange('hasStandardization', e.target.checked)}
              style={styles.checkbox}
            />
            {t('projects.steps.step7.hasStandardization')}
          </label>

          <label style={styles.checkboxLabel} htmlFor="docProcess-templates">
            <input
              type="checkbox"
              id="docProcess-templates"
              checked={formData.documentationProcesses?.templates || false}
              onChange={(e) => handleDocProcessChange('templates', e.target.checked)}
              style={styles.checkbox}
            />
            {t('projects.steps.step7.hasTemplates')}
          </label>

          <label style={styles.checkboxLabel} htmlFor="docProcess-review">
            <input
              type="checkbox"
              id="docProcess-review"
              checked={formData.documentationProcesses?.reviewProcess || false}
              onChange={(e) => handleDocProcessChange('reviewProcess', e.target.checked)}
              style={styles.checkbox}
            />
            {t('projects.steps.step7.hasReviewProcess')}
          </label>
        </div>
      </div>

      <FormSelect
        label={t('projects.steps.step7.documentationStandardization')}
        name="documentationStandardization"
        value={formData.documentationStandardization || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.HIGH, label: t('projects.levels.high') },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: t('projects.levels.medium') },
          { value: COMPLEXITY_LEVELS.LOW, label: t('projects.levels.low') },
        ]}
      />
    </div>
  );
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 8px 0',
  },
  stepDescription: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    marginBottom: '32px',
  },
  section: {
    marginBottom: '32px',
    padding: '24px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList } from 'lucide-react';
import { FormTextarea, FormSelect } from './FormComponents';
import { MANAGEMENT_METHODS, FREQUENCY_OPTIONS, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 9: Coordination and Management
 * Define project management methodology and coordination frequency
 */
export default function Step9Coordination({ formData, onChange }) {
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
    onChange({ [field]: tools });
  };

  return (
    <div>
      <h2 style={{...styles.stepTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <ClipboardList size={24} />
        {t('projects.steps.step7.title')}
      </h2>
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

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.steps.step7.collaborationTools')}</h3>

        <FormTextarea
          label={t('projects.steps.step7.communicationTools')}
          name="communicationTools"
          value={(formData.communicationTools || []).join(', ')}
          onChange={(e) => handleToolsChange('communicationTools', e.target.value)}
          placeholder={t('projects.steps.step7.communicationToolsPlaceholder')}
          rows={2}
        />

        <FormTextarea
          label={t('projects.steps.step7.taskManagementTools')}
          name="taskManagementTools"
          value={(formData.taskManagementTools || []).join(', ')}
          onChange={(e) => handleToolsChange('taskManagementTools', e.target.value)}
          placeholder={t('projects.steps.step7.taskManagementToolsPlaceholder')}
          rows={2}
        />
      </div>

      <FormSelect
        label="Documentation Standardization"
        name="documentationStandardization"
        value={t('projects.steps.step7.documentationStandardization')}
        name="documentationStandardization"
        value={formData.documentationStandardization || 'medium'}
        onChange={handleChange}
        required
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: t('projects.steps.step3.minimal') + ' - Minimal standards' },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: t('projects.levels.medium') + ' - Some templates' },
          { value: COMPLEXITY_LEVELS.HIGH, label: t('projects.levels.high') + ' - Strict templates & review' }
        ]}
      />

      <FormSelect
        label={t('projects.steps.step8.informationFlow')}
        name="informationFlow"
        value={formData.informationFlow || 'bidirectional'}
        onChange={handleChange}
        required
        options={[
          { value: 'top-down', label: 'Top-Down (Manager → Team)' },
          { value: 'bottom-up', label: 'Bottom-Up (Team → Manager)' },
          { value: 'bidirectional', label: t('projects.steps.step10.flowBidirectional')
    </div>
  );
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
  section: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '16px'
  }
};

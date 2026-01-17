import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { FormSelect } from './FormComponents';
import { YES_NO_PARTIAL, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 9: Organizational Maturity
 */
export default function Step9Maturity({ formData, onChange }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step9.title')}</h2>
      <p style={styles.stepDescription}>
        {t('projects.steps.step9.description')}
      </p>

      <FormSelect
        label={t('projects.steps.step9.hasOnboardingProcesses')}
        name="hasOnboardingProcesses"
        value={formData.hasOnboardingProcesses || 'partial'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: t('projects.yesNoPartial.yes') },
          { value: YES_NO_PARTIAL.NO, label: t('projects.yesNoPartial.no') },
          { value: YES_NO_PARTIAL.PARTIAL, label: t('projects.yesNoPartial.partial') }
        ]}
      />

      <FormSelect
        label={t('projects.steps.step9.hasVersionControlAndCICD')}
        name="hasVersionControlAndCICD"
        value={formData.hasVersionControlAndCICD || 'yes'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: t('projects.yesNoPartial.yes') },
          { value: YES_NO_PARTIAL.NO, label: t('projects.yesNoPartial.no') },
          { value: YES_NO_PARTIAL.PARTIAL, label: t('projects.yesNoPartial.partial') }
        ]}
      />

      <FormSelect
        label={t('projects.steps.step9.internalToolsFragmentation')}
        name="internalToolsFragmentation"
        value={formData.internalToolsFragmentation || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: t('projects.steps.step9.wellIntegrated') },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: t('projects.steps.step9.someFragmentation') },
          { value: COMPLEXITY_LEVELS.HIGH, label: t('projects.steps.step9.highlyFragmented') }
        ]}
      />

      <div style={styles.completionCard}>
        <div style={styles.completionIcon}><CheckCircle size={48} color="#10b981" /></div>
        <h3 style={styles.completionTitle}>{t('projects.steps.step9.formComplete')}</h3>
        <p style={styles.completionText}>
          {t('projects.steps.step9.formCompleteDesc')}
        </p>
      </div>
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
  completionCard: {
    marginTop: '40px',
    padding: '32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    textAlign: 'center',
    color: 'white'
  },
  completionIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  completionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px'
  },
  completionText: {
    fontSize: '15px',
    lineHeight: '1.6',
    opacity: 0.95
  }
};

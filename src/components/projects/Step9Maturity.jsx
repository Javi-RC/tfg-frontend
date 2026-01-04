import React from 'react';
import { FormSelect } from './FormComponents';
import { YES_NO_PARTIAL, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 9: Organizational Maturity
 */
export default function Step9Maturity({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Organizational Maturity</h2>
      <p style={styles.stepDescription}>
        Assess your organization's development maturity
      </p>

      <FormSelect
        label="Has Onboarding Processes"
        name="hasOnboardingProcesses"
        value={formData.hasOnboardingProcesses || 'partial'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: 'Yes' },
          { value: YES_NO_PARTIAL.NO, label: 'No' },
          { value: YES_NO_PARTIAL.PARTIAL, label: 'Partial' }
        ]}
      />

      <FormSelect
        label="Has Version Control and CI/CD"
        name="hasVersionControlAndCICD"
        value={formData.hasVersionControlAndCICD || 'yes'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: 'Yes' },
          { value: YES_NO_PARTIAL.NO, label: 'No' },
          { value: YES_NO_PARTIAL.PARTIAL, label: 'Partial' }
        ]}
      />

      <FormSelect
        label="Internal Tools Fragmentation"
        name="internalToolsFragmentation"
        value={formData.internalToolsFragmentation || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: 'Low - Well integrated tools' },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: 'Medium - Some fragmentation' },
          { value: COMPLEXITY_LEVELS.HIGH, label: 'High - Many disparate tools' }
        ]}
      />

      <div style={styles.completionCard}>
        <div style={styles.completionIcon}><CheckCircle size={48} color="#10b981" /></div>
        <h3 style={styles.completionTitle}>Form Complete!</h3>
        <p style={styles.completionText}>
          You've filled in all the sections. Review your information and save the project 
          as a draft, or submit it to activate immediately.
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

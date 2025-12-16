import React from 'react';
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleTechnologiesChange = (e) => {
    const value = e.target.value;
    const technologies = value.split(',').map(t => t.trim()).filter(t => t);
    onChange({ mainTechnologies: technologies });
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
      <h2 style={styles.stepTitle}>Technical Requirements</h2>
      <p style={styles.stepDescription}>
        Define the technical aspects of the project
      </p>

      <FormTextarea
        label="Main Technologies"
        name="mainTechnologies"
        value={formData.mainTechnologies?.join(', ') || ''}
        onChange={handleTechnologiesChange}
        placeholder="Enter technologies separated by commas (e.g., React, Node.js, PostgreSQL)"
        rows={3}
      />

      <FormSelect
        label="Required Experience Level"
        name="requiredExperienceLevel"
        value={formData.requiredExperienceLevel || 'mid'}
        onChange={handleChange}
        required
        options={[
          { value: EXPERIENCE_LEVELS.JUNIOR, label: 'Junior' },
          { value: EXPERIENCE_LEVELS.MID, label: 'Mid-level' },
          { value: EXPERIENCE_LEVELS.SENIOR, label: 'Senior' },
          { value: EXPERIENCE_LEVELS.EXPERT, label: 'Expert' }
        ]}
      />

      <FormSelect
        label="System Complexity"
        name="systemComplexity"
        value={formData.systemComplexity || 'medium'}
        onChange={handleChange}
        required
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: 'Low' },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: 'Medium' },
          { value: COMPLEXITY_LEVELS.HIGH, label: 'High' }
        ]}
      />

      <FormTextarea
        label="Shared Infrastructure Dependency"
        name="sharedInfrastructureDependency"
        value={formData.sharedInfrastructureDependency || ''}
        onChange={handleChange}
        placeholder="Describe any shared infrastructure dependencies..."
        rows={3}
        maxLength={500}
      />

      <div style={styles.section}>
        <FormCheckbox
          label="Requires Specialized Tools"
          name="specializedToolsNeeded"
          checked={formData.requiresSpecializedTools?.needed || false}
          onChange={handleSpecializedToolsChange}
        />

        {formData.requiresSpecializedTools?.needed && (
          <FormTextarea
            label="Describe Specialized Tools"
            name="specializedToolsDescription"
            value={formData.requiresSpecializedTools?.description || ''}
            onChange={handleSpecializedToolsChange}
            placeholder="Describe the specialized tools needed..."
            rows={3}
            maxLength={500}
          />
        )}
      </div>

      <FormSelect
        label="Documentation Level"
        name="documentationLevel"
        value={formData.documentationLevel || 'partial'}
        onChange={handleChange}
        required
        options={[
          { value: DOCUMENTATION_LEVELS.COMPLETE, label: 'Complete' },
          { value: DOCUMENTATION_LEVELS.PARTIAL, label: 'Partial' },
          { value: DOCUMENTATION_LEVELS.MINIMAL, label: 'Minimal' },
          { value: DOCUMENTATION_LEVELS.NONE, label: 'None' }
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
  }
};

import React from 'react';
import { FormInput, FormTextarea, FormSelect } from './FormComponents';
import { INFORMATION_FLOW, DEPENDENCY_LEVELS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 8: Team Collaboration Intensity
 */
export default function Step8CollaborationIntensity({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = [...(formData.involvedTeams || [])];
    newTeams[index] = { ...newTeams[index], [field]: value };
    onChange({ involvedTeams: newTeams });
  };

  const addTeam = () => {
    const newTeams = [...(formData.involvedTeams || []), { 
      teamName: '', 
      dependencyLevel: 'medium' 
    }];
    onChange({ involvedTeams: newTeams });
  };

  const removeTeam = (index) => {
    const newTeams = formData.involvedTeams.filter((_, i) => i !== index);
    onChange({ involvedTeams: newTeams });
  };

  const handleExchangesChange = (e) => {
    const value = e.target.value;
    const exchanges = value.split('\n').map(ex => ex.trim()).filter(ex => ex);
    onChange({ criticalExchanges: exchanges });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Team Collaboration Intensity</h2>
      <p style={styles.stepDescription}>
        Define how teams will collaborate and exchange information
      </p>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Involved Teams</h3>
          <PrimaryButton onClick={addTeam}>+ Add Team</PrimaryButton>
        </div>

        {formData.involvedTeams && formData.involvedTeams.length > 0 ? (
          formData.involvedTeams.map((team, index) => (
            <div key={index} style={styles.teamCard}>
              <div style={styles.teamHeader}>
                <span style={styles.teamNumber}>Team {index + 1}</span>
                <button
                  style={styles.removeButton}
                  onClick={() => removeTeam(index)}
                >
                  Remove
                </button>
              </div>

              <div style={styles.row}>
                <FormInput
                  label="Team Name"
                  name={`teamName-${index}`}
                  value={team.teamName || ''}
                  onChange={(e) => handleTeamChange(index, 'teamName', e.target.value)}
                  required
                  placeholder="e.g., Backend Team"
                />

                <FormSelect
                  label="Dependency Level"
                  name={`teamDependency-${index}`}
                  value={team.dependencyLevel || 'medium'}
                  onChange={(e) => handleTeamChange(index, 'dependencyLevel', e.target.value)}
                  options={[
                    { value: DEPENDENCY_LEVELS.LOW, label: 'Low' },
                    { value: DEPENDENCY_LEVELS.MEDIUM, label: 'Medium' },
                    { value: DEPENDENCY_LEVELS.HIGH, label: 'High' }
                  ]}
                />
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyText}>No teams added yet. Click "Add Team" to start.</p>
        )}
      </div>

      <FormSelect
        label="Information Flow"
        name="informationFlow"
        value={formData.informationFlow || 'bidirectional'}
        onChange={handleChange}
        options={[
          { value: INFORMATION_FLOW.UNIDIRECTIONAL, label: 'Unidirectional' },
          { value: INFORMATION_FLOW.BIDIRECTIONAL, label: 'Bidirectional' },
          { value: INFORMATION_FLOW.MULTIPLE, label: 'Multiple Directions' }
        ]}
      />

      <FormTextarea
        label="Critical Exchanges"
        name="criticalExchanges"
        value={formData.criticalExchanges?.join('\n') || ''}
        onChange={handleExchangesChange}
        placeholder="Enter each critical exchange on a new line..."
        rows={4}
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
    marginBottom: '32px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    margin: 0
  },
  teamCard: {
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #E5E7EB'
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  teamNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280'
  },
  removeButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEE2E2',
    color: '#DC2626',
    transition: 'all 0.2s'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px'
  }
};

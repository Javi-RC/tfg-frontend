import React from 'react';
import { FormInput, FormTextarea, FormSelect } from './FormComponents';
import { DEPENDENCY_LEVELS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 10: Team Collaboration Intensity
 * Define inter-team collaboration and critical information exchanges
 */
export default function Step10CollaborationIntensity({ formData, onChange, errors = {} }) {
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
      <h2 style={{...styles.stepTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Handshake size={24} />
        Team Collaboration Intensity
      </h2>
      <p style={styles.stepDescription}>
        Define how teams will collaborate and exchange information (Optional)
      </p>

      <div style={styles.infoBox}>
        <AlertCircle size={20} color="#004085" style={{ flexShrink: 0 }} />
        <div>
          <strong>Optional Step</strong>
          <p>This step is optional but recommended for multi-team projects</p>
        </div>
      </div>

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
                  placeholder="e.g., Backend Team, Frontend Team"
                />

                <FormSelect
                  label="Dependency Level"
                  name={`teamDependency-${index}`}
                  value={team.dependencyLevel || 'medium'}
                  onChange={(e) => handleTeamChange(index, 'dependencyLevel', e.target.value)}
                  options={[
                    { value: DEPENDENCY_LEVELS.LOW, label: 'Low - Independent work' },
                    { value: DEPENDENCY_LEVELS.MEDIUM, label: 'Medium - Some coordination' },
                    { value: DEPENDENCY_LEVELS.HIGH, label: 'High - Tight integration' }
                  ]}
                />
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>👥</span>
            <p style={styles.emptyText}>No teams added yet</p>
            <p style={styles.emptySubtext}>Click "Add Team" to define inter-team dependencies</p>
          </div>
        )}
      </div>

      <FormTextarea
        label="Critical Information Exchanges"
        name="criticalExchanges"
        value={(formData.criticalExchanges || []).join('\n')}
        onChange={handleExchangesChange}
        placeholder="List critical information exchanges between teams (one per line)&#10;Example:&#10;- API specs from Backend to Frontend&#10;- Design assets from Design to Frontend&#10;- Database schema changes to all teams"
        rows={6}
        helperText="One exchange per line. Be specific about what information is exchanged and between which teams."
      />

      {formData.involvedTeams && formData.involvedTeams.length > 2 && (
        <div style={styles.warningBox}>
          <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
          <div>
            <strong>Complex Coordination</strong>
            <p>
              With {formData.involvedTeams.length} teams involved, ensure clear communication 
              channels and regular sync meetings to avoid coordination issues.
            </p>
          </div>
        </div>
      )}
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
    marginBottom: '24px'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#DBEAFE',
    border: '1px solid #3B82F6',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  infoIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #F59E0B',
    borderRadius: '8px',
    marginTop: '24px'
  },
  warningIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  section: {
    marginTop: '32px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    margin: 0
  },
  teamCard: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px'
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
    fontSize: '13px',
    color: '#EF4444',
    backgroundColor: 'white',
    border: '1px solid #EF4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px dashed #D1D5DB'
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#374151',
    fontWeight: '500',
    margin: '0 0 8px 0'
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0
  }
};

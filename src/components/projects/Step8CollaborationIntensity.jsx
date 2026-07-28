import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput, FormTextarea, FormSelect } from './FormComponents';
import { INFORMATION_FLOW, DEPENDENCY_LEVELS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 8: Team Collaboration Intensity
 */
export default function Step8CollaborationIntensity({ formData, onChange }) {
  const { t } = useTranslation();
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
    const newTeams = [
      ...(formData.involvedTeams || []),
      {
        _key: `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        teamName: '',
        dependencyLevel: 'medium',
      },
    ];
    onChange({ involvedTeams: newTeams });
  };

  const removeTeam = (index) => {
    const newTeams = formData.involvedTeams.filter((_, i) => i !== index);
    onChange({ involvedTeams: newTeams });
  };

  const handleExchangesChange = (e) => {
    const value = e.target.value;
    const exchanges = value
      .split('\n')
      .map((ex) => ex.trim())
      .filter((ex) => ex);
    onChange({ criticalExchanges: exchanges });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step8.title')}</h2>
      <p style={styles.stepDescription}>{t('projects.steps.step8.description')}</p>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{t('projects.steps.step8.involvedTeams')}</h3>
          <PrimaryButton onClick={addTeam}>{t('projects.steps.step8.addTeam')}</PrimaryButton>
        </div>

        {formData.involvedTeams && formData.involvedTeams.length > 0 ? (
          formData.involvedTeams.map((team, index) => (
            <div key={team._key} style={styles.teamCard}>
              <div style={styles.teamHeader}>
                <span style={styles.teamNumber}>
                  {t('projects.steps.step8.team')} {index + 1}
                </span>
                <button type="button" style={styles.removeButton} onClick={() => removeTeam(index)}>
                  {t('projects.steps.step5.remove')}
                </button>
              </div>

              <div style={styles.row}>
                <FormInput
                  label={t('projects.steps.step8.teamName')}
                  name={`teamName-${index}`}
                  value={team.teamName || ''}
                  onChange={(e) => handleTeamChange(index, 'teamName', e.target.value)}
                  required
                  placeholder={t('projects.steps.step8.teamNamePlaceholder')}
                />

                <FormSelect
                  label={t('projects.steps.step8.dependencyLevel')}
                  name={`teamDependency-${index}`}
                  value={team.dependencyLevel || 'medium'}
                  onChange={(e) => handleTeamChange(index, 'dependencyLevel', e.target.value)}
                  options={[
                    {
                      value: DEPENDENCY_LEVELS.LOW,
                      label: t('projects.steps.step8.dependencyLow'),
                    },
                    {
                      value: DEPENDENCY_LEVELS.MEDIUM,
                      label: t('projects.steps.step8.dependencyMedium'),
                    },
                    {
                      value: DEPENDENCY_LEVELS.HIGH,
                      label: t('projects.steps.step8.dependencyHigh'),
                    },
                  ]}
                />
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyText}>{t('projects.steps.step8.noTeamsMessage')}</p>
        )}
      </div>

      <FormSelect
        label={t('projects.steps.step8.informationFlow')}
        name="informationFlow"
        value={formData.informationFlow || 'bidirectional'}
        onChange={handleChange}
        options={[
          {
            value: INFORMATION_FLOW.UNIDIRECTIONAL,
            label: t('projects.steps.step8.flowUnidirectional'),
          },
          {
            value: INFORMATION_FLOW.BIDIRECTIONAL,
            label: t('projects.steps.step8.flowBidirectional'),
          },
          { value: INFORMATION_FLOW.MULTIPLE, label: t('projects.steps.step8.flowMultiple') },
        ]}
      />

      <FormTextarea
        label={t('projects.steps.step8.criticalExchanges')}
        name="criticalExchanges"
        value={formData.criticalExchanges?.join('\n') || ''}
        onChange={handleExchangesChange}
        placeholder={t('projects.steps.step8.criticalExchangesPlaceholder')}
        rows={4}
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
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  teamCard: {
    padding: '20px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid var(--color-border)',
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  teamNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  removeButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    transition: 'all 0.2s',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  emptyText: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    padding: '40px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
  },
};

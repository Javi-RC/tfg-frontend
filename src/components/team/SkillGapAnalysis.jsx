import React from 'react';
import { useTranslation } from 'react-i18next';
import { XCircle, AlertTriangle } from 'lucide-react';

export default function SkillGapAnalysis({ missingSkills }) {
  const { t } = useTranslation();

  if (!missingSkills || missingSkills.length === 0) return null;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <XCircle size={18} color="#dc3545" />
        <h4 style={styles.sectionTitle}>
          {t('team.skillsMatch.missingSkillsTitle', { count: missingSkills.length })}
        </h4>
      </div>

      <div style={styles.alertBox}>
        <AlertTriangle size={16} />
        <span>
          {missingSkills.length === 1
            ? t('team.skillsMatch.missingAlertOne', { count: missingSkills.length })
            : t('team.skillsMatch.missingAlertOther', { count: missingSkills.length })}
        </span>
      </div>

      <div style={styles.missingList}>
        {missingSkills.map((skill) => {
          const skillName = typeof skill === 'string' ? skill : skill.skill;
          return (
            <div key={skillName} style={styles.missingChip}>
              <XCircle size={14} />
              {skillName}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '8px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  alertBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid var(--color-warning)',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '13px',
    color: '#856404',
  },
  missingList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  missingChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-danger)',
    borderRadius: '6px',
    fontSize: '13px',
    color: 'var(--color-danger)',
    fontWeight: '500',
  },
};

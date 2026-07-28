import React from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeCvSkills } from '../../utils/skillsMatch';

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getProficiencyEmoji(proficiency) {
  const map = {
    basico: '\u2B50',
    b\u00E1sico: '\u2B50',
    intermedio: '\u2B50\u2B50',
    avanzado: '\u2B50\u2B50\u2B50',
    experto: '\u2B50\u2B50\u2B50\u2B50',
    expert: '\u2B50\u2B50\u2B50\u2B50',
  };
  return map[proficiency?.toLowerCase()] || '\u2B50\u2B50';
}

function renderSkillsByCategory(skills) {
  const categories = {};

  skills.forEach((skill) => {
    const cat = skill.category || 'other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(skill);
  });

  return (
    <div style={styles.categoriesGrid}>
      {Object.entries(categories).map(([category, categorySkills]) => (
        <div key={category} style={styles.categoryCard}>
          <div style={styles.categoryHeader}>
            {capitalize(category)} ({categorySkills.length})
          </div>
          <div style={styles.categorySkills}>
            {categorySkills.map((skill) => (
              <div key={skill.technology} style={styles.categorySkillChip}>
                {skill.technology}
                <span style={styles.skillLevel}>{getProficiencyEmoji(skill.proficiency)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SkillRecommendations({ employee }) {
  const { t } = useTranslation();
  const cv = employee.cv;
  const cvSkills = normalizeCvSkills(cv);

  if (cvSkills.length === 0) return null;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h4 style={styles.sectionTitle}>
          {t('team.skillsMatch.allSkillsTitle', { count: cvSkills.length })}
        </h4>
      </div>

      {renderSkillsByCategory(cvSkills)}
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
  categoriesGrid: {
    display: 'grid',
    gap: '12px',
  },
  categoryCard: {
    padding: '12px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  categoryHeader: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  categorySkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  categorySkillChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--color-text-primary)',
  },
  skillLevel: {
    fontSize: '10px',
  },
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, ArrowRight } from 'lucide-react';

/**
 * CompetenciasCard
 * Skill bars. Values are placeholders (see Profile.jsx PLACEHOLDER_SKILLS)
 * until skills are wired to the CV / competency backend.
 */
export default function CompetenciasCard({ skills = [], onSeeAll = () => {} }) {
  const { t } = useTranslation();

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><Code2 size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.dashboard.competencies')}</span>
      </div>

      {skills.map((skill) => (
        <div key={skill.name} className="sara-skill">
          <div className="sara-skill-head">
            <span className="sara-skill-name">{skill.name}</span>
            <span className="sara-skill-pct">{skill.level}%</span>
          </div>
          <div className="sara-skill-track">
            <div className="sara-skill-fill" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
      ))}

      <button type="button" className="sara-card-link" onClick={onSeeAll}>
        {t('profile.dashboard.seeAllCompetencies')}
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </section>
  );
}

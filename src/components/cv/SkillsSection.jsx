import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Box, Database, Cloud, Wrench } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';
import './SkillsSection.css';

const CATEGORY_CONFIG = {
  language: { labelKey: 'cv.editor.skills.categories.language', color: '#7c5cff', bg: '#f3f0ff', icon: Code },
  framework: { labelKey: 'cv.editor.skills.categories.framework', color: '#2563eb', bg: '#eff6ff', icon: Box },
  tool: { labelKey: 'cv.editor.skills.categories.tool', color: '#d97706', bg: '#fffbeb', icon: Wrench },
  database: { labelKey: 'cv.editor.skills.categories.database', color: '#059669', bg: '#ecfdf5', icon: Database },
  cloud: { labelKey: 'cv.editor.skills.categories.cloud', color: '#7c3aed', bg: '#f5f3ff', icon: Cloud },
  other: { labelKey: 'cv.editor.skills.categories.other', color: '#6b7280', bg: '#f9fafb', icon: Wrench },
};

const LEVEL_COLORS = {
  beginner: '#9ca3af',
  intermediate: '#60a5fa',
  advanced: '#7c5cff',
  expert: '#d97706',
};

export default function SkillsSection({
  cv,
  editData,
  editMode,
  onSkillChange,
  onAddSkill,
  onRemoveSkill,
}) {
  const { t } = useTranslation();
  const skills = editMode ? editData?.skills?.technical : cv?.skills?.technical;
  if (!skills) return null;

  const formatSkillLevel = (level) => {
    const mapping = {
      beginner: t('cv.beginner'),
      intermediate: t('cv.intermediate'),
      advanced: t('cv.advanced'),
      expert: t('cv.expert'),
      básico: t('cv.beginner'),
      intermedio: t('cv.intermediate'),
      avanzado: t('cv.advanced'),
      experto: t('cv.expert'),
    };
    return mapping[level] || level;
  };

  const groupedSkills = useMemo(() => {
    if (editMode) return null;
    const groups = {};
    skills.forEach((skill) => {
      const cat = skill.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });
    const ORDER = ['language', 'framework', 'database', 'cloud', 'tool', 'other'];
    return ORDER.filter(c => groups[c]).map(c => ({ category: c, skills: groups[c], ...CATEGORY_CONFIG[c] }));
  }, [skills, editMode]);

  if (!editMode) {
    return (
      <section className="skillssection-section" aria-labelledby="skills-heading">
        <SectionHeader id="skills-heading" title={t('cv.editor.skills.sectionTitle')} />
        {groupedSkills && groupedSkills.length > 0 ? (
          <div className="skillssection-categories">
            {groupedSkills.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.category} className="skillssection-category">
                  <div className="skillssection-category-header">
                    <span className="skillssection-category-dot" style={{ background: group.color }} />
                    <Icon size={14} color={group.color} />
                    <span className="skillssection-category-label">{t(group.labelKey)}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{group.skills.length}</span>
                  </div>
                  <div className="skillssection-badge-list">
                    {group.skills.map((skill) => (
                      <span key={skill._id}
                        className="skillssection-badge"
                        style={{
                          background: group.bg,
                          color: group.color,
                          border: `1px solid ${group.color}20`,
                        }}
                      >
                        {skill.name}
                        {skill.level && skill.level !== 'beginner' && skill.level !== 'básico' && (
                          <span className="skillssection-badge-level">
                            ({formatSkillLevel(skill.level)})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="skillssection-no-skills">{t('cv.editor.skills.noSkills')}</p>
        )}
      </section>
    );
  }

  return (
    <section className="skillssection-section" aria-labelledby="skills-heading">
      <SectionHeader id="skills-heading" title={t('cv.editor.skills.sectionTitle')} />
      <div className="skillssection-edit-list">
        {skills.map((skill, index) => (
          <div key={skill._id} className="skillssection-edit-row">
            <Field editable label={t('cv.skillName')} value={skill.name} onChange={(value) => onSkillChange(index, 'name', value)} placeholder={t('cv.editor.skills.fields.name.placeholder')} required />
            <Field editable label={t('cv.editor.skills.fields.level.label')} type="select" value={skill.level} onChange={(value) => onSkillChange(index, 'level', value)} placeholder={t('cv.editor.skills.fields.level.placeholder')} options={[
              { value: 'beginner', label: t('cv.beginner') },
              { value: 'intermediate', label: t('cv.intermediate') },
              { value: 'advanced', label: t('cv.advanced') },
              { value: 'expert', label: t('cv.expert') },
            ]} />
            <Field editable label={t('cv.editor.skills.fields.category.label')} type="select" value={skill.category} onChange={(value) => onSkillChange(index, 'category', value)} placeholder={t('cv.editor.skills.fields.category.placeholder')} options={[
              { value: 'language', label: t('cv.editor.skills.categories.language') },
              { value: 'framework', label: t('cv.editor.skills.categories.framework') },
              { value: 'tool', label: t('cv.editor.skills.categories.tool') },
              { value: 'database', label: t('cv.editor.skills.categories.database') },
              { value: 'cloud', label: t('cv.editor.skills.categories.cloud') },
              { value: 'other', label: t('cv.editor.skills.categories.other') },
            ]} />
            <button type="button" onClick={() => onRemoveSkill(index)} className="skillssection-remove-btn" aria-label={t('cv.editor.skills.removeLabel', { name: skill.name || t('cv.editor.entry') })}>
              {t('common.remove')}
            </button>
          </div>
        ))}
      </div>
      {editMode && (
        <div className="skillssection-add-wrapper">
          <PrimaryButton onClick={onAddSkill} aria-label={t('cv.editor.skills.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            {t('cv.editor.skills.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

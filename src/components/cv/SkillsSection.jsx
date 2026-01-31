import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

/**
 * SkillsSection Component
 * Technical skills section with badges
 */
export default function SkillsSection({ 
  cv,
  editData,
  editMode,
  onSkillChange,
  onAddSkill,
  onRemoveSkill
}) {
  const { t } = useTranslation();
  const skills = editMode ? editData?.skills?.technical : cv?.skills?.technical;
  if (!skills) return null;

  const formatSkillLevel = (level) => {
    const mapping = {
      'beginner': t('cv.beginner'),
      'intermediate': t('cv.intermediate'),
      'advanced': t('cv.advanced'),
      'expert': t('cv.expert'),
      // Legacy Spanish values for backward compatibility
      'básico': t('cv.beginner'),
      'intermedio': t('cv.intermediate'),
      'avanzado': t('cv.advanced'),
      'experto': t('cv.expert')
    };

    return mapping[level] || level;
  };

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="skills-heading">
      <SectionHeader 
        id="skills-heading" 
        title={t('cv.editor.skills.sectionTitle')} 
      />
      {editMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {skills.map((skill, index) => (
            <div key={skill._id || index} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: '12px',
              alignItems: 'end',
              padding: '12px',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <Field
                editable={true}
                label={t('cv.skillName')}
                value={skill.name}
                onChange={(value) => onSkillChange(index, 'name', value)}
                placeholder={t('cv.editor.skills.fields.name.placeholder')}
                required
              />
              <Field
                editable={true}
                label={t('cv.editor.skills.fields.level.label')}
                type="select"
                value={skill.level}
                onChange={(value) => onSkillChange(index, 'level', value)}
                placeholder={t('cv.editor.skills.fields.level.placeholder')}
                options={[
                  { value: 'beginner', label: t('cv.beginner') },
                  { value: 'intermediate', label: t('cv.intermediate') },
                  { value: 'advanced', label: t('cv.advanced') },
                  { value: 'expert', label: t('cv.expert') }
                ]}
              />
              <Field
                editable={true}
                label={t('cv.editor.skills.fields.category.label')}
                type="select"
                value={skill.category}
                onChange={(value) => onSkillChange(index, 'category', value)}
                placeholder={t('cv.editor.skills.fields.category.placeholder')}
                options={[
                  { value: 'language', label: t('cv.editor.skills.categories.language') },
                  { value: 'framework', label: t('cv.editor.skills.categories.framework') },
                  { value: 'tool', label: t('cv.editor.skills.categories.tool') },
                  { value: 'database', label: t('cv.editor.skills.categories.database') },
                  { value: 'cloud', label: t('cv.editor.skills.categories.cloud') },
                  { value: 'other', label: t('cv.editor.skills.categories.other') }
                ]}
              />
              <button
                onClick={() => onRemoveSkill(index)}
                style={{
                  padding: '8px 12px',
                  background: '#fee',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#c33',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginBottom: '2px'
                }}
                aria-label={t('cv.editor.skills.removeLabel', {
                  name: skill.name || t('cv.editor.entry')
                })}
              >
                {t('common.remove')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {skills.map((skill, index) => (
            <span key={skill._id || index} style={{
              padding: '8px 18px',
              background: skill.category === 'framework' ? '#ebf8ff' : '#edf2f7',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: skill.category === 'framework' ? '#2c5282' : '#2d3748',
              border: skill.level === 'advanced' ? '2px solid #2d3748' : '1px solid transparent'
            }}>
              {skill.name}
              {skill.level && skill.level !== 'beginner' && skill.level !== 'básico' && (
                <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>
                  ({formatSkillLevel(skill.level)})
                </span>
              )}
            </span>
          ))}
        </div>
      )}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddSkill}
            aria-label={t('cv.editor.skills.actions.addAria')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            {t('cv.editor.skills.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

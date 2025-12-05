import React from 'react';
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
  const skills = editMode ? editData?.skills?.technical : cv?.skills?.technical;
  if (!skills) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="skills-heading">
      <SectionHeader 
        id="skills-heading" 
        title="Technical Skills" 
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
                label="Skill Name"
                value={skill.name}
                onChange={(value) => onSkillChange(index, 'name', value)}
                placeholder="e.g. React"
                required
              />
              <Field
                editable={true}
                label="Level"
                type="select"
                value={skill.level}
                onChange={(value) => onSkillChange(index, 'level', value)}
                placeholder="Select level"
                options={['básico', 'intermedio', 'avanzado', 'experto']}
              />
              <Field
                editable={true}
                label="Category"
                type="select"
                value={skill.category}
                onChange={(value) => onSkillChange(index, 'category', value)}
                placeholder="Select category"
                options={['lenguaje', 'framework', 'herramienta', 'base_datos', 'cloud', 'otro']}
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
                aria-label={`Remove skill: ${skill.name || 'entry'}`}
              >
                Remove
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
              border: skill.level === 'avanzado' ? '2px solid #2d3748' : '1px solid transparent'
            }}>
              {skill.name}
              {skill.level && skill.level !== 'básico' && (
                <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>
                  ({skill.level})
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
            aria-label="Add new skill"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Skill
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

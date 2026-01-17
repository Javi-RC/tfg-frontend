import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

/**
 * ExperienceSection Component
 * Professional experience section
 */
export default function ExperienceSection({ 
  cv,
  editData,
  editMode,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience
}) {
  const { t } = useTranslation();
  const experiences = editMode ? editData?.experience : cv?.experience;
  if (!experiences) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="experience-heading">
      <SectionHeader 
        id="experience-heading" 
        title={t('cv.experience')} 
      />
      {experiences.map((exp, index) => (
        <CVCard
          key={exp._id || index}
          editMode={editMode}
          borderColor="#4299e1"
          onRemove={() => onRemoveExperience(index)}
          removeLabel={t('cv.editor.experience.removeLabel', {
            position: exp.position || t('cv.editor.entry')
          })}
        >
          <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field
                editable={editMode}
                label={t('cv.editor.experience.fields.position.label')}
                value={exp.position}
                onChange={(value) => onExperienceChange(index, 'position', value)}
                placeholder={t('cv.editor.experience.fields.position.placeholder')}
                required
              />
              <Field
                editable={editMode}
                label={t('cv.editor.experience.fields.company.label')}
                value={exp.company}
                onChange={(value) => onExperienceChange(index, 'company', value)}
                placeholder={t('cv.editor.experience.fields.company.placeholder')}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field
                editable={editMode}
                label={t('cv.startDate')}
                value={exp.startDate}
                onChange={(value) => onExperienceChange(index, 'startDate', value)}
                placeholder={t('cv.editor.experience.fields.startDate.placeholder')}
              />
              <Field
                editable={editMode && !exp.current}
                label={t('cv.endDate')}
                value={exp.current ? t('cv.present') : exp.endDate}
                onChange={(value) => onExperienceChange(index, 'endDate', value)}
                placeholder={t('cv.present')}
              />
            </div>
            {editMode && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => onExperienceChange(index, 'current', e.target.checked)}
                />
                {t('cv.editor.experience.currentlyWorking')}
              </label>
            )}
            <Field
              editable={editMode}
              label={t('cv.editor.experience.fields.description.label')}
              value={exp.description}
              onChange={(value) => onExperienceChange(index, 'description', value)}
              multiline
              rows={4}
              placeholder={t('cv.editor.experience.fields.description.placeholder')}
            />
          </div>
          {!editMode && exp.responsibilities && exp.responsibilities.length > 0 && (
            <ul style={{ fontSize: '13px', color: '#555', paddingLeft: '20px', margin: '8px 0' }}>
              {exp.responsibilities.map((resp, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{resp}</li>
              ))}
            </ul>
          )}
          {!editMode && exp.technologies && exp.technologies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {exp.technologies.map((tech, i) => (
                <span key={i} style={{
                  padding: '3px 10px',
                  background: '#e8f4f8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#0066cc'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddExperience}
            aria-label={t('cv.editor.experience.actions.addAria')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            {t('cv.editor.experience.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

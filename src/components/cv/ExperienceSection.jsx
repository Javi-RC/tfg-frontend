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
const TIMELINE_COLOR = '#4299e1';

export default function ExperienceSection({
  cv,
  editData,
  editMode,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
}) {
  const { t } = useTranslation();
  const experiences = editMode ? editData?.experience : cv?.experience;
  if (!experiences) return null;

  if (!editMode) {
    return (
      <section style={{ marginBottom: '48px' }} aria-labelledby="experience-heading">
        <SectionHeader id="experience-heading" title={t('cv.experience')} />
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          <div style={{
            position: 'absolute',
            left: '11px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'var(--color-border)',
            borderRadius: '1px',
          }} />
          {experiences.map((exp) => (
            <div key={exp._id} style={{ position: 'relative', paddingBottom: '28px' }}>
              <div style={{
                position: 'absolute',
                left: '-26px',
                top: '6px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: TIMELINE_COLOR,
                border: '3px solid white',
                boxShadow: '0 0 0 2px #4299e1',
              }} />
              <div style={{
                background: '#f0f8ff',
                borderRadius: '10px',
                padding: '16px 20px',
                border: '1px solid rgba(66, 153, 225, 0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
                      {exp.position}
                    </h3>
                    {exp.company && (
                      <p style={{ fontSize: '13px', color: TIMELINE_COLOR, fontWeight: 500, margin: '2px 0 0' }}>
                        {exp.company}
                      </p>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      whiteSpace: 'nowrap',
                      padding: '2px 10px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      flexShrink: 0,
                    }}>
                      {exp.startDate || '?'} — {exp.current ? t('cv.present') : (exp.endDate || '?')}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-body)', lineHeight: 1.6, margin: '8px 0 0' }}>
                    {exp.description}
                  </p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul style={{ fontSize: '13px', color: '#555', paddingLeft: '16px', margin: '8px 0 0', listStyle: 'none' }}>
                    {exp.responsibilities.map((resp) => (
                      <li key={resp} style={{ marginBottom: '3px', paddingLeft: '14px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, top: '7px', width: '5px', height: '5px', borderRadius: '50%', background: TIMELINE_COLOR, opacity: 0.5 }} />
                        {resp}
                      </li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} style={{
                        padding: '3px 12px',
                        background: 'white',
                        borderRadius: '14px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#0066cc',
                        border: '1px solid rgba(66, 153, 225, 0.2)',
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '48px' }} aria-labelledby="experience-heading">
      <SectionHeader id="experience-heading" title={t('cv.experience')} />
      {experiences.map((exp, index) => (
        <CVCard
          key={exp._id}
          editMode={editMode}
          borderColor={TIMELINE_COLOR}
          onRemove={() => onRemoveExperience(index)}
          removeLabel={t('cv.editor.experience.removeLabel', {
            position: exp.position || t('cv.editor.entry'),
          })}
        >
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <input type="checkbox" checked={exp.current || false} onChange={(e) => onExperienceChange(index, 'current', e.target.checked)} />
                {t('cv.editor.experience.currentlyWorking')}
              </label>
            )}
            <Field
              editable={editMode}
              label={t('cv.editor.experience.fields.description.label')}
              value={exp.description}
              onChange={(value) => onExperienceChange(index, 'description', value)}
              multiline rows={4}
              placeholder={t('cv.editor.experience.fields.description.placeholder')}
            />
          </div>
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton onClick={onAddExperience} aria-label={t('cv.editor.experience.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            {t('cv.editor.experience.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

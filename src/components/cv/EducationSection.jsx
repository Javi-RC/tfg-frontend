import React from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import EditableField from './EditableField';
import PrimaryButton from '../PrimaryButton';

const EDU_COLOR = '#48bb78';

export default function EducationSection({
  cv,
  editData,
  editMode,
  onEducationChange,
  onAddEducation,
  onRemoveEducation,
}) {
  const { t } = useTranslation();
  const education = editMode ? editData?.education : cv?.education;
  if (!education) return null;

  if (!editMode) {
    return (
      <section style={{ marginBottom: '48px' }} aria-labelledby="education-heading">
        <SectionHeader id="education-heading" title={t('cv.education')} />
        {education.map((edu) => (
          <CVCard key={edu._id} editMode={false} borderColor={EDU_COLOR}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(72, 187, 120, 0.1)', color: EDU_COLOR, flexShrink: 0, marginTop: '2px',
              }}>
                <GraduationCap size={18} />
              </div>
              <div style={{ flex: 1 }}>
                {edu.degree && (
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </h3>
                )}
                {edu.institution && (
                  <p style={{ fontSize: '13px', color: EDU_COLOR, fontWeight: 500, margin: '2px 0' }}>
                    {edu.institution}
                  </p>
                )}
                {(edu.startDate || edu.endDate) && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    {edu.startDate || '?'} — {edu.current ? t('cv.present') : (edu.endDate || '?')}
                  </p>
                )}
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ fontSize: '13px', color: '#555', paddingLeft: '16px', margin: '8px 0 0', listStyle: 'none' }}>
                    {edu.achievements.map((a) => (
                      <li key={a} style={{ marginBottom: '3px', paddingLeft: '14px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, top: '7px', width: '5px', height: '5px', borderRadius: '50%', background: EDU_COLOR, opacity: 0.4 }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CVCard>
        ))}
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '48px' }} aria-labelledby="education-heading">
      <SectionHeader id="education-heading" title={t('cv.education')} />
      {education.map((edu, index) => (
        <CVCard
          key={edu._id}
          editMode={editMode}
          borderColor={EDU_COLOR}
          onRemove={() => onRemoveEducation(index)}
          removeLabel={t('cv.editor.education.removeLabel', {
            degree: edu.degree || t('cv.editor.entry'),
          })}
        >
          <div style={{ display: 'grid', gap: '14px' }}>
            <EditableField label={t('cv.degree')} value={edu.degree} editMode={editMode} onChange={(value) => onEducationChange(index, 'degree', value)} required />
            <EditableField label={t('cv.fieldOfStudy')} value={edu.fieldOfStudy} editMode={editMode} onChange={(value) => onEducationChange(index, 'fieldOfStudy', value)} />
            <EditableField label={t('cv.institution')} value={edu.institution} editMode={editMode} onChange={(value) => onEducationChange(index, 'institution', value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <EditableField label={t('cv.startDate')} value={edu.startDate} editMode={editMode} onChange={(value) => onEducationChange(index, 'startDate', value)} />
              <EditableField label={t('cv.endDate')} value={edu.current ? t('cv.present') : edu.endDate} editMode={editMode && !edu.current} onChange={(value) => onEducationChange(index, 'endDate', value)} />
            </div>
            {editMode && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <input type="checkbox" checked={edu.current || false} onChange={(e) => onEducationChange(index, 'current', e.target.checked)} />
                {t('cv.editor.education.currentlyStudying')}
              </label>
            )}
          </div>
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton onClick={onAddEducation} aria-label={t('cv.editor.education.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            {t('cv.editor.education.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

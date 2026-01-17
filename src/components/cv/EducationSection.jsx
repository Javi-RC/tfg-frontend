import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import EditableField from './EditableField';
import PrimaryButton from '../PrimaryButton';

/**
 * EducationSection Component
 * Education section
 */
export default function EducationSection({ 
  cv,
  editData,
  editMode,
  onEducationChange,
  onAddEducation,
  onRemoveEducation
}) {
  const { t } = useTranslation();
  const education = editMode ? editData?.education : cv?.education;
  if (!education) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="education-heading">
      <SectionHeader 
        id="education-heading" 
        title={t('cv.education')} 
      />
      {education.map((edu, index) => (
        <CVCard
          key={edu._id || index}
          editMode={editMode}
          borderColor="#48bb78"
          onRemove={() => onRemoveEducation(index)}
          removeLabel={t('cv.editor.education.removeLabel', {
            degree: edu.degree || t('cv.editor.entry')
          })}
        >
          <div style={{ display: 'grid', gap: '16px' }}>
            <EditableField
              label={t('cv.degree')}
              value={edu.degree}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'degree', value)}
              required
            />
            <EditableField
              label={t('cv.fieldOfStudy')}
              value={edu.fieldOfStudy}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'fieldOfStudy', value)}
            />
            <EditableField
              label={t('cv.institution')}
              value={edu.institution}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'institution', value)}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <EditableField
                label={t('cv.startDate')}
                value={edu.startDate}
                editMode={editMode}
                onChange={(value) => onEducationChange(index, 'startDate', value)}
              />
              <EditableField
                label={t('cv.endDate')}
                value={edu.current ? t('cv.present') : edu.endDate}
                editMode={editMode && !edu.current}
                onChange={(value) => onEducationChange(index, 'endDate', value)}
              />
            </div>
            {editMode && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={edu.current || false}
                  onChange={(e) => onEducationChange(index, 'current', e.target.checked)}
                />
                {t('cv.editor.education.currentlyStudying')}
              </label>
            )}
          </div>
          {!editMode && edu.achievements && edu.achievements.length > 0 && (
            <ul style={{ fontSize: '13px', color: '#555', paddingLeft: '20px', marginTop: '8px' }}>
              {edu.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          )}
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddEducation}
            aria-label={t('cv.editor.education.actions.addAria')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            {t('cv.editor.education.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

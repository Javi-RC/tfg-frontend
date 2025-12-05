import React from 'react';
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
  const education = editMode ? editData?.education : cv?.education;
  if (!education) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="education-heading">
      <SectionHeader 
        id="education-heading" 
        title="Education" 
      />
      {education.map((edu, index) => (
        <CVCard
          key={edu._id || index}
          editMode={editMode}
          borderColor="#48bb78"
          onRemove={() => onRemoveEducation(index)}
          removeLabel={`Remove education: ${edu.degree || 'entry'}`}
        >
          <div style={{ display: 'grid', gap: '16px' }}>
            <EditableField
              label="Degree"
              value={edu.degree}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'degree', value)}
              required
            />
            <EditableField
              label="Field of Study"
              value={edu.fieldOfStudy}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'fieldOfStudy', value)}
            />
            <EditableField
              label="Institution"
              value={edu.institution}
              editMode={editMode}
              onChange={(value) => onEducationChange(index, 'institution', value)}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <EditableField
                label="Start Date"
                value={edu.startDate}
                editMode={editMode}
                onChange={(value) => onEducationChange(index, 'startDate', value)}
              />
              <EditableField
                label="End Date"
                value={edu.current ? 'Present' : edu.endDate}
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
                Currently studying
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
            aria-label="Add new education entry"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Education
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

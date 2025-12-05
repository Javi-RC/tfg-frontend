import React from 'react';
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
  const experiences = editMode ? editData?.experience : cv?.experience;
  if (!experiences) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="experience-heading">
      <SectionHeader 
        id="experience-heading" 
        title="Experience" 
      />
      {experiences.map((exp, index) => (
        <CVCard
          key={exp._id || index}
          editMode={editMode}
          borderColor="#4299e1"
          onRemove={() => onRemoveExperience(index)}
          removeLabel={`Remove experience: ${exp.position || 'entry'}`}
        >
          <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field
                editable={editMode}
                label="Position"
                value={exp.position}
                onChange={(value) => onExperienceChange(index, 'position', value)}
                placeholder="e.g. Senior Developer"
                required
              />
              <Field
                editable={editMode}
                label="Company"
                value={exp.company}
                onChange={(value) => onExperienceChange(index, 'company', value)}
                placeholder="e.g. TechCorp"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field
                editable={editMode}
                label="Start Date"
                value={exp.startDate}
                onChange={(value) => onExperienceChange(index, 'startDate', value)}
                placeholder="e.g. Jan 2020"
              />
              <Field
                editable={editMode && !exp.current}
                label="End Date"
                value={exp.current ? 'Present' : exp.endDate}
                onChange={(value) => onExperienceChange(index, 'endDate', value)}
                placeholder="e.g. Present"
              />
            </div>
            {editMode && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => onExperienceChange(index, 'current', e.target.checked)}
                />
                Currently working here
              </label>
            )}
            <Field
              editable={editMode}
              label="Description"
              value={exp.description}
              onChange={(value) => onExperienceChange(index, 'description', value)}
              multiline
              rows={4}
              placeholder="Describe your role and achievements..."
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
            aria-label="Add new experience entry"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Experience
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

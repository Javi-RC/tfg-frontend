import React from 'react';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

/**
 * ProjectsSection Component
 * Projects section
 */
export default function ProjectsSection({ 
  cv,
  editData,
  editMode,
  onProjectChange,
  onAddProject,
  onRemoveProject
}) {
  const projects = editMode ? editData?.projects : cv?.projects;
  if (!projects) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="projects-heading">
      <SectionHeader 
        id="projects-heading" 
        title="Projects" 
      />
      {projects.map((project, index) => (
        <CVCard
          key={project._id || index}
          editMode={editMode}
          borderColor="#9f7aea"
          onRemove={() => onRemoveProject(index)}
          removeLabel={`Remove project: ${project.name || 'entry'}`}
        >
          {editMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <EditableField
                label="Project Name"
                value={project.name}
                editMode={true}
                onChange={(value) => onProjectChange(index, 'name', value)}
                required
              />
              <EditableField
                label="URL"
                value={project.url}
                editMode={true}
                onChange={(value) => onProjectChange(index, 'url', value)}
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <EditableTextarea
                  label="Description"
                  value={project.description}
                  editMode={true}
                  onChange={(value) => onProjectChange(index, 'description', value)}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <EditableField
                  label="Technologies (comma-separated)"
                  value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                  editMode={true}
                  onChange={(value) => onProjectChange(index, 'technologies', value)}
                />
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
                    {project.name} ↗
                  </a>
                ) : project.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                {project.description}
              </p>
              {project.technologies && project.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.technologies.map((tech, i) => (
                    <span key={i} style={{
                      padding: '3px 10px',
                      background: '#f0f0f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddProject}
            aria-label="Add new project"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Project
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

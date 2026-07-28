import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import EditableField from './EditableField';
import EditableTextarea from './EditableTextarea';
import PrimaryButton from '../PrimaryButton';

const PROJ_COLOR = '#9f7aea';

export default function ProjectsSection({
  cv,
  editData,
  editMode,
  onProjectChange,
  onAddProject,
  onRemoveProject,
}) {
  const { t } = useTranslation();
  const projects = editMode ? editData?.projects : cv?.projects;
  if (!projects) return null;

  if (!editMode) {
    return (
      <section style={{ marginBottom: '48px' }} aria-labelledby="projects-heading">
        <SectionHeader id="projects-heading" title={t('cv.editor.projects.sectionTitle')} />
        {projects.map((project) => (
          <CVCard key={project._id} editMode={false} borderColor={PROJ_COLOR}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(159, 122, 234, 0.1)', color: PROJ_COLOR, flexShrink: 0, marginTop: '2px',
              }}>
                <ExternalLink size={16} />
              </div>
              <div style={{ flex: 1 }}>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', fontWeight: 600, color: PROJ_COLOR, textDecoration: 'none' }}>
                    {project.name} ↗
                  </a>
                ) : (
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{project.name}</h3>
                )}
                {project.description && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-body)', lineHeight: 1.6, margin: '4px 0 0' }}>
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {project.technologies.map((tech) => (
                      <span key={tech} style={{
                        padding: '2px 10px',
                        background: 'rgba(159, 122, 234, 0.08)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: PROJ_COLOR,
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CVCard>
        ))}
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '48px' }} aria-labelledby="projects-heading">
      <SectionHeader id="projects-heading" title={t('cv.editor.projects.sectionTitle')} />
      {projects.map((project, index) => (
        <CVCard key={project._id} editMode={editMode} borderColor={PROJ_COLOR} onRemove={() => onRemoveProject(index)} removeLabel={t('cv.editor.projects.removeLabel', { name: project.name || t('cv.editor.entry') })}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <EditableField label={t('cv.editor.projects.fields.name.label')} value={project.name} editMode onChange={(value) => onProjectChange(index, 'name', value)} required />
            <EditableField label={t('cv.editor.projects.fields.url.label')} value={project.url} editMode onChange={(value) => onProjectChange(index, 'url', value)} />
            <div style={{ gridColumn: '1 / -1' }}>
              <EditableTextarea label={t('cv.editor.projects.fields.description.label')} value={project.description} editMode onChange={(value) => onProjectChange(index, 'description', value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <EditableField label={t('cv.editor.projects.fields.technologies.label')} value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies} editMode onChange={(value) => onProjectChange(index, 'technologies', value)} />
            </div>
          </div>
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton onClick={onAddProject} aria-label={t('cv.editor.projects.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            {t('cv.editor.projects.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

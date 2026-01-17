import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin } from 'lucide-react';

/**
 * AdminCVDetailPanel
 * Shows detailed information about a selected CV.
 */
export default function AdminCVDetailPanel({ cv, onClose }) {
  const { t } = useTranslation();
  const email = cv.contact?.email || t('cv.noEmail');
  const phone = cv.contact?.phones?.[0]?.number || null;
  const location = cv.contact?.location?.fullLocation || null;
  const linkedin = cv.contact?.links?.linkedin || null;
  const github = cv.contact?.links?.github || null;
  const technicalSkills = cv.skills?.technical || [];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}
      role="complementary"
      aria-label={t('cv.admin.detailPanel.aria.panel')}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}
        >
          {t('cv.admin.detailPanel.title')}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px'
          }}
          aria-label={t('cv.admin.detailPanel.aria.close')}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          {email.split('@')[0] || t('cv.unnamed')}
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          {email}
        </p>
        {phone && (
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Phone size={16} />
            <span>{phone}</span>
          </p>
        )}
        {location && (
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MapPin size={16} />
            <span>{location}</span>
          </p>
        )}
        {linkedin && (
          <p style={{ fontSize: '13px', marginTop: '8px' }}>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
              {t('cv.linkedin')} ↗
            </a>
          </p>
        )}
        {github && (
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            <a href={github} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
              {t('cv.github')} ↗
            </a>
          </p>
        )}
      </div>

      {technicalSkills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            {t('cv.editor.skills.sectionTitle')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {technicalSkills.map((skill, index) => (
              <span
                key={skill._id || index}
                style={{
                  padding: '4px 12px',
                  background: skill.category === 'framework' ? '#e8f4f8' : '#f0f0f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: skill.category === 'framework' ? '#0066cc' : '#333'
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.languages && cv.languages.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            {t('cv.languages')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {cv.languages.map((lang, index) => (
              <span
                key={lang._id || index}
                style={{
                  padding: '4px 12px',
                  background: '#e8f4f8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#0066cc'
                }}
              >
                {typeof lang === 'string' ? lang : `${lang.language} (${lang.level})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.experience && cv.experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('cv.experience')}
          </h4>
          {cv.experience.map((exp, index) => (
            <div
              key={exp._id || index}
              style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: index < cv.experience.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{exp.position}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{exp.company}</p>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                {exp.startDate} - {exp.current ? t('cv.present') : exp.endDate}
              </p>
            </div>
          ))}
        </div>
      )}

      {cv.education && cv.education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('cv.education')}
          </h4>
          {cv.education.map((edu, index) => (
            <div
              key={edu._id || index}
              style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: index < cv.education.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{edu.degree}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{edu.institution}</p>
              {edu.fieldOfStudy && (
                <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{edu.fieldOfStudy}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('cv.editor.projects.sectionTitle')}
          </h4>
          {cv.projects.map((project, index) => (
            <div
              key={project._id || index}
              style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: index < cv.projects.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'none' }}
                  >
                    {project.name} ↗
                  </a>
                ) : (
                  project.name
                )}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {cv.certifications && cv.certifications.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('cv.certifications')}
          </h4>
          {cv.certifications.map((cert, index) => (
            <div
              key={cert._id || index}
              style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: index < cv.certifications.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{cert.name}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {cert.issuer} • {cert.dateObtained}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

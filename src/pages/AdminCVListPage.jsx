import React, { useState, useEffect, useContext } from 'react';
import { getAllCVs } from '../api/cv';
import { AuthContext } from '../contexts/AuthContext';
import SecondaryButton from '../components/SecondaryButton';
import CVSearchPanel from '../components/CVSearchPanel';

/**
 * AdminCVListPage Component
 * Admin-only page to view and manage all CVs
 */
export default function AdminCVListPage() {
  const { user } = useContext(AuthContext);
  const [cvs, setCVs] = useState([]);
  const [filteredCVs, setFilteredCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (user?.role !== 'org_admin') {
      setError('Unauthorized access. Admin privileges required.');
      setLoading(false);
      return;
    }
    loadAllCVs();
  }, [user]);

  const loadAllCVs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllCVs();
      // Backend response: { success: true, count: 15, cvs: [...] }
      const cvsData = response.data?.cvs || response.data;
      setCVs(cvsData);
      setFilteredCVs(cvsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setFilteredCVs(results);
  };

  const handleResetSearch = () => {
    setFilteredCVs(cvs);
    setShowSearch(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">Loading CVs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }} role="alert" aria-live="assertive">
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true">🚫</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Access Denied
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {error}
          </p>
          <SecondaryButton onClick={() => window.location.href = '/'} aria-label="Go back to home page">
            Go Back
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '124px 24px 60px'
    }} role="main" aria-label="Admin CV list page">
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            All CVs ({filteredCVs.length})
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SecondaryButton onClick={() => setShowSearch(!showSearch)} aria-label={showSearch ? 'Hide search panel' : 'Show search panel'}>
              {showSearch ? 'Hide Search' : 'Search CVs'}
            </SecondaryButton>
            {filteredCVs.length !== cvs.length && (
              <SecondaryButton onClick={handleResetSearch} aria-label="Reset search filters">
                Reset Filters
              </SecondaryButton>
            )}
            <SecondaryButton onClick={loadAllCVs} aria-label="Refresh CV list">
              Refresh
            </SecondaryButton>
          </div>
        </div>

        {showSearch && (
          <div style={{ marginBottom: '24px' }}>
            <CVSearchPanel 
              onSearchResults={handleSearchResults}
              totalCVs={cvs.length}
            />
          </div>
        )}

        {filteredCVs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }} role="status">
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true">📄</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
              No CVs Found
            </h2>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {cvs.length === 0 ? 'No CVs have been uploaded yet.' : 'No CVs match your search criteria.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedCV ? '1fr 400px' : '1fr',
            gap: '24px'
          }}>
            <div style={{
              display: 'grid',
              gap: '20px'
            }} role="list" aria-label="List of CVs">
              {filteredCVs.map((cv) => (
                <CVCard
                  key={cv._id}
                  cv={cv}
                  onClick={() => setSelectedCV(cv)}
                  isSelected={selectedCV?._id === cv._id}
                />
              ))}
            </div>

            {selectedCV && (
              <div style={{
                position: 'sticky',
                top: '20px',
                height: 'fit-content'
              }}>
                <CVDetailPanel
                  cv={selectedCV}
                  onClose={() => setSelectedCV(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CVCard Component
 * Displays a CV in card format
 */
function CVCard({ cv, onClick, isSelected }) {
  const email = cv.contact?.email || 'No email';
  const location = cv.contact?.location?.city || '';
  const skillsCount = cv.skills?.technical?.length || 0;
  const languagesCount = cv.languages?.length || 0;
  const experienceCount = cv.experience?.length || 0;
  
  return (
    <div
      onClick={onClick}
      role="listitem"
      tabIndex={0}
      aria-label={`CV for ${email.split('@')[0]}, ${email}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isSelected ? '2px solid #111' : '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '4px'
          }}>
            {email.split('@')[0] || 'Unnamed'}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {email}
          </p>
          {location && (
            <p style={{
              fontSize: '13px',
              color: '#999',
              marginTop: '4px'
            }}>
              <span aria-hidden="true">📍</span> {location}
            </p>
          )}
        </div>
        <div style={{
          padding: '4px 12px',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          processed
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {skillsCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666' }}>
            <span aria-hidden="true">💼</span> {skillsCount} skills
          </div>
        )}
        {languagesCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666' }}>
            <span aria-hidden="true">🌍</span> {languagesCount} languages
          </div>
        )}
        {experienceCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666' }}>
            <span aria-hidden="true">📋</span> {experienceCount} experiences
          </div>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#999' }}>
        Uploaded: {cv.processingDate ? new Date(cv.processingDate).toLocaleDateString() : '—'}
      </p>
    </div>
  );
}

/**
 * CVDetailPanel Component
 * Shows detailed information about a selected CV
 */
function CVDetailPanel({ cv, onClose }) {
  const email = cv.contact?.email || 'No email';
  const phone = cv.contact?.phones?.[0]?.number || null;
  const location = cv.contact?.location?.fullLocation || null;
  const linkedin = cv.contact?.links?.linkedin || null;
  const github = cv.contact?.links?.github || null;
  const technicalSkills = cv.skills?.technical || [];
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px 28px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }} role="complementary" aria-label="CV details panel">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          CV Details
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
          aria-label="Close CV details panel"
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          {email.split('@')[0] || 'Unnamed'}
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          {email}
        </p>
        {phone && (
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            <span aria-hidden="true">📱</span> {phone}
          </p>
        )}
        {location && (
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            <span aria-hidden="true">📍</span> {location}
          </p>
        )}
        {linkedin && (
          <p style={{ fontSize: '13px', marginTop: '8px' }}>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
              LinkedIn ↗
            </a>
          </p>
        )}
        {github && (
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            <a href={github} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
              GitHub ↗
            </a>
          </p>
        )}
      </div>

      {technicalSkills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            Technical Skills
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {technicalSkills.map((skill, index) => (
              <span key={skill._id || index} style={{
                padding: '4px 12px',
                background: skill.category === 'framework' ? '#e8f4f8' : '#f0f0f0',
                borderRadius: '12px',
                fontSize: '12px',
                color: skill.category === 'framework' ? '#0066cc' : '#333'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.languages && cv.languages.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            Languages
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {cv.languages.map((lang, index) => (
              <span key={lang._id || index} style={{
                padding: '4px 12px',
                background: '#e8f4f8',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#0066cc'
              }}>
                {typeof lang === 'string' ? lang : `${lang.language} (${lang.level})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.experience && cv.experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Experience
          </h4>
          {cv.experience.map((exp, index) => (
            <div key={exp._id || index} style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: index < cv.experience.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {exp.position}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {exp.company}
              </p>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
            </div>
          ))}
        </div>
      )}

      {cv.education && cv.education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Education
          </h4>
          {cv.education.map((edu, index) => (
            <div key={edu._id || index} style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: index < cv.education.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {edu.degree}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {edu.institution}
              </p>
              {edu.fieldOfStudy && (
                <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                  {edu.fieldOfStudy}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Projects
          </h4>
          {cv.projects.map((project, index) => (
            <div key={project._id || index} style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: index < cv.projects.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
                    {project.name} ↗
                  </a>
                ) : project.name}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {cv.certifications && cv.certifications.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Certifications
          </h4>
          {cv.certifications.map((cert, index) => (
            <div key={cert._id || index} style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: index < cv.certifications.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {cert.name}
              </p>
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

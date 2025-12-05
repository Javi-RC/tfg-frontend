import React, { useState, useEffect } from 'react';
import { getCVStats } from '../api/cv';
import SecondaryButton from '../components/SecondaryButton';

/**
 * CVStatsPage Component
 * Displays statistics about the user's CV
 */
export default function CVStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCVStats();
      // Backend response: { success: true, stats: {...} }
      const statsData = response.data?.stats || response.data;
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading statistics');
    } finally {
      setLoading(false);
    }
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
        <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">Loading statistics...</p>
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
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true">📊</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            Error Loading Statistics
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {error}
          </p>
          <SecondaryButton onClick={loadStats} aria-label="Try loading statistics again">
            Try Again
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }} role="status">No statistics available</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '124px 24px 60px'
    }} role="main" aria-label="CV statistics page">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            CV Statistics
          </h1>
          <SecondaryButton onClick={loadStats} aria-label="Refresh statistics data">
            Refresh
          </SecondaryButton>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }} role="region" aria-label="Statistics summary">
          <StatCard
            icon="💼"
            title="Total Skills"
            value={stats.totalSkills || 0}
            description="Technical skills"
            color="#0066cc"
          />
          <StatCard
            icon="🎓"
            title="Education"
            value={stats.totalEducation || 0}
            description="Academic degrees"
            color="#27ae60"
          />
          <StatCard
            icon="📋"
            title="Experience"
            value={stats.totalExperience || 0}
            description="Work experiences"
            color="#f39c12"
          />
          <StatCard
            icon="🚀"
            title="Projects"
            value={stats.totalProjects || 0}
            description="Personal projects"
            color="#9b59b6"
          />
          <StatCard
            icon="🏆"
            title="Certifications"
            value={stats.totalCertifications || 0}
            description="Professional certs"
            color="#e74c3c"
          />
          <StatCard
            icon="🌍"
            title="Languages"
            value={stats.totalLanguages || 0}
            description="Spoken languages"
            color="#16a085"
          />
        </div>

        {/* Top Skills */}
        {stats.topSkills && stats.topSkills.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            marginBottom: '32px'
          }} role="region" aria-label="Top skills">
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              Top Skills
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }} role="list">
              {stats.topSkills.map((skill, index) => (
                <span key={index} role="listitem" style={{
                  padding: '8px 16px',
                  background: index < 3 ? '#e8f4f8' : '#f0f0f0',
                  border: index < 3 ? '1px solid #0066cc' : 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: index < 3 ? '600' : '400',
                  color: index < 3 ? '#0066cc' : '#333'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {stats.lastUpdated && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }} role="contentinfo" aria-label="Last update information">
            <p style={{
              fontSize: '14px',
              color: '#666'
            }}>
              Last updated: <strong>{new Date(stats.lastUpdated).toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StatCard Component
 * Displays a statistical metric in a card
 */
function StatCard({ icon, title, value, description, color = '#333' }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px 24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
    role="article"
    aria-label={`${title}: ${value} ${description}`}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        fontSize: '40px',
        marginBottom: '12px',
        opacity: 0.8
      }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '32px',
        fontWeight: '700',
        color,
        marginBottom: '4px'
      }}>
        {value}
      </p>
      <p style={{
        fontSize: '13px',
        color: '#999'
      }}>
        {description}
      </p>
    </div>
  );
}

/**
 * SkillBar Component
 * Displays a skill with a horizontal bar indicating frequency
 */
function SkillBar({ skill, count, maxCount, color = '#27ae60' }) {
  const percentage = (count / maxCount) * 100;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          {skill}
        </span>
        <span style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {count}
        </span>
      </div>
      <div style={{
        height: '8px',
        background: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ProjectsTab
 */
export default function ProjectsTab({ organizationId, isAdmin, styles }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadProjects();
    if (isAdmin) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { getOrganizationProjects } = await import('../../../api/projects');
      const res = await getOrganizationProjects(organizationId);
      const data = res.data?.success ? res.data.data : res.data;
      setProjects(data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { getOrganizationProjectStats } = await import('../../../api/projects');
      const res = await getOrganizationProjectStats(organizationId);
      const data = res.data?.success ? res.data.data : res.data;
      setStats(data);
    } catch (err) {
      console.error('Error loading project stats:', err);
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>{t('organization.projects.loading')}</p>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{t('organization.projects.title')}</h2>
      </div>

      {/* Stats Cards */}
      {isAdmin && stats && (
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total || 0}</div>
            <div style={styles.statLabel}>{t('organization.projects.totalProjects')}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.byStatus?.active || 0}</div>
            <div style={styles.statLabel}>{t('organization.projects.active')}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.byStatus?.completed || 0}</div>
            <div style={styles.statLabel}>{t('organization.projects.completed')}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalAssignedEmployees || 0}</div>
            <div style={styles.statLabel}>{t('organization.projects.teamMembers')}</div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <FolderOpen size={48} color="#999" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>{t('organization.projects.noProjects')}</p>
        </div>
      ) : (
        <div style={styles.projectsList}>
          {projects.map((project) => (
            <div key={project._id} style={styles.projectCard}>
              <div style={styles.projectHeader}>
                <div>
                  <h3 style={styles.projectName}>{project.projectName}</h3>
                  <p style={styles.projectDescription}>
                    {project.briefDescription?.substring(0, 100)}
                    {project.briefDescription?.length > 100 && '...'}
                  </p>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      project.status === 'active'
                        ? '#e8f5e9'
                        : project.status === 'draft'
                          ? '#f3f4f6'
                          : project.status === 'completed'
                            ? '#e3f2fd'
                            : '#ffebee',
                    color:
                      project.status === 'active'
                        ? '#2e7d32'
                        : project.status === 'draft'
                          ? '#6b7280'
                          : project.status === 'completed'
                            ? '#1976d2'
                            : '#c62828'
                  }}
                >
                  {project.status}
                </span>
              </div>
              <div style={styles.projectInfo}>
                <div>
                  <strong>{t('organization.projects.pm')}:</strong> {project.projectManager?.name || 'N/A'}
                </div>
                <div>
                  <strong>{t('organization.projects.team')}:</strong> {project.assignedEmployeesCount || 0} {t('organization.projects.members')}
                </div>
                <div>
                  <strong>{t('organization.projects.riskScore')}:</strong> {project.riskScore || 0}
                </div>
              </div>
              <div style={styles.projectActions}>
                <button style={styles.actionButton} onClick={() => navigate(`/projects/${project._id}`)}>
                  {t('organization.projects.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

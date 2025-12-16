import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  getProjectById,
  deleteProject,
  activateProject,
  completeProject,
  cancelProject,
  assignEmployeeToProject,
  removeEmployeeFromProject
} from '../api/projects';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import EmployeeAssignmentModal from '../components/projects/EmployeeAssignmentModal';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Project Detail Page
 * Displays complete project information with management capabilities
 */
export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isAdmin = user?.role === 'org_admin';
  const isProjectManager = project?.projectManager?._id === user?.id;
  const canEdit = isProjectManager || isAdmin;
  const canDelete = isAdmin;

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id, true);
      const data = res.data?.success ? res.data.data : res.data;
      setProject(data);
    } catch (error) {
      alert(error.response?.data?.error || 'Error loading project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
      return;
    }

    try {
      await deleteProject(id);
      alert('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting project');
    }
  };

  const handleActivate = async () => {
    try {
      await activateProject(id);
      alert('Project activated successfully');
      loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error activating project');
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Mark this project as completed?')) {
      return;
    }

    try {
      await completeProject(id);
      alert('Project completed successfully');
      loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error completing project');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this project?')) {
      return;
    }

    try {
      await cancelProject(id);
      alert('Project cancelled');
      loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error cancelling project');
    }
  };

  const handleAssignEmployee = async (employeeId, assignedRole) => {
    try {
      await assignEmployeeToProject(id, { employeeId, assignedRole });
      alert('Employee assigned successfully');
      setShowAssignModal(false);
      loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error assigning employee');
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm('Remove this employee from the project?')) {
      return;
    }

    try {
      await removeEmployeeFromProject(id, employeeId);
      alert('Employee removed successfully');
      loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error removing employee');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Project not found</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>
        
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>{project.projectName}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          
          <div style={styles.headerActions}>
            {canEdit && project.status === PROJECT_STATUS.DRAFT && (
              <PrimaryButton onClick={handleActivate}>
                Activate Project
              </PrimaryButton>
            )}
            {canEdit && project.status === PROJECT_STATUS.ACTIVE && (
              <PrimaryButton onClick={handleComplete}>
                Complete Project
              </PrimaryButton>
            )}
            {canEdit && (
              <SecondaryButton onClick={() => navigate(`/projects/${id}/edit`)}>
                Edit
              </SecondaryButton>
            )}
            {canDelete && project.status !== PROJECT_STATUS.CANCELLED && (
              <SecondaryButton onClick={handleCancel}>
                Cancel Project
              </SecondaryButton>
            )}
            {canDelete && (
              <button style={styles.deleteButton} onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'overview' && styles.tabActive)
          }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'team' && styles.tabActive)
          }}
          onClick={() => setActiveTab('team')}
        >
          Team ({project.assignedEmployeesCount || 0})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'details' && styles.tabActive)
          }}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && (
          <div>
            {/* Basic Info */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Project Information</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Project Manager</span>
                  <span style={styles.infoValue}>{project.projectManager?.name || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Start Date</span>
                  <span style={styles.infoValue}>{formatDate(project.estimatedStartDate)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>End Date</span>
                  <span style={styles.infoValue}>{formatDate(project.estimatedEndDate)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Duration</span>
                  <span style={styles.infoValue}>
                    {project.expectedDuration?.value} {project.expectedDuration?.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{project.briefDescription}</p>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <div style={styles.teamHeader}>
              <h3 style={styles.sectionTitle}>Team Members</h3>
              {canEdit && project.status !== PROJECT_STATUS.COMPLETED && (
                <PrimaryButton onClick={() => setShowAssignModal(true)}>
                  + Assign Employee
                </PrimaryButton>
              )}
            </div>

            {/* Project Manager */}
            <div style={styles.pmSection}>
              <h4 style={styles.subsectionTitle}>Project Manager</h4>
              <div style={styles.memberCard}>
                <div style={styles.memberInfo}>
                  <div style={styles.memberName}>{project.projectManager?.name}</div>
                  <div style={styles.memberEmail}>{project.projectManager?.email}</div>
                </div>
                <div style={styles.memberRole}>Project Manager</div>
              </div>
            </div>

            {/* Team Members */}
            <div style={styles.membersSection}>
              <h4 style={styles.subsectionTitle}>
                Team Members ({project.assignedEmployees?.length || 0})
              </h4>
              {project.assignedEmployees && project.assignedEmployees.length > 0 ? (
                <div style={styles.membersList}>
                  {project.assignedEmployees.map((emp) => (
                    <div key={emp.user._id} style={styles.memberCard}>
                      <div style={styles.memberInfo}>
                        <div style={styles.memberName}>{emp.user.name}</div>
                        <div style={styles.memberEmail}>{emp.user.email}</div>
                        {emp.assignedRole && (
                          <div style={styles.memberPosition}>{emp.assignedRole}</div>
                        )}
                        <div style={styles.memberDate}>
                          Joined: {formatDate(emp.assignedAt)}
                        </div>
                      </div>
                      {canEdit && project.status !== PROJECT_STATUS.COMPLETED && (
                        <button
                          style={styles.removeButton}
                          onClick={() => handleRemoveEmployee(emp.user._id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No team members assigned yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>Technical Requirements</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Experience Level</span>
                  <span style={styles.infoValue}>
                    {project.requiredExperienceLevel || 'N/A'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>System Complexity</span>
                  <span style={styles.infoValue}>
                    {project.systemComplexity || 'N/A'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Documentation Level</span>
                  <span style={styles.infoValue}>
                    {project.documentationLevel || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>Management</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Management Method</span>
                  <span style={styles.infoValue}>
                    {project.managementMethod || 'N/A'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Standup Frequency</span>
                  <span style={styles.infoValue}>
                    {project.followUpFrequency?.standups?.frequency || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Assignment Modal */}
      {showAssignModal && (
        <EmployeeAssignmentModal
          organizationId={project.organization}
          currentEmployees={project.assignedEmployees || []}
          onAssign={handleAssignEmployee}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  header: {
    marginBottom: '32px'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 0'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  deleteButton: {
    padding: '14px 40px',
    borderRadius: '32px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEE2E2',
    color: '#DC2626',
    transition: 'all 0.2s'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid #E5E7EB'
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6B7280',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#111',
    borderBottomColor: '#111'
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #E5E7EB'
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  infoLabel: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '15px',
    color: '#111',
    fontWeight: '600'
  },
  description: {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.7',
    margin: 0
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pmSection: {
    marginBottom: '32px'
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '12px'
  },
  memberCard: {
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  memberName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  memberEmail: {
    fontSize: '14px',
    color: '#6B7280'
  },
  memberPosition: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  memberRole: {
    padding: '6px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  memberDate: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  removeButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEE2E2',
    color: '#DC2626',
    transition: 'all 0.2s'
  },
  membersSection: {
    marginTop: '24px'
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#6B7280',
    margin: 0
  },
  detailsSection: {
    marginBottom: '32px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '60px'
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626',
    padding: '60px',
    fontSize: '16px'
  }
};

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  getOrganizationById,
  getOrganizationEmployees,
  getOrganizationCVs,
  getOrganizationStats,
  updateOrganizationSettings,
  addEmployee,
  removeEmployee,
  updateEmployeeStatus,
  updateCVStatus
} from '../api/organization';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * OrganizationDetailPage
 * Displays organization details with tabs for employees and CVs
 */
export default function OrganizationDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'org_admin';

  useEffect(() => {
    loadOrganization();
    if (isAdmin) {
      loadStats();
    }
  }, [id]);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      const res = await getOrganizationById(id);
      // La API devuelve { success: true, data: {...} }
      if (res.data?.success && res.data?.data) {
        setOrganization(res.data.data);
      } else if (res.data && !res.data.success) {
        // Axios ya extrajo el data
        setOrganization(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error loading organization');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getOrganizationStats(id);
      // La API devuelve { success: true, data: {...} }
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      } else if (res.data && !res.data.success) {
        // Axios ya extrajo el data
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading organization...</p>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error || 'Organization not found'}</p>
          <SecondaryButton onClick={() => navigate('/organizations')}>
            Back to Organizations
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button style={styles.backButton} onClick={() => navigate('/organizations')}>
            ← Back
          </button>
        </div>
        
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{organization.name}</h1>
            {organization.description && (
              <p style={styles.description}>{organization.description}</p>
            )}
            <div style={styles.badges}>
              <span style={{
                ...styles.badge,
                background: organization.status === 'active' ? '#e8f5e9' : '#ffebee',
                color: organization.status === 'active' ? '#2e7d32' : '#c62828'
              }}>
                {organization.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              {organization.industry && (
                <span style={styles.badge}>{organization.industry}</span>
              )}
              {organization.size && (
                <span style={styles.badge}>{organization.size} employees</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section (Admin only) */}
      {isAdmin && stats && (
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalEmployees}</div>
            <div style={styles.statLabel}>Total Employees</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.activeEmployees}</div>
            <div style={styles.statLabel}>Active Employees</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.pendingEmployees}</div>
            <div style={styles.statLabel}>Pending Employees</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.inactiveEmployees}</div>
            <div style={styles.statLabel}>Inactive Employees</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'overview' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={activeTab === 'employees' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button
          style={activeTab === 'projects' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        {isAdmin && (
          <button
            style={activeTab === 'cvs' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('cvs')}
          >
            CVs
          </button>
        )}
        {isAdmin && (
          <button
            style={activeTab === 'settings' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && (
          <OverviewTab organization={organization} />
        )}
        {activeTab === 'employees' && (
          <EmployeesTab 
            organizationId={id} 
            isAdmin={isAdmin}
            onUpdate={loadStats}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab 
            organizationId={id}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'cvs' && isAdmin && (
          <CVsTab 
            organizationId={id}
            onUpdate={loadStats}
          />
        )}
        {activeTab === 'settings' && isAdmin && (
          <SettingsTab 
            organization={organization}
            onUpdate={loadOrganization}
          />
        )}
      </div>
    </div>
  );
}

/**
 * ProjectsTab Component
 */
function ProjectsTab({ organizationId, isAdmin }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadProjects();
    if (isAdmin) {
      loadStats();
    }
  }, [organizationId]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { getOrganizationProjects } = await import('../api/projects');
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
      const { getOrganizationProjectStats } = await import('../api/projects');
      const res = await getOrganizationProjectStats(organizationId);
      const data = res.data?.success ? res.data.data : res.data;
      setStats(data);
    } catch (err) {
      console.error('Error loading project stats:', err);
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading projects...</p>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Projects</h2>
      </div>

      {/* Stats Cards */}
      {isAdmin && stats && (
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total || 0}</div>
            <div style={styles.statLabel}>Total Projects</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.byStatus?.active || 0}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.byStatus?.completed || 0}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalAssignedEmployees || 0}</div>
            <div style={styles.statLabel}>Team Members</div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <p style={styles.emptyText}>No projects found for this organization</p>
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
                <span style={{
                  ...styles.statusBadge,
                  background: 
                    project.status === 'active' ? '#e8f5e9' :
                    project.status === 'draft' ? '#f3f4f6' :
                    project.status === 'completed' ? '#e3f2fd' : '#ffebee',
                  color:
                    project.status === 'active' ? '#2e7d32' :
                    project.status === 'draft' ? '#6b7280' :
                    project.status === 'completed' ? '#1976d2' : '#c62828'
                }}>
                  {project.status}
                </span>
              </div>
              <div style={styles.projectInfo}>
                <div>
                  <strong>PM:</strong> {project.projectManager?.name || 'N/A'}
                </div>
                <div>
                  <strong>Team:</strong> {project.assignedEmployeesCount || 0} members
                </div>
                <div>
                  <strong>Risk Score:</strong> {project.riskScore || 0}
                </div>
              </div>
              <div style={styles.projectActions}>
                <button
                  style={styles.actionButton}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * OverviewTab Component
 */
function OverviewTab({ organization }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Organization Information</h2>
      
      <div style={styles.infoGrid}>
        {organization.taxId && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Tax ID</div>
            <div style={styles.infoValue}>{organization.taxId}</div>
          </div>
        )}
        
        {organization.contact?.email && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoValue}>{organization.contact.email}</div>
          </div>
        )}
        
        {organization.contact?.phone && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Phone</div>
            <div style={styles.infoValue}>{organization.contact.phone}</div>
          </div>
        )}
        
        {organization.contact?.website && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Website</div>
            <div style={styles.infoValue}>
              <a href={organization.contact.website} target="_blank" rel="noopener noreferrer" style={styles.link}>
                {organization.contact.website}
              </a>
            </div>
          </div>
        )}
      </div>

      {organization.address && (
        <>
          <h3 style={styles.sectionTitle}>Address</h3>
          <div style={styles.infoGrid}>
            {organization.address.street && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Street</div>
                <div style={styles.infoValue}>{organization.address.street}</div>
              </div>
            )}
            {organization.address.city && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>City</div>
                <div style={styles.infoValue}>{organization.address.city}</div>
              </div>
            )}
            {organization.address.state && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>State</div>
                <div style={styles.infoValue}>{organization.address.state}</div>
              </div>
            )}
            {organization.address.postalCode && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Postal Code</div>
                <div style={styles.infoValue}>{organization.address.postalCode}</div>
              </div>
            )}
            {organization.address.country && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Country</div>
                <div style={styles.infoValue}>{organization.address.country}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * EmployeesTab Component
 */
function EmployeesTab({ organizationId, isAdmin, onUpdate }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEmployees();
  }, [organizationId, filter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await getOrganizationEmployees(organizationId, params);
      // La API devuelve { success: true, data: [...employees] }
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setEmployees(res.data.data);
      } else if (Array.isArray(res.data)) {
        // Axios ya extrajo el data
        setEmployees(res.data);
      } else {
        console.warn('Unexpected API response format:', res.data);
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error loading employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateEmployeeStatus(organizationId, userId, newStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating employee status');
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    
    try {
      await removeEmployee(organizationId, userId);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error removing employee');
    }
  };

  const handleToggleProjectManager = async (userId, currentStatus) => {
    const action = currentStatus ? 'remove' : 'assign';
    if (!confirm(`Are you sure you want to ${action} project manager role ${currentStatus ? 'from' : 'to'} this employee?`)) return;
    
    try {
      const { updateProjectManagerRole } = await import('../api/projects');
      await updateProjectManagerRole(organizationId, userId, !currentStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating project manager role');
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading employees...</p>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Employees</h2>
        {isAdmin && (
          <div style={styles.filterButtons}>
            <button
              style={filter === 'all' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              style={filter === 'active' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              style={filter === 'pending' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              style={filter === 'inactive' ? styles.filterActive : styles.filterButton}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>
          </div>
        )}
      </div>

      {employees.length === 0 ? (
        <p style={styles.emptyText}>No employees found</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>Name</div>
            <div style={styles.tableCell}>Position</div>
            <div style={styles.tableCell}>Department</div>
            <div style={styles.tableCell}>Status</div>
            <div style={styles.tableCell}>Role</div>
            {isAdmin && <div style={styles.tableCell}>Actions</div>}
          </div>
          {employees.map((emp) => {
            // La API devuelve emp.user, no emp.userId
            const user = emp.user || emp.userId;
            return (
              <div key={user?._id || emp._id} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  {user?.name || user?.username || user?.email || '-'}
                </div>
                <div style={styles.tableCell}>{emp.position || '-'}</div>
                <div style={styles.tableCell}>{emp.department || '-'}</div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    background: 
                      emp.status === 'active' ? '#e8f5e9' :
                      emp.status === 'pending' ? '#fff3e0' : '#ffebee',
                    color:
                      emp.status === 'active' ? '#2e7d32' :
                      emp.status === 'pending' ? '#f57c00' : '#c62828'
                  }}>
                    {emp.status}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  {emp.isProjectManager && (
                    <span style={{
                      ...styles.statusBadge,
                      background: '#E0E7FF',
                      color: '#4338CA'
                    }}>
                      🎯 Project Manager
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      {emp.status === 'pending' && (
                        <button
                          style={styles.actionButton}
                          onClick={() => handleStatusChange(user._id, 'active')}
                        >
                          Approve
                        </button>
                      )}
                      {emp.status === 'active' && (
                        <>
                          <button
                            style={{
                              ...styles.actionButton,
                              background: emp.isProjectManager ? '#FEE2E2' : '#E0E7FF',
                              color: emp.isProjectManager ? '#DC2626' : '#4338CA'
                            }}
                            onClick={() => handleToggleProjectManager(user._id, emp.isProjectManager)}
                          >
                            {emp.isProjectManager ? 'Remove PM' : 'Make PM'}
                          </button>
                          <button
                            style={styles.actionButton}
                            onClick={() => handleStatusChange(user._id, 'inactive')}
                          >
                            Deactivate
                          </button>
                        </>
                      )}
                      <button
                        style={{ ...styles.actionButton, color: '#c62828' }}
                        onClick={() => handleRemove(user._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * CVsTab Component (Admin only)
 */
function CVsTab({ organizationId, onUpdate }) {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    loadCVs();
  }, [organizationId, filter]);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const params = { status: filter };
      const res = await getOrganizationCVs(organizationId, params);
      // La API devuelve { success: true, data: { cvs: [...], pagination: {...} } }
      if (res.data?.success && res.data?.data?.cvs) {
        setCvs(res.data.data.cvs);
      } else if (res.data?.cvs) {
        // Axios ya extrajo el data
        setCvs(res.data.cvs);
      } else if (Array.isArray(res.data)) {
        // Fallback: respuesta es array directo
        setCvs(res.data);
      } else {
        console.warn('Unexpected API response format:', res.data);
        setCvs([]);
      }
    } catch (err) {
      console.error('Error loading CVs:', err);
      setCvs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (cvId, newStatus, notes = '') => {
    try {
      await updateCVStatus(organizationId, cvId, { status: newStatus, notes });
      loadCVs();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating CV status');
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading CVs...</p>;
  }

  // Helpers to render data defensively against varying API payloads
  const formatSkills = (skills) => {
    if (!skills) return 'N/A';
    // If it's already an array: string[] or {name:string}[]
    if (Array.isArray(skills)) {
      const values = skills.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    // If it's an object with buckets (e.g., technical/soft)
    if (typeof skills === 'object') {
      const buckets = Object.values(skills).flat();
      const values = buckets
        .map((s) => (typeof s === 'string' ? s : s?.name))
        .filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    return 'N/A';
  };

  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    if (Array.isArray(languages)) {
      const values = languages
        .map((l) => (typeof l === 'string' ? l : l?.language || l?.name))
        .filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    return 'N/A';
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Received CVs</h2>
        <div style={styles.filterButtons}>
          <button
            style={filter === 'pending' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            style={filter === 'reviewed' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('reviewed')}
          >
            Reviewed
          </button>
          <button
            style={filter === 'accepted' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            style={filter === 'rejected' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {cvs.length === 0 ? (
        <p style={styles.emptyText}>No CVs found</p>
      ) : (
        <div style={styles.cvList}>
          {cvs.map((cv) => (
            <div key={cv._id} style={styles.cvCard}>
              <div style={styles.cvHeader}>
                <div>
                  <h3 style={styles.cvName}>
                    {cv.userId?.name || cv.userId?.username || 'Unknown'}
                  </h3>
                  <p style={styles.cvEmail}>{cv.userId?.email}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  background: 
                    cv.organizationStatus === 'accepted' ? '#e8f5e9' :
                    cv.organizationStatus === 'rejected' ? '#ffebee' :
                    cv.organizationStatus === 'reviewed' ? '#e3f2fd' : '#fff3e0',
                  color:
                    cv.organizationStatus === 'accepted' ? '#2e7d32' :
                    cv.organizationStatus === 'rejected' ? '#c62828' :
                    cv.organizationStatus === 'reviewed' ? '#1565c0' : '#f57c00'
                }}>
                  {cv.organizationStatus}
                </span>
              </div>

              <div style={styles.cvInfo}>
                <div><strong>Skills:</strong> {formatSkills(cv.skills)}</div>
                <div><strong>Languages:</strong> {formatLanguages(cv.languages)}</div>
                <div><strong>Submitted:</strong> {cv.submittedToOrganizationAt ? new Date(cv.submittedToOrganizationAt).toLocaleDateString() : 'N/A'}</div>
              </div>

              {cv.organizationNotes && (
                <div style={styles.cvNotes}>
                  <strong>Notes:</strong> {cv.organizationNotes}
                </div>
              )}

              <div style={styles.cvActions}>
                <SecondaryButton
                  onClick={() => {
                    navigate(`/organizations/${organizationId}/cvs/${cv._id}`);
                  }}
                >
                  View Full CV
                </SecondaryButton>
                {cv.organizationStatus === 'pending' && (
                  <>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleStatusChange(cv._id, 'reviewed')}
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#4caf50' }}
                      onClick={() => {
                        const notes = prompt('Add notes (optional):');
                        handleStatusChange(cv._id, 'accepted', notes || '');
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#f44336' }}
                      onClick={() => {
                        const notes = prompt('Add rejection reason (optional):');
                        handleStatusChange(cv._id, 'rejected', notes || '');
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SettingsTab Component (Admin only)
 */
function SettingsTab({ organization, onUpdate }) {
  const [settings, setSettings] = useState({
    allowPublicSubmission: organization.settings?.allowPublicSubmission || false,
    requireApproval: organization.settings?.requireApproval || false,
    notifyOnCVSubmission: organization.settings?.notifyOnCVSubmission || true,
    autoProcessCVs: organization.settings?.autoProcessCVs || false
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateOrganizationSettings(organization._id, settings);
      alert('Settings updated successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Organization Settings</h2>
      
      <div style={styles.settingsGroup}>
        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.allowPublicSubmission}
            onChange={(e) => setSettings({ ...settings, allowPublicSubmission: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>Allow Public CV Submission</div>
            <div style={styles.settingDescription}>
              Allow anyone to submit their CV to this organization
            </div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.requireApproval}
            onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>Require Employee Approval</div>
            <div style={styles.settingDescription}>
              New employees need admin approval before becoming active
            </div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.notifyOnCVSubmission}
            onChange={(e) => setSettings({ ...settings, notifyOnCVSubmission: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>Notify on CV Submission</div>
            <div style={styles.settingDescription}>
              Receive notifications when a new CV is submitted
            </div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.autoProcessCVs}
            onChange={(e) => setSettings({ ...settings, autoProcessCVs: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>Auto-process CVs with AI</div>
            <div style={styles.settingDescription}>
              Automatically analyze and categorize submitted CVs
            </div>
          </div>
        </label>
      </div>

      <div style={{ marginTop: '24px' }}>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </PrimaryButton>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 24px'
  },
  headerTop: {
    marginBottom: '16px'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 0'
  },
  headerContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  badges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#f0f0f0',
    color: '#666'
  },
  statsSection: {
    maxWidth: '1200px',
    margin: '0 auto 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  tabs: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #eee',
    marginBottom: '24px'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'none',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2563eb',
    cursor: 'pointer',
    borderBottom: '2px solid #2563eb',
    marginBottom: '-2px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  infoItem: {
    marginBottom: '16px'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: '24px',
    marginBottom: '16px'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px'
  },
  filterButton: {
    background: '#f0f0f0',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterActive: {
    background: '#2563eb',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer'
  },
  table: {
    width: '100%'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 2fr',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 2fr',
    padding: '16px 12px',
    borderBottom: '1px solid #eee',
    alignItems: 'center'
  },
  tableCell: {
    fontSize: '14px',
    color: '#333'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  cvList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cvCard: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px'
  },
  cvHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  cvName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 4px 0'
  },
  cvEmail: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  cvInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px'
  },
  cvNotes: {
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px'
  },
  cvActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  },
  projectCard: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  projectName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 8px 0'
  },
  projectDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  projectInfo: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  projectActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  settingsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  settingItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
    cursor: 'pointer'
  },
  checkbox: {
    marginTop: '2px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  settingLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  settingDescription: {
    fontSize: '14px',
    color: '#666'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    padding: '40px'
  },
  errorContainer: {
    maxWidth: '500px',
    margin: '60px auto',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '16px',
    color: '#c62828',
    marginBottom: '24px'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    padding: '40px'
  }
};

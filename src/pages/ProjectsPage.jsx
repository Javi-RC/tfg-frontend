import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  getMyProjects, 
  getAssignedProjects,
  deleteProject,
  getProjectById
} from '../api/projects';
import { getMyOrganizations } from '../api/organization';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ProjectCard from '../components/projects/ProjectCard';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Projects List Page
 * Main page for viewing and managing projects
 */
export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [myProjects, setMyProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-projects'); // 'my-projects' | 'assigned'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');
  const [isProjectManager, setIsProjectManager] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load organizations to check if user is project manager
      const orgsRes = await getMyOrganizations();
      const orgsData = orgsRes.data?.success ? orgsRes.data.data : orgsRes.data;
      setOrganizations(orgsData || []);
      
      // Check if user is project manager in any organization
  
      const userId = user?.userId || user?._id || user?.id;
      console.log('🔍 User Info:', { 
        userId, 
        userObject: user,
        orgsCount: orgsData?.length 
      });
      
      const isPM = orgsData.some(org => {
        console.log('📋 Checking org:', { 
          orgId: org._id, 
          orgName: org.name,
          employeesCount: org.employees?.length 
        });
        
        const employee = org.employees?.find(emp => {
          const empUserId = emp.user?._id || emp.user;
          console.log('👤 Checking employee:', { 
            empUserId, 
            userId,
            match: empUserId === userId,
            isProjectManager: emp.isProjectManager 
          });
          return empUserId === userId;
        });
        
        const isOrgPM = employee?.isProjectManager === true;
        console.log('✅ Org PM Status:', { orgName: org.name, isOrgPM });
        return isOrgPM;
      });
      
      setIsProjectManager(isPM);
      console.log('🎯 Final PM Detection:', { userId, isPM, orgsCount: orgsData.length });
      
      // Load projects
      await Promise.all([
        loadMyProjects(),
        loadAssignedProjects()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyProjects = async () => {
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterOrg !== 'all') params.organizationId = filterOrg;
      
      const res = await getMyProjects(params);
      const data = res.data?.success ? res.data.data : res.data;
      
      // Populate projectManager manually if it's just an ID
      const projectsWithPM = await Promise.all(
        (data || []).map(async (project) => {
          if (typeof project.projectManager === 'string') {
            // ProjectManager is just an ID, fetch the full project with populated data
            try {
              const fullProject = await getProjectById(project._id, false);
              const fullData = fullProject.data?.success ? fullProject.data.data : fullProject.data;
              return fullData;
            } catch (err) {
              console.error('Error fetching project details:', err);
              return project;
            }
          }
          return project;
        })
      );
      
      setMyProjects(projectsWithPM);
    } catch (error) {
      console.error('Error loading my projects:', error);
      setMyProjects([]);
    }
  };

  const loadAssignedProjects = async () => {
    try {
      const res = await getAssignedProjects();
      const data = res.data?.success ? res.data.data : res.data;
      
      // Populate projectManager manually if it's just an ID
      const projectsWithPM = await Promise.all(
        (data || []).map(async (project) => {
          if (typeof project.projectManager === 'string') {
            try {
              const fullProject = await getProjectById(project._id, false);
              const fullData = fullProject.data?.success ? fullProject.data.data : fullProject.data;
              return fullData;
            } catch (err) {
              console.error('Error fetching project details:', err);
              return project;
            }
          }
          return project;
        })
      );
      
      setAssignedProjects(projectsWithPM);
    } catch (error) {
      console.error('Error loading assigned projects:', error);
      setAssignedProjects([]);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
      return;
    }

    try {
      await deleteProject(project._id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting project');
    }
  };

  const handleEditProject = (project) => {
    navigate(`/projects/${project._id}/edit`);
  };

  const currentProjects = activeTab === 'my-projects' ? myProjects : assignedProjects;
  const filteredProjects = currentProjects.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterOrg !== 'all' && p.organization !== filterOrg) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>
            Manage and track your projects
          </p>
        </div>
        {isProjectManager && (
          <PrimaryButton onClick={() => navigate('/projects/new')} leftIcon={<Plus size={18} />}>
            Create Project
          </PrimaryButton>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'my-projects' && styles.tabActive)
          }}
          onClick={() => setActiveTab('my-projects')}
        >
          My Projects ({myProjects.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'assigned' && styles.tabActive)
          }}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned to Me ({assignedProjects.length})
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            <option value={PROJECT_STATUS.DRAFT}>Draft</option>
            <option value={PROJECT_STATUS.ACTIVE}>Active</option>
            <option value={PROJECT_STATUS.PAUSED}>Paused</option>
            <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
            <option value={PROJECT_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Organization:</label>
          <select
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Organizations</option>
            {organizations.map(org => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <ClipboardList size={64} color="#6c757d" style={{ opacity: 0.3 }} />
          </div>
          <h3 style={styles.emptyTitle}>
            {activeTab === 'my-projects' ? 'No projects created yet' : 'No projects assigned'}
          </h3>
          <p style={styles.emptyText}>
            {activeTab === 'my-projects' && isProjectManager
              ? 'Create your first project to get started'
              : 'You will see projects here when assigned by a project manager'}
          </p>
          {activeTab === 'my-projects' && isProjectManager && (
            <PrimaryButton onClick={() => navigate('/projects/new')} leftIcon={<Plus size={18} />}>
              Create First Project
            </PrimaryButton>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={activeTab === 'my-projects' ? handleEditProject : null}
              onDelete={user?.role === 'org_admin' && activeTab === 'my-projects' ? handleDeleteProject : null}
              showActions={activeTab === 'my-projects'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    gap: '20px',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '16px',
    padding: '60px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
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
    transition: 'all 0.2s',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px'
  },
  tabActive: {
    color: '#111',
    borderBottomColor: '#111'
  },
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111'
  },
  select: {
    padding: '10px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white',
    minWidth: '180px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: '#F9FAFB',
    borderRadius: '16px',
    border: '2px dashed #E5E7EB'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '24px'
  }
};

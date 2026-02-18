import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';
import {
  getMyProjects,
  getAssignedProjects,
  deleteProject,
  getProjectById
} from '../api/projects';
import { getMyOrganizations } from '../api/organization';

/**
 * Custom hook for Projects business logic
 * Manages project loading, filtering, and user permissions
 */
export function useProjects() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [myProjects, setMyProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-projects');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');
  const [isProjectManager, setIsProjectManager] = useState(false);

  /**
   * Load all data on mount
   */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Reload projects when filters change
   */
  useEffect(() => {
    if (!loading) {
      loadMyProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterOrg]);

  /**
   * Check if user is project manager in any organization
   */
  const checkProjectManagerStatus = (orgsData) => {
    const userId = user?.userId || user?._id || user?.id;
    
    const isPM = orgsData.some(org => {
      const employee = org.employees?.find(emp => {
        const empUserId = emp.user?._id || emp.user;
        return empUserId === userId;
      });
      
      return employee?.isProjectManager === true;
    });
    
    return isPM;
  };

  /**
   * Load organizations and check PM status
   */
  const loadOrganizations = async () => {
    try {
      const orgsRes = await getMyOrganizations();
      const orgsData = orgsRes.data?.success ? orgsRes.data.data : orgsRes.data;
      setOrganizations(orgsData || []);
      
      const isPM = checkProjectManagerStatus(orgsData || []);
      setIsProjectManager(isPM);
      
      return orgsData || [];
    } catch (error) {
      console.error('Error loading organizations:', error);
      setOrganizations([]);
      return [];
    }
  };

  /**
   * Populate project manager data if needed
   */
  const populateProjectManager = async (project) => {
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
  };

  /**
   * Load projects created by user
   */
  const loadMyProjects = async () => {
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterOrg !== 'all') params.organizationId = filterOrg;
      
      const res = await getMyProjects(params);
      const data = res.data?.success ? res.data.data : res.data;
      
      const projectsWithPM = await Promise.all(
        (data || []).map(populateProjectManager)
      );
      
      setMyProjects(projectsWithPM);
    } catch (error) {
      console.error('Error loading my projects:', error);
      setMyProjects([]);
    }
  };

  /**
   * Load projects assigned to user
   */
  const loadAssignedProjects = async () => {
    try {
      const res = await getAssignedProjects();
      const data = res.data?.success ? res.data.data : res.data;
      
      const projectsWithPM = await Promise.all(
        (data || []).map(populateProjectManager)
      );
      
      setAssignedProjects(projectsWithPM);
    } catch (error) {
      console.error('Error loading assigned projects:', error);
      setAssignedProjects([]);
    }
  };

  /**
   * Load all data
   */
  const loadData = async () => {
    try {
      setLoading(true);
      await loadOrganizations();
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

  /**
   * Delete a project
   */
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm(t('projects.confirmDelete'))) {
      return false;
    }

    try {
      await deleteProject(projectId);
      
      // Remove from appropriate list
      if (activeTab === 'my-projects') {
        setMyProjects(prev => prev.filter(p => p._id !== projectId));
      } else {
        setAssignedProjects(prev => prev.filter(p => p._id !== projectId));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  /**
   * Get current projects list based on active tab
   */
  const currentProjects = activeTab === 'my-projects' ? myProjects : assignedProjects;

  /**
   * Get filtered projects
   */
  const getFilteredProjects = () => {
    let filtered = currentProjects;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterOrg !== 'all') {
      filtered = filtered.filter(p => {
        const orgId = p.organization?._id || p.organization;
        return orgId === filterOrg;
      });
    }

    return filtered;
  };

  return {
    // State
    myProjects,
    assignedProjects,
    organizations,
    loading,
    activeTab,
    filterStatus,
    filterOrg,
    isProjectManager,
    currentProjects,
    
    // Computed
    filteredProjects: getFilteredProjects(),
    
    // Actions
    setActiveTab,
    setFilterStatus,
    setFilterOrg,
    handleDeleteProject,
    reloadProjects: loadData
  };
}

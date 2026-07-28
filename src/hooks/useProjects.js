import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { unwrapData } from '../api/responseAdapter';
import { getMyProjects, getAssignedProjects, deleteProject, getProjectById } from '../api/projects';
import { getMyOrganizations } from '../api/organization';

/**
 * Populate project manager data if needed
 */
const populateProjectManager = async (project) => {
  if (typeof project.projectManager === 'string') {
    try {
      const fullProject = await getProjectById(project._id, false);
      const fullData = unwrapData(fullProject);
      return fullData;
    } catch {
      return project;
    }
  }
  return project;
};

/**
 * Custom hook for Projects business logic
 * Manages project loading, filtering, and user permissions
 */
export function useProjects() {
  const { user } = useAuth();

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

    const isPM = orgsData.some((org) => {
      const employee = org.employees?.find((emp) => {
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
      const orgsData = unwrapData(orgsRes);
      setOrganizations(orgsData || []);

      const isPM = checkProjectManagerStatus(orgsData || []);
      setIsProjectManager(isPM);

      return orgsData || [];
    } catch {
      setOrganizations([]);
      return [];
    }
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
      const data = unwrapData(res);

      const projectsWithPM = await Promise.all((data || []).map(populateProjectManager));

      setMyProjects(projectsWithPM);
    } catch {
      setMyProjects([]);
    }
  };

  /**
   * Load projects assigned to user
   */
  const loadAssignedProjects = async () => {
    try {
      const res = await getAssignedProjects();
      const data = unwrapData(res);

      const projectsWithPM = await Promise.all((data || []).map(populateProjectManager));

      setAssignedProjects(projectsWithPM);
    } catch {
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
      await Promise.all([loadMyProjects(), loadAssignedProjects()]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a project
   */
  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);

    // Remove from appropriate list
    if (activeTab === 'my-projects') {
      setMyProjects((prev) => prev.filter((p) => p._id !== projectId));
    } else {
      setAssignedProjects((prev) => prev.filter((p) => p._id !== projectId));
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
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (filterOrg !== 'all') {
      filtered = filtered.filter((p) => {
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
    reloadProjects: loadData,
  };
}

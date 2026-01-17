import { useState, useEffect, useContext } from 'react';
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
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Custom hook for Project Detail business logic
 * Manages project loading, status changes, and employee assignments
 */
export function useProjectDetail() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Load project data
   */
  const loadProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id, true);
      const data = res.data?.success ? res.data.data : res.data;
      
      // Transform BFI-44 profile structure for assigned employees
      // Backend sends: user.bfi44Profile = { Extraversion: 36, ... }
      // Frontend expects: employee.bfi44Profile = { traits: { extraversion: 36, ... } }
      if (data.assignedEmployees && Array.isArray(data.assignedEmployees)) {
        data.assignedEmployees = data.assignedEmployees.map(emp => {
          const backendProfile = emp.user?.bfi44Profile;
          if (!backendProfile) return emp;

          if (backendProfile?.traits) {
            return { ...emp, bfi44Profile: backendProfile };
          }

          return {
            ...emp,
            bfi44Profile: {
              traits: {
                extraversion: backendProfile.Extraversion ?? 0,
                agreeableness: backendProfile.Agreeableness ?? 0,
                conscientiousness: backendProfile.Conscientiousness ?? 0,
                neuroticism: backendProfile.Neuroticism ?? 0,
                openness: backendProfile.Openness ?? 0
              }
            }
          };
        });
      }
      
      setProject(data);
      
      // Set default tab to 'teamAnalysis' for Draft projects
      if (data.status === PROJECT_STATUS.DRAFT && activeTab === 'overview') {
        setActiveTab('teamAnalysis');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error loading project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete project
   */
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

  /**
   * Activate project (from Draft to Active)
   */
  const handleActivate = async () => {
    try {
      await activateProject(id);
      alert('Project activated successfully');
      await loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error activating project');
    }
  };

  /**
   * Complete project
   */
  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to mark this project as completed?')) {
      return;
    }

    try {
      await completeProject(id);
      alert('Project completed successfully');
      await loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error completing project');
    }
  };

  /**
   * Cancel project
   */
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this project?')) {
      return;
    }

    try {
      await cancelProject(id);
      alert('Project cancelled successfully');
      await loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error cancelling project');
    }
  };

  /**
   * Assign employee to project
   */
  const handleAssignEmployee = async (employeeId) => {
    try {
      await assignEmployeeToProject(id, employeeId);
      await loadProject();
      setShowAssignModal(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Error assigning employee');
    }
  };

  /**
   * Remove employee from project
   */
  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to remove this employee from the project?')) {
      return;
    }

    try {
      await removeEmployeeFromProject(id, employeeId);
      await loadProject();
    } catch (error) {
      alert(error.response?.data?.error || 'Error removing employee');
    }
  };

  /**
   * Navigate to edit page
   */
  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  /**
   * Navigate to complete project page
   */
  const handleNavigateToComplete = () => {
    navigate(`/projects/${id}/complete`);
  };

  /**
   * Check if action is available based on project status
   */
  const canActivate = project?.status === PROJECT_STATUS.DRAFT && canEdit;
  const canCompleteProject = project?.status === PROJECT_STATUS.ACTIVE && canEdit;
  const canCancelProject = [PROJECT_STATUS.DRAFT, PROJECT_STATUS.ACTIVE].includes(project?.status) && canEdit;
  const canEditProject = project?.status === PROJECT_STATUS.DRAFT && canEdit;

  return {
    // State
    project,
    loading,
    activeTab,
    showAssignModal,
    
    // Permissions
    isAdmin,
    isProjectManager,
    canEdit,
    canDelete,
    canActivate,
    canCompleteProject,
    canCancelProject,
    canEditProject,
    
    // Actions
    setActiveTab,
    setShowAssignModal,
    handleDelete,
    handleActivate,
    handleComplete,
    handleCancel,
    handleAssignEmployee,
    handleRemoveEmployee,
    handleEdit,
    handleNavigateToComplete,
    reloadProject: loadProject
  };
}

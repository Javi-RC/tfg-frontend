import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { showSuccess, showError } from '../utils/toast';
import {
  getProjectById,
  deleteProject,
  activateProject,
  completeProject,
  cancelProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from '../api/projects';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Custom hook for Project Detail business logic
 * Manages project loading, status changes, and employee assignments
 */
export function useProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isAdmin = user?.role === 'org_admin';

  // Normalize user ID (can be id, _id, or userId depending on source)
  const userId = user?.userId || user?._id || user?.id;

  // Normalize project manager ID (can be id or _id)
  const projectManagerId = project?.projectManager?._id || project?.projectManager?.id;

  const isProjectManager = projectManagerId && userId && projectManagerId === userId;
  const canEdit = isProjectManager || isAdmin;
  const canDelete = isAdmin;

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Load project data
   * @param {Object} options
   * @param {boolean} [options.silent=false] - When true, skips setting loading state (used for background refreshes)
   */
  const loadProject = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await getProjectById(id, true);
      const data = res.data?.success ? res.data.data : res.data;

      // Transform BFI-44 profile structure for assigned employees
      // Backend sends: user.bfi44Profile = { Extraversion: 36, ... }
      // Frontend expects: employee.bfi44Profile = { traits: { extraversion: 36, ... } }
      if (data.assignedEmployees && Array.isArray(data.assignedEmployees)) {
        data.assignedEmployees = data.assignedEmployees.map((emp) => {
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
                openness: backendProfile.Openness ?? 0,
              },
            },
          };
        });
      }

      setProject(data);

      // Set default tab based on project status
      if (data.status === PROJECT_STATUS.DRAFT && activeTab === 'overview') {
        setActiveTab('teamAnalysis');
      } else if (data.status !== PROJECT_STATUS.DRAFT && activeTab === 'teamAnalysis') {
        setActiveTab('overview');
      }
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorLoading'));
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete project
   */
  const handleDelete = async () => {
    if (!window.confirm(t('projects.messages.confirmDelete', { name: project.projectName }))) {
      return;
    }

    try {
      await deleteProject(id);
      showSuccess(t('projects.projectDeleted'));
      navigate('/projects');
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorDeleting'));
    }
  };

  /**
   * Activate project (from Draft to Active)
   */
  const handleActivate = async () => {
    try {
      await activateProject(id);
      showSuccess(t('projects.projectActivated'));
      await loadProject({ silent: true });
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorActivating'));
    }
  };

  /**
   * Complete project
   */
  const handleComplete = async () => {
    if (!window.confirm(t('projects.messages.confirmComplete'))) {
      return;
    }

    try {
      await completeProject(id);
      showSuccess(t('projects.projectCompleted'));
      await loadProject({ silent: true });
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorCompleting'));
    }
  };

  /**
   * Cancel project
   */
  const handleCancel = async () => {
    if (!window.confirm(t('projects.messages.confirmCancel'))) {
      return;
    }

    try {
      await cancelProject(id);
      showSuccess(t('projects.projectCancelled'));
      await loadProject({ silent: true });
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorCancelling'));
    }
  };

  /**
   * Assign employee to project
   */
  const handleAssignEmployee = async (employeeId) => {
    try {
      await assignEmployeeToProject(id, employeeId);
      await loadProject({ silent: true });
      setShowAssignModal(false);
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorAssigning'));
    }
  };

  /**
   * Remove employee from project
   */
  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm(t('projects.messages.confirmRemoveEmployee'))) {
      return;
    }

    try {
      await removeEmployeeFromProject(id, employeeId);
      await loadProject({ silent: true });
    } catch (error) {
      showError(error.response?.data?.error || t('projects.messages.errorRemoving'));
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
  const canCancelProject =
    [PROJECT_STATUS.DRAFT, PROJECT_STATUS.ACTIVE].includes(project?.status) && canEdit;
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
    reloadProject: loadProject,
  };
}

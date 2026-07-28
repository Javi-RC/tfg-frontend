import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getTeamAnalysis,
  predictProjectRisks,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from '../../../api/projects';
import { showSuccess, showError } from '../../../utils/toast';
import { getOrganizationEmployees } from '../../../api/organization';

/**
 * Normalize skills array from backend format.
 * Backend sends: Array<{skill: string, level: string, distance: number}>
 * Frontend needs: string[] for display
 */
const normalizeSkillsArray = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.flatMap((skill) => {
    if (typeof skill === 'string') return [skill];
    if (skill?.skill) return [skill.skill];
    if (skill?.name) return [skill.name];
    const s = String(skill);
    return s ? [s] : [];
  });
};

export default function useTeamAnalysis({ project, onProjectUpdate, activeTab }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const notAvailableLabel = t('common.notAvailable');

  // Data State
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentTeamEmployees, setCurrentTeamEmployees] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // UI State
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Ref for debouncing project reload
  const reloadTimeoutRef = useRef(null);
  // Ref to track if we're doing an optimistic update
  const isOptimisticUpdateRef = useRef(false);

  /**
   * Enriquece un miembro del equipo con datos de la organización
   */
  const enrichMember = useCallback((member, orgEmployeeByUserId, isRecommended = false) => {
    const stableUserId = member?.user?._id || member?.userId;
    const orgEmp = orgEmployeeByUserId.get(stableUserId);

    const orgUser = orgEmp?.user && typeof orgEmp.user === 'object' ? orgEmp.user : {};
    const memberUser = member?.user && typeof member.user === 'object' ? member.user : {};
    const normalizedUser = {
      ...orgUser,
      ...memberUser,
      _id: memberUser._id ?? orgUser._id ?? stableUserId,
    };

    const matchedSkills = normalizeSkillsArray(member.matchedSkills || []);
    const missingSkills = Array.isArray(member.missingSkills) ? member.missingSkills : [];

    const skillsMatchPercentage = (() => {
      const total = matchedSkills.length + missingSkills.length;
      if (total === 0) return 0;
      return Math.round((matchedSkills.length / total) * 100);
    })();

    const matchScore = member.matchScore ?? 0;
    const synergyBonus = member.synergyBonus ?? null;

    const orgCv = orgEmp?.cv && typeof orgEmp.cv === 'object' ? orgEmp.cv : null;
    const memberCv = member?.cv && typeof member.cv === 'object' ? member.cv : null;
    const mergedCv = orgCv || memberCv ? { ...(orgCv || {}), ...(memberCv || {}) } : null;

    return {
      userId: stableUserId,
      user: normalizedUser,
      cv: mergedCv,
      score: member.score ?? 999,
      matchScore,
      matchPercentage: matchScore,
      skillsMatchPercentage,
      details: member.details || null,
      matchedSkills,
      missingSkills,
      synergyBonus,
      isRecommended,
      _id: orgEmp?._id,
      department: orgEmp?.department,
      position: orgEmp?.position,
      status: orgEmp?.status,
      isProjectManager: orgEmp?.isProjectManager,
      hasCv: orgEmp?.hasCv,
      bfi44Profile: orgEmp?.user?.bfi44Profile || null,
      role: member.role || orgEmp?.position,
    };
  }, []);

  /**
   * Load team analysis and available employees
   */
  const loadAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const teamResponse = await getTeamAnalysis(project._id);
      const teamData = teamResponse.data?.data || teamResponse.data;

      setTeamAnalysis(teamData);

      const employeesResponse = await getOrganizationEmployees(
        project.organization._id || project.organization,
        { status: 'active', includeCV: true, includeBFI: true }
      );
      const employeesData = employeesResponse.data?.data || employeesResponse.data;
      let allOrgEmployees = employeesData.employees || employeesData || [];

      const orgEmployeeByUserId = new Map(allOrgEmployees.map((emp) => [emp.user._id, emp]));

      new Set(
        project.assignedEmployees
          ?.flatMap((emp) => {
            if (typeof emp === 'string') return [emp];
            if (emp.user) {
              if (typeof emp.user === 'string') return [emp.user];
              if (emp.user._id) return [emp.user._id];
            }
            if (emp._id) return [emp._id];
            return [];
          }) || []
      );

      const suggestions = teamData.suggestions || [];
      const currentTeam = teamData.currentTeam || [];
      const availableFromBackend = teamData.availableEmployees || [];

      const currentTeamEmployeesList = currentTeam.map((member) =>
        enrichMember(member, orgEmployeeByUserId, false)
      );
      setCurrentTeamEmployees(currentTeamEmployeesList);

      const suggestionsEnriched = suggestions.map((member) =>
        enrichMember(member, orgEmployeeByUserId, true)
      );
      const availableEnriched = availableFromBackend.map((member) =>
        enrichMember(member, orgEmployeeByUserId, false)
      );

      const suggestionIds = new Set(suggestionsEnriched.map((s) => s.userId));
      const uniqueAvailable = availableEnriched.filter((a) => !suggestionIds.has(a.userId));
      const allAvailableById = new Map();
      for (const emp of [...suggestionsEnriched, ...uniqueAvailable]) {
        const id = emp?.userId || emp?.user?._id;
        if (!id) continue;
        if (!allAvailableById.has(id)) {
          allAvailableById.set(id, emp);
        }
      }
      const allAvailable = Array.from(allAvailableById.values());

      allAvailable.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return b.matchScore - a.matchScore;
      });

      setAllEmployees(allAvailable);
    } catch (err) {
      console.error('Error loading analysis:', err);
      setError(err.response?.data?.error || t('draftTeamAnalysis.errorLoadingTeam'));
    } finally {
      setLoading(false);
    }
  }, [project._id, project.organization, project.assignedEmployees, t, enrichMember]);

  // Load initial data
  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  // Cleanup debounced timeout on unmount
  useEffect(() => {
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Load risk analysis for current team
   */
  const loadRiskAnalysis = useCallback(async () => {
    try {
      setRiskLoading(true);

      const riskResponse = await predictProjectRisks(project._id);
      const riskData = riskResponse.data?.data || riskResponse.data;

      setRiskAnalysis(riskData);
    } catch (err) {
      console.error('Error loading risk analysis:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t('projects.riskAnalysis.loadError', 'Error loading risk analysis. Please try again.');
      setError(errorMessage);
    } finally {
      setRiskLoading(false);
    }
  }, [project._id, t]);

  // Load risk analysis when switching to risks tab
  useEffect(() => {
    if (activeTab === 'risks' && !riskAnalysis && !riskLoading) {
      loadRiskAnalysis();
    }
  }, [activeTab, riskAnalysis, riskLoading, project.assignedEmployees, loadRiskAnalysis]);

  /**
   * Assign selected employees to project
   */
  const handleAssignSelected = useCallback(async () => {
    if (selectedEmployees.length === 0) return;

    const selectedSet = new Set(selectedEmployees);
    const employeesToAdd = allEmployees.filter((emp) => selectedSet.has(emp.user._id));

    try {
      setAssignLoading(true);

      setCurrentTeamEmployees((prev) => [...prev, ...employeesToAdd]);
      setAllEmployees((prev) => prev.filter((emp) => !selectedSet.has(emp.user._id)));
      setSelectedEmployees([]);

      await Promise.all(
        selectedEmployees.map((empId) =>
          assignEmployeeToProject(project._id, {
            employeeId: empId,
            assignedRole: 'Developer',
          })
        )
      );

      isOptimisticUpdateRef.current = true;
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = setTimeout(() => {
        if (onProjectUpdate) {
          onProjectUpdate();
        }
        isOptimisticUpdateRef.current = false;
      }, 800);

      showSuccess(t('draftTeamAnalysis.alerts.assigned', { count: selectedEmployees.length }));
    } catch (err) {
      await loadAnalysis();
      showError(`⚠ ${err.response?.data?.error || t('draftTeamAnalysis.alerts.assignErrorFallback')}`);
    } finally {
      setAssignLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployees, allEmployees, project._id, onProjectUpdate, t]);

  /**
   * Remove employee from project
   */
  const handleRemoveEmployee = useCallback(
    async (employeeId) => {
      if (!window.confirm(t('draftTeamAnalysis.confirmRemoveEmployee'))) return;

      const employeeToRemove = currentTeamEmployees.find((emp) => emp.user._id === employeeId);

      try {
        setCurrentTeamEmployees((prev) => prev.filter((emp) => emp.user._id !== employeeId));

        if (employeeToRemove) {
          setAllEmployees((prev) => [...prev, employeeToRemove]);
        }

        await removeEmployeeFromProject(project._id, employeeId);

        isOptimisticUpdateRef.current = true;
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = setTimeout(() => {
          if (onProjectUpdate) {
            onProjectUpdate();
          }
          isOptimisticUpdateRef.current = false;
        }, 800);

        showSuccess(t('draftTeamAnalysis.alerts.removedOne'));
      } catch (err) {
        await loadAnalysis();
        showError(
          `⚠ ${err.response?.data?.error || t('draftTeamAnalysis.alerts.removeErrorFallback')}`
        );
      }
    },
    [currentTeamEmployees, project._id, onProjectUpdate, t, loadAnalysis]
  );

  /**
   * Toggle employee selection
   */
  const toggleEmployeeSelection = useCallback((employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]
    );
  }, []);

  /**
   * Filter employees by search query
   */
  const getFilteredEmployees = useCallback(() => {
    if (!searchQuery.trim()) return allEmployees;

    const query = searchQuery.toLowerCase();
    return allEmployees.filter(
      (emp) =>
        emp.user.name.toLowerCase().includes(query) ||
        emp.user.email.toLowerCase().includes(query) ||
        emp.matchedSkills.some((skill) => skill.toLowerCase().includes(query))
    );
  }, [searchQuery, allEmployees]);

  /**
   * Select all visible employees
   */
  const selectAllVisible = useCallback(() => {
    const visibleEmployeeIds = getFilteredEmployees().map((emp) => emp.user._id);
    setSelectedEmployees(visibleEmployeeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allEmployees]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  /**
   * Refresh all data (team analysis + employees)
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalysis();
    setRefreshing(false);
  }, [loadAnalysis]);

  /**
   * Retry risk analysis
   */
  const handleRetryAnalysis = useCallback(async () => {
    await loadRiskAnalysis();
  }, [loadRiskAnalysis]);

  /**
   * Navigate to project edit page
   */
  const handleEditProject = useCallback(() => {
    navigate(`/projects/${project._id}/edit`);
  }, [navigate, project._id]);

  return {
    teamAnalysis,
    allEmployees,
    currentTeamEmployees,
    riskAnalysis,
    loading,
    riskLoading,
    assignLoading,
    refreshing,
    error,
    selectedEmployees,
    searchQuery,
    notAvailableLabel,
    setSearchQuery,
    loadAnalysis,
    loadRiskAnalysis,
    handleAssignSelected,
    handleRemoveEmployee,
    toggleEmployeeSelection,
    selectAllVisible,
    clearSelection,
    getFilteredEmployees,
    handleRefresh,
    handleRetryAnalysis,
    handleEditProject,
  };
}

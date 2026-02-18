import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, AlertTriangle, CheckCircle, RefreshCw, Settings } from 'lucide-react';
import { 
  getTeamAnalysis, 
  predictProjectRisks, 
  assignEmployeeToProject, 
  removeEmployeeFromProject 
} from '../../api/projects';
import { getOrganizationEmployees } from '../../api/organization';
import TeamBuilderTab from './team/TeamBuilderTab';
import RiskAnalysisTab from './team/RiskAnalysisTab';
import TeamConfigModal from './TeamConfigModal';
import i18n from '../../i18n';

/**
 * Safely formats a date string to locale date string
 * @param {string} dateStr - Date string to format
 * @param {string} fallback - Fallback label when date is missing/invalid
 * @returns {string} Formatted date or fallback if invalid
 */
const formatDate = (dateStr, fallback) => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.toLocaleDateString(i18n.language);
};

/**
 * El matchScore ahora viene directamente del backend (0-100, mayor = mejor)
 * Combina Fase 1 (score técnico) + Fase 2 (sinergia) automáticamente
 * Ya no necesitamos calcular nada en el frontend
 */

/**
 * DraftTeamAnalysis - Redesigned with Tab Navigation
 * 
 * Architecture:
 * - Tab 1: Team Builder - Build and manage the project team
 * - Tab 2: Risk Analysis - Analyze risks and predictions
 * 
 * Goals:
 * - Reduce cognitive load with clear tab separation
 * - Maintain functional power while improving UX
 * - Guide user decisions with better visual hierarchy
 */
export default function DraftTeamAnalysis({ project, onProjectUpdate }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const notAvailableLabel = t('common.notAvailable');
  
  // Tab Management
  const [activeTab, setActiveTab] = useState('team');

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
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Ref for debouncing project reload
  const reloadTimeoutRef = useRef(null);
  // Ref to track if we're doing an optimistic update
  const isOptimisticUpdateRef = useRef(false);

  /**
   * Load team analysis and available employees
   * Uses backend-provided data directly without additional calculations
   */
  const loadAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load team recommendations from backend
      const teamResponse = await getTeamAnalysis(project._id);
      const teamData = teamResponse.data?.data || teamResponse.data;
      
      // ========== DETAILED BACKEND RESPONSE LOG ==========
      console.log('🔵 [TEAM BUILDER] ===== FULL BACKEND RESPONSE =====');
      console.log('🔵 Raw Response:', teamResponse);
      console.log('🔵 Team Data:', teamData);
      console.log('🔵 ├─ currentTeam:', teamData?.currentTeam);
      console.log('🔵 ├─ currentTeamSummary:', teamData?.currentTeamSummary);
      console.log('🔵 ├─ currentTeamSynergy:', teamData?.currentTeamSynergy);
      console.log('🔵 ├─ suggestions:', teamData?.suggestions);
      console.log('🔵 ├─ suggestionsSummary:', teamData?.suggestionsSummary);
      console.log('🔵 ├─ suggestionsMetadata:', teamData?.suggestionsMetadata);
      console.log('🔵 ├─ projectedTeamSynergy:', teamData?.projectedTeamSynergy);
      console.log('🔵 ├─ synergyValidation:', teamData?.synergyValidation);
      console.log('🔵 ├─ synergy:', teamData?.synergy);
      console.log('🔵 ├─ availableEmployees:', teamData?.availableEmployees);
      console.log('🔵 ├─ availableEmployeesCount:', teamData?.availableEmployeesCount);
      console.log('🔵 ├─ risks:', teamData?.risks);
      console.log('🔵 ├─ metadata:', teamData?.metadata);
      console.log('🔵 ├─ message:', teamData?.message);
      console.log('🔵 Sample currentTeam[0]:', teamData?.currentTeam?.[0]);
      console.log('🔵 Sample suggestions[0]:', teamData?.suggestions?.[0]);
      console.log('🔵   ├─ user.name:', teamData?.suggestions?.[0]?.user?.name);
      console.log('🔵   ├─ score:', teamData?.suggestions?.[0]?.score);
      console.log('🔵   ├─ matchScore:', teamData?.suggestions?.[0]?.matchScore);
      console.log('🔵   ├─ synergyBonus:', teamData?.suggestions?.[0]?.synergyBonus);
      console.log('🔵 Sample availableEmployees[0]:', teamData?.availableEmployees?.[0]);
      console.log('🔵   ├─ user.name:', teamData?.availableEmployees?.[0]?.user?.name);
      console.log('🔵   ├─ score:', teamData?.availableEmployees?.[0]?.score);
      console.log('🔵   ├─ matchScore:', teamData?.availableEmployees?.[0]?.matchScore);
      console.log('🔵   ├─ synergyBonus:', teamData?.availableEmployees?.[0]?.synergyBonus);
      console.log('🔵 ================================================');
      // ====================================================
      
      setTeamAnalysis(teamData);

      // Load all organization employees (con BFI-44, department, position)
      const employeesResponse = await getOrganizationEmployees(
        project.organization._id || project.organization,
        { status: 'active', includeCV: true, includeBFI: true }
      );
      const employeesData = employeesResponse.data?.data || employeesResponse.data;
      let allOrgEmployees = employeesData.employees || employeesData || [];
      
      // ========== ORGANIZATION EMPLOYEES LOG ==========
      console.log('🟢 [ORG EMPLOYEES] ===== ORGANIZATION EMPLOYEES =====');
      console.log('🟢 Total Employees:', allOrgEmployees.length);
      console.log('🟢 Sample Employee[0]:', allOrgEmployees[0]);
      console.log('🟢 ├─ user.bfi44Profile:', allOrgEmployees[0]?.user?.bfi44Profile);
      console.log('🟢 ├─ cv:', allOrgEmployees[0]?.cv);
      console.log('🟢 ├─ hasCv:', allOrgEmployees[0]?.hasCv);
      console.log('🟢 ├─ department:', allOrgEmployees[0]?.department);
      console.log('🟢 ====================================================');
      // ================================================

      // Crear mapa de empleados de la org por userId para lookup rápido
      const orgEmployeeByUserId = new Map(
        allOrgEmployees.map(emp => [emp.user._id, emp])
      );

      // Extract assigned employee IDs
      new Set(
        project.assignedEmployees?.map(emp => {
          if (typeof emp === 'string') return emp;
          if (emp.user) {
            if (typeof emp.user === 'string') return emp.user;
            if (emp.user._id) return emp.user._id;
          }
          if (emp._id) return emp._id;
          return null;
        }).filter(Boolean) || []
      );
      
      // Get data from team-analysis
      const suggestions = teamData.suggestions || [];
      const currentTeam = teamData.currentTeam || [];
      const availableFromBackend = teamData.availableEmployees || [];
      
      console.log('🟡 [DATA COUNTS]');
      console.log('🟡 ├─ currentTeam:', currentTeam.length);
      console.log('🟡 ├─ suggestions:', suggestions.length);
      console.log('🟡 ├─ availableEmployees:', availableFromBackend.length);
      console.log('🟡 ├─ orgEmployees:', allOrgEmployees.length);

      // ===== ENRIQUECER: Backend Data + Org Data (BFI-44, department, position) =====
      
      /**
       * Enriquece un miembro del equipo con datos de la organización
       */
      const enrichMember = (member, isRecommended = false) => {
        const stableUserId = member?.user?._id || member?.userId;
        const orgEmp = orgEmployeeByUserId.get(stableUserId);

        // Ensure we always provide a usable `user` object for UI rendering.
        // Team-analysis may return only userId; org employees usually include populated user with name/email.
        const orgUser = (orgEmp?.user && typeof orgEmp.user === 'object') ? orgEmp.user : {};
        const memberUser = (member?.user && typeof member.user === 'object') ? member.user : {};
        const normalizedUser = {
          ...orgUser,
          ...memberUser,
          _id: memberUser._id ?? orgUser._id ?? stableUserId
        };
        
        // matchedSkills viene como Array<{skill, level, distance}>
        const matchedSkills = normalizeSkillsArray(member.matchedSkills || []);
        // missingSkills viene como string[]
        const missingSkills = Array.isArray(member.missingSkills) 
          ? member.missingSkills 
          : [];

        // Skill score (legacy): derived from matched/missing skills
        // This represents ONLY technical skill coverage.
        const skillsMatchPercentage = (() => {
          const total = matchedSkills.length + missingSkills.length;
          if (total === 0) return 0;
          return Math.round((matchedSkills.length / total) * 100);
        })();
        
        // matchScore ya viene calculado del backend (0-100, mayor = mejor)
        // Incluye Fase 1 (técnico) + Fase 2 (sinergia) automáticamente
        const matchScore = member.matchScore ?? 0;
        const synergyBonus = member.synergyBonus ?? null;

        const orgCv = (orgEmp?.cv && typeof orgEmp.cv === 'object') ? orgEmp.cv : null;
        const memberCv = (member?.cv && typeof member.cv === 'object') ? member.cv : null;
        const mergedCv = (orgCv || memberCv)
          ? { ...(orgCv || {}), ...(memberCv || {}) }
          : null;
        
        return {
          // De Team Analysis (backend)
          userId: stableUserId,
          user: normalizedUser,
          cv: mergedCv,
          score: member.score ?? 999,
          matchScore,
          matchPercentage: matchScore, // MatchScore (overall) for existing UI components
          skillsMatchPercentage,
          details: member.details || null,
          matchedSkills,
          missingSkills,
          synergyBonus,
          
          // Calculado en frontend
          isRecommended,
          
          // De Organization (enriquecido)
          _id: orgEmp?._id,
          department: orgEmp?.department,
          position: orgEmp?.position,
          status: orgEmp?.status,
          isProjectManager: orgEmp?.isProjectManager,
          hasCv: orgEmp?.hasCv,
          bfi44Profile: orgEmp?.user?.bfi44Profile || null,
          role: member.role || orgEmp?.position
        };
      };

      // Procesar current team
      const currentTeamEmployeesList = currentTeam.map(member => enrichMember(member, false));
      setCurrentTeamEmployees(currentTeamEmployeesList);

      // Procesar available employees (suggestions + availableEmployees del backend)
      const suggestionsEnriched = suggestions.map(member => enrichMember(member, true));
      const availableEnriched = availableFromBackend.map(member => enrichMember(member, false));
      
      // Combinar y eliminar duplicados (priorizar suggestions)
      const suggestionIds = new Set(suggestionsEnriched.map(s => s.userId));
      const uniqueAvailable = availableEnriched.filter(a => !suggestionIds.has(a.userId));
      // Eliminar duplicados también dentro de `availableEmployees` usando un id estable
      const allAvailableById = new Map();
      for (const emp of [...suggestionsEnriched, ...uniqueAvailable]) {
        const id = emp?.userId || emp?.user?._id;
        if (!id) continue;
        if (!allAvailableById.has(id)) {
          allAvailableById.set(id, emp);
        }
      }
      const allAvailable = Array.from(allAvailableById.values());

      console.log('🟣 [PROCESSED DATA] ===== FINAL DATA =====');
      console.log('🟣 Current Team Count:', currentTeamEmployeesList.length);
      console.log('🟣 Available Employees Count:', allAvailable.length);
      console.log('🟣 ├─ Suggestions:', suggestionsEnriched.length);
      console.log('🟣 ├─ Other Available:', uniqueAvailable.length);
      console.log('🟣 Sample Available[0]:', allAvailable[0]);
      console.log('🟣 ├─ user:', allAvailable[0]?.user);
      console.log('🟣 ├─ score (debug):', allAvailable[0]?.score);
      console.log('🟣 ├─ matchScore (0-100):', allAvailable[0]?.matchScore);
      console.log('🟣 ├─ synergyBonus:', allAvailable[0]?.synergyBonus);
      console.log('🟣 ├─ matchedSkills:', allAvailable[0]?.matchedSkills);
      console.log('🟣 ├─ isRecommended:', allAvailable[0]?.isRecommended);
      console.log('🟣 ├─ department:', allAvailable[0]?.department);
      console.log('🟣 ============================================');

      // Sort: recommended first, then by matchScore (higher is better)
      allAvailable.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        // matchScore: mayor = mejor (0-100)
        return b.matchScore - a.matchScore;
      });

      setAllEmployees(allAvailable);

    } catch (err) {
      console.error('Error loading analysis:', err);
      setError(err.response?.data?.error || t('draftTeamAnalysis.errorLoadingTeam'));
    } finally {
      setLoading(false);
    }
  }, [project._id, project.organization, project.assignedEmployees, t]);

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
    console.log('🔍 [RISK ANALYSIS] Starting risk analysis for project:', project._id);
    console.log('🔍 [RISK ANALYSIS] Team count:', project.assignedEmployees?.length || 0);
    
    try {
      setRiskLoading(true);
      
      console.log('🔍 [RISK ANALYSIS] Calling API: POST /projects/:id/risks/predict');
      const riskResponse = await predictProjectRisks(project._id);
      
      console.log('✅ [RISK ANALYSIS] Full response:', riskResponse);
      console.log('✅ [RISK ANALYSIS] Response data:', riskResponse.data);
      console.log('✅ [RISK ANALYSIS] Response.data.data:', riskResponse.data?.data);
      
      const riskData = riskResponse.data?.data || riskResponse.data;
      
      console.log('📊 [RISK ANALYSIS] Extracted risk data:', riskData);
      console.log('📊 [RISK ANALYSIS] Risks array:', riskData?.risks);
      console.log('📊 [RISK ANALYSIS] Risks count:', riskData?.risks?.length || 0);
      
      if (riskData?.risks && riskData.risks.length > 0) {
        console.log('✅ [RISK ANALYSIS] Successfully loaded', riskData.risks.length, 'risks');
        console.log('📋 [RISK ANALYSIS] First risk:', riskData.risks[0]);
      } else {
        console.warn('⚠️ [RISK ANALYSIS] No risks found in response');
      }
      
      setRiskAnalysis(riskData);
    } catch (err) {
      console.error('❌ [RISK ANALYSIS] Error loading risk analysis:', err);
      console.error('❌ [RISK ANALYSIS] Error response:', err.response);
      console.error('❌ [RISK ANALYSIS] Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || t('projects.riskAnalysis.loadError', 'Error loading risk analysis. Please try again.');
      setError(errorMessage);
    } finally {
      setRiskLoading(false);
      console.log('🏁 [RISK ANALYSIS] Risk loading finished');
    }
  }, [project._id, project.assignedEmployees, t]);

  // Load risk analysis when switching to risks tab
  useEffect(() => {
    const teamCount = project.assignedEmployees?.length || 0;
    
    console.log('🔄 [RISK ANALYSIS] useEffect triggered');
    console.log('🔄 [RISK ANALYSIS] ├─ activeTab:', activeTab);
    console.log('🔄 [RISK ANALYSIS] ├─ teamCount:', teamCount);
    console.log('🔄 [RISK ANALYSIS] ├─ riskAnalysis:', riskAnalysis ? 'exists' : 'null');
    console.log('🔄 [RISK ANALYSIS] ├─ riskLoading:', riskLoading);
    
    // Allow risk analysis even without team (removed teamCount > 0 condition)
    if (activeTab === 'risks' && !riskAnalysis && !riskLoading) {
      console.log('🚀 [RISK ANALYSIS] Conditions met, loading risk analysis...');
      loadRiskAnalysis();
    } else {
      console.log('⏭️ [RISK ANALYSIS] Skipping load (conditions not met)');
    }
  }, [activeTab, riskAnalysis, riskLoading, project.assignedEmployees, loadRiskAnalysis]);

  /**
   * Assign selected employees to project
   * Uses optimistic updates to prevent UI flicker
   */
  const handleAssignSelected = useCallback(async () => {
    if (selectedEmployees.length === 0) return;

    const employeesToAdd = allEmployees.filter(emp => 
      selectedEmployees.includes(emp.user._id)
    );

    try {
      setAssignLoading(true);
      
      // Optimistic update: Move employees from available to current team
      setCurrentTeamEmployees(prev => [...prev, ...employeesToAdd]);
      setAllEmployees(prev => 
        prev.filter(emp => !selectedEmployees.includes(emp.user._id))
      );
      setSelectedEmployees([]);
      
      // Make API calls
      await Promise.all(
        selectedEmployees.map(empId => 
          assignEmployeeToProject(project._id, {
            employeeId: empId,
            assignedRole: 'Developer'
          })
        )
      );

      // Debounce project reload - wait a bit before reloading to batch multiple operations
      isOptimisticUpdateRef.current = true;
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = setTimeout(() => {
        if (onProjectUpdate) {
          onProjectUpdate();
        }
        isOptimisticUpdateRef.current = false;
      }, 800); // Wait 800ms to allow user to perform more operations

      alert(t('draftTeamAnalysis.alerts.assigned', { count: selectedEmployees.length }));
      
    } catch (err) {
      // On error, reload to restore correct state
      await loadAnalysis();
      alert(`⚠ ${err.response?.data?.error || t('draftTeamAnalysis.alerts.assignErrorFallback')}`);
    } finally {
      setAssignLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployees, allEmployees, project._id, onProjectUpdate, t]);

  /**
   * Remove employee from project
   * Uses optimistic updates to prevent UI flicker
   */
  const handleRemoveEmployee = useCallback(async (employeeId) => {
    if (!window.confirm(t('draftTeamAnalysis.confirmRemoveEmployee'))) return;

    // Find the employee to remove
    const employeeToRemove = currentTeamEmployees.find(emp => emp.user._id === employeeId);
    
    try {
      // Optimistic update: Move employee back to available list
      setCurrentTeamEmployees(prev => 
        prev.filter(emp => emp.user._id !== employeeId)
      );
      
      if (employeeToRemove) {
        setAllEmployees(prev => [...prev, employeeToRemove]);
      }

      // Make API call
      await removeEmployeeFromProject(project._id, employeeId);

      // Debounce project reload
      isOptimisticUpdateRef.current = true;
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = setTimeout(() => {
        if (onProjectUpdate) {
          onProjectUpdate();
        }
        isOptimisticUpdateRef.current = false;
      }, 800);

      alert(t('draftTeamAnalysis.alerts.removedOne'));
    } catch (err) {
      // On error, reload to restore correct state
      await loadAnalysis();
      alert(`⚠ ${err.response?.data?.error || t('draftTeamAnalysis.alerts.removeErrorFallback')}`);
    }
  }, [currentTeamEmployees, project._id, onProjectUpdate, t, loadAnalysis]);

  /**
   * Toggle employee selection
   */
  const toggleEmployeeSelection = useCallback((employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  }, []);

  /**
   * Select all visible employees
   */
  const selectAllVisible = useCallback(() => {
    const visibleEmployeeIds = getFilteredEmployees().map(emp => emp.user._id);
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
   * Filter employees by search query
   */
  const getFilteredEmployees = useCallback(() => {
    if (!searchQuery.trim()) return allEmployees;
    
    const query = searchQuery.toLowerCase();
    return allEmployees.filter(emp => 
      emp.user.name.toLowerCase().includes(query) ||
      emp.user.email.toLowerCase().includes(query) ||
      emp.matchedSkills.some(skill => skill.toLowerCase().includes(query))
    );
  }, [searchQuery, allEmployees]);

  /**
   * Refresh all data (team analysis + employees)
   * Useful after employees complete BFI-44 test
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalysis();
    setRefreshing(false);
  }, [loadAnalysis]);

  /**
   * Retry risk analysis
   * Called from RiskAnalysisTab when user clicks retry button
   */
  const handleRetryAnalysis = useCallback(async () => {
    console.log('🔄 [handleRetryAnalysis] Retry requested');
    await loadRiskAnalysis();
  }, [loadRiskAnalysis]);

  /**
   * Navigate to project edit page
   * Called from RiskAnalysisTab when project data is incomplete
   */
  const handleEditProject = () => {
    navigate(`/projects/${project._id}/edit`);
  };

  /**
   * Normalize skills array from backend format
   * Backend sends: Array<{skill: string, level: string, distance: number}>
   * Frontend needs: string[] for display
   */
  const normalizeSkillsArray = (skills) => {
    if (!Array.isArray(skills)) return [];
    return skills.map(skill => {
      if (typeof skill === 'string') return skill;
      if (skill?.skill) return skill.skill;
      if (skill?.name) return skill.name;
      return String(skill);
    }).filter(Boolean);
  };

  // Loading State
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>{t('draftTeamAnalysis.loading')}</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertTriangle size={64} color="#dc3545" style={{ marginBottom: '16px' }} />
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadAnalysis} style={styles.retryButton}>
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  // Main Data
  const currentTeam = currentTeamEmployees.length > 0
    ? currentTeamEmployees
    : (teamAnalysis?.currentTeam || []);
  const filteredEmployees = getFilteredEmployees();
  const requiredTeamSize = project.teamSize || project.requiredTeamSize || 5;
  const teamCount = project.assignedEmployees?.length || 0;

  return (
    <div style={styles.container}>
      {/* Header with Project Info */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h2 style={styles.projectTitle}>{project.name}</h2>
            <div style={styles.projectMeta}>
              <span style={styles.metaItem}>
                <Users size={16} />
                {t('draftTeamAnalysis.header.membersProgress', { current: teamCount, required: requiredTeamSize })}
              </span>
              <span style={styles.metaItem}>
                <Calendar size={16} />
                {formatDate(project.estimatedStartDate || project.startDate, notAvailableLabel)}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={styles.refreshButton}
                title={t('draftTeamAnalysis.refresh.title')}
              >
                <RefreshCw size={16} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
                {refreshing ? t('draftTeamAnalysis.refresh.refreshing') : t('common.refresh')}
              </button>
              <button
                onClick={() => setShowConfigModal(true)}
                style={styles.configButton}
                title={t('draftTeamAnalysis.config.title')}
              >
                <Settings size={16} />
                {t('draftTeamAnalysis.config.button')}
              </button>
            </div>
          </div>
          
          {/* Team Progress Indicator */}
          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>{t('draftTeamAnalysis.progress.label')}</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${Math.min((teamCount / requiredTeamSize) * 100, 100)}%`,
                  backgroundColor: teamCount >= requiredTeamSize ? '#28a745' : '#007bff'
                }}
              />
            </div>
            <div style={styles.progressText}>
              {Math.round((teamCount / requiredTeamSize) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('team')}
          style={{
            ...styles.tab,
            ...(activeTab === 'team' ? styles.activeTab : {})
          }}
        >
          <Users size={18} />
          {t('draftTeamAnalysis.teamBuilder')}
          {selectedEmployees.length > 0 && (
            <span style={styles.badge}>{selectedEmployees.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          style={{
            ...styles.tab,
            ...(activeTab === 'risks' ? styles.activeTab : {})
          }}
        >
          <AlertTriangle size={18} />
          {t('draftTeamAnalysis.riskAnalysis')}
          {riskAnalysis?.risks?.length > 0 && (
            <span style={styles.badge}>{riskAnalysis.risks.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'team' && (
          <TeamBuilderTab
            project={project}
            currentTeam={currentTeam}
            filteredEmployees={filteredEmployees}
            synergy={teamAnalysis?.synergy || teamAnalysis?.teamSynergy}
            synergyValidation={teamAnalysis?.synergyValidation}
            selectedEmployees={selectedEmployees}
            searchQuery={searchQuery}
            assignLoading={assignLoading}
            onSearchChange={setSearchQuery}
            onToggleSelection={toggleEmployeeSelection}
            onSelectAll={selectAllVisible}
            onClearSelection={clearSelection}
            onAssign={handleAssignSelected}
            onRemove={handleRemoveEmployee}
          />
        )}
        
        {activeTab === 'risks' && (
          <RiskAnalysisTab
            project={project}
            riskAnalysis={riskAnalysis}
            riskLoading={riskLoading}
            teamCount={teamCount}
            onRetryAnalysis={handleRetryAnalysis}
            onEditProject={handleEditProject}
          />
        )}
      </div>

      {/* Team Configuration Modal */}
      {showConfigModal && (
        <TeamConfigModal
          projectId={project._id}
          onClose={() => setShowConfigModal(false)}
          onSave={async (newConfig) => {
            console.log('Configuration saved:', newConfig);
            setShowConfigModal(false);
            
            // Show loading state
            setRefreshing(true);
            
            // Wait for backend to complete risk analysis (2 seconds should be enough)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reload both team analysis and risk analysis
            await loadAnalysis();
            await loadRiskAnalysis();
            
            setRefreshing(false);
            
            // Notify user if needed
            console.log('✅ Analysis refreshed with new configuration');
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  
  // Header Styles
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '24px 32px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
  },
  headerLeft: {
    flex: 1,
  },
  projectTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  projectMeta: {
    display: 'flex',
    gap: '24px',
    fontSize: '14px',
    opacity: 0.95,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaIcon: {
    fontSize: '16px',
  },
  refreshButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  configButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // Progress Section
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '200px',
  },
  progressLabel: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    opacity: 0.9,
  },
  progressBar: {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  
  // Tab Navigation
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e1e4e8',
    backgroundColor: '#fafbfc',
    padding: '0 24px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '500',
    color: '#586069',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff',
    backgroundColor: '#fff',
  },
  tabIcon: {
    fontSize: '18px',
  },
  badge: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
  
  // Tab Content
  tabContent: {
    padding: '32px',
    minHeight: '600px',
  },
  
  // Loading & Error States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '15px',
    color: '#6c757d',
    margin: 0,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  errorText: {
    fontSize: '15px',
    color: '#dc3545',
    marginBottom: '24px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Add spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.head.querySelector('style[data-animation="spin"]')) {
    styleSheet.setAttribute('data-animation', 'spin');
    document.head.appendChild(styleSheet);
  }
}

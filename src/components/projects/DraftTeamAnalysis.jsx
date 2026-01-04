import React, { useState, useEffect } from 'react';
import { Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  getTeamAnalysis, 
  predictProjectRisks, 
  assignEmployeeToProject, 
  removeEmployeeFromProject 
} from '../../api/projects';
import { getOrganizationEmployees } from '../../api/organization';
import TeamBuilderTab from './team/TeamBuilderTab';
import RiskAnalysisTab from './team/RiskAnalysisTab';

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
  // Tab Management
  const [activeTab, setActiveTab] = useState('team');

  // Data State
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  
  // UI State
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadAnalysis();
  }, [project._id]);

  // Recalculate risks when team changes
  useEffect(() => {
    if (project.assignedEmployees?.length > 0) {
      loadRiskAnalysis();
    } else {
      setRiskAnalysis(null);
    }
  }, [project.assignedEmployees]);

  /**
   * Load team analysis and available employees
   */
  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load team recommendations
      const teamResponse = await getTeamAnalysis(project._id);
      const teamData = teamResponse.data?.data || teamResponse.data;
      setTeamAnalysis(teamData);

      // Load all organization employees
      const employeesResponse = await getOrganizationEmployees(
        project.organization._id || project.organization
      );
      const employeesData = employeesResponse.data?.data || employeesResponse.data;
      let employeesList = employeesData.employees || employeesData || [];

      // Filter out assigned employees
      const assignedIds = new Set(
        project.assignedEmployees?.map(emp => 
          typeof emp === 'string' ? emp : (emp._id || emp.user?._id)
        ) || []
      );
      
      employeesList = employeesList.filter(emp => !assignedIds.has(emp.user._id));

      // Merge with recommendation scores
      const suggestions = teamData.suggestions || teamData.suggestedTeam || [];
      const employeesWithScores = employeesList.map(emp => {
        const recommendation = suggestions.find(s => s.userId === emp.user._id);
        return {
          ...emp,
          matchPercentage: recommendation?.matchPercentage || 0,
          score: recommendation?.score || 999,
          matchedSkills: recommendation?.matchedSkills || [],
          missingSkills: recommendation?.missingSkills || [],
          isRecommended: !!recommendation
        };
      });

      // Sort: recommended first, then by score
      employeesWithScores.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        if (a.score !== b.score) return a.score - b.score;
        return b.matchPercentage - a.matchPercentage;
      });

      setAllEmployees(employeesWithScores);

      // Load initial risks
      if (project.assignedEmployees.length === 0) {
        await loadRiskAnalysis();
      }

    } catch (err) {
      console.error('Error loading analysis:', err);
      setError(err.response?.data?.error || 'Error loading team analysis');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load risk analysis for current team
   */
  const loadRiskAnalysis = async () => {
    try {
      setRiskLoading(true);
      const riskResponse = await predictProjectRisks(project._id);
      const riskData = riskResponse.data?.data || riskResponse.data;
      setRiskAnalysis(riskData);
    } catch (err) {
      console.error('Error loading risk analysis:', err);
    } finally {
      setRiskLoading(false);
    }
  };

  /**
   * Assign selected employees to project
   */
  const handleAssignSelected = async () => {
    if (selectedEmployees.length === 0) return;

    try {
      setAssignLoading(true);
      
      await Promise.all(
        selectedEmployees.map(empId => 
          assignEmployeeToProject(project._id, {
            employeeId: empId,
            assignedRole: 'Developer'
          })
        )
      );
      
      setSelectedEmployees([]);
      
      if (onProjectUpdate) {
        await onProjectUpdate();
      }

      alert(`✓ ${selectedEmployees.length} ${selectedEmployees.length === 1 ? 'person' : 'people'} assigned`);
      
    } catch (err) {
      alert(`⚠ ${err.response?.data?.error || 'Error assigning employees'}`);
    } finally {
      setAssignLoading(false);
    }
  };

  /**
   * Remove employee from project
   */
  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm('Remove this employee from the project?')) return;

    try {
      await removeEmployeeFromProject(project._id, employeeId);
      
      if (onProjectUpdate) {
        await onProjectUpdate();
      }

      alert('✓ 1 person removed');
    } catch (err) {
      alert(`⚠ ${err.response?.data?.error || 'Error removing employee'}`);
    }
  };

  /**
   * Toggle employee selection
   */
  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  /**
   * Select all visible employees
   */
  const selectAllVisible = () => {
    const visibleEmployeeIds = getFilteredEmployees().map(emp => emp.user._id);
    setSelectedEmployees(visibleEmployeeIds);
  };

  /**
   * Clear selection
   */
  const clearSelection = () => {
    setSelectedEmployees([]);
  };

  /**
   * Filter employees by search query
   */
  const getFilteredEmployees = () => {
    if (!searchQuery.trim()) return allEmployees;
    
    const query = searchQuery.toLowerCase();
    return allEmployees.filter(emp => 
      emp.user.name.toLowerCase().includes(query) ||
      emp.user.email.toLowerCase().includes(query) ||
      emp.matchedSkills.some(skill => skill.toLowerCase().includes(query))
    );
  };



  // Loading State
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading team analysis...</p>
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
          Retry
        </button>
      </div>
    );
  }

  // Main Data
  const currentTeam = teamAnalysis?.currentTeam || [];
  const filteredEmployees = getFilteredEmployees();
  const requiredTeamSize = project.requiredTeamSize || 6;
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
                {teamCount} / {requiredTeamSize} members
              </span>
              <span style={styles.metaItem}>
                <Calendar size={16} />
                {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Team Progress Indicator */}
          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>Team Progress</div>
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
          Team Builder
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
          Risk Analysis
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
          />
        )}
      </div>
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
    borderBottom: '3px solid transparent',
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

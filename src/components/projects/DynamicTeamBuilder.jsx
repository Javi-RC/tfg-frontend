import React, { useState, useEffect } from 'react';
import { 
  X, Users, AlertTriangle, CheckCircle, Lightbulb, 
  TrendingUp, TrendingDown, ArrowRight, ThumbsUp 
} from 'lucide-react';
import { previewProjectRisks, suggestTeam } from '../../api/projects';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { RISK_SEVERITY_COLORS } from '../../types/projectTypes';

/**
 * Dynamic Team Builder
 * CRITICAL COMPONENT - Shows real-time risk analysis as team members are selected
 * Split view: Left = Team selection, Right = Live risk predictions
 */
export default function DynamicTeamBuilder({ 
  project, 
  organizationId,
  onAssignTeam,
  onClose 
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentRisks, setCurrentRisks] = useState(null);
  const [riskMetadata, setRiskMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [riskLoading, setRiskLoading] = useState(false);
  const [error, setError] = useState(null);
  const [whatIfScenarios, setWhatIfScenarios] = useState([]);
  const [scenariosLoading, setScenariosLoading] = useState(false);

  const recommendedSize = 5; // Could be calculated from project complexity

  useEffect(() => {
    loadRecommendations();
  }, []);

  useEffect(() => {
    if (selectedEmployees.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchRiskPreview();
      }, 500); // Debounce 500ms
      
      return () => clearTimeout(timeoutId);
    } else {
      setCurrentRisks(null);
      setRiskMetadata(null);
    }
  }, [selectedEmployees]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      if (!project) {
        throw new Error('Project data is required');
      }

      // Ensure mainTechnologies is always an array
      const mainTechnologies = Array.isArray(project.mainTechnologies) 
        ? project.mainTechnologies 
        : [];

      const requestPayload = {
        projectRequirements: {
          mainTechnologies,
          requiredExperienceLevel: project.requiredExperienceLevel || 'intermediate',
          systemComplexity: project.systemComplexity || 'medium',
          weeklyHoursPerMember: project.weeklyHoursPerMember || 20
        },
        organizationId,
        teamSize: recommendedSize
      };

      console.log('Requesting team suggestions with:', requestPayload);

      const response = await suggestTeam(requestPayload);

      const data = response.data?.data || response.data;
      setRecommendations(data.team || []);
      
    } catch (err) {
      console.error('Error loading recommendations:', err);
      console.error('Error details:', err.response?.data);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Error loading team recommendations';
      if (err.response?.data?.error) {
        const backendError = err.response.data.error;
        if (backendError.includes('filter')) {
          errorMessage = 'No employees found in the organization. Please add employees before building a team.';
        } else {
          errorMessage = backendError;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiskPreview = async () => {
    try {
      setRiskLoading(true);
      
      const response = await previewProjectRisks(project._id, {
        selectedEmployeeIds: selectedEmployees
      });

      const data = response.data?.data || response.data;
      setCurrentRisks(data.risks || []);
      setRiskMetadata({
        confidence: data.confidence,
        overallRiskLevel: data.overallRiskLevel,
        metrics: data.metrics
      });
      
    } catch (err) {
      console.error('Error fetching risk preview:', err);
      // Don't show error to user - just log it
    } finally {
      setRiskLoading(false);
    }
  };

  const generateWhatIfScenarios = async () => {
    // Generate what-if scenarios for top unselected candidates
    const unselectedCandidates = recommendations.filter(
      emp => !selectedEmployees.includes(emp.userId)
    );

    if (unselectedCandidates.length === 0 || selectedEmployees.length === 0) {
      setWhatIfScenarios([]);
      return;
    }

    try {
      setScenariosLoading(true);
      
      // Take top 3 unselected candidates
      const topCandidates = unselectedCandidates.slice(0, 3);
      const scenarios = [];

      for (const candidate of topCandidates) {
        try {
          // Preview risks with this candidate added
          const response = await previewProjectRisks(project._id, {
            selectedEmployeeIds: [...selectedEmployees, candidate.userId]
          });

          const data = response.data?.data || response.data;
          const newRisks = data.risks || [];
          
          // Calculate changes
          const currentHighRisks = (currentRisks || []).filter(
            r => r.severity === 'high' || r.severity === 'critical'
          ).length;
          const newHighRisks = newRisks.filter(
            r => r.severity === 'high' || r.severity === 'critical'
          ).length;
          
          const currentRiskLevel = calculateRiskLevel(currentRisks);
          const newRiskLevel = calculateRiskLevel(newRisks);
          
          // Detect resolved and new risks
          const resolvedRisks = (currentRisks || []).filter(
            cr => !newRisks.some(nr => nr.type === cr.type)
          );
          const newlyAppearing = newRisks.filter(
            nr => !(currentRisks || []).some(cr => cr.type === nr.type)
          );

          scenarios.push({
            employee: candidate,
            newRiskLevel,
            riskLevelChange: currentRiskLevel !== newRiskLevel,
            improves: newHighRisks < currentHighRisks,
            worsens: newHighRisks > currentHighRisks,
            resolvedRisks: resolvedRisks.map(r => r.type),
            newRisks: newlyAppearing.filter(r => r.severity === 'high' || r.severity === 'critical'),
            skillCoverage: data.metrics?.skillCoverage || 0
          });
        } catch (err) {
          console.error(`Error calculating scenario for ${candidate.name}:`, err);
        }
      }

      setWhatIfScenarios(scenarios);
      
    } catch (err) {
      console.error('Error generating what-if scenarios:', err);
    } finally {
      setScenariosLoading(false);
    }
  };

  // Trigger what-if scenarios when risks are updated
  useEffect(() => {
    if (currentRisks && selectedEmployees.length > 0 && selectedEmployees.length < recommendedSize) {
      generateWhatIfScenarios();
    } else {
      setWhatIfScenarios([]);
    }
  }, [currentRisks, selectedEmployees]);

  const handleToggleEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAssignSelected = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    onAssignTeam(selectedEmployees);
  };

  const calculateRiskLevel = (risks) => {
    if (!risks || risks.length === 0) return 'Low';
    const highSeverity = risks.filter(r => r.severity === 'high' || r.severity === 'critical').length;
    if (highSeverity > 2) return 'High';
    if (highSeverity > 0) return 'Medium';
    return 'Low';
  };

  const getOverallSeverity = (risks) => {
    const level = calculateRiskLevel(risks);
    if (level === 'High') return 'error';
    if (level === 'Medium') return 'warning';
    return 'success';
  };

  const formatRiskType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Dynamic Team Builder</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.errorBox}>
              <X size={20} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={styles.splitView}>
            {/* LEFT PANEL - Team Selection */}
            <div style={styles.leftPanel}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>
                  <Users size={20} />
                  Team Selection ({selectedEmployees.length}/{recommendedSize})
                </h3>
              </div>

              {loading ? (
                <div style={styles.loadingState}>
                  <div style={styles.spinner}></div>
                  <p>Loading recommendations...</p>
                </div>
              ) : error ? (
                <div style={styles.emptyStateError}>
                  <Users size={64} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
                  <h4 style={styles.emptyStateTitle}>Cannot Load Team Recommendations</h4>
                  <p style={styles.emptyStateMessage}>{error}</p>
                  {error.includes('employees') && (
                    <div style={styles.emptyStateHelp}>
                      <p style={styles.helpText}>To use the team builder:</p>
                      <ul style={styles.helpList}>
                        <li>Add employees to your organization</li>
                        <li>Ensure employees have uploaded their CVs</li>
                        <li>Make sure employee profiles are complete</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : recommendations.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No recommendations available</p>
                  <small>Try adjusting project requirements</small>
                </div>
              ) : (
                <div style={styles.employeeList}>
                  {recommendations.map(emp => {
                      const isSelected = selectedEmployees.includes(emp.userId);
                      
                      return (
                        <div
                          key={emp.userId}
                          style={{
                            ...styles.employeeCard,
                            ...(isSelected ? styles.employeeCardSelected : {})
                          }}
                          onClick={() => handleToggleEmployee(emp.userId)}
                        >
                          <div style={styles.employeeHeader}>
                            <div style={styles.employeeInfo}>
                              <div style={styles.employeeName}>{emp.user.name}</div>
                              <div style={styles.employeeEmail}>{emp.user.email}</div>
                            </div>
                            <div style={styles.matchBadge}>
                              {emp.matchPercentage}%
                            </div>
                          </div>

                          <div style={styles.employeeSkills}>
                            <div style={styles.skillsRow}>
                              <CheckCircle size={16} style={{ color: '#28a745', flexShrink: 0 }} />
                              <strong style={styles.skillsLabel}>Matched:</strong>
                              {emp.matchedSkills.slice(0, 3).map(skill => (
                                <span key={skill} style={styles.skillChip}>
                                  {skill}
                                </span>
                              ))}
                              {emp.matchedSkills.length > 3 && (
                                <span style={styles.skillMore}>
                                  +{emp.matchedSkills.length - 3}
                                </span>
                              )}
                            </div>
                            {emp.missingSkills.length > 0 && (
                              <div style={styles.skillsRow}>
                                <AlertTriangle size={16} style={{ color: '#ffc107', flexShrink: 0 }} />
                                <strong style={styles.skillsLabelWarning}>Missing:</strong>
                                {emp.missingSkills.slice(0, 2).map(skill => (
                                  <span key={skill} style={styles.skillChipWarning}>
                                    {skill}
                                  </span>
                                ))}
                                {emp.missingSkills.length > 2 && (
                                  <span style={styles.skillMore}>
                                    +{emp.missingSkills.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div style={styles.employeeScore}>
                            Score: {emp.score.toFixed(2)}
                          </div>

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleEmployee(emp.userId);
                            }}
                            style={styles.checkbox}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* RIGHT PANEL - Live Risk Analysis */}
            <div style={styles.rightPanel}>
              <div style={styles.panelHeader}>
                <h3 style={{ ...styles.panelTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  Risk Analysis ({currentRisks?.length || 0} risks)
                </h3>
                {riskLoading && <div style={styles.miniSpinner}></div>}
              </div>

              {selectedEmployees.length === 0 ? (
                <div style={styles.emptyState}>
                  <ThumbsUp size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p>Select team members to see predicted risks</p>
                </div>
              ) : riskLoading ? (
                <div style={styles.loadingState}>
                  <div style={styles.spinner}></div>
                  <p>Analyzing risks...</p>
                </div>
              ) : currentRisks ? (
                <div style={styles.riskContent}>
                  {/* Metrics */}
                  {riskMetadata && (
                    <div style={styles.metricsRow}>
                      <div style={styles.metricBadge}>
                        Confidence: {((riskMetadata.confidence || 0) * 100).toFixed(0)}%
                      </div>
                      <div style={styles.metricBadge}>
                        Team: {selectedEmployees.length}/{recommendedSize}
                      </div>
                      <div style={{
                        ...styles.metricBadge,
                        ...(selectedEmployees.length < recommendedSize 
                          ? styles.metricWarning 
                          : styles.metricSuccess)
                      }}>
                        {selectedEmployees.length < recommendedSize 
                          ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={14} />
                                Incomplete
                              </span>
                            )
                          : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={14} />
                                Complete
                              </span>
                            )}
                      </div>
                    </div>
                  )}

                  {/* Overall Risk Level */}
                  <div style={{
                    ...styles.overallRiskBox,
                    ...(getOverallSeverity(currentRisks) === 'error' 
                      ? styles.overallRiskHigh 
                      : getOverallSeverity(currentRisks) === 'warning'
                      ? styles.overallRiskMedium
                      : styles.overallRiskLow)
                  }}>
                    <strong>Overall Risk Level: {calculateRiskLevel(currentRisks)}</strong>
                    <p>
                      {currentRisks.length === 0 
                        ? 'No significant risks detected with current team' 
                        : `${currentRisks.filter(r => r.severity === 'high' || r.severity === 'critical').length} high severity risks detected`}
                    </p>
                  </div>

                  {/* Risk Cards */}
                  <div style={styles.riskList}>
                    {currentRisks.length === 0 ? (
                      <div style={styles.successBox}>
                        <CheckCircle size={24} color="#28a745" style={{ flexShrink: 0 }} />
                        <div>
                          <strong>Great team composition!</strong>
                          <p>No significant risks detected with the current selection.</p>
                        </div>
                      </div>
                    ) : (
                      currentRisks.map((risk, index) => {
                        const severityColor = RISK_SEVERITY_COLORS[risk.severity] || 
                                             RISK_SEVERITY_COLORS.medium;
                        
                        return (
                          <div key={risk.type || index} style={styles.riskCard}>
                            <div style={styles.riskHeader}>
                              <div style={{
                                ...styles.severityBadge,
                                backgroundColor: severityColor.bg,
                                color: severityColor.text
                              }}>
                                {risk.severity.toUpperCase()}
                              </div>
                              <div style={styles.riskTitle}>{formatRiskType(risk.type)}</div>
                            </div>

                            <div style={styles.riskBody}>
                              <div style={styles.riskMeta}>
                                <span>{risk.category}</span>
                                <span>•</span>
                                <span>Probability: {((risk.probability || 0) * 100).toFixed(0)}%</span>
                              </div>

                              {risk.reasoning && risk.reasoning.length > 0 && (
                                <div style={styles.riskReason}>
                                  {risk.reasoning[0]}
                                </div>
                              )}

                              {risk.recommendations && risk.recommendations.length > 0 && (
                                <div style={{ ...styles.riskRecommendation, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                  <Lightbulb size={16} style={{ color: '#ffc107', flexShrink: 0 }} />
                                  <div>
                                    <strong>Mitigation:</strong> {risk.recommendations[0]}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* What-If Scenarios Section */}
                  {selectedEmployees.length < recommendedSize && whatIfScenarios.length > 0 && (
                    <div style={styles.whatIfSection}>
                      <h4 style={{ ...styles.whatIfTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lightbulb size={20} />
                        What If...
                      </h4>
                      <p style={styles.whatIfSubtitle}>
                        See how adding these candidates would impact risks
                      </p>

                      {scenariosLoading ? (
                        <div style={styles.miniLoadingState}>
                          <div style={styles.miniSpinner}></div>
                          <span>Calculating scenarios...</span>
                        </div>
                      ) : (
                        <div style={styles.scenariosList}>
                          {whatIfScenarios.map((scenario, idx) => (
                            <div key={scenario.employee.userId} style={styles.scenarioCard}>
                              <div style={styles.scenarioHeader}>
                                <strong style={styles.scenarioName}>
                                  If you add: {scenario.employee.name}
                                </strong>
                                {scenario.employee.matchScore && (
                                  <span style={styles.scenarioMatch}>
                                    Match: {(scenario.employee.matchScore * 100).toFixed(0)}%
                                  </span>
                                )}
                              </div>

                              <div style={styles.scenarioMetrics}>
                                {/* Risk Level Change */}
                                <div style={styles.scenarioMetric}>
                                  <span style={styles.metricLabel}>Risk Level:</span>
                                  <span style={styles.metricChange}>
                                    {scenario.improves && (
                                      <span style={styles.changeGood}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          {scenario.newRiskLevel}
                                          <TrendingUp size={16} />
                                          <span>(Improves)</span>
                                        </span>
                                      </span>
                                    )}
                                    {scenario.worsens && (
                                      <span style={styles.changeBad}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          {scenario.newRiskLevel}
                                          <TrendingDown size={16} />
                                          <span>(Worsens)</span>
                                        </span>
                                      </span>
                                    )}
                                    {!scenario.improves && !scenario.worsens && (
                                      <span style={styles.changeNeutral}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          {scenario.newRiskLevel}
                                          <ArrowRight size={16} />
                                          <span>(No change)</span>
                                        </span>
                                      </span>
                                    )}
                                  </span>
                                </div>

                                {/* Skill Coverage */}
                                {scenario.skillCoverage > 0 && (
                                  <div style={styles.scenarioMetric}>
                                    <span style={styles.metricLabel}>Skill Coverage:</span>
                                    <span style={styles.metricValue}>
                                      {(scenario.skillCoverage * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                )}

                                {/* Resolved Risks */}
                                {scenario.resolvedRisks.length > 0 && (
                                  <div style={{ ...styles.scenarioResolved, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={16} style={{ color: '#28a745' }} />
                                    <span>Resolves: {scenario.resolvedRisks.map(formatRiskType).join(', ')}</span>
                                  </div>
                                )}

                                {/* New Risks */}
                                {scenario.newRisks.length > 0 && (
                                  <div style={{ ...styles.scenarioNewRisk, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                    <AlertTriangle size={16} style={{ color: '#ffc107', flexShrink: 0 }} />
                                    <div>
                                      <strong>New Risk:</strong> {formatRiskType(scenario.newRisks[0].type)}
                                      {scenario.newRisks[0].reasoning && scenario.newRisks[0].reasoning.length > 0 && (
                                        <div style={styles.newRiskDetail}>
                                          {scenario.newRisks[0].reasoning[0]}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* No issues */}
                                {scenario.resolvedRisks.length === 0 && scenario.newRisks.length === 0 && !scenario.worsens && (
                                  <div style={styles.scenarioNeutral}>
                                    No significant changes detected
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleToggleEmployee(scenario.employee.userId)}
                                style={{
                                  ...styles.scenarioButton,
                                  ...(scenario.improves ? styles.scenarioButtonGood : {})
                                }}
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  {scenario.improves && <CheckCircle size={14} />}
                                  Add {scenario.employee.name.split(' ')[0]}
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleAssignSelected}
            disabled={selectedEmployees.length === 0}
          >
            Assign Selected Team ({selectedEmployees.length})
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '95%',
    maxWidth: '1400px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  splitView: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    backgroundColor: '#E5E7EB',
    height: '100%',
    overflow: 'hidden'
  },
  leftPanel: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  rightPanel: {
    backgroundColor: '#F9FAFB',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  panelHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
    color: '#111827'
  },
  employeeList: {
    flex: 1,
    overflow: 'auto',
    padding: '16px'
  },
  employeeCard: {
    backgroundColor: 'white',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative'
  },
  employeeCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF'
  },
  employeeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  employeeInfo: {
    flex: 1
  },
  employeeName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '4px'
  },
  employeeEmail: {
    fontSize: '13px',
    color: '#6B7280'
  },
  matchBadge: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600
  },
  employeeSkills: {
    marginBottom: '12px'
  },
  skillsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '6px'
  },
  skillsLabel: {
    fontSize: '12px',
    color: '#10B981',
    marginRight: '4px'
  },
  skillsLabelWarning: {
    fontSize: '12px',
    color: '#F59E0B',
    marginRight: '4px'
  },
  skillChip: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  skillChipWarning: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  skillMore: {
    fontSize: '12px',
    color: '#6B7280',
    fontStyle: 'italic'
  },
  employeeScore: {
    fontSize: '12px',
    color: '#6B7280'
  },
  checkbox: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  riskContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px'
  },
  metricsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  metricBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: '#E5E7EB',
    color: '#374151'
  },
  metricWarning: {
    backgroundColor: '#FEF3C7',
    color: '#92400E'
  },
  metricSuccess: {
    backgroundColor: '#D1FAE5',
    color: '#065F46'
  },
  overallRiskBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '2px solid'
  },
  overallRiskLow: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    color: '#065F46'
  },
  overallRiskMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    color: '#92400E'
  },
  overallRiskHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    color: '#991B1B'
  },
  riskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  riskCard: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  riskHeader: {
    padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  severityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px'
  },
  riskTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827'
  },
  riskBody: {
    padding: '12px 16px'
  },
  riskMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '8px'
  },
  riskReason: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: '1.5',
    marginBottom: '8px'
  },
  riskRecommendation: {
    fontSize: '12px',
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    padding: '8px 12px',
    borderRadius: '6px',
    lineHeight: '1.4'
  },
  whatIfSection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px solid #E5E7EB'
  },
  whatIfTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '4px'
  },
  whatIfSubtitle: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '16px'
  },
  miniLoadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#6B7280'
  },
  scenariosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  scenarioCard: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '14px',
    transition: 'all 0.2s'
  },
  scenarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  scenarioName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827'
  },
  scenarioMatch: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  scenarioMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px'
  },
  scenarioMetric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  metricLabel: {
    color: '#6B7280',
    fontWeight: 500
  },
  metricChange: {
    fontWeight: 600
  },
  metricValue: {
    color: '#111827',
    fontWeight: 600
  },
  changeGood: {
    color: '#10B981'
  },
  changeBad: {
    color: '#EF4444'
  },
  changeNeutral: {
    color: '#6B7280'
  },
  scenarioResolved: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#D1FAE5',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#065F46'
  },
  resolvedIcon: {
    fontSize: '14px'
  },
  scenarioNewRisk: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#FEF3C7',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#92400E'
  },
  newRiskIcon: {
    fontSize: '14px',
    flexShrink: 0
  },
  newRiskDetail: {
    fontSize: '11px',
    color: '#6B7280',
    marginTop: '4px'
  },
  scenarioNeutral: {
    fontSize: '12px',
    color: '#6B7280',
    fontStyle: 'italic'
  },
  scenarioButton: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#F3F4F6',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px'
  },
  scenarioButtonGood: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    color: '#065F46'
  },  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#6B7280'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  miniSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #E5E7EB',
    borderTop: '2px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#6B7280',
    textAlign: 'center'
  },
  emptyStateError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#991B1B',
    textAlign: 'center'
  },
  emptyStateIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyStateTitle: {
    fontSize: '18px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#111827'
  },
  emptyStateMessage: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 16px 0',
    maxWidth: '400px'
  },
  emptyStateHelp: {
    backgroundColor: '#F3F4F6',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
    maxWidth: '400px'
  },
  helpText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    margin: '0 0 8px 0'
  },
  helpList: {
    textAlign: 'left',
    margin: '0',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: 1.6
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  successBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#D1FAE5',
    border: '1px solid #10B981',
    borderRadius: '8px'
  },
  successIcon: {
    fontSize: '24px',
    color: '#10B981',
    flexShrink: 0
  },
  errorBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEE2E2',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    margin: '16px',
    alignItems: 'center',
    color: '#991B1B'
  },
  errorIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // Ignore if rule already exists
  }
}

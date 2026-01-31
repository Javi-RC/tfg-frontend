/**
 * Risk Types and Constants
 * Defines risk states, severity levels, and type definitions
 */

// ==================== Risk States ====================

/**
 * Risk status during project lifecycle
 * @readonly
 * @enum {string}
 */
export const RISK_STATUS = {
  /** Risk predicted and being monitored during project execution */
  PREDICTED: 'predicted',
  
  /** Risk marked as occurred during project retrospective (COMPLETED projects only) */
  OCCURRED: 'occurred',
  
  /** Risk marked as not occurred during project retrospective */
  NOT_OCCURRED: 'not_occurred',
  
  /** Project finished, risk closed */
  CLOSED: 'closed'
};

/**
 * Risk severity levels
 * @readonly
 * @enum {string}
 */
export const RISK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Risk source (prediction method)
 * @readonly
 * @enum {string}
 */
export const RISK_SOURCE = {
  /** Expert rules risk detection */
  DECISION_TREE: 'dt',
  
  /** Case-Based Reasoning - Historical learning */
  CBR: 'cbr',
  
  /** Manual risk added by PM */
  MANUAL: 'manual'
};

// ==================== Risk Types ====================

/**
 * Common risk types in software projects
 * @readonly
 * @enum {string}
 */
export const RISK_TYPES = {
  COMMUNICATION_BREAKDOWN: 'communication_breakdown',
  SCOPE_CREEP: 'scope_creep',
  SKILL_GAP: 'skill_gap',
  TIMELINE_PRESSURE: 'timeline_pressure',
  RESOURCE_SHORTAGE: 'resource_shortage',
  TECHNICAL_DEBT: 'technical_debt',
  INTEGRATION_ISSUES: 'integration_issues',
  QUALITY_ISSUES: 'quality_issues',
  DEPENDENCY_DELAYS: 'dependency_delays',
  REQUIREMENTS_CHANGE: 'requirements_change',
  TEAM_TURNOVER: 'team_turnover',
  KNOWLEDGE_LOSS: 'knowledge_loss'
};

// ==================== Risk Lifecycle States ====================

/**
 * Risk state mapping during monitoring phase
 * 
 * NEW FLOW (Backend Refactoring - January 2026):
 * During project ACTIVE phase:
 *   - All risks have status 'active' (predicted by DT/CBR or added manually)
 *   - No marking of occurred/not_occurred during execution
 * 
 * During project retrospective (COMPLETED phase):
 *   - PM fills outcome form marking each risk as occurred: true/false
 *   - This data is used for CBR learning
 * 
 * | State          | Status       | occurred | When                                    |
 * |----------------|--------------|----------|----------------------------------------|
 * | predicted      | predicted    | null     | During project execution (monitoring)   |
 * | retrospective  | occurred     | true     | Marked in outcome form (retrospective)  |
 * | retrospective  | not_occurred | false    | Marked in outcome form (retrospective)  |
 * | closed         | closed       | true/false| Project archived                        |
 */
export const RISK_LIFECYCLE_STATES = {
  PREDICTED_MONITORING: { status: RISK_STATUS.PREDICTED, occurred: null },
  RETROSPECTIVE_OCCURRED: { status: RISK_STATUS.OCCURRED, occurred: true },
  RETROSPECTIVE_NOT_OCCURRED: { status: RISK_STATUS.NOT_OCCURRED, occurred: false },
  PROJECT_CLOSED: { status: RISK_STATUS.CLOSED }
};

// ==================== Type Definitions (JSDoc) ====================

/**
 * @typedef {Object} RiskOccurrenceData
 * @property {boolean} occurred - Whether risk occurred (true)
 * @property {string} detectedAt - ISO8601 date when risk was detected
 * @property {string} actualSeverity - Actual severity (low|medium|high|critical)
 * @property {Object} actualImpact - Impact details
 * @property {number} actualImpact.scheduleDelayDays - Days of schedule delay
 * @property {number} actualImpact.budgetOverrunPercent - Budget overrun percentage
 * @property {number} actualImpact.qualityScore - Quality score (0-1)
 * @property {string} actualImpact.description - Impact description
 * @property {string} rootCause - Root cause of the risk
 * @property {string} [mitigatedAt] - ISO8601 date when risk was mitigated (optional)
 */

/**
 * @typedef {Object} ActualizedRisk
 * @property {string} type - Risk type
 * @property {boolean} occurred - Whether risk occurred
 * @property {string} [severity] - Severity if occurred (low|medium|high|critical)
 * @property {number} [scheduleDelayDays] - Schedule delay in days
 * @property {number} [budgetOverrunPercent] - Budget overrun percentage
 * @property {string} [description] - Impact description
 */

/**
 * @typedef {Object} ProjectOutcome
 * @property {boolean} completed - Whether project completed successfully
 * @property {string} actualCompletedDate - Completion date (YYYY-MM-DD)
 * @property {number} actualHours - Actual hours spent
 * @property {number} budgetOverrun - Budget overrun amount
 * @property {number} qualityScore - Quality score (0-1)
 * @property {number} clientSatisfaction - Client satisfaction (1-5)
 * @property {number} teamMorale - Team morale (1-5)
 * @property {ActualizedRisk[]} actualizedRisks - All risks (occurred and not occurred)
 * @property {string[]} lessonsLearned - Lessons learned
 * @property {string[]} successfulPractices - Successful practices
 * @property {string[]} unsuccessfulPractices - Unsuccessful practices
 * @property {string[]} recommendations - Recommendations for future
 * @property {Object} metrics - Additional metrics
 */

/**
 * @typedef {Object} Risk
 * @property {string} _id - Risk ID
 * @property {string} type - Risk type
 * @property {string} title - Risk title
 * @property {string} description - Risk description
 * @property {string} severity - Severity level
 * @property {number} probability - Probability (0-1)
 * @property {number} [confidence] - Confidence score for predictions (0-1)
 * @property {string} source - Risk source (dt|cbr|manual)
 * @property {string[]} [indicators] - Indicators that triggered risk
 * @property {string[]} [recommendations] - Recommendations to mitigate
 * @property {boolean|null} occurred - Whether risk occurred (null = not decided, set in retrospective)
 * @property {string|null} detectedAt - When risk was detected
 * @property {string} status - Risk status (predicted|occurred|not_occurred|closed)
 * @property {Object} [actualImpact] - Actual impact if occurred
 * @property {string} [rootCause] - Root cause if occurred
 * @property {string} [mitigatedAt] - When risk was mitigated
 */

// ==================== Helper Functions ====================

/**
 * Determine risk state from risk object
 * @param {Risk} risk - Risk object
 * @returns {string} Human-readable state
 */
export function getRiskState(risk) {
  if (risk.status === RISK_STATUS.CLOSED) {
    return 'Closed';
  }
  if (risk.status === RISK_STATUS.PREDICTED) {
    return 'Predicted';
  }
  if (risk.status === RISK_STATUS.OCCURRED) {
    return 'Occurred';
  }
  if (risk.status === RISK_STATUS.NOT_OCCURRED) {
    return 'Not Occurred';
  }
  return 'Unknown';
}

/**
 * Check if risk can be marked as occurred
 * @deprecated - As of January 2026, risks are not marked as occurred during execution.
 * They are marked in the project retrospective (outcome form) when project is COMPLETED.
 * @param {Risk} risk - Risk object
 * @returns {boolean} Always returns false during active project
 */
export function canMarkAsOccurred() {
  // Risks are marked as occurred/not_occurred only in retrospective (outcome form)
  // Not during active project execution
  return false;
}

/**
 * Get risk severity color
 * @param {string} severity - Severity level
 * @returns {string} Color code
 */
export function getRiskSeverityColor(severity) {
  const colors = {
    [RISK_SEVERITY.LOW]: '#10b981',      // green
    [RISK_SEVERITY.MEDIUM]: '#f59e0b',   // amber
    [RISK_SEVERITY.HIGH]: '#ef4444',     // red
    [RISK_SEVERITY.CRITICAL]: '#991b1b'  // dark red
  };
  return colors[severity] || '#6b7280'; // gray as default
}

/**
 * Get risk source badge text
 * @param {string} source - Risk source
 * @returns {string} Badge text
 */
export function getRiskSourceLabel(source) {
  const labels = {
    [RISK_SOURCE.DECISION_TREE]: 'Expert Rules',
    [RISK_SOURCE.CBR]: 'Historical Data',
    [RISK_SOURCE.MANUAL]: 'Manual'
  };
  return labels[source] || 'Unknown';
}

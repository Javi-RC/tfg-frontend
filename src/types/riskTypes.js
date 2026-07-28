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
  CLOSED: 'closed',
};

/**
 * Risk severity levels
 * @readonly
 * @enum {string}
 */
const RISK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Risk source (prediction method)
 * @readonly
 * @enum {string}
 */
const RISK_SOURCE = {
  /** Expert rules risk detection */
  DECISION_TREE: 'dt',

  /** Case-Based Reasoning - Historical learning */
  CBR: 'cbr',

  /** Manual risk added by PM */
  MANUAL: 'manual',
};

// ==================== Risk Types ====================

/**
 * Common risk types in software projects
 * @readonly
 * @enum {string}
 */
const RISK_TYPES = {
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
  KNOWLEDGE_LOSS: 'knowledge_loss',
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
const RISK_LIFECYCLE_STATES = {
  PREDICTED_MONITORING: { status: RISK_STATUS.PREDICTED, occurred: null },
  RETROSPECTIVE_OCCURRED: { status: RISK_STATUS.OCCURRED, occurred: true },
  RETROSPECTIVE_NOT_OCCURRED: { status: RISK_STATUS.NOT_OCCURRED, occurred: false },
  PROJECT_CLOSED: { status: RISK_STATUS.CLOSED },
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



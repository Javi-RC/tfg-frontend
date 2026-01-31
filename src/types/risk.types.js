/**
 * Risk-related types and interfaces
 * Defines the structure for DT, CBR, and PM-selected risks
 */

/**
 * @typedef {Object} DTRisk
 * Expert rules detected risk (early warning, no learned cases yet)
 * @property {string} id - Unique identifier
 * @property {string} type - Risk type (e.g., 'communication_breakdown')
 * @property {string} title - Risk title
 * @property {string} description - Risk description
 * @property {'critical'|'high'|'medium'|'low'} severity - Risk severity
 * @property {number} confidence - DT confidence (0-1)
 * @property {string[]} indicators - Patterns that triggered detection
 * @property {string} source - Always 'expert_rules'
 */

/**
 * @typedef {Object} CBRRisk
 * Case-Based Reasoning risk (learned from similar projects)
 * @property {string} id - Unique identifier
 * @property {string} type - Risk type
 * @property {string} title - Risk title
 * @property {string} description - Risk description
 * @property {'critical'|'high'|'medium'|'low'} severity - Risk severity
 * @property {number} probability - Probability based on similarity (0-1)
 * @property {string[]} recommendations - Mitigation strategies
 * @property {Object[]} basedOnCases - Similar projects that had this risk
 * @property {number} basedOnCases[].caseId - ID of similar project
 * @property {string} basedOnCases[].projectName - Name of similar project
 * @property {number} basedOnCases[].similarity - Overall similarity score (0-1)
 * @property {Object} similarityBreakdown - Breakdown by category
 * @property {number} similarityBreakdown.teamComposition - Team similarity
 * @property {number} similarityBreakdown.scope - Scope similarity
 * @property {number} similarityBreakdown.technology - Tech similarity
 * @property {number} similarityBreakdown.duration - Duration similarity
 * @property {string} source - Always 'cbr'
 */

/**
 * @typedef {Object} PMSelectedRisk
 * Risk accepted by PM for monitoring
 * @property {string} riskId - Reference to DT or CBR risk
 * @property {'cbr'|'expert_rules'} originalSource - Original source
 * @property {Date} acceptedAt - When PM accepted this risk
 * @property {string} acceptedBy - User ID who accepted
 */

/**
 * @typedef {Object} RiskPredictionResponse
 * Response from /risks/predict endpoint
 * @property {DTRisk[]} dtRisks - Detected by Expert Rules
 * @property {CBRRisk[]} cbrRisks - Detected by Case-Based Reasoning
 * @property {Object} detectionSummary
 * @property {number} detectionSummary.dtCount - Number of DT risks
 * @property {number} detectionSummary.cbrCount - Number of CBR risks
 * @property {number} detectionSummary.commonTypes - Risks found in both
 * @property {string[]} detectionSummary.riskTypes - All unique risk types
 */

/**
 * @typedef {Object} RiskAcceptanceRequest
 * Request to accept CBR risks for monitoring
 * @property {string[]} riskIds - IDs of risks to monitor
 */

export const RiskTypes = {
  communication_breakdown: 'Communication Breakdown',
  scope_creep: 'Scope Creep',
  skill_gap: 'Skill Gap',
  resource_shortage: 'Resource Shortage',
  technical_debt: 'Technical Debt',
  integration_issues: 'Integration Issues',
  timeline_pressure: 'Timeline Pressure',
  vendor_lock_in: 'Vendor Lock-in',
  knowledge_silos: 'Knowledge Silos',
  stakeholder_misalignment: 'Stakeholder Misalignment'
};

export const SeverityLevels = {
  critical: { level: 'critical', color: '#DC2626', label: 'Critical' },
  high: { level: 'high', color: '#F59E0B', label: 'High' },
  medium: { level: 'medium', color: '#EAB308', label: 'Medium' },
  low: { level: 'low', color: '#10B981', label: 'Low' }
};

export const RiskSourceBadges = {
  expert_rules: { icon: '🔍', label: 'Early Warning', color: '#667EEA' },
  cbr: { icon: '📚', label: 'Learned Risk', color: '#10B981' },
  cbr_selected: { icon: '🎯', label: 'Monitored', color: '#F59E0B' },
  expert_rules_early_warning: { icon: '⚠️', label: 'Early Warning', color: '#DC2626' }
};

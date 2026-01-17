/**
 * Personality / Team Synergy JSDoc Types
 *
 * This file is used for editor IntelliSense and optional type-checking via JSDoc.
 * Import types in JSDoc with:
 * @param {import('../types/personality.jsdoc').TeamSynergyMetrics} synergy
 */

/**
 * @typedef {Object} TeamSynergyMetrics
 * @property {boolean} available - Whether personality data is available
 * @property {number} [teamSize] - Team size
 * @property {number} [profilesCovered] - Members with BFI-44 profile
 * @property {number} [coveragePercentage] - Profile coverage percentage
 * @property {string} [projectType] - Project type
 * @property {{name: string, description: string}} [projectProfile] - Project profile
 * @property {number} [overallScore] - Overall synergy score (0-100)
 * @property {{
 *   roleDiversity: RoleDiversityMetric,
 *   complementarity: ComplementarityMetric,
 *   projectFit: ProjectFitMetric,
 *   conflictRisk: ConflictRiskMetric,
 *   balance: BalanceMetric
 * }} [metrics] - Detailed metrics
 * @property {Recommendation[]} [recommendations] - Recommendations
 * @property {string} [message] - Message when not available
 */

/**
 * @typedef {Object} RoleDiversityMetric
 * @property {number} score
 * @property {number} uniqueRoles
 * @property {number} totalRoles
 * @property {Object.<string, number>} distribution
 * @property {RoleAssignment[]} assignments
 */

/**
 * @typedef {Object} RoleAssignment
 * @property {string} role
 * @property {string} roleName
 * @property {number} fit
 */

/**
 * @typedef {Object} ComplementarityMetric
 * @property {number} score
 * @property {'excellent'|'good'|'fair'|'poor'} level
 * @property {string} message
 */

/**
 * @typedef {Object} ProjectFitMetric
 * @property {number} score
 * @property {'excellent'|'good'|'fair'|'poor'} level
 * @property {string} projectType
 * @property {string} message
 */

/**
 * @typedef {Object} ConflictRiskMetric
 * @property {number} score
 * @property {'low'|'medium'|'high'|'critical'} level
 * @property {number} risksDetected
 * @property {ConflictRisk[]} risks
 * @property {string} message
 */

/**
 * @typedef {Object} ConflictRisk
 * @property {string} type
 * @property {'low'|'medium'|'high'} severity
 * @property {string} description
 * @property {string} recommendation
 * @property {string} [trait]
 */

/**
 * @typedef {Object} BalanceMetric
 * @property {number} score
 * @property {'excellent'|'good'|'fair'|'poor'} level
 * @property {Object.<string, TraitBalance>} traitBalance
 * @property {string} message
 */

/**
 * @typedef {Object} TraitBalance
 * @property {number} average
 * @property {number} variance
 * @property {number} avgScore
 * @property {number} varianceScore
 * @property {number} overallScore
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} category
 * @property {'info'|'low'|'medium'|'high'} priority
 * @property {string} title
 * @property {string} description
 * @property {string[]} actions
 */

/**
 * @typedef {Object} OptimizationInfo
 * @property {number} candidatesWithProfiles
 * @property {number} candidatesWithoutProfiles
 * @property {number} totalCandidates
 * @property {string} profileCoverage
 */

/**
 * @typedef {Object} SynergyValidation
 * @property {string} userId
 * @property {boolean} recommended
 * @property {number|null} synergyImpact
 * @property {string} message
 */

/**
 * @typedef {Object} DetailedSynergyAnalysis
 * @property {boolean} available
 * @property {number} overallScore
 * @property {{
 *   summary: { score: number, level: string, text: string },
 *   strengths: Strength[],
 *   concerns: Concern[],
 *   recommendations: Recommendation[]
 * }} [explanation]
 */

/**
 * @typedef {Object} Strength
 * @property {string} area
 * @property {number} score
 * @property {string} description
 */

/**
 * @typedef {Object} Concern
 * @property {string} area
 * @property {number} [score]
 * @property {'low'|'medium'|'high'} severity
 * @property {string} description
 */

/**
 * @typedef {Object} HiringRecommendations
 * @property {boolean} available
 * @property {number} [currentTeamSize]
 * @property {string} [projectType]
 * @property {{
 *   idealProfiles: IdealProfile[],
 *   avoidProfiles: AvoidProfile[],
 *   reasoning: string[]
 * }} [recommendations]
 * @property {string} [message]
 */

/**
 * @typedef {Object} IdealProfile
 * @property {string} [role]
 * @property {string} [name]
 * @property {string} [description]
 * @property {Object.<string, Object>} [desiredTraits]
 * @property {string} [trait]
 * @property {string} [recommendation]
 * @property {string} [reason]
 * @property {'low'|'medium'|'high'} priority
 */

/**
 * @typedef {Object} AvoidProfile
 * @property {string} trait
 * @property {string} recommendation
 * @property {string} reason
 * @property {'low'|'medium'|'high'} priority
 */

export {};

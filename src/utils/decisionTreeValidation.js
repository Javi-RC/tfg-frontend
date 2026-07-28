/**
 * Expert Rules Configuration Validation
 * Validates the 29 expert rules risk thresholds
 */
import i18n from '../i18n';

/**
 * Threshold definitions with min/max ranges and defaults
 */
export const THRESHOLD_DEFINITIONS = {
  // Skill Gap Thresholds (5)
  skillGapCritical: { min: 0.0, max: 1.0, default: 0.5, type: 'number' },
  skillGapMajor: { min: 0.0, max: 1.0, default: 0.7, type: 'number' },
  minTechnologiesThreshold: { min: 1, max: 20, default: 3, type: 'integer' },
  maxJuniorRatio: { min: 0.0, max: 1.0, default: 0.6, type: 'number' },
  minProficiencyThreshold: { min: 1.0, max: 5.0, default: 2.0, type: 'number' },

  // Communication Thresholds (2)
  minTimeOverlapHours: { min: 0, max: 8, default: 2, type: 'number' },
  normalOverlapHours: { min: 2, max: 8, default: 6, type: 'number' },

  // Team Overload Thresholds (4)
  overloadCritical: { min: 40, max: 100, default: 60, type: 'integer' },
  overloadHigh: { min: 40, max: 100, default: 50, type: 'integer' },
  overloadAverageHours: { min: 30, max: 100, default: 45, type: 'integer' },
  maxConcurrentProjectsThreshold: { min: 1, max: 10, default: 2, type: 'integer' },

  // Scope Creep Thresholds (3)
  minDescriptionLength: { min: 100, max: 5000, default: 500, type: 'integer' },
  minKeyRoles: { min: 1, max: 20, default: 3, type: 'integer' },
  clientTimeOverlapHours: { min: 0, max: 8, default: 4, type: 'number' },

  // Dependency Thresholds (3)
  minCriticalDependencies: { min: 1, max: 20, default: 3, type: 'integer' },
  minInvolvedTeams: { min: 1, max: 10, default: 2, type: 'integer' },
  timelineBufferPercentage: { min: 0, max: 100, default: 30, type: 'integer' },

  // Knowledge Management Thresholds (2)
  maxTeamSizeForKM: { min: 2, max: 50, default: 5, type: 'integer' },
  kmRiskScoreHigh: { min: 1, max: 20, default: 6, type: 'integer' },

  // Process Maturity Thresholds (2)
  maturityScoreLow: { min: 0, max: 10, default: 1.5, type: 'number' },
  maturityScoreMedium: { min: 0, max: 10, default: 2.5, type: 'number' },

  // Cultural/Timezone Thresholds (3)
  highCulturalDiversityThreshold: { min: 1, max: 20, default: 3, type: 'integer' },
  minTimezonesForRisk: { min: 1, max: 20, default: 3, type: 'integer' },
  minTimeOverlapHoursThreshold: { min: 0, max: 12, default: 3, type: 'number' },
};

/**
 * Personality threshold definitions
 */
const PERSONALITY_THRESHOLD_DEFINITIONS = {
  agreeablenessLow: { min: 1.0, max: 5.0, default: 2.5, type: 'number' },
  agreeablenessVarianceHigh: { min: 0, max: 5.0, default: 1.5, type: 'number' },
  neuroticismHigh: { min: 1.0, max: 5.0, default: 3.5, type: 'number' },
};



/**
 * Get default configuration
 * @returns {Object} - Default configuration with all 29 thresholds
 */
export const getDefaultConfig = () => {
  const riskThresholds = {};
  for (const [key, def] of Object.entries(THRESHOLD_DEFINITIONS)) {
    riskThresholds[key] = def.default;
  }

  const personalityRiskThresholds = {};
  for (const [key, def] of Object.entries(PERSONALITY_THRESHOLD_DEFINITIONS)) {
    personalityRiskThresholds[key] = def.default;
  }

  return { riskThresholds, personalityRiskThresholds };
};

/**
 * Preset configurations
 */
const PRESETS = {
  strict: {
    name: i18n.t('riskPrediction.decisionTree.presets.strict.name'),
    description: i18n.t('riskPrediction.decisionTree.presets.strict.description'),
    riskThresholds: {
      skillGapCritical: 0.7,
      skillGapMajor: 0.85,
      minTechnologiesThreshold: 2,
      maxJuniorRatio: 0.3,
      minProficiencyThreshold: 3.0,
      minTimeOverlapHours: 1,
      normalOverlapHours: 4,
      overloadCritical: 55,
      overloadHigh: 45,
      overloadAverageHours: 40,
      maxConcurrentProjectsThreshold: 1,
      minDescriptionLength: 800,
      minKeyRoles: 5,
      clientTimeOverlapHours: 6,
      minCriticalDependencies: 2,
      minInvolvedTeams: 2,
      timelineBufferPercentage: 50,
      maxTeamSizeForKM: 4,
      kmRiskScoreHigh: 5,
      maturityScoreLow: 2.0,
      maturityScoreMedium: 3.0,
      highCulturalDiversityThreshold: 2,
      minTimezonesForRisk: 2,
      minTimeOverlapHoursThreshold: 4,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 3.0,
      agreeablenessVarianceHigh: 1.0,
      neuroticismHigh: 3.0,
    },
  },
  lenient: {
    name: i18n.t('riskPrediction.decisionTree.presets.lenient.name'),
    description: i18n.t('riskPrediction.decisionTree.presets.lenient.description'),
    riskThresholds: {
      skillGapCritical: 0.3,
      skillGapMajor: 0.5,
      minTechnologiesThreshold: 5,
      maxJuniorRatio: 0.9,
      minProficiencyThreshold: 1.5,
      minTimeOverlapHours: 4,
      normalOverlapHours: 8,
      overloadCritical: 70,
      overloadHigh: 60,
      overloadAverageHours: 55,
      maxConcurrentProjectsThreshold: 3,
      minDescriptionLength: 200,
      minKeyRoles: 1,
      clientTimeOverlapHours: 2,
      minCriticalDependencies: 5,
      minInvolvedTeams: 4,
      timelineBufferPercentage: 20,
      maxTeamSizeForKM: 8,
      kmRiskScoreHigh: 8,
      maturityScoreLow: 0.5,
      maturityScoreMedium: 1.5,
      highCulturalDiversityThreshold: 5,
      minTimezonesForRisk: 5,
      minTimeOverlapHoursThreshold: 1,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 2.0,
      agreeablenessVarianceHigh: 2.0,
      neuroticismHigh: 4.0,
    },
  },
  globalTeam: {
    name: i18n.t('riskPrediction.decisionTree.presets.globalTeam.name'),
    description: i18n.t('riskPrediction.decisionTree.presets.globalTeam.description'),
    riskThresholds: {
      skillGapCritical: 0.5,
      skillGapMajor: 0.7,
      minTechnologiesThreshold: 3,
      maxJuniorRatio: 0.5,
      minProficiencyThreshold: 2.5,
      minTimeOverlapHours: 0,
      normalOverlapHours: 3,
      overloadCritical: 60,
      overloadHigh: 50,
      overloadAverageHours: 45,
      maxConcurrentProjectsThreshold: 2,
      minDescriptionLength: 600,
      minKeyRoles: 4,
      clientTimeOverlapHours: 2,
      minCriticalDependencies: 3,
      minInvolvedTeams: 2,
      timelineBufferPercentage: 40,
      maxTeamSizeForKM: 5,
      kmRiskScoreHigh: 6,
      maturityScoreLow: 1.5,
      maturityScoreMedium: 2.5,
      highCulturalDiversityThreshold: 3,
      minTimezonesForRisk: 3,
      minTimeOverlapHoursThreshold: 2,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 2.5,
      agreeablenessVarianceHigh: 1.5,
      neuroticismHigh: 3.5,
    },
  },
};

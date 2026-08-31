/**
 * Expert Rules Configuration
 * Thresholds are configurable per-organization from backend.
 */

const THRESHOLD_DEFINITIONS = {
  skillGapCritical: { min: 0.0, max: 1.0, type: 'number' },
  skillGapMajor: { min: 0.0, max: 1.0, type: 'number' },
  minTechnologiesThreshold: { min: 1, max: 20, type: 'integer' },
  maxJuniorRatio: { min: 0.0, max: 1.0, type: 'number' },
  minProficiencyThreshold: { min: 1.0, max: 5.0, type: 'number' },
  minTimeOverlapHours: { min: 0, max: 8, type: 'number' },
  normalOverlapHours: { min: 2, max: 8, type: 'number' },
  overloadCritical: { min: 40, max: 100, type: 'integer' },
  overloadHigh: { min: 40, max: 100, type: 'integer' },
  overloadAverageHours: { min: 30, max: 100, type: 'integer' },
  maxConcurrentProjectsThreshold: { min: 1, max: 10, type: 'integer' },
  minDescriptionLength: { min: 100, max: 5000, type: 'integer' },
  minKeyRoles: { min: 1, max: 20, type: 'integer' },
  clientTimeOverlapHours: { min: 0, max: 8, type: 'number' },
  minCriticalDependencies: { min: 1, max: 20, type: 'integer' },
  minInvolvedTeams: { min: 1, max: 10, type: 'integer' },
  timelineBufferPercentage: { min: 0, max: 100, type: 'integer' },
  maxTeamSizeForKM: { min: 2, max: 50, type: 'integer' },
  kmRiskScoreHigh: { min: 1, max: 20, type: 'integer' },
  maturityScoreLow: { min: 0, max: 10, type: 'number' },
  maturityScoreMedium: { min: 0, max: 10, type: 'number' },
  highCulturalDiversityThreshold: { min: 1, max: 20, type: 'integer' },
  minTimezonesForRisk: { min: 1, max: 20, type: 'integer' },
  minTimeOverlapHoursThreshold: { min: 0, max: 12, type: 'number' },
};

const PERSONALITY_THRESHOLD_DEFINITIONS = {
  agreeablenessLow: { min: 1.0, max: 5.0, type: 'number' },
  agreeablenessVarianceHigh: { min: 0, max: 5.0, type: 'number' },
  neuroticismHigh: { min: 1.0, max: 5.0, type: 'number' },
};

export { THRESHOLD_DEFINITIONS, PERSONALITY_THRESHOLD_DEFINITIONS };

/**
 * Build config object from remote server response, validated against definitions.
 * @param {Object} remoteConfig - { riskThresholds, personalityRiskThresholds } from backend
 * @returns {{ riskThresholds: Object, personalityRiskThresholds: Object }}
 */
export const getDefaultConfig = (remoteConfig) => {
  const riskThresholds = {};
  for (const [key, def] of Object.entries(THRESHOLD_DEFINITIONS)) {
    const val = remoteConfig?.riskThresholds?.[key];
    riskThresholds[key] = val !== undefined ? val : def.min;
  }

  const personalityRiskThresholds = {};
  for (const [key, def] of Object.entries(PERSONALITY_THRESHOLD_DEFINITIONS)) {
    const val = remoteConfig?.personalityRiskThresholds?.[key];
    personalityRiskThresholds[key] = val !== undefined ? val : def.min;
  }

  return { riskThresholds, personalityRiskThresholds };
};

const PRESETS = {
  strict: {
    nameKey: 'riskPrediction.decisionTree.presets.strict',
    riskThresholds: {
      skillGapCritical: 0.7, skillGapMajor: 0.85, minTechnologiesThreshold: 2,
      maxJuniorRatio: 0.3, minProficiencyThreshold: 3.0,
      minTimeOverlapHours: 1, normalOverlapHours: 4,
      overloadCritical: 55, overloadHigh: 45, overloadAverageHours: 40,
      maxConcurrentProjectsThreshold: 1,
      minDescriptionLength: 800, minKeyRoles: 5, clientTimeOverlapHours: 6,
      minCriticalDependencies: 2, minInvolvedTeams: 2, timelineBufferPercentage: 50,
      maxTeamSizeForKM: 4, kmRiskScoreHigh: 5,
      maturityScoreLow: 2.0, maturityScoreMedium: 3.0,
      highCulturalDiversityThreshold: 2, minTimezonesForRisk: 2, minTimeOverlapHoursThreshold: 4,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 3.0, agreeablenessVarianceHigh: 1.0, neuroticismHigh: 3.0,
    },
  },
  lenient: {
    nameKey: 'riskPrediction.decisionTree.presets.lenient',
    riskThresholds: {
      skillGapCritical: 0.3, skillGapMajor: 0.5, minTechnologiesThreshold: 5,
      maxJuniorRatio: 0.9, minProficiencyThreshold: 1.5,
      minTimeOverlapHours: 4, normalOverlapHours: 8,
      overloadCritical: 70, overloadHigh: 60, overloadAverageHours: 55,
      maxConcurrentProjectsThreshold: 3,
      minDescriptionLength: 200, minKeyRoles: 1, clientTimeOverlapHours: 2,
      minCriticalDependencies: 5, minInvolvedTeams: 4, timelineBufferPercentage: 20,
      maxTeamSizeForKM: 8, kmRiskScoreHigh: 8,
      maturityScoreLow: 0.5, maturityScoreMedium: 1.5,
      highCulturalDiversityThreshold: 5, minTimezonesForRisk: 5, minTimeOverlapHoursThreshold: 1,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 2.0, agreeablenessVarianceHigh: 2.0, neuroticismHigh: 4.0,
    },
  },
  globalTeam: {
    nameKey: 'riskPrediction.decisionTree.presets.globalTeam',
    riskThresholds: {
      skillGapCritical: 0.5, skillGapMajor: 0.7, minTechnologiesThreshold: 3,
      maxJuniorRatio: 0.5, minProficiencyThreshold: 2.5,
      minTimeOverlapHours: 0, normalOverlapHours: 3,
      overloadCritical: 60, overloadHigh: 50, overloadAverageHours: 45,
      maxConcurrentProjectsThreshold: 2,
      minDescriptionLength: 600, minKeyRoles: 4, clientTimeOverlapHours: 2,
      minCriticalDependencies: 3, minInvolvedTeams: 2, timelineBufferPercentage: 40,
      maxTeamSizeForKM: 5, kmRiskScoreHigh: 6,
      maturityScoreLow: 1.5, maturityScoreMedium: 2.5,
      highCulturalDiversityThreshold: 3, minTimezonesForRisk: 3, minTimeOverlapHoursThreshold: 2,
    },
    personalityRiskThresholds: {
      agreeablenessLow: 2.5, agreeablenessVarianceHigh: 1.5, neuroticismHigh: 3.5,
    },
  },
};

export { PRESETS };

export const getPreset = (name) => PRESETS[name] || null;

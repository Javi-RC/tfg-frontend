/**
 * CBR Configuration Defaults
 * Default values and validation for Case-Based Reasoning configuration
 */

/**
 * Default CBR dimension weights
 * These must sum to 1.0 (100%)
 */
export const DEFAULT_DIMENSION_WEIGHTS = {
  coordination: 0.2,
  technical: 0.25,
  team: 0.25,
  management: 0.15,
  organizational: 0.15,
};

/**
 * Default CBR parameters
 */
export const DEFAULT_CBR_CONFIG = {
  dimensionWeights: DEFAULT_DIMENSION_WEIGHTS,
  kSimilarCases: 5,
  minSimilarityThreshold: 0.3,
};

/**
 * CBR parameter ranges
 */
export const CBR_PARAMETER_RANGES = {
  kSimilarCases: { min: 1, max: 20, default: 5 },
  minSimilarityThreshold: { min: 0.0, max: 1.0, default: 0.3 },
  dimensionWeight: { min: 0.0, max: 1.0 },
};

/**
 * Get default CBR configuration
 * @returns {Object} Default CBR configuration
 */
export const getDefaultCBRConfig = () => {
  return {
    dimensionWeights: { ...DEFAULT_DIMENSION_WEIGHTS },
    kSimilarCases: DEFAULT_CBR_CONFIG.kSimilarCases,
    minSimilarityThreshold: DEFAULT_CBR_CONFIG.minSimilarityThreshold,
  };
};



/**
 * Normalize CBR config with defaults for missing values
 * @param {Object} config - Partial CBR configuration
 * @returns {Object} Complete CBR configuration with defaults
 */
export const normalizeCBRConfig = (config = {}) => {
  const defaults = getDefaultCBRConfig();

  return {
    dimensionWeights: {
      ...defaults.dimensionWeights,
      ...(config.dimensionWeights || {}),
    },
    kSimilarCases: config.kSimilarCases ?? defaults.kSimilarCases,
    minSimilarityThreshold: config.minSimilarityThreshold ?? defaults.minSimilarityThreshold,
  };
};

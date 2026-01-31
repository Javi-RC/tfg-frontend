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
  organizational: 0.15
};

/**
 * Default CBR parameters
 */
export const DEFAULT_CBR_CONFIG = {
  dimensionWeights: DEFAULT_DIMENSION_WEIGHTS,
  kSimilarCases: 5,
  minSimilarityThreshold: 0.3
};

/**
 * CBR parameter ranges
 */
export const CBR_PARAMETER_RANGES = {
  kSimilarCases: { min: 1, max: 20, default: 5 },
  minSimilarityThreshold: { min: 0.0, max: 1.0, default: 0.3 },
  dimensionWeight: { min: 0.0, max: 1.0 }
};

/**
 * Get default CBR configuration
 * @returns {Object} Default CBR configuration
 */
export const getDefaultCBRConfig = () => {
  return {
    dimensionWeights: { ...DEFAULT_DIMENSION_WEIGHTS },
    kSimilarCases: DEFAULT_CBR_CONFIG.kSimilarCases,
    minSimilarityThreshold: DEFAULT_CBR_CONFIG.minSimilarityThreshold
  };
};

/**
 * Validate CBR configuration
 * @param {Object} config - CBR configuration to validate
 * @returns {Object} - { isValid: boolean, errors: {} }
 */
export const validateCBRConfig = (config) => {
  const errors = {};

  // Validate dimensionWeights
  if (config.dimensionWeights) {
    const weights = config.dimensionWeights;
    const total = Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    if (Math.abs(total - 1.0) > 0.001) {
      errors.dimensionWeights = 'Dimension weights must sum to 100%';
    }

    // Validate individual weights
    for (const [key, value] of Object.entries(weights)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 1) {
        errors[key] = `${key} must be between 0 and 1`;
      }
    }
  }

  // Validate kSimilarCases
  if (config.kSimilarCases !== undefined) {
    const k = parseInt(config.kSimilarCases);
    const range = CBR_PARAMETER_RANGES.kSimilarCases;
    if (isNaN(k) || k < range.min || k > range.max) {
      errors.kSimilarCases = `k must be between ${range.min} and ${range.max}`;
    }
  }

  // Validate minSimilarityThreshold
  if (config.minSimilarityThreshold !== undefined) {
    const threshold = parseFloat(config.minSimilarityThreshold);
    const range = CBR_PARAMETER_RANGES.minSimilarityThreshold;
    if (isNaN(threshold) || threshold < range.min || threshold > range.max) {
      errors.minSimilarityThreshold = `Threshold must be between ${range.min} and ${range.max}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
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
      ...(config.dimensionWeights || {})
    },
    kSimilarCases: config.kSimilarCases ?? defaults.kSimilarCases,
    minSimilarityThreshold: config.minSimilarityThreshold ?? defaults.minSimilarityThreshold
  };
};

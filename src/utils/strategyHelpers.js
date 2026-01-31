/**
 * Strategy Helpers
 * Utilities for handling risk prediction strategies and system phases
 */

/**
 * Get human-readable label for a strategy
 * @param {string} strategy - Strategy code (dt_only, dt_priority, cbr_priority, cbr_only)
 * @param {string} lang - Language code ('es' or 'en')
 * @returns {string} - Human-readable strategy label
 */
export const getStrategyLabel = (strategy, lang = 'es') => {
  const labels = {
    es: {
      dt_only: 'Solo Reglas Expertas',
      dt_priority: 'Reglas Expertas + CBR (Reglas prioritarias)',
      cbr_priority: 'CBR + Reglas Expertas (CBR prioritario)',
      cbr_only: 'Solo Experiencia Histórica'
    },
    en: {
      dt_only: 'Expert Rules Only',
      dt_priority: 'Expert Rules + CBR (Rules priority)',
      cbr_priority: 'CBR + Expert Rules (CBR priority)',
      cbr_only: 'Historical Experience Only'
    }
  };
  return labels[lang]?.[strategy] || strategy;
};

/**
 * Get detailed description for a strategy
 * @param {string} strategy - Strategy code
 * @param {string} lang - Language code
 * @returns {string} - Detailed strategy description
 */
export const getStrategyDescription = (strategy, lang = 'es') => {
  const descriptions = {
    es: {
      dt_only: 'Sistema en fase inicial. Predicción basada en reglas expertas.',
      dt_priority: 'Combinando reglas con experiencia, priorizando reglas expertas cuando hay duplicados.',
      cbr_priority: 'Priorizando experiencia histórica, complementando con reglas expertas.',
      cbr_only: 'Sistema maduro basado completamente en experiencia.'
    },
    en: {
      dt_only: 'Initial phase system. Prediction based on expert rules.',
      dt_priority: 'Combining rules with experience, prioritizing expert rules when duplicates exist.',
      cbr_priority: 'Prioritizing historical experience, complementing with expert rules.',
      cbr_only: 'Mature system based entirely on experience.'
    }
  };
  return descriptions[lang]?.[strategy] || '';
};

/**
 * Get phase configuration
 * @param {number} phase - Phase number (1-4)
 * @param {string} lang - Language code
 * @returns {Object} - Phase configuration
 */
export const getPhaseConfig = (phase, lang = 'es') => {
  const phases = {
    1: {
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      label: lang === 'es' ? 'Inicial' : 'Initial',
      range: '0-9 casos',
      rangeEn: '0-9 cases'
    },
    2: {
      color: '#06B6D4',
      bgColor: '#CFFAFE',
      label: lang === 'es' ? 'Aprendizaje' : 'Learning',
      range: '10-19 casos',
      rangeEn: '10-19 cases'
    },
    3: {
      color: '#10B981',
      bgColor: '#D1FAE5',
      label: lang === 'es' ? 'Maduro' : 'Mature',
      range: '20-39 casos',
      rangeEn: '20-39 cases'
    },
    4: {
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      label: lang === 'es' ? 'Experto' : 'Expert',
      range: '40+ casos',
      rangeEn: '40+ cases'
    }
  };
  return phases[phase] || phases[1];
};

/**
 * Get next phase threshold
 * @param {number} caseBaseSize - Current case base size
 * @returns {Object} - Next threshold info
 */
export const getNextThreshold = (caseBaseSize) => {
  const thresholds = [
    { phase: 1, threshold: 10, label: 'Aprendizaje', labelEn: 'Learning' },
    { phase: 2, threshold: 20, label: 'Maduro', labelEn: 'Mature' },
    { phase: 3, threshold: 40, label: 'Experto', labelEn: 'Expert' }
  ];

  for (const t of thresholds) {
    if (caseBaseSize < t.threshold) {
      return {
        remaining: t.threshold - caseBaseSize,
        nextPhase: t.phase + 1,
        nextLabel: t.label,
        nextLabelEn: t.labelEn,
        threshold: t.threshold
      };
    }
  }

  return null; // Already at max phase
};

/**
 * Check if strategy uses Expert Rules
 * @param {string} strategy
 * @returns {boolean}
 */
export const usesDT = (strategy) => {
  return strategy === 'dt_only' || strategy === 'dt_priority' || strategy === 'cbr_priority';
};

/**
 * Check if strategy uses CBR
 * @param {string} strategy
 * @returns {boolean}
 */
export const usesCBR = (strategy) => {
  return strategy === 'cbr_only' || strategy === 'dt_priority' || strategy === 'cbr_priority';
};

/**
 * Get strategy color
 * @param {string} strategy
 * @returns {string}
 */
export const getStrategyColor = (strategy) => {
  const colors = {
    dt_only: '#667EEA',
    dt_priority: '#06B6D4',
    cbr_priority: '#10B981',
    cbr_only: '#8B5CF6'
  };
  return colors[strategy] || '#6B7280';
};

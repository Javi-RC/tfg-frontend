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
      cbr_only: 'Solo Experiencia Histórica',
    },
    en: {
      dt_only: 'Expert Rules Only',
      dt_priority: 'Expert Rules + CBR (Rules priority)',
      cbr_priority: 'CBR + Expert Rules (CBR priority)',
      cbr_only: 'Historical Experience Only',
    },
  };
  return labels[lang]?.[strategy] || strategy;
};




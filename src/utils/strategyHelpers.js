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
      dt_only: 'Solo alertas del sistema',
      dt_priority: 'Alertas del sistema + Experiencia previa (Alertas prioritarias)',
      cbr_priority: 'Experiencia previa + Alertas del sistema (Experiencia prioritaria)',
      cbr_only: 'Solo experiencia previa',
    },
    en: {
      dt_only: 'System alerts only',
      dt_priority: 'System alerts + Past experience (Alerts priority)',
      cbr_priority: 'Past experience + System alerts (Experience priority)',
      cbr_only: 'Past experience only',
    },
  };
  return labels[lang]?.[strategy] || strategy;
};




/**
 * Risk Validation Utilities
 * Frontend validation helpers matching backend API specifications
 */

/**
 * Validate manual risk data before submission (CREATE/UPDATE during ACTIVE project)
 * 
 * REQUIRED fields:
 * - type: Risk type from catalog
 * - title: Risk title
 * - description: Risk description
 * 
 * OPTIONAL fields:
 * - severity: "low" | "medium" | "high" | "critical"
 * - rootCause: String
 * - recommendations: Array of strings
 * - indicators: Array of strings
 * 
 * @param {Object} riskData - Risk data to validate
 * @returns {Object|null} Errors object or null if valid
 */
export function validateManualRisk(riskData) {
  const errors = {};
  
  if (!riskData.type) {
    errors.type = 'El tipo de riesgo es obligatorio';
  }
  
  if (!riskData.title || !riskData.title.trim()) {
    errors.title = 'El título es obligatorio';
  }
  
  if (!riskData.description || !riskData.description.trim()) {
    errors.description = 'La descripción es obligatoria';
  }
  
  if (riskData.severity && !['low', 'medium', 'high', 'critical'].includes(riskData.severity)) {
    errors.severity = 'Severidad inválida (debe ser: low, medium, high, critical)';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate occurrence data before marking risk as occurred (RETROSPECTIVE phase)
 * 
 * REQUIRED field:
 * - occurred: true (for this validation to apply)
 * 
 * OPTIONAL fields:
 * - detectedAt: ISO date string (cannot be future)
 * - actualSeverity: "low" | "medium" | "high" | "critical"
 * - scheduleDelayDays: Number >= 0
 * - rootCause: String
 * - mitigatedAt: ISO date string (must be >= detectedAt)
 * 
 * @param {Object} occurrenceData - Occurrence data to validate
 * @returns {Object|null} Errors object or null if valid
 */
export function validateOccurrence(occurrenceData) {
  const errors = {};
  
  if (occurrenceData.scheduleDelayDays !== undefined) {
    const delay = Number(occurrenceData.scheduleDelayDays);
    if (isNaN(delay) || delay < 0) {
      errors.scheduleDelayDays = 'Los días de retraso no pueden ser negativos';
    }
  }
  
  if (occurrenceData.detectedAt) {
    const detectedDate = new Date(occurrenceData.detectedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (detectedDate > today) {
      errors.detectedAt = 'La fecha de detección no puede ser futura';
    }
  }
  
  if (occurrenceData.mitigatedAt && occurrenceData.detectedAt) {
    const mitigatedDate = new Date(occurrenceData.mitigatedAt);
    const detectedDate = new Date(occurrenceData.detectedAt);
    
    if (mitigatedDate < detectedDate) {
      errors.mitigatedAt = 'La fecha de mitigación no puede ser anterior a la fecha de detección';
    }
  }
  
  if (occurrenceData.actualSeverity && !['low', 'medium', 'high', 'critical'].includes(occurrenceData.actualSeverity)) {
    errors.actualSeverity = 'Severidad real inválida (debe ser: low, medium, high, critical)';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate avoidance data before marking risk as avoided (RETROSPECTIVE phase)
 * 
 * REQUIRED field:
 * - occurred: false (for this validation to apply)
 * 
 * OPTIONAL field:
 * - avoidanceReason: String (recommended but not required by backend)
 * 
 * @param {Object} avoidanceData - Avoidance data to validate
 * @returns {Object|null} Errors object or null if valid
 */
export function validateAvoidance(avoidanceData) {
  // Backend doesn't require avoidanceReason, but we can warn if it's missing
  const warnings = {};
  
  if (!avoidanceData.avoidanceReason || !avoidanceData.avoidanceReason.trim()) {
    warnings.avoidanceReason = 'Se recomienda explicar por qué no ocurrió el riesgo';
  }
  
  // Return null since these are just warnings, not errors
  return null;
}

/**
 * Check if a risk has been evaluated in retrospective
 * @param {Object} risk - Risk object
 * @returns {boolean} True if risk has been evaluated
 */
export function isRiskEvaluated(risk) {
  return risk.occurred !== undefined && risk.occurred !== null;
}

/**
 * Get risk status label for UI display
 * @param {Object} risk - Risk object
 * @returns {string} Status label
 */
export function getRiskStatusLabel(risk) {
  if (!risk.status) return 'Unknown';
  
  const labels = {
    active: 'Activo',
    occurred: 'Ocurrió',
    avoided: 'Evitado',
    mitigated: 'Mitigado'
  };
  
  return labels[risk.status] || risk.status;
}

/**
 * Get risk source label for UI display
 * @param {Object} risk - Risk object
 * @returns {string} Source label
 */
export function getRiskSourceLabel(risk) {
  if (!risk.source) return 'Unknown';
  
  const labels = {
    prediction: 'Predicción',
    manual: 'Manual',
    dt: 'Árbol de Decisión',
    cbr: 'Razonamiento Basado en Casos'
  };
  
  return labels[risk.source] || risk.source;
}

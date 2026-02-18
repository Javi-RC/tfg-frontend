import { useState } from 'react';
import { predictProjectRisks } from '../api/projects';
import i18n from '../i18n';

/**
 * Custom hook for managing project risk predictions
 * Handles API calls and state management with flexible validation
 */
export function useRiskPrediction() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Calculate data completeness for better UX feedback
   * @param {Object} project - Project object
   * @returns {Object} Completeness info with percentage and suggestions
   */
  const checkProjectReadiness = (project) => {
    const suggestions = [];
    let completedFields = 0;
    const totalFields = 20; // Total de campos que mejoran la predicción

    // Basic required fields (always needed)
    if (!project.projectName) {
      suggestions.push(i18n.t('risks.suggestions.addProjectName'));
    } else {
      completedFields++;
    }

    if (!project.briefDescription) {
      suggestions.push(i18n.t('risks.suggestions.addDescription'));
    } else {
      completedFields++;
    }

    if (!project.estimatedStartDate) {
      suggestions.push(i18n.t('risks.suggestions.addStartDate'));
    } else {
      completedFields++;
    }

    if (!project.estimatedEndDate) {
      suggestions.push(i18n.t('risks.suggestions.addEndDate'));
    } else {
      completedFields++;
    }

    // Technical fields (improve prediction quality)
    if (project.mainTechnologies?.length) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.addTechnologies'));

    if (project.requiredExperienceLevel) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.defineExperience'));

    // Communication fields
    if (project.requiredLanguages?.length) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.addLanguages'));

    if (project.involvedCountries?.length) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.defineCountries'));

    // Work model fields
    if (project.workMode) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.configureWorkMode'));

    if (project.coreHours?.start && project.coreHours?.end) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.addCoreHours'));

    // Knowledge Management
    if (project.knowledgeManagementTools?.length) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.specifyKnowledgeTools'));

    if (project.documentationLevel) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.defineDocumentation'));

    // Organizational structure
    if (project.hasOrganizationalChart !== undefined) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.indicateOrgChart'));

    if (project.taskTrackingSystem) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.specifyTaskTracking'));

    // Roles and responsibilities
    if (project.rolesAndResponsibilities?.length) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.defineRoles'));

    // Compliance
    if (project.requiresRegulatoryCompliance !== undefined) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.indicateCompliance'));

    // Team size
    if (project.weeklyHoursPerMember) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.addWeeklyHours'));

    // Management
    if (project.managementMethod) completedFields++;
    else suggestions.push(i18n.t('risks.suggestions.defineManagement'));

    const completeness = (completedFields / totalFields) * 100;

    return {
      ready: project.projectName && project.briefDescription && project.estimatedStartDate && project.estimatedEndDate,
      completeness: Math.round(completeness),
      completedFields,
      totalFields,
      suggestions: suggestions.slice(0, 5), // Max 5 suggestions
      message: completeness < 30 
        ? i18n.t('risks.completeness.low')
        : completeness < 60
        ? i18n.t('risks.completeness.medium')
        : completeness < 90
        ? i18n.t('risks.completeness.high')
        : i18n.t('risks.completeness.excellent')
    };
  };

  /**
   * Execute risk prediction for a project
   * Always allows prediction with available data
   * @param {string} projectId - Project ID
   * @param {Object} project - Project object (for completeness info)
   * @returns {Promise<Object>} Prediction result
   */
  const predict = async (projectId, project) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Check basic requirements only
      if (!project.projectName || !project.briefDescription) {
        setError({
          type: 'validation',
          message: i18n.t('risks.errors.nameDescriptionRequired')
        });
        setLoading(false);
        return null;
      }

      // Call prediction API (backend handles partial data)
      const response = await predictProjectRisks(projectId);
      const data = response.data?.data || response.data;
      console.log('🔴 [RISK PREDICTION HOOK] Response from backend:', data);

      // Calculate readiness for completeness metadata
      const readiness = checkProjectReadiness(project);

      // Add completeness metadata to prediction
      const enrichedData = {
        ...data,
        dataCompleteness: readiness.completeness,
        completedFields: readiness.completedFields,
        totalFields: readiness.totalFields,
        suggestions: readiness.suggestions
      };

      setPrediction(enrichedData);
      setLoading(false);
      
      return { success: true, data: enrichedData };

    } catch (err) {
      const errorMessage = err.response?.data?.error || i18n.t('risks.errors.predictionFailed');
      setError({
        type: 'api',
        message: errorMessage
      });
      setLoading(false);
      
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Reset prediction state
   */
  const reset = () => {
    setPrediction(null);
    setError(null);
    setLoading(false);
  };

  /**
   * Get risk statistics from prediction
   * @param {Object} prediction - Prediction data
   * @returns {Object} Risk statistics
   */
  const getRiskStatistics = (prediction) => {
    if (!prediction?.risks) {
      return {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        avgConfidence: 0
      };
    }

    const { risks } = prediction;

    return {
      total: risks.length,
      high: risks.filter(r => r.severity === 'high').length,
      medium: risks.filter(r => r.severity.includes('medium')).length,
      low: risks.filter(r => r.severity === 'low').length,
      avgConfidence: risks.length > 0
        ? risks.reduce((sum, r) => sum + (r.confidence || 0), 0) / risks.length
        : 0
    };
  };

  return {
    loading,
    prediction,
    error,
    predict,
    reset,
    checkProjectReadiness,
    getRiskStatistics
  };
}

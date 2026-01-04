import { useState } from 'react';
import { predictProjectRisks } from '../api/projects';

/**
 * Custom hook for managing project risk predictions
 * Handles API calls and state management with flexible validation
 */
export default function useRiskPrediction() {
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
      suggestions.push('Add project name');
    } else {
      completedFields++;
    }

    if (!project.briefDescription) {
      suggestions.push('Add project description');
    } else {
      completedFields++;
    }

    if (!project.estimatedStartDate) {
      suggestions.push('Add start date');
    } else {
      completedFields++;
    }

    if (!project.estimatedEndDate) {
      suggestions.push('Add end date');
    } else {
      completedFields++;
    }

    // Technical fields (improve prediction quality)
    if (project.mainTechnologies?.length) completedFields++;
    else suggestions.push('💡 Add main technologies for better accuracy');

    if (project.requiredExperienceLevel) completedFields++;
    else suggestions.push('💡 Define required experience level');

    if (project.systemComplexity) completedFields++;
    else suggestions.push('💡 Specify system complexity');

    // Communication fields
    if (project.requiredLanguages?.length) completedFields++;
    else suggestions.push('💡 Add required languages');

    if (project.teamRegions?.length) completedFields++;
    else suggestions.push('💡 Define team regions');

    // Work model fields
    if (project.workModel?.type) completedFields++;
    else suggestions.push('💡 Configure work model (remote/hybrid/on-site)');

    if (project.hasTimezoneSchedulingPolicy !== undefined) completedFields++;
    else suggestions.push('💡 Add timezone scheduling policy');

    // Knowledge Management
    if (project.hasKnowledgeManagementTools !== undefined) completedFields++;
    else suggestions.push('💡 Specify knowledge management tools');

    if (project.documentationLevel) completedFields++;
    else suggestions.push('💡 Define documentation level');

    // Organizational structure
    if (project.hasOrganizationalChart !== undefined) completedFields++;
    else suggestions.push('💡 Indicate if organizational chart exists');

    if (project.hasTaskTrackingTool !== undefined) completedFields++;
    else suggestions.push('💡 Specify task tracking tool');

    // Roles and responsibilities
    if (project.rolesAndResponsibilities?.length) completedFields++;
    else suggestions.push('💡 Define roles and responsibilities');

    // Compliance
    if (project.requiresRegulatoryCompliance !== undefined) completedFields++;
    else suggestions.push('💡 Indicate regulatory compliance needs');

    // Team size
    if (project.weeklyHoursPerMember) completedFields++;
    else suggestions.push('💡 Add weekly hours per member');

    // Management
    if (project.managementMethod) completedFields++;
    else suggestions.push('Define management method');

    const completeness = (completedFields / totalFields) * 100;

    return {
      ready: project.projectName && project.briefDescription && project.estimatedStartDate && project.estimatedEndDate,
      completeness: Math.round(completeness),
      completedFields,
      totalFields,
      suggestions: suggestions.slice(0, 5), // Max 5 suggestions
      message: completeness < 30 
        ? 'Add more data for better risk predictions'
        : completeness < 60
        ? 'Good start! Add more details to improve accuracy'
        : completeness < 90
        ? 'Great! Just a few more fields for optimal predictions'
        : 'Excellent! All data available for high-confidence predictions'
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
          message: 'Project name and description are required'
        });
        setLoading(false);
        return null;
      }

      // Get completeness info for logging/monitoring
      const readiness = checkProjectReadiness(project);
      console.log('Risk prediction with', readiness.completeness + '% data completeness');

      // Call prediction API (backend handles partial data)
      const response = await predictProjectRisks(projectId);
      const data = response.data?.data || response.data;

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
      const errorMessage = err.response?.data?.error || 'Error predicting project risks';
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

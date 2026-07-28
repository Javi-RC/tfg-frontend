/**
 * Utility functions for extracting data from CBR cases
 * Handles the real backend structure with problem, solution, result, and similarityIndex
 */
import i18n from '../i18n';

/**
 * Extract project name from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {string} The project name
 */
export function extractProjectName(caseItem) {
  return (
    caseItem.projectName ||
    caseItem.problem?.projectName ||
    caseItem.problem?.name ||
    caseItem.problem?.title ||
    `Case ${caseItem.caseId || caseItem._id || i18n.t('common.unknown')}`
  );
}

/**
 * Extract similarity score from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {number} Similarity score between 0 and 1
 */
export function extractSimilarity(caseItem) {
  return (
    caseItem.similarity || caseItem.similarityIndex?.overall || caseItem.similarityIndex?.total || 0
  );
}



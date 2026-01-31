/**
 * Utility functions for extracting data from CBR cases
 * Handles the real backend structure with problem, solution, result, and similarityIndex
 */

/**
 * Extract project name from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {string} The project name
 */
export function extractProjectName(caseItem) {
  return caseItem.projectName || 
         caseItem.problem?.projectName || 
         caseItem.problem?.name || 
         caseItem.problem?.title ||
         `Case ${caseItem.caseId || caseItem._id || 'Unknown'}`;
}

/**
 * Extract project description from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {string|null} The project description
 */
export function extractDescription(caseItem) {
  return caseItem.description || 
         caseItem.problem?.description || 
         caseItem.problem?.summary ||
         null;
}

/**
 * Extract similarity score from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {number} Similarity score between 0 and 1
 */
export function extractSimilarity(caseItem) {
  return caseItem.similarity || 
         caseItem.similarityIndex?.overall || 
         caseItem.similarityIndex?.total ||
         0;
}

/**
 * Extract similarity breakdown from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {Object|null} Similarity breakdown by categories
 */
export function extractSimilarityBreakdown(caseItem) {
  if (caseItem.similarityBreakdown) {
    return caseItem.similarityBreakdown;
  }
  
  if (caseItem.similarityIndex) {
    // Extract relevant similarity components from similarityIndex
    const breakdown = {};
    
    // Common similarity index fields
    if (caseItem.similarityIndex.coordination !== undefined) {
      breakdown.coordination = caseItem.similarityIndex.coordination;
    }
    if (caseItem.similarityIndex.technical !== undefined) {
      breakdown.technical = caseItem.similarityIndex.technical;
    }
    if (caseItem.similarityIndex.team !== undefined) {
      breakdown.team = caseItem.similarityIndex.team;
    }
    if (caseItem.similarityIndex.management !== undefined) {
      breakdown.management = caseItem.similarityIndex.management;
    }
    if (caseItem.similarityIndex.organizational !== undefined) {
      breakdown.organizational = caseItem.similarityIndex.organizational;
    }
    
    // Alternative field names
    if (caseItem.similarityIndex.teamComposition !== undefined) {
      breakdown.team = caseItem.similarityIndex.teamComposition;
    }
    if (caseItem.similarityIndex.scope !== undefined) {
      breakdown.scope = caseItem.similarityIndex.scope;
    }
    if (caseItem.similarityIndex.technology !== undefined) {
      breakdown.technical = caseItem.similarityIndex.technology;
    }
    if (caseItem.similarityIndex.duration !== undefined) {
      breakdown.duration = caseItem.similarityIndex.duration;
    }
    
    return Object.keys(breakdown).length > 0 ? breakdown : null;
  }
  
  return null;
}

/**
 * Extract outcome/result information from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {Object|null} Outcome information with completed, delayDays, budgetOverrun
 */
export function extractOutcome(caseItem) {
  // Check if outcome is directly provided
  if (caseItem.outcome) {
    return caseItem.outcome;
  }
  
  // Try to extract from result object
  if (caseItem.result) {
    const outcome = {};
    
    // Project completion status
    outcome.completed = caseItem.result.completed ?? 
                       caseItem.result.success ?? 
                       caseItem.result.status === 'completed' ??
                       true;
    
    // Schedule delay
    outcome.delayDays = caseItem.result.delayDays ?? 
                       caseItem.result.scheduleDelay ?? 
                       caseItem.result.delayInDays ??
                       0;
    
    // Budget overrun
    outcome.budgetOverrun = caseItem.result.budgetOverrun ?? 
                           caseItem.result.budgetOverrunPercent ?? 
                           caseItem.result.costOverrun ??
                           0;
    
    // Description
    outcome.description = caseItem.result.description ?? 
                         caseItem.result.summary ??
                         null;
    
    // Quality score
    if (caseItem.result.qualityScore !== undefined) {
      outcome.qualityScore = caseItem.result.qualityScore;
    }
    
    return outcome;
  }
  
  return null;
}

/**
 * Extract team information from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {Object|null} Team information
 */
export function extractTeamInfo(caseItem) {
  if (caseItem.problem?.team) {
    return caseItem.problem.team;
  }
  if (caseItem.problem?.teamSize !== undefined) {
    return {
      size: caseItem.problem.teamSize,
      composition: caseItem.problem.teamComposition
    };
  }
  return null;
}

/**
 * Extract project metadata from a CBR case
 * @param {Object} caseItem - The CBR case object
 * @returns {Object|null} Project metadata
 */
export function extractMetadata(caseItem) {
  return caseItem.metadata || caseItem.problem?.metadata || null;
}

/**
 * Format a CBR case for display
 * @param {Object} caseItem - The raw CBR case object
 * @returns {Object} Formatted case object with extracted fields
 */
export function formatCaseForDisplay(caseItem) {
  return {
    caseId: caseItem.caseId || caseItem._id,
    projectName: extractProjectName(caseItem),
    description: extractDescription(caseItem),
    similarity: extractSimilarity(caseItem),
    similarityBreakdown: extractSimilarityBreakdown(caseItem),
    outcome: extractOutcome(caseItem),
    teamInfo: extractTeamInfo(caseItem),
    metadata: extractMetadata(caseItem),
    source: caseItem.source,
    type: caseItem.type,
    createdAt: caseItem.createdAt,
    updatedAt: caseItem.updatedAt
  };
}

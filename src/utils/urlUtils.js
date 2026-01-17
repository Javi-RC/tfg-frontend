/**
 * URL Parameter Utilities
 * Handles extraction and manipulation of URL parameters
 */

/**
 * Extract error parameter from URL
 * @param {string} paramName - Name of the parameter
 * @returns {string|null} Decoded parameter value or null
 */
export function extractErrorFromURL(paramName = 'error') {
  try {
    const params = new URLSearchParams(window.location.search);
    const errorValue = params.get(paramName);
    
    // Check if error parameter exists first
    if (errorValue !== null) {
      // Return null for empty values
      if (errorValue === '') return null;
      
      try {
        return decodeURIComponent(errorValue);
      } catch {
        return errorValue;
      }
    }
    
    // Fall back to oauth_error if error parameter doesn't exist
    const oauthError = params.get('oauth_error');
    if (oauthError && oauthError !== '') {
      try {
        return decodeURIComponent(oauthError);
      } catch {
        return oauthError;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Remove parameters from URL
 * @param {Array<string>} paramNames - Array of parameter names to remove
 */
export function removeURLParameters(paramNames) {
  try {
    const url = new URL(window.location.href);
    
    paramNames.forEach(param => {
      url.searchParams.delete(param);
    });
    
    window.history.replaceState(null, '', url.toString());
  } catch {
    // Silent fallback
  }
}

/**
 * Get all URL parameters as object
 * @returns {Object} Object with all URL parameters
 */
export function getAllURLParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  } catch {
    return {};
  }
}

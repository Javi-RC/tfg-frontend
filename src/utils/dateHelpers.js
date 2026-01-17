/**
 * Date and Time Formatting Utilities
 */

/**
 * Format date to localized string
 * @param {string|Date} value - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or fallback
 */
export const formatDate = (value, options = {}) => {
  if (!value) return '—';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleDateString('en-US', options);
  } catch {
    return '—';
  }
};

/**
 * Format time to localized string
 * @param {string|Date} value - Time to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time or fallback
 */
export const formatTime = (value, options = {}) => {
  if (!value) return '—';
  
  try {
    // Handle HH:mm string format
    if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
      return value;
    }
    
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', ...options });
  } catch {
    return '—';
  }
};

/**
 * Format datetime to localized string with both date and time
 * @param {string|Date} value - Datetime to format
 * @returns {string} Formatted datetime or fallback
 */
export const formatDateTime = (value) => {
  if (!value) return '—';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
};

/**
 * Format date to ISO string for input fields
 * @param {string|Date} value - Date to format
 * @returns {string} ISO date string (YYYY-MM-DD) or empty
 */
export const formatDateForInput = (value) => {
  if (!value) return '';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Check if date is valid
 * @param {string|Date} value - Date to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (value) => {
  if (!value) return false;
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Calculate relative time (e.g., "2 hours ago")
 * @param {string|Date} value - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (value) => {
  if (!value) return '—';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
};

/**
 * String Manipulation and Formatting Utilities
 */

/**
 * Safely format text with fallback
 * @param {any} value - Value to format
 * @param {string} fallback - Fallback text (default: '—')
 * @returns {string} Formatted text or fallback
 */
export const formatText = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to Title Case
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix for truncated text (default: '...')
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Create URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Format boolean to Yes/No text
 * @param {any} value - Value to format
 * @returns {string} 'Yes', 'No', or '—'
 */
export const formatBoolean = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '—';
};

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials (default: 2)
 * @returns {string} Initials in uppercase
 */
export const getInitials = (name, maxInitials = 2) => {
  if (!name || typeof name !== 'string') return '?';
  
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, maxInitials)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
  
  return initials || '?';
};

/**
 * Convert camelCase or PascalCase to readable text
 * @param {string} str - String to convert
 * @returns {string} Human-readable text
 */
export const camelToReadable = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

/**
 * Pluralize word based on count
 * @param {number} count - Count to check
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Appropriate form
 */
export const pluralize = (count, singular, plural) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Remove extra whitespace and normalize line breaks
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export const cleanWhitespace = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

/**
 * Check if string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (str) => {
  return !str || (typeof str === 'string' && str.trim().length === 0);
};

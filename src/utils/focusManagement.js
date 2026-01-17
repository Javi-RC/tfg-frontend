/**
 * Focus Management Utilities
 * Helpers for managing keyboard focus in accessible components
 */

/**
 * Traps focus within a container (for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @returns {Function} Cleanup function to remove listeners
 */
export function trapFocus(container) {
  if (!container) return () => {};

  const getFocusableElements = () => {
    return Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled && el.offsetParent !== null);
  };

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab: moving backwards
      if (activeElement === firstElement || !container.contains(activeElement)) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: moving forwards
      if (activeElement === lastElement || !container.contains(activeElement)) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus first element
  const initialFocusable = getFocusableElements();
  initialFocusable[0]?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Stores and restores focus
 * @returns {Object} Object with save and restore methods
 */
export function createFocusManager() {
  let previousFocus = null;

  return {
    save: () => {
      previousFocus = document.activeElement;
    },
    restore: () => {
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }
  };
}

/**
 * Checks if element is keyboard focusable
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isFocusable(element) {
  if (!element) return false;
  
  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null && parseInt(tabindex) < 0) return false;

  if (element.disabled) return false;

  // Check if anchor has href attribute
  if (element.tagName === 'A') {
    return element.hasAttribute('href');
  }

  const focusableTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  return focusableTags.includes(element.tagName) || (tabindex !== null && tabindex !== '');
}

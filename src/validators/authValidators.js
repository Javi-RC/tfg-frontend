/**
 * Authentication Form Validators
 * Pure functions for validating authentication-related forms
 */
import i18n from '../i18n';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_USERNAME_LENGTH = 3;

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, error: i18n.t('validation.auth.emailRequired') };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: i18n.t('validation.auth.emailInvalid') };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: i18n.t('validation.auth.passwordRequired') };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: i18n.t('validation.auth.passwordMinLength', { min: MIN_PASSWORD_LENGTH }),
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a username
 * @param {string} username - Username to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateUsername(username) {
  if (!username || username.trim().length < MIN_USERNAME_LENGTH) {
    return {
      isValid: false,
      error: i18n.t('validation.auth.usernameMinLength', { min: MIN_USERNAME_LENGTH }),
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a user role
 * @param {string} role - Role to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateRole(role) {
  if (!role) {
    return { isValid: false, error: i18n.t('validation.auth.userTypeRequired') };
  }

  return { isValid: true, error: null };
}

/**
 * Validates login form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateLoginForm(formData) {
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  return { isValid: true, error: null };
}

/**
 * Password strength rules
 * @param {string} password - Password to check
 * @returns {Object} Object with boolean flags for each rule
 */
export function getPasswordStrengthRules(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

/**
 * Checks if password meets all strength requirements
 * @param {string} password - Password to check
 * @returns {boolean}
 */
export function isPasswordStrong(password) {
  const rules = getPasswordStrengthRules(password);
  return Object.values(rules).every(Boolean);
}

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { isValid: false, error: i18n.t('validation.auth.passwordsDoNotMatch') };
  }

  return { isValid: true, error: null };
}

/**
 * Validates registration form data for step 1
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateRegistrationStep1(formData) {
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    return usernameValidation;
  }

  const roleValidation = validateRole(formData.role);
  if (!roleValidation.isValid) {
    return roleValidation;
  }

  return { isValid: true, error: null };
}

/**
 * Validates registration form data for step 2
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateRegistrationStep2(formData) {
  if (!isPasswordStrong(formData.password)) {
    return { isValid: false, error: i18n.t('validation.auth.passwordRequirements') };
  }

  const confirmValidation = validatePasswordConfirmation(formData.password, formData.confirm);
  if (!confirmValidation.isValid) {
    return confirmValidation;
  }

  return { isValid: true, error: null };
}

/**
 * Validates registration form data for step 3
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateRegistrationStep3(formData) {
  return validateEmail(formData.email);
}

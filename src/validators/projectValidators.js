/**
 * Project Form Validators
 * Pure functions for validating project-related forms
 */
import i18n from '../i18n';

/**
 * Validates project name
 * @param {string} projectName - Project name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateProjectName(projectName) {
  if (!projectName || projectName.trim().length < 3) {
    return { isValid: false, error: i18n.t('validation.project.nameMinLength') };
  }
  
  if (projectName.length > 100) {
    return { isValid: false, error: i18n.t('validation.project.nameMaxLength') };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates project description
 * @param {string} description - Description to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateProjectDescription(description) {
  if (!description || description.trim().length < 10) {
    return { isValid: false, error: i18n.t('validation.project.descriptionMinLength') };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates team size
 * @param {number} teamSize - Team size to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateTeamSize(teamSize) {
  const size = Number(teamSize);
  
  if (teamSize === null || teamSize === undefined || teamSize === '' || isNaN(size)) {
    return { isValid: false, error: i18n.t('validation.project.teamSizeRequired') };
  }
  
  if (size < 1 || size > 100) {
    return { isValid: false, error: i18n.t('validation.project.teamSizeRange') };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate) {
    return { isValid: false, error: i18n.t('validation.project.startDateRequired') };
  }
  
  if (!endDate) {
    return { isValid: false, error: i18n.t('validation.project.endDateRequired') };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return { isValid: false, error: i18n.t('validation.project.endDateAfterStart') };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates organization selection
 * @param {string} organizationId - Organization ID
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateOrganization(organizationId) {
  if (!organizationId) {
    return { isValid: false, error: i18n.t('validation.project.selectOrganization') };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates Step 1: General Information
 * @param {Object} formData - Form data for step 1
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateStep1(formData) {
  const errors = {};
  
  const nameValidation = validateProjectName(formData.projectName);
  if (!nameValidation.isValid) {
    errors.projectName = nameValidation.error;
  }
  
  const descValidation = validateProjectDescription(formData.briefDescription);
  if (!descValidation.isValid) {
    errors.briefDescription = descValidation.error;
  }
  
  const dateValidation = validateDateRange(formData.estimatedStartDate, formData.estimatedEndDate);
  if (!dateValidation.isValid) {
    errors.dateRange = dateValidation.error;
  }
  
  const teamSizeValidation = validateTeamSize(formData.teamSize);
  if (!teamSizeValidation.isValid) {
    errors.teamSize = teamSizeValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 2: Collaboration Requirements
 * @param {Object} formData - Form data for step 2
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateStep2(formData) {
  const errors = {};
  
  if (!formData.requiresSynchronousCommunication) {
    errors.requiresSynchronousCommunication = i18n.t('validation.project.syncCommRequired');
  }
  
  if (!formData.realTimeCommunicationLevel) {
    errors.realTimeCommunicationLevel = i18n.t('validation.project.realTimeCommRequired');
  }
  
  if (formData.weeklyMeetingsCount === null || formData.weeklyMeetingsCount === undefined) {
    errors.weeklyMeetingsCount = i18n.t('validation.project.weeklyMeetingsRequired');
  }
  
  // Languages are optional, no validation needed
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Step 3: Technical Requirements
 * @param {Object} formData - Form data for step 3
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateStep3(formData) {
  const errors = {};
  
  if (!formData.mainTechnologies || formData.mainTechnologies.length === 0) {
    errors.mainTechnologies = i18n.t('validation.project.techRequired');
  }
  
  if (!formData.requiredExperienceLevel) {
    errors.requiredExperienceLevel = i18n.t('validation.project.experienceLevelRequired');
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates current step
 * @param {number} step - Current step number
 * @param {Object} formData - Form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateCurrentStep(step, formData) {
  switch (step) {
    case 1:
      return validateStep1(formData);
    case 2:
      return validateStep2(formData);
    case 3:
      return validateStep3(formData);
    default:
      return { isValid: true, errors: {} };
  }
}

/**
 * Checks if all required steps are valid
 * @param {Object} formData - Complete form data
 * @returns {boolean}
 */
export function isFormComplete(formData) {
  const step1Valid = validateStep1(formData).isValid;
  const step2Valid = validateStep2(formData).isValid;
  const step3Valid = validateStep3(formData).isValid;
  
  return step1Valid && step2Valid && step3Valid;
}

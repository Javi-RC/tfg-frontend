/**
 * CV Data Transformation Service
 * Handles normalization and validation of CV data
 */

/**
 * Normalize experience entry
 * @param {Object} experience - Raw experience data
 * @returns {Object} Normalized experience object
 */
export function normalizeExperience(experience) {
  return {
    company: experience.company || '',
    position: experience.position || '',
    startDate: experience.startDate || '',
    endDate: experience.endDate || '',
    description: experience.description || '',
    location: experience.location || ''
  };
}

/**
 * Normalize education entry
 * @param {Object} education - Raw education data
 * @returns {Object} Normalized education object
 */
export function normalizeEducation(education) {
  return {
    institution: education.institution || '',
    degree: education.degree || '',
    field: education.field || '',
    startDate: education.startDate || '',
    endDate: education.endDate || '',
    description: education.description || ''
  };
}

/**
 * Normalize skill entry
 * @param {Object|string} skill - Raw skill data
 * @returns {Object} Normalized skill object
 */
export function normalizeSkill(skill) {
  if (typeof skill === 'string') {
    return { name: skill, level: '' };
  }
  
  return {
    name: skill.name || '',
    level: skill.level || ''
  };
}

/**
 * Normalize language entry
 * @param {Object|string} language - Raw language data
 * @returns {Object} Normalized language object
 */
export function normalizeLanguage(language) {
  if (typeof language === 'string') {
    return { language, level: '' };
  }
  
  return {
    language: language.language || '',
    level: language.level || ''
  };
}

/**
 * Normalize CV data
 * @param {Object} cv - Raw CV data from API
 * @returns {Object} Normalized CV object
 */
export function normalizeCV(cv) {
  if (!cv) return null;
  
  return {
    ...cv,
    experience: (cv.experience || []).map(normalizeExperience),
    education: (cv.education || []).map(normalizeEducation),
    skills: {
      technical: (cv.skills?.technical || []).map(normalizeSkill),
      soft: (cv.skills?.soft || []).map(normalizeSkill)
    },
    languages: (cv.languages || []).map(normalizeLanguage),
    contact: cv.contact || {},
    projects: cv.projects || [],
    certifications: cv.certifications || []
  };
}

/**
 * Validate CV field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateCVField(fieldName, value) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validate experience entry
 * @param {Object} experience - Experience entry
 * @param {number} index - Index of entry
 * @returns {Array} Array of validation errors
 */
export function validateExperience(experience, index) {
  const errors = [];
  
  if (!experience.company || experience.company.trim() === '') {
    errors.push(`Experience ${index + 1}: Company is required`);
  }
  
  if (!experience.position || experience.position.trim() === '') {
    errors.push(`Experience ${index + 1}: Position is required`);
  }
  
  return errors;
}

/**
 * Validate education entry
 * @param {Object} education - Education entry
 * @param {number} index - Index of entry
 * @returns {Array} Array of validation errors
 */
export function validateEducation(education, index) {
  const errors = [];
  
  if (!education.institution || education.institution.trim() === '') {
    errors.push(`Education ${index + 1}: Institution is required`);
  }
  
  if (!education.degree || education.degree.trim() === '') {
    errors.push(`Education ${index + 1}: Degree is required`);
  }
  
  return errors;
}

/**
 * Validate skill entry
 * @param {Object} skill - Skill entry
 * @param {number} index - Index of entry
 * @returns {Array} Array of validation errors
 */
export function validateSkill(skill, index) {
  const errors = [];
  
  if (!skill.name || skill.name.trim() === '') {
    errors.push(`Skill ${index + 1}: Name is required`);
  }
  
  return errors;
}

/**
 * Validate language entry
 * @param {Object} language - Language entry
 * @param {number} index - Index of entry
 * @returns {Array} Array of validation errors
 */
export function validateLanguage(language, index) {
  const errors = [];
  
  const langObj = typeof language === 'string' 
    ? { language, level: '' } 
    : language;
  
  if (!langObj.language || langObj.language.trim() === '') {
    errors.push(`Language ${index + 1}: Language name is required`);
  }
  
  if (!langObj.level || langObj.level.trim() === '') {
    errors.push(`Language ${index + 1}: Level is required`);
  }
  
  return errors;
}

/**
 * Validate entire CV
 * @param {Object} cv - CV data to validate
 * @returns {Array} Array of all validation errors
 */
export function validateCV(cv) {
  const errors = [];
  
  // Validate experience
  if (cv.experience && cv.experience.length > 0) {
    cv.experience.forEach((exp, index) => {
      errors.push(...validateExperience(exp, index));
    });
  }
  
  // Validate education
  if (cv.education && cv.education.length > 0) {
    cv.education.forEach((edu, index) => {
      errors.push(...validateEducation(edu, index));
    });
  }
  
  // Validate skills
  if (cv.skills?.technical && cv.skills.technical.length > 0) {
    cv.skills.technical.forEach((skill, index) => {
      errors.push(...validateSkill(skill, index));
    });
  }
  
  // Validate languages
  if (cv.languages && cv.languages.length > 0) {
    cv.languages.forEach((lang, index) => {
      errors.push(...validateLanguage(lang, index));
    });
  }
  
  return errors;
}

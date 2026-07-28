/**
 * CV Data Transformation Service
 * Handles normalization and validation of CV data
 */


/**
 * Validate experience entry
 * @param {Object} experience - Experience entry
 * @param {number} index - Index of entry
 * @returns {Array} Array of validation errors
 */
function validateExperience(experience, index) {
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
function validateEducation(education, index) {
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
function validateSkill(skill, index) {
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
function validateLanguage(language, index) {
  const errors = [];

  const langObj = typeof language === 'string' ? { language, level: '' } : language;

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

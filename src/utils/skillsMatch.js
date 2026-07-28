/**
 * Skills matching helpers
 *
 * Purpose:
 * - Provide consistent skill matching behavior across list cards and detail panels.
 * - Prefer backend-provided matched/missing skills when present.
 * - Fallback to CV vs project technologies comparison when backend data is missing.
 */

/**
 * @typedef {Object} ResolvedSkillMatch
 * @property {string[]} matchedSkills
 * @property {string[]} missingSkills
 * @property {number} matchPercentage
 * @property {string[]} projectTechNames
 * @property {Array<{technology: string, proficiency: string, category: string}>} cvSkills
 * @property {boolean} hasNoRequirements
 * @property {boolean} hasComparisonData
 */

const normalizeProficiency = (value) => {
  const raw = (value || '').toString().trim().toLowerCase();
  if (!raw) return 'intermedio';

  // Spanish
  if (raw.includes('bás') || raw.includes('bas')) return 'basico';
  if (raw.includes('inter')) return 'intermedio';
  if (raw.includes('avan')) return 'avanzado';
  if (raw.includes('expert') || raw === 'exp') return 'experto';

  // English/common
  if (raw.includes('beginner') || raw.includes('junior')) return 'basico';
  if (raw.includes('intermediate') || raw.includes('mid')) return 'intermedio';
  if (raw.includes('advanced') || raw.includes('senior')) return 'avanzado';
  if (raw.includes('expert')) return 'experto';

  return raw;
};

/**
 * Normalize CV skills from different shapes into a common array.
 * @param {Object|null|undefined} cv
 * @returns {Array<{technology: string, proficiency: string, category: string}>}
 */
export function normalizeCvSkills(cv) {
  if (!cv) return [];

  // Format A: legacy array (e.g. [{ technology, proficiency, category }, ...])
  if (Array.isArray(cv.skills)) {
    return cv.skills.flatMap((skill) => {
      if (typeof skill === 'string') {
        return [{ technology: skill, proficiency: 'intermedio', category: 'general' }];
      }

      const technology = skill.technology || skill.name || '';
      const proficiencyRaw = skill.proficiency || skill.level || '';
      const proficiency = normalizeProficiency(proficiencyRaw);
      const category = skill.category || 'general';

      const item = { technology, proficiency, category };
      return item.technology ? [item] : [];
    });
  }

  // Format B: normalized CV service shape (e.g. { skills: { technical: [{name, level}], soft: [...] } })
  const technical = Array.isArray(cv.skills?.technical) ? cv.skills.technical : [];
  const soft = Array.isArray(cv.skills?.soft) ? cv.skills.soft : [];

  const normalizedTechnical = technical.flatMap((skill) => {
    const technology = typeof skill === 'string' ? skill : skill.name || '';
    const level = typeof skill === 'string' ? '' : skill.level || '';
    const item = { technology, proficiency: normalizeProficiency(level), category: 'technical' };
    return item.technology ? [item] : [];
  });

  const normalizedSoft = soft.flatMap((skill) => {
    const technology = typeof skill === 'string' ? skill : skill.name || '';
    const level = typeof skill === 'string' ? '' : skill.level || '';
    const item = { technology, proficiency: normalizeProficiency(level), category: 'soft' };
    return item.technology ? [item] : [];
  });

  return [...normalizedTechnical, ...normalizedSoft];
}



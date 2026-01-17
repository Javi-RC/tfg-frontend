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
    return cv.skills
      .map((skill) => {
        if (typeof skill === 'string') {
          return { technology: skill, proficiency: 'intermedio', category: 'general' };
        }

        const technology = skill.technology || skill.name || '';
        const proficiencyRaw = skill.proficiency || skill.level || '';
        const proficiency = normalizeProficiency(proficiencyRaw);
        const category = skill.category || 'general';

        return { technology, proficiency, category };
      })
      .filter((s) => s.technology);
  }

  // Format B: normalized CV service shape (e.g. { skills: { technical: [{name, level}], soft: [...] } })
  const technical = Array.isArray(cv.skills?.technical) ? cv.skills.technical : [];
  const soft = Array.isArray(cv.skills?.soft) ? cv.skills.soft : [];

  const normalizedTechnical = technical
    .map((skill) => {
      const technology = typeof skill === 'string' ? skill : (skill.name || '');
      const level = typeof skill === 'string' ? '' : (skill.level || '');
      return { technology, proficiency: normalizeProficiency(level), category: 'technical' }; 
    })
    .filter((s) => s.technology);

  const normalizedSoft = soft
    .map((skill) => {
      const technology = typeof skill === 'string' ? skill : (skill.name || '');
      const level = typeof skill === 'string' ? '' : (skill.level || '');
      return { technology, proficiency: normalizeProficiency(level), category: 'soft' };
    })
    .filter((s) => s.technology);

  return [...normalizedTechnical, ...normalizedSoft];
}

const normalizeSkillEntry = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (typeof value.skill === 'string') return value.skill.trim();
    if (typeof value.name === 'string') return value.name.trim();
    if (typeof value.technology === 'string') return value.technology.trim();
  }
  return '';
};

const normalizeTechName = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (typeof value.name === 'string') return value.name.trim();
    if (typeof value.skill === 'string') return value.skill.trim();
    if (typeof value.technology === 'string') return value.technology.trim();
  }
  return '';
};

/**
 * Resolve matched/missing skills and match percentage.
 * - Uses backend arrays if present
 * - Falls back to comparing project mainTechnologies with CV skills
 *
 * @param {Object} params
 * @param {Object|null|undefined} params.cv
 * @param {Object|null|undefined} params.project
 * @param {Array<string|Object>} [params.matchedSkills]
 * @param {Array<string|Object>} [params.missingSkills]
 * @param {number} [params.matchPercentage]
 * @returns {ResolvedSkillMatch}
 */
export function resolveSkillMatch({
  cv,
  project,
  matchedSkills = [],
  missingSkills = [],
  matchPercentage = 0,
}) {
  const cvSkills = normalizeCvSkills(cv);

  const projectTechnologies = Array.isArray(project?.mainTechnologies) ? project.mainTechnologies : [];
  const projectTechNames = projectTechnologies.map(normalizeTechName).filter(Boolean);

  const normalizedMatched = Array.isArray(matchedSkills)
    ? matchedSkills.map(normalizeSkillEntry).filter(Boolean)
    : [];

  const normalizedMissing = Array.isArray(missingSkills)
    ? missingSkills.map(normalizeSkillEntry).filter(Boolean)
    : [];

  const hasNoRequirements = projectTechNames.length === 0;

  const cvSkillSet = new Set(
    cvSkills
      .map((s) => (s.technology || '').toLowerCase())
      .filter(Boolean)
  );

  const shouldFallbackCompare =
    projectTechNames.length > 0 &&
    normalizedMatched.length === 0 &&
    normalizedMissing.length === 0 &&
    cvSkillSet.size > 0;

  const resolvedMatched = shouldFallbackCompare
    ? projectTechNames.filter((tech) => cvSkillSet.has(tech.toLowerCase()))
    : normalizedMatched;

  const resolvedMissing = shouldFallbackCompare
    ? projectTechNames.filter((tech) => !cvSkillSet.has(tech.toLowerCase()))
    : normalizedMissing;

  const hasComparisonData =
    projectTechNames.length > 0 && (resolvedMatched.length > 0 || resolvedMissing.length > 0);

  const resolvedMatchPercentage = (() => {
    const raw = Number(matchPercentage);
    if (Number.isFinite(raw) && raw > 0) return raw;
    const total = resolvedMatched.length + resolvedMissing.length;
    if (total === 0) return 0;
    return Math.round((resolvedMatched.length / total) * 100);
  })();

  return {
    matchedSkills: resolvedMatched,
    missingSkills: resolvedMissing,
    matchPercentage: resolvedMatchPercentage,
    projectTechNames,
    cvSkills,
    hasNoRequirements,
    hasComparisonData,
  };
}

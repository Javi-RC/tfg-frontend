import React from 'react';
import SkillMatchVisualization from './SkillMatchVisualization';
import SkillGapAnalysis from './SkillGapAnalysis';
import SkillRecommendations from './SkillRecommendations';

/**
 * SkillsMatchSection - Technical skills analysis
 *
 * Shows matched and missing skills using backend-provided data.
 * NO calculations - uses matchPercentage, matchedSkills, and missingSkills from backend.
 *
 * @param {Object} employee - Employee data with CV, matchedSkills, missingSkills, matchPercentage from backend
 * @param {Object} project - Project requirements (for reference only)
 */
export default function SkillsMatchSection({ employee, project }) {
  const effectiveMissingSkills = employee.missingSkills || [];

  return (
    <div style={styles.container}>
      <SkillMatchVisualization employee={employee} project={project} />

      <SkillGapAnalysis missingSkills={effectiveMissingSkills} />

      <SkillRecommendations employee={employee} />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
};

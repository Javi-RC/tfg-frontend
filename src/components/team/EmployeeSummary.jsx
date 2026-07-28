import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';

function getMatchColor(percentage) {
  if (percentage >= 80) return '#28a745';
  if (percentage >= 60) return '#ffc107';
  return '#dc3545';
}

export default function EmployeeSummary({
  showMatchScore,
  matchScorePercentage,
  skillsMatchPercentage,
  effectiveMatchedSkillsCount,
  effectiveMissingSkillsCount,
}) {
  const { t } = useTranslation();

  if (!showMatchScore) return null;

  return (
    <div style={styles.matchScore}>
      <div style={styles.scoreCircle}>
        <svg width="80" height="80" style={styles.scoreSvg}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="#e1e4e8" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={getMatchColor(matchScorePercentage)}
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - matchScorePercentage / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div style={styles.scoreText}>
          <span style={styles.scoreNumber}>{matchScorePercentage}%</span>
          <span style={styles.scoreLabel}>{t('team.employeeDetail.matchScore.label')}</span>
        </div>
      </div>
      <div style={styles.matchSummary}>
        <div style={styles.matchStat}>
          <Briefcase size={16} color="#0366d6" />
          <span>
            {t('team.employeeDetail.skillsScore.label')}: {skillsMatchPercentage}%
          </span>
        </div>
        <div style={styles.matchStat}>
          <CheckCircle size={16} color="#28a745" />
          <span>
            {t('team.employeeDetail.match.skillsMatched', {
              count: effectiveMatchedSkillsCount,
            })}
          </span>
        </div>
        {effectiveMissingSkillsCount > 0 && (
          <div style={styles.matchStat}>
            <AlertTriangle size={16} color="#ffc107" />
            <span>
              {t('team.employeeDetail.match.skillsMissing', {
                count: effectiveMissingSkillsCount,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  matchScore: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  scoreCircle: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  scoreSvg: {
    transform: 'rotate(-90deg)',
  },
  scoreText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  scoreLabel: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '-2px',
    whiteSpace: 'nowrap',
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  matchSummary: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  matchStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
};

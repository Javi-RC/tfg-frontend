import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Users } from 'lucide-react';

/**
 * TeamSynergyCard - displays the team synergy summary.
 * @param {Object} props
 * @param {import('../../types/personality.jsdoc').TeamSynergyMetrics|null|undefined} props.synergy
 * @param {boolean} [props.compact=false]
 */
export default function TeamSynergyCard({ synergy, compact = false }) {
  const { t } = useTranslation();
  if (!synergy || !synergy.available) {
    return (
      <div style={styles.naCard}>
        <div style={styles.naHeader}>
          <Info size={16} color="#57606a" />
          <div>
            <div style={styles.naTitle}>{t('team.synergy.notAvailableTitle')}</div>
            <div style={styles.naText}>
              {synergy?.message || t('team.synergy.notAvailableFallback')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = typeof synergy.overallScore === 'number' ? synergy.overallScore : 0;
  const coveragePercentage =
    typeof synergy.coveragePercentage === 'number' ? synergy.coveragePercentage : null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Users size={18} />
          <h3 style={styles.title}>{t('team.synergy.title')}</h3>
        </div>
        {synergy.projectProfile?.name && (
          <span style={styles.profileChip}>{synergy.projectProfile.name}</span>
        )}
      </div>

      <div style={{ ...styles.scoreRow, ...(compact ? styles.scoreRowCompact : {}) }}>
        <CircularProgress value={Math.round(overallScore)} size={compact ? 72 : 110} />
        <div>
          <div style={styles.scoreText}>{Math.round(overallScore)}/100</div>
          <div style={{ ...styles.levelText, ...getScoreColor(overallScore) }}>
            {t(getScoreLevelKey(overallScore))}
          </div>
        </div>
      </div>

      <div style={styles.metaGrid}>
        <div>
          <div style={styles.metaLabel}>{t('team.synergy.profileCoverage')}</div>
          <div style={styles.metaValue}>
            {coveragePercentage === null
              ? t('common.notAvailable')
              : `${Math.round(coveragePercentage)}%`}
          </div>
          {typeof synergy.profilesCovered === 'number' && typeof synergy.teamSize === 'number' && (
            <div style={styles.metaHint}>
              {t('team.synergy.membersCount', {
                covered: synergy.profilesCovered,
                total: synergy.teamSize,
              })}
            </div>
          )}
        </div>
        <div>
          <div style={styles.metaLabel}>{t('team.synergy.projectType')}</div>
          <div style={styles.metaValue}>
            {synergy.projectProfile?.name || synergy.projectType || t('team.synergy.standard')}
          </div>
        </div>
      </div>

      {!compact && synergy.metrics && (
        <div style={styles.metrics}>
          <MetricBar
            label={t('team.synergy.metrics.roleDiversity')}
            score={synergy.metrics.roleDiversity?.score ?? 0}
          />
          <MetricBar
            label={t('team.synergy.metrics.projectFit')}
            score={synergy.metrics.projectFit?.score ?? 0}
          />
          <MetricBar
            label={t('team.synergy.metrics.previousCollaborations')}
            score={synergy.metrics.previousCollaborations?.score ?? 0}
          />
        </div>
      )}

      {Array.isArray(synergy.recommendations) && synergy.recommendations.length > 0 && (
        <div style={styles.recs}>
          <div style={styles.recsTitle}>{t('team.synergy.topRecommendations')}</div>
          <ul style={styles.recsList}>
            {synergy.recommendations.slice(0, 3).map((rec) => (
              <li key={rec.title} style={styles.recsItem}>
                {rec.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const getScoreColor = (score) => {
  if (score >= 80) return { color: '#116329' };
  if (score >= 60) return { color: '#0550ae' };
  if (score >= 40) return { color: '#7d4e00' };
  return { color: '#82071e' };
};

const getScoreLevelKey = (score) => {
  if (score >= 80) return 'team.synergy.level.excellent';
  if (score >= 60) return 'team.synergy.level.good';
  if (score >= 40) return 'team.synergy.level.fair';
  return 'team.synergy.level.needsImprovement';
};

const getMetricColor = (s) => {
  if (s >= 80) return '#2da44e';
  if (s >= 60) return '#0969da';
  if (s >= 40) return '#d4a72c';
  return '#cf222e';
};

const MetricBar = ({ label, score, inverted = false }) => {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const effective = inverted ? 100 - normalized : normalized;

  return (
    <div style={styles.metricRow}>
      <div style={styles.metricTop}>
        <span style={styles.metricLabel}>{label}</span>
        <span style={styles.metricScore}>{Math.round(normalized)}</span>
      </div>
      <div style={styles.metricTrack}>
        <div
          style={{
            ...styles.metricFill,
            width: `${normalized}%`,
            backgroundColor: getMetricColor(effective),
          }}
        />
      </div>
    </div>
  );
};

const CircularProgress = ({ value, size = 110 }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - safeValue) / 100) * circumference;

  return (
    <svg width={size} height={size} style={styles.progressSvg}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#eaeef2"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#0969da"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em" style={styles.progressText}>
        {Math.round(safeValue)}
      </text>
    </svg>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  profileChip: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#5a32a3',
    backgroundColor: '#fbefff',
    border: '1px solid #e5d0ff',
    padding: '4px 10px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  scoreRowCompact: {
    marginBottom: '10px',
  },
  scoreText: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
  },
  levelText: {
    fontSize: '13px',
    fontWeight: 700,
    marginTop: '4px',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  metaLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  metaHint: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  metrics: {
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid #eaeef2',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  metricRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  metricTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  metricScore: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  metricTrack: {
    height: '8px',
    backgroundColor: '#eaeef2',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 200ms ease',
  },
  recs: {
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid #eaeef2',
  },
  recsTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    marginBottom: '6px',
  },
  recsList: {
    margin: 0,
    paddingLeft: '18px',
    color: 'var(--color-text-primary)',
  },
  recsItem: {
    fontSize: '12px',
    marginBottom: '4px',
  },
  progressSvg: {
    display: 'block',
  },
  progressText: {
    fontSize: '18px',
    fontWeight: 800,
    fill: '#24292f',
  },
  naCard: {
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid #d0d7de',
    borderRadius: '12px',
    padding: '14px',
  },
  naHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  naTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '2px',
  },
  naText: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
};

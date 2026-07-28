import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Handshake, Target, Frown, Sparkles, BarChart3, Lightbulb } from 'lucide-react';
import { FACTOR_CONFIG } from './factorConfig';

/**
 * Get interpretation based on score and factor
 */
const getInterpretation = (factor, score, t) => {
  const maxScore =
    factor === 'Openness' ? 50 : factor === 'Extraversion' || factor === 'Neuroticism' ? 40 : 45;
  const percentage = score / maxScore;

  const level = percentage < 0.4 ? 'low' : percentage > 0.65 ? 'high' : 'medium';
  return t(`bfi44.results.factors.${factor}.interpretation.${level}`);
};

/**
 * FactorCard Component
 * Displays a single personality factor with score and interpretation
 *
 * @param {string} factor - Factor name (e.g., "Extraversion")
 * @param {number} score - Factor score
 * @param {number} index - Animation delay index
 */
export default function FactorCard({ factor, score, index = 0 }) {
  const { t } = useTranslation();
  const config = FACTOR_CONFIG[factor] || { color: 'var(--color-text-muted)', icon: 'BarChart3' };
  const maxScore =
    factor === 'Openness' ? 50 : factor === 'Extraversion' || factor === 'Neuroticism' ? 40 : 45;
  const percentage = Math.round((score / maxScore) * 100);
  const interpretation = getInterpretation(factor, score, t);
  const factorName = t(`bfi44.results.factors.${factor}.name`);
  const factorDescription = t(`bfi44.results.factors.${factor}.description`);

  // Map icon string to Lucide component
  const IconComponent =
    {
      Users: Users,
      Handshake: Handshake,
      Target: Target,
      Frown: Frown,
      Sparkles: Sparkles,
      BarChart3: BarChart3,
    }[config.icon] || BarChart3;

  return (
    <article
      style={{
        ...styles.factorCard,
        animation: `slideIn 0.5s ease forwards ${index * 0.1}s`,
        opacity: 0,
        borderTopColor: config.color,
      }}
      aria-label={`${factor} score: ${score} out of ${maxScore}`}
    >
      <div style={styles.factorHeader}>
        <span style={styles.factorIcon} aria-hidden="true">
          <IconComponent size={32} color={config.color} />
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ ...styles.factorName, color: config.color }}>{factorName}</h3>
          <p style={styles.factorDescription}>{factorDescription}</p>
        </div>
      </div>

      <div style={styles.scoreWrapper}>
        <div
          style={styles.progressBar}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${config.color}, ${config.color}dd)`,
            }}
          />
        </div>
        <div style={styles.scoreInfo}>
          <span style={{ ...styles.scoreValue, color: config.color }}>{score}</span>
          <span style={styles.scoreMax}>/{maxScore}</span>
        </div>
      </div>

      <div
        style={{
          ...styles.interpretationBox,
          borderLeftColor: config.color,
          background: `${config.color}08`,
        }}
      >
        <p
          style={{
            ...styles.interpretationText,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Lightbulb size={16} aria-hidden="true" />
          {interpretation}
        </p>
      </div>
    </article>
  );
}

const styles = {
  factorCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '26px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    borderTop: '4px solid',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  factorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '20px',
  },
  factorIcon: {
    fontSize: '32px',
    lineHeight: 1,
  },
  factorName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    marginBottom: '6px',
  },
  factorDescription: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
    margin: 0,
  },
  scoreWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '16px',
  },
  progressBar: {
    flex: 1,
    height: '12px',
    background: 'var(--color-border)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scoreInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    minWidth: '75px',
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: '15px',
    color: '#94a3b8',
    fontWeight: '600',
  },
  interpretationBox: {
    padding: '14px 18px',
    borderRadius: '10px',
    borderLeft: '4px solid',
  },
  interpretationText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    lineHeight: '1.6',
    fontWeight: '500',
  },
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';

const POOL_MULTIPLIER_MIN = 1;
const POOL_MULTIPLIER_MAX = 10;

export default function CBRCaseEditor({
  projectId,
  poolData,
  poolLoading,
  poolError,
  poolMessage,
  localMultiplier,
  onMultiplierChange,
  onSave,
}) {
  const { t } = useTranslation();
  const hasMultiplierChanged = poolData && localMultiplier !== poolData.candidatePoolMultiplier;

  if (!projectId) return null;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <Users size={18} color="#8B5CF6" />
        <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.candidatePool.title')}</h4>
      </div>
      <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.description')}</p>

      {poolLoading && !poolData && (
        <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.loading')}</p>
      )}

      {poolError && (
        <div style={styles.poolMessage}>
          <AlertCircle size={16} color="#EF4444" />
          <span style={{ color: 'var(--color-danger-icon)' }}>{poolError}</span>
        </div>
      )}

      {poolData && (
        <>
          <div style={styles.poolStats}>
            <div style={styles.poolStat}>
              <span style={styles.poolStatLabel}>
                {t('teamConfig.cbr.candidatePool.teamSize')}
              </span>
              <span style={styles.poolStatValue}>{poolData.teamSize}</span>
            </div>
            <div style={styles.poolStatMultiply}>×</div>
            <div style={styles.poolStat}>
              <span style={styles.poolStatLabel}>
                {t('teamConfig.cbr.candidatePool.multiplierLabel')}
              </span>
              <input
                type="number"
                min={POOL_MULTIPLIER_MIN}
                max={POOL_MULTIPLIER_MAX}
                value={localMultiplier}
                onChange={(e) => onMultiplierChange(e.target.value)}
                style={styles.poolMultiplierInput}
                disabled={poolLoading}
                aria-label={t('teamConfig.cbr.candidatePool.multiplierLabel')}
              />
            </div>
            <div style={styles.poolStatEquals}>=</div>
            <div style={styles.poolStat}>
              <span style={styles.poolStatLabel}>
                {t('teamConfig.cbr.candidatePool.effectiveTopN')}
              </span>
              <span style={styles.poolStatValueHighlight}>
                {poolData.teamSize * localMultiplier}
              </span>
            </div>
          </div>

          <div style={styles.poolSliderContainer}>
            <input
              type="range"
              min={POOL_MULTIPLIER_MIN}
              max={POOL_MULTIPLIER_MAX}
              step="1"
              value={localMultiplier}
              onChange={(e) => onMultiplierChange(e.target.value)}
              style={styles.slider}
              disabled={poolLoading}
              aria-label={t('teamConfig.cbr.candidatePool.multiplierLabel')}
            />
            <div style={styles.sliderLabels}>
              <span>&times;{POOL_MULTIPLIER_MIN}</span>
              <span>&times;{POOL_MULTIPLIER_MAX}</span>
            </div>
          </div>

          <p style={styles.poolEffectiveDescription}>
            {t('teamConfig.cbr.candidatePool.effectiveDescription', {
              topN: poolData.teamSize * localMultiplier,
            })}
          </p>

          <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.multiplierHint')}</p>

          {hasMultiplierChanged && (
            <button type="button"
              onClick={onSave}
              disabled={poolLoading}
              style={styles.poolSaveButton}
            >
              {poolLoading
                ? t('teamConfig.saving')
                : t('teamConfig.cbr.candidatePool.multiplierLabel')}
            </button>
          )}

          {poolMessage && (
            <div
              style={{
                ...styles.poolMessage,
                ...(poolMessage.type === 'success'
                  ? styles.poolMessageSuccess
                  : styles.poolMessageError),
              }}
            >
              {poolMessage.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{poolMessage.text}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    backgroundColor: 'var(--color-border)',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  poolStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    flexWrap: 'wrap',
  },
  poolStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  poolStatLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  poolStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  poolStatValueHighlight: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-accent-purple)',
  },
  poolStatMultiply: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  poolStatEquals: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  poolMultiplierInput: {
    width: '70px',
    padding: '8px 12px',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center',
    border: '2px solid var(--color-accent-purple)',
    borderRadius: '8px',
    outline: 'none',
    color: 'var(--color-text-heading)',
    backgroundColor: '#F5F3FF',
  },
  poolSliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  poolEffectiveDescription: {
    margin: 0,
    fontSize: '13px',
    color: '#4B5563',
    lineHeight: 1.5,
    padding: '8px 12px',
    backgroundColor: '#F5F3FF',
    borderRadius: '6px',
    border: '1px solid #DDD6FE',
  },
  poolSaveButton: {
    alignSelf: 'flex-end',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'var(--color-accent-purple)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  poolMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  poolMessageSuccess: {
    backgroundColor: 'var(--color-success-bg)',
    color: 'var(--color-success-dark)',
  },
  poolMessageError: {
    backgroundColor: 'var(--color-danger-bg)',
    color: 'var(--color-danger-strong)',
  },
};

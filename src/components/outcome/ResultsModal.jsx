import React from 'react';
import {
  Lightbulb,
  BarChart3,
  CheckCircle,
  GraduationCap,
  Target,
  Trophy,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ResultsModal Component
 * Displays outcome capture results and learning report
 */
export default function ResultsModal({ show, results, onClose, onViewFullReport }) {
  const { t } = useTranslation();
  if (!show || !results) return null;

  const { predictionAccuracy, learningReport } = results.data || {};

  if (!predictionAccuracy || !learningReport) return null;

  const accuracyPercent = Math.round(predictionAccuracy.overall * 100);

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.title}>{t('outcome.results.title')}</h2>
          <p style={styles.subtitle}>{t('outcome.results.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏆</div>
            <div>
              <div style={styles.statLabel}>{t('outcome.results.predictionAccuracy')}</div>
              <div
                style={{
                  ...styles.statValue,
                  color: accuracyPercent >= 70 ? '#10B981' : '#DC2626',
                }}
              >
                {accuracyPercent}%
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${accuracyPercent}%`,
                    background: accuracyPercent >= 70 ? '#10B981' : '#DC2626',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✓</div>
            <div>
              <div style={styles.statLabel}>{t('outcome.results.correctPredictions')}</div>
              <div style={{ ...styles.statValue, color: 'var(--color-success)' }}>
                {predictionAccuracy.correctPredictions}
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Lightbulb size={32} color="#2563EB" />
            </div>
            <div>
              <div style={styles.statLabel}>{t('outcome.results.totalCases')}</div>
              <div style={{ ...styles.statValue, color: 'var(--color-primary)' }}>
                {learningReport.systemImpact?.caseBaseSize || 0}
              </div>
            </div>
          </div>
        </div>

        {/* System Impact */}
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={24} />
            {t('outcome.results.systemImpact')}
          </h3>
          <div style={styles.impactList}>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>{t('outcome.results.caseAdded')}</span>
              <span
                style={{
                  ...styles.successBadge,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={16} />
                {t('outcome.results.completed')}
              </span>
            </div>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>{t('outcome.results.confidenceIncrease')}</span>
              <strong>
                +{Math.round((learningReport.systemImpact?.expectedConfidenceIncrease || 0) * 100)}%
              </strong>
            </div>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>{t('outcome.results.realCases')}</span>
              <strong>{learningReport.systemImpact?.caseBaseSize || 0}</strong>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        {learningReport.learnings && (
          <div style={styles.section}>
            <h3
              style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <GraduationCap size={24} />
              {t('outcome.results.keyLearnings')}
            </h3>

            {learningReport.learnings.strengthenedBeliefs?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4
                  style={{
                    ...styles.learningTitle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle size={20} />
                  {t('outcome.results.strengthenedBeliefs')}
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.strengthenedBeliefs.map((belief) => (
                    <li key={belief} style={styles.learningItem}>
                      {belief}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {learningReport.learnings.newInsights?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4
                  style={{
                    ...styles.learningTitle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Lightbulb size={20} />
                  {t('outcome.results.newInsights')}
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.newInsights.map((insight) => (
                    <li key={insight} style={styles.learningItem}>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {learningReport.learnings.surprises?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4
                  style={{
                    ...styles.learningTitle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Target size={20} />
                  {t('outcome.results.surprises')}
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.surprises.map((surprise) => (
                    <li key={surprise} style={styles.learningItem}>
                      {surprise}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Prediction Accuracy Details */}
        {learningReport.accuracy && (
          <div style={styles.section}>
            <h3
              style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Target size={24} />
              {t('outcome.results.accuracyDetails')}
            </h3>
            <div style={styles.accuracyGrid}>
              {Object.entries(learningReport.accuracy).map(([riskType, data]) => (
                <div key={riskType} style={styles.accuracyCard}>
                  <div style={styles.accuracyHeader}>
                    <span style={styles.riskTypeName}>{riskType.replace(/_/g, ' ')}</span>
                    <span
                      style={{
                        ...styles.resultBadge,
                        background: data.result === 'correct_prediction' ? '#10B981' : '#F59E0B',
                      }}
                    >
                      {data.result === 'correct_prediction'
                        ? t('outcome.results.correct')
                        : t('outcome.results.falsePositive')}
                    </span>
                  </div>
                  <div style={styles.accuracyDetail}>
                    <span>
                      {t('outcome.results.predicted')}:{' '}
                      {data.predicted ? t('common.yes') : t('common.no')}
                    </span>
                    <span>
                      {t('outcome.results.occurred')}:{' '}
                      {data.occurred ? t('common.yes') : t('common.no')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          {onViewFullReport && (
            <button type="button" onClick={onViewFullReport} style={styles.secondaryButton}>
              {t('outcome.results.viewFullReport')}
            </button>
          )}
          <button type="button" onClick={onClose} style={styles.primaryButton}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '12px',
    overflowY: 'auto',
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '95vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    margin: 'auto',
  },
  header: {
    padding: '24px 20px 20px',
    textAlign: 'center',
    borderBottom: '1px solid var(--color-border)',
  },
  successIcon: {
    width: '56px',
    height: '56px',
    margin: '0 auto 12px',
    background: 'var(--color-success)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    padding: '20px',
  },
  statCard: {
    display: 'flex',
    gap: '10px',
    padding: '14px',
    background: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  statIcon: {
    fontSize: '28px',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginBottom: '3px',
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: 1,
  },
  progressBar: {
    width: '100%',
    height: '4px',
    background: 'var(--color-border)',
    borderRadius: '2px',
    marginTop: '8px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  section: {
    padding: '20px',
    borderTop: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    marginBottom: '12px',
  },
  impactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  impactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'var(--color-text-strong)',
    flexWrap: 'wrap',
    gap: '8px',
  },
  impactLabel: {
    color: 'var(--color-text-muted)',
  },
  successBadge: {
    padding: '4px 12px',
    background: 'var(--color-success-bg)',
    color: 'var(--color-success-dark)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  learningBlock: {
    marginBottom: '16px',
  },
  learningTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
    marginBottom: '6px',
  },
  learningList: {
    margin: 0,
    paddingLeft: '20px',
  },
  learningItem: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
    lineHeight: 1.4,
  },
  accuracyGrid: {
    display: 'grid',
    gap: '10px',
  },
  accuracyCard: {
    padding: '10px',
    background: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
  },
  accuracyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    flexWrap: 'wrap',
    gap: '6px',
  },
  riskTypeName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    textTransform: 'capitalize',
  },
  resultBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  accuracyDetail: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  actions: {
    padding: '16px 20px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '10px 24px',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  secondaryButton: {
    padding: '10px 24px',
    background: '#FFFFFF',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

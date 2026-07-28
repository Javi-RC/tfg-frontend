import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * Data Completeness Banner Component
 * Shows user how complete their project data is and suggestions for improvement
 */
export default function CompletenessIndicator({
  completeness,
  completedFields,
  totalFields,
  suggestions = [],
  message,
}) {
  const { t } = useTranslation();
  const getProgressColor = () => {
    if (completeness >= 90) return '#10B981';
    if (completeness >= 60) return '#F59E0B';
    if (completeness >= 30) return '#EF4444';
    return '#DC2626';
  };

  const getIcon = () => {
    if (completeness >= 90) return CheckCircle2;
    if (completeness >= 60) return TrendingUp;
    return Info;
  };

  const Icon = getIcon();
  const progressColor = getProgressColor();

  return (
    <div style={styles.container} role="status" aria-live="polite">
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Icon size={20} color={progressColor} />
          <div>
            <h4 style={styles.title}>{t('risk.completeness.title')}</h4>
            <p style={styles.subtitle}>{message}</p>
          </div>
        </div>
        <div style={styles.percentage}>
          <span style={{ ...styles.percentageText, color: progressColor }}>{completeness}%</span>
          <span style={styles.fieldCount}>
            {t('risk.completeness.fieldsCount', { completed: completedFields, total: totalFields })}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBarContainer}>
        <progress
          value={completeness}
          max={100}
          aria-label={t('risk.completeness.aria.progress', { percent: completeness })}
          style={{
            ...styles.progressBar,
            width: '100%',
            accentColor: progressColor,
          }}
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={styles.suggestions}>
          <div style={styles.suggestionsTitle}>{t('risk.completeness.suggestionsTitle')}</div>
          <ul style={styles.suggestionsList}>
            {suggestions.map((suggestion) => (
              <li key={suggestion} style={styles.suggestionItem}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
    minWidth: '200px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },
  percentage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1',
  },
  fieldCount: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    borderRadius: '4px',
  },
  suggestions: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#FFFBEB',
    borderRadius: '6px',
    border: '1px solid var(--color-warning-bg)',
  },
  suggestionsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-warning-dark)',
    marginBottom: '8px',
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#78350F',
  },
  suggestionItem: {
    marginBottom: '4px',
    lineHeight: '1.5',
  },
};

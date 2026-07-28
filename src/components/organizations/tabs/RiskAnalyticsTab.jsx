import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Target, Database, TrendingUp } from 'lucide-react';
import LoadingState from '../../common/LoadingState';
import ErrorState from '../../common/ErrorState';
import EmptyState from '../../common/EmptyState';
import { useOrganizationRiskAnalytics } from '../../../hooks/useOrganizationRiskAnalytics';

/** Human-friendly label from a camelCase / snake_case key. */
const labelize = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

const formatValue = (value) => {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return String(value);
};

/** Renders the primitive entries of an object as metric tiles. */
function MetricsGrid({ data }) {
  if (!data || typeof data !== 'object') return null;
  const entries = Object.entries(data).filter(
    ([, v]) => typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean'
  );
  if (entries.length === 0) return null;
  return (
    <div style={styles.metricsGrid}>
      {entries.map(([key, value]) => (
        <div key={key} style={styles.metricTile}>
          <span style={styles.metricValue}>{formatValue(value)}</span>
          <span style={styles.metricLabel}>{labelize(key)}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>
        {React.createElement(icon, { size: 18, color: '#6366F1' })} {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Organization-wide risk analytics derived from the CBR case base.
 * Insights / stats / accuracy are visible to any member; the case base
 * sections are admin-only (the backend enforces the same boundary).
 */
export default function RiskAnalyticsTab({ organizationId, isAdmin }) {
  const { t } = useTranslation();
  const { insights, stats, accuracy, caseBaseStats, cases, loading, error, reload } =
    useOrganizationRiskAnalytics(organizationId, isAdmin);

  if (loading) return <LoadingState message={t('organizations.riskAnalytics.loading')} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const nothing = !insights && !stats && !accuracy && !caseBaseStats && !(cases && cases.length);
  if (nothing) {
    return (
      <EmptyState
        icon={BarChart3}
        title={t('organizations.riskAnalytics.empty')}
        description={t('organizations.riskAnalytics.emptyDescription')}
      />
    );
  }

  return (
    <div>
      <p style={styles.intro}>{t('organizations.riskAnalytics.intro')}</p>

      {stats && (
        <Section icon={BarChart3} title={t('organizations.riskAnalytics.stats')}>
          <MetricsGrid data={stats} />
        </Section>
      )}

      {accuracy && (
        <Section icon={Target} title={t('organizations.riskAnalytics.accuracy')}>
          <MetricsGrid data={accuracy} />
        </Section>
      )}

      {insights && (
        <Section icon={TrendingUp} title={t('organizations.riskAnalytics.insights')}>
          <MetricsGrid data={insights} />
          {Array.isArray(insights.topRisks) && insights.topRisks.length > 0 && (
            <ul style={styles.list}>
              {insights.topRisks.map((r, i) => (
                <li key={r._id || r.type || i} style={styles.listItem}>
                  <span style={styles.itemTitle}>{r.title || r.type}</span>
                  {typeof r.count === 'number' && (
                    <span style={styles.itemMeta}>
                      {t('organizations.riskAnalytics.occurrences', { count: r.count })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {isAdmin && (caseBaseStats || (cases && cases.length > 0)) && (
        <Section icon={Database} title={t('organizations.riskAnalytics.caseBase')}>
          {caseBaseStats && <MetricsGrid data={caseBaseStats} />}
          {cases && cases.length > 0 && (
            <ul style={styles.list}>
              {cases.map((c, i) => {
                const problem = c.problem || c;
                return (
                  <li key={c._id || c.caseId || i} style={styles.listItem}>
                    <span style={styles.itemTitle}>
                      {problem.projectName || c.caseId || t('organizations.riskAnalytics.unnamedCase')}
                    </span>
                    {c.type && <span style={styles.badge}>{c.type}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      )}
    </div>
  );
}

const styles = {
  intro: { fontSize: '14px', color: 'var(--color-text-muted)', margin: '0 0 20px' },
  section: { marginBottom: '28px' },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '14px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
  },
  metricTile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EEF0F4',
    borderRadius: '10px',
  },
  metricValue: { fontSize: '24px', fontWeight: 700, color: '#4338CA' },
  metricLabel: { fontSize: '13px', color: 'var(--color-text-muted)' },
  list: {
    listStyle: 'none',
    margin: '14px 0 0',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EEF0F4',
    borderRadius: '8px',
  },
  itemTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', flex: 1 },
  itemMeta: { fontSize: '13px', color: 'var(--color-text-muted)' },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
  },
};

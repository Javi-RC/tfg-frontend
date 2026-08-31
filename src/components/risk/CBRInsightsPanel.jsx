import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Sparkles, GitCompare, RefreshCw, Check } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import { useProjectCBR } from '../../hooks/useProjectCBR';

const riskId = (r) => String(r?._id ?? r?.id ?? '');

/**
 * Read-only view of the CBR / expert-rule analysis for a project, plus the
 * project manager's "accept risks" action. Data is loaded on demand so the
 * risks tab stays cheap to open.
 */
export default function CBRInsightsPanel({ projectId, canEdit }) {
  const { t } = useTranslation();
  const { similarCases, cbrRisks, indicators, loading, error, load, acceptRisks } =
    useProjectCBR(projectId);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [accepting, setAccepting] = useState(false);

  const handleLoad = async () => {
    await load();
    setLoaded(true);
  };

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAccept = async () => {
    if (selected.size === 0) return;
    setAccepting(true);
    const ok = await acceptRisks([...selected]);
    if (ok) setSelected(new Set());
    setAccepting(false);
  };

  if (!loaded) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Database size={20} color="#6366F1" />
          <div>
            <h4 style={styles.title}>{t('risks.cbr.title')}</h4>
            <p style={styles.subtitle}>{t('risks.cbr.description')}</p>
          </div>
        </div>
        <PrimaryButton onClick={handleLoad} leftIcon={<Sparkles size={16} />}>
          {t('risks.cbr.loadAction')}
        </PrimaryButton>
      </div>
    );
  }

  if (loading) return <LoadingState message={t('risks.cbr.loading')} />;
  if (error) return <ErrorState message={error} onRetry={handleLoad} />;

  const hasNothing =
    (!similarCases || similarCases.length === 0) &&
    (!cbrRisks || cbrRisks.length === 0) &&
    (!indicators || indicators.length === 0);

  if (hasNothing) {
    return (
      <div style={styles.container}>
        <EmptyState icon={Database} title={t('risks.cbr.empty')} />
        <SecondaryButton onClick={handleLoad} leftIcon={<RefreshCw size={16} />}>
          {t('common.refresh')}
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Database size={20} color="#6366F1" />
        <div style={styles.headerText}>
          <h4 style={styles.title}>{t('risks.cbr.title')}</h4>
          <p style={styles.subtitle}>{t('risks.cbr.description')}</p>
        </div>
        <SecondaryButton onClick={handleLoad} leftIcon={<RefreshCw size={14} />}>
          {t('common.refresh')}
        </SecondaryButton>
      </div>

      {/* System-detected risks */}
      <section style={styles.section}>
        <h5 style={styles.sectionTitle}>
          <Sparkles size={16} color="var(--color-primary)" /> {t('risks.cbr.cbrRisks')}
        </h5>
        {cbrRisks && cbrRisks.length > 0 ? (
          <ul style={styles.list}>
            {cbrRisks.map((r, i) => {
              const id = riskId(r) || `cbr-${i}`;
              return (
                <li key={id} style={styles.item}>
                  {canEdit && (
                    <input
                      type="checkbox"
                      checked={selected.has(id)}
                      onChange={() => toggle(id)}
                      aria-label={t('risks.cbr.selectRisk', { title: r.title || r.type })}
                    />
                  )}
                  <div style={styles.itemBody}>
                    <span style={styles.itemTitle}>{r.title || r.type}</span>
                    {r.description && <span style={styles.itemDesc}>{r.description}</span>}
                    <div style={styles.badges}>
                      {r.severity && <span style={styles.badge}>{r.severity}</span>}
                      {typeof r.similarity === 'number' && (
                        <span style={styles.badgeMuted}>
                          {t('risks.cbr.similarity', {
                            value: Math.round(r.similarity * 100),
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={styles.muted}>{t('risks.cbr.noCbrRisks')}</p>
        )}
        {canEdit && cbrRisks && cbrRisks.length > 0 && (
          <PrimaryButton
            onClick={handleAccept}
            disabled={selected.size === 0 || accepting}
            leftIcon={<Check size={16} />}
          >
            {accepting
              ? t('common.saving')
              : t('risks.cbr.acceptAction', { count: selected.size })}
          </PrimaryButton>
        )}
      </section>

      {/* System indicators and alerts */}
      <section style={styles.section}>
        <h5 style={styles.sectionTitle}>{t('risks.cbr.indicators')}</h5>
        {indicators && indicators.length > 0 ? (
          <ul style={styles.list}>
            {indicators.map((ind, i) => (
              <li key={riskId(ind) || `ind-${i}`} style={styles.item}>
                <div style={styles.itemBody}>
                  <span style={styles.itemTitle}>{ind.title || ind.type}</span>
                  {ind.description && <span style={styles.itemDesc}>{ind.description}</span>}
                  {ind.severity && <span style={styles.badge}>{ind.severity}</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.muted}>{t('risks.cbr.noIndicators')}</p>
        )}
      </section>

      {/* Similar past projects */}
      <section style={styles.section}>
        <h5 style={styles.sectionTitle}>
          <GitCompare size={16} color="var(--color-primary)" /> {t('risks.cbr.similarCases')}
        </h5>
        {similarCases && similarCases.length > 0 ? (
          <ul style={styles.list}>
            {similarCases.map((c, i) => {
              const problem = c.problem || c;
              return (
                <li key={c._id || c.caseId || `case-${i}`} style={styles.item}>
                  <div style={styles.itemBody}>
                    <span style={styles.itemTitle}>
                      {problem.projectName || c.caseId || t('risks.cbr.unnamedCase')}
                    </span>
                    {typeof c.similarity === 'number' && (
                      <span style={styles.badgeMuted}>
                        {t('risks.cbr.similarity', { value: Math.round(c.similarity * 100) })}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={styles.muted}>{t('risks.cbr.noSimilarCases')}</p>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
    padding: '20px',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    backgroundColor: 'var(--color-bg-white)',
  },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  headerText: { flex: 1 },
  title: { margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' },
  subtitle: { margin: '2px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' },
  section: { marginTop: '20px' },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-strong)',
    marginBottom: '10px',
  },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  itemBody: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  itemTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' },
  itemDesc: { fontSize: '13px', color: '#4B5563' },
  badges: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    alignSelf: 'flex-start',
  },
  badgeMuted: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: 'var(--color-bg-subtle)',
    color: 'var(--color-text-muted)',
    alignSelf: 'flex-start',
  },
  muted: { fontSize: '13px', color: 'var(--color-text-disabled)', margin: 0 },
};

import React, { lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';
import FactorCard from '../personality/FactorCard';
import LoadingState from '../common/LoadingState';

const TeamRadarChart = lazy(() => import('./TeamRadarChart'));

export default function PersonalityFitSection({ employee, loading = false, forbidden = false }) {
  const { t } = useTranslation();
  const bfi = employee?.bfi44Profile;
  const results = useMemo(() => coerceBfi44Results(bfi), [bfi]);

  if (loading) {
    return (
      <div style={styles.emptyState}>
        <Brain size={48} color="#6c757d" style={{ opacity: 0.3 }} />
        <p style={styles.emptyText}>{t('team.personalityFit.loading')}</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div style={styles.emptyState}>
        <Brain size={48} color="#6c757d" style={{ opacity: 0.3 }} />
        <p style={styles.emptyText}>{t('team.personalityFit.notAvailable')}</p>
        <p style={styles.emptySubtext}>{t('team.personalityFit.forbidden')}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div style={styles.emptyState}>
        <Brain size={48} color="#6c757d" style={{ opacity: 0.3 }} />
        <p style={styles.emptyText}>{t('team.personalityFit.notCompleted')}</p>
        <p style={styles.emptySubtext}>{t('team.personalityFit.completeQuestionnaire')}</p>
      </div>
    );
  }

  const radarData = prepareRadarData(results);

  return (
    <div style={styles.container}>
      <div style={styles.radarCard}>
        <h3 style={styles.sectionTitle}>
          <Brain size={18} />
          {t('team.personalityFit.title')}
        </h3>
        <p style={styles.sectionSubtitle}>{t('team.personalityFit.subtitle')}</p>

        <div style={styles.radarContainer}>
          <Suspense fallback={<LoadingState size="small" />}>
            <TeamRadarChart radarData={radarData} />
          </Suspense>
        </div>
      </div>

      <div style={styles.factorsColumn}>
        {FACTOR_ORDER.map((factor, index) => (
          <FactorCard key={factor} factor={factor} score={results[factor] || 0} index={index} />
        ))}
      </div>
    </div>
  );
}

const FACTOR_ORDER = [
  'Extraversion',
  'Agreeableness',
  'Conscientiousness',
  'Neuroticism',
  'Openness',
];

function getMaxScore(factor) {
  if (factor === 'Openness') return 50;
  if (factor === 'Extraversion' || factor === 'Neuroticism') return 40;
  return 45;
}

function prepareRadarData(results) {
  return FACTOR_ORDER.map((factor) => ({
    factor,
    value: results[factor] || 0,
    maxScore: getMaxScore(factor),
  }));
}

function coerceBfi44Results(bfiProfile) {
  if (!bfiProfile || typeof bfiProfile !== 'object') return null;

  const source = bfiProfile.results || bfiProfile.traits || bfiProfile;
  if (!source || typeof source !== 'object') return null;

  const raw = {
    Extraversion: source.Extraversion ?? source.extraversion,
    Agreeableness: source.Agreeableness ?? source.agreeableness,
    Conscientiousness: source.Conscientiousness ?? source.conscientiousness,
    Neuroticism: source.Neuroticism ?? source.neuroticism,
    Openness: source.Openness ?? source.openness,
  };

  const present = Object.values(raw).filter((v) => v !== undefined && v !== null);
  if (present.length === 0) return null;

  const looksLikeLikert = present.every((v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 5;
  });

  const normalized = {};
  for (const factor of FACTOR_ORDER) {
    const value = Number(raw[factor] ?? 0);
    if (!Number.isFinite(value)) {
      normalized[factor] = 0;
      continue;
    }

    normalized[factor] = looksLikeLikert ? Math.round((value / 5) * getMaxScore(factor)) : value;
  }

  return normalized;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 6px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  radarCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  radarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '14px',
    padding: '10px 0',
    background: 'linear-gradient(135deg, var(--color-bg-muted) 0%, #f1f5f9 100%)',
    borderRadius: '14px',
  },
  factorsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: '12px 0 6px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    maxWidth: '380px',
  },
};

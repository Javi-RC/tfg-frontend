import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCcw, BarChart3, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import FactorCard from './FactorCard';
import { FACTOR_CONFIG } from './factorConfig';
import LoadingState from '../common/LoadingState';

const BFI44RadarChart = lazy(() => import('./BFI44RadarChart'));

/**
 * Prepare data for radar chart visualization
 */
const prepareRadarData = (results, t) => {
  if (!results) return [];

  return [
    {
      factor: t('bfi44.results.factors.Extraversion.name'),
      value: results.Extraversion || 0,
      maxScore: 40,
      fill: '#3b82f6',
    },
    {
      factor: t('bfi44.results.factors.Agreeableness.name'),
      value: results.Agreeableness || 0,
      maxScore: 45,
      fill: '#10b981',
    },
    {
      factor: t('bfi44.results.factors.Conscientiousness.name'),
      value: results.Conscientiousness || 0,
      maxScore: 45,
      fill: '#8b5cf6',
    },
    {
      factor: t('bfi44.results.factors.Neuroticism.name'),
      value: results.Neuroticism || 0,
      maxScore: 40,
      fill: '#ef4444',
    },
    {
      factor: t('bfi44.results.factors.Openness.name'),
      value: results.Openness || 0,
      maxScore: 50,
      fill: '#f59e0b',
    },
  ];
};

/**
 * BFI44ResultsView Component
 * Displays personality test results with radar chart and factor cards
 *
 * @param {Object} results - Test results with factor scores
 * @param {Function} onRetake - Callback to retake questionnaire
 * @param {Function} onNavigateBack - Callback to navigate back
 */
export default function BFI44ResultsView({ results, onRetake, onNavigateBack }) {
  const { t } = useTranslation();
  const radarData = prepareRadarData(results, t);

  return (
    <>
      {/* Two Column Layout: Factors Left, Radar Right */}
      <div style={styles.resultsLayout}>
        {/* Left Column: Factor Cards */}
        <div style={styles.factorsColumn}>
          {Object.entries(results).map(([factor, score], index) => (
            <FactorCard key={factor} factor={factor} score={score} index={index} />
          ))}
        </div>

        {/* Right Column: Radar Chart */}
        <div style={styles.radarColumn}>
          <div style={styles.radarCard}>
            <h2 style={{ ...styles.radarTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={24} aria-hidden="true" />
              {t('bfi44.results.visualOverview')}
            </h2>
            <p style={styles.radarSubtitle}>{t('bfi44.results.visualSubtitle')}</p>
            <div style={styles.radarContainer}>
              <Suspense fallback={<LoadingState size="small" />}>
                <BFI44RadarChart radarData={radarData} />
              </Suspense>
            </div>
            <div style={styles.radarLegend}>
              <div style={styles.legendItem}>
                <div style={styles.legendDot} aria-hidden="true" />
                <span style={styles.legendText}>{t('bfi44.results.radarLegend')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsRow}>
        <PrimaryButton
          onClick={onRetake}
          style={{ minWidth: '200px' }}
          aria-label={t('bfi44.results.retakeAssessment')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCcw size={16} aria-hidden="true" />
            {t('bfi44.results.retakeAssessment')}
          </span>
        </PrimaryButton>
        <SecondaryButton
          onClick={onNavigateBack}
          style={{ minWidth: '200px' }}
          aria-label={t('bfi44.results.backToProfile')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} aria-hidden="true" />
            {t('bfi44.results.backToProfile')}
          </span>
        </SecondaryButton>
      </div>
    </>
  );
}

const styles = {
  resultsLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 500px',
    gap: '32px',
    marginBottom: '40px',
    alignItems: 'start',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr',
      gap: '24px',
    },
  },
  factorsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  radarColumn: {
    position: 'sticky',
    top: '120px',
    '@media (max-width: 1200px)': {
      position: 'relative',
      top: 0,
    },
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '48px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  radarCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  radarTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
    margin: 0,
  },
  radarSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginBottom: '28px',
    margin: 0,
  },
  radarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    background: 'linear-gradient(135deg, var(--color-bg-muted) 0%, #f1f5f9 100%)',
    borderRadius: '16px',
  },
  radarLegend: {
    marginTop: '24px',
    padding: '16px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
  },
  legendText: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
};

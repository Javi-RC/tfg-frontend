import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCcw, BarChart3, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import FactorCard, { FACTOR_CONFIG } from './FactorCard';

/**
 * Prepare data for radar chart visualization
 */
const prepareRadarData = (results) => {
  if (!results) return [];
  
  return [
    {
      factor: 'Extraversion',
      value: results.Extraversion || 0,
      maxScore: 40,
      fill: '#3b82f6'
    },
    {
      factor: 'Agreeableness',
      value: results.Agreeableness || 0,
      maxScore: 45,
      fill: '#10b981'
    },
    {
      factor: 'Conscientiousness',
      value: results.Conscientiousness || 0,
      maxScore: 45,
      fill: '#8b5cf6'
    },
    {
      factor: 'Neuroticism',
      value: results.Neuroticism || 0,
      maxScore: 40,
      fill: '#ef4444'
    },
    {
      factor: 'Openness',
      value: results.Openness || 0,
      maxScore: 50,
      fill: '#f59e0b'
    }
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
  const radarData = prepareRadarData(results);

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
            <h2 style={{...styles.radarTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
              <BarChart3 size={24} aria-hidden="true" />
              Visual Overview
            </h2>
            <p style={styles.radarSubtitle}>Your personality across five dimensions</p>
            <div style={styles.radarContainer}>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#cbd5e0" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="factor" 
                    tick={{ fontSize: 12, fill: '#1a1a1a', fontWeight: '600' }}
                    tickLine={false}
                  />
                  <PolarRadiusAxis 
                    angle={90}
                    domain={[0, 50]}
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                  />
                  <Radar 
                    name="Your Score" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      padding: '12px 16px'
                    }}
                    formatter={(value, name, props) => {
                      const maxScore = props.payload.maxScore;
                      return [`${value} / ${maxScore}`, 'Score'];
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.radarLegend}>
              <div style={styles.legendItem}>
                <div style={styles.legendDot} aria-hidden="true" />
                <span style={styles.legendText}>Larger area = Higher scores across traits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsRow}>
        <PrimaryButton onClick={onRetake} style={{ minWidth: '200px' }} aria-label="Retake personality assessment">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCcw size={16} aria-hidden="true" />
            Retake Assessment
          </span>
        </PrimaryButton>
        <SecondaryButton onClick={onNavigateBack} style={{ minWidth: '200px' }} aria-label="Back to profile">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Profile
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
      gap: '24px'
    }
  },
  factorsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  radarColumn: {
    position: 'sticky',
    top: '120px',
    '@media (max-width: 1200px)': {
      position: 'relative',
      top: 0
    }
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '48px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  radarCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)'
  },
  radarTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '6px',
    margin: 0
  },
  radarSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '28px',
    margin: 0
  },
  radarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px'
  },
  radarLegend: {
    marginTop: '24px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
    textAlign: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#3b82f6'
  },
  legendText: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: '500'
  }
};

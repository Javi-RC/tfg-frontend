/**
 * Example: Risk Prediction View with New Phase Metadata
 * 
 * This example shows how to integrate all the new phase-based components
 * in a typical risk prediction page.
 */

import React from 'react';
import { 
  PhaseIndicator, 
  SystemMaturityPanel, 
  RiskSourceBadge,
  RiskPredictionMetadata 
} from '../../components/risk';
import RiskStatsCard from '../../components/projects/RiskStatsCard';

export default function RiskPredictionExample({ prediction, loading }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!prediction) {
    return <div>No prediction available</div>;
  }

  const { risks, metadata } = prediction;

  return (
    <div style={styles.container}>
      
      {/* 1. System Maturity Panel - Shows phase progress and information */}
      {metadata && (
        <SystemMaturityPanel metadata={metadata} />
      )}

      {/* 2. Risk Stats Card - Updated with new metadata fields */}
      <RiskStatsCard prediction={prediction} loading={false} />

      {/* 3. Individual Risks with Source Badges */}
      <div style={styles.risksSection}>
        <h2>Predicted Risks</h2>
        {risks.map(risk => (
          <div key={risk.riskId} style={styles.riskCard}>
            <div style={styles.riskHeader}>
              <h3>{risk.riskName}</h3>
              
              {/* Show source badge based on strategy */}
              <RiskSourceBadge 
                risk={risk}
                strategy={metadata?.strategy}
                size="md"
              />
            </div>

            <div style={styles.riskDetails}>
              <div>Severity: {risk.severity}</div>
              <div>Probability: {(risk.probability * 100).toFixed(0)}%</div>
              {risk.similarity && (
                <div>Similarity: {(risk.similarity * 100).toFixed(0)}%</div>
              )}
            </div>

            {risk.description && (
              <p style={styles.riskDescription}>{risk.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* 4. Detailed Metadata with Similar Cases */}
      {metadata && (
        <RiskPredictionMetadata metadata={metadata} />
      )}

      {/* Example: Conditional rendering based on strategy */}
      {metadata?.strategy && (
        <div style={styles.infoBox}>
          <h3>Current Strategy Information</h3>
          
          {metadata.strategy === 'dt_only' && (
            <p>
              🔵 Sistema en fase inicial. Las predicciones se basan únicamente
              en reglas expertas del árbol de decisión. A medida que se completen
              más proyectos, el sistema aprenderá de casos históricos.
            </p>
          )}

          {metadata.strategy === 'dt_priority' && (
            <p>
              🔷 Sistema en aprendizaje. Combinando reglas expertas con 
              experiencia histórica, priorizando DT cuando hay duplicados.
            </p>
          )}

          {metadata.strategy === 'cbr_priority' && (
            <p>
              💚 Sistema maduro. Priorizando experiencia histórica de casos
              similares, complementando con reglas expertas cuando es necesario.
            </p>
          )}

          {metadata.strategy === 'cbr_only' && (
            <p>
              💜 Sistema experto. Predicciones basadas completamente en la
              experiencia de {metadata.caseBaseSize}+ proyectos completados.
            </p>
          )}
        </div>
      )}

      {/* Example: Phase-specific features */}
      {metadata?.phase >= 3 && (
        <div style={styles.advancedFeatures}>
          <h3>🎯 Características Avanzadas Disponibles</h3>
          <p>
            Tu sistema ha alcanzado la Fase {metadata.phase}. Ahora puedes
            acceder a análisis predictivos más precisos basados en la 
            experiencia de proyectos similares.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  risksSection: {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  riskCard: {
    padding: '16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  riskDetails: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px'
  },
  riskDescription: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
    margin: 0
  },
  infoBox: {
    padding: '20px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px'
  },
  advancedFeatures: {
    padding: '20px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '12px'
  }
};

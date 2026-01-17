import React from 'react';
import { Lightbulb, BarChart3, CheckCircle, GraduationCap, Target, Trophy, Award } from 'lucide-react';

/**
 * ResultsModal Component
 * Displays outcome capture results and learning report
 */
export default function ResultsModal({ show, results, onClose, onViewFullReport }) {
  if (!show || !results) return null;

  const { predictionAccuracy, learningReport } = results.data || {};
  
  if (!predictionAccuracy || !learningReport) return null;

  const accuracyPercent = Math.round(predictionAccuracy.overall * 100);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.title}>Project Completed Successfully!</h2>
          <p style={styles.subtitle}>
            The system has learned from this experience and is ready to improve future predictions
          </p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏆</div>
            <div>
              <div style={styles.statLabel}>Prediction Accuracy</div>
              <div style={{
                ...styles.statValue,
                color: accuracyPercent >= 70 ? '#10B981' : '#DC2626'
              }}>
                {accuracyPercent}%
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${accuracyPercent}%`,
                  background: accuracyPercent >= 70 ? '#10B981' : '#DC2626'
                }} />
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✓</div>
            <div>
              <div style={styles.statLabel}>Correct Predictions</div>
              <div style={{...styles.statValue, color: '#10B981'}}>
                {predictionAccuracy.correctPredictions}
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}><Lightbulb size={32} color="#2563EB" /></div>
            <div>
              <div style={styles.statLabel}>Total Cases in Base</div>
              <div style={{...styles.statValue, color: '#2563EB'}}>
                {learningReport.systemImpact?.caseBaseSize || 0}
              </div>
            </div>
          </div>
        </div>

        {/* System Impact */}
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={24} />
            System Impact
          </h3>
          <div style={styles.impactList}>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>Case added to knowledge base:</span>
              <span style={{ ...styles.successBadge, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={16} />
                Completed
              </span>
            </div>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>Expected confidence increase:</span>
              <strong>+{Math.round((learningReport.systemImpact?.expectedConfidenceIncrease || 0) * 100)}%</strong>
            </div>
            <div style={styles.impactItem}>
              <span style={styles.impactLabel}>Real cases in organization:</span>
              <strong>{learningReport.systemImpact?.caseBaseSize || 0}</strong>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        {learningReport.learnings && (
          <div style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={24} />
              Key Learnings
            </h3>
            
            {learningReport.learnings.strengthenedBeliefs?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4 style={{ ...styles.learningTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} />
                  Strengthened Beliefs
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.strengthenedBeliefs.map((belief, i) => (
                    <li key={i} style={styles.learningItem}>{belief}</li>
                  ))}
                </ul>
              </div>
            )}

            {learningReport.learnings.newInsights?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4 style={{ ...styles.learningTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={20} />
                  New Insights
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.newInsights.map((insight, i) => (
                    <li key={i} style={styles.learningItem}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {learningReport.learnings.surprises?.length > 0 && (
              <div style={styles.learningBlock}>
                <h4 style={{ ...styles.learningTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} />
                  Surprises
                </h4>
                <ul style={styles.learningList}>
                  {learningReport.learnings.surprises.map((surprise, i) => (
                    <li key={i} style={styles.learningItem}>{surprise}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Prediction Accuracy Details */}
        {learningReport.accuracy && (
          <div style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={24} />
              Accuracy Details
            </h3>
            <div style={styles.accuracyGrid}>
              {Object.entries(learningReport.accuracy).map(([riskType, data]) => (
                <div key={riskType} style={styles.accuracyCard}>
                  <div style={styles.accuracyHeader}>
                    <span style={styles.riskTypeName}>
                      {riskType.replace(/_/g, ' ')}
                    </span>
                    <span style={{
                      ...styles.resultBadge,
                      background: data.result === 'correct_prediction' ? '#10B981' : '#F59E0B'
                    }}>
                      {data.result === 'correct_prediction' ? '✓ Correct' : '⚠ False Positive'}
                    </span>
                  </div>
                  <div style={styles.accuracyDetail}>
                    <span>Predicted: {data.predicted ? 'Yes' : 'No'}</span>
                    <span>Occurred: {data.occurred ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          {onViewFullReport && (
            <button
              onClick={onViewFullReport}
              style={styles.secondaryButton}
            >
              View Full Report
            </button>
          )}
          <button
            onClick={onClose}
            style={styles.primaryButton}
          >
            Close
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
    padding: '20px'
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '12px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  header: {
    padding: '32px 32px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #E5E7EB'
  },
  successIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    background: '#10B981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '24px 32px'
  },
  statCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  statIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '4px',
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: 1
  },
  progressBar: {
    width: '100%',
    height: '4px',
    background: '#E5E7EB',
    borderRadius: '2px',
    marginTop: '8px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease'
  },
  section: {
    padding: '24px 32px',
    borderTop: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  impactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  impactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#374151'
  },
  impactLabel: {
    color: '#6B7280'
  },
  successBadge: {
    padding: '4px 12px',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  learningBlock: {
    marginBottom: '20px'
  },
  learningTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  learningList: {
    margin: 0,
    paddingLeft: '24px'
  },
  learningItem: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '6px',
    lineHeight: 1.5
  },
  accuracyGrid: {
    display: 'grid',
    gap: '12px'
  },
  accuracyCard: {
    padding: '12px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '6px'
  },
  accuracyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  riskTypeName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize'
  },
  resultBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  accuracyDetail: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#6B7280'
  },
  actions: {
    padding: '24px 32px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  primaryButton: {
    padding: '10px 24px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  secondaryButton: {
    padding: '10px 24px',
    background: '#FFFFFF',
    color: '#2563EB',
    border: '1px solid #2563EB',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

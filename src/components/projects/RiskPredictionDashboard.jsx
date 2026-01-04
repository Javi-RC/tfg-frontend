import React from 'react';
import { Target, RefreshCw, Wand2, BarChart3, Lightbulb, XCircle, CheckCircle } from 'lucide-react';

/**
 * Risk Prediction Dashboard Component
 * Main container for risk prediction functionality with flexible data model
 */
export default function RiskPredictionDashboard({ 
  project,
  loading, 
  prediction, 
  error, 
  onPredict,
  readinessInfo // Changed from validationInfo to reflect new model
}) {
  const handlePredictClick = () => {
    onPredict();
  };

  // Extract data completeness from prediction or readinessInfo
  const dataCompleteness = prediction?.dataCompleteness || readinessInfo?.completeness || 0;
  const completedFields = prediction?.completedFields || readinessInfo?.completedFields || 0;
  const totalFields = prediction?.totalFields || readinessInfo?.totalFields || 20;
  const suggestions = prediction?.suggestions || readinessInfo?.suggestions || [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h3 style={{...styles.title, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Target size={24} />
            Risk Prediction
          </h3>
          <p style={styles.subtitle}>
            AI-powered risk analysis - Works with any data, improves with completeness
          </p>
        </div>
        <button
          style={{
            ...styles.predictButton,
            ...(loading && styles.predictButtonLoading)
          }}
          onClick={handlePredictClick}
          disabled={loading}
          style={{...styles.analyzeButton, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Analyzing...
            </>
          ) : prediction ? (
            <>
              <RefreshCw size={16} />
              Re-Analyze
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Analyze Risks
            </>
          )}
        </button>
      </div>

      {/* Data Completeness Info Bar */}
      {(readinessInfo || prediction) && (
        <div style={styles.completenessBar}>
          <div style={styles.completenessHeader}>
            <span style={{...styles.completenessTitle, display: 'flex', alignItems: 'center', gap: '6px'}}>
              <BarChart3 size={16} />
              Data Completeness: {dataCompleteness}%
            </span>
            <span style={styles.completenessFields}>
              {completedFields}/{totalFields} fields
            </span>
          </div>
          <div style={styles.progressBarContainer}>
            <div 
              style={{
                ...styles.progressBarFill,
                width: `${dataCompleteness}%`,
                backgroundColor: dataCompleteness >= 75 ? '#10B981' : dataCompleteness >= 50 ? '#F59E0B' : '#EF4444'
              }}
            />
          </div>
          {suggestions.length > 0 && (
            <div style={styles.suggestions}>
              <p style={{...styles.suggestionsTitle, display: 'flex', alignItems: 'center', gap: '6px'}}>
                <Lightbulb size={16} />
                Improve accuracy by adding:
              </p>
              <ul style={styles.suggestionsList}>
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} style={styles.suggestionItem}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          {readinessInfo?.message && (
            <p style={styles.completenessMessage}>
              {readinessInfo.message}
            </p>
          )}
        </div>
      )}

      {/* API Errors */}
      {error?.type === 'api' && (
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}><XCircle size={48} color="#dc2626" /></div>
          <div style={styles.errorContent}>
            <h4 style={styles.errorTitle}>Error Predicting Risks</h4>
            <p style={styles.errorMessage}>{error.message}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !prediction && !error && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><Wand2 size={64} color="#667eea" /></div>
          <h4 style={styles.emptyTitle}>Ready for Risk Analysis</h4>
          <p style={styles.emptyText}>
            Our AI-powered system can analyze risks at any stage.
            More data = Higher confidence predictions.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}><CheckCircle size={20} color="#10b981" /></span>
              <span style={styles.featureText}>13 Risk Detectors (Skill Gap, Communication, etc.)</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}><CheckCircle size={20} color="#10b981" /></span>
              <span style={styles.featureText}>Progressive Analysis (works with partial data)</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}><CheckCircle size={20} color="#10b981" /></span>
              <span style={styles.featureText}>Dynamic Confidence Scores</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}><CheckCircle size={20} color="#10b981" /></span>
              <span style={styles.featureText}>Actionable Recommendations</span>
            </div>
          </div>
          <p style={{ ...styles.emptyHint, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <Lightbulb size={16} />
            <span>
              <strong>Start Now:</strong> You can analyze risks with current data and re-analyze after adding more details.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    marginBottom: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    lineHeight: '1.5'
  },
  predictButton: {
    background: '#111',
    color: 'white',
    borderRadius: '32px',
    padding: '14px 32px',
    fontWeight: '600',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  predictButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  predictButtonDisabled: {
    background: '#9CA3AF',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  completenessBar: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px'
  },
  completenessHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  completenessTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111'
  },
  completenessFields: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280'
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px'
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    borderRadius: '4px'
  },
  suggestions: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB'
  },
  suggestionsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '6px'
  },
  suggestionItem: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '1.5'
  },
  completenessMessage: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FEE2E2',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  errorIcon: {
    fontSize: '24px'
  },
  errorContent: {
    flex: 1
  },
  errorTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#DC2626',
    margin: '0 0 8px 0'
  },
  errorMessage: {
    fontSize: '14px',
    color: '#DC2626',
    margin: 0
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 12px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 24px'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto 24px',
    textAlign: 'left'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    background: 'white',
    borderRadius: '8px'
  },
  featureIcon: {
    color: '#059669',
    fontWeight: '700',
    fontSize: '16px'
  },
  featureText: {
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500'
  },
  emptyHint: {
    fontSize: '13px',
    color: '#6B7280',
    background: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '0 auto',
    maxWidth: '600px',
    textAlign: 'left'
  }
};

// Add keyframes animation for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

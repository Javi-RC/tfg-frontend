import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sliders, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { SeverityLevels, RiskSourceBadges } from '../../types/risk.types';

/**
 * Risk Selection Interface Component
 * Allows PM to adjust similarity threshold and select CBR risks for monitoring
 */
export default function RiskSelectionInterface({
  cbrRisks = [],
  filteredRisks = [],
  minSimilarity = 0.5,
  selectedRiskIds = [],
  onSimilarityChange,
  onToggleRisk,
  onSelectAll,
  onClearSelection,
  onAccept,
  loading = false,
  error = null
}) {
  const { t } = useTranslation();
  const [expandedRisk, setExpandedRisk] = useState(null);

  const handleAccept = () => {
    if (selectedRiskIds.length === 0) {
      return;
    }
    onAccept();
  };

  const isAllSelected = selectedRiskIds.length === filteredRisks.length && filteredRisks.length > 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Sliders size={24} style={{ marginRight: '8px' }} />
          {t('risk.selection.title')}
        </h2>
        <p style={styles.subtitle}>
          {t('risk.selection.subtitle')}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
        </div>
      )}

      {/* Similarity Slider */}
      <div style={styles.sliderSection}>
        <div style={styles.sliderHeader}>
          <label style={styles.sliderLabel} htmlFor="similarity-threshold">{t('risk.selection.similarityThreshold')}</label>
          <span style={styles.sliderValue}>{(minSimilarity * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          id="similarity-threshold"
          min="0"
          max="1"
          step="0.05"
          value={minSimilarity}
          onChange={(e) => onSimilarityChange(parseFloat(e.target.value))}
          style={styles.slider}
          disabled={loading}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={minSimilarity}
          aria-label={t('risk.selection.similarityThreshold')}
        />
        <div style={styles.sliderInfo}>
          <span style={styles.sliderHint}>
            {t('risk.selection.showingRisks', { shown: filteredRisks.length, total: cbrRisks.length })}
          </span>
        </div>
      </div>

      {/* Selection Controls */}
      <div style={styles.selectionControls}>
        <div style={styles.selectionInfo}>
          <span style={styles.selectionCount}>
            {t('risk.selection.selectedCount', { selected: selectedRiskIds.length, total: filteredRisks.length })}
          </span>
        </div>
        <div style={styles.selectionButtons}>
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              opacity: filteredRisks.length === 0 ? 0.5 : 1,
              cursor: filteredRisks.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={isAllSelected ? onClearSelection : onSelectAll}
            disabled={filteredRisks.length === 0 || loading}
          >
            {isAllSelected ? t('risk.selection.deselectAll') : t('risk.selection.selectAll')}
          </button>
        </div>
      </div>

      {/* Risks List */}
      <div style={styles.risksList}>
        {filteredRisks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>{t('risk.selection.noRisksMatch')}</p>
            <p style={styles.emptyStateHint}>{t('risk.selection.tryLowering')}</p>
          </div>
        ) : (
          filteredRisks.map((risk) => {
            const isSelected = selectedRiskIds.includes(risk.id);
            const isExpanded = expandedRisk === risk.id;
            const severity = SeverityLevels[risk.severity];

            return (
              <div
                key={risk.id}
                style={{
                  ...styles.riskCard,
                  borderColor: severity.color,
                  background: isSelected ? `${severity.color}08` : '#F9FAFB'
                }}
              >
                {/* Risk Header */}
                <div style={styles.riskHeader}>
                  <div style={styles.riskCheckbox}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRisk(risk.id)}
                      style={styles.checkbox}
                      disabled={loading}
                      aria-label={`Select risk ${risk.title}`}
                    />
                  </div>

                  <div style={styles.riskInfo}>
                    <div style={styles.riskTitle}>{risk.title || risk.name || t('risk.selection.unnamedRisk', { defaultValue: 'Unnamed risk' })}</div>
                  </div>

                  <div style={styles.riskMetrics}>
                    <div
                      style={{
                        ...styles.badge,
                        background: severity.color,
                        color: 'white'
                      }}
                    >
                      {severity.label}
                    </div>
                    <div style={styles.probability}>
                      {(risk.probability * 100).toFixed(0)}%
                    </div>
                  </div>

                  <button
                    style={styles.expandButton}
                    onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                    disabled={loading}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? `Collapse details for ${risk.title}` : `Expand details for ${risk.title}`}
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={styles.riskDetails}>
                    <div style={styles.detailSection}>
                      <div style={styles.detailLabel}>{t('risk.selection.description')}</div>
                      <div style={styles.detailValue}>{risk.description}</div>
                    </div>

                    {risk.basedOnCases && (
                      <div style={styles.detailSection}>
                        <div style={styles.detailLabel}>
                          {t('risk.selection.basedOn', { count: risk.basedOnCases.length })}
                        </div>
                        <div style={styles.casesList}>
                          {risk.basedOnCases.slice(0, 3).map((caseItem, idx) => (
                            <div key={idx} style={styles.caseItem}>
                              <span style={styles.caseName}>{caseItem.projectName}</span>
                              <span style={styles.caseSimilarity}>
                                {(caseItem.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                          {risk.basedOnCases.length > 3 && (
                            <div style={styles.caseItem}>
                              <span>+{risk.basedOnCases.length - 3} more</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {risk.similarityBreakdown && (
                      <div style={styles.detailSection}>
                        <div style={styles.detailLabel}>{t('risk.selection.similarityBreakdown')}</div>
                        <div style={styles.breakdownGrid}>
                          {Object.entries(risk.similarityBreakdown).map(([key, value]) => (
                            <div key={key} style={styles.breakdownItem}>
                              <span style={styles.breakdownLabel}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span style={styles.breakdownValue}>
                                {(value * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {risk.recommendations && (
                      <div style={styles.detailSection}>
                        <div style={styles.detailLabel}>{t('risk.selection.recommendations')}</div>
                        <ul style={styles.recommendationsList}>
                          {risk.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} style={styles.recommendationItem}>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            opacity: selectedRiskIds.length === 0 ? 0.5 : 1,
            cursor: selectedRiskIds.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onClick={onClearSelection}
          disabled={selectedRiskIds.length === 0 || loading}
        >
          <X size={16} style={{ marginRight: '8px' }} />
          {t('risk.selection.cancelSelection')}
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            opacity: selectedRiskIds.length === 0 ? 0.5 : 1,
            cursor: selectedRiskIds.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onClick={handleAccept}
          disabled={selectedRiskIds.length === 0 || loading}
        >
          <Check size={16} style={{ marginRight: '8px' }} />
          {loading ? t('risk.selection.accepting') : t('risk.selection.acceptRisks', { count: selectedRiskIds.length })}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    padding: '24px',
    marginBottom: '24px'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  errorBanner: {
    background: '#FEE2E2',
    border: '1px solid #FECACA',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  sliderSection: {
    marginBottom: '24px',
    background: '#F9FAFB',
    padding: '16px',
    borderRadius: '8px'
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  sliderLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111'
  },
  sliderValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667EEA'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#E5E7EB',
    outline: 'none',
    WebkitAppearance: 'none',
    marginBottom: '12px',
    cursor: 'pointer'
  },
  sliderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6B7280'
  },
  sliderHint: {
    fontSize: '12px',
    color: '#6B7280'
  },
  selectionControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '12px',
    background: '#F0F4FF',
    borderRadius: '8px'
  },
  selectionInfo: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667EEA'
  },
  selectionCount: {
    fontSize: '14px',
    color: '#667EEA'
  },
  selectionButtons: {
    display: 'flex',
    gap: '8px'
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6B7280'
  },
  emptyStateHint: {
    fontSize: '12px',
    marginTop: '8px'
  },
  riskCard: {
    border: '2px solid',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s ease'
  },
  riskHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  riskCheckbox: {
    display: 'flex',
    alignItems: 'center'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  riskInfo: {
    flex: 1
  },
  riskTitle: {
    fontWeight: '600',
    color: '#111',
    fontSize: '14px'
  },
  riskMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  probability: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#667EEA',
    minWidth: '45px',
    textAlign: 'right'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center'
  },
  riskDetails: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailSection: {
    fontSize: '12px'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#111',
    marginBottom: '6px'
  },
  detailValue: {
    color: '#6B7280',
    lineHeight: '1.5'
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  caseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 8px',
    background: '#F3F4F6',
    borderRadius: '4px',
    fontSize: '12px'
  },
  caseName: {
    color: '#111'
  },
  caseSimilarity: {
    fontWeight: '600',
    color: '#667EEA'
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 8px',
    background: '#F3F4F6',
    borderRadius: '4px',
    fontSize: '12px'
  },
  breakdownLabel: {
    color: '#6B7280'
  },
  breakdownValue: {
    fontWeight: '600',
    color: '#667EEA'
  },
  recommendationsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#6B7280'
  },
  recommendationItem: {
    marginBottom: '4px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  },
  buttonPrimary: {
    background: '#667EEA',
    color: 'white'
  },
  buttonSecondary: {
    background: '#E5E7EB',
    color: '#111'
  }
};

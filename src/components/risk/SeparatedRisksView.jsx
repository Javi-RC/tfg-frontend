import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, AlertTriangle, Info } from 'lucide-react';
import EnhancedRiskCard from './EnhancedRiskCard';

/**
 * Separated Risks View Component
 * Displays CBR risks and Expert Rules risks in separate sections
 */
export default function SeparatedRisksView({ 
  cbrRisks = [], 
  dtRisks = [], 
  allRisks = [],
  metadata
}) {
  const { t } = useTranslation();
  const [expandedRisks, setExpandedRisks] = useState(new Set());

  const toggleRisk = (riskId) => {
    setExpandedRisks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(riskId)) {
        newSet.delete(riskId);
      } else {
        newSet.add(riskId);
      }
      return newSet;
    });
  };

  const normalizeSource = (source) => (typeof source === 'string' ? source.toLowerCase() : '');

  const inferSource = (risk) => {
    const src = normalizeSource(risk?.source);
    if (src) return src;

    // Heuristics for legacy/partial payloads
    if (risk?.basedOnCases?.length || risk?.similarityBreakdown || typeof risk?.similarity === 'number') {
      return 'cbr';
    }
    if (risk?.indicators?.length) {
      return 'expert_rules';
    }

    return '';
  };

  const isCbrRisk = (risk) => inferSource(risk) === 'cbr';
  const isExpertRisk = (risk) => {
    const src = inferSource(risk);
    return src === 'expert_rules' || src === 'decision_tree' || src === 'expert_rules_early_warning';
  };

  // Prefer splitting from allRisks (already filtered by UI), to avoid misclassification
  // when backend or upstream logic accidentally places an expert risk inside the CBR list.
  const baseRisks = allRisks.length > 0 ? allRisks : [...cbrRisks, ...dtRisks];

  const cbrRisksList = baseRisks.filter(isCbrRisk);
  const dtRisksList = baseRisks.filter(isExpertRisk);

  const hasCbrRisks = cbrRisksList.length > 0;
  const hasDtRisks = dtRisksList.length > 0;

  if (!hasCbrRisks && !hasDtRisks) {
    return (
      <div style={styles.emptyState}>
        <Info size={48} color="#667EEA" />
        <h3 style={styles.emptyTitle}>{t('risk.separatedView.noRisksTitle')}</h3>
        <p style={styles.emptyText}>
          {t('risk.separatedView.noRisksDescription')}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* CBR Risks Section */}
      {hasCbrRisks && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <BookOpen size={24} color="#10B981" />
              <h3 style={styles.sectionTitle}>
                {t('risk.separatedView.cbrTitle')}
              </h3>
              <span style={{
                ...styles.countBadge,
                backgroundColor: '#D1FAE5',
                color: '#065F46'
              }}>
                {cbrRisksList.length}
              </span>
            </div>
            <p style={styles.sectionDescription}>
              {t('risk.separatedView.cbrDescription')}
            </p>
          </div>

          <div style={styles.risksList}>
            {cbrRisksList.map((risk, idx) => {
              const riskId = risk.id || `cbr-${idx}`;
              return (
                <EnhancedRiskCard
                  key={riskId}
                  risk={risk}
                  isExpanded={expandedRisks.has(riskId)}
                  onToggle={() => toggleRisk(riskId)}
                  metadata={metadata}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* DT/Expert Rules Section */}
      {hasDtRisks && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <AlertTriangle size={24} color="#667EEA" />
              <h3 style={styles.sectionTitle}>
                {t('risk.separatedView.expertRulesTitle')}
              </h3>
              <span style={{
                ...styles.countBadge,
                backgroundColor: '#E0E7FF',
                color: '#4338CA'
              }}>
                {dtRisksList.length}
              </span>
            </div>
            <p style={styles.sectionDescription}>
              {t('risk.separatedView.expertRulesDescription')}
            </p>
          </div>

          <div style={styles.risksList}>
            {dtRisksList
              .sort((a, b) => {
                // Sort by severity
                const severityOrder = { critical: 0, high: 1, 'medium-high': 2, medium: 3, low: 4, emerging: 5 };
                const severityA = severityOrder[a.severity] ?? 3;
                const severityB = severityOrder[b.severity] ?? 3;
                return severityA - severityB;
              })
              .map((risk, idx) => {
                const riskId = risk.id || `dt-${idx}`;
                return (
                  <EnhancedRiskCard
                    key={riskId}
                    risk={risk}
                    isExpanded={expandedRisks.has(riskId)}
                    onToggle={() => toggleRisk(riskId)}
                    metadata={metadata}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div style={styles.infoFooter}>
        <div style={styles.infoItem}>
          <BookOpen size={16} color="#10B981" />
          <span style={styles.infoText}>
            <strong>{t('risk.separatedView.cbrFooterLabel')}</strong> {t('risk.separatedView.cbrFooterDescription')}
          </span>
        </div>
        <div style={styles.infoItem}>
          <AlertTriangle size={16} color="#667EEA" />
          <span style={styles.infoText}>
            <strong>{t('risk.separatedView.expertRulesFooterLabel')}</strong> {t('risk.separatedView.expertRulesFooterDescription')}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '16px 0 8px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    maxWidth: '400px',
    lineHeight: '1.6'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionHeader: {
    paddingBottom: '16px',
    borderBottom: '2px solid #E5E7EB'
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    flex: 1
  },
  countBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: '0 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '700',
    border: '2px solid currentColor'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6',
    margin: 0
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  infoText: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: '1.6'
  }
};

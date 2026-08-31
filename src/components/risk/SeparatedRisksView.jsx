import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, AlertTriangle, Info } from 'lucide-react';
import EnhancedRiskCard from './EnhancedRiskCard';
import { partitionRisksBySource } from '../../utils/riskSource';
import { compareBySeverity } from '../../utils/riskSeverity';

/**
 * Separated Risks View Component
 * Displays CBR risks and Expert Rules risks in separate sections
 *
 * Engine classification lives in utils/riskSource and severity ordering in
 * utils/riskSeverity; both used to be inline tables here that had drifted from
 * the enums in types/riskTypes.js.
 */
export default function SeparatedRisksView({
  cbrRisks = [],
  dtRisks = [],
  allRisks = [],
  metadata,
}) {
  const { t } = useTranslation();
  const [expandedRisks, setExpandedRisks] = useState(new Set());

  const toggleRisk = (riskId) => {
    setExpandedRisks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(riskId)) {
        newSet.delete(riskId);
      } else {
        newSet.add(riskId);
      }
      return newSet;
    });
  };

  // Prefer splitting from allRisks (already filtered by UI), to avoid misclassification
  // when backend or upstream logic accidentally places an expert risk inside the CBR list.
  const baseRisks = allRisks.length > 0 ? allRisks : [...cbrRisks, ...dtRisks];

  const { cbr: cbrRisksList, expertRules: dtRisksList } = partitionRisksBySource(baseRisks);

  const hasCbrRisks = cbrRisksList.length > 0;
  const hasDtRisks = dtRisksList.length > 0;

  if (!hasCbrRisks && !hasDtRisks) {
    return (
      <div style={styles.emptyState}>
        <Info size={48} color="#667EEA" />
        <h3 style={styles.emptyTitle}>{t('risk.separatedView.noRisksTitle')}</h3>
        <p style={styles.emptyText}>{t('risk.separatedView.noRisksDescription')}</p>
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
              <h3 style={styles.sectionTitle}>{t('risk.separatedView.cbrTitle')}</h3>
              <span
                style={{
                  ...styles.countBadge,
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success-dark)',
                }}
              >
                {cbrRisksList.length}
              </span>
            </div>
            <p style={styles.sectionDescription}>{t('risk.separatedView.cbrDescription')}</p>
          </div>

          <div style={styles.risksList}>
            {cbrRisksList.map((risk) => {
              const riskId = risk.id;
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
              <h3 style={styles.sectionTitle}>{t('risk.separatedView.expertRulesTitle')}</h3>
              <span
                style={{
                  ...styles.countBadge,
                  backgroundColor: '#E0E7FF',
                  color: '#4338CA',
                }}
              >
                {dtRisksList.length}
              </span>
            </div>
            <p style={styles.sectionDescription}>
              {t('risk.separatedView.expertRulesDescription')}
            </p>
          </div>

          <div style={styles.risksList}>
            {/* toSorted, not sort: the latter would mutate the caller's array. */}
            {dtRisksList
              .toSorted(compareBySeverity)
              .map((risk) => {
                const riskId = risk.id;
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
        <Info size={16} color="#667EEA" />
        <span style={styles.infoText}>{t('risk.separatedView.footerDescription')}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    margin: '16px 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: 0,
    maxWidth: '400px',
    lineHeight: '1.6',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    paddingBottom: '16px',
    borderBottom: '2px solid var(--color-border)',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    flex: 1,
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
    border: '2px solid currentColor',
  },
  sectionDescription: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
    margin: 0,
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  infoText: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },
};

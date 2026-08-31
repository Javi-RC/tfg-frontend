import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, RotateCcw } from 'lucide-react';
import DTPreview from './DTPreview';
import DTResultEditor from './DTResultEditor';

/**
 * Expert Rules Configuration Form
 * Controls 29 expert rules risk thresholds
 * Backend structure: { riskThresholds: {...}, personalityRiskThresholds: {...} }
 */
const EMPTY_ERRORS = {};

export default function DecisionTreeConfigForm({ config, onChange, onReset, errors = EMPTY_ERRORS }) {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    skillGap: true,
    communication: false,
    teamOverload: false,
    scopeCreep: false,
    dependency: false,
    knowledgeManagement: false,
    processMaturity: false,
    culturalTimezone: false,
    personality: false,
  });

  const riskThresholds = config?.riskThresholds || {};
  const personalityRiskThresholds = config?.personalityRiskThresholds || {};

  const handleRiskThresholdChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    onChange({
      ...config,
      riskThresholds: {
        ...riskThresholds,
        [field]: parsed,
      },
    });
  };

  const handlePersonalityThresholdChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    onChange({
      ...config,
      personalityRiskThresholds: {
        ...personalityRiskThresholds,
        [field]: parsed,
      },
    });
  };

  const handleReset = () => {
    if (onReset) onReset();
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <GitBranch size={20} color="#10B981" />
        <h3 style={styles.title}>{t('teamConfig.decisionTree.title')}</h3>
        <button
          type="button"
          onClick={handleReset}
          style={styles.resetButton}
          title={t('teamConfig.reset.button')}
        >
          <RotateCcw size={16} />
          {t('teamConfig.reset.button')}
        </button>
      </div>

      <p style={styles.description}>{t('teamConfig.decisionTree.description')}</p>

      <DTPreview
        riskThresholds={riskThresholds}
        personalityRiskThresholds={personalityRiskThresholds}
        errors={errors}
        onRiskThresholdChange={handleRiskThresholdChange}
        onPersonalityThresholdChange={handlePersonalityThresholdChange}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
      />

      <DTResultEditor />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
    flex: 1,
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'var(--color-bg-subtle)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-strong)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
};

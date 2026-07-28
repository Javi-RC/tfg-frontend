import React from 'react';
import DTPreviewTier1 from './DTPreviewTier1';
import DTPreviewTier2 from './DTPreviewTier2';
import DTPreviewTier3 from './DTPreviewTier3';

export default function DTPreview({
  riskThresholds,
  personalityRiskThresholds,
  errors,
  onRiskThresholdChange,
  onPersonalityThresholdChange,
  expandedSections,
  onToggleSection,
}) {
  return (
    <div style={styles.formGroup}>
      <DTPreviewTier1
        riskThresholds={riskThresholds}
        errors={errors}
        onRiskThresholdChange={onRiskThresholdChange}
        expandedSections={expandedSections}
        onToggleSection={onToggleSection}
      />

      <DTPreviewTier2
        riskThresholds={riskThresholds}
        errors={errors}
        onRiskThresholdChange={onRiskThresholdChange}
        expandedSections={expandedSections}
        onToggleSection={onToggleSection}
      />

      <DTPreviewTier3
        personalityRiskThresholds={personalityRiskThresholds}
        errors={errors}
        onPersonalityThresholdChange={onPersonalityThresholdChange}
        expandedSections={expandedSections}
        onToggleSection={onToggleSection}
      />
    </div>
  );
}

const styles = {
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
};

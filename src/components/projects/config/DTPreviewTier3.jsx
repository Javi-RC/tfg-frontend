import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';
import { CollapsibleSection, NumberSlider } from './DTConditionEditor';

export default function DTPreviewTier3({
  personalityRiskThresholds,
  errors,
  onPersonalityThresholdChange,
  expandedSections,
  onToggleSection,
}) {
  const { t } = useTranslation();

  return (
    <>
      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.personality')}
        isExpanded={expandedSections.personality}
        onToggle={() => onToggleSection('personality')}
        tier={3}
        icon={Brain}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.agreeablenessLow')}
          value={personalityRiskThresholds.agreeablenessLow}
          onChange={(val) => onPersonalityThresholdChange('agreeablenessLow', val)}
          error={errors.agreeablenessLow}
          min={1}
          max={5}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.agreeablenessLow')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.agreeablenessVarianceHigh')}
          value={personalityRiskThresholds.agreeablenessVarianceHigh}
          onChange={(val) => onPersonalityThresholdChange('agreeablenessVarianceHigh', val)}
          error={errors.agreeablenessVarianceHigh}
          min={0}
          max={5}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.agreeablenessVarianceHigh')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.neuroticismHigh')}
          value={personalityRiskThresholds.neuroticismHigh}
          onChange={(val) => onPersonalityThresholdChange('neuroticismHigh', val)}
          error={errors.neuroticismHigh}
          min={1}
          max={5}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.neuroticismHigh')}
        />
      </CollapsibleSection>
    </>
  );
}

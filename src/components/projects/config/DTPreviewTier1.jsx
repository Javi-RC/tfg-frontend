import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { CollapsibleSection, WeightSlider, NumberSlider } from './DTConditionEditor';

export default function DTPreviewTier1({
  riskThresholds,
  errors,
  onRiskThresholdChange,
  expandedSections,
  onToggleSection,
}) {
  const { t } = useTranslation();

  return (
    <>
      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.skillGap')}
        isExpanded={expandedSections.skillGap}
        onToggle={() => onToggleSection('skillGap')}
        tier={1}
        icon={Target}
      >
        <WeightSlider
          label={t('teamConfig.decisionTree.skillGapCritical')}
          value={riskThresholds.skillGapCritical}
          onChange={(val) => onRiskThresholdChange('skillGapCritical', val)}
          error={errors.skillGapCritical}
          hint={t('teamConfig.decisionTree.hints.skillGapCritical')}
        />

        <WeightSlider
          label={t('teamConfig.decisionTree.skillGapMajor')}
          value={riskThresholds.skillGapMajor}
          onChange={(val) => onRiskThresholdChange('skillGapMajor', val)}
          error={errors.skillGapMajor}
          hint={t('teamConfig.decisionTree.hints.skillGapMajor')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minTechnologiesThreshold')}
          value={riskThresholds.minTechnologiesThreshold}
          onChange={(val) => onRiskThresholdChange('minTechnologiesThreshold', val)}
          error={errors.minTechnologiesThreshold}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.minTechnologiesThreshold')}
        />

        <WeightSlider
          label={t('teamConfig.decisionTree.maxJuniorRatio')}
          value={riskThresholds.maxJuniorRatio}
          onChange={(val) => onRiskThresholdChange('maxJuniorRatio', val)}
          error={errors.maxJuniorRatio}
          hint={t('teamConfig.decisionTree.hints.maxJuniorRatio')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minProficiencyThreshold')}
          value={riskThresholds.minProficiencyThreshold}
          onChange={(val) => onRiskThresholdChange('minProficiencyThreshold', val)}
          error={errors.minProficiencyThreshold}
          min={1.0}
          max={5.0}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.minProficiencyThreshold')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.communication')}
        isExpanded={expandedSections.communication}
        onToggle={() => onToggleSection('communication')}
        tier={1}
        icon={MessageSquare}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.minTimeOverlapHours')}
          value={riskThresholds.minTimeOverlapHours}
          onChange={(val) => onRiskThresholdChange('minTimeOverlapHours', val)}
          error={errors.minTimeOverlapHours}
          min={0}
          max={8}
          step={0.5}
          formatDisplay={(val) => `${val}h`}
          hint={t('teamConfig.decisionTree.hints.minTimeOverlapHours')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.normalOverlapHours')}
          value={riskThresholds.normalOverlapHours}
          onChange={(val) => onRiskThresholdChange('normalOverlapHours', val)}
          error={errors.normalOverlapHours}
          min={2}
          max={8}
          step={0.5}
          formatDisplay={(val) => `${val}h`}
          hint={t('teamConfig.decisionTree.hints.normalOverlapHours')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.teamOverload')}
        isExpanded={expandedSections.teamOverload}
        onToggle={() => onToggleSection('teamOverload')}
        tier={1}
        icon={Users}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.overloadCritical')}
          value={riskThresholds.overloadCritical}
          onChange={(val) => onRiskThresholdChange('overloadCritical', val)}
          error={errors.overloadCritical}
          min={40}
          max={100}
          step={5}
          formatDisplay={(val) => `${val}h/week`}
          hint={t('teamConfig.decisionTree.hints.overloadCritical')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.overloadHigh')}
          value={riskThresholds.overloadHigh}
          onChange={(val) => onRiskThresholdChange('overloadHigh', val)}
          error={errors.overloadHigh}
          min={40}
          max={100}
          step={5}
          formatDisplay={(val) => `${val}h/week`}
          hint={t('teamConfig.decisionTree.hints.overloadHigh')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.overloadAverageHours')}
          value={riskThresholds.overloadAverageHours}
          onChange={(val) => onRiskThresholdChange('overloadAverageHours', val)}
          error={errors.overloadAverageHours}
          min={30}
          max={100}
          step={5}
          formatDisplay={(val) => `${val}h/week`}
          hint={t('teamConfig.decisionTree.hints.overloadAverageHours')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.maxConcurrentProjectsThreshold')}
          value={riskThresholds.maxConcurrentProjectsThreshold}
          onChange={(val) => onRiskThresholdChange('maxConcurrentProjectsThreshold', val)}
          error={errors.maxConcurrentProjectsThreshold}
          min={1}
          max={10}
          step={1}
          hint={t('teamConfig.decisionTree.hints.maxConcurrentProjectsThreshold')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.scopeCreep')}
        isExpanded={expandedSections.scopeCreep}
        onToggle={() => onToggleSection('scopeCreep')}
        tier={1}
        icon={TrendingUp}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.minDescriptionLength')}
          value={riskThresholds.minDescriptionLength}
          onChange={(val) => onRiskThresholdChange('minDescriptionLength', val)}
          error={errors.minDescriptionLength}
          min={100}
          max={5000}
          step={100}
          formatDisplay={(val) => `${val} chars`}
          hint={t('teamConfig.decisionTree.hints.minDescriptionLength')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minKeyRoles')}
          value={riskThresholds.minKeyRoles}
          onChange={(val) => onRiskThresholdChange('minKeyRoles', val)}
          error={errors.minKeyRoles}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.minKeyRoles')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.clientTimeOverlapHours')}
          value={riskThresholds.clientTimeOverlapHours}
          onChange={(val) => onRiskThresholdChange('clientTimeOverlapHours', val)}
          error={errors.clientTimeOverlapHours}
          min={0}
          max={8}
          step={0.5}
          formatDisplay={(val) => `${val}h/day`}
          hint={t('teamConfig.decisionTree.hints.clientTimeOverlapHours')}
        />
      </CollapsibleSection>
    </>
  );
}

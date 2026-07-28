import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, BookOpen, Activity, Globe } from 'lucide-react';
import { CollapsibleSection, NumberSlider } from './DTConditionEditor';

export default function DTPreviewTier2({
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
        title={t('teamConfig.decisionTree.sections.dependency')}
        isExpanded={expandedSections.dependency}
        onToggle={() => onToggleSection('dependency')}
        tier={2}
        icon={Link2}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.minCriticalDependencies')}
          value={riskThresholds.minCriticalDependencies}
          onChange={(val) => onRiskThresholdChange('minCriticalDependencies', val)}
          error={errors.minCriticalDependencies}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.minCriticalDependencies')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minInvolvedTeams')}
          value={riskThresholds.minInvolvedTeams}
          onChange={(val) => onRiskThresholdChange('minInvolvedTeams', val)}
          error={errors.minInvolvedTeams}
          min={1}
          max={10}
          step={1}
          hint={t('teamConfig.decisionTree.hints.minInvolvedTeams')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.timelineBufferPercentage')}
          value={riskThresholds.timelineBufferPercentage}
          onChange={(val) => onRiskThresholdChange('timelineBufferPercentage', val)}
          error={errors.timelineBufferPercentage}
          min={0}
          max={100}
          step={5}
          formatDisplay={(val) => `${val}%`}
          hint={t('teamConfig.decisionTree.hints.timelineBufferPercentage')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.knowledgeManagement')}
        isExpanded={expandedSections.knowledgeManagement}
        onToggle={() => onToggleSection('knowledgeManagement')}
        tier={2}
        icon={BookOpen}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.maxTeamSizeForKM')}
          value={riskThresholds.maxTeamSizeForKM}
          onChange={(val) => onRiskThresholdChange('maxTeamSizeForKM', val)}
          error={errors.maxTeamSizeForKM}
          min={2}
          max={50}
          step={1}
          hint={t('teamConfig.decisionTree.hints.maxTeamSizeForKM')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.kmRiskScoreHigh')}
          value={riskThresholds.kmRiskScoreHigh}
          onChange={(val) => onRiskThresholdChange('kmRiskScoreHigh', val)}
          error={errors.kmRiskScoreHigh}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.kmRiskScoreHigh')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.processMaturity')}
        isExpanded={expandedSections.processMaturity}
        onToggle={() => onToggleSection('processMaturity')}
        tier={2}
        icon={Activity}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.maturityScoreLow')}
          value={riskThresholds.maturityScoreLow}
          onChange={(val) => onRiskThresholdChange('maturityScoreLow', val)}
          error={errors.maturityScoreLow}
          min={0}
          max={10}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.maturityScoreLow')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.maturityScoreMedium')}
          value={riskThresholds.maturityScoreMedium}
          onChange={(val) => onRiskThresholdChange('maturityScoreMedium', val)}
          error={errors.maturityScoreMedium}
          min={0}
          max={10}
          step={0.1}
          formatDisplay={(val) => val.toFixed(1)}
          hint={t('teamConfig.decisionTree.hints.maturityScoreMedium')}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('teamConfig.decisionTree.sections.culturalTimezone')}
        isExpanded={expandedSections.culturalTimezone}
        onToggle={() => onToggleSection('culturalTimezone')}
        tier={2}
        icon={Globe}
      >
        <NumberSlider
          label={t('teamConfig.decisionTree.highCulturalDiversityThreshold')}
          value={riskThresholds.highCulturalDiversityThreshold}
          onChange={(val) => onRiskThresholdChange('highCulturalDiversityThreshold', val)}
          error={errors.highCulturalDiversityThreshold}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.highCulturalDiversityThreshold')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minTimezonesForRisk')}
          value={riskThresholds.minTimezonesForRisk}
          onChange={(val) => onRiskThresholdChange('minTimezonesForRisk', val)}
          error={errors.minTimezonesForRisk}
          min={1}
          max={20}
          step={1}
          hint={t('teamConfig.decisionTree.hints.minTimezonesForRisk')}
        />

        <NumberSlider
          label={t('teamConfig.decisionTree.minTimeOverlapHoursThreshold')}
          value={riskThresholds.minTimeOverlapHoursThreshold}
          onChange={(val) => onRiskThresholdChange('minTimeOverlapHoursThreshold', val)}
          error={errors.minTimeOverlapHoursThreshold}
          min={0}
          max={12}
          step={0.5}
          formatDisplay={(val) => `${val}h`}
          hint={t('teamConfig.decisionTree.hints.minTimeOverlapHoursThreshold')}
        />
      </CollapsibleSection>
    </>
  );
}

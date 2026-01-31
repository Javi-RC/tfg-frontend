import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GitBranch, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Target,
  MessageSquare,
  Users,
  TrendingUp,
  Link2,
  BookOpen,
  Activity,
  Globe,
  Brain
} from 'lucide-react';
import { getDefaultConfig } from '../../../utils/decisionTreeValidation';

/**
 * Expert Rules Configuration Form
 * Controls 29 expert rules risk thresholds
 * Backend structure: { riskThresholds: {...}, personalityRiskThresholds: {...} }
 */
export default function DecisionTreeConfigForm({ config, onChange, errors = {} }) {
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
    personality: false
  });

  // Normalize config with defaults from centralized configuration
  const defaults = getDefaultConfig();
  const riskThresholds = { ...defaults.riskThresholds, ...(config?.riskThresholds || {}) };
  const personalityRiskThresholds = { ...defaults.personalityRiskThresholds, ...(config?.personalityRiskThresholds || {}) };

  const handleRiskThresholdChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    onChange({
      ...config,
      riskThresholds: {
        ...riskThresholds,
        [field]: parsed
      }
    });
  };

  const handlePersonalityThresholdChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    onChange({
      ...config,
      personalityRiskThresholds: {
        ...personalityRiskThresholds,
        [field]: parsed
      }
    });
  };

  const handleReset = () => {
    const defaults = getDefaultConfig();
    onChange(defaults);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
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
      
      <p style={styles.description}>
        {t('teamConfig.decisionTree.description')}
      </p>

      <div style={styles.formGroup}>
        {/* Skill Gap Thresholds (5) - TIER 1 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.skillGap')}
          isExpanded={expandedSections.skillGap}
          onToggle={() => toggleSection('skillGap')}
          tier={1}
          icon={Target}
        >
          <WeightSlider
            label={t('teamConfig.decisionTree.skillGapCritical')}
            value={riskThresholds.skillGapCritical}
            onChange={(val) => handleRiskThresholdChange('skillGapCritical', val)}
            error={errors.skillGapCritical}
            hint={t('teamConfig.decisionTree.hints.skillGapCritical')}
          />
          
          <WeightSlider
            label={t('teamConfig.decisionTree.skillGapMajor')}
            value={riskThresholds.skillGapMajor}
            onChange={(val) => handleRiskThresholdChange('skillGapMajor', val)}
            error={errors.skillGapMajor}
            hint={t('teamConfig.decisionTree.hints.skillGapMajor')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.minTechnologiesThreshold')}
            value={riskThresholds.minTechnologiesThreshold}
            onChange={(val) => handleRiskThresholdChange('minTechnologiesThreshold', val)}
            error={errors.minTechnologiesThreshold}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.minTechnologiesThreshold')}
          />
          
          <WeightSlider
            label={t('teamConfig.decisionTree.maxJuniorRatio')}
            value={riskThresholds.maxJuniorRatio}
            onChange={(val) => handleRiskThresholdChange('maxJuniorRatio', val)}
            error={errors.maxJuniorRatio}
            hint={t('teamConfig.decisionTree.hints.maxJuniorRatio')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.minProficiencyThreshold')}
            value={riskThresholds.minProficiencyThreshold}
            onChange={(val) => handleRiskThresholdChange('minProficiencyThreshold', val)}
            error={errors.minProficiencyThreshold}
            min={1.0}
            max={5.0}
            step={0.1}
            formatDisplay={(val) => val.toFixed(1)}
            hint={t('teamConfig.decisionTree.hints.minProficiencyThreshold')}
          />
        </CollapsibleSection>

        {/* Communication Thresholds (2) - TIER 1 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.communication')}
          isExpanded={expandedSections.communication}
          onToggle={() => toggleSection('communication')}
          tier={1}
          icon={MessageSquare}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.minTimeOverlapHours')}
            value={riskThresholds.minTimeOverlapHours}
            onChange={(val) => handleRiskThresholdChange('minTimeOverlapHours', val)}
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
            onChange={(val) => handleRiskThresholdChange('normalOverlapHours', val)}
            error={errors.normalOverlapHours}
            min={2}
            max={8}
            step={0.5}
            formatDisplay={(val) => `${val}h`}
            hint={t('teamConfig.decisionTree.hints.normalOverlapHours')}
          />
        </CollapsibleSection>

        {/* Team Overload Thresholds (4) - TIER 1 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.teamOverload')}
          isExpanded={expandedSections.teamOverload}
          onToggle={() => toggleSection('teamOverload')}
          tier={1}
          icon={Users}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.overloadCritical')}
            value={riskThresholds.overloadCritical}
            onChange={(val) => handleRiskThresholdChange('overloadCritical', val)}
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
            onChange={(val) => handleRiskThresholdChange('overloadHigh', val)}
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
            onChange={(val) => handleRiskThresholdChange('overloadAverageHours', val)}
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
            onChange={(val) => handleRiskThresholdChange('maxConcurrentProjectsThreshold', val)}
            error={errors.maxConcurrentProjectsThreshold}
            min={1}
            max={10}
            step={1}
            hint={t('teamConfig.decisionTree.hints.maxConcurrentProjectsThreshold')}
          />
        </CollapsibleSection>

        {/* Scope Creep Thresholds (3) - TIER 1 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.scopeCreep')}
          isExpanded={expandedSections.scopeCreep}
          onToggle={() => toggleSection('scopeCreep')}
          tier={1}
          icon={TrendingUp}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.minDescriptionLength')}
            value={riskThresholds.minDescriptionLength}
            onChange={(val) => handleRiskThresholdChange('minDescriptionLength', val)}
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
            onChange={(val) => handleRiskThresholdChange('minKeyRoles', val)}
            error={errors.minKeyRoles}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.minKeyRoles')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.clientTimeOverlapHours')}
            value={riskThresholds.clientTimeOverlapHours}
            onChange={(val) => handleRiskThresholdChange('clientTimeOverlapHours', val)}
            error={errors.clientTimeOverlapHours}
            min={0}
            max={8}
            step={0.5}
            formatDisplay={(val) => `${val}h/day`}
            hint={t('teamConfig.decisionTree.hints.clientTimeOverlapHours')}
          />
        </CollapsibleSection>

        {/* Dependency Thresholds (3) - TIER 2 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.dependency')}
          isExpanded={expandedSections.dependency}
          onToggle={() => toggleSection('dependency')}
          tier={2}
          icon={Link2}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.minCriticalDependencies')}
            value={riskThresholds.minCriticalDependencies}
            onChange={(val) => handleRiskThresholdChange('minCriticalDependencies', val)}
            error={errors.minCriticalDependencies}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.minCriticalDependencies')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.minInvolvedTeams')}
            value={riskThresholds.minInvolvedTeams}
            onChange={(val) => handleRiskThresholdChange('minInvolvedTeams', val)}
            error={errors.minInvolvedTeams}
            min={1}
            max={10}
            step={1}
            hint={t('teamConfig.decisionTree.hints.minInvolvedTeams')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.timelineBufferPercentage')}
            value={riskThresholds.timelineBufferPercentage}
            onChange={(val) => handleRiskThresholdChange('timelineBufferPercentage', val)}
            error={errors.timelineBufferPercentage}
            min={0}
            max={100}
            step={5}
            formatDisplay={(val) => `${val}%`}
            hint={t('teamConfig.decisionTree.hints.timelineBufferPercentage')}
          />
        </CollapsibleSection>

        {/* Knowledge Management Thresholds (2) - TIER 2 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.knowledgeManagement')}
          isExpanded={expandedSections.knowledgeManagement}
          onToggle={() => toggleSection('knowledgeManagement')}
          tier={2}
          icon={BookOpen}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.maxTeamSizeForKM')}
            value={riskThresholds.maxTeamSizeForKM}
            onChange={(val) => handleRiskThresholdChange('maxTeamSizeForKM', val)}
            error={errors.maxTeamSizeForKM}
            min={2}
            max={50}
            step={1}
            hint={t('teamConfig.decisionTree.hints.maxTeamSizeForKM')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.kmRiskScoreHigh')}
            value={riskThresholds.kmRiskScoreHigh}
            onChange={(val) => handleRiskThresholdChange('kmRiskScoreHigh', val)}
            error={errors.kmRiskScoreHigh}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.kmRiskScoreHigh')}
          />
        </CollapsibleSection>

        {/* Process Maturity Thresholds (2) - TIER 2 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.processMaturity')}
          isExpanded={expandedSections.processMaturity}
          onToggle={() => toggleSection('processMaturity')}
          tier={2}
          icon={Activity}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.maturityScoreLow')}
            value={riskThresholds.maturityScoreLow}
            onChange={(val) => handleRiskThresholdChange('maturityScoreLow', val)}
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
            onChange={(val) => handleRiskThresholdChange('maturityScoreMedium', val)}
            error={errors.maturityScoreMedium}
            min={0}
            max={10}
            step={0.1}
            formatDisplay={(val) => val.toFixed(1)}
            hint={t('teamConfig.decisionTree.hints.maturityScoreMedium')}
          />
        </CollapsibleSection>

        {/* Cultural/Timezone Thresholds (3) - TIER 2 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.culturalTimezone')}
          isExpanded={expandedSections.culturalTimezone}
          onToggle={() => toggleSection('culturalTimezone')}
          tier={2}
          icon={Globe}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.highCulturalDiversityThreshold')}
            value={riskThresholds.highCulturalDiversityThreshold}
            onChange={(val) => handleRiskThresholdChange('highCulturalDiversityThreshold', val)}
            error={errors.highCulturalDiversityThreshold}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.highCulturalDiversityThreshold')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.minTimezonesForRisk')}
            value={riskThresholds.minTimezonesForRisk}
            onChange={(val) => handleRiskThresholdChange('minTimezonesForRisk', val)}
            error={errors.minTimezonesForRisk}
            min={1}
            max={20}
            step={1}
            hint={t('teamConfig.decisionTree.hints.minTimezonesForRisk')}
          />
          
          <NumberSlider
            label={t('teamConfig.decisionTree.minTimeOverlapHoursThreshold')}
            value={riskThresholds.minTimeOverlapHoursThreshold}
            onChange={(val) => handleRiskThresholdChange('minTimeOverlapHoursThreshold', val)}
            error={errors.minTimeOverlapHoursThreshold}
            min={0}
            max={12}
            step={0.5}
            formatDisplay={(val) => `${val}h`}
            hint={t('teamConfig.decisionTree.hints.minTimeOverlapHoursThreshold')}
          />
        </CollapsibleSection>

        {/* Personality Thresholds (3) - TIER 3 */}
        <CollapsibleSection
          title={t('teamConfig.decisionTree.sections.personality')}
          isExpanded={expandedSections.personality}
          onToggle={() => toggleSection('personality')}
          tier={3}
          icon={Brain}
        >
          <NumberSlider
            label={t('teamConfig.decisionTree.agreeablenessLow')}
            value={personalityRiskThresholds.agreeablenessLow}
            onChange={(val) => handlePersonalityThresholdChange('agreeablenessLow', val)}
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
            onChange={(val) => handlePersonalityThresholdChange('agreeablenessVarianceHigh', val)}
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
            onChange={(val) => handlePersonalityThresholdChange('neuroticismHigh', val)}
            error={errors.neuroticismHigh}
            min={1}
            max={5}
            step={0.1}
            formatDisplay={(val) => val.toFixed(1)}
            hint={t('teamConfig.decisionTree.hints.neuroticismHigh')}
          />
        </CollapsibleSection>
      </div>

      <div style={styles.infoBox}>
        <Lightbulb size={18} color="#065F46" style={styles.infoIcon} />
        <span style={styles.infoText}>{t('teamConfig.decisionTree.info')}</span>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, isExpanded, onToggle, tier, icon: Icon }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader} onClick={onToggle}>
        <div style={styles.sectionTitleRow}>
          {Icon && <Icon size={18} color="#10B981" />}
          <h4 style={styles.sectionTitle}>{title}</h4>
          {tier === 1 && <span style={styles.tierBadge}>TIER 1</span>}
          {tier === 2 && <span style={styles.tierBadge2}>TIER 2</span>}
        </div>
        {isExpanded ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
      </div>
      {isExpanded && (
        <div style={styles.sectionContent}>
          {children}
        </div>
      )}
    </div>
  );
}

function WeightSlider({ label, value, onChange, error, formatDisplay, hint }) {
  const display = formatDisplay ? formatDisplay(value) : `${(value * 100).toFixed(0)}%`;
  
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{display}</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
      
      <div style={styles.sliderLabels}>
        <span>0%</span>
        <span>100%</span>
      </div>
      
      {hint && <p style={styles.hint}>{hint}</p>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

function NumberSlider({ label, value, onChange, error, min, max, step, formatDisplay, hint }) {
  const display = formatDisplay ? formatDisplay(value) : value;
  
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{display}</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
      
      <div style={styles.sliderLabels}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
      
      {hint && <p style={styles.hint}>{hint}</p>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    flex: 1
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: '#F3F4F6',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: 1.5
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827'
  },
  tierBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#92400E',
    backgroundColor: '#FCD34D',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px'
  },
  tierBadge2: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#D1D5DB',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px'
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(0,0,0,0.1)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  valueDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#10B981',
    padding: '2px 8px',
    backgroundColor: '#D1FAE5',
    borderRadius: '4px'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    backgroundColor: '#E5E7EB',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9CA3AF'
  },
  hint: {
    margin: 0,
    fontSize: '12px',
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 1.4
  },
  error: {
    fontSize: '13px',
    color: '#EF4444',
    marginTop: '4px'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ECFDF5',
    border: '1px solid #A7F3D0',
    borderRadius: '8px'
  },
  infoIcon: {
    flex: '0 0 auto',
    marginTop: '2px'
  },
  infoText: {
    fontSize: '13px',
    color: '#065F46',
    lineHeight: 1.5
  }
};

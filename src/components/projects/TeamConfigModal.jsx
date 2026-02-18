import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Target,
  Users,
  Database,
  GitBranch
} from 'lucide-react';
import {
  getTeamConfig,
  updateTeamConfig,
  updatePhase1Config,
  updatePhase2Config,
  updateCBRConfig,
  updateDecisionTreeConfig,
  resetTeamConfig
} from '../../api/projects';
import { predictProjectRisks } from '../../api/riskService';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import Phase1ConfigForm from './config/Phase1ConfigForm';
import Phase2ConfigForm from './config/Phase2ConfigForm';
import CBRConfigForm from './config/CBRConfigForm';
import DecisionTreeConfigForm from './config/DecisionTreeConfigForm';

/**
 * Team Configuration Modal
 * Allows PM to customize team generation algorithm parameters
 */
export default function TeamConfigModal({ projectId, onClose, onSave }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('phase1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationMessage, setValidationMessage] = useState(null);
  
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await getTeamConfig(projectId);
      const data = response.data?.data || response.data;
      
      if (data.config) {
        // Store the complete backend config as-is
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading team config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhase1Change = (newPhase1) => {
    setConfig(prev => ({ ...prev, phase1: newPhase1 }));
    setValidationMessage(null);
  };

  const handlePhase2Change = (newPhase2) => {
    setConfig(prev => ({ ...prev, phase2: newPhase2 }));
    setValidationMessage(null);
  };

  const handleCBRChange = (newCBR) => {
    setConfig(prev => ({ ...prev, cbr: newCBR }));
    setValidationMessage(null);
  };

  const handleDecisionTreeChange = (newDT) => {
    setConfig(prev => ({ ...prev, decisionTree: newDT }));
    setValidationMessage(null);
  };

  // Clean config functions to send only valid fields to backend
  const cleanPhase1Config = (phase1) => {
    return {
      skillsWeight: parseFloat(phase1.skillsWeight) || 0,
      experienceWeight: parseFloat(phase1.experienceWeight) || 0,
      availabilityWeight: parseFloat(phase1.availabilityWeight) || 0,
      availabilityComponents: phase1.availabilityComponents,
      skillMatchPenalty: parseFloat(phase1.skillMatchPenalty) || 0,
      experienceNormalizationFactor: parseFloat(phase1.experienceNormalizationFactor) || 1,
      candidatePoolMultiplier: parseFloat(phase1.candidatePoolMultiplier) || 1
    };
  };

  const cleanPhase2Config = (phase2) => {
    // Backend validates the entire phase2 structure even on PATCH
    console.log('DEBUG cleanPhase2Config input:', phase2);
    console.log('DEBUG synergyWeights:', phase2.synergyWeights);
    console.log('DEBUG previousCollaborationsWeight:', phase2.synergyWeights?.previousCollaborationsWeight);
    
    const cleaned = {
      enabled: phase2.enabled ?? true,
      projectProfiles: phase2.projectProfiles || {},
      synergyWeights: {
        roleDiversityWeight: parseFloat(phase2.synergyWeights?.roleDiversityWeight) || 0,
        projectFitWeight: parseFloat(phase2.synergyWeights?.projectFitWeight) || 0,
        previousCollaborationsWeight: parseFloat(phase2.synergyWeights?.previousCollaborationsWeight) || 0
      }
    };
    
    console.log('DEBUG cleaned synergyWeights:', cleaned.synergyWeights);
    return cleaned;
  };

  const cleanCBRConfig = (cbr) => {
    // Ensure all values are properly typed as numbers
    const dimensionWeights = {};
    if (cbr.dimensionWeights) {
      for (const [key, value] of Object.entries(cbr.dimensionWeights)) {
        dimensionWeights[key] = parseFloat(value) || 0;
      }
    }
    
    return {
      dimensionWeights,
      kSimilarCases: parseInt(cbr.kSimilarCases) || 5,
      minSimilarityThreshold: parseFloat(cbr.minSimilarityThreshold) || 0.3
    };
  };

  const cleanDecisionTreeConfig = (decisionTree) => {
    // Ensure all threshold values are properly typed as numbers
    const riskThresholds = {};
    if (decisionTree.riskThresholds) {
      for (const [key, value] of Object.entries(decisionTree.riskThresholds)) {
        riskThresholds[key] = parseFloat(value) || 0;
      }
    }
    
    const personalityRiskThresholds = {};
    if (decisionTree.personalityRiskThresholds) {
      for (const [key, value] of Object.entries(decisionTree.personalityRiskThresholds)) {
        personalityRiskThresholds[key] = parseFloat(value) || 0;
      }
    }
    
    return {
      riskThresholds,
      personalityRiskThresholds
    };
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      if (!config) {
        setValidationMessage({ type: 'error', text: t('projects.teamConfig.configNotLoaded') });
        setSaving(false);
        return;
      }

      console.log('=== Saving Team Config ===');
      console.log('Active Tab:', activeTab);
      console.log('Original Config:', JSON.stringify(config, null, 2));
      
      // Clean and send only valid fields for each section
      let cleanedData;
      switch (activeTab) {
        case 'phase1':
          cleanedData = cleanPhase1Config(config.phase1);
          console.log('Cleaned Phase1:', JSON.stringify(cleanedData, null, 2));
          await updatePhase1Config(projectId, cleanedData);
          break;
        case 'phase2':
          cleanedData = cleanPhase2Config(config.phase2);
          console.log('Cleaned Phase2:', JSON.stringify(cleanedData, null, 2));
          await updatePhase2Config(projectId, cleanedData);
          break;
        case 'cbr':
          cleanedData = cleanCBRConfig(config.cbr);
          console.log('Cleaned CBR:', JSON.stringify(cleanedData, null, 2));
          await updateCBRConfig(projectId, cleanedData);
          break;
        case 'decisionTree':
          cleanedData = cleanDecisionTreeConfig(config.decisionTree);
          console.log('Cleaned Expert Rules Config:', JSON.stringify(cleanedData, null, 2));
          await updateDecisionTreeConfig(projectId, cleanedData);
          break;
        default:
          // Fallback to full update
          await updateTeamConfig(projectId, config);
      }
      
      // Trigger risk prediction with the new configuration
      console.log('🔄 Triggering risk prediction with updated configuration...');
      try {
        await predictProjectRisks(projectId);
        console.log('✅ Risk prediction completed successfully');
      } catch (riskError) {
        console.warn('⚠️ Risk prediction failed, but config was saved:', riskError);
        // Don't block the save flow if risk prediction fails
      }
      
      if (onSave) {
        onSave(config);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving team config:', error);
      console.error('Response data:', error.response?.data);
      
      // Extract error message from backend
      const backendError = error.response?.data;
      let errorMsg = t('teamConfig.saveError');
      
      if (backendError) {
        if (backendError.error) {
          errorMsg = backendError.error;
        }
        if (backendError.validationErrors && Array.isArray(backendError.validationErrors)) {
          errorMsg = backendError.validationErrors.join(', ');
        }
      }
      
      setValidationMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(t('teamConfig.reset.confirm'))) {
      return;
    }

    try {
      setSaving(true);
      const response = await resetTeamConfig(projectId);
      const data = response.data?.data || response.data;
      
      if (data.config) {
        setConfig(data.config);
        setValidationMessage({ type: 'success', text: t('teamConfig.reset.success') });
      }
    } catch (error) {
      console.error('Error resetting config:', error);
      setValidationMessage({ type: 'error', text: t('teamConfig.reset.error') });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'phase1', label: t('teamConfig.tabs.phase1'), icon: <Target size={16} /> },
    { id: 'phase2', label: t('teamConfig.tabs.phase2'), icon: <Users size={16} /> },
    { id: 'cbr', label: t('teamConfig.tabs.cbr'), icon: <Database size={16} /> },
    { id: 'decisionTree', label: t('teamConfig.tabs.decisionTree'), icon: <GitBranch size={16} /> }
  ];

  if (loading || !config) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p>{t('teamConfig.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{t('teamConfig.title')}</h2>
            <p style={styles.subtitle}>{t('teamConfig.subtitle')}</p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div style={{
            ...styles.validationBanner,
            ...(validationMessage.type === 'success' ? styles.successBanner : styles.errorBanner)
          }}>
            {validationMessage.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{validationMessage.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'phase1' && (
            <Phase1ConfigForm
              config={config.phase1}
              onChange={handlePhase1Change}
              errors={errors.phase1 || {}}
            />
          )}
          
          {activeTab === 'phase2' && (
            <Phase2ConfigForm
              config={config.phase2}
              onChange={handlePhase2Change}
              errors={errors.phase2 || {}}
            />
          )}
          
          {activeTab === 'cbr' && (
            <CBRConfigForm
              config={config.cbr}
              onChange={handleCBRChange}
              errors={errors.cbr || {}}
              projectId={projectId}
            />
          )}
          
          {activeTab === 'decisionTree' && (
            <DecisionTreeConfigForm
              config={config.decisionTree}
              onChange={handleDecisionTreeChange}
              errors={errors.decisionTree || {}}
            />
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <SecondaryButton 
            onClick={handleReset} 
            disabled={saving}
            leftIcon={<RotateCcw size={16} />}
          >
            {t('teamConfig.reset.button')}
          </SecondaryButton>
          
          <div style={styles.footerRight}>
            <SecondaryButton onClick={onClose} disabled={saving}>
              {t('common.cancel')}
            </SecondaryButton>
            
            <PrimaryButton 
              onClick={handleSave} 
              disabled={saving}
              leftIcon={<Save size={16} />}
            >
              {saving ? t('teamConfig.saving') : t('teamConfig.saveButton')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 24px 20px',
    borderBottom: '1px solid #E5E7EB'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#6B7280'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  validationBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500'
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    borderBottom: '1px solid #10B981'
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderBottom: '1px solid #EF4444'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #E5E7EB',
    padding: '0 24px'
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    transition: 'all 0.2s'
  },
  activeTab: {
    color: '#3B82F6',
    borderBottomColor: '#3B82F6'
  },
  tabIcon: {
    fontSize: '18px'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '32px 24px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    gap: '12px'
  },
  footerRight: {
    display: 'flex',
    gap: '12px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

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
  updatePhase2Config,
  resetTeamConfig,
  validateTeamConfig
} from '../../api/projects';
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
  
  const phase2DefaultsPercent = {
    roleDiversityWeight: 25,
    complementarityWeight: 25,
    projectFitWeight: 30,
    conflictRiskWeight: 10,
    balanceWeight: 10
  };

  const [config, setConfig] = useState({
    phase1: {
      skillsWeight: 0.4,
      experienceWeight: 0.3,
      complexityWeight: 0.2,
      availabilityWeight: 0.1
    },
    phase2: {
      enabled: true,
      synergyWeights: { ...phase2DefaultsPercent }
    },
    cbr: {
      k: 3,
      similarityThreshold: 0.7,
      successWeight: 0.8
    },
    decisionTree: {
      minConfidence: 0.6,
      maxDepth: 5,
      useExpertRules: true,
      considerRiskFactors: true
    }
  });

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
        setConfig(prev => ({
          ...prev,
          ...data.config,
          phase2: mapPhase2FromApiToUi(data.config.phase2, phase2DefaultsPercent)
        }));
      }
    } catch (error) {
      console.error('Error loading team config:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapPhase2FromApiToUi = (phase2FromApi, defaultsPercent) => {
    const enabled = phase2FromApi?.enabled ?? true;
    const apiWeights = phase2FromApi?.synergyWeights || {};

    const toPercent = (decimal, fallback) => {
      if (typeof decimal === 'number' && Number.isFinite(decimal)) {
        return Math.round(decimal * 100);
      }
      return fallback;
    };

    return {
      enabled,
      synergyWeights: {
        roleDiversityWeight: toPercent(apiWeights.roleDiversityWeight, defaultsPercent.roleDiversityWeight),
        complementarityWeight: toPercent(apiWeights.complementarityWeight, defaultsPercent.complementarityWeight),
        projectFitWeight: toPercent(apiWeights.projectFitWeight, defaultsPercent.projectFitWeight),
        conflictRiskWeight: toPercent(apiWeights.conflictRiskWeight, defaultsPercent.conflictRiskWeight),
        balanceWeight: toPercent(apiWeights.balanceWeight, defaultsPercent.balanceWeight)
      }
    };
  };

  const mapPhase2FromUiToApi = (phase2FromUi) => {
    const enabled = phase2FromUi?.enabled ?? true;
    const uiWeights = phase2FromUi?.synergyWeights || {};

    const toDecimal = (percent) => {
      const n = typeof percent === 'number' ? percent : parseFloat(percent);
      if (!Number.isFinite(n)) return 0;
      const clamped = Math.max(0, Math.min(100, n));
      return clamped / 100;
    };

    return {
      enabled,
      synergyWeights: {
        roleDiversityWeight: toDecimal(uiWeights.roleDiversityWeight),
        complementarityWeight: toDecimal(uiWeights.complementarityWeight),
        projectFitWeight: toDecimal(uiWeights.projectFitWeight),
        conflictRiskWeight: toDecimal(uiWeights.conflictRiskWeight),
        balanceWeight: toDecimal(uiWeights.balanceWeight)
      }
    };
  };

  const buildBackendConfigFromUiConfig = (uiConfig) => ({
    ...uiConfig,
    phase2: mapPhase2FromUiToApi(uiConfig.phase2)
  });

  const getPhase2TotalPercent = (phase2Ui) => {
    const w = phase2Ui?.synergyWeights || {};
    return (w.roleDiversityWeight || 0) +
      (w.complementarityWeight || 0) +
      (w.projectFitWeight || 0) +
      (w.conflictRiskWeight || 0) +
      (w.balanceWeight || 0);
  };

  const phase2Enabled = config.phase2?.enabled ?? true;
  const phase2Total = getPhase2TotalPercent(config.phase2);
  const isPhase2TotalOk = !phase2Enabled || Math.abs(phase2Total - 100) <= 1;

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

  const validateConfig = async () => {
    try {
      const backendConfig = buildBackendConfigFromUiConfig(config);
      const response = await validateTeamConfig(projectId, backendConfig);
      const data = response.data?.data || response.data;
      
      if (data.valid) {
        setValidationMessage({ type: 'success', text: t('teamConfig.validation.success') });
        setErrors({});
        return true;
      } else {
        setValidationMessage({ 
          type: 'error', 
          text: data.errors?.join(', ') || t('teamConfig.validation.failed') 
        });
        return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      const errorMsg = error.response?.data?.error || t('teamConfig.validation.error');
      setValidationMessage({ type: 'error', text: errorMsg });
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      if (activeTab === 'phase2' && !isPhase2TotalOk) {
        setValidationMessage({ type: 'error', text: t('teamConfig.mustEqual100') });
        setSaving(false);
        return;
      }
      
      // Validate first
      const isValid = await validateConfig();
      if (!isValid) {
        setSaving(false);
        return;
      }

      // Save configuration
      const backendConfig = buildBackendConfigFromUiConfig(config);
      if (activeTab === 'phase2') {
        await updatePhase2Config(projectId, backendConfig.phase2);
      } else {
        await updateTeamConfig(projectId, backendConfig);
      }
      
      if (onSave) {
        onSave(config);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving team config:', error);
      const errorMsg = error.response?.data?.error || t('teamConfig.saveError');
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
        setConfig(prev => ({
          ...prev,
          ...data.config,
          phase2: mapPhase2FromApiToUi(data.config.phase2, phase2DefaultsPercent)
        }));
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

  if (loading) {
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
              disabled={saving || (activeTab === 'phase2' && !isPhase2TotalOk)}
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
    borderBottom: '2px solid transparent',
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { PRESETS } from '../../../utils/decisionTreeValidation';

/**
 * Preset Selector Component
 * Allows users to quickly apply predefined configurations
 */
export default function PresetSelector({ onApplyPreset }) {
  const { t } = useTranslation();

  const handlePresetClick = (presetKey) => {
    onApplyPreset(PRESETS[presetKey]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Sparkles size={18} color="#8B5CF6" />
        <h4 style={styles.title}>{t('teamConfig.decisionTree.presets.title')}</h4>
      </div>
      
      <p style={styles.description}>
        {t('teamConfig.decisionTree.presets.description')}
      </p>

      <div style={styles.presetsGrid}>
        <PresetCard
          title={t('teamConfig.decisionTree.presets.strict.name')}
          description={t('teamConfig.decisionTree.presets.strict.description')}
          color="#EF4444"
          onClick={() => handlePresetClick('strict')}
        />
        
        <PresetCard
          title={t('teamConfig.decisionTree.presets.lenient.name')}
          description={t('teamConfig.decisionTree.presets.lenient.description')}
          color="#10B981"
          onClick={() => handlePresetClick('lenient')}
        />
        
        <PresetCard
          title={t('teamConfig.decisionTree.presets.globalTeam.name')}
          description={t('teamConfig.decisionTree.presets.globalTeam.description')}
          color="#3B82F6"
          onClick={() => handlePresetClick('globalTeam')}
        />
      </div>
    </div>
  );
}

function PresetCard({ title, description, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.presetCard,
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={styles.presetTitle}>{title}</div>
      <div style={styles.presetDescription}>{description}</div>
    </button>
  );
}

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827'
  },
  description: {
    margin: '0 0 16px 0',
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: 1.5
  },
  presetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  presetCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  presetTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px'
  },
  presetDescription: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: 1.4
  }
};

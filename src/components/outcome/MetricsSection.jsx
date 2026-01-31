import React from 'react';
import { Info } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * MetricsSection Component
 * Optional metrics section for detailed project analytics
 */
export default function MetricsSection({ formData, setFormData }) {
  const { t } = useTranslation();
  
  const handleMetricChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...(prev.metrics || {}),
        [field]: value
      }
    }));
  };

  const metrics = formData.metrics || {};

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>📈 {t('outcome.metrics.title')}</h3>
      <p style={styles.sectionDescription}>
        {t('outcome.metrics.description')}
      </p>

      <div style={styles.metricsGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.avgVelocity')}
          </label>
          <input
            type="number"
            min="0"
            value={metrics.avgVelocity || ''}
            onChange={(e) => handleMetricChange('avgVelocity', parseFloat(e.target.value) || 0)}
            style={styles.input}
            placeholder="28"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.bugRate')}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={metrics.bugRate || ''}
            onChange={(e) => handleMetricChange('bugRate', parseFloat(e.target.value) || 0)}
            style={styles.input}
            placeholder="0.08"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.meetingEfficiency')}
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={metrics.meetingEfficiency || ''}
            onChange={(e) => handleMetricChange('meetingEfficiency', parseInt(e.target.value) || 0)}
            style={styles.input}
            placeholder="3"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.deployFrequency')}
          </label>
          <select
            value={metrics.deploymentFrequency || ''}
            onChange={(e) => handleMetricChange('deploymentFrequency', e.target.value)}
            style={styles.select}
          >
            <option value="">{t('outcome.metrics.select')}</option>
            <option value="multiple_per_day">{t('outcome.metrics.multiplePerDay')}</option>
            <option value="daily">{t('outcome.metrics.daily')}</option>
            <option value="weekly">{t('outcome.metrics.weekly')}</option>
            <option value="bi-weekly">{t('outcome.metrics.biweekly')}</option>
            <option value="monthly">{t('outcome.metrics.monthly')}</option>
            <option value="less_than_monthly">{t('outcome.metrics.lessThanMonthly')}</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.codeReviewTime')}
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={metrics.codeReviewTimeAvg || ''}
            onChange={(e) => handleMetricChange('codeReviewTimeAvg', parseFloat(e.target.value) || 0)}
            style={styles.input}
            placeholder="1.5"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {t('outcome.metrics.cicdStability')}
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={metrics.cicdStability || ''}
            onChange={(e) => handleMetricChange('cicdStability', parseInt(e.target.value) || 0)}
            style={styles.input}
            placeholder="4"
          />
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t('outcome.metrics.teamMorale')}
        </label>
        <p style={styles.hint}>
          {t('outcome.metrics.teamMoraleHint')}
        </p>
        <input
          type="text"
          value={(metrics.teamMoraleProgression || []).join(', ')}
          onChange={(e) => {
            const values = e.target.value
              .split(',')
              .map(v => parseInt(v.trim()))
              .filter(v => !isNaN(v) && v >= 1 && v <= 5);
            handleMetricChange('teamMoraleProgression', values);
          }}
          style={styles.input}
          placeholder="4, 3, 3, 4, 4"
        />
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoIcon}><Info size={20} color="#3b82f6" /></div>
        <div>
          <strong>{t('common.note')}:</strong> {t('outcome.metrics.noteText')}
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '28px',
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '28px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  formGroup: {
    marginBottom: '0'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    background: '#FFFFFF'
  },
  hint: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '6px'
  },
  divider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '24px 0'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1E40AF',
    marginTop: '24px'
  },
  infoIcon: {
    fontSize: '20px',
    flexShrink: 0
  }
};

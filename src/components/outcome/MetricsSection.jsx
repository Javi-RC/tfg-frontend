import React from 'react';
import { Info } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

/**
 * MetricsSection Component
 * Optional metrics section for detailed project analytics
 */
export default function MetricsSection({ formData, setFormData }) {
  
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
      <h3 style={styles.sectionTitle}>📈 Project Metrics (Optional)</h3>
      <p style={styles.sectionDescription}>
        Provide additional metrics for more detailed analysis
      </p>

      <div style={styles.metricsGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Average velocity (points/sprint)
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
            Bug rate (bugs/feature)
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
            Meeting efficiency (1-5)
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
            Deploy frequency
          </label>
          <select
            value={metrics.deploymentFrequency || ''}
            onChange={(e) => handleMetricChange('deploymentFrequency', e.target.value)}
            style={styles.select}
          >
            <option value="">Select...</option>
            <option value="multiple_per_day">Multiple per day</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="less_than_monthly">Less than monthly</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Average code review time (hours)
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
            CI/CD stability (1-5)
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
          Team morale progression (1-5 per month/sprint)
        </label>
        <p style={styles.hint}>
          Enter comma-separated values. E.g.: 4, 3, 3, 4, 4
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
          <strong>Note:</strong> These metrics are optional but help the system generate
          better predictions and comparisons with similar projects.
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '8px',
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
    marginBottom: '24px'
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

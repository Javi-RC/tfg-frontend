import React from 'react';
import { BarChart3, CheckCircle, X } from 'lucide-react';
import { BarChart3, CheckCircle, Calendar, DollarSign, Star } from 'lucide-react';

/**
 * GeneralOutcomeSection Component
 * Captures overall project outcome (completion status, dates, scores)
 */
export default function GeneralOutcomeSection({ formData, setFormData, errors }) {
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStarRating = (field, label) => {
    const value = formData[field] || 0;
    
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label} <span style={styles.required}>*</span>
        </label>
        <div style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange(field, star)}
              style={{
                ...styles.starButton,
                color: star <= value ? '#FFD700' : '#D1D5DB'
              }}
            >
              ★
            </button>
          ))}
          <span style={styles.ratingText}>{value}/5</span>
        </div>
        {errors[field] && <span style={styles.error}>{errors[field]}</span>}
      </div>
    );
  };

  return (
    <div style={styles.section}>
      <h3 style={{...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <BarChart3 size={24} />
        General Outcome
      </h3>
      <p style={styles.sectionDescription}>
        Provide basic information about how the project ended
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Was the project completed successfully? <span style={styles.required}>*</span>
        </label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="completed"
              value="true"
              checked={formData.completed === true}
              onChange={() => handleChange('completed', true)}
              style={styles.radio}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} />
              Yes
            </span>
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="completed"
              value="false"
              checked={formData.completed === false}
              onChange={() => handleChange('completed', false)}
              style={styles.radio}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <X size={16} />
              No
            </span>
          </label>
        </div>
        {errors.completed && <span style={styles.error}>{errors.completed}</span>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          📅 Actual completion date
        </label>
        <input
          type="date"
          value={formData.actualCompletedDate ? new Date(formData.actualCompletedDate).toISOString().split('T')[0] : ''}
          onChange={(e) => handleChange('actualCompletedDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          💰 Budget overrun (%)
        </label>
        <input
          type="number"
          min="0"
          value={formData.budgetOverrun || 0}
          onChange={(e) => handleChange('budgetOverrun', parseFloat(e.target.value) || 0)}
          style={styles.input}
          placeholder="0"
        />
        <small style={styles.hint}>
          If the project stayed within budget, leave at 0
        </small>
      </div>

      <div style={styles.divider} />

      <h4 style={styles.subsectionTitle}>⭐ Scores (1-5)</h4>

      {renderStarRating('qualityScore', 'Product/Service Quality')}
      {renderStarRating('clientSatisfaction', 'Client Satisfaction')}
      {renderStarRating('teamMorale', 'Team Morale')}
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
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  required: {
    color: '#DC2626'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  radioGroup: {
    display: 'flex',
    gap: '16px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151'
  },
  radio: {
    cursor: 'pointer'
  },
  starContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  starButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    padding: '0',
    transition: 'transform 0.1s',
    outline: 'none'
  },
  ratingText: {
    marginLeft: '12px',
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '500'
  },
  hint: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    color: '#6B7280'
  },
  error: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    color: '#DC2626'
  },
  divider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '24px 0'
  }
};

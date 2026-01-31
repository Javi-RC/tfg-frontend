import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * ManualRiskForm Component
 * Form for adding or editing manual risks
 */
export default function ManualRiskForm({
  initialRisk = null,
  onSubmit,
  onCancel,
  onDelete,
  loading = false
}) {
  const { t } = useTranslation();
  const isEditing = !!initialRisk;

  const fieldIds = {
    type: 'manual-risk-type',
    title: 'manual-risk-title',
    description: 'manual-risk-description',
    severity: 'manual-risk-severity',
    rootCause: 'manual-risk-root-cause',
    indicatorInput: 'manual-risk-indicator-input',
    recommendationInput: 'manual-risk-recommendation-input'
  };

  const RISK_TYPES = [
    'communication_issues',
    'communication_breakdown',
    'vendor_lock_in',
    'skill_gap',
    'team_overload',
    'dependency_blockage',
    'scope_creep',
    'process_mismatch',
    'technical_infrastructure',
    'quality_degradation',
    'vendor_issue',
    'security_compliance',
    'budget_overrun',
    'resource_unavailability',
    'knowledge_management_gap',
    'remote_work_support_gap',
    'role_clarity_gap',
    'standards_compliance_gap',
    'timezone_scheduling_gap',
    'conflict_escalation_risk',
    'team_conflicts',
    'change_resistance_risk',
    'burnout_susceptibility',
    'goal_misalignment',
    'onboarding_issues',
    'social_isolation',
    'digital_fatigue',
    'work_life_boundary_blur',
    'meeting_fatigue',
    'technostress_overload',
    'innovation_decline_remote',
    'career_visibility_gap',
    'async_communication_breakdown',
    'tool_fragmentation',
    'tacit_knowledge_loss',
    'trust_erosion_remote',
    'home_infrastructure_gap',
    'other'
  ];

  const SEVERITIES = ['low', 'medium', 'high', 'critical'];

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    severity: 'medium',
    rootCause: '',
    indicators: [],
    recommendations: [],
    indicatorInput: '',
    recommendationInput: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialRisk) {
      // During active project, all manual risks have status 'active'
      setFormData({
        type: initialRisk.type || '',
        title: initialRisk.title || '',
        description: initialRisk.description || '',
        severity: initialRisk.severity || 'medium',
        rootCause: initialRisk.rootCause || '',
        indicators: initialRisk.indicators || [],
        recommendations: initialRisk.recommendations || [],
        indicatorInput: '',
        recommendationInput: ''
      });
    }
  }, [initialRisk]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddIndicator = () => {
    const input = formData.indicatorInput.trim();
    if (input) {
      setFormData(prev => ({
        ...prev,
        indicators: [...prev.indicators, input],
        indicatorInput: ''
      }));
    }
  };

  const handleRemoveIndicator = (index) => {
    setFormData(prev => ({
      ...prev,
      indicators: prev.indicators.filter((_, i) => i !== index)
    }));
  };

  const handleAddRecommendation = () => {
    const input = formData.recommendationInput.trim();
    if (input) {
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, input],
        recommendationInput: ''
      }));
    }
  };

  const handleRemoveRecommendation = (index) => {
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // REQUIRED FIELDS (per backend specification)
    if (!formData.type) {
      newErrors.type = 'Risk type is required';
    }
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    }
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    // OPTIONAL FIELD VALIDATIONS
    if (formData.severity && !SEVERITIES.includes(formData.severity)) {
      newErrors.severity = 'Invalid severity (must be: low, medium, high, critical)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Backend automatically assigns status as 'active' during project execution
    // Only send the fields that are allowed by the backend specification
    const submissionData = {
      ...(isEditing ? {} : { type: formData.type }), // type only when adding
      title: formData.title, // REQUIRED
      description: formData.description, // REQUIRED
      severity: formData.severity || 'medium', // OPTIONAL (default: medium)
      rootCause: formData.rootCause || undefined, // OPTIONAL
      recommendations: formData.recommendations.length > 0 ? formData.recommendations : undefined, // OPTIONAL
      indicators: formData.indicators.length > 0 ? formData.indicators : undefined // OPTIONAL
    };

    // Remove undefined values
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] === undefined) {
        delete submissionData[key];
      }
    });

    onSubmit(submissionData);
  };

  return (
    <div
      style={styles.overlay}
      onClick={onCancel}
      data-testid="manual-risk-form-overlay"
    >
      <div
        style={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? t('risk.form.editTitle') : t('risk.form.addTitle')}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditing ? t('risk.form.editTitle') : t('risk.form.addTitle')}
          </h2>
          <button
            onClick={onCancel}
            style={styles.closeButton}
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Risk Type */}
          {!isEditing && (
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor={fieldIds.type}>
                {t('risk.form.riskType')} *
              </label>
              <select
                id={fieldIds.type}
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  borderColor: errors.type ? '#EF4444' : '#D1D5DB'
                }}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={errors.type ? `${fieldIds.type}-error` : undefined}
              >
                <option value="">{t('risk.form.selectRiskType')}</option>
                {RISK_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              {errors.type && <div id={`${fieldIds.type}-error`} style={styles.error} role="alert" aria-live="polite">{errors.type}</div>}
            </div>
          )}

          {/* Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.title}>
              {t('risk.form.title')} *
            </label>
            <input
              id={fieldIds.title}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('risk.form.titlePlaceholder')}
              style={{
                ...styles.input,
                borderColor: errors.title ? '#EF4444' : '#D1D5DB'
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? `${fieldIds.title}-error` : undefined}
            />
            {errors.title && <div id={`${fieldIds.title}-error`} style={styles.error} role="alert" aria-live="polite">{errors.title}</div>}
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.description}>
              {t('risk.form.description')} *
            </label>
            <textarea
              id={fieldIds.description}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('risk.form.descriptionPlaceholder')}
              style={{
                ...styles.textarea,
                borderColor: errors.description ? '#EF4444' : '#D1D5DB'
              }}
              rows={3}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? `${fieldIds.description}-error` : undefined}
            />
            {errors.description && <div id={`${fieldIds.description}-error`} style={styles.error} role="alert" aria-live="polite">{errors.description}</div>}
          </div>

          {/* Row: Severity */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.severity}>
              {t('risk.form.severity')}
            </label>
            <select
              id={fieldIds.severity}
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              style={styles.select}
            >
              {SEVERITIES.map(sev => (
                <option key={sev} value={sev}>
                  {t(`risk.severity.${sev}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Root Cause */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.rootCause}>
              {t('risk.form.rootCause')}
            </label>
            <input
              id={fieldIds.rootCause}
              type="text"
              name="rootCause"
              value={formData.rootCause}
              onChange={handleChange}
              placeholder={t('risk.form.rootCausePlaceholder')}
              style={styles.input}
            />
          </div>

          {/* Indicators */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.indicatorInput}>
              {t('risk.form.indicators')}
            </label>
            <div style={styles.listInput}>
              <input
                id={fieldIds.indicatorInput}
                type="text"
                name="indicatorInput"
                value={formData.indicatorInput}
                onChange={handleChange}
                placeholder={t('risk.form.indicatorPlaceholder')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIndicator();
                  }
                }}
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleAddIndicator}
                style={styles.addButton}
                aria-label={t('risk.form.addIndicatorAria')}
              >
                {t('risk.form.add')}
              </button>
            </div>
            <div style={styles.tagContainer}>
              {formData.indicators.map((indicator, index) => (
                <div key={index} style={styles.tag}>
                  <span>{indicator}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIndicator(index)}
                    style={styles.tagRemove}
                    aria-label={t('risk.form.removeIndicatorAria', { indicator })}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor={fieldIds.recommendationInput}>
              {t('risk.form.recommendations')}
            </label>
            <div style={styles.listInput}>
              <input
                id={fieldIds.recommendationInput}
                type="text"
                name="recommendationInput"
                value={formData.recommendationInput}
                onChange={handleChange}
                placeholder={t('risk.form.recommendationPlaceholder')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRecommendation();
                  }
                }}
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleAddRecommendation}
                style={styles.addButton}
                aria-label={t('risk.form.addRecommendationAria')}
              >
                {t('risk.form.add')}
              </button>
            </div>
            <div style={styles.tagContainer}>
              {formData.recommendations.map((recommendation, index) => (
                <div key={index} style={styles.tag}>
                  <span>{recommendation}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecommendation(index)}
                    style={styles.tagRemove}
                    aria-label={t('risk.form.removeRecommendationAria', { recommendation })}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            {isEditing && typeof onDelete === 'function' && (
              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                style={styles.dangerButton}
              >
                {t('risk.form.deleteRisk')}
              </button>
            )}
            <SecondaryButton onClick={onCancel} disabled={loading}>
              {t('common.cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? t('risk.form.saving') : (isEditing ? t('risk.form.updateRisk') : t('risk.form.addRiskButton'))}
            </PrimaryButton>
          </div>
        </form>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    padding: '24px'
  },
  fieldGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  error: {
    fontSize: '13px',
    color: '#EF4444',
    marginTop: '4px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  probabilityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  slider: {
    flex: 1,
    height: '6px',
    cursor: 'pointer'
  },
  probabilityValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    minWidth: '50px',
    textAlign: 'right'
  },
  listInput: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px'
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#E5E7EB',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s'
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '13px'
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    color: '#1E40AF',
    cursor: 'pointer',
    padding: '0',
    fontSize: '16px',
    lineHeight: '1'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #E5E7EB'
  },
  dangerButton: {
    marginRight: 'auto',
    background: '#FEE2E2',
    color: '#991B1B',
    border: '1px solid #FCA5A5',
    padding: '10px 14px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  
};

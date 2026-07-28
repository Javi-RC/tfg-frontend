import React from 'react';
import { useTranslation } from 'react-i18next';

const fieldIds = {
  type: 'manual-risk-type',
  title: 'manual-risk-title',
  description: 'manual-risk-description',
  severity: 'manual-risk-severity',
  rootCause: 'manual-risk-root-cause',
  indicatorInput: 'manual-risk-indicator-input',
  recommendationInput: 'manual-risk-recommendation-input',
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
  'other',
];

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export default function ManualRiskFields({
  formData,
  errors,
  isEditing,
  onChange,
  onAddIndicator,
  onRemoveIndicator,
  onAddRecommendation,
  onRemoveRecommendation,
}) {
  const { t } = useTranslation();

  return (
    <>
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
            onChange={onChange}
            style={{
              ...styles.select,
              borderColor: errors.type ? '#EF4444' : '#D1D5DB',
            }}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? `${fieldIds.type}-error` : undefined}
          >
            <option value="">{t('risk.form.selectRiskType')}</option>
            {RISK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
          {errors.type && (
            <div
              id={`${fieldIds.type}-error`}
              style={styles.error}
              role="alert"
              aria-live="polite"
            >
              {errors.type}
            </div>
          )}
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
          onChange={onChange}
          placeholder={t('risk.form.titlePlaceholder')}
          style={{
            ...styles.input,
            borderColor: errors.title ? '#EF4444' : '#D1D5DB',
          }}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${fieldIds.title}-error` : undefined}
        />
        {errors.title && (
          <div
            id={`${fieldIds.title}-error`}
            style={styles.error}
            role="alert"
            aria-live="polite"
          >
            {errors.title}
          </div>
        )}
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
          onChange={onChange}
          placeholder={t('risk.form.descriptionPlaceholder')}
          style={{
            ...styles.textarea,
            borderColor: errors.description ? '#EF4444' : '#D1D5DB',
          }}
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? `${fieldIds.description}-error` : undefined}
        />
        {errors.description && (
          <div
            id={`${fieldIds.description}-error`}
            style={styles.error}
            role="alert"
            aria-live="polite"
          >
            {errors.description}
          </div>
        )}
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
          onChange={onChange}
          style={styles.select}
        >
          {SEVERITIES.map((sev) => (
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
          onChange={onChange}
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
            onChange={onChange}
            placeholder={t('risk.form.indicatorPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddIndicator();
              }
            }}
            style={styles.input}
          />
          <button
            type="button"
            onClick={onAddIndicator}
            style={styles.addButton}
            aria-label={t('risk.form.addIndicatorAria')}
          >
            {t('risk.form.add')}
          </button>
        </div>
        <div style={styles.tagContainer}>
          {formData.indicators.map((indicator, index) => (
            <div key={indicator} style={styles.tag}>
              <span>{indicator}</span>
              <button
                type="button"
                onClick={() => onRemoveIndicator(index)}
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
            onChange={onChange}
            placeholder={t('risk.form.recommendationPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddRecommendation();
              }
            }}
            style={styles.input}
          />
          <button
            type="button"
            onClick={onAddRecommendation}
            style={styles.addButton}
            aria-label={t('risk.form.addRecommendationAria')}
          >
            {t('risk.form.add')}
          </button>
        </div>
        <div style={styles.tagContainer}>
          {formData.recommendations.map((recommendation, index) => (
            <div key={recommendation} style={styles.tag}>
              <span>{recommendation}</span>
              <button
                type="button"
                onClick={() => onRemoveRecommendation(index)}
                style={styles.tagRemove}
                aria-label={t('risk.form.removeRecommendationAria', { recommendation })}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    color: 'var(--color-text-strong)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border-strong)',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border-strong)',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border-strong)',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  error: {
    fontSize: '13px',
    color: 'var(--color-danger-icon)',
    marginTop: '4px',
  },
  listInput: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: 'var(--color-border)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '13px',
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    color: '#1E40AF',
    cursor: 'pointer',
    padding: '0',
    fontSize: '16px',
    lineHeight: '1',
  },
};

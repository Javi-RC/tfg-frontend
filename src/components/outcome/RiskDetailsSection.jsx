import React from 'react';
import { useTranslation } from 'react-i18next';
import TagInputSection from './TagInputSection';

const styles = {
  detailsSection: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-strong)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '10px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '10px',
    outline: 'none',
    background: '#FFFFFF',
  },
};

export default function RiskDetailsSection({
  details,
  setDetails,
  draftRecommendation,
  setDraftRecommendation,
  draftIndicator,
  setDraftIndicator,
  addRecommendation,
  removeRecommendationAt,
  addIndicator,
  removeIndicatorAt,
}) {
  const { t } = useTranslation();
  return (
    <div style={styles.detailsSection}>
      <div style={styles.formGroup}>
        <label htmlFor="risk-detail-title" style={styles.label}>{t('outcome.risks.modal.title')}</label>
        <input
          id="risk-detail-title"
          type="text"
          value={details.title}
          onChange={(e) => setDetails((prev) => ({ ...prev, title: e.target.value }))}
          style={styles.input}
          placeholder={t('outcome.risks.modal.titlePlaceholder')}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="risk-detail-description" style={styles.label}>{t('outcome.risks.modal.description')}</label>
        <textarea
          id="risk-detail-description"
          value={details.description}
          onChange={(e) => setDetails((prev) => ({ ...prev, description: e.target.value }))}
          style={styles.textarea}
          rows={3}
          placeholder={t('outcome.risks.modal.descriptionPlaceholder')}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="risk-detail-severity" style={styles.label}>{t('outcome.risks.modal.severity')}</label>
        <select
          id="risk-detail-severity"
          value={details.severity || 'medium'}
          onChange={(e) => setDetails((prev) => ({ ...prev, severity: e.target.value }))}
          style={styles.select}
        >
          <option value="low">{t('outcome.risks.modal.severityLow')}</option>
          <option value="medium">{t('outcome.risks.modal.severityMedium')}</option>
          <option value="high">{t('outcome.risks.modal.severityHigh')}</option>
          <option value="critical">{t('outcome.risks.modal.severityCritical')}</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="risk-detail-rootCause" style={styles.label}>{t('outcome.risks.modal.rootCause')}</label>
        <textarea
          id="risk-detail-rootCause"
          value={details.rootCause}
          onChange={(e) => setDetails((prev) => ({ ...prev, rootCause: e.target.value }))}
          style={styles.textarea}
          rows={2}
          placeholder={t('outcome.risks.modal.rootCausePlaceholder')}
        />
      </div>

      <TagInputSection
        labelKey="outcome.risks.modal.recommendations"
        placeholderKey="outcome.risks.modal.recommendationsPlaceholder"
        idPrefix="risk-detail-recommendations"
        items={details.recommendations || []}
        draft={draftRecommendation}
        setDraft={setDraftRecommendation}
        onAdd={addRecommendation}
        onRemove={removeRecommendationAt}
      />

      <TagInputSection
        labelKey="outcome.risks.modal.indicators"
        placeholderKey="outcome.risks.modal.indicatorsPlaceholder"
        idPrefix="risk-detail-indicators"
        items={details.indicators || []}
        draft={draftIndicator}
        setDraft={setDraftIndicator}
        onAdd={addIndicator}
        onRemove={removeIndicatorAt}
      />
    </div>
  );
}

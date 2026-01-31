import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function RiskEvaluationModal({
  isOpen,
  onClose,
  riskMeta,
  value,
  onSave,
  saving = false
}) {
  const { t } = useTranslation();
  const [occurred, setOccurred] = useState(undefined);
  const [details, setDetails] = useState({
    title: '',
    description: '',
    severity: 'medium',
    rootCause: '',
    recommendations: [],
    indicators: []
  });
  const [draftRecommendation, setDraftRecommendation] = useState('');
  const [draftIndicator, setDraftIndicator] = useState('');

  const title = useMemo(() => {
    if (!riskMeta) return t('outcome.risks.modal.evaluateRisk');
    return riskMeta.title || t('outcome.risks.modal.evaluateRisk');
  }, [riskMeta, t]);

  useEffect(() => {
    if (!isOpen) return;
    setOccurred(value?.occurred);

    const normalizeList = (list) => {
      if (!Array.isArray(list)) return [];
      return list
        .map((v) => String(v ?? '').trim())
        .filter((v) => v.length > 0);
    };

    setDetails({
      title: String(value?.title ?? riskMeta?.title ?? '').trim(),
      description: String(value?.description ?? riskMeta?.description ?? '').trim(),
      severity: String(value?.severity ?? riskMeta?.severity ?? 'medium'),
      rootCause: String(value?.rootCause ?? riskMeta?.rootCause ?? '').trim(),
      recommendations: normalizeList(value?.recommendations ?? riskMeta?.recommendations),
      indicators: normalizeList(value?.indicators ?? riskMeta?.indicators)
    });

    setDraftRecommendation('');
    setDraftIndicator('');
  }, [isOpen, value]);

  if (!isOpen || !riskMeta) return null;

  const handleSave = async () => {
    if (occurred !== true && occurred !== false) {
      return;
    }

    if (occurred === false) {
      await onSave({ occurred: false });
      onClose();
      return;
    }

    const normalizeList = (list) => {
      if (!Array.isArray(list)) return [];
      return list
        .map((v) => String(v ?? '').trim())
        .filter((v) => v.length > 0);
    };

    await onSave({
      occurred: true,
      title: details.title?.trim() || undefined,
      description: details.description?.trim() || undefined,
      severity: details.severity || undefined,
      rootCause: details.rootCause?.trim() || undefined,
      recommendations: normalizeList(details.recommendations),
      indicators: normalizeList(details.indicators)
    });
    onClose();
  };

  const addRecommendation = () => {
    const next = String(draftRecommendation || '').trim();
    if (!next) return;
    setDetails((prev) => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), next]
    }));
    setDraftRecommendation('');
  };

  const removeRecommendationAt = (index) => {
    setDetails((prev) => ({
      ...prev,
      recommendations: (prev.recommendations || []).filter((_, i) => i !== index)
    }));
  };

  const addIndicator = () => {
    const next = String(draftIndicator || '').trim();
    if (!next) return;
    setDetails((prev) => ({
      ...prev,
      indicators: [...(prev.indicators || []), next]
    }));
    setDraftIndicator('');
  };

  const removeIndicatorAt = (index) => {
    setDetails((prev) => ({
      ...prev,
      indicators: (prev.indicators || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>{title}</h3>
            <div style={styles.subtitle}>
              <span style={styles.metaItem}>{t('outcome.risks.modal.estimatedSeverity')}: {riskMeta.severity || 'N/A'}</span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaItem}>{t('outcome.risks.modal.source')}: {riskMeta.sourceLabel || 'System'}</span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeButton} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.choiceRow}>
            <div style={styles.choiceLabel}>{t('outcome.risks.modal.didRiskOccur')}</div>
            <div style={styles.choiceGroup}>
              <label style={styles.choiceOption}>
                <input
                  type="radio"
                  name="occurred"
                  checked={occurred === true}
                  onChange={() => setOccurred(true)}
                />
                <span>{t('outcome.risks.modal.yesOccurred')}</span>
              </label>
              <label style={styles.choiceOption}>
                <input
                  type="radio"
                  name="occurred"
                  checked={occurred === false}
                  onChange={() => setOccurred(false)}
                />
                <span>{t('outcome.risks.modal.noAvoided')}</span>
              </label>
            </div>
          </div>

          {occurred === true && (
            <div style={styles.detailsSection}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{t('outcome.risks.modal.title')}</label>
                <input
                  type="text"
                  value={details.title}
                  onChange={(e) => setDetails((prev) => ({ ...prev, title: e.target.value }))}
                  style={styles.input}
                  placeholder={t('outcome.risks.modal.titlePlaceholder')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{t('outcome.risks.modal.description')}</label>
                <textarea
                  value={details.description}
                  onChange={(e) => setDetails((prev) => ({ ...prev, description: e.target.value }))}
                  style={styles.textarea}
                  rows={3}
                  placeholder={t('outcome.risks.modal.descriptionPlaceholder')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{t('outcome.risks.modal.severity')}</label>
                <select
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
                <label style={styles.label}>{t('outcome.risks.modal.rootCause')}</label>
                <textarea
                  value={details.rootCause}
                  onChange={(e) => setDetails((prev) => ({ ...prev, rootCause: e.target.value }))}
                  style={styles.textarea}
                  rows={2}
                  placeholder={t('outcome.risks.modal.rootCausePlaceholder')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{t('outcome.risks.modal.recommendations')}</label>
                <div style={styles.inlineRow}>
                  <input
                    type="text"
                    value={draftRecommendation}
                    onChange={(e) => setDraftRecommendation(e.target.value)}
                    style={styles.input}
                    placeholder={t('outcome.risks.modal.recommendationsPlaceholder')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRecommendation();
                      }
                    }}
                  />
                  <button type="button" onClick={addRecommendation} style={styles.smallButton}>
                    {t('common.add')}
                  </button>
                </div>
                {(details.recommendations || []).length > 0 && (
                  <ul style={styles.list}>
                    {details.recommendations.map((item, index) => (
                      <li key={`${item}-${index}`} style={styles.listItem}>
                        <span style={styles.listText}>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeRecommendationAt(index)}
                          style={styles.removeButton}
                          aria-label="Remove recommendation"
                        >
                          {t('common.remove')}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{t('outcome.risks.modal.indicators')}</label>
                <div style={styles.inlineRow}>
                  <input
                    type="text"
                    value={draftIndicator}
                    onChange={(e) => setDraftIndicator(e.target.value)}
                    style={styles.input}
                    placeholder={t('outcome.risks.modal.indicatorsPlaceholder')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addIndicator();
                      }
                    }}
                  />
                  <button type="button" onClick={addIndicator} style={styles.smallButton}>
                    {t('common.add')}
                  </button>
                </div>
                {(details.indicators || []).length > 0 && (
                  <ul style={styles.list}>
                    {details.indicators.map((item, index) => (
                      <li key={`${item}-${index}`} style={styles.listItem}>
                        <span style={styles.listText}>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeIndicatorAt(index)}
                          style={styles.removeButton}
                          aria-label="Remove indicator"
                        >
                          {t('common.remove')}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <SecondaryButton onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving || (occurred !== true && occurred !== false)}>
            {saving ? t('common.saving') : t('common.save')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    zIndex: 1000,
    overflowY: 'auto'
  },
  modal: {
    width: '100%',
    maxWidth: '700px',
    maxHeight: '95vh',
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid #E5E7EB',
    flexShrink: 0
  },
  title: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '800',
    color: '#111827',
    lineHeight: '1.3'
  },
  subtitle: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  metaItem: { fontWeight: 600 },
  metaDot: { color: '#9CA3AF' },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '6px'
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    minHeight: 0
  },
  detailsSection: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
  },
  choiceRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px'
  },
  choiceLabel: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#111827'
  },
  choiceGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  choiceOption: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    cursor: 'pointer'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    outline: 'none',
    background: '#FFFFFF'
  },
  inlineRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  smallButton: {
    background: '#111827',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  list: {
    margin: '10px 0 0 0',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '10px 12px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '10px'
  },
  listText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#111827'
  },
  removeButton: {
    background: '#FEE2E2',
    border: 'none',
    color: '#B91C1C',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #E5E7EB',
    flexShrink: 0,
    background: '#F9FAFB'
  }
};

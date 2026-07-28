import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import OccurrenceChoice from './OccurrenceChoice';
import RiskDetailsSection from './RiskDetailsSection';

function normalizeList(list) {
  if (!Array.isArray(list)) return [];
  return list.flatMap((v) => {
    const s = String(v ?? '').trim();
    return s.length > 0 ? [s] : [];
  });
}

function deriveInitialProps(value, riskMeta) {
  return {
    occurred: value?.occurred,
    details: {
      title: String(value?.title ?? riskMeta?.title ?? '').trim(),
      description: String(value?.description ?? riskMeta?.description ?? '').trim(),
      severity: String(value?.severity ?? riskMeta?.severity ?? 'medium'),
      rootCause: String(value?.rootCause ?? riskMeta?.rootCause ?? '').trim(),
      recommendations: normalizeList(value?.recommendations ?? riskMeta?.recommendations),
      indicators: normalizeList(value?.indicators ?? riskMeta?.indicators),
    },
  };
}

function RiskEvaluationModalInner({
  isOpen,
  onClose,
  riskMeta,
  value,
  onSave,
  saving = false,
}) {
  const { t } = useTranslation();
  const initialProps = useMemo(() => deriveInitialProps(value, riskMeta), [value, riskMeta]);
  const [occurred, setOccurred] = useState(initialProps.occurred);
  const [details, setDetails] = useState(initialProps.details);
  const [draftRecommendation, setDraftRecommendation] = useState('');
  const [draftIndicator, setDraftIndicator] = useState('');

  const title = useMemo(() => {
    if (!riskMeta) return t('outcome.risks.modal.evaluateRisk');
    return riskMeta.title || t('outcome.risks.modal.evaluateRisk');
  }, [riskMeta, t]);

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
      return list.flatMap((v) => {
        const s = String(v ?? '').trim();
        return s.length > 0 ? [s] : [];
      });
    };

    await onSave({
      occurred: true,
      title: details.title?.trim() || undefined,
      description: details.description?.trim() || undefined,
      severity: details.severity || undefined,
      rootCause: details.rootCause?.trim() || undefined,
      recommendations: normalizeList(details.recommendations),
      indicators: normalizeList(details.indicators),
    });
    onClose();
  };

  const addRecommendation = () => {
    const next = String(draftRecommendation || '').trim();
    if (!next) return;
    setDetails((prev) => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), next],
    }));
    setDraftRecommendation('');
  };

  const removeRecommendationAt = (index) => {
    setDetails((prev) => ({
      ...prev,
      recommendations: (prev.recommendations || []).filter((_, i) => i !== index),
    }));
  };

  const addIndicator = () => {
    const next = String(draftIndicator || '').trim();
    if (!next) return;
    setDetails((prev) => ({
      ...prev,
      indicators: [...(prev.indicators || []), next],
    }));
    setDraftIndicator('');
  };

  const removeIndicatorAt = (index) => {
    setDetails((prev) => ({
      ...prev,
      indicators: (prev.indicators || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>{title}</h3>
            <div style={styles.subtitle}>
              <span style={styles.metaItem}>
                {t('outcome.risks.modal.estimatedSeverity')}: {riskMeta.severity || t('common.notAvailable')}
              </span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaItem}>
                {t('outcome.risks.modal.source')}: {riskMeta.sourceLabel || t('outcome.risks.modal.systemFallback')}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} style={styles.closeButton} aria-label={t('outcome.risks.modal.close')}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <OccurrenceChoice occurred={occurred} onChoose={setOccurred} />

          {occurred === true && (
            <RiskDetailsSection
              details={details}
              setDetails={setDetails}
              draftRecommendation={draftRecommendation}
              setDraftRecommendation={setDraftRecommendation}
              draftIndicator={draftIndicator}
              setDraftIndicator={setDraftIndicator}
              addRecommendation={addRecommendation}
              removeRecommendationAt={removeRecommendationAt}
              addIndicator={addIndicator}
              removeIndicatorAt={removeIndicatorAt}
            />
          )}
        </div>

        <div style={styles.footer}>
          <SecondaryButton onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSave}
            disabled={saving || (occurred !== true && occurred !== false)}
          >
            {saving ? t('common.saving') : t('common.save')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}



export default function RiskEvaluationModal(props) {
  return (
    <RiskEvaluationModalInner key={props.isOpen ? 'open' : 'closed'} {...props} />
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
    overflowY: 'auto',
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
    margin: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '800',
    color: 'var(--color-text-heading)',
    lineHeight: '1.3',
  },
  subtitle: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '6px',
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  metaItem: { fontWeight: 600 },
  metaDot: { color: 'var(--color-text-muted)' },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    padding: '6px',
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid var(--color-border)',
    flexShrink: 0,
    background: 'var(--color-bg-muted)',
  },
};

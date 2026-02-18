import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, X, ExternalLink } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { updatePersonalityConsent } from '../../api/personalityConsent';
import { trapFocus, createFocusManager } from '../../utils/focusManagement';

/**
 * PersonalityConsentModal Component
 * Displays consent terms for BFI-44 personality profiling before allowing access.
 */
export default function PersonalityConsentModal({
  show,
  onClose,
  onAccepted,
  version = '1.0'
}) {
  const { t } = useTranslation();
  const [personalityProfiling, setPersonalityProfiling] = useState(false);
  const [dataRetention, setDataRetention] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const focusManagerRef = useRef(createFocusManager());

  useEffect(() => {
    if (!show) return;

    focusManagerRef.current.save();
    const savedFocusManager = focusManagerRef.current;

    const cleanup = trapFocus(modalRef.current);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cleanup();
      document.body.style.overflow = originalOverflow;
      savedFocusManager.restore();
    };
  }, [show]);

  useEffect(() => {
    if (!show) return;
    setPersonalityProfiling(false);
    setDataRetention(false);
    setSubmitting(false);
    setError(null);
  }, [show]);

  const canAccept = useMemo(
    () => personalityProfiling,
    [personalityProfiling]
  );

  if (!show) return null;

  const handleAccept = async () => {
    setError(null);

    if (!canAccept) {
      setError(t('personalityConsent.mustAcceptProfiling'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await updatePersonalityConsent({
        accepted: true,
        personalityProfiling: true,
        dataRetention
      });

      if (onAccepted) onAccepted(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('personalityConsent.errorSaving')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="personality-consent-modal-title"
    >
      <div ref={modalRef} style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.iconWrap} aria-hidden="true">
              <Brain size={18} color="#111" />
            </div>
            <div>
              <h2 id="personality-consent-modal-title" style={styles.title}>
                {t('personalityConsent.title')}
              </h2>
              <p style={styles.subtitle}>
                {t('personalityConsent.version')}: {version}
              </p>
            </div>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label={t('personalityConsent.aria.closeModal')}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.paragraph}>
            {t('personalityConsent.description')}
          </p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              {t('personalityConsent.whatWeCollect')}
            </h3>
            <ul style={styles.list}>
              <li>{t('personalityConsent.collect1')}</li>
              <li>{t('personalityConsent.collect2')}</li>
              <li>{t('personalityConsent.collect3')}</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              {t('personalityConsent.purpose')}
            </h3>
            <ul style={styles.list}>
              <li>{t('personalityConsent.purpose1')}</li>
              <li>{t('personalityConsent.purpose2')}</li>
              <li>{t('personalityConsent.purpose3')}</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              {t('personalityConsent.specificConsent')}
            </h3>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={personalityProfiling}
                onChange={(e) => setPersonalityProfiling(e.target.checked)}
              />
              <div>
                <span style={styles.checkboxLabel}>
                  {t('personalityConsent.acceptProfiling')}
                </span>
                <span style={styles.requiredBadge}>
                  {t('personalityConsent.required')}
                </span>
              </div>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={dataRetention}
                onChange={(e) => setDataRetention(e.target.checked)}
              />
              <div>
                <span style={styles.checkboxLabel}>
                  {t('personalityConsent.acceptRetention')}
                </span>
                <span style={styles.optionalBadge}>
                  {t('personalityConsent.optional')}
                </span>
              </div>
            </label>
          </div>

          <div style={styles.links}>
            <a href="/terms" target="_blank" rel="noreferrer" style={styles.link}>
              {t('personalityConsent.terms')} <ExternalLink size={14} />
            </a>
          </div>

          {error && (
            <div style={styles.errorBanner} role="alert">
              {error}
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <SecondaryButton onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={handleAccept} disabled={!canAccept || submitting}>
            {submitting
              ? t('common.saving')
              : t('personalityConsent.acceptContinue')}
          </PrimaryButton>
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
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
    padding: '16px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '720px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '20px 22px',
    borderBottom: '1px solid #eee'
  },
  iconWrap: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: '#EDE9FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '650',
    color: '#111'
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#666'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    color: '#666'
  },
  body: {
    padding: '18px 22px',
    overflowY: 'auto'
  },
  paragraph: {
    margin: 0,
    fontSize: '14px',
    color: '#2d3748',
    lineHeight: '1.6'
  },
  section: {
    marginTop: '16px'
  },
  sectionTitle: {
    margin: '0 0 10px',
    fontSize: '14px',
    fontWeight: '650',
    color: '#111'
  },
  list: {
    margin: 0,
    paddingLeft: '18px',
    color: '#2d3748',
    fontSize: '14px',
    lineHeight: '1.7'
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#2d3748',
    cursor: 'pointer'
  },
  checkboxLabel: {
    display: 'block',
    fontWeight: '500'
  },
  requiredBadge: {
    display: 'inline-block',
    marginTop: '4px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: '#FEF3C7',
    color: '#92400E',
    fontSize: '11px',
    fontWeight: '600'
  },
  optionalBadge: {
    display: 'inline-block',
    marginTop: '4px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: '#F3F4F6',
    color: '#374151',
    fontSize: '11px',
    fontWeight: '600'
  },
  links: {
    marginTop: '12px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#2563eb',
    textDecoration: 'none'
  },
  errorBanner: {
    marginTop: '14px',
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '14px'
  },
  actions: {
    padding: '16px 22px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }
};

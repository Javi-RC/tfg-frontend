import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, X, ExternalLink } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { updateCVConsent } from '../../api/cvConsent';
import { trapFocus, createFocusManager } from '../../utils/focusManagement';

export default function CVConsentModal({ show, onClose, onAccepted, version = '1.0' }) {
  const { t } = useTranslation();
  const [aiProcessing, setAiProcessing] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [dataRetention, setDataRetention] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const focusManagerRef = useRef(null);
  if (focusManagerRef.current === null) {
    focusManagerRef.current = createFocusManager();
  }

  useEffect(() => {
    if (!show) return;

    // Save current focus and trap focus in modal
    focusManagerRef.current.save();
    const savedFocusManager = focusManagerRef.current;

    const cleanup = trapFocus(modalRef.current);

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cleanup();
      document.body.style.overflow = originalOverflow;
      savedFocusManager.restore();
    };
  }, [show]);

  const canAccept = useMemo(
    () => aiProcessing && thirdPartySharing && dataRetention,
    [aiProcessing, thirdPartySharing, dataRetention]
  );

  if (!show) return null;

  const handleAccept = async () => {
    setError(null);

    if (!canAccept) {
      setError(t('cv.consent.mustAcceptAll'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateCVConsent({
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: true,
        dataRetention: true,
      });

      if (onAccepted) onAccepted(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('cv.consent.errorSaving')
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
      aria-labelledby="consent-modal-title"
    >
      <div ref={modalRef} style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.iconWrap} aria-hidden="true">
              <Shield size={18} color="#111" />
            </div>
            <div>
              <h2 id="consent-modal-title" style={styles.title}>
                {t('cv.consent.title')}
              </h2>
              <p style={styles.subtitle}>
                {t('cv.consent.version')}: {version}
              </p>
            </div>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label={t('cv.consent.aria.closeModal')}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.paragraph}>{t('cv.consent.description')}</p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{t('cv.consent.implications')}</h3>
            <ul style={styles.list}>
              <li>{t('cv.consent.implication1')}</li>
              <li>{t('cv.consent.implication2')}</li>
              <li>{t('cv.consent.implication3')}</li>
              <li>{t('cv.consent.implication4')}</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{t('cv.consent.specificConsent')}</h3>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={aiProcessing}
                onChange={(e) => setAiProcessing(e.target.checked)}
              />
              <span>{t('cv.consent.acceptAI')}</span>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={thirdPartySharing}
                onChange={(e) => setThirdPartySharing(e.target.checked)}
              />
              <span>{t('cv.consent.acceptSharing')}</span>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={dataRetention}
                onChange={(e) => setDataRetention(e.target.checked)}
              />
              <span>{t('cv.consent.acceptRetention')}</span>
            </label>
          </div>

          <div style={styles.links}>
            <a href="/terms" target="_blank" rel="noreferrer" style={styles.link}>
              {t('cv.consent.terms')} <ExternalLink size={14} />
            </a>
            <a
              href="https://ai.google.dev/terms"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              {t('cv.consent.googleTerms')} <ExternalLink size={14} />
            </a>
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}
        </div>

        <div style={styles.actions}>
          <SecondaryButton onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={handleAccept} disabled={!canAccept || submitting}>
            {submitting ? t('common.saving') : t('cv.consent.acceptContinue')}
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
    padding: '16px',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '720px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '20px 22px',
    borderBottom: '1px solid var(--color-border)',
  },
  iconWrap: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'var(--color-bg-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '650',
    color: 'var(--color-text-primary)',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    color: 'var(--color-text-muted)',
  },
  body: {
    padding: '18px 22px',
    overflowY: 'auto',
  },
  paragraph: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-body)',
    lineHeight: '1.6',
  },
  section: {
    marginTop: '16px',
  },
  sectionTitle: {
    margin: '0 0 10px',
    fontSize: '14px',
    fontWeight: '650',
    color: 'var(--color-text-primary)',
  },
  list: {
    margin: 0,
    paddingLeft: '18px',
    color: 'var(--color-text-body)',
    fontSize: '14px',
    lineHeight: '1.7',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    marginBottom: '10px',
    fontSize: '14px',
    color: 'var(--color-text-body)',
    cursor: 'pointer',
  },
  links: {
    marginTop: '12px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  errorBanner: {
    marginTop: '14px',
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '14px',
  },
  actions: {
    padding: '16px 22px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};

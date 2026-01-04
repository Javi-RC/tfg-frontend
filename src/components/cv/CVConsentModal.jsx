import React, { useEffect, useMemo, useState } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { updateCVConsent } from '../../api/cvConsent';

export default function CVConsentModal({
  show,
  onClose,
  onAccepted,
  version = '1.0'
}) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [dataRetention, setDataRetention] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show) return;
    setAiProcessing(false);
    setThirdPartySharing(false);
    setDataRetention(false);
    setSubmitting(false);
    setError(null);
  }, [show]);

  const canAccept = useMemo(
    () => aiProcessing && thirdPartySharing && dataRetention,
    [aiProcessing, thirdPartySharing, dataRetention]
  );

  if (!show) return null;

  const handleAccept = async () => {
    setError(null);

    if (!canAccept) {
      setError('You must accept all specific terms to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateCVConsent({
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: true,
        dataRetention: true
      });

      if (onAccepted) onAccepted(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Error saving consent. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.iconWrap} aria-hidden="true">
              <Shield size={18} color="#111" />
            </div>
            <div>
              <h2 style={styles.title}>Consent for AI CV Processing</h2>
              <p style={styles.subtitle}>Terms version: {version}</p>
            </div>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close consent modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.paragraph}>
            To process your CV and extract relevant information, we use a third-party AI service
            (Google Gemini API). This means the text in your CV will be sent to Google for analysis.
          </p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>What does this imply?</h3>
            <ul style={styles.list}>
              <li>Your CV text will be sent to Google for analysis</li>
              <li>Google will process the information under their terms of service</li>
              <li>Extracted data will be stored in our database</li>
              <li>You can revoke this consent anytime from your profile</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Specific consent</h3>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={aiProcessing}
                onChange={(e) => setAiProcessing(e.target.checked)}
              />
              <span>I accept AI processing of my CV</span>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={thirdPartySharing}
                onChange={(e) => setThirdPartySharing(e.target.checked)}
              />
              <span>I accept sharing my information with Google Gemini API</span>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={dataRetention}
                onChange={(e) => setDataRetention(e.target.checked)}
              />
              <span>I accept retention of processed data in the database</span>
            </label>
          </div>

          <div style={styles.links}>
            <a href="/terms" target="_blank" rel="noreferrer" style={styles.link}>
              Terms <ExternalLink size={14} />
            </a>
            <a
              href="https://ai.google.dev/terms"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Google AI Terms <ExternalLink size={14} />
            </a>
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}
        </div>

        <div style={styles.actions}>
          <SecondaryButton onClick={onClose} disabled={submitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleAccept} disabled={!canAccept || submitting}>
            {submitting ? 'Saving...' : 'Accept and Continue'}
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
    background: '#f3f4f6',
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

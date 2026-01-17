import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getTerms } from '../api/legal';
import SecondaryButton from '../components/SecondaryButton';

export default function TermsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState(null);

  const locale = useMemo(() => {
    const lang = (typeof navigator !== 'undefined' && navigator.language) || '';
    return lang.toLowerCase().startsWith('es') ? 'es' : undefined;
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchDoc = async (requestedLocale) => {
        const res = await getTerms({ locale: requestedLocale });
        return res?.data?.document;
      };

      let document = await fetchDoc(locale);

      // Some backends may require an explicit supported locale.
      if (!document) {
        throw new Error(t('errors.invalidServerResponse'));
      }

      setDoc(document);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 406) {
        // Retry with the only currently supported locale.
        try {
          const resEs = await getTerms({ locale: 'es' });
          const documentEs = resEs?.data?.document;
          if (documentEs) {
            setDoc(documentEs);
            setError(null);
            return;
          }
        } catch {
          // fall through to final error
        }

        setError(t('errors.localeNotSupported'));
        setDoc(null);
        return;
      }

      setError(err?.response?.data?.error || err?.message || t('legal.couldNotLoadTerms'));
      setDoc(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDateTime = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.iconWrap} aria-hidden="true">
              <FileText size={18} color="#111" />
            </div>
            <div>
              <h1 style={styles.title}>{t('legal.terms')}</h1>
              <p style={styles.subtitle}>
                {t('legal.versionLabel')}: {doc?.version || '—'} · {t('legal.lastUpdatedLabel')}: {formatDateTime(doc?.lastUpdated)}
              </p>
            </div>
          </div>

          <SecondaryButton onClick={load} disabled={loading} leftIcon={<RefreshCw size={16} />}>
            {t('legal.refresh')}
          </SecondaryButton>
        </div>

        {loading && <p style={styles.statusText}>{t('common.loading')}</p>}

        {error && (
          <div style={styles.error} role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={styles.content} aria-label={t('legal.aria.termsContent')}>
            <ReactMarkdown
              components={{
                a: ({ children, ...props }) => (
                  <a {...props} target="_blank" rel="noreferrer" style={styles.link}>
                    {children}
                  </a>
                )
              }}
            >
              {doc?.content || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  container: {
    maxWidth: '980px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  header: {
    padding: '22px 24px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap'
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
    fontSize: '20px',
    fontWeight: '650',
    color: '#111'
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#666'
  },
  statusText: {
    padding: '18px 24px',
    margin: 0,
    fontSize: '14px',
    color: '#666'
  },
  error: {
    margin: '18px 24px',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '10px',
    color: '#c0392b',
    padding: '12px 14px',
    fontSize: '14px'
  },
  content: {
    margin: 0,
    padding: '18px 24px 24px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#111'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  }
};

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Send, X, Building2, CheckCircle } from 'lucide-react';
import { searchOrganizations } from '../api/organization';
import { submitCVToOrganization } from '../api/cv';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

/**
 * SubmitCVToOrganization Component
 * Modal to search and submit CV to an organization
 */
export default function SubmitCVToOrganization({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    searchOrgs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const searchOrgs = async () => {
    try {
      setLoading(true);
      const params = searchQuery ? { name: searchQuery } : {};
      const res = await searchOrganizations(params);
      
      // La API devuelve { success: true, data: { organizations: [...], pagination: {...} } }
      if (res.data?.success && res.data?.data?.organizations) {
        setOrganizations(res.data.data.organizations);
      } else if (res.data?.organizations) {
        // Fallback: axios ya extrajo el data
        setOrganizations(res.data.organizations);
      } else if (Array.isArray(res.data)) {
        // Fallback: respuesta es array directo
        setOrganizations(res.data);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      console.error('Error searching organizations:', err);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOrg) {
      setError(t('form.selectOption'));
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await submitCVToOrganization(selectedOrg._id);
      
      // Verificar respuesta exitosa según formato API
      if (response.data?.success || response.status === 201) {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setError(t('cv.errorSubmittingCV'));
      }
    } catch (err) {
      // La API devuelve { success: false, error: "mensaje" }
      setError(err.response?.data?.error || err.message || t('cv.errorSubmittingCV'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{t('cv.submitToOrg')}</h2>
          <button style={styles.closeButton} onClick={onClose} aria-label={t('common.close')}>×</button>
        </div>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        <div style={styles.searchSection}>
          <Search size={18} color="#666" style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          <input
            type="text"
            placeholder={t('organizations.searchOrganizations')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{...styles.searchInput, paddingLeft: '48px'}}
            aria-label={t('organizations.searchOrganizations')}
          />
        </div>

        <div style={styles.listSection}>
          {loading ? (
            <p style={styles.loadingText}>{t('organizations.loadingOrganizations')}</p>
          ) : organizations.length === 0 ? (
            <p style={styles.emptyText}>{t('organizations.noOrganizations')}</p>
          ) : (
            <div style={styles.orgList}>
              {organizations.map((org) => (
                <div
                  key={org._id}
                  style={{
                    ...styles.orgItem,
                    border: selectedOrg?._id === org._id ? '2px solid #2563eb' : '1px solid #ddd'
                  }}
                  onClick={() => setSelectedOrg(org)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedOrg(org);
                    }
                  }}
                  aria-pressed={selectedOrg?._id === org._id}
                  aria-label={t('organizations.selectOrganization', { name: org.name, defaultValue: `Select ${org.name}` })}
                >
                  <div style={styles.orgInfo}>
                    <div style={styles.orgName}>{org.name}</div>
                    {org.description && (
                      <div style={styles.orgDescription}>{org.description}</div>
                    )}
                    <div style={styles.orgMeta}>
                      {org.industry && <span style={styles.metaItem}>{org.industry}</span>}
                      {org.size && <span style={styles.metaItem}>{org.size}</span>}
                    </div>
                  </div>
                  {selectedOrg?._id === org._id && (
                    <div style={styles.checkmark}><CheckCircle size={24} color="#10b981" /></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <SecondaryButton onClick={onClose} leftIcon={<X size={16} />}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={!selectedOrg || submitting} leftIcon={<Send size={16} />}>
            {submitting ? t('common.submitting') : t('cv.submitToOrg')}
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
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorBanner: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 24px',
    fontSize: '14px'
  },
  searchSection: {
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  listSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 24px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  },
  orgList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orgItem: {
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ':hover': {
      background: '#f8f9fa'
    }
  },
  orgInfo: {
    flex: 1
  },
  orgName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  orgDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  orgMeta: {
    display: 'flex',
    gap: '12px'
  },
  metaItem: {
    fontSize: '12px',
    color: '#999',
    background: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  checkmark: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '24px',
    borderTop: '1px solid #eee'
  }
};

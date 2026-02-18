import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SecondaryButton from '../../SecondaryButton';
import { getOrganizationCVs, updateCVStatus } from '../../../api/organization';

/**
 * CVsTab (Admin only)
 */
export default function CVsTab({ organizationId, onUpdate, styles }) {
  const { t, i18n } = useTranslation();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    loadCVs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, filter]);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const params = { status: filter };
      const res = await getOrganizationCVs(organizationId, params);
      if (res.data?.success && res.data?.data?.cvs) {
        setCvs(res.data.data.cvs);
      } else if (res.data?.cvs) {
        setCvs(res.data.cvs);
      } else if (Array.isArray(res.data)) {
        setCvs(res.data);
      } else {
        setCvs([]);
      }
    } catch (err) {
      console.error('Error loading CVs:', err);
      setCvs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (cvId, newStatus, notes = '') => {
    try {
      await updateCVStatus(organizationId, cvId, { status: newStatus, notes });
      loadCVs();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || t('organization.cvs.errorUpdating'));
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>{t('organization.cvs.loading')}</p>;
  }

  const formatSkills = (skills) => {
    if (!skills) return 'N/A';
    if (Array.isArray(skills)) {
      const values = skills.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    if (typeof skills === 'object') {
      const buckets = Object.values(skills).flat();
      const values = buckets.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    return 'N/A';
  };

  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    if (Array.isArray(languages)) {
      const values = languages
        .map((l) => (typeof l === 'string' ? l : l?.language || l?.name))
        .filter(Boolean);
      return values.length ? values.join(', ') : 'N/A';
    }
    return 'N/A';
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{t('organization.cvs.title')}</h2>
        <div style={styles.filterButtons}>
          <button style={filter === 'pending' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('pending')}>
            {t('organization.cvs.pending')}
          </button>
          <button style={filter === 'reviewed' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('reviewed')}>
            {t('organization.cvs.reviewed')}
          </button>
          <button style={filter === 'accepted' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('accepted')}>
            {t('organization.cvs.accepted')}
          </button>
          <button style={filter === 'rejected' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('rejected')}>
            {t('organization.cvs.rejected')}
          </button>
        </div>
      </div>

      {cvs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <FileText size={48} color="#999" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>{t('organization.cvs.noCVs')}</p>
        </div>
      ) : (
        <div style={styles.cvList}>
          {cvs.map((cv) => (
            <div key={cv._id} style={styles.cvCard}>
              <div style={styles.cvHeader}>
                <div>
                  <h3 style={styles.cvName}>{cv.userId?.name || cv.userId?.username || t('common.unknown')}</h3>
                  <p style={styles.cvEmail}>{cv.userId?.email}</p>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      cv.organizationStatus === 'accepted'
                        ? '#e8f5e9'
                        : cv.organizationStatus === 'rejected'
                          ? '#ffebee'
                          : cv.organizationStatus === 'reviewed'
                            ? '#e3f2fd'
                            : '#fff3e0',
                    color:
                      cv.organizationStatus === 'accepted'
                        ? '#2e7d32'
                        : cv.organizationStatus === 'rejected'
                          ? '#c62828'
                          : cv.organizationStatus === 'reviewed'
                            ? '#1565c0'
                            : '#f57c00'
                  }}
                >
                  {t(`organization.cvs.${cv.organizationStatus}`)}
                </span>
              </div>

              <div style={styles.cvInfo}>
                <div>
                  <strong>{t('organization.cvs.skills')}:</strong> {formatSkills(cv.skills)}
                </div>
                <div>
                  <strong>{t('organization.cvs.languages')}:</strong> {formatLanguages(cv.languages)}
                </div>
                <div>
                  <strong>{t('organization.cvs.submitted')}:</strong>{' '}
                  {cv.submittedToOrganizationAt ? new Date(cv.submittedToOrganizationAt).toLocaleDateString(i18n.language) : 'N/A'}
                </div>
              </div>

              {cv.organizationNotes && (
                <div style={styles.cvNotes}>
                  <strong>{t('organization.cvs.notes')}:</strong> {cv.organizationNotes}
                </div>
              )}

              <div style={styles.cvActions}>
                <SecondaryButton
                  onClick={() => {
                    navigate(`/organizations/${organizationId}/cvs/${cv._id}`);
                  }}
                >
                  {t('organization.cvs.viewFull')}
                </SecondaryButton>
                {cv.organizationStatus === 'pending' && (
                  <>
                    <button style={styles.actionButton} onClick={() => handleStatusChange(cv._id, 'reviewed')}>
                      {t('organization.cvs.markReviewed')}
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#4caf50' }}
                      onClick={() => {
                        const notes = prompt(t('organization.cvs.addNotesOptional'));
                        handleStatusChange(cv._id, 'accepted', notes || '');
                      }}
                    >
                      {t('organization.cvs.accept')}
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#f44336' }}
                      onClick={() => {
                        const notes = prompt(t('organization.cvs.addRejectionReason'));
                        handleStatusChange(cv._id, 'rejected', notes || '');
                      }}
                    >
                      {t('organization.cvs.reject')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

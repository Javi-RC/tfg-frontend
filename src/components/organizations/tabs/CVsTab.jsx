import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import SecondaryButton from '../../SecondaryButton';
import { getOrganizationCVs, updateCVStatus } from '../../../api/organization';

/**
 * CVsTab (Admin only)
 */
export default function CVsTab({ organizationId, onUpdate, styles }) {
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
      alert(err.response?.data?.error || err.message || 'Error updating CV status');
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading CVs...</p>;
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
        <h2 style={styles.cardTitle}>Received CVs</h2>
        <div style={styles.filterButtons}>
          <button style={filter === 'pending' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('pending')}>
            Pending
          </button>
          <button style={filter === 'reviewed' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('reviewed')}>
            Reviewed
          </button>
          <button style={filter === 'accepted' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('accepted')}>
            Accepted
          </button>
          <button style={filter === 'rejected' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('rejected')}>
            Rejected
          </button>
        </div>
      </div>

      {cvs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <FileText size={48} color="#999" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>No CVs found</p>
        </div>
      ) : (
        <div style={styles.cvList}>
          {cvs.map((cv) => (
            <div key={cv._id} style={styles.cvCard}>
              <div style={styles.cvHeader}>
                <div>
                  <h3 style={styles.cvName}>{cv.userId?.name || cv.userId?.username || 'Unknown'}</h3>
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
                  {cv.organizationStatus}
                </span>
              </div>

              <div style={styles.cvInfo}>
                <div>
                  <strong>Skills:</strong> {formatSkills(cv.skills)}
                </div>
                <div>
                  <strong>Languages:</strong> {formatLanguages(cv.languages)}
                </div>
                <div>
                  <strong>Submitted:</strong>{' '}
                  {cv.submittedToOrganizationAt ? new Date(cv.submittedToOrganizationAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {cv.organizationNotes && (
                <div style={styles.cvNotes}>
                  <strong>Notes:</strong> {cv.organizationNotes}
                </div>
              )}

              <div style={styles.cvActions}>
                <SecondaryButton
                  onClick={() => {
                    navigate(`/organizations/${organizationId}/cvs/${cv._id}`);
                  }}
                >
                  View Full CV
                </SecondaryButton>
                {cv.organizationStatus === 'pending' && (
                  <>
                    <button style={styles.actionButton} onClick={() => handleStatusChange(cv._id, 'reviewed')}>
                      Mark as Reviewed
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#4caf50' }}
                      onClick={() => {
                        const notes = prompt('Add notes (optional):');
                        handleStatusChange(cv._id, 'accepted', notes || '');
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.actionButton, background: '#f44336' }}
                      onClick={() => {
                        const notes = prompt('Add rejection reason (optional):');
                        handleStatusChange(cv._id, 'rejected', notes || '');
                      }}
                    >
                      Reject
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

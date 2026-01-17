import React, { useEffect, useState } from 'react';
import { User, Users } from 'lucide-react';
import { getOrganizationStats } from '../../api/organization';

export default function OrganizationCard({ organization, isAdmin, onClick, styles }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;

    getOrganizationStats(organization._id)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setStats(res.data.data);
        } else if (res.data && !res.data.success) {
          setStats(res.data);
        }
      })
      .catch((err) => console.error('Error loading stats:', err));
  }, [organization._id, isAdmin]);

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{organization.name}</h3>
        <span
          style={{
            ...styles.badge,
            background: organization.status === 'active' ? '#e8f5e9' : '#ffebee',
            color: organization.status === 'active' ? '#2e7d32' : '#c62828'
          }}
        >
          {organization.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      {organization.description && (
        <p style={styles.cardDescription}>{organization.description}</p>
      )}

      <div style={styles.cardInfo}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Industry:</span>
          <span style={styles.infoValue}>{organization.industry || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Size:</span>
          <span style={styles.infoValue}>{organization.size || 'N/A'}</span>
        </div>
      </div>

      {isAdmin && stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalEmployees}</span>
            <span style={styles.statLabel}>Employees</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.activeEmployees}</span>
            <span style={styles.statLabel}>Active</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.pendingEmployees}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
        </div>
      )}

      <div style={styles.cardFooter}>
        <span style={styles.footerText}>
          {isAdmin ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              Administrator
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} />
              Employee
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

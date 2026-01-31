import React, { useEffect, useState } from 'react';
import { User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getOrganizationStats } from '../../api/organization';

export default function OrganizationCard({ organization, isAdmin, onClick, styles }) {
  const { t } = useTranslation();
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
          {organization.status === 'active' ? t('organization.status.active') : t('organization.status.inactive')}
        </span>
      </div>

      {organization.description && (
        <p style={styles.cardDescription}>{organization.description}</p>
      )}

      <div style={styles.cardInfo}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>{t('organization.card.industry')}:</span>
          <span style={styles.infoValue}>{organization.industry || t('common.na')}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>{t('organization.card.size')}:</span>
          <span style={styles.infoValue}>{organization.size || t('common.na')}</span>
        </div>
      </div>

      {isAdmin && stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalEmployees}</span>
            <span style={styles.statLabel}>{t('organization.card.employees')}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.activeEmployees}</span>
            <span style={styles.statLabel}>{t('organization.card.active')}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.pendingEmployees}</span>
            <span style={styles.statLabel}>{t('organization.card.pending')}</span>
          </div>
        </div>
      )}

      <div style={styles.cardFooter}>
        <span style={styles.footerText}>
          {isAdmin ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              {t('organization.card.administrator')}
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} />
              {t('organization.card.employee')}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

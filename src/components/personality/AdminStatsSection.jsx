import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Clock, BarChart3 } from 'lucide-react';

export default function AdminStatsSection({ stats }) {
  const { t } = useTranslation();
  const completionRate = stats?.completionRate ?? 0;
  const totalEmployees = stats?.totalEmployees ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? totalEmployees - completed;

  return (
    <>
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #3B82F6' }}>
          <div style={{ ...styles.statIcon, background: '#EFF6FF' }}>
            <Users size={24} color="#3B82F6" />
          </div>
          <div>
            <div style={styles.statValue}>{totalEmployees}</div>
            <div style={styles.statLabel}>{t('bfi44Admin.stats.totalEmployees')}</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ ...styles.statIcon, background: 'var(--color-success-bg)' }}>
            <CheckCircle size={24} color="#10B981" />
          </div>
          <div>
            <div style={styles.statValue}>{completed}</div>
            <div style={styles.statLabel}>{t('bfi44Admin.stats.completed')}</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ ...styles.statIcon, background: 'var(--color-warning-bg)' }}>
            <Clock size={24} color="#F59E0B" />
          </div>
          <div>
            <div style={styles.statValue}>{pending}</div>
            <div style={styles.statLabel}>{t('bfi44Admin.stats.pending')}</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid var(--color-accent-purple)' }}>
          <div style={{ ...styles.statIcon, background: '#EDE9FE' }}>
            <BarChart3 size={24} color="#8B5CF6" />
          </div>
          <div>
            <div style={styles.statValue}>{Math.round(completionRate)}%</div>
            <div style={styles.statLabel}>{t('bfi44Admin.stats.completionRate')}</div>
          </div>
        </div>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>{t('bfi44Admin.completionProgress')}</span>
          <span style={styles.progressValue}>{Math.round(completionRate)}%</span>
        </div>
        <div style={styles.progressBarTrack}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${Math.min(completionRate, 100)}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
  progressSection: {
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-success)',
  },
  progressBarTrack: {
    width: '100%',
    height: '10px',
    background: 'var(--color-border)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-success), #34D399)',
    borderRadius: '5px',
    transition: 'width 0.6s ease',
  },
};

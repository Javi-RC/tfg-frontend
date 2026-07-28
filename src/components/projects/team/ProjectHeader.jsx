import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, RefreshCw, Settings } from 'lucide-react';
import i18n from '../../../i18n';

const formatDate = (dateStr, fallback) => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.toLocaleDateString(i18n.language);
};

export default function ProjectHeader({
  project,
  teamCount,
  requiredTeamSize,
  refreshing,
  onRefresh,
  onOpenConfig,
}) {
  const { t } = useTranslation();
  const notAvailableLabel = t('common.notAvailable');

  return (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.headerLeft}>
          <h2 style={styles.projectTitle}>{project.name}</h2>
          <div style={styles.projectMeta}>
            <span style={styles.metaItem}>
              <Users size={16} />
              {t('draftTeamAnalysis.header.membersProgress', {
                current: teamCount,
                required: requiredTeamSize,
              })}
            </span>
            <span style={styles.metaItem}>
              <Calendar size={16} />
              {formatDate(project.estimatedStartDate || project.startDate, notAvailableLabel)}
            </span>
            <button type="button"
              onClick={onRefresh}
              disabled={refreshing}
              style={styles.refreshButton}
              title={t('draftTeamAnalysis.refresh.title')}
            >
              <RefreshCw
                size={16}
                style={refreshing ? { animation: 'spin 1s linear infinite' } : {}}
              />
              {refreshing ? t('draftTeamAnalysis.refresh.refreshing') : t('common.refresh')}
            </button>
            <button type="button"
              onClick={onOpenConfig}
              style={styles.configButton}
              title={t('draftTeamAnalysis.config.title')}
            >
              <Settings size={16} />
              {t('draftTeamAnalysis.config.button')}
            </button>
          </div>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>{t('draftTeamAnalysis.progress.label')}</div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min((teamCount / requiredTeamSize) * 100, 100)}%`,
                backgroundColor: teamCount >= requiredTeamSize ? '#28a745' : '#007bff',
              }}
            />
          </div>
          <div style={styles.progressText}>{Math.round((teamCount / requiredTeamSize) * 100)}%</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, var(--color-accent-gradient-start) 0%, var(--color-accent-gradient-end) 100%)',
    color: '#fff',
    padding: '24px 32px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
  },
  headerLeft: {
    flex: 1,
  },
  projectTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  projectMeta: {
    display: 'flex',
    gap: '24px',
    fontSize: '14px',
    opacity: 0.95,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  refreshButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  configButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '200px',
  },
  progressLabel: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    opacity: 0.9,
  },
  progressBar: {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    fontSize: '14px',
    fontWeight: '600',
  },
};

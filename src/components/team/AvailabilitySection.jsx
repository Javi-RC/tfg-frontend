import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Briefcase, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

/**
 * AvailabilitySection - Workload and availability analysis
 * 
 * Shows:
 * - Current workload (concurrent projects)
 * - Weekly hours commitment
 * - Timezone and location
 * - Schedule preferences
 * - Overload warnings
 * 
 * @param {Object} employee - Employee data with workload and user info
 */
export default function AvailabilitySection({ employee }) {
  const { t } = useTranslation();
  const user = employee.user;
  const workload = employee.workload;

  // Calculate availability status
  const availabilityStatus = calculateAvailabilityStatus(workload, t);

  return (
    <div style={styles.container}>
      {/* Availability Overview */}
      <div style={{
        ...styles.statusCard,
        backgroundColor: availabilityStatus.bgColor,
        borderColor: availabilityStatus.borderColor
      }}>
        <div style={styles.statusHeader}>
          <div style={styles.statusTitle}>
            {availabilityStatus.icon}
            <span>{availabilityStatus.title}</span>
          </div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: availabilityStatus.badgeColor
          }}>
            {availabilityStatus.label}
          </div>
        </div>
        <p style={styles.statusDesc}>{availabilityStatus.description}</p>
      </div>

      {/* Workload Stats */}
      {workload && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <Briefcase size={16} />
            {t('team.availability.currentWorkload')}
          </h4>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Briefcase size={24} color="#007bff" />
              </div>
              <div>
                <div style={styles.statValue}>
                  {workload.concurrentProjects || 0}
                </div>
                <div style={styles.statLabel}>{t('team.availability.activeProjects')}</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Clock size={24} color="#28a745" />
              </div>
              <div>
                <div style={styles.statValue}>
                  {workload.weeklyHours || 0}h
                </div>
                <div style={styles.statLabel}>{t('team.availability.hoursPerWeek')}</div>
              </div>
            </div>
          </div>

          {/* Overload Warning */}
          {workload.isOverloaded && (
            <div style={styles.warningBox}>
              <AlertTriangle size={16} />
              <div>
                <div style={styles.warningTitle}>{t('team.availability.workloadAlertTitle')}</div>
                <div style={styles.warningText}>
                  {t('team.availability.workloadAlertText', {
                    projects: workload.concurrentProjects,
                    hours: workload.weeklyHours
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Project List */}
          {workload.projects && workload.projects.length > 0 && (
            <div style={styles.projectsList}>
              <div style={styles.projectsHeader}>{t('team.availability.currentProjects')}</div>
              {workload.projects.map((project, idx) => (
                <div key={idx} style={styles.projectItem}>
                  <CheckCircle size={14} color="#007bff" />
                  <div style={styles.projectName}>{project.name || project.projectName}</div>
                  <div style={styles.projectHours}>
                    {t('team.availability.projectHoursPerWeek', { hours: project.weeklyHours || project.hours || 0 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Location & Timezone */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>
          <MapPin size={16} />
          {t('team.availability.locationAndTimezone')}
        </h4>

        <div style={styles.locationCard}>
          {user.country && (
            <div style={styles.locationItem}>
              <span style={styles.locationIcon}>🌍</span>
              <div>
                <div style={styles.locationLabel}>{t('team.availability.country')}</div>
                <div style={styles.locationValue}>{user.country}</div>
              </div>
            </div>
          )}

          {user.timezone && (
            <div style={styles.locationItem}>
              <span style={styles.locationIcon}>🕐</span>
              <div>
                <div style={styles.locationLabel}>{t('team.availability.timezone')}</div>
                <div style={styles.locationValue}>
                  {user.timezone}
                  <span style={styles.timezoneOffset}>
                    {' '}({getTimezoneOffset(user.timezone)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {user.flexibleSchedule !== undefined && (
            <div style={styles.locationItem}>
              <span style={styles.locationIcon}>
                {user.flexibleSchedule ? '✅' : '📅'}
              </span>
              <div>
                <div style={styles.locationLabel}>{t('team.availability.scheduleFlexibility')}</div>
                <div style={styles.locationValue}>
                  {user.flexibleSchedule ? t('team.availability.flexible') : t('team.availability.fixedHours')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Working Hours */}
      {user.preferredWorkingHours && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <Clock size={16} />
            {t('team.availability.preferredWorkingHours')}
          </h4>

          <div style={styles.hoursCard}>
            <div style={styles.hoursDisplay}>
              <div style={styles.hoursTime}>
                {formatTime(user.preferredWorkingHours.start)}
              </div>
              <div style={styles.hoursArrow}>→</div>
              <div style={styles.hoursTime}>
                {formatTime(user.preferredWorkingHours.end)}
              </div>
            </div>
            
            <div style={styles.hoursNote}>
              {calculateWorkingHours(
                user.preferredWorkingHours.start,
                user.preferredWorkingHours.end
              )}{' '}{t('team.availability.hoursPerDay')}
            </div>

            {user.timezone && (
              <div style={styles.hoursTimezone}>
                {t('team.availability.inTimezone', { timezone: user.timezone })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remote Work Experience */}
      {employee.cv?.remoteWorkExperience && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>{t('team.availability.remoteWorkExperience')}</h4>
          
          <div style={styles.remoteCard}>
            {employee.cv.remoteWorkExperience.years !== undefined && (
              <div style={styles.remoteItem}>
                <CheckCircle size={14} color="#28a745" />
                <span>
                  {t('team.availability.remoteWorkYears', { count: employee.cv.remoteWorkExperience.years })}
                </span>
              </div>
            )}

            {employee.cv.remoteWorkExperience.distributedTeams && (
              <div style={styles.remoteItem}>
                <CheckCircle size={14} color="#28a745" />
                <span>{t('team.availability.distributedTeams')}</span>
              </div>
            )}

            {employee.cv.remoteWorkExperience.timezoneFlexibility && (
              <div style={styles.remoteItem}>
                <CheckCircle size={14} color="#28a745" />
                <span>{t('team.availability.timezoneFlexibility')}</span>
              </div>
            )}

            {employee.cv.remoteWorkExperience.remoteWorkTools && 
             employee.cv.remoteWorkExperience.remoteWorkTools.length > 0 && (
              <div style={styles.toolsSection}>
                <div style={styles.toolsLabel}>{t('team.availability.remoteTools')}</div>
                <div style={styles.toolsList}>
                  {employee.cv.remoteWorkExperience.remoteWorkTools.map((tool, idx) => (
                    <span key={idx} style={styles.toolChip}>{tool}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div style={styles.recommendationsCard}>
        <div style={styles.recHeader}>
          <span style={styles.recIcon}>💡</span>
          <span style={styles.recTitle}>{t('team.availability.assignmentRecommendations')}</span>
        </div>
        <ul style={styles.recList}>
          {generateRecommendations(employee, workload, t).map((rec, idx) => (
            <li key={idx} style={styles.recItem}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Calculate availability status
 */
function calculateAvailabilityStatus(workload, t) {
  if (!workload) {
    return {
      title: t('team.availability.status.unknown.title'),
      label: t('team.availability.status.unknown.label'),
      description: t('team.availability.status.unknown.description'),
      icon: '❓',
      bgColor: '#f6f8fa',
      borderColor: '#e1e4e8',
      badgeColor: '#6c757d'
    };
  }

  const projects = workload.concurrentProjects || 0;
  const hours = workload.weeklyHours || 0;

  if (workload.isOverloaded || projects > 2 || hours > 45) {
    return {
      title: t('team.availability.status.highWorkload.title'),
      label: t('team.availability.status.highWorkload.label'),
      description: t('team.availability.status.highWorkload.description'),
      icon: '🔴',
      bgColor: '#f8d7da',
      borderColor: '#f5c6cb',
      badgeColor: '#dc3545'
    };
  }

  if (projects === 1 || (hours > 20 && hours <= 35)) {
    return {
      title: t('team.availability.status.moderateWorkload.title'),
      label: t('team.availability.status.moderateWorkload.label'),
      description: t('team.availability.status.moderateWorkload.description'),
      icon: '🟡',
      bgColor: '#fff3cd',
      borderColor: '#ffc107',
      badgeColor: '#ffc107'
    };
  }

  return {
    title: t('team.availability.status.goodAvailability.title'),
    label: t('team.availability.status.goodAvailability.label'),
    description: t('team.availability.status.goodAvailability.description'),
    icon: '🟢',
    bgColor: '#d4edda',
    borderColor: '#c3e6cb',
    badgeColor: '#28a745'
  };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(employee, workload, t) {
  const recommendations = [];
  const user = employee.user;

  // Workload recommendations
  if (workload?.isOverloaded) {
    recommendations.push(`⚠️ ${t('team.availability.recommendations.overloaded')}`);
  } else if (!workload || workload.concurrentProjects === 0) {
    recommendations.push(`✅ ${t('team.availability.recommendations.excellentAvailability')}`);
  }

  // Timezone recommendations
  if (user.timezone) {
    const offset = getTimezoneOffset(user.timezone);
    if (Math.abs(parseInt(offset)) > 6) {
      recommendations.push(`🌍 ${t('team.availability.recommendations.timezoneDifference')}`);
    } else {
      recommendations.push(`✅ ${t('team.availability.recommendations.timezoneOverlap')}`);
    }
  }

  // Flexibility recommendations
  if (user.flexibleSchedule) {
    recommendations.push(`✅ ${t('team.availability.recommendations.flexibleSchedule')}`);
  } else {
    recommendations.push(`📅 ${t('team.availability.recommendations.fixedSchedule')}`);
  }

  // Remote work recommendations
  if (employee.cv?.remoteWorkExperience?.distributedTeams) {
    recommendations.push(`✅ ${t('team.availability.recommendations.distributedTeams')}`);
  }

  return recommendations.length > 0 
    ? recommendations 
    : [`✅ ${t('team.availability.recommendations.noConcerns')}`];
}

/**
 * Helpers
 */
function getTimezoneOffset(timezone) {
  if (!timezone) return 'UTC+0';
  
  // Simplified timezone offset mapping
  const offsetMap = {
    'UTC': 'UTC+0',
    'GMT': 'GMT+0',
    'EST': 'UTC-5',
    'PST': 'UTC-8',
    'CST': 'UTC-6',
    'MST': 'UTC-7',
    'CET': 'UTC+1',
    'IST': 'UTC+5:30',
    'JST': 'UTC+9',
    'AEST': 'UTC+10'
  };

  return offsetMap[timezone.toUpperCase()] || timezone;
}

function formatTime(timeString) {
  if (!timeString) return '--:--';
  
  // Handle both "HH:MM" and "HH:MM:SS" formats
  const parts = timeString.split(':');
  const hours = parts[0];
  const minutes = parts[1] || '00';
  
  return `${hours}:${minutes}`;
}

function calculateWorkingHours(start, end) {
  if (!start || !end) return 8;
  
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  
  return Math.abs(endHour - startHour);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // Status Card
  statusCard: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  statusTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  statusDesc: {
    margin: 0,
    fontSize: '13px',
    color: '#586069',
    lineHeight: '1.5',
  },

  // Section
  section: {
    marginBottom: '8px',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  statIcon: {
    flexShrink: 0,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#24292e',
  },
  statLabel: {
    fontSize: '12px',
    color: '#586069',
  },

  // Warning Box
  warningBox: {
    display: 'flex',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  warningTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#856404',
    marginBottom: '4px',
  },
  warningText: {
    fontSize: '12px',
    color: '#856404',
    lineHeight: '1.5',
  },

  // Projects List
  projectsList: {
    padding: '12px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
  },
  projectsHeader: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#24292e',
    marginBottom: '10px',
  },
  projectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid #e1e4e8',
  },
  projectName: {
    flex: 1,
    fontSize: '13px',
    color: '#24292e',
  },
  projectHours: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#586069',
  },

  // Location Card
  locationCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '16px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  locationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  locationIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  locationLabel: {
    fontSize: '11px',
    color: '#586069',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  locationValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#24292e',
  },
  timezoneOffset: {
    fontSize: '12px',
    color: '#586069',
    fontWeight: 'normal',
  },

  // Hours Card
  hoursCard: {
    padding: '20px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
    textAlign: 'center',
  },
  hoursDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  hoursTime: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#007bff',
    fontFamily: 'monospace',
  },
  hoursArrow: {
    fontSize: '24px',
    color: '#586069',
  },
  hoursNote: {
    fontSize: '13px',
    color: '#586069',
    marginBottom: '6px',
  },
  hoursTimezone: {
    fontSize: '12px',
    color: '#586069',
    fontStyle: 'italic',
  },

  // Remote Card
  remoteCard: {
    padding: '14px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  remoteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 0',
    fontSize: '13px',
    color: '#24292e',
  },
  toolsSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e1e4e8',
  },
  toolsLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#586069',
    marginBottom: '8px',
  },
  toolsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  toolChip: {
    padding: '4px 10px',
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#24292e',
  },

  // Recommendations
  recommendationsCard: {
    padding: '16px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    border: '1px solid #007bff',
  },
  recHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  recIcon: {
    fontSize: '20px',
  },
  recTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#24292e',
  },
  recList: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  recItem: {
    fontSize: '13px',
    color: '#24292e',
    lineHeight: '1.6',
  },
};

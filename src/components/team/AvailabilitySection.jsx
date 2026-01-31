import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Calendar, Plane, MapPin, Clock, Moon, Phone } from 'lucide-react';

/**
 * AvailabilitySection - Employee availability (from CV)
 *
 * Shows:
 * - cv.availability (immediate/startDate/travel/off-hours/etc)
 *
 * @param {Object} employee - Employee data with CV
 */
export default function AvailabilitySection({ employee }) {
  const { t } = useTranslation();
  const cvAvailability = employee?.cv?.availability;

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        {cvAvailability ? (
          <div style={styles.cvAvailabilityCard}>
            <div style={styles.cvAvailabilityGrid}>
              <AvailabilityField
                icon={<Zap size={16} color="#10b981" />}
                label={t('team.availability.cv.immediate', { defaultValue: 'Immediate' })}
                value={formatBoolean(t, cvAvailability.immediate)}
              />
              <AvailabilityField
                icon={<Calendar size={16} color="#3b82f6" />}
                label={t('team.availability.cv.startDate', { defaultValue: 'Start date' })}
                value={formatDateValue(cvAvailability.startDate, t)}
              />
              <AvailabilityField
                icon={<Plane size={16} color="#8b5cf6" />}
                label={t('team.availability.cv.willingToTravel', { defaultValue: 'Willing to travel' })}
                value={formatBoolean(t, cvAvailability.willingToTravel)}
              />
              <AvailabilityField
                icon={<Plane size={16} color="#8b5cf6" />}
                label={t('team.availability.cv.travelFrequency', { defaultValue: 'Travel frequency' })}
                value={formatEnum(t, 'team.availability.cv.travelFrequencyValues', cvAvailability.travelFrequency)}
              />
              <AvailabilityField
                icon={<MapPin size={16} color="#f59e0b" />}
                label={t('team.availability.cv.willingToRelocate', { defaultValue: 'Willing to relocate' })}
                value={formatBoolean(t, cvAvailability.willingToRelocate)}
              />
              <AvailabilityField
                icon={<Clock size={16} color="#6366f1" />}
                label={t('team.availability.cv.willingToWorkOffHours', { defaultValue: 'Willing to work off-hours' })}
                value={formatBoolean(t, cvAvailability.willingToWorkOffHours)}
              />
              <AvailabilityField
                icon={<Clock size={16} color="#6366f1" />}
                label={t('team.availability.cv.overtimeAvailability', { defaultValue: 'Overtime availability' })}
                value={formatEnum(t, 'team.availability.cv.overtimeAvailabilityValues', cvAvailability.overtimeAvailability)}
              />
              <AvailabilityField
                icon={<Moon size={16} color="#6b7280" />}
                label={t('team.availability.cv.weekendAvailability', { defaultValue: 'Weekend availability' })}
                value={formatBoolean(t, cvAvailability.weekendAvailability)}
              />
              <AvailabilityField
                icon={<Phone size={16} color="#ef4444" />}
                label={t('team.availability.cv.onCallAvailability', { defaultValue: 'On-call availability' })}
                value={formatBoolean(t, cvAvailability.onCallAvailability)}
              />
            </div>
          </div>
        ) : (
          <div style={styles.emptyCard}>
            {t('team.availability.cv.noData', { defaultValue: 'No availability data found in this CV.' })}
          </div>
        )}
      </div>
    </div>
  );
}

function AvailabilityField({ icon, label, value }) {
  return (
    <div style={styles.cvAvailabilityItem}>
      <div style={styles.cvAvailabilityHeader}>
        {icon}
        <div style={styles.cvAvailabilityLabel}>{label}</div>
      </div>
      <div style={styles.cvAvailabilityValue}>{value}</div>
    </div>
  );
}

function formatBoolean(t, value) {
  if (value === true) return t('team.availability.cv.yes', { defaultValue: 'Yes' });
  if (value === false) return t('team.availability.cv.no', { defaultValue: 'No' });
  return t('team.availability.cv.unknown', { defaultValue: 'Unknown' });
}

function formatDateValue(dateStr, t) {
  if (!dateStr) return t('team.availability.cv.unknown', { defaultValue: 'Unknown' });
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return t('team.availability.cv.unknown', { defaultValue: 'Unknown' });

  try {
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function formatEnum(t, baseKey, value) {
  if (!value) return t('team.availability.cv.unknown', { defaultValue: 'Unknown' });
  const normalized = String(value).trim();
  return t(`${baseKey}.${normalized}`, { defaultValue: normalized });
}

/**
 * Calculate availability status
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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

  // CV Availability
  cvAvailabilityCard: {
    padding: '16px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  cvAvailabilityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  cvAvailabilityItem: {
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
  },
  cvAvailabilityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  cvAvailabilityLabel: {
    fontSize: '11px',
    color: '#586069',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    fontWeight: '600',
  },
  cvAvailabilityValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#24292e',
  },

  emptyCard: {
    padding: '12px 14px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px dashed #d0d7de',
    color: '#586069',
    fontSize: '13px',
  },
};

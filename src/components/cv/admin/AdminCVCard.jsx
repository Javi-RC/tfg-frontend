import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, MapPin, Globe, Briefcase } from 'lucide-react';

/**
 * AdminCVCard
 * Displays a processed CV summary in a selectable card.
 */
export default function AdminCVCard({ cv, onClick, isSelected }) {
  const { t, i18n } = useTranslation();
  const email = cv.contact?.email || t('cv.noEmail');
  const location = cv.contact?.location?.city || '';
  const skillsCount = cv.skills?.technical?.length || 0;
  const languagesCount = cv.languages?.length || 0;
  const experienceCount = cv.experience?.length || 0;

  return (
    <div
      onClick={onClick}
      role="listitem"
      tabIndex={0}
      aria-label={`CV for ${email.split('@')[0]}, ${email}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isSelected ? '2px solid #111' : '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '16px'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '4px'
            }}
          >
            {email.split('@')[0] || t('cv.unnamed')}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#666'
            }}
          >
            {email}
          </p>
          {location && (
            <p
              style={{
                fontSize: '13px',
                color: '#999',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <MapPin size={14} />
              <span>{location}</span>
            </p>
          )}
        </div>
        <div
          style={{
            padding: '4px 12px',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {t('cv.status.processed')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {skillsCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Briefcase size={16} />
            <span>{skillsCount} {t('cv.skills')}</span>
          </div>
        )}
        {languagesCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={16} />
            <span>{languagesCount} {t('cv.languages')}</span>
          </div>
        )}
        {experienceCount > 0 && (
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ClipboardList size={16} />
            <span>{experienceCount} {t('cv.experiences')}</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#999' }}>
        {t('cv.uploaded')}: {cv.processingDate ? new Date(cv.processingDate).toLocaleDateString(i18n.language) : '—'}
      </p>
    </div>
  );
}

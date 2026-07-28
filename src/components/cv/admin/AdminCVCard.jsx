import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, MapPin, Globe, Briefcase } from 'lucide-react';
import './AdminCVCard.css';

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
    <li className="admin-cv-card-item">
      <button
        type="button"
        onClick={onClick}
        aria-label={`CV for ${email.split('@')[0]}, ${email}`}
        className={`admin-cv-card-btn${isSelected ? ' admin-cv-card-btn--selected' : ''}`}
      >
      <div className="admin-cv-card-header">
        <div>
          <h3 className="admin-cv-card-name">
            {email.split('@')[0] || t('cv.unnamed')}
          </h3>
          <p className="admin-cv-card-email">
            {email}
          </p>
          {location && (
            <p className="admin-cv-card-location">
              <MapPin size={14} />
              <span>{location}</span>
            </p>
          )}
        </div>
        <div className="admin-cv-card-badge">
          {t('cv.status.processed')}
        </div>
      </div>

      <div className="admin-cv-card-meta">
        {skillsCount > 0 && (
          <div className="admin-cv-card-meta-item">
            <Briefcase size={16} />
            <span>
              {skillsCount} {t('cv.skills')}
            </span>
          </div>
        )}
        {languagesCount > 0 && (
          <div className="admin-cv-card-meta-item">
            <Globe size={16} />
            <span>
              {languagesCount} {t('cv.languages')}
            </span>
          </div>
        )}
        {experienceCount > 0 && (
          <div className="admin-cv-card-meta-item">
            <ClipboardList size={16} />
            <span>
              {experienceCount} {t('cv.experiences')}
            </span>
          </div>
        )}
      </div>

      <p className="admin-cv-card-date">
        {t('cv.uploaded')}:{' '}
        {cv.processingDate ? new Date(cv.processingDate).toLocaleDateString(i18n.language) : '—'}
      </p>
      </button>
    </li>
  );
}

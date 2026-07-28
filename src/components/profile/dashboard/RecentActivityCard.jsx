import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowRight, UserRound } from 'lucide-react';

/**
 * RecentActivityCard
 * Recent activity feed. Placeholder items until an activity endpoint exists.
 */
export default function RecentActivityCard({ items = [], onSeeAll = () => {} }) {
  const { t } = useTranslation();

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><Clock size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.dashboard.recentActivity')}</span>
        <span className="sara-card-head-action">
          <button type="button" className="sara-card-link" style={{ marginTop: 0 }} onClick={onSeeAll}>
            {t('profile.dashboard.seeAll')}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </span>
      </div>

      <div className="sara-activity">
        {items.map((item, idx) => (
          <div key={idx} className="sara-activity-item">
            <span className="sara-activity-icon"><UserRound size={18} aria-hidden="true" /></span>
            <div>
              <div className="sara-activity-title">{t(item.titleKey)}</div>
              <div className="sara-activity-time">{t(item.timeKey)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

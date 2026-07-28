import React from 'react';
import { useTranslation } from 'react-i18next';
import { FolderKanban, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';

const ICONS = {
  projects: FolderKanban,
  teams: Users,
  compatibility: Star,
  recommendations: TrendingUp,
};

/**
 * StatsRow
 * Four summary stat tiles. Values are placeholders until the corresponding
 * backend endpoints exist (see Profile.jsx PLACEHOLDER_STATS).
 */
export default function StatsRow({ stats = [], onNavigate = () => {} }) {
  const { t } = useTranslation();

  return (
    <div className="sara-stats">
      {stats.map((stat) => {
        const Icon = ICONS[stat.key] || Star;
        return (
          <div key={stat.key} className="sara-card sara-stat-card">
            <div className={`sara-stat-icon ${stat.color}`}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <div>
              <div className="sara-stat-value">{stat.value}</div>
              <div className="sara-stat-label">{t(stat.labelKey)}</div>
              {stat.linkKey && (
                <button
                  type="button"
                  className="sara-stat-link"
                  onClick={() => onNavigate(stat.path)}
                >
                  {t(stat.linkKey)}
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              )}
              {stat.subKey && !stat.linkKey && (
                <div className="sara-stat-label" style={{ marginTop: '6px' }}>
                  {t(stat.subKey)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

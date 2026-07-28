import React from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECT_STATUS_COLORS } from '../../types/projectTypes';

/**
 * Project Status Badge Component
 * Displays a styled badge for project status
 */
export default function ProjectStatusBadge({ status }) {
  const { t } = useTranslation();
  const colors = PROJECT_STATUS_COLORS[status] || PROJECT_STATUS_COLORS.draft;
  const label = t(`projectStatus.${status}`) || status;
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
}

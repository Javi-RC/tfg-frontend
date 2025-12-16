import React from 'react';
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '../../types/projectTypes';

/**
 * Project Status Badge Component
 * Displays a styled badge for project status
 */
export default function ProjectStatusBadge({ status }) {
  const colors = PROJECT_STATUS_COLORS[status] || PROJECT_STATUS_COLORS.draft;
  const label = PROJECT_STATUS_LABELS[status] || status;

  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        display: 'inline-block'
      }}
    >
      {label}
    </span>
  );
}

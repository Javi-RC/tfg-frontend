import React from 'react';
import { useTranslation } from 'react-i18next';
import './CVCard.css';

/**
 * CVCard Component
 * Styled card container for CV sections with color-coded borders
 */
export default function CVCard({
  children,
  editMode,
  borderColor = '#4299e1',
  onRemove,
  removeLabel,
  style = {},
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`cvcard-container ${editMode ? 'cvcard-container--edit' : 'cvcard-container--view'}`}
      style={{ borderLeft: `4px solid ${borderColor}`, ...style }}
    >
      {editMode && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`cvcard-remove-btn ${editMode ? 'cvcard-remove-btn--edit' : 'cvcard-remove-btn--view'}`}
          aria-label={removeLabel || t('cv.remove')}
        >
          {t('cv.remove')}
        </button>
      )}
      {children}
    </div>
  );
}

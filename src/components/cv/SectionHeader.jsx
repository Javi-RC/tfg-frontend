import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import SecondaryButton from '../SecondaryButton';
import './SectionHeader.css';

/**
 * SectionHeader Component
 * Consistent header for CV sections with optional add button
 */
export default function SectionHeader({ id, title, editMode, onAdd, addLabel }) {
  const { t } = useTranslation();

  return (
    <div
      className="sectionheader-container"
    >
      <h2
        id={id}
        className="sectionheader-title"
      >
        {title}
      </h2>
      {editMode && onAdd && (
        <SecondaryButton
          onClick={onAdd}
          className="sectionheader-add-btn"
          aria-label={addLabel || t('cv.editor.sectionHeader.addEntryAria', { section: title })}
          leftIcon={<Plus size={16} />}
        >
          {t('common.add')}
        </SecondaryButton>
      )}
    </div>
  );
}

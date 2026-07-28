import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Upload, Send, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import './CVHeader.css';

/**
 * CVHeader Component
 * Sidebar with title and action buttons
 */
export default function CVHeader({
  editMode,
  saving,
  onEdit,
  onCancelEdit,
  onSave,
  onUpload,
  onDelete,
  onSubmitToOrg,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div
      className="cvheader-sidebar"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="cvheader-back-btn"
        aria-label={t('cv.backToDashboard')}
      >
        <ArrowLeft size={18} />
        {t('cv.backToDashboard')}
      </button>

      <h1
        className="cvheader-title"
      >
        {t('cv.myCV')}
      </h1>

      <div
        className="cvheader-actions"
      >
        {!editMode ? (
          <>
            <SecondaryButton
              onClick={onEdit}
              aria-label={t('cv.editor.header.aria.edit')}
              className="cvheader-full-width"
              leftIcon={<Edit size={16} />}
            >
              {t('cv.editCV')}
            </SecondaryButton>
            <SecondaryButton
              onClick={onUpload}
              aria-label={t('cv.editor.header.aria.upload')}
              className="cvheader-full-width"
              leftIcon={<Upload size={16} />}
            >
              {t('cv.editor.header.uploadNew')}
            </SecondaryButton>
            {onSubmitToOrg && (
              <PrimaryButton
                onClick={onSubmitToOrg}
                aria-label={t('cv.editor.header.aria.submitToOrg')}
                className="cvheader-full-width"
                leftIcon={<Send size={16} />}
              >
                {t('cv.submitToOrg')}
              </PrimaryButton>
            )}
            <SecondaryButton
              onClick={onDelete}
              className="cvheader-delete-btn"
              aria-label={t('cv.editor.header.aria.delete')}
              leftIcon={<Trash2 size={16} />}
            >
              {t('cv.deleteCV')}
            </SecondaryButton>
          </>
        ) : (
          <>
            <SecondaryButton
              onClick={onCancelEdit}
              disabled={saving}
              aria-label={t('cv.editor.header.aria.cancelEdit')}
              className="cvheader-full-width"
              leftIcon={<X size={16} />}
            >
              {t('common.cancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={onSave}
              disabled={saving}
              aria-label={t('cv.editor.header.aria.save')}
              className="cvheader-full-width"
              leftIcon={<Save size={16} />}
            >
              {saving ? t('common.saving') : t('profile.saveChanges')}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}

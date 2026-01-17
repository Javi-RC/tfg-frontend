import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Upload, Send, Trash2, Save, X } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

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
  onSubmitToOrg
}) {
  const { t } = useTranslation();

  return (
    <div style={{
      position: 'fixed',
      left: '0',
      top: '64px',
      width: '280px',
      height: 'calc(100vh - 64px)',
      background: 'white',
      boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        letterSpacing: '-0.5px',
        margin: 0,
        paddingBottom: '24px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        {t('cv.myCV')}
      </h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        flex: 1
      }}>
        {!editMode ? (
          <>
            <SecondaryButton 
              onClick={onEdit} 
              aria-label={t('cv.editor.header.aria.edit')}
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<Edit size={16} />}
            >
              {t('cv.editCV')}
            </SecondaryButton>
            <SecondaryButton 
              onClick={onUpload} 
              aria-label={t('cv.editor.header.aria.upload')}
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<Upload size={16} />}
            >
              {t('cv.editor.header.uploadNew')}
            </SecondaryButton>
            {onSubmitToOrg && (
              <PrimaryButton 
                onClick={onSubmitToOrg} 
                aria-label={t('cv.editor.header.aria.submitToOrg')}
                style={{ width: '100%', justifyContent: 'center' }}
                leftIcon={<Send size={16} />}
              >
                {t('cv.submitToOrg')}
              </PrimaryButton>
            )}
            <SecondaryButton 
              onClick={onDelete}
              style={{ 
                width: '100%', 
                justifyContent: 'center',
                color: '#c0392b', 
                borderColor: '#c0392b' 
              }}
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
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<X size={16} />}
            >
              {t('common.cancel')}
            </SecondaryButton>
            <PrimaryButton 
              onClick={onSave} 
              disabled={saving} 
              aria-label={t('cv.editor.header.aria.save')}
              style={{ width: '100%', justifyContent: 'center' }}
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

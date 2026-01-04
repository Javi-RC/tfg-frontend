import React from 'react';
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
        My CV
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
              aria-label="Edit CV information"
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<Edit size={16} />}
            >
              Edit
            </SecondaryButton>
            <SecondaryButton 
              onClick={onUpload} 
              aria-label="Upload a new CV"
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<Upload size={16} />}
            >
              Upload New
            </SecondaryButton>
            {onSubmitToOrg && (
              <PrimaryButton 
                onClick={onSubmitToOrg} 
                aria-label="Submit CV to organization"
                style={{ width: '100%', justifyContent: 'center' }}
                leftIcon={<Send size={16} />}
              >
                Submit to Organization
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
              aria-label="Delete current CV"
              leftIcon={<Trash2 size={16} />}
            >
              Delete
            </SecondaryButton>
          </>
        ) : (
          <>
            <SecondaryButton 
              onClick={onCancelEdit} 
              disabled={saving} 
              aria-label="Cancel editing"
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<X size={16} />}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton 
              onClick={onSave} 
              disabled={saving} 
              aria-label="Save CV changes"
              style={{ width: '100%', justifyContent: 'center' }}
              leftIcon={<Save size={16} />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}

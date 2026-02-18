import React from 'react';
import { Mail, Shield, Building2, Globe, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';

/**
 * ProfileHeader Component
 * Displays user avatar, name, email, role and basic info
 */
export default function ProfileHeader({
  displayName,
  email,
  role,
  isAdmin,
  userInitial,
  profileUser,
  organizationDisplay,
  editMode,
  saving,
  onStartEditing,
  onCancelEditing,
  onSaveProfile
}) {
  const { t } = useTranslation();
  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const formatText = (value) => (typeof value === 'string' && value.trim() ? value : '—');

  return (
    <div style={{
      padding: '40px',
      borderBottom: '1px solid #e2e8f0'
    }}>
      {/* Header Row with Avatar, Info and Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Left: Avatar and Basic Info */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flex: '1' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} aria-label={t('profile.aria.avatar')}>
            {profileUser?.avatar ? (
              <img
                src={profileUser.avatar}
                alt="User avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'white'
              }}>
                {userInitial}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}>
              {displayName}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#718096',
              marginBottom: '12px'
            }}>
              <Mail size={14} />
              <span>{email || '—'}</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: isAdmin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              color: isAdmin ? 'white' : '#4a5568',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Shield size={13} />
              {role === 'org_admin' ? t('profile.organizationAdmin') : role === 'employee' ? t('profile.employee') : (role || '—')}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexShrink: 0
        }}>
          {!editMode ? (
            <SecondaryButton 
              onClick={onStartEditing} 
              style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
              aria-label={t('profile.aria.editProfile')}
            >
              {t('profile.editProfile')}
            </SecondaryButton>
          ) : (
            <>
              <SecondaryButton 
                onClick={onCancelEditing} 
                disabled={saving} 
                style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
                aria-label={t('profile.aria.cancelEditing')}
              >
                {t('common.cancel')}
              </SecondaryButton>
              <PrimaryButton 
                onClick={onSaveProfile} 
                disabled={saving} 
                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '500' }}
                aria-label={t('profile.aria.saveChanges')}
              >
                {saving ? t('profile.saving') : t('profile.saveChanges')}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div>
          <div style={{
            ...labelStyle,
            color: '#718096',
            fontSize: '11px',
            marginBottom: '6px'
          }}>
            {t('profile.organization')}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#2d3748',
            fontWeight: '500'
          }}>
            <Building2 size={16} color="#a0aec0" />
            {organizationDisplay}
          </div>
        </div>

        <div>
          <div style={{
            ...labelStyle,
            color: '#718096',
            fontSize: '11px',
            marginBottom: '6px'
          }}>
            {t('profile.location')}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#2d3748',
            fontWeight: '500'
          }}>
            <Globe size={16} color="#a0aec0" />
            {formatText(profileUser?.country)}
          </div>
        </div>

        <div>
          <div style={{
            ...labelStyle,
            color: '#718096',
            fontSize: '11px',
            marginBottom: '6px'
          }}>
            {t('profile.timezone')}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#2d3748',
            fontWeight: '500'
          }}>
            <Clock size={16} color="#a0aec0" />
            {formatText(profileUser?.timezone)}
          </div>
        </div>
      </div>
    </div>
  );
}

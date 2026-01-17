import React from 'react';
import { User, Mail, Shield, Building2, Globe, Clock } from 'lucide-react';
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
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start'
      }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '999px',
            overflow: 'hidden',
            background: '#f0f4f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e2e8f0',
            flex: '0 0 auto'
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
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: '700',
                color: '#4a5568'
              }}>
                {userInitial}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <User size={28} color="#666" />
              {displayName}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Mail size={16} color="#999" />
              {email || '—'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              background: isAdmin ? '#e8f4f8' : '#f0f0f0',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              color: isAdmin ? '#0066cc' : '#666',
              marginTop: '8px'
            }}>
              <Shield size={14} />
              {role || '—'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          {!editMode ? (
            <SecondaryButton 
              onClick={onStartEditing} 
              style={{ padding: '12px 18px' }}
              aria-label={t('profile.aria.editProfile')}
            >
              {t('profile.editProfile')}
            </SecondaryButton>
          ) : (
            <>
              <SecondaryButton 
                onClick={onCancelEditing} 
                disabled={saving} 
                style={{ padding: '12px 18px' }}
                aria-label={t('profile.aria.cancelEditing')}
              >
                {t('common.cancel')}
              </SecondaryButton>
              <PrimaryButton 
                onClick={onSaveProfile} 
                disabled={saving} 
                style={{ padding: '14px 22px' }}
                aria-label={t('profile.aria.saveChanges')}
              >
                {saving ? t('profile.saving') : t('profile.saveChanges')}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f0f0f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        <div>
          <div style={labelStyle}>{t('profile.organization')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color="#999" />
            {organizationDisplay}
          </p>
        </div>

        <div>
          <div style={labelStyle}>{t('profile.location')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#999" />
            {formatText(profileUser?.country)}
          </p>
        </div>

        <div>
          <div style={labelStyle}>{t('profile.timezone')}</div>
          <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#999" />
            {formatText(profileUser?.timezone)}
          </p>
        </div>
      </div>
    </div>
  );
}

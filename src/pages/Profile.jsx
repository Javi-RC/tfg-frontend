import React, { useEffect, useState, useContext } from 'react';
import { getProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export default function Profile() {
  const { logout, user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isAdmin = authUser?.role === 'org_admin';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Error loading profile</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '104px 20px 40px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
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
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>
                {profile.username || profile.name || 'User'}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#666',
                marginBottom: '4px'
              }}>
                {profile.email}
              </p>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: isAdmin ? '#e8f4f8' : '#f0f0f0',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                color: isAdmin ? '#0066cc' : '#666',
                marginTop: '8px'
              }}>
                {profile.role}
              </div>
            </div>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#999',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0'
          }}>
            Member since: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>

        {/* CV Management Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>
            CV Management
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            Manage your curriculum vitae and view statistics
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <PrimaryButton
              onClick={() => window.location.href = '/my-cv'}
              style={{ width: '100%' }}
            >
              My CV
            </PrimaryButton>
            <SecondaryButton
              onClick={() => window.location.href = '/cv-stats'}
              style={{ width: '100%' }}
            >
              View Statistics
            </SecondaryButton>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e8f4f8'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '16px'
            }}>
              Admin Panel
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              Access administrative features and manage all CVs
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <PrimaryButton
                onClick={() => window.location.href = '/admin/cvs'}
                style={{
                  width: '100%',
                  background: '#0066cc'
                }}
              >
                View All CVs
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

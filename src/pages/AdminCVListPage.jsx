import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Search, X, RefreshCcw } from 'lucide-react';
import { useAdminCVList } from '../hooks/useAdminCVList';
import SecondaryButton from '../components/SecondaryButton';
import CVSearchPanel from '../components/CVSearchPanel';
import AdminCVCard from '../components/cv/admin/AdminCVCard';
import AdminCVDetailPanel from '../components/cv/admin/AdminCVDetailPanel';

/**
 * AdminCVListPage Component
 * Admin-only page to view and manage all CVs
 */
export default function AdminCVListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cvs,
    filteredCVs,
    loading,
    error,
    selectedCV,
    showSearch,
    setSelectedCV,
    loadAllCVs,
    handleSearchResults,
    handleResetSearch,
    toggleSearch
  } = useAdminCVList();

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
        <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">{t('cv.loadingCVs')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }} role="alert" aria-live="assertive">
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true">🚫</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('errors.unauthorized')}
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {error}
          </p>
          <SecondaryButton onClick={() => navigate('/')} aria-label={t('common.back')}>
            {t('common.back')}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '124px 24px 60px'
    }} role="main" aria-label={t('cv.admin.aria.page')}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {t('cv.admin.allCVsCount', { count: filteredCVs.length })}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SecondaryButton onClick={toggleSearch} aria-label={showSearch ? t('cv.admin.aria.hideSearch') : t('cv.admin.aria.showSearch')} leftIcon={showSearch ? <X size={16} /> : <Search size={16} />}>
              {showSearch ? t('cv.admin.hideSearch') : t('cv.admin.searchCVs')}
            </SecondaryButton>
            {filteredCVs.length !== cvs.length && (
              <SecondaryButton onClick={handleResetSearch} aria-label={t('cv.admin.aria.resetFilters')} leftIcon={<X size={16} />}>
                {t('cv.admin.resetFilters')}
              </SecondaryButton>
            )}
            <SecondaryButton onClick={loadAllCVs} aria-label={t('cv.admin.aria.refreshList')} leftIcon={<RefreshCcw size={16} />}>
              {t('common.refresh')}
            </SecondaryButton>
          </div>
        </div>

        {showSearch && (
          <div style={{ marginBottom: '24px' }}>
            <CVSearchPanel 
              onSearchResults={handleSearchResults}
              totalCVs={cvs.length}
            />
          </div>
        )}

        {filteredCVs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }} role="status">
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true"><FileText size={64} color="#9ca3af" /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
              {t('cv.admin.noCVsFound')}
            </h2>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {cvs.length === 0 ? t('cv.admin.noCVsUploaded') : t('cv.admin.noMatchingCVs')}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedCV ? '1fr 400px' : '1fr',
            gap: '24px'
          }}>
            <div style={{
              display: 'grid',
              gap: '20px'
            }} role="list" aria-label={t('cv.admin.aria.cvList')}>
              {filteredCVs.map((cv) => (
                <AdminCVCard
                  key={cv._id}
                  cv={cv}
                  onClick={() => setSelectedCV(cv)}
                  isSelected={selectedCV?._id === cv._id}
                />
              ))}
            </div>

            {selectedCV && (
              <div style={{
                position: 'sticky',
                top: '20px',
                height: 'fit-content'
              }}>
                <AdminCVDetailPanel
                  cv={selectedCV}
                  onClose={() => setSelectedCV(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

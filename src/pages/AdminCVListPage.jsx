import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Search, X, RefreshCcw } from 'lucide-react';
import { useAdminCVList } from '../hooks/useAdminCVList';
import SecondaryButton from '../components/SecondaryButton';
import CVSearchPanel from '../components/CVSearchPanel';
import AdminCVCard from '../components/cv/admin/AdminCVCard';
import AdminCVDetailPanel from '../components/cv/admin/AdminCVDetailPanel';
import './AdminCVListPage.css';

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
    toggleSearch,
  } = useAdminCVList();

  if (loading) {
    return (
      <div className="admin-cv-list-loading">
        <p className="cv-stats-status-text" role="status" aria-live="polite">
          {t('cv.loadingCVs')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-cv-list-error">
        <div className="admin-cv-list-error-card" role="alert" aria-live="assertive">
          <div className="admin-cv-list-error-icon" aria-hidden="true">
            🚫
          </div>
          <h2 className="admin-cv-list-error-title">
            {t('errors.unauthorized')}
          </h2>
          <p className="admin-cv-list-error-text">{error}</p>
          <SecondaryButton onClick={() => navigate('/')} aria-label={t('common.back')}>
            {t('common.back')}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <main className="admin-cv-list-page" aria-label={t('cv.admin.aria.page')}>
      <div className="admin-cv-list-container">
        <div className="admin-cv-list-header">
          <h1 className="admin-cv-list-title">
            {t('cv.admin.allCVsCount', { count: filteredCVs.length })}
          </h1>
          <div className="admin-cv-list-actions">
            <SecondaryButton
              onClick={toggleSearch}
              aria-label={
                showSearch ? t('cv.admin.aria.hideSearch') : t('cv.admin.aria.showSearch')
              }
              leftIcon={showSearch ? <X size={16} /> : <Search size={16} />}
            >
              {showSearch ? t('cv.admin.hideSearch') : t('cv.admin.searchCVs')}
            </SecondaryButton>
            {filteredCVs.length !== cvs.length && (
              <SecondaryButton
                onClick={handleResetSearch}
                aria-label={t('cv.admin.aria.resetFilters')}
                leftIcon={<X size={16} />}
              >
                {t('cv.admin.resetFilters')}
              </SecondaryButton>
            )}
            <SecondaryButton
              onClick={loadAllCVs}
              aria-label={t('cv.admin.aria.refreshList')}
              leftIcon={<RefreshCcw size={16} />}
            >
              {t('common.refresh')}
            </SecondaryButton>
          </div>
        </div>

        {showSearch && (
          <div className="admin-cv-list-search">
            <CVSearchPanel onSearchResults={handleSearchResults} totalCVs={cvs.length} />
          </div>
        )}

        {filteredCVs.length === 0 ? (
          <div className="admin-cv-list-empty" role="status">
            <div className="admin-cv-list-empty-icon" aria-hidden="true">
              <FileText size={64} color="#9ca3af" />
            </div>
            <h2 className="admin-cv-list-empty-title">
              {t('cv.admin.noCVsFound')}
            </h2>
            <p className="admin-cv-list-empty-text">
              {cvs.length === 0 ? t('cv.admin.noCVsUploaded') : t('cv.admin.noMatchingCVs')}
            </p>
          </div>
        ) : (
          <div className={`admin-cv-list-grid${selectedCV ? ' admin-cv-list-grid--with-detail' : ''}`}>
            <ul className="admin-cv-list-ul" aria-label={t('cv.admin.aria.cvList')}>
              {filteredCVs.map((cv) => (
                <AdminCVCard
                  key={cv._id}
                  cv={cv}
                  onClick={() => setSelectedCV(cv)}
                  isSelected={selectedCV?._id === cv._id}
                />
              ))}
            </ul>

            {selectedCV && (
              <div className="admin-cv-list-detail">
                <AdminCVDetailPanel cv={selectedCV} onClose={() => setSelectedCV(null)} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

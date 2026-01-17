import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, Filter } from 'lucide-react';
import { searchCVs } from '../api/cv';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

/**
 * CVSearchPanel Component
 * Provides search functionality for CVs by skills and languages
 * Admin-only component
 */
export default function CVSearchPanel({ onSearchResults, totalCVs }) {
  const { t } = useTranslation();
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearchResults, setLastSearchResults] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setSearching(true);

    const skillsArray = skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const languagesArray = languages
      .split(',')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (skillsArray.length === 0 && languagesArray.length === 0) {
      setError(t('cv.search.errors.emptySearch'));
      setSearching(false);
      return;
    }

    try {
      const response = await searchCVs({
        skills: skillsArray,
        languages: languagesArray
      });

      // Backend response: { success: true, count: 5, cvs: [...] }
      const results = response.data?.cvs || response.data;
      const count = response.data?.count || results.length;
      
      setLastSearchResults({
        count: count,
        skills: skillsArray,
        languages: languagesArray
      });

      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('cv.search.errors.searchFailed'));
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSkills('');
    setLanguages('');
    setError(null);
    setLastSearchResults(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px 28px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }} role="region" aria-label={t('cv.search.aria.panel')}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Search size={20} />
        {t('cv.search.title')}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label
            htmlFor="skills-input"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}
          >
            {t('cv.search.skillsLabel')}
          </label>
          <input
            id="skills-input"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('cv.search.skillsPlaceholder')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#111'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <p style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '6px'
          }}>
            {t('cv.search.skillsHint')}
          </p>
        </div>

        <div>
          <label
            htmlFor="languages-input"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}
          >
            {t('cv.search.languagesLabel')}
          </label>
          <input
            id="languages-input"
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('cv.search.languagesPlaceholder')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#111'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <p style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '6px'
          }}>
            {t('cv.search.languagesHint')}
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c0392b',
          fontSize: '14px',
          marginBottom: '16px'
        }} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {lastSearchResults && (
        <div style={{
          padding: '12px 16px',
          background: '#e8f4f8',
          border: '1px solid #b3d9e8',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px',
          color: '#0066cc'
        }} role="status" aria-live="polite">
          <strong>{t('cv.search.results.title')}</strong> {t('cv.search.results.found', { count: lastSearchResults.count, total: totalCVs })}
          {lastSearchResults.skills.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              {t('cv.search.results.skills')} {lastSearchResults.skills.join(', ')}
            </div>
          )}
          {lastSearchResults.languages.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              {t('cv.search.results.languages')} {lastSearchResults.languages.join(', ')}
            </div>
          )}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <SecondaryButton
          onClick={handleClear}
          disabled={searching}
          aria-label={t('cv.search.aria.clear')}
        >
          {t('cv.search.clear')}
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSearch}
          disabled={searching || (!skills && !languages)}
          aria-label={searching ? t('cv.search.aria.searching') : t('cv.search.aria.search')}
        >
          {searching ? t('cv.search.searching') : t('cv.search.button')}
        </PrimaryButton>
      </div>

      <div style={{
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #f0f0f0'
      }} role="complementary" aria-label={t('cv.search.tips.aria')}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#666'
        }}>
          {t('cv.search.tips.title')}
        </h4>
        <ul style={{
          fontSize: '13px',
          color: '#999',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li style={{ marginBottom: '4px' }}>
            {t('cv.search.tips.tip1')}
          </li>
          <li style={{ marginBottom: '4px' }}>
            {t('cv.search.tips.tip2')}
          </li>
          <li style={{ marginBottom: '4px' }}>
            {t('cv.search.tips.tip3')}
          </li>
          <li>
            {t('cv.search.tips.tip4')}
          </li>
        </ul>
      </div>
    </div>
  );
}

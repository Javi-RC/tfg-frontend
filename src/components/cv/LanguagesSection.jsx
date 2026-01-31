import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

/**
 * LanguagesSection Component
 * Languages section with badges
 */
export default function LanguagesSection({ 
  cv,
  editData,
  editMode,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage
}) {
  const { t } = useTranslation();
  const languages = editMode ? editData?.languages : cv?.languages;
  if (!languages) return null;

  const formatLanguageLevel = (level) => {
    const mapping = {
      'native': t('cv.native'),
      'bilingual': t('cv.bilingual'),
      'fluent': t('cv.fluent'),
      'advanced': t('cv.advanced'),
      'intermediate': t('cv.intermediate'),
      'beginner': t('cv.beginner'),
      // Legacy Spanish values for backward compatibility
      'nativo': t('cv.native'),
      'bilingüe': t('cv.bilingual'),
      'bilingüé': t('cv.bilingual'),
      'fluido': t('cv.fluent'),
      'avanzado': t('cv.advanced'),
      'intermedio': t('cv.intermediate'),
      'básico': t('cv.beginner')
    };

    return mapping[level] || level;
  };

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="languages-heading">
      <SectionHeader 
        id="languages-heading" 
        title={t('cv.languages')} 
      />
      {editMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {languages.map((lang, index) => {
            const langObj = typeof lang === 'string' ? { language: lang, level: '' } : lang;
            return (
              <div key={lang._id || index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '12px',
                alignItems: 'end',
                padding: '12px',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <Field
                  editable={true}
                  label={t('cv.language')}
                  value={langObj.language}
                  onChange={(value) => onLanguageChange(index, 'language', value)}
                  placeholder={t('cv.editor.languages.fields.language.placeholder')}
                  required
                />
                <Field
                  editable={true}
                  label={t('cv.level')}
                  type="select"
                  value={langObj.level}
                  onChange={(value) => onLanguageChange(index, 'level', value)}
                  placeholder={t('cv.editor.languages.fields.level.placeholder')}
                  options={[
                    { value: 'nativo', label: t('cv.native') },
                    { value: 'bilingüé', label: t('cv.bilingual') },
                    { value: 'fluido', label: t('cv.fluent') },
                    { value: 'avanzado', label: t('cv.advanced') },
                    { value: 'intermedio', label: t('cv.intermediate') },
                    { value: 'básico', label: t('cv.beginner') },
                    'A1',
                    'A2',
                    'B1',
                    'B2',
                    'C1',
                    'C2'
                  ]}
                  required
                />
                <button
                  onClick={() => onRemoveLanguage(index)}
                  style={{
                    padding: '8px 12px',
                    background: '#fee',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#c33',
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginBottom: '2px'
                  }}
                  aria-label={t('cv.editor.languages.removeLabel', {
                    language: langObj.language || t('cv.editor.entry')
                  })}
                >
                  {t('common.remove')}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {languages.map((lang, index) => (
            <span key={lang._id || index} style={{
              padding: '8px 18px',
              background: '#fef5e7',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#975a16',
              border: '1px solid #f9e3b8'
            }}>
              {typeof lang === 'string' ? lang : `${lang.language} (${formatLanguageLevel(lang.level)})`}
            </span>
          ))}
        </div>
      )}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddLanguage}
            aria-label={t('cv.editor.languages.actions.addAria')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + {t('cv.addLanguage')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

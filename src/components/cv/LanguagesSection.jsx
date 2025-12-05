import React from 'react';
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
  const languages = editMode ? editData?.languages : cv?.languages;
  if (!languages) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="languages-heading">
      <SectionHeader 
        id="languages-heading" 
        title="Languages" 
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
                  label="Language"
                  value={langObj.language}
                  onChange={(value) => onLanguageChange(index, 'language', value)}
                  placeholder="e.g. English"
                  required
                />
                <Field
                  editable={true}
                  label="Level"
                  type="select"
                  value={langObj.level}
                  onChange={(value) => onLanguageChange(index, 'level', value)}
                  placeholder="Select level"
                  options={['nativo', 'bilingüe', 'fluido', 'avanzado', 'intermedio', 'básico', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
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
                  aria-label={`Remove language: ${langObj.language || 'entry'}`}
                >
                  Remove
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
              {typeof lang === 'string' ? lang : `${lang.language} (${lang.level})`}
            </span>
          ))}
        </div>
      )}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddLanguage}
            aria-label="Add new language"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Language
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';
import './LanguagesSection.css';

const LEVEL_ORDER = ['native', 'bilingual', 'fluent', 'advanced', 'intermediate', 'beginner'];

export default function LanguagesSection({
  cv,
  editData,
  editMode,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
}) {
  const { t } = useTranslation();
  const languages = editMode ? editData?.languages : cv?.languages;
  if (!languages) return null;

  const formatLanguageLevel = (level) => {
    const mapping = {
      native: t('cv.native'),
      bilingual: t('cv.bilingual'),
      fluent: t('cv.fluent'),
      advanced: t('cv.advanced'),
      intermediate: t('cv.intermediate'),
      beginner: t('cv.beginner'),
      nativo: t('cv.native'),
      bilingüe: t('cv.bilingual'),
      bilingüé: t('cv.bilingual'),
      fluido: t('cv.fluent'),
      avanzado: t('cv.advanced'),
      intermedio: t('cv.intermediate'),
      básico: t('cv.beginner'),
    };
    return mapping[level] || level;
  };

  if (!editMode) {
    const sorted = [...languages].sort((a, b) => {
      const aLevel = typeof a === 'string' ? '' : a.level;
      const bLevel = typeof b === 'string' ? '' : b.level;
      return (LEVEL_ORDER.indexOf(aLevel) || 999) - (LEVEL_ORDER.indexOf(bLevel) || 999);
    });

    return (
      <section className="languagessection-section" aria-labelledby="languages-heading">
        <SectionHeader id="languages-heading" title={t('cv.languages')} />
        <div className="languagessection-badge-list">
          {sorted.map((lang) => {
            const name = typeof lang === 'string' ? lang : lang.language;
            const level = typeof lang === 'string' ? '' : lang.level;
            return (
              <span key={lang._id || lang} className="languagessection-badge">
                <Languages size={14} />
                {name}
                {level && <span className="languagessection-level">{formatLanguageLevel(level)}</span>}
              </span>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="languagessection-section" aria-labelledby="languages-heading">
      <SectionHeader id="languages-heading" title={t('cv.languages')} />
      <div className="languagessection-edit-list">
        {languages.map((lang, index) => {
          const langObj = typeof lang === 'string' ? { language: lang, level: '' } : lang;
          return (
            <div key={lang._id} className="languagessection-edit-row">
              <Field editable label={t('cv.language')} value={langObj.language} onChange={(value) => onLanguageChange(index, 'language', value)} placeholder={t('cv.editor.languages.fields.language.placeholder')} required />
              <Field editable label={t('cv.level')} type="select" value={langObj.level} onChange={(value) => onLanguageChange(index, 'level', value)} placeholder={t('cv.editor.languages.fields.level.placeholder')} options={[
                { value: 'nativo', label: t('cv.native') },
                { value: 'bilingüé', label: t('cv.bilingual') },
                { value: 'fluido', label: t('cv.fluent') },
                { value: 'avanzado', label: t('cv.advanced') },
                { value: 'intermedio', label: t('cv.intermediate') },
                { value: 'básico', label: t('cv.beginner') },
                'A1', 'A2', 'B1', 'B2', 'C1', 'C2',
              ]} required />
              <button type="button" onClick={() => onRemoveLanguage(index)} className="languagessection-remove-btn" aria-label={t('cv.editor.languages.removeLabel', { language: langObj.language || t('cv.editor.entry') })}>
                {t('common.remove')}
              </button>
            </div>
          );
        })}
      </div>
      {editMode && (
        <div className="languagessection-add-wrapper">
          <PrimaryButton onClick={onAddLanguage} aria-label={t('cv.editor.languages.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            + {t('cv.addLanguage')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

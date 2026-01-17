import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import Field from './Field';

/**
 * ContactSection Component
 * Contact information section with grid layout
 */
export default function ContactSection({ 
  cv, 
  editData, 
  editMode, 
  onContactChange,
  onContactLocationChange,
  onContactLinksChange,
  onContactPhoneChange,
  onContactPhoneTypeChange
}) {
  const { t } = useTranslation();
  const contact = editMode ? editData?.contact : cv?.contact;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="contact-heading">
      <SectionHeader id="contact-heading" title={t('cv.editor.contact.sectionTitle')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 32px' }}>
        <Field
          editable={editMode}
          label={t('cv.email')}
          type="email"
          value={contact?.email}
          onChange={(value) => onContactChange('email', value)}
          placeholder={t('cv.editor.contact.fields.email.placeholder')}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <Field
            editable={editMode}
            label={t('cv.phone')}
            type="tel"
            value={contact?.phones?.[0]?.number}
            onChange={onContactPhoneChange}
            placeholder={t('cv.editor.contact.fields.phone.placeholder')}
          />
          {editMode && (
            <Field
              editable={editMode}
              label={t('cv.editor.contact.fields.phoneType.label')}
              type="select"
              value={contact?.phones?.[0]?.type || 'mobile'}
              onChange={onContactPhoneTypeChange}
              options={[
                { value: 'mobile', label: t('cv.editor.contact.phoneTypes.mobile') },
                { value: 'home', label: t('cv.editor.contact.phoneTypes.home') },
                { value: 'work', label: t('cv.editor.contact.phoneTypes.work') }
              ]}
            />
          )}
        </div>
        <Field
          editable={editMode}
          label={t('cv.editor.contact.fields.city.label')}
          value={contact?.location?.city}
          onChange={(value) => onContactLocationChange('city', value)}
          placeholder={t('cv.editor.contact.fields.city.placeholder')}
        />
        <Field
          editable={editMode}
          label={t('cv.editor.contact.fields.country.label')}
          value={contact?.location?.country}
          onChange={(value) => onContactLocationChange('country', value)}
          placeholder={t('cv.editor.contact.fields.country.placeholder')}
        />
        <Field
          editable={editMode}
          label={t('cv.linkedin')}
          type="url"
          value={contact?.links?.linkedin}
          onChange={(value) => onContactLinksChange('linkedin', value)}
          placeholder={t('cv.editor.contact.fields.linkedin.placeholder')}
        />
        <Field
          editable={editMode}
          label={t('cv.github')}
          type="url"
          value={contact?.links?.github}
          onChange={(value) => onContactLinksChange('github', value)}
          placeholder={t('cv.editor.contact.fields.github.placeholder')}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <Field
            editable={editMode}
            label={t('cv.editor.contact.fields.portfolio.label')}
            type="url"
            value={contact?.links?.portfolio}
            onChange={(value) => onContactLinksChange('portfolio', value)}
            placeholder={t('cv.editor.contact.fields.portfolio.placeholder')}
          />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
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
  onContactPhoneTypeChange,
}) {
  const { t } = useTranslation();
  const contact = editMode ? editData?.contact : cv?.contact;

  if (!contact) return null;

  if (!editMode) {
    const items = [
      { icon: Mail, label: t('cv.email'), value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
      { icon: Phone, label: t('cv.phone'), value: contact.phones?.[0]?.number, href: contact.phones?.[0]?.number ? `tel:${contact.phones[0].number}` : null },
      { icon: MapPin, label: t('cv.editor.contact.fields.city.label'), value: [contact.location?.city, contact.location?.country].filter(Boolean).join(', ') },
      { icon: Linkedin, label: 'LinkedIn', value: contact.links?.linkedin, href: contact.links?.linkedin },
      { icon: Github, label: 'GitHub', value: contact.links?.github, href: contact.links?.github },
      { icon: Globe, label: t('cv.editor.contact.fields.portfolio.label'), value: contact.links?.portfolio, href: contact.links?.portfolio },
    ].filter(item => item.value);

    if (items.length === 0) return null;

    return (
      <section style={{ marginBottom: '48px' }} aria-labelledby="contact-heading">
        <SectionHeader id="contact-heading" title={t('cv.editor.contact.sectionTitle')} />
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--color-bg-muted)',
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid var(--color-border)',
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 4px 4px 0',
              fontSize: '14px',
              color: 'var(--color-text-body)',
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                <item.icon size={15} />
              </span>
              {item.href ? (
                <a href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    lineHeight: '1.3',
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <span style={{ lineHeight: '1.3' }}>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '48px' }} aria-labelledby="contact-heading">
      <SectionHeader id="contact-heading" title={t('cv.editor.contact.sectionTitle')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
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
                { value: 'work', label: t('cv.editor.contact.phoneTypes.work') },
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

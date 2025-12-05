import React from 'react';
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
  const contact = editMode ? editData?.contact : cv?.contact;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="contact-heading">
      <SectionHeader id="contact-heading" title="Contact Information" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 32px' }}>
        <Field
          editable={editMode}
          label="Email"
          type="email"
          value={contact?.email}
          onChange={(value) => onContactChange('email', value)}
          placeholder="Enter email address"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <Field
            editable={editMode}
            label="Phone"
            type="tel"
            value={contact?.phones?.[0]?.number}
            onChange={onContactPhoneChange}
            placeholder="Enter phone number"
          />
          {editMode && (
            <Field
              editable={editMode}
              label="Type"
              type="select"
              value={contact?.phones?.[0]?.type || 'mobile'}
              onChange={onContactPhoneTypeChange}
              options={['mobile', 'home', 'work']}
            />
          )}
        </div>
        <Field
          editable={editMode}
          label="City"
          value={contact?.location?.city}
          onChange={(value) => onContactLocationChange('city', value)}
          placeholder="Enter city"
        />
        <Field
          editable={editMode}
          label="Country"
          value={contact?.location?.country}
          onChange={(value) => onContactLocationChange('country', value)}
          placeholder="Enter country"
        />
        <Field
          editable={editMode}
          label="LinkedIn"
          type="url"
          value={contact?.links?.linkedin}
          onChange={(value) => onContactLinksChange('linkedin', value)}
          placeholder="https://linkedin.com/in/..."
        />
        <Field
          editable={editMode}
          label="GitHub"
          type="url"
          value={contact?.links?.github}
          onChange={(value) => onContactLinksChange('github', value)}
          placeholder="https://github.com/..."
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <Field
            editable={editMode}
            label="Portfolio"
            type="url"
            value={contact?.links?.portfolio}
            onChange={(value) => onContactLinksChange('portfolio', value)}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </section>
  );
}

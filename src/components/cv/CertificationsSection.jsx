import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

/**
 * CertificationsSection Component
 * Certifications section
 */
export default function CertificationsSection({ 
  cv,
  editData,
  editMode,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification
}) {
  const { t } = useTranslation();
  const entryLabel = t('cv.editor.entry');

  const certifications = editMode ? editData?.certifications : cv?.certifications;
  if (!certifications) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="certifications-heading">
      <SectionHeader 
        id="certifications-heading" 
        title={t('cv.certifications')} 
      />
      {certifications.map((cert, index) => (
        <CVCard
          key={cert._id || index}
          editMode={editMode}
          borderColor="#f6ad55"
          onRemove={() => onRemoveCertification(index)}
          removeLabel={t('cv.editor.certifications.removeLabel', { name: cert.name || entryLabel })}
          style={{ marginBottom: '32px' }}
        >
          {editMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', rowGap: '16px' }}>
              <Field
                editable={true}
                label={t('cv.editor.certifications.fields.name.label')}
                value={cert.name}
                onChange={(value) => onCertificationChange(index, 'name', value)}
                placeholder={t('cv.editor.certifications.fields.name.placeholder')}
                required
              />
              <Field
                editable={true}
                label={t('cv.editor.certifications.fields.issuer.label')}
                value={cert.issuer}
                onChange={(value) => onCertificationChange(index, 'issuer', value)}
                placeholder={t('cv.editor.certifications.fields.issuer.placeholder')}
              />
              <Field
                editable={true}
                label={t('cv.editor.certifications.fields.dateObtained.label')}
                value={cert.dateObtained}
                onChange={(value) => onCertificationChange(index, 'dateObtained', value)}
                placeholder={t('cv.editor.certifications.fields.dateObtained.placeholder')}
              />
              <Field
                editable={true}
                label={t('cv.editor.certifications.fields.credentialId.label')}
                value={cert.credentialId}
                onChange={(value) => onCertificationChange(index, 'credentialId', value)}
                placeholder={t('cv.editor.certifications.fields.credentialId.placeholder')}
              />
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                {cert.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#666' }}>
                {cert.issuer} • {cert.dateObtained}
              </p>
              {cert.credentialId && (
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  {t('cv.editor.certifications.fields.credentialId.displayPrefix')}: {cert.credentialId}
                </p>
              )}
            </>
          )}
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton 
            onClick={onAddCertification}
            aria-label={t('cv.editor.certifications.actions.addAria')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            {t('cv.editor.certifications.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

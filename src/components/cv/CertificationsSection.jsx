import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import SectionHeader from './SectionHeader';
import CVCard from './CVCard';
import Field from './Field';
import PrimaryButton from '../PrimaryButton';

const CERT_COLOR = '#f6ad55';

export default function CertificationsSection({
  cv,
  editData,
  editMode,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification,
}) {
  const { t } = useTranslation();
  const certifications = editMode ? editData?.certifications : cv?.certifications;
  if (!certifications) return null;

  if (!editMode) {
    return (
      <section style={{ marginBottom: '48px' }} aria-labelledby="certifications-heading">
        <SectionHeader id="certifications-heading" title={t('cv.certifications')} />
        {certifications.map((cert) => (
          <CVCard key={cert._id} editMode={false} borderColor={CERT_COLOR}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(246, 173, 85, 0.12)', color: CERT_COLOR, flexShrink: 0, marginTop: '2px',
              }}>
                <Award size={16} />
              </div>
              <div style={{ flex: 1 }}>
                {cert.name && (
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{cert.name}</h3>
                )}
                {(cert.issuer || cert.dateObtained) && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0' }}>
                    {[cert.issuer, cert.dateObtained].filter(Boolean).join(' • ')}
                  </p>
                )}
                {cert.credentialId && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    {t('cv.editor.certifications.fields.credentialId.displayPrefix')}: {cert.credentialId}
                  </p>
                )}
              </div>
            </div>
          </CVCard>
        ))}
      </section>
    );
  }

  return (
    <section style={{ marginBottom: '48px' }} aria-labelledby="certifications-heading">
      <SectionHeader id="certifications-heading" title={t('cv.certifications')} />
      {certifications.map((cert, index) => (
        <CVCard key={cert._id} editMode={editMode} borderColor={CERT_COLOR} onRemove={() => onRemoveCertification(index)} removeLabel={t('cv.editor.certifications.removeLabel', { name: cert.name || t('cv.editor.entry') })}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field editable label={t('cv.editor.certifications.fields.name.label')} value={cert.name} onChange={(value) => onCertificationChange(index, 'name', value)} placeholder={t('cv.editor.certifications.fields.name.placeholder')} required />
            <Field editable label={t('cv.editor.certifications.fields.issuer.label')} value={cert.issuer} onChange={(value) => onCertificationChange(index, 'issuer', value)} placeholder={t('cv.editor.certifications.fields.issuer.placeholder')} />
            <Field editable label={t('cv.editor.certifications.fields.dateObtained.label')} value={cert.dateObtained} onChange={(value) => onCertificationChange(index, 'dateObtained', value)} placeholder={t('cv.editor.certifications.fields.dateObtained.placeholder')} />
            <Field editable label={t('cv.editor.certifications.fields.credentialId.label')} value={cert.credentialId} onChange={(value) => onCertificationChange(index, 'credentialId', value)} placeholder={t('cv.editor.certifications.fields.credentialId.placeholder')} />
          </div>
        </CVCard>
      ))}
      {editMode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <PrimaryButton onClick={onAddCertification} aria-label={t('cv.editor.certifications.actions.addAria')} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600 }}>
            {t('cv.editor.certifications.actions.addButton')}
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

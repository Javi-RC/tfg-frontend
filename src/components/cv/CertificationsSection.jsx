import React from 'react';
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
  const certifications = editMode ? editData?.certifications : cv?.certifications;
  if (!certifications) return null;

  return (
    <section style={{ marginBottom: '56px' }} role="region" aria-labelledby="certifications-heading">
      <SectionHeader 
        id="certifications-heading" 
        title="Certifications" 
      />
      {certifications.map((cert, index) => (
        <CVCard
          key={cert._id || index}
          editMode={editMode}
          borderColor="#f6ad55"
          onRemove={() => onRemoveCertification(index)}
          removeLabel={`Remove certification: ${cert.name || 'entry'}`}
          style={{ marginBottom: '32px' }}
        >
          {editMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', rowGap: '16px' }}>
              <Field
                editable={true}
                label="Certification Name"
                value={cert.name}
                onChange={(value) => onCertificationChange(index, 'name', value)}
                placeholder="e.g. AWS Certified Developer"
                required
              />
              <Field
                editable={true}
                label="Issuer"
                value={cert.issuer}
                onChange={(value) => onCertificationChange(index, 'issuer', value)}
                placeholder="e.g. Amazon Web Services"
              />
              <Field
                editable={true}
                label="Date Obtained"
                value={cert.dateObtained}
                onChange={(value) => onCertificationChange(index, 'dateObtained', value)}
                placeholder="e.g. Jan 2024"
              />
              <Field
                editable={true}
                label="Credential ID"
                value={cert.credentialId}
                onChange={(value) => onCertificationChange(index, 'credentialId', value)}
                placeholder="Optional credential ID"
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
                  ID: {cert.credentialId}
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
            aria-label="Add new certification"
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
          >
            + Add Certification
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

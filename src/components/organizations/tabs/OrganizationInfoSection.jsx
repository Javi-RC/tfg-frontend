import React from 'react';
import { useTranslation } from 'react-i18next';

const emptyValue = '—';

export default function OrganizationInfoSection({ organization, styles }) {
  const { t } = useTranslation();

  return (
    <>
      <div style={styles.infoGrid}>
        <InfoItem label={t('organizations.overview.taxId')} value={organization.taxId} styles={styles} />
        <InfoItem label={t('organizations.overview.email')} value={organization.contact?.email} styles={styles} />
        <InfoItem label={t('organizations.overview.phone')} value={organization.contact?.phone} styles={styles} />
        <InfoItem label={t('organizations.overview.website')} value={organization.contact?.website} styles={styles} isLink />
        <InfoItem label={t('organizations.overview.industry')} value={organization.industry} styles={styles} />
        <InfoItem label={t('organizations.overview.companySize')} value={organization.size} styles={styles} />
      </div>

      <h3 style={styles.sectionTitle}>{t('organizations.overview.address')}</h3>
      <div style={styles.infoGrid}>
        <InfoItem label={t('organizations.overview.street')} value={organization.address?.street} styles={styles} />
        <InfoItem label={t('organizations.overview.city')} value={organization.address?.city} styles={styles} />
        <InfoItem label={t('organizations.overview.state')} value={organization.address?.state} styles={styles} />
        <InfoItem label={t('organizations.overview.postalCode')} value={organization.address?.postalCode} styles={styles} />
        <InfoItem label={t('organizations.overview.country')} value={organization.address?.country} styles={styles} />
      </div>
    </>
  );
}

function InfoItem({ label, value, styles, isLink }) {
  const displayValue = value || emptyValue;
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>
        {isLink && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {value}
          </a>
        ) : (
          displayValue
        )}
      </div>
    </div>
  );
}

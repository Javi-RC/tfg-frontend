import React from 'react';

/**
 * OverviewTab
 */
export default function OverviewTab({ organization, styles }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Organization Information</h2>

      <div style={styles.infoGrid}>
        {organization.taxId && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Tax ID</div>
            <div style={styles.infoValue}>{organization.taxId}</div>
          </div>
        )}

        {organization.contact?.email && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoValue}>{organization.contact.email}</div>
          </div>
        )}

        {organization.contact?.phone && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Phone</div>
            <div style={styles.infoValue}>{organization.contact.phone}</div>
          </div>
        )}

        {organization.contact?.website && (
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>Website</div>
            <div style={styles.infoValue}>
              <a
                href={organization.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {organization.contact.website}
              </a>
            </div>
          </div>
        )}
      </div>

      {organization.address && (
        <>
          <h3 style={styles.sectionTitle}>Address</h3>
          <div style={styles.infoGrid}>
            {organization.address.street && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Street</div>
                <div style={styles.infoValue}>{organization.address.street}</div>
              </div>
            )}
            {organization.address.city && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>City</div>
                <div style={styles.infoValue}>{organization.address.city}</div>
              </div>
            )}
            {organization.address.state && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>State</div>
                <div style={styles.infoValue}>{organization.address.state}</div>
              </div>
            )}
            {organization.address.postalCode && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Postal Code</div>
                <div style={styles.infoValue}>{organization.address.postalCode}</div>
              </div>
            )}
            {organization.address.country && (
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Country</div>
                <div style={styles.infoValue}>{organization.address.country}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

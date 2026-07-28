import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import SecondaryButton from '../components/SecondaryButton';

function RiskMetadataCard({ metadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.metadataCard}>
      <div
        style={styles.metadataHeader}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
      >
        <div style={styles.metadataTop}>
          <div>
            {metadata.isHofstedeRelated && <span style={styles.hofstedeBadge}>🌍 Hofstede</span>}
            <span style={styles.metadataType}>{metadata.type}</span>
          </div>
          <span style={styles.categoryBadge}>{metadata.category}</span>
        </div>

        <h3 style={styles.metadataTitle}>{metadata.title}</h3>
        <p style={styles.metadataDescription}>{metadata.description}</p>
      </div>

      {expanded && (
        <div style={styles.metadataDetails}>
          {metadata.typicalSeverities &&
            Array.isArray(metadata.typicalSeverities) &&
            metadata.typicalSeverities.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Typical Severities:</strong>
                <div style={styles.badgeList}>
                  {metadata.typicalSeverities.map((sev) => (
                    <span key={sev} style={styles.infoTag}>
                      {sev}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {metadata.possibleSources &&
            Array.isArray(metadata.possibleSources) &&
            metadata.possibleSources.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Possible Sources:</strong>
                <div style={styles.badgeList}>
                  {metadata.possibleSources.map((source) => (
                    <span key={source} style={styles.sourceTag}>
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {metadata.algorithm && (
            <div style={styles.metadataSection}>
              <strong>Algorithm:</strong>
              <p style={styles.codeBlock}>{metadata.algorithm}</p>
            </div>
          )}

          {metadata.formula && (
            <div style={styles.metadataSection}>
              <strong>Formula:</strong>
              <p style={styles.codeBlock}>{metadata.formula}</p>
            </div>
          )}

          {metadata.triggerConditions &&
            Array.isArray(metadata.triggerConditions) &&
            metadata.triggerConditions.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Trigger Conditions:</strong>
                <ul style={styles.conditionList}>
                  {metadata.triggerConditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}

          {metadata.supportedCountries &&
            Array.isArray(metadata.supportedCountries) &&
            metadata.supportedCountries.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Supported Countries ({metadata.supportedCountries.length}):</strong>
                <div style={styles.countriesGrid}>
                  {metadata.supportedCountries.map((country) => (
                    <span key={country} style={styles.countryTag}>
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {metadata.typicalIndicators &&
            Array.isArray(metadata.typicalIndicators) &&
            metadata.typicalIndicators.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Typical Indicators:</strong>
                <ul style={styles.indicatorList}>
                  {metadata.typicalIndicators.map((indicator) => (
                    <li key={indicator}>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}

          {metadata.typicalRecommendations &&
            Array.isArray(metadata.typicalRecommendations) &&
            metadata.typicalRecommendations.length > 0 && (
              <div style={styles.metadataSection}>
                <strong>Typical Recommendations:</strong>
                <ul style={styles.recommendationList}>
                  {metadata.typicalRecommendations.map((rec) => (
                    <li key={rec}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default function DebugMetadataPanel({
  loading,
  searchTerm,
  setSearchTerm,
  fetchAllRisks,
  filteredMetadata,
}) {
  return (
    <>
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={18} color="#6B7280" />
          <input
            type="text"
            placeholder="Search risk types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <SecondaryButton onClick={fetchAllRisks} leftIcon={<RefreshCw size={16} />}>
          Refresh
        </SecondaryButton>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading risk types metadata...</p>
      ) : (
        <>
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{filteredMetadata.length}</span>
              <span style={styles.statLabel}>Risk Types</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {filteredMetadata.filter((m) => m.isHofstedeRelated).length}
              </span>
              <span style={styles.statLabel}>Hofstede-based</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {filteredMetadata.filter((m) => !m.isHofstedeRelated).length}
              </span>
              <span style={styles.statLabel}>Traditional</span>
            </div>
          </div>

          <div style={styles.metadataList}>
            {filteredMetadata.length === 0 ? (
              <p style={styles.emptyText}>No risk types found</p>
            ) : (
              filteredMetadata.map((meta) => (
                <RiskMetadataCard key={meta.type} metadata={meta} />
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'var(--color-bg-muted)',
    borderRadius: '10px',
    border: '2px solid var(--color-border)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    outline: 'none',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '16px',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
    fontSize: '16px',
  },
  statsBar: {
    display: 'flex',
    gap: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, var(--color-accent-gradient-start) 0%, var(--color-accent-gradient-end) 100%)',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  metadataList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metadataCard: {
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    background: 'white',
  },
  metadataHeader: {
    padding: '24px',
    cursor: 'pointer',
    background: 'var(--color-bg-muted)',
    transition: 'background 0.2s',
  },
  metadataTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  hofstedeBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, var(--color-accent-gradient-start) 0%, var(--color-accent-gradient-end) 100%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    marginRight: '12px',
  },
  metadataType: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    fontFamily: 'monospace',
  },
  categoryBadge: {
    padding: '4px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  metadataTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '8px 0',
  },
  metadataDescription: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
    margin: 0,
  },
  metadataDetails: {
    padding: '24px',
    borderTop: '2px solid var(--color-border)',
    background: 'white',
  },
  metadataSection: {
    marginBottom: '20px',
  },
  badgeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  infoTag: {
    padding: '4px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  sourceTag: {
    padding: '4px 12px',
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning-dark)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  codeBlock: {
    padding: '12px',
    background: '#1e293b',
    color: 'var(--color-success)',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    marginTop: '8px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
  },
  conditionList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.8',
  },
  countriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  },
  countryTag: {
    padding: '6px 12px',
    background: 'var(--color-success-bg)',
    color: 'var(--color-success-dark)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
  },
  indicatorList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.8',
  },
  recommendationList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.8',
  },
};

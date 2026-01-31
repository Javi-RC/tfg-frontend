import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingUp, Database, Filter, Search, RefreshCw, BookOpen } from 'lucide-react';
import { getAllRisksDebug, getRisksByTypeDebug, getRisksTypeSummaryDebug } from '../api/riskService';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * Secret Debug Page - View All Risks
 * This page is not linked in the navigation menu
 * Direct access via: /secret-risks-debug-panel-2026
 */
export default function SecretRisksDebugPage() {
  const { t, i18n } = useTranslation();
  const previousLanguage = useRef(i18n.language);
  
  const [activeView, setActiveView] = useState('metadata'); // 'metadata', 'all', 'by-type', 'summary'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [allRisks, setAllRisks] = useState([]);
  const [riskMetadata, setRiskMetadata] = useState([]);
  const [risksByType, setRisksByType] = useState([]);
  const [typeSummary, setTypeSummary] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all risks (now includes metadata)
  const fetchAllRisks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRisksDebug();
      const data = response.data.data || [];
      
      // Separate metadata from risk instances
      if (data.length > 0 && data[0].title && data[0].description) {
        // This is metadata
        setRiskMetadata(data);
      } else {
        // This is risk instances
        setAllRisks(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching all risks');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch risks by type
  const fetchRisksByType = async (type) => {
    if (!type) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getRisksByTypeDebug(type);
      setRisksByType(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching risks by type');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch type summary
  const fetchTypeSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRisksTypeSummaryDebug();
      setTypeSummary(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching type summary');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    if (activeView === 'metadata' || activeView === 'all') {
      fetchAllRisks();
    } else if (activeView === 'summary') {
      fetchTypeSummary();
    }
  }, [activeView]);
  
  // Reload data when language changes
  useEffect(() => {
    const currentLanguage = i18n.language;
    if (previousLanguage.current && previousLanguage.current !== currentLanguage) {
      console.log('🌐 [SecretRisksDebugPage] Language changed, reloading data...');
      if (activeView === 'metadata' || activeView === 'all') {
        fetchAllRisks();
      } else if (activeView === 'summary') {
        fetchTypeSummary();
      } else if (activeView === 'by-type' && selectedType) {
        fetchRisksByType(selectedType);
      }
    }
    previousLanguage.current = currentLanguage;
  }, [i18n.language, activeView, selectedType]);
  
  useEffect(() => {
    if (activeView === 'by-type' && selectedType) {
      fetchRisksByType(selectedType);
    }
  }, [selectedType, activeView]);
  
  // Filter risks based on search
  const filteredRisks = (activeView === 'all' ? allRisks : risksByType).filter(risk => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      risk.type?.toLowerCase().includes(search) ||
      risk.severity?.toLowerCase().includes(search) ||
      risk.category?.toLowerCase().includes(search) ||
      risk.reasoning?.toLowerCase().includes(search) ||
      risk.source?.toLowerCase().includes(search)
    );
  });
  
  // Filter metadata based on search
  const filteredMetadata = riskMetadata.filter(meta => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      meta.type?.toLowerCase().includes(search) ||
      meta.title?.toLowerCase().includes(search) ||
      meta.description?.toLowerCase().includes(search) ||
      meta.category?.toLowerCase().includes(search) ||
      meta.possibleSources?.some(s => s.toLowerCase().includes(search))
    );
  });
  
  // Severity color mapping
  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'CRITICO':
        return '#EF4444';
      case 'HIGH':
      case 'ALTO':
        return '#F97316';
      case 'MEDIUM':
      case 'MEDIO':
        return '#F59E0B';
      case 'LOW':
      case 'BAJO':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <AlertTriangle size={32} color="#EF4444" />
          <div>
            <h1 style={styles.title}>🔒 Secret Risks Debug Panel</h1>
            <p style={styles.subtitle}>Internal debugging tool - All risks visibility</p>
          </div>
        </div>
        
        {/* View Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeView === 'metadata' && styles.tabActive)
            }}
            onClick={() => setActiveView('metadata')}
          >
            <BookOpen size={16} />
            Risk Types (42)
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeView === 'all' && styles.tabActive)
            }}
            onClick={() => setActiveView('all')}
          >
            <Database size={16} />
            All Risks ({allRisks.length})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeView === 'by-type' && styles.tabActive)
            }}
            onClick={() => setActiveView('by-type')}
          >
            <Filter size={16} />
            By Type
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeView === 'summary' && styles.tabActive)
            }}
            onClick={() => setActiveView('summary')}
          >
            <TrendingUp size={16} />
            Summary
          </button>
        </div>
      </div>
      
      <div style={styles.content}>
        {/* Error Display */}
        {error && (
          <div style={styles.errorBox}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Risk Types Metadata View */}
        {activeView === 'metadata' && (
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
                      {filteredMetadata.filter(m => m.isHofstedeRelated).length}
                    </span>
                    <span style={styles.statLabel}>Hofstede-based</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statNumber}>
                      {filteredMetadata.filter(m => !m.isHofstedeRelated).length}
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
        )}
        
        {/* All Risks View */}
        {activeView === 'all' && (
          <>
            <div style={styles.controls}>
              <div style={styles.searchBox}>
                <Search size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search risks..."
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
              <p style={styles.loading}>Loading risks...</p>
            ) : (
              <div style={styles.risksList}>
                {filteredRisks.length === 0 ? (
                  <p style={styles.emptyText}>No risks found</p>
                ) : (
                  filteredRisks.map((risk) => (
                    <RiskCard key={risk._id} risk={risk} getSeverityColor={getSeverityColor} />
                  ))
                )}
              </div>
            )}
          </>
        )}
        
        {/* By Type View */}
        {activeView === 'by-type' && (
          <>
            <div style={styles.controls}>
              <input
                type="text"
                placeholder="Enter risk type (e.g., cultural_distance_risk)"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={styles.typeInput}
              />
              <div style={styles.searchBox}>
                <Search size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search filtered risks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>
            
            {loading ? (
              <p style={styles.loading}>Loading risks...</p>
            ) : selectedType ? (
              <div style={styles.risksList}>
                {filteredRisks.length === 0 ? (
                  <p style={styles.emptyText}>No risks found for type: {selectedType}</p>
                ) : (
                  filteredRisks.map((risk) => (
                    <RiskCard key={risk._id} risk={risk} getSeverityColor={getSeverityColor} />
                  ))
                )}
              </div>
            ) : (
              <p style={styles.emptyText}>Enter a risk type to search</p>
            )}
          </>
        )}
        
        {/* Summary View */}
        {activeView === 'summary' && (
          <>
            <div style={styles.controls}>
              <SecondaryButton onClick={fetchTypeSummary} leftIcon={<RefreshCw size={16} />}>
                Refresh
              </SecondaryButton>
            </div>
            
            {loading ? (
              <p style={styles.loading}>Loading summary...</p>
            ) : (
              <div style={styles.summaryGrid}>
                {typeSummary.length === 0 ? (
                  <p style={styles.emptyText}>No summary data available</p>
                ) : (
                  typeSummary.map((item) => (
                    <SummaryCard key={item._id} item={item} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Risk Metadata Card Component
function RiskMetadataCard({ metadata }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={styles.metadataCard}>
      <div style={styles.metadataHeader} onClick={() => setExpanded(!expanded)}>
        <div style={styles.metadataTop}>
          <div>
            {metadata.isHofstedeRelated && (
              <span style={styles.hofstedeBadge}>
                🌍 Hofstede
              </span>
            )}
            <span style={styles.metadataType}>{metadata.type}</span>
          </div>
          <span style={styles.categoryBadge}>{metadata.category}</span>
        </div>
        
        <h3 style={styles.metadataTitle}>{metadata.title}</h3>
        <p style={styles.metadataDescription}>{metadata.description}</p>
      </div>
      
      {expanded && (
        <div style={styles.metadataDetails}>
          {/* Typical Severities */}
          {metadata.typicalSeverities && Array.isArray(metadata.typicalSeverities) && metadata.typicalSeverities.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Typical Severities:</strong>
              <div style={styles.badgeList}>
                {metadata.typicalSeverities.map((sev, idx) => (
                  <span key={idx} style={styles.infoTag}>{sev}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Possible Sources */}
          {metadata.possibleSources && Array.isArray(metadata.possibleSources) && metadata.possibleSources.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Possible Sources:</strong>
              <div style={styles.badgeList}>
                {metadata.possibleSources.map((source, idx) => (
                  <span key={idx} style={styles.sourceTag}>{source}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Algorithm (Hofstede only) */}
          {metadata.algorithm && (
            <div style={styles.metadataSection}>
              <strong>Algorithm:</strong>
              <p style={styles.codeBlock}>{metadata.algorithm}</p>
            </div>
          )}
          
          {/* Formula (Hofstede only) */}
          {metadata.formula && (
            <div style={styles.metadataSection}>
              <strong>Formula:</strong>
              <p style={styles.codeBlock}>{metadata.formula}</p>
            </div>
          )}
          
          {/* Trigger Conditions */}
          {metadata.triggerConditions && Array.isArray(metadata.triggerConditions) && metadata.triggerConditions.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Trigger Conditions:</strong>
              <ul style={styles.conditionList}>
                {metadata.triggerConditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Supported Countries (Cultural risks) */}
          {metadata.supportedCountries && Array.isArray(metadata.supportedCountries) && metadata.supportedCountries.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Supported Countries ({metadata.supportedCountries.length}):</strong>
              <div style={styles.countriesGrid}>
                {metadata.supportedCountries.map((country, idx) => (
                  <span key={idx} style={styles.countryTag}>{country}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Typical Indicators */}
          {metadata.typicalIndicators && Array.isArray(metadata.typicalIndicators) && metadata.typicalIndicators.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Typical Indicators:</strong>
              <ul style={styles.indicatorList}>
                {metadata.typicalIndicators.map((indicator, idx) => (
                  <li key={idx}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Typical Recommendations */}
          {metadata.typicalRecommendations && Array.isArray(metadata.typicalRecommendations) && metadata.typicalRecommendations.length > 0 && (
            <div style={styles.metadataSection}>
              <strong>Typical Recommendations:</strong>
              <ul style={styles.recommendationList}>
                {metadata.typicalRecommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Risk Card Component
function RiskCard({ risk, getSeverityColor }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={styles.riskCard}>
      <div style={styles.riskHeader} onClick={() => setExpanded(!expanded)}>
        <div style={styles.riskTop}>
          <div>
            <span
              style={{
                ...styles.severityBadge,
                background: getSeverityColor(risk.severity)
              }}
            >
              {risk.severity}
            </span>
            <span style={styles.riskType}>{risk.type}</span>
          </div>
          <span style={styles.categoryBadge}>{risk.category}</span>
        </div>
        
        <div style={styles.riskMeta}>
          <span style={styles.metaItem}>
            <strong>Source:</strong> {risk.source}
          </span>
          <span style={styles.metaItem}>
            <strong>Project:</strong> {risk.project?.projectName || 'N/A'}
          </span>
          <span style={styles.metaItem}>
            <strong>Org:</strong> {risk.organization?.name || 'N/A'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div style={styles.riskDetails}>
          <div style={styles.detailSection}>
            <strong>Reasoning:</strong>
            <p style={styles.detailText}>{risk.reasoning || 'N/A'}</p>
          </div>
          
          {risk.indicators && risk.indicators.length > 0 && (
            <div style={styles.detailSection}>
              <strong>Indicators:</strong>
              <ul style={styles.detailList}>
                {risk.indicators.map((indicator, idx) => (
                  <li key={idx}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}
          
          {risk.recommendations && risk.recommendations.length > 0 && (
            <div style={styles.detailSection}>
              <strong>Recommendations:</strong>
              <ul style={styles.detailList}>
                {risk.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={styles.detailSection}>
            <strong>Created:</strong> {new Date(risk.createdAt).toLocaleString()}
          </div>
          
          <div style={styles.detailSection}>
            <strong>ID:</strong> <code style={styles.code}>{risk._id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({ item }) {
  return (
    <div style={styles.summaryCard}>
      <h3 style={styles.summaryTitle}>{item._id}</h3>
      <div style={styles.summaryStats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Count</span>
          <span style={styles.statValue}>{item.count}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Avg Severity</span>
          <span style={styles.statValue}>{item.avgSeverity?.toFixed(2) || 'N/A'}</span>
        </div>
      </div>
      {item.sources && (
        <div style={styles.summaryMeta}>
          <strong>Sources:</strong> {item.sources.join(', ')}
        </div>
      )}
      {item.categories && (
        <div style={styles.summaryMeta}>
          <strong>Categories:</strong> {item.categories.join(', ')}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white'
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.8,
    margin: '4px 0 0 0'
  },
  tabs: {
    display: 'flex',
    gap: '12px'
  },
  tab: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'white',
    color: '#1e293b'
  },
  content: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center'
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#F9FAFB',
    borderRadius: '10px',
    border: '2px solid #E5E7EB'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    outline: 'none'
  },
  typeInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none'
  },
  errorBox: {
    padding: '16px',
    background: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6B7280',
    fontSize: '16px'
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#9CA3AF',
    fontSize: '16px'
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  riskCard: {
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.2s'
  },
  riskHeader: {
    padding: '20px',
    cursor: 'pointer',
    background: '#F9FAFB',
    transition: 'background 0.2s'
  },
  riskTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  severityBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginRight: '12px'
  },
  riskType: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  categoryBadge: {
    padding: '4px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  riskMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#6B7280'
  },
  metaItem: {
    display: 'flex',
    gap: '4px'
  },
  riskDetails: {
    padding: '20px',
    borderTop: '2px solid #E5E7EB',
    background: 'white'
  },
  detailSection: {
    marginBottom: '16px'
  },
  detailText: {
    margin: '8px 0',
    color: '#374151',
    lineHeight: '1.6'
  },
  detailList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: '#374151',
    lineHeight: '1.6'
  },
  code: {
    padding: '2px 6px',
    background: '#F3F4F6',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  summaryCard: {
    padding: '24px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '2px solid #E5E7EB'
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '16px'
  },
  summaryStats: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '600'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111'
  },
  summaryMeta: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '12px'
  },
  statsBar: {
    display: 'flex',
    gap: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700'
  },
  metadataList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  metadataCard: {
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    background: 'white'
  },
  metadataHeader: {
    padding: '24px',
    cursor: 'pointer',
    background: '#F9FAFB',
    transition: 'background 0.2s'
  },
  metadataTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  hofstedeBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    marginRight: '12px'
  },
  metadataType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'monospace'
  },
  metadataTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    margin: '8px 0'
  },
  metadataDescription: {
    fontSize: '15px',
    color: '#6B7280',
    lineHeight: '1.6',
    margin: 0
  },
  metadataDetails: {
    padding: '24px',
    borderTop: '2px solid #E5E7EB',
    background: 'white'
  },
  metadataSection: {
    marginBottom: '20px'
  },
  badgeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  infoTag: {
    padding: '4px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  sourceTag: {
    padding: '4px 12px',
    background: '#FEF3C7',
    color: '#92400E',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  codeBlock: {
    padding: '12px',
    background: '#1e293b',
    color: '#10b981',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    marginTop: '8px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap'
  },
  conditionList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: '#374151',
    lineHeight: '1.8'
  },
  countriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
    marginTop: '8px'
  },
  countryTag: {
    padding: '6px 12px',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  indicatorList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: '#374151',
    lineHeight: '1.8'
  },
  recommendationList: {
    marginTop: '8px',
    paddingLeft: '20px',
    color: '#374151',
    lineHeight: '1.8'
  }
};

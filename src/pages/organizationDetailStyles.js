const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 24px'
  },
  headerTop: {
    marginBottom: '16px'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 0'
  },
  headerContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  badges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#f0f0f0',
    color: '#666'
  },
  statsSection: {
    maxWidth: '1200px',
    margin: '0 auto 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  tabs: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #eee',
    marginBottom: '24px'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'none',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2563eb',
    cursor: 'pointer',
    borderBottom: '2px solid #2563eb',
    marginBottom: '-2px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  infoItem: {
    marginBottom: '16px'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: '24px',
    marginBottom: '16px'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px'
  },
  filterButton: {
    background: '#f0f0f0',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterActive: {
    background: '#2563eb',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer'
  },
  table: {
    width: '100%'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 2fr',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 2fr',
    padding: '16px 12px',
    borderBottom: '1px solid #eee',
    alignItems: 'center'
  },
  tableCell: {
    fontSize: '14px',
    color: '#333'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  cvList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cvCard: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px'
  },
  cvHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  cvName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 4px 0'
  },
  cvEmail: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  cvInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px'
  },
  cvNotes: {
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px'
  },
  cvActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  },
  projectCard: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  projectName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 8px 0'
  },
  projectDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  projectInfo: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  projectActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  settingsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  settingItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
    cursor: 'pointer'
  },
  checkbox: {
    marginTop: '2px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  settingLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  settingDescription: {
    fontSize: '14px',
    color: '#666'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    padding: '40px'
  },
  errorContainer: {
    maxWidth: '500px',
    margin: '60px auto',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '16px',
    color: '#c62828',
    marginBottom: '24px'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    padding: '40px'
  }
};

export default styles;

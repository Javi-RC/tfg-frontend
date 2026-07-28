export const pageStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px',
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid var(--color-border)',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid var(--color-border)',
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: 'var(--color-text-primary)',
    borderBottomColor: 'var(--color-text-primary)',
  },
};

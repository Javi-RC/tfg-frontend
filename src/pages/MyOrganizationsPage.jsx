import React, { useState, useEffect, useContext } from 'react';
import { Users } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  getMyOrganizations, 
  createOrganization,
  getOrganizationStats 
} from '../api/organization';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * MyOrganizationsPage
 * Displays user's organizations (as admin or employee)
 */
export default function MyOrganizationsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isOrgAdmin = user?.role === 'org_admin';

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const res = await getMyOrganizations();
      // La API devuelve { success: true, data: [...] }
      if (res.data?.success && Array.isArray(res.data.data)) {
        setOrganizations(res.data.data);
      } else if (Array.isArray(res.data)) {
        // Fallback por si axios ya extrajo el data
        setOrganizations(res.data);
      } else {
        console.warn('Unexpected API response format:', res.data);
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading organizations...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Organizations</h1>
          <p style={styles.subtitle}>
            {isOrgAdmin ? 'Organizations you manage' : 'Organizations you belong to'}
          </p>
        </div>
        {isOrgAdmin && (
          <PrimaryButton onClick={() => setShowCreateModal(true)} leftIcon={<Building2 size={18} />}>
            Create Organization
          </PrimaryButton>
        )}
      </div>

      {/* Organizations List */}
      {organizations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Building2 size={64} color="#6c757d" style={{ opacity: 0.3 }} />
          </div>
          <h3 style={styles.emptyTitle}>No organizations yet</h3>
          <p style={styles.emptyText}>
            {isOrgAdmin 
              ? 'Create your first organization to get started' 
              : 'You are not part of any organization yet'}
          </p>
          {isOrgAdmin && (
            <PrimaryButton onClick={() => setShowCreateModal(true)} leftIcon={<Building2 size={18} />}>
              Create Organization
            </PrimaryButton>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {organizations.map((org) => (
            <OrganizationCard 
              key={org._id} 
              organization={org} 
              isAdmin={isOrgAdmin}
              onClick={() => navigate(`/organizations/${org._id}`)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadOrganizations();
          }}
        />
      )}
    </div>
  );
}

/**
 * OrganizationCard Component
 */
function OrganizationCard({ organization, isAdmin, onClick }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      getOrganizationStats(organization._id)
        .then(res => {
          // La API devuelve { success: true, data: {...stats} }
          if (res.data?.success && res.data?.data) {
            setStats(res.data.data);
          } else if (res.data && !res.data.success) {
            // Axios ya extrajo el data
            setStats(res.data);
          }
        })
        .catch(err => console.error('Error loading stats:', err));
    }
  }, [organization._id, isAdmin]);

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{organization.name}</h3>
        <span style={{
          ...styles.badge,
          background: organization.status === 'active' ? '#e8f5e9' : '#ffebee',
          color: organization.status === 'active' ? '#2e7d32' : '#c62828'
        }}>
          {organization.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      {organization.description && (
        <p style={styles.cardDescription}>{organization.description}</p>
      )}

      <div style={styles.cardInfo}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Industry:</span>
          <span style={styles.infoValue}>{organization.industry || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Size:</span>
          <span style={styles.infoValue}>{organization.size || 'N/A'}</span>
        </div>
      </div>

      {isAdmin && stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.totalEmployees}</span>
            <span style={styles.statLabel}>Employees</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.activeEmployees}</span>
            <span style={styles.statLabel}>Active</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{stats.pendingEmployees}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
        </div>
      )}

      <div style={styles.cardFooter}>
        <span style={styles.footerText}>
          {isAdmin ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              Administrator
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} />
              Employee
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/**
 * CreateOrganizationModal Component
 */
function CreateOrganizationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    taxId: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    industry: '',
    size: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar campos obligatorios
    if (!formData.name || !formData.email) {
      setError('Name and Email are required fields');
      return;
    }
    
    setLoading(true);

    try {
      // Construir objeto según la API oficial
      const organizationData = {
        name: formData.name,
        contact: {
          email: formData.email
        }
      };
      
      // Agregar campos opcionales solo si tienen valor
      if (formData.description) organizationData.description = formData.description;
      if (formData.taxId) organizationData.taxId = formData.taxId;
      if (formData.phone) organizationData.contact.phone = formData.phone;
      if (formData.website) organizationData.contact.website = formData.website;
      if (formData.industry) organizationData.industry = formData.industry;
      if (formData.size) organizationData.size = formData.size;
      
      // Agregar address solo si algún campo tiene valor
      const hasAddress = Object.values(formData.address).some(val => val.trim() !== '');
      if (hasAddress) {
        organizationData.address = {};
        if (formData.address.street) organizationData.address.street = formData.address.street;
        if (formData.address.city) organizationData.address.city = formData.address.city;
        if (formData.address.state) organizationData.address.state = formData.address.state;
        if (formData.address.postalCode) organizationData.address.postalCode = formData.address.postalCode;
        if (formData.address.country) organizationData.address.country = formData.address.country;
      }
      
      const response = await createOrganization(organizationData);
      
      // Verificar respuesta según formato de la API
      if (response.data?.success) {
        onSuccess();
      } else {
        setError(response.data?.message || 'Error creating organization');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error creating organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Create Organization</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Organization Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tax ID</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              style={styles.input}
              placeholder="e.g., B87654321"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value }})}
              style={styles.input}
              placeholder="Street address"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value }})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State/Province</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value }})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Postal Code</label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value }})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value }})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              style={styles.input}
              placeholder="https://example.com"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                style={styles.input}
              >
                <option value="">Select industry</option>
                <option value="software_development">Software development</option>
                <option value="web_development">Web development</option>
                <option value="mobile_development">Mobile development</option>
                <option value="devops_cloud">DevOps y Cloud</option>
                <option value="data_science">Data science</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="ai_machine_learning">AI & Machine Learning</option>
                <option value="blockchain">Blockchain</option>
                <option value="game_development">Game development</option>
                <option value="qa_testing">QA & Testing</option>
                <option value="consulting">Technology consulting</option>
                <option value="fintech">Financial technology</option>
                <option value="healthtech">Health technology</option>
                <option value="edtech">Education technology</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">Software as a Service</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                style={styles.input}
              >
                <option value="">Select size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
          </div>

          <div style={styles.modalActions}>
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Organization'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginTop: '40px'
  },
  emptyState: {
    maxWidth: '500px',
    margin: '60px auto',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px'
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      transform: 'translateY(-2px)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  cardInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  infoItem: {
    flex: 1
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    display: 'block',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500'
  },
  statsContainer: {
    display: 'flex',
    gap: '16px',
    padding: '16px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    marginBottom: '16px'
  },
  statItem: {
    flex: 1,
    textAlign: 'center'
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#666'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorBanner: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 24px',
    margin: '0 24px',
    marginTop: '16px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  form: {
    padding: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#2563eb'
    }
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #eee'
  }
};

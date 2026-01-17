import React from 'react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function CreateOrganizationModal({
  onClose,
  createForm,
  createError,
  creating,
  updateCreateForm,
  handleCreateOrganization,
  styles
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateOrganization();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Create Organization</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {createError && <div style={styles.errorBanner}>{createError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Organization Name *</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => updateCreateForm('name', e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => updateCreateForm('description', e.target.value)}
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tax ID</label>
            <input
              type="text"
              value={createForm.taxId}
              onChange={(e) => updateCreateForm('taxId', e.target.value)}
              style={styles.input}
              placeholder="e.g., B87654321"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address</label>
            <input
              type="text"
              value={createForm.address.street}
              onChange={(e) => updateCreateForm('address.street', e.target.value)}
              style={styles.input}
              placeholder="Street address"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={createForm.address.city}
                onChange={(e) => updateCreateForm('address.city', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State/Province</label>
              <input
                type="text"
                value={createForm.address.state}
                onChange={(e) => updateCreateForm('address.state', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Postal Code</label>
              <input
                type="text"
                value={createForm.address.postalCode}
                onChange={(e) => updateCreateForm('address.postalCode', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                value={createForm.address.country}
                onChange={(e) => updateCreateForm('address.country', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => updateCreateForm('email', e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={createForm.phone}
                onChange={(e) => updateCreateForm('phone', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              value={createForm.website}
              onChange={(e) => updateCreateForm('website', e.target.value)}
              style={styles.input}
              placeholder="https://example.com"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Industry</label>
              <select
                value={createForm.industry}
                onChange={(e) => updateCreateForm('industry', e.target.value)}
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
                value={createForm.size}
                onChange={(e) => updateCreateForm('size', e.target.value)}
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
            <PrimaryButton type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Organization'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

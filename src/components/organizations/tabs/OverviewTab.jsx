import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

export default function OverviewTab({ organization, isAdmin, onUpdateOrganization, styles }) {
  const { t } = useTranslation();
  
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const emptyValue = '—';

  const INDUSTRY_OPTIONS = [
    { value: '', label: t('organizations.industries.select') },
    { value: 'software_development', label: t('organizations.industries.software_development') },
    { value: 'web_development', label: t('organizations.industries.web_development') },
    { value: 'mobile_development', label: t('organizations.industries.mobile_development') },
    { value: 'devops_cloud', label: t('organizations.industries.devops_cloud') },
    { value: 'data_science', label: t('organizations.industries.data_science') },
    { value: 'cybersecurity', label: t('organizations.industries.cybersecurity') },
    { value: 'ai_machine_learning', label: t('organizations.industries.ai_machine_learning') },
    { value: 'blockchain', label: t('organizations.industries.blockchain') },
    { value: 'game_development', label: t('organizations.industries.game_development') },
    { value: 'qa_testing', label: t('organizations.industries.qa_testing') },
    { value: 'consulting', label: t('organizations.industries.consulting') },
    { value: 'fintech', label: t('organizations.industries.fintech') },
    { value: 'healthtech', label: t('organizations.industries.healthtech') },
    { value: 'edtech', label: t('organizations.industries.edtech') },
    { value: 'ecommerce', label: t('organizations.industries.ecommerce') },
    { value: 'saas', label: t('organizations.industries.saas') },
    { value: 'other', label: t('organizations.industries.other') }
  ];

  const SIZE_OPTIONS = [
    { value: '', label: t('organizations.sizes.select') },
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501-1000', label: '501-1000' },
    { value: '1000+', label: '1000+' }
  ];

  const normalizeTrimmed = (rawValue) => rawValue?.trim() || '';

  const normalizeWebsite = (rawValue) => {
  const trimmed = rawValue?.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidWebsite = (rawValue) => {
  const normalized = normalizeWebsite(rawValue);
  if (!normalized) return true;
  try {
    const parsed = new URL(normalized);
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
};

  const buildInitialForm = (organization) => ({
    name: organization?.name || '',
    description: organization?.description || '',
    taxId: organization?.taxId || '',
    contact: {
      email: organization?.contact?.email || '',
      phone: organization?.contact?.phone || '',
      website: organization?.contact?.website || ''
    },
    address: {
      street: organization?.address?.street || '',
      city: organization?.address?.city || '',
      state: organization?.address?.state || '',
      postalCode: organization?.address?.postalCode || '',
      country: organization?.address?.country || ''
    },
    industry: organization?.industry || '',
    size: organization?.size || ''
  });

  const [form, setForm] = useState(() => buildInitialForm(organization));
  const initialForm = useMemo(() => buildInitialForm(organization), [organization]);

  useEffect(() => {
    if (!editMode) {
      setForm(initialForm);
    }
  }, [editMode, initialForm]);

  const updateForm = (path, value) => {
    setForm((prev) => {
      if (path.startsWith('contact.')) {
        const key = path.replace('contact.', '');
        return { ...prev, contact: { ...prev.contact, [key]: value } };
      }
      if (path.startsWith('address.')) {
        const key = path.replace('address.', '');
        return { ...prev, address: { ...prev.address, [key]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError('');
    setEditMode(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const name = normalizeTrimmed(form.name);
    if (name && name.length < 2) {
      setError('Organization name must be at least 2 characters');
      return;
    }

    const email = normalizeTrimmed(form.contact.email);
    if (email && !isValidEmail(email)) {
      setError('Contact email is not valid');
      return;
    }

    if (!isValidWebsite(form.contact.website)) {
      setError('Website URL is not valid');
      return;
    }

    const toOptionalTrimmed = (value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    };

    const address = {
      street: toOptionalTrimmed(form.address.street),
      city: toOptionalTrimmed(form.address.city),
      state: toOptionalTrimmed(form.address.state),
      postalCode: toOptionalTrimmed(form.address.postalCode),
      country: toOptionalTrimmed(form.address.country)
    };

    const contact = {
      email: email || undefined,
      phone: toOptionalTrimmed(form.contact.phone),
      website: toOptionalTrimmed(normalizeWebsite(form.contact.website))
    };

    const hasAddress = Object.values(address).some(Boolean);
    const hasContact = Object.values(contact).some(Boolean);

    const payload = {
      name: name || undefined,
      description: toOptionalTrimmed(form.description),
      taxId: toOptionalTrimmed(form.taxId),
      industry: form.industry || undefined,
      size: form.size || undefined,
      ...(hasContact ? { contact } : {}),
      ...(hasAddress ? { address } : {})
    };

    setSaving(true);
    setError('');

    const success = await onUpdateOrganization(payload);
    setSaving(false);

    if (success) {
      setEditMode(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Organization Information</h2>
        {isAdmin && !editMode && (
          <PrimaryButton onClick={() => setEditMode(true)}>
            Edit Organization
          </PrimaryButton>
        )}
      </div>

      {editMode ? (
        <form style={styles.formGrid} onSubmit={handleSave} noValidate>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>Organization Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
              style={styles.formInput}
              required
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>Description</label>
            <textarea
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              style={styles.formTextarea}
              rows={2}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Tax ID</label>
            <input
              type="text"
              value={form.taxId}
              onChange={(event) => updateForm('taxId', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input
              type="email"
              value={form.contact.email}
              onChange={(event) => updateForm('contact.email', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Phone</label>
            <input
              type="tel"
              value={form.contact.phone}
              onChange={(event) => updateForm('contact.phone', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Website</label>
            <input
              type="text"
              inputMode="url"
              value={form.contact.website}
              onChange={(event) => updateForm('contact.website', event.target.value)}
              style={styles.formInput}
              placeholder="https://example.com"
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>Street Address</label>
            <input
              type="text"
              value={form.address.street}
              onChange={(event) => updateForm('address.street', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>City</label>
            <input
              type="text"
              value={form.address.city}
              onChange={(event) => updateForm('address.city', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>State/Province</label>
            <input
              type="text"
              value={form.address.state}
              onChange={(event) => updateForm('address.state', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Postal Code</label>
            <input
              type="text"
              value={form.address.postalCode}
              onChange={(event) => updateForm('address.postalCode', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Country</label>
            <input
              type="text"
              value={form.address.country}
              onChange={(event) => updateForm('address.country', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Industry</label>
            <select
              value={form.industry}
              onChange={(event) => updateForm('industry', event.target.value)}
              style={styles.formSelect}
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Company Size</label>
            <select
              value={form.size}
              onChange={(event) => updateForm('size', event.target.value)}
              style={styles.formSelect}
            >
              {SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div style={styles.formError}>{error}</div>}

          <div style={{ ...styles.formActions, ...styles.fullWidth }}>
            <SecondaryButton type="button" onClick={handleCancel}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Tax ID</div>
              <div style={styles.infoValue}>{organization.taxId || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Email</div>
              <div style={styles.infoValue}>{organization.contact?.email || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Phone</div>
              <div style={styles.infoValue}>{organization.contact?.phone || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Website</div>
              <div style={styles.infoValue}>
                {organization.contact?.website ? (
                  <a
                    href={organization.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {organization.contact.website}
                  </a>
                ) : (
                  emptyValue
                )}
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Industry</div>
              <div style={styles.infoValue}>{organization.industry || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Company Size</div>
              <div style={styles.infoValue}>{organization.size || emptyValue}</div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Address</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Street</div>
              <div style={styles.infoValue}>{organization.address?.street || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>City</div>
              <div style={styles.infoValue}>{organization.address?.city || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>State</div>
              <div style={styles.infoValue}>{organization.address?.state || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Postal Code</div>
              <div style={styles.infoValue}>{organization.address?.postalCode || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Country</div>
              <div style={styles.infoValue}>{organization.address?.country || emptyValue}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

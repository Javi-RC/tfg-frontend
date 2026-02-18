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
      setError(t('organizations.overview.validation.nameTooShort'));
      return;
    }

    const email = normalizeTrimmed(form.contact.email);
    if (email && !isValidEmail(email)) {
      setError(t('organizations.overview.validation.invalidEmail'));
      return;
    }

    if (!isValidWebsite(form.contact.website)) {
      setError(t('organizations.overview.validation.invalidWebsite'));
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
        <h2 style={styles.cardTitle}>{t('organizations.overview.title')}</h2>
        {isAdmin && !editMode && (
          <PrimaryButton onClick={() => setEditMode(true)}>
            {t('organizations.overview.editOrganization')}
          </PrimaryButton>
        )}
      </div>

      {editMode ? (
        <form style={styles.formGrid} onSubmit={handleSave} noValidate>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>{t('organizations.overview.organizationName')}</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
              style={styles.formInput}
              required
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>{t('organizations.overview.description')}</label>
            <textarea
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              style={styles.formTextarea}
              rows={2}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.taxId')}</label>
            <input
              type="text"
              value={form.taxId}
              onChange={(event) => updateForm('taxId', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.email')}</label>
            <input
              type="email"
              value={form.contact.email}
              onChange={(event) => updateForm('contact.email', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.phone')}</label>
            <input
              type="tel"
              value={form.contact.phone}
              onChange={(event) => updateForm('contact.phone', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.website')}</label>
            <input
              type="text"
              inputMode="url"
              value={form.contact.website}
              onChange={(event) => updateForm('contact.website', event.target.value)}
              style={styles.formInput}
              placeholder={t('organizations.overview.websitePlaceholder')}
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>{t('organizations.overview.streetAddress')}</label>
            <input
              type="text"
              value={form.address.street}
              onChange={(event) => updateForm('address.street', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.city')}</label>
            <input
              type="text"
              value={form.address.city}
              onChange={(event) => updateForm('address.city', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.stateProvince')}</label>
            <input
              type="text"
              value={form.address.state}
              onChange={(event) => updateForm('address.state', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.postalCode')}</label>
            <input
              type="text"
              value={form.address.postalCode}
              onChange={(event) => updateForm('address.postalCode', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.country')}</label>
            <input
              type="text"
              value={form.address.country}
              onChange={(event) => updateForm('address.country', event.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>{t('organizations.overview.industry')}</label>
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
            <label style={styles.formLabel}>{t('organizations.overview.companySize')}</label>
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
              {t('organizations.overview.cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? t('organizations.overview.saving') : t('organizations.overview.saveChanges')}
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.taxId')}</div>
              <div style={styles.infoValue}>{organization.taxId || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.email')}</div>
              <div style={styles.infoValue}>{organization.contact?.email || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.phone')}</div>
              <div style={styles.infoValue}>{organization.contact?.phone || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.website')}</div>
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
              <div style={styles.infoLabel}>{t('organizations.overview.industry')}</div>
              <div style={styles.infoValue}>{organization.industry || emptyValue}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.companySize')}</div>
              <div style={styles.infoValue}>{organization.size || emptyValue}</div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>{t('organizations.overview.address')}</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.street')}</div>
              <div style={styles.infoValue}>{organization.address?.street || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.city')}</div>
              <div style={styles.infoValue}>{organization.address?.city || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.state')}</div>
              <div style={styles.infoValue}>{organization.address?.state || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.postalCode')}</div>
              <div style={styles.infoValue}>{organization.address?.postalCode || emptyValue}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>{t('organizations.overview.country')}</div>
              <div style={styles.infoValue}>{organization.address?.country || emptyValue}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

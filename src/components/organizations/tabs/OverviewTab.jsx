import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../PrimaryButton';
import OrganizationInfoSection from './OrganizationInfoSection';
import OrganizationEditForm from './OrganizationEditForm';

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
    website: organization?.contact?.website || '',
  },
  address: {
    street: organization?.address?.street || '',
    city: organization?.address?.city || '',
    state: organization?.address?.state || '',
    postalCode: organization?.address?.postalCode || '',
    country: organization?.address?.country || '',
  },
  industry: organization?.industry || '',
  size: organization?.size || '',
});

export default function OverviewTab({ organization, isAdmin, onUpdateOrganization, styles }) {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState(() => buildInitialForm(organization));
  const initialForm = useMemo(() => buildInitialForm(organization), [organization]);

  const effectiveForm = editMode ? form : initialForm;

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

    const name = normalizeTrimmed(effectiveForm.name);
    if (name && name.length < 2) {
      setError(t('organizations.overview.validation.nameTooShort'));
      return;
    }

    const email = normalizeTrimmed(effectiveForm.contact.email);
    if (email && !isValidEmail(email)) {
      setError(t('organizations.overview.validation.invalidEmail'));
      return;
    }

    if (!isValidWebsite(effectiveForm.contact.website)) {
      setError(t('organizations.overview.validation.invalidWebsite'));
      return;
    }

    const toOptionalTrimmed = (value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    };

    const address = {
      street: toOptionalTrimmed(effectiveForm.address.street),
      city: toOptionalTrimmed(effectiveForm.address.city),
      state: toOptionalTrimmed(effectiveForm.address.state),
      postalCode: toOptionalTrimmed(effectiveForm.address.postalCode),
      country: toOptionalTrimmed(effectiveForm.address.country),
    };

    const contact = {
      email: email || undefined,
      phone: toOptionalTrimmed(effectiveForm.contact.phone),
      website: toOptionalTrimmed(normalizeWebsite(effectiveForm.contact.website)),
    };

    const hasAddress = Object.values(address).some(Boolean);
    const hasContact = Object.values(contact).some(Boolean);

    const payload = {
      name: name || undefined,
      description: toOptionalTrimmed(effectiveForm.description),
      taxId: toOptionalTrimmed(effectiveForm.taxId),
      industry: effectiveForm.industry || undefined,
      size: effectiveForm.size || undefined,
      ...(hasContact ? { contact } : {}),
      ...(hasAddress ? { address } : {}),
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
        <OrganizationEditForm
          form={form}
          updateForm={updateForm}
          error={error}
          saving={saving}
          onSubmit={handleSave}
          onCancel={handleCancel}
          styles={styles}
        />
      ) : (
        <OrganizationInfoSection
          organization={organization}
          styles={styles}
        />
      )}
    </div>
  );
}

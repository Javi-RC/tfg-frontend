import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const INDUSTRY_OPTIONS = [
  { value: '', labelKey: 'organizations.industries.select' },
  { value: 'software_development', labelKey: 'organizations.industries.software_development' },
  { value: 'web_development', labelKey: 'organizations.industries.web_development' },
  { value: 'mobile_development', labelKey: 'organizations.industries.mobile_development' },
  { value: 'devops_cloud', labelKey: 'organizations.industries.devops_cloud' },
  { value: 'data_science', labelKey: 'organizations.industries.data_science' },
  { value: 'cybersecurity', labelKey: 'organizations.industries.cybersecurity' },
  { value: 'ai_machine_learning', labelKey: 'organizations.industries.ai_machine_learning' },
  { value: 'blockchain', labelKey: 'organizations.industries.blockchain' },
  { value: 'game_development', labelKey: 'organizations.industries.game_development' },
  { value: 'qa_testing', labelKey: 'organizations.industries.qa_testing' },
  { value: 'consulting', labelKey: 'organizations.industries.consulting' },
  { value: 'fintech', labelKey: 'organizations.industries.fintech' },
  { value: 'healthtech', labelKey: 'organizations.industries.healthtech' },
  { value: 'edtech', labelKey: 'organizations.industries.edtech' },
  { value: 'ecommerce', labelKey: 'organizations.industries.ecommerce' },
  { value: 'saas', labelKey: 'organizations.industries.saas' },
  { value: 'other', labelKey: 'organizations.industries.other' },
];

const SIZE_OPTIONS = [
  { value: '', labelKey: 'organizations.sizes.select' },
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1000+', label: '1000+' },
];

export default function OrganizationEditForm({
  form,
  updateForm,
  error,
  saving,
  onSubmit,
  onCancel,
  styles,
}) {
  const { t } = useTranslation();
  return (
    <form style={styles.formGrid} onSubmit={onSubmit} noValidate>
      <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
        <label htmlFor="org-name" style={styles.formLabel}>{t('organizations.overview.organizationName')}</label>
        <input
          id="org-name"
          type="text"
          value={form.name}
          onChange={(event) => updateForm('name', event.target.value)}
          style={styles.formInput}
          required
        />
      </div>

      <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
        <label htmlFor="org-description" style={styles.formLabel}>{t('organizations.overview.description')}</label>
        <textarea
          id="org-description"
          value={form.description}
          onChange={(event) => updateForm('description', event.target.value)}
          style={styles.formTextarea}
          rows={2}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-taxId" style={styles.formLabel}>{t('organizations.overview.taxId')}</label>
        <input
          id="org-taxId"
          type="text"
          value={form.taxId}
          onChange={(event) => updateForm('taxId', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-email" style={styles.formLabel}>{t('organizations.overview.email')}</label>
        <input
          id="org-email"
          type="email"
          value={form.contact.email}
          onChange={(event) => updateForm('contact.email', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-phone" style={styles.formLabel}>{t('organizations.overview.phone')}</label>
        <input
          id="org-phone"
          type="tel"
          value={form.contact.phone}
          onChange={(event) => updateForm('contact.phone', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-website" style={styles.formLabel}>{t('organizations.overview.website')}</label>
        <input
          id="org-website"
          type="text"
          inputMode="url"
          value={form.contact.website}
          onChange={(event) => updateForm('contact.website', event.target.value)}
          style={styles.formInput}
          placeholder={t('organizations.overview.websitePlaceholder')}
        />
      </div>

      <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
        <label htmlFor="org-street" style={styles.formLabel}>{t('organizations.overview.streetAddress')}</label>
        <input
          id="org-street"
          type="text"
          value={form.address.street}
          onChange={(event) => updateForm('address.street', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-city" style={styles.formLabel}>{t('organizations.overview.city')}</label>
        <input
          id="org-city"
          type="text"
          value={form.address.city}
          onChange={(event) => updateForm('address.city', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-state" style={styles.formLabel}>{t('organizations.overview.stateProvince')}</label>
        <input
          id="org-state"
          type="text"
          value={form.address.state}
          onChange={(event) => updateForm('address.state', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-postalCode" style={styles.formLabel}>{t('organizations.overview.postalCode')}</label>
        <input
          id="org-postalCode"
          type="text"
          value={form.address.postalCode}
          onChange={(event) => updateForm('address.postalCode', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-country" style={styles.formLabel}>{t('organizations.overview.country')}</label>
        <input
          id="org-country"
          type="text"
          value={form.address.country}
          onChange={(event) => updateForm('address.country', event.target.value)}
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-industry" style={styles.formLabel}>{t('organizations.overview.industry')}</label>
        <select
          id="org-industry"
          value={form.industry}
          onChange={(event) => updateForm('industry', event.target.value)}
          style={styles.formSelect}
        >
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="org-size" style={styles.formLabel}>{t('organizations.overview.companySize')}</label>
        <select
          id="org-size"
          value={form.size}
          onChange={(event) => updateForm('size', event.target.value)}
          style={styles.formSelect}
        >
          {SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label || t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {error && <div style={styles.formError}>{error}</div>}

      <div style={{ ...styles.formActions, ...styles.fullWidth }}>
        <SecondaryButton type="button" onClick={onCancel}>
          {t('organizations.overview.cancel')}
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving
            ? t('organizations.overview.saving')
            : t('organizations.overview.saveChanges')}
        </PrimaryButton>
      </div>
    </form>
  );
}

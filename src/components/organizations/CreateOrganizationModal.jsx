import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

export default function CreateOrganizationModal({
  onClose,
  createForm,
  createError,
  creating,
  updateCreateForm,
  handleCreateOrganization,
  styles,
}) {
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateOrganization();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{t('organization.create.title')}</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {createError && <div style={styles.errorBanner}>{createError}</div>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="create-org-name" style={styles.label}>{t('organization.create.name')} *</label>
            <input
              id="create-org-name"
              type="text"
              value={createForm.name}
              onChange={(e) => updateCreateForm('name', e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="create-org-description" style={styles.label}>{t('organization.create.description')}</label>
            <textarea
              id="create-org-description"
              value={createForm.description}
              onChange={(e) => updateCreateForm('description', e.target.value)}
              style={{ ...styles.input, minHeight: '52px', resize: 'vertical' }}
              rows={2}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-taxId" style={styles.label}>{t('organization.create.taxId')}</label>
            <input
              id="create-org-taxId"
              type="text"
              value={createForm.taxId}
              onChange={(e) => updateCreateForm('taxId', e.target.value)}
              style={styles.input}
              placeholder={t('organization.create.taxIdPlaceholder')}
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="create-org-street" style={styles.label}>{t('organization.create.street')}</label>
            <input
              id="create-org-street"
              type="text"
              value={createForm.address.street}
              onChange={(e) => updateCreateForm('address.street', e.target.value)}
              style={styles.input}
              placeholder={t('organization.create.streetPlaceholder')}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-city" style={styles.label}>{t('organization.create.city')}</label>
            <input
              id="create-org-city"
              type="text"
              value={createForm.address.city}
              onChange={(e) => updateCreateForm('address.city', e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="create-org-state" style={styles.label}>{t('organization.create.state')}</label>
            <input
              id="create-org-state"
              type="text"
              value={createForm.address.state}
              onChange={(e) => updateCreateForm('address.state', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-postalCode" style={styles.label}>{t('organization.create.postalCode')}</label>
            <input
              id="create-org-postalCode"
              type="text"
              value={createForm.address.postalCode}
              onChange={(e) => updateCreateForm('address.postalCode', e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="create-org-country" style={styles.label}>{t('organization.create.country')}</label>
            <input
              id="create-org-country"
              type="text"
              value={createForm.address.country}
              onChange={(e) => updateCreateForm('address.country', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-email" style={styles.label}>{t('organization.create.email')} *</label>
            <input
              id="create-org-email"
              type="email"
              value={createForm.email}
              onChange={(e) => updateCreateForm('email', e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-phone" style={styles.label}>{t('organization.create.phone')}</label>
            <input
              id="create-org-phone"
              type="tel"
              value={createForm.phone}
              onChange={(e) => updateCreateForm('phone', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label htmlFor="create-org-website" style={styles.label}>{t('organization.create.website')}</label>
            <input
              id="create-org-website"
              type="text"
              inputMode="url"
              value={createForm.website}
              onChange={(e) => updateCreateForm('website', e.target.value)}
              style={styles.input}
              placeholder={t('organization.create.websitePlaceholder')}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-industry" style={styles.label}>{t('organization.create.industry')}</label>
            <select
              id="create-org-industry"
              value={createForm.industry}
              onChange={(e) => updateCreateForm('industry', e.target.value)}
              style={styles.input}
            >
              <option value="">{t('organization.create.selectIndustry')}</option>
              <option value="software_development">
                {t('organization.industries.software_development')}
              </option>
              <option value="web_development">
                {t('organization.industries.web_development')}
              </option>
              <option value="mobile_development">
                {t('organization.industries.mobile_development')}
              </option>
              <option value="devops_cloud">{t('organization.industries.devops_cloud')}</option>
              <option value="data_science">{t('organization.industries.data_science')}</option>
              <option value="cybersecurity">{t('organization.industries.cybersecurity')}</option>
              <option value="ai_machine_learning">
                {t('organization.industries.ai_machine_learning')}
              </option>
              <option value="blockchain">{t('organization.industries.blockchain')}</option>
              <option value="game_development">
                {t('organization.industries.game_development')}
              </option>
              <option value="qa_testing">{t('organization.industries.qa_testing')}</option>
              <option value="consulting">{t('organization.industries.consulting')}</option>
              <option value="fintech">{t('organization.industries.fintech')}</option>
              <option value="healthtech">{t('organization.industries.healthtech')}</option>
              <option value="edtech">{t('organization.industries.edtech')}</option>
              <option value="ecommerce">{t('organization.industries.ecommerce')}</option>
              <option value="saas">{t('organization.industries.saas')}</option>
              <option value="other">{t('organization.industries.other')}</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="create-org-size" style={styles.label}>{t('organization.create.size')}</label>
            <select
              id="create-org-size"
              value={createForm.size}
              onChange={(e) => updateCreateForm('size', e.target.value)}
              style={styles.input}
            >
              <option value="">{t('organization.create.selectSize')}</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>

          <div style={{ ...styles.modalActions, ...styles.fullWidth }}>
            <SecondaryButton type="button" onClick={onClose}>
              {t('common.cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={creating}>
              {creating ? t('organization.create.creating') : t('organization.create.createButton')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormNumber, FormSelect, FormInput } from './FormComponents';
import { AFTER_HOURS_OPTIONS } from '../../types/projectTypes';
import PrimaryButton from '../PrimaryButton';

/**
 * Step 6: Availability Requirements
 */
export default function Step6Availability({ formData, onChange }) {
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handlePeriodChange = (index, field, value) => {
    const newPeriods = [...(formData.highLoadPeriods || [])];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    onChange({ highLoadPeriods: newPeriods });
  };

  const addPeriod = () => {
    const newPeriods = [
      ...(formData.highLoadPeriods || []),
      { _key: `period-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, description: '', startDate: '', endDate: '' },
    ];
    onChange({ highLoadPeriods: newPeriods });
  };

  const removePeriod = (index) => {
    const newPeriods = formData.highLoadPeriods.filter((_, i) => i !== index);
    onChange({ highLoadPeriods: newPeriods });
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>{t('projects.steps.step6.title')}</h2>
      <p style={styles.stepDescription}>{t('projects.steps.step6.description')}</p>

      <FormNumber
        label={t('projects.steps.step6.weeklyHoursPerMember')}
        name="weeklyHoursPerMember"
        value={formData.weeklyHoursPerMember || 40}
        onChange={handleChange}
        required
        min={1}
        max={168}
      />

      <FormSelect
        label={t('projects.steps.step6.requiresAfterHoursAvailability')}
        name="requiresAfterHoursAvailability"
        value={formData.requiresAfterHoursAvailability || 'no'}
        onChange={handleChange}
        options={[
          { value: AFTER_HOURS_OPTIONS.YES, label: t('projects.steps.step6.afterHoursYes') },
          { value: AFTER_HOURS_OPTIONS.NO, label: t('projects.steps.step6.afterHoursNo') },
          {
            value: AFTER_HOURS_OPTIONS.OCCASIONAL,
            label: t('projects.steps.step6.afterHoursOccasional'),
          },
        ]}
      />

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{t('projects.steps.step6.highLoadPeriods')}</h3>
          <PrimaryButton onClick={addPeriod}>{t('projects.steps.step6.addPeriod')}</PrimaryButton>
        </div>

        {formData.highLoadPeriods && formData.highLoadPeriods.length > 0 ? (
          formData.highLoadPeriods.map((period, index) => (
            <div key={period._key} style={styles.periodCard}>
              <div style={styles.periodHeader}>
                <span style={styles.periodNumber}>
                  {t('projects.steps.step6.period')} {index + 1}
                </span>
                <button type="button" style={styles.removeButton} onClick={() => removePeriod(index)}>
                  {t('projects.steps.step5.remove')}
                </button>
              </div>

              <FormInput
                label={t('projects.steps.step6.periodDescription')}
                name={`periodDescription-${index}`}
                value={period.description || ''}
                onChange={(e) => handlePeriodChange(index, 'description', e.target.value)}
                placeholder={t('projects.steps.step6.periodDescriptionPlaceholder')}
              />

              <div style={styles.row}>
                <FormInput
                  label={t('projects.steps.step6.startDate')}
                  name={`periodStart-${index}`}
                  type="date"
                  value={period.startDate || ''}
                  onChange={(e) => handlePeriodChange(index, 'startDate', e.target.value)}
                />

                <FormInput
                  label={t('projects.steps.step6.endDate')}
                  name={`periodEnd-${index}`}
                  type="date"
                  value={period.endDate || ''}
                  onChange={(e) => handlePeriodChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyText}>{t('projects.steps.step6.noPeriodsMessage')}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 8px 0',
  },
  stepDescription: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    marginBottom: '32px',
  },
  section: {
    marginTop: '32px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  periodCard: {
    padding: '20px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid var(--color-border)',
  },
  periodHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  periodNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
  },
  removeButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    transition: 'all 0.2s',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  emptyText: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    padding: '40px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
  },
};

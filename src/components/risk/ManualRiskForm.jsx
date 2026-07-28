import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ManualRiskFields from './ManualRiskFields';
import ManualRiskPreview from './ManualRiskPreview';
import ManualRiskActions from './ManualRiskActions';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

/**
 * ManualRiskForm Component
 * Form for adding or editing manual risks
 */
export default function ManualRiskForm({
  initialRisk = null,
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
}) {
  const { t } = useTranslation();
  const isEditing = !!initialRisk;

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    severity: 'medium',
    rootCause: '',
    indicators: [],
    recommendations: [],
    indicatorInput: '',
    recommendationInput: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialRisk) {
      setFormData({
        type: initialRisk.type || '',
        title: initialRisk.title || '',
        description: initialRisk.description || '',
        severity: initialRisk.severity || 'medium',
        rootCause: initialRisk.rootCause || '',
        indicators: initialRisk.indicators || [],
        recommendations: initialRisk.recommendations || [],
        indicatorInput: '',
        recommendationInput: '',
      });
    }
  }, [initialRisk]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddIndicator = () => {
    const input = formData.indicatorInput.trim();
    if (input) {
      setFormData((prev) => ({
        ...prev,
        indicators: [...prev.indicators, input],
        indicatorInput: '',
      }));
    }
  };

  const handleRemoveIndicator = (index) => {
    setFormData((prev) => ({
      ...prev,
      indicators: prev.indicators.filter((_, i) => i !== index),
    }));
  };

  const handleAddRecommendation = () => {
    const input = formData.recommendationInput.trim();
    if (input) {
      setFormData((prev) => ({
        ...prev,
        recommendations: [...prev.recommendations, input],
        recommendationInput: '',
      }));
    }
  };

  const handleRemoveRecommendation = (index) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = t('risk.form.riskTypeRequired');
    }
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = t('risk.form.titleRequired');
    }
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = t('risk.form.descriptionRequired');
    }

    if (formData.severity && !SEVERITIES.includes(formData.severity)) {
      newErrors.severity = t('risk.form.invalidSeverity');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submissionData = {
      ...(isEditing ? {} : { type: formData.type }),
      title: formData.title,
      description: formData.description,
      severity: formData.severity || 'medium',
      rootCause: formData.rootCause || undefined,
      recommendations: formData.recommendations.length > 0 ? formData.recommendations : undefined,
      indicators: formData.indicators.length > 0 ? formData.indicators : undefined,
    };

    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === undefined) {
        delete submissionData[key];
      }
    });

    onSubmit(submissionData);
  };

  return (
    <ManualRiskPreview isEditing={isEditing} onCancel={onCancel}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <ManualRiskFields
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          onChange={handleChange}
          onAddIndicator={handleAddIndicator}
          onRemoveIndicator={handleRemoveIndicator}
          onAddRecommendation={handleAddRecommendation}
          onRemoveRecommendation={handleRemoveRecommendation}
        />

        <ManualRiskActions
          isEditing={isEditing}
          loading={loading}
          onDelete={onDelete}
          onCancel={onCancel}
        />
      </form>
    </ManualRiskPreview>
  );
}

const styles = {
  form: {
    padding: '24px',
  },
};

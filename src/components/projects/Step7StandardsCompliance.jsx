import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { COMPLIANCE_STANDARDS } from '../../types/projectTypes';

/**
 * Step 7: Standards & Compliance
 * NEW CRITICAL STEP - Manages compliance and standardization requirements
 */
export default function Step7StandardsCompliance({ formData, onChange }) {

  const handleStandardToggle = (standard) => {
    const current = formData.complianceStandards || [];
    const newStandards = current.includes(standard)
      ? current.filter(s => s !== standard)
      : [...current, standard];
    onChange({ complianceStandards: newStandards });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Standards & Compliance</h2>
      <p style={styles.description}>
        Define regulatory compliance requirements and standardized procedures
      </p>

      {/* Requires Regulatory Compliance */}
      <div style={styles.formGroup}>
        <label style={styles.label} id="requiresRegulatoryCompliance-label">
          Requires Regulatory Compliance <span style={styles.required}>*</span>
        </label>
        <div style={styles.radioGroup} role="radiogroup" aria-labelledby="requiresRegulatoryCompliance-label">
          <label style={styles.radioLabel} htmlFor="requiresRegulatoryCompliance-yes">
            <input
              type="radio"
              name="requiresRegulatoryCompliance"
              value="true"
              id="requiresRegulatoryCompliance-yes"
              checked={formData.requiresRegulatoryCompliance === true}
              onChange={() => onChange({ requiresRegulatoryCompliance: true })}
              style={styles.radio}
            />
            Yes
          </label>
          <label style={styles.radioLabel} htmlFor="requiresRegulatoryCompliance-no">
            <input
              type="radio"
              name="requiresRegulatoryCompliance"
              value="false"
              id="requiresRegulatoryCompliance-no"
              checked={formData.requiresRegulatoryCompliance === false}
              onChange={() => onChange({ 
                requiresRegulatoryCompliance: false,
                complianceStandards: [],
                standardsDocumentation: undefined
              })}
              style={styles.radio}
            />
            No
          </label>
        </div>
      </div>

      {/* Conditional: Compliance Standards */}
      {formData.requiresRegulatoryCompliance && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label} id="complianceStandards-label">Compliance Standards</label>
            <div style={styles.checkboxGroup}>
              {Object.entries(COMPLIANCE_STANDARDS).map(([key, value]) => (
                <label key={key} style={styles.checkboxLabel} htmlFor={`compliance-${key}`}>
                  <input
                    type="checkbox"
                    id={`compliance-${key}`}
                    checked={(formData.complianceStandards || []).includes(value)}
                    onChange={() => handleStandardToggle(value)}
                    style={styles.checkbox}
                    aria-labelledby="complianceStandards-label"
                  />
                  {value}
                </label>
              ))}
            </div>
            <small style={styles.helpText}>
              Selected: {formData.complianceStandards?.length || 0} standard(s)
            </small>
          </div>

          {/* Has Standardized Procedures */}
          <div style={styles.formGroup}>
            <label style={styles.label} id="hasStandardizedProcedures-label">Has Standardized Procedures</label>
            <div style={styles.radioGroup} role="radiogroup" aria-labelledby="hasStandardizedProcedures-label">
              <label style={styles.radioLabel} htmlFor="hasStandardizedProcedures-yes">
                <input
                  type="radio"
                  name="hasStandardizedProcedures"
                  value="true"
                  id="hasStandardizedProcedures-yes"
                  checked={formData.hasStandardizedProcedures === true}
                  onChange={() => onChange({ hasStandardizedProcedures: true })}
                  style={styles.radio}
                />
                Yes
              </label>
              <label style={styles.radioLabel} htmlFor="hasStandardizedProcedures-no">
                <input
                  type="radio"
                  name="hasStandardizedProcedures"
                  value="false"
                  id="hasStandardizedProcedures-no"
                  checked={formData.hasStandardizedProcedures === false}
                  onChange={() => onChange({ hasStandardizedProcedures: false })}
                  style={styles.radio}
                />
                No
              </label>
            </div>
            <small style={styles.helpText}>
              Standardized procedures help ensure compliance consistency
            </small>
          </div>

          {/* Standards Documentation */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="standardsDocumentation">Standards Documentation</label>
            <textarea
              id="standardsDocumentation"
              value={formData.standardsDocumentation || ''}
              onChange={(e) => onChange({ standardsDocumentation: e.target.value })}
              placeholder="Describe the standards, procedures, and compliance requirements (max 2000 chars)..."
              maxLength="2000"
              rows="6"
              style={styles.textarea}
              aria-label="Standards documentation"
            />
            <small style={styles.helpText}>
              {(formData.standardsDocumentation || '').length}/2000 characters
            </small>
          </div>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <Info size={20} color="#004085" style={{ flexShrink: 0 }} />
            <div>
              <strong>Compliance Considerations</strong>
              <ul style={styles.infoList}>
                <li><strong>GDPR:</strong> EU data protection regulation</li>
                <li><strong>HIPAA:</strong> US healthcare data security</li>
                <li><strong>SOC2:</strong> Service organization controls</li>
                <li><strong>ISO27001:</strong> Information security management</li>
                <li><strong>PCI-DSS:</strong> Payment card industry standards</li>
              </ul>
            </div>
          </div>

          {/* Warning for missing procedures */}
          {!formData.hasStandardizedProcedures && (
            <div style={styles.warningBox}>
              <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
              <div>
                <strong>Warning: No Standardized Procedures</strong>
                <p>
                  Without standardized procedures, compliance requirements may be difficult to
                  maintain consistently across the team, increasing audit risk.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* No Compliance Message */}
      {formData.requiresRegulatoryCompliance === false && (
        <div style={styles.successBox}>
          <CheckCircle size={20} color="#155724" style={{ flexShrink: 0 }} />
          <div>
            <strong>No Regulatory Compliance Required</strong>
            <p>
              This project doesn't have specific compliance requirements. However, following
              best practices for security and quality is still recommended.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#111827'
  },
  description: {
    color: '#6B7280',
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#374151'
  },
  required: {
    color: '#EF4444'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  radioGroup: {
    display: 'flex',
    gap: '16px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer'
  },
  radio: {
    marginRight: '6px',
    cursor: 'pointer'
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer'
  },
  helpText: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'block',
    marginTop: '4px'
  },
  error: {
    fontSize: '13px',
    color: '#EF4444',
    display: 'block',
    marginTop: '4px'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#DBEAFE',
    border: '1px solid #3B82F6',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  infoIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  infoList: {
    marginTop: '8px',
    marginLeft: '20px',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FCD34D',
    borderRadius: '8px',
    marginTop: '24px'
  },
  warningIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  successBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#D1FAE5',
    border: '1px solid #10B981',
    borderRadius: '8px',
    marginTop: '24px'
  },
  successIcon: {
    fontSize: '24px',
    flexShrink: 0,
    color: '#10B981'
  }
};

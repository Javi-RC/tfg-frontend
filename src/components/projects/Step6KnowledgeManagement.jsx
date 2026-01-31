import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import { KNOWLEDGE_MANAGEMENT_SYSTEMS } from '../../types/projectTypes';

/**
 * Step 6: Knowledge Management
 * NEW CRITICAL STEP - Manages knowledge sharing and documentation
 */
export default function Step6KnowledgeManagement({ formData, onChange, errors }) {
  const hasTools = formData.knowledgeManagementSystem || (formData.knowledgeManagementTools?.length > 0);
  const showWarning = !hasTools;

  const handleProcessToggle = (process) => {
    const processes = formData.documentationProcesses || {};
    onChange({
      documentationProcesses: {
        ...processes,
        [process]: !processes[process]
      }
    });
  };

  const handleKnowledgeToolsChange = (tools) => {
    const toolsArray = tools.split(',').map(t => t.trim()).filter(t => t.length > 0);
    onChange({ knowledgeManagementTools: toolsArray });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Knowledge Management</h2>
      <p style={styles.description}>
        Configure how knowledge and documentation will be managed across the team
      </p>

      {/* Warning Alert */}
      {showWarning && (
        <div style={styles.warningBox}>
          <AlertTriangle size={20} color="#856404" style={{ flexShrink: 0 }} />
          <div>
            <strong>Risk: No Knowledge Management Tools</strong>
            <p>
              Without proper knowledge management, your team may face:
            </p>
            <ul style={styles.warningList}>
              <li>Information silos and communication gaps</li>
              <li>Repeated work and lost tribal knowledge</li>
              <li>Difficulty onboarding new team members</li>
              <li>Higher risk of project delays</li>
            </ul>
          </div>
        </div>
      )}

      {/* Knowledge Management System */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="knowledgeManagementSystem">Knowledge Management System</label>
        <select
          id="knowledgeManagementSystem"
          value={formData.knowledgeManagementSystem || ''}
          onChange={(e) => onChange({ knowledgeManagementSystem: e.target.value })}
          style={styles.select}
          aria-label="Knowledge management system"
        >
          <option value="">Select a system...</option>
          {Object.entries(KNOWLEDGE_MANAGEMENT_SYSTEMS).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="knowledgeManagementTools">
          Knowledge Management Tools
          <span style={styles.hint}> (comma-separated)</span>
        </label>
        <input
          type="text"
          id="knowledgeManagementTools"
          value={(formData.knowledgeManagementTools || []).join(', ')}
          onChange={(e) => handleKnowledgeToolsChange(e.target.value)}
          placeholder="e.g., Confluence, Notion, SharePoint"
          style={styles.input}
          aria-label="Knowledge management tools"
        />
        <small style={styles.helpText}>
          Current tools: {formData.knowledgeManagementTools?.length || 0}
        </small>
      </div>

      {/* Documentation Processes */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Documentation Processes</label>
        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel} htmlFor="km-doc-standardization">
            <input
              type="checkbox"
              id="km-doc-standardization"
              checked={formData.documentationProcesses?.hasStandardization || false}
              onChange={() => handleProcessToggle('hasStandardization')}
              style={styles.checkbox}
            />
            Has Documentation Standardization
          </label>

          <label style={styles.checkboxLabel} htmlFor="km-doc-templates">
            <input
              type="checkbox"
              id="km-doc-templates"
              checked={formData.documentationProcesses?.templates || false}
              onChange={() => handleProcessToggle('templates')}
              style={styles.checkbox}
            />
            Uses Templates
          </label>

          <label style={styles.checkboxLabel} htmlFor="km-doc-review">
            <input
              type="checkbox"
              id="km-doc-review"
              checked={formData.documentationProcesses?.reviewProcess || false}
              onChange={() => handleProcessToggle('reviewProcess')}
              style={styles.checkbox}
            />
            Has Review Process
          </label>
        </div>
        <small style={styles.helpText}>
          Select all that apply to improve documentation quality
        </small>
      </div>

      {/* Best Practices Tip */}
      {hasTools && (
        <div style={styles.tipBox}>
          <span style={styles.tipIcon}>💡</span>
          <div>
            <strong>Best Practice</strong>
            <p>
              Effective knowledge management includes:
            </p>
            <ul style={styles.tipList}>
              <li>Regular documentation updates</li>
              <li>Clear naming conventions</li>
              <li>Searchable knowledge base</li>
              <li>Version control for documents</li>
            </ul>
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
  hint: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: 400
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
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
    display: 'flex',
    flexDirection: 'column',
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
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEE2E2',
    border: '2px solid #EF4444',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  warningIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  warningList: {
    marginTop: '8px',
    marginLeft: '20px',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  tipBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#DBEAFE',
    border: '1px solid #3B82F6',
    borderRadius: '8px',
    marginTop: '24px'
  },
  tipIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  tipList: {
    marginTop: '8px',
    marginLeft: '20px',
    fontSize: '14px',
    lineHeight: '1.6'
  }
};

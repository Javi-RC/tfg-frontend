import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, X, Search, XCircle } from 'lucide-react';

/**
 * RisksSection Component
 * Tracks which predicted risks occurred and captures unpredicted risks
 */
export default function RisksSection({ formData, setFormData, predictedRisks = [] }) {
  const [expandedRisks, setExpandedRisks] = useState({});

  const getRiskTypeLabel = (type) => {
    const labels = {
      communication_breakdown: 'Communication Breakdown',
      skill_gap: 'Skill Gap',
      team_overload: 'Team Overload',
      dependency_blockage: 'Dependency Blockage',
      scope_creep: 'Scope Creep',
      process_mismatch: 'Process Mismatch',
      technical_infrastructure: 'Technical Infrastructure',
      quality_degradation: 'Quality Degradation',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#EAB308',
      low: '#10B981'
    };
    return colors[severity] || '#6B7280';
  };

  const handleRiskOccurred = (riskId, occurred) => {
    const actualizedRisks = formData.actualizedRisks || [];
    const existingIndex = actualizedRisks.findIndex(r => r.riskId === riskId);

    if (existingIndex >= 0) {
      const updated = [...actualizedRisks];
      updated[existingIndex] = {
        ...updated[existingIndex],
        occurred
      };
      setFormData(prev => ({ ...prev, actualizedRisks: updated }));
    } else {
      const risk = predictedRisks.find(r => r.id === riskId);
      setFormData(prev => ({
        ...prev,
        actualizedRisks: [
          ...actualizedRisks,
          {
            riskId,
            type: risk?.type || 'other',
            occurred,
            severity: risk?.severity || 'medium'
          }
        ]
      }));
    }

    if (occurred) {
      setExpandedRisks(prev => ({ ...prev, [riskId]: true }));
    }
  };

  const updateRiskField = (riskId, field, value) => {
    const actualizedRisks = formData.actualizedRisks || [];
    const existingIndex = actualizedRisks.findIndex(r => r.riskId === riskId);

    if (existingIndex >= 0) {
      const updated = [...actualizedRisks];
      updated[existingIndex] = {
        ...updated[existingIndex],
        [field]: value
      };
      setFormData(prev => ({ ...prev, actualizedRisks: updated }));
    }
  };

  const addUnpredictedRisk = () => {
    const newRiskId = `unpredicted_${Date.now()}`;
    const actualizedRisks = formData.actualizedRisks || [];
    
    setFormData(prev => ({
      ...prev,
      actualizedRisks: [
        ...actualizedRisks,
        {
          riskId: newRiskId,
          type: 'other',
          occurred: true,
          severity: 'medium',
          unpredicted: true,
          description: ''
        }
      ]
    }));
    
    setExpandedRisks(prev => ({ ...prev, [newRiskId]: true }));
  };

  const removeUnpredictedRisk = (riskId) => {
    const actualizedRisks = formData.actualizedRisks || [];
    setFormData(prev => ({
      ...prev,
      actualizedRisks: actualizedRisks.filter(r => r.riskId !== riskId)
    }));
  };

  const getRiskData = (riskId) => {
    return (formData.actualizedRisks || []).find(r => r.riskId === riskId) || {};
  };

  const toggleExpanded = (riskId) => {
    setExpandedRisks(prev => ({ ...prev, [riskId]: !prev[riskId] }));
  };

  // Combine predicted risks with unpredicted ones
  const unpredictedRisks = (formData.actualizedRisks || []).filter(r => r.unpredicted);

  return (
    <div style={styles.section}>
      <h3 style={{...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <AlertTriangle size={24} />
        Predicted vs Actual Risks
      </h3>
      <p style={styles.sectionDescription}>
        {predictedRisks.length} risks were predicted for this project. Indicate which ones actually occurred.
      </p>

      {/* Predicted Risks */}
      <div style={styles.risksList}>
        {predictedRisks.map(risk => {
          const riskData = getRiskData(risk.id);
          const occurred = riskData.occurred || false;
          const isExpanded = expandedRisks[risk.id] || false;

          return (
            <div key={risk.id} style={styles.riskCard}>
              <div style={styles.riskHeader}>
                <div style={styles.riskHeaderLeft}>
                  <span 
                    style={{
                      ...styles.severityBadge,
                      background: getSeverityColor(risk.severity),
                    }}
                  >
                    {risk.severity?.toUpperCase()}
                  </span>
                  <span style={styles.riskType}>
                    {getRiskTypeLabel(risk.type)}
                  </span>
                </div>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={occurred}
                    onChange={(e) => handleRiskOccurred(risk.id, e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={{ color: occurred ? '#10B981' : '#6B7280' }}>
                    {occurred ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={16} />
                        Occurred
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <X size={16} />
                        Did not occur
                      </span>
                    )}
                  </span>
                </label>
              </div>

              <p style={styles.riskPrediction}>
                Prediction: {risk.description}
              </p>

              {occurred && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(risk.id)}
                    style={styles.expandButton}
                  >
                    {isExpanded ? '▼ Hide details' : '▶ Show details'}
                  </button>

                  {isExpanded && (
                    <div style={styles.riskDetails}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Description of what occurred <span style={styles.required}>*</span>
                        </label>
                        <textarea
                          value={riskData.description || ''}
                          onChange={(e) => updateRiskField(risk.id, 'description', e.target.value)}
                          style={styles.textarea}
                          rows={3}
                          placeholder="E.g.: Team in Asia could not attend daily meetings due to time zone difference"
                        />
                      </div>

                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Detection date</label>
                          <input
                            type="date"
                            value={riskData.detectedAt ? new Date(riskData.detectedAt).toISOString().split('T')[0] : ''}
                            onChange={(e) => updateRiskField(risk.id, 'detectedAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
                            style={styles.input}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Mitigation date</label>
                          <input
                            type="date"
                            value={riskData.mitigatedAt ? new Date(riskData.mitigatedAt).toISOString().split('T')[0] : ''}
                            onChange={(e) => updateRiskField(risk.id, 'mitigatedAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Days of delay caused</label>
                          <input
                            type="number"
                            min="0"
                            value={riskData.scheduleDelayDays || ''}
                            onChange={(e) => updateRiskField(risk.id, 'scheduleDelayDays', parseInt(e.target.value) || 0)}
                            style={styles.input}
                            placeholder="0"
                          />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Extra budget (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={riskData.budgetOverrunPercent || ''}
                            onChange={(e) => updateRiskField(risk.id, 'budgetOverrunPercent', parseFloat(e.target.value) || 0)}
                            style={styles.input}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Quality impact</label>
                        <select
                          value={riskData.qualityImpact || 'none'}
                          onChange={(e) => updateRiskField(risk.id, 'qualityImpact', e.target.value)}
                          style={styles.select}
                        >
                          <option value="none">No impact</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Root cause <span style={styles.required}>*</span>
                        </label>
                        <textarea
                          value={riskData.rootCause || ''}
                          onChange={(e) => updateRiskField(risk.id, 'rootCause', e.target.value)}
                          style={styles.textarea}
                          rows={2}
                          placeholder="E.g.: Time zone overlap too small (only 3 hours)"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {!occurred && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Why didn't it occur?</label>
                  <textarea
                    value={riskData.avoidanceReason || ''}
                    onChange={(e) => updateRiskField(risk.id, 'avoidanceReason', e.target.value)}
                    style={styles.textarea}
                    rows={2}
                    placeholder="E.g.: Good resource planning and realistic sprint goals"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unpredicted Risks */}
      {unpredictedRisks.length > 0 && (
        <>
          <div style={styles.divider} />
          <h4 style={styles.subsectionTitle}>🔍 Unpredicted Risks</h4>
          
          <div style={styles.risksList}>
            {unpredictedRisks.map(risk => {
              const isExpanded = expandedRisks[risk.riskId] || false;

              return (
                <div key={risk.riskId} style={styles.riskCard}>
                  <div style={styles.riskHeader}>
                    <div style={styles.riskHeaderLeft}>
                      <span style={{...styles.severityBadge, background: '#9333EA'}}>
                        UNPREDICTED
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUnpredictedRisk(risk.riskId)}
                      style={styles.removeButton}
                    >
                      ✕ Delete
                    </button>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Risk type <span style={styles.required}>*</span>
                    </label>
                    <select
                      value={risk.type || 'other'}
                      onChange={(e) => updateRiskField(risk.riskId, 'type', e.target.value)}
                      style={styles.select}
                    >
                      <option value="communication_breakdown">Communication Breakdown</option>
                      <option value="skill_gap">Skill Gap</option>
                      <option value="team_overload">Team Overload</option>
                      <option value="dependency_blockage">Dependency Blockage</option>
                      <option value="scope_creep">Scope Creep</option>
                      <option value="process_mismatch">Process Mismatch</option>
                      <option value="technical_infrastructure">Technical Infrastructure</option>
                      <option value="quality_degradation">Quality Degradation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpanded(risk.riskId)}
                    style={styles.expandButton}
                  >
                    {isExpanded ? '▼ Hide details' : '▶ Show details'}
                  </button>

                  {isExpanded && (
                    <div style={styles.riskDetails}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Description <span style={styles.required}>*</span>
                        </label>
                        <textarea
                          value={risk.description || ''}
                          onChange={(e) => updateRiskField(risk.riskId, 'description', e.target.value)}
                          style={styles.textarea}
                          rows={3}
                          placeholder="Describe what occurred"
                        />
                      </div>

                      <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Days of delay</label>
                          <input
                            type="number"
                            min="0"
                            value={risk.scheduleDelayDays || ''}
                            onChange={(e) => updateRiskField(risk.riskId, 'scheduleDelayDays', parseInt(e.target.value) || 0)}
                            style={styles.input}
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>% extra budget</label>
                          <input
                            type="number"
                            min="0"
                            value={risk.budgetOverrunPercent || ''}
                            onChange={(e) => updateRiskField(risk.riskId, 'budgetOverrunPercent', parseFloat(e.target.value) || 0)}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Root cause <span style={styles.required}>*</span>
                        </label>
                        <textarea
                          value={risk.rootCause || ''}
                          onChange={(e) => updateRiskField(risk.riskId, 'rootCause', e.target.value)}
                          style={styles.textarea}
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={addUnpredictedRisk}
        style={styles.addButton}
      >
        + Add Unpredicted Risk
      </button>
    </div>
  );
}

const styles = {
  section: {
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '24px'
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px'
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  riskCard: {
    padding: '16px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  riskHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  severityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  riskType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  },
  riskPrediction: {
    fontSize: '13px',
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: '12px'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    color: '#2563EB',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px 0',
    marginTop: '8px'
  },
  riskDetails: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
  },
  formGroup: {
    marginBottom: '16px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  required: {
    color: '#DC2626'
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    background: '#FFFFFF'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    background: '#FFFFFF',
    border: '2px dashed #D1D5DB',
    borderRadius: '8px',
    color: '#2563EB',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'all 0.2s'
  },
  removeButton: {
    background: '#FEE2E2',
    border: 'none',
    color: '#DC2626',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  divider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '24px 0'
  }
};

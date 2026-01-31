import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Custom Node Component for Risk Visualization
 * Displays risk information with severity-based styling
 */
const RiskNode = memo(({ data }) => {
  const { 
    label, 
    severity, 
    occurred, 
    isCategory,
    isRoot,
    probability,
    onClick 
  } = data;

  const getSeverityColor = (severity) => {
    const colors = {
      critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
      high: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
      medium: { bg: '#FEF9C3', border: '#EAB308', text: '#854D0E' },
      low: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' }
    };
    return colors[severity] || { bg: '#F3F4F6', border: '#6B7280', text: '#374151' };
  };

  // Root node (Project)
  if (isRoot) {
    return (
      <div
        style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          border: '3px solid #5a67d8',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          minWidth: '200px',
          textAlign: 'center'
        }}
      >
        {label}
        <Handle type="source" position={Position.Bottom} style={{ background: '#5a67d8' }} />
      </div>
    );
  }

  // Category node
  if (isCategory) {
    return (
      <div
        style={{
          padding: '12px 20px',
          borderRadius: '10px',
          background: '#F9FAFB',
          border: '2px solid #D1D5DB',
          fontWeight: '600',
          fontSize: '14px',
          color: '#374151',
          minWidth: '150px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Handle type="target" position={Position.Top} style={{ background: '#9CA3AF' }} />
        {label}
        <Handle type="source" position={Position.Bottom} style={{ background: '#9CA3AF' }} />
      </div>
    );
  }

  // Risk node
  const colors = getSeverityColor(severity);
  const hasOccurred = occurred === true;
  const hasNotOccurred = occurred === false;

  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 18px',
        borderRadius: '10px',
        background: colors.bg,
        border: `3px solid ${colors.border}`,
        color: colors.text,
        fontSize: '13px',
        minWidth: '180px',
        maxWidth: '220px',
        cursor: 'pointer',
        boxShadow: hasOccurred 
          ? `0 6px 20px ${colors.border}60` 
          : '0 3px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        position: 'relative',
        opacity: hasNotOccurred ? 0.5 : 1
      }}
      className="risk-node-hover"
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: colors.border, width: 8, height: 8 }} 
      />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {label}
          </div>
          <div style={{ 
            fontSize: '11px', 
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              background: 'rgba(0,0,0,0.1)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              {severity?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div style={{ 
        position: 'absolute', 
        top: '-8px', 
        right: '-8px',
        background: 'white',
        borderRadius: '50%',
        padding: '2px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {hasOccurred && <CheckCircle size={20} color="#10B981" fill="#D1FAE5" />}
        {hasNotOccurred && <XCircle size={20} color="#6B7280" fill="#F3F4F6" />}
      </div>
    </div>
  );
});

RiskNode.displayName = 'RiskNode';

export default RiskNode;

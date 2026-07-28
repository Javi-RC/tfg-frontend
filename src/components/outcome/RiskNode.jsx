import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './RiskNode.css';

/**
 * Custom Node Component for Risk Visualization
 * Displays risk information with severity-based styling
 */
const getSeverityColor = (severity) => {
  const colors = {
    critical: { bg: '#FEE2E2', border: 'var(--color-danger)', text: '#991B1B' },
    high: { bg: '#FEF3C7', border: 'var(--color-warning)', text: '#92400E' },
    medium: { bg: '#FEF9C3', border: '#EAB308', text: '#854D0E' },
    low: { bg: '#D1FAE5', border: 'var(--color-success)', text: '#065F46' },
  };
  return colors[severity] || { bg: '#F3F4F6', border: 'var(--color-text-muted)', text: '#374151' };
};

const RiskNode = memo(({ data }) => {
  const { label, severity, occurred, isCategory, isRoot, onClick } = data;

  // Root node (Project)
  if (isRoot) {
    return (
      <div className="risk-node-root">
        {label}
        <Handle type="source" position={Position.Bottom} className="risk-node-root-handle" />
      </div>
    );
  }

  // Category node
  if (isCategory) {
    return (
      <div className="risk-node-category">
        <Handle type="target" position={Position.Top} className="risk-node-category-handle" />
        {label}
        <Handle type="source" position={Position.Bottom} className="risk-node-category-handle" />
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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        '--risk-bg': colors.bg,
        '--risk-border': colors.border,
        '--risk-text': colors.text,
        '--risk-shadow': hasOccurred ? `0 6px 20px ${colors.border}60` : '0 3px 10px rgba(0,0,0,0.1)',
      }}
      className={`risk-node-risk risk-node-risk--dynamic${hasOccurred ? ' risk-node-risk--occurred' : ''}${hasNotOccurred ? ' risk-node-risk--not-occurred' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ '--risk-handle-color': colors.border }}
        className="risk-node-risk-handle"
      />

      <div className="risk-node-content">
        <AlertTriangle size={18} className="risk-node-risk-icon" />
        <div className="risk-node-risk-body">
          <div className="risk-node-label">{label}</div>
          <div className="risk-node-severity">
            <span className="risk-node-severity-badge">
              {severity?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="risk-node-status">
        {hasOccurred && <CheckCircle size={20} color="#10B981" fill="#D1FAE5" />}
        {hasNotOccurred && <XCircle size={20} color="#6B7280" fill="#F3F4F6" />}
      </div>
    </div>
  );
});

RiskNode.displayName = 'RiskNode';

export default RiskNode;

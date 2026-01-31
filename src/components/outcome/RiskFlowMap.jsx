import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RiskNode from './RiskNode';
import { transformRisksToFlow } from '../../utils/riskFlowUtils';

/**
 * RiskFlowMap Component
 * Interactive visualization of project risks using React Flow
 * Enhanced with accessibility features and keyboard navigation
 */
export default function RiskFlowMap({ 
  predictedRisks = [], 
  actualizedRisks = [],
  projectName = 'Project',
  onRiskClick = null
}) {
  const [selectedRisk, setSelectedRisk] = useState(null);

  // Define custom node types
  const nodeTypes = useMemo(() => ({ risk: RiskNode }), []);

  // Transform data to flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return transformRisksToFlow(predictedRisks, actualizedRisks, projectName);
  }, [predictedRisks, actualizedRisks, projectName]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback((event, node) => {
    if (node.data.riskData) {
      setSelectedRisk(node.data.riskData);
      if (onRiskClick) {
        onRiskClick(node.data.riskData);
      }
    }
  }, [onRiskClick]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedRisk) return;

      if (e.key === 'Escape') {
        setSelectedRisk(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRisk]);

  // Calculate statistics for legend
  const stats = useMemo(() => {
    const occurred = actualizedRisks.filter(r => r.occurred).length;
    const notOccurred = actualizedRisks.filter(r => r.occurred === false).length;
    const unknown = predictedRisks.length - occurred - notOccurred;
    
    const bySeverity = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    predictedRisks.forEach(risk => {
      if (bySeverity[risk.severity] !== undefined) {
        bySeverity[risk.severity]++;
      }
    });
    
    return { occurred, notOccurred, unknown, bySeverity };
  }, [predictedRisks, actualizedRisks]);

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'relative' }}
      role="application"
      aria-label="Risk visualization map"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.3,
          maxZoom: 0.8,
          duration: 300
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultZoom={0.6}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#9CA3AF', strokeWidth: 2 }
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        aria-label="Interactive risk flow diagram"
      >
        <Background color="#E5E7EB" gap={20} size={1} />
        <Controls 
          showInteractive={false}
          aria-label="Flow controls"
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data.isRoot) return '#667eea';
            if (node.data.isCategory) return '#D1D5DB';
            const colors = {
              critical: '#DC2626',
              high: '#F59E0B',
              medium: '#EAB308',
              low: '#10B981'
            };
            return colors[node.data.severity] || '#6B7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '8px'
          }}
          aria-label="Minimap overview"
        />
      </ReactFlow>

      {/* Enhanced Legend with better descriptions */}
      <div 
        style={styles.legend}
        role="complementary"
        aria-label="Risk severity legend"
      >
        <div style={styles.legendTitle}>Risk Severity</div>
        <div style={styles.legendContent}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#DC2626' }} aria-hidden="true" />
            <div style={styles.legendText}>
              <strong>Critical</strong>
              <span style={styles.legendCount}>{stats.bySeverity.critical}</span>
            </div>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#F59E0B' }} aria-hidden="true" />
            <div style={styles.legendText}>
              <strong>High</strong>
              <span style={styles.legendCount}>{stats.bySeverity.high}</span>
            </div>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#EAB308' }} aria-hidden="true" />
            <div style={styles.legendText}>
              <strong>Medium</strong>
              <span style={styles.legendCount}>{stats.bySeverity.medium}</span>
            </div>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: '#10B981' }} aria-hidden="true" />
            <div style={styles.legendText}>
              <strong>Low</strong>
              <span style={styles.legendCount}>{stats.bySeverity.low}</span>
            </div>
          </div>
        </div>

        <div style={styles.legendDivider} />
        
        <div style={styles.legendHint}>
          💡 <strong>Tip:</strong> Click on any risk node for details
          <br />
          <span style={{ fontSize: '11px' }}>Use mouse wheel to zoom • Drag to pan</span>
        </div>
      </div>

      {/* Selected Risk Details Panel - Enhanced */}
      {selectedRisk && (
        <div 
          style={styles.detailsPanel}
          role="dialog"
          aria-labelledby="risk-detail-title"
          aria-modal="false"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <div id="risk-detail-title" style={styles.detailTitle}>
                {selectedRisk.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div style={styles.detailDescription}>
                {selectedRisk.description}
              </div>
              <div style={styles.detailMeta}>
                <span style={styles.detailMetaItem}>
                  <strong>Severity:</strong>{' '}
                  <span style={{ 
                    ...styles.severityBadge,
                    background: selectedRisk.severity === 'critical' ? '#FEE2E2' :
                               selectedRisk.severity === 'high' ? '#FEF3C7' :
                               selectedRisk.severity === 'medium' ? '#FEF9C3' : '#D1FAE5',
                    color: selectedRisk.severity === 'critical' ? '#991B1B' :
                           selectedRisk.severity === 'high' ? '#92400E' :
                           selectedRisk.severity === 'medium' ? '#854D0E' : '#065F46',
                  }}>
                    {selectedRisk.severity?.toUpperCase()}
                  </span>
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedRisk(null);
              }}
              style={styles.closeButton}
              aria-label="Close risk details"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style>{`
        .risk-node-hover {
          transition: all 0.2s ease;
        }
        
        .risk-node-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
        }

        .risk-node-hover:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  legend: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '220px',
    maxWidth: '280px',
    zIndex: 10
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px'
  },
  legendContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0
  },
  legendText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    fontSize: '13px',
    color: '#374151'
  },
  legendCount: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: '14px'
  },
  legendDivider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '12px 0'
  },
  legendHint: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '1.5'
  },
  detailsPanel: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    right: '16px',
    maxWidth: '600px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    zIndex: 10
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
    color: '#111827'
  },
  detailDescription: {
    fontSize: '14px',
    color: '#4B5563',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  detailMeta: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    fontSize: '13px'
  },
  detailMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  severityBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '11px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    color: '#6B7280',
    borderRadius: '4px',
    fontSize: '18px',
    lineHeight: '1',
    transition: 'all 0.2s ease'
  }
};

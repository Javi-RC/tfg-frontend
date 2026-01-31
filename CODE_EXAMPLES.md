# 💻 Ejemplos de Código - Integración 3 Capas

## 1. Integración en ProjectDetailPage

### Versión Completa
```jsx
// src/pages/ProjectDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useRiskPredictionWorkflow } from '../hooks/useRiskPredictionWorkflow';
import {
  DTIndicators,
  CbrLearnedRisks,
  RiskSelectionInterface
} from '../components/risk';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { showNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Inicializar workflow
  const workflow = useRiskPredictionWorkflow(projectId);

  // Ejecutar predicción al cargar proyecto
  useEffect(() => {
    if (projectId) {
      workflow.runPrediction();
    }
  }, [projectId]);

  return (
    <div className="project-detail-page">
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button onClick={() => setActiveTab('risks')}>
          Risk Prediction
        </button>
        <button onClick={() => setActiveTab('selection')}>
          Risk Selection
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="overview-tab">
          {/* ... existing content ... */}
        </div>
      )}

      {/* Tab: Risk Prediction */}
      {activeTab === 'risks' && (
        <div className="risks-tab">
          {workflow.error && (
            <div className="error-banner">
              {workflow.error}
            </div>
          )}

          <DTIndicators
            risks={workflow.dtRisks}
            loading={workflow.loading}
          />

          <CbrLearnedRisks
            risks={workflow.cbrRisks}
            loading={workflow.loading}
          />
        </div>
      )}

      {/* Tab: Risk Selection */}
      {activeTab === 'selection' && workflow.cbrRisks.length > 0 && (
        <div className="selection-tab">
          <RiskSelectionInterface
            cbrRisks={workflow.cbrRisks}
            filteredRisks={workflow.filteredCbrRisks}
            minSimilarity={workflow.minSimilarity}
            selectedRiskIds={workflow.selectedRiskIds}
            onSimilarityChange={workflow.updateSimilarityThreshold}
            onToggleRisk={workflow.toggleRiskSelection}
            onSelectAll={workflow.selectAllFilteredRisks}
            onClearSelection={workflow.clearSelection}
            onAccept={workflow.acceptSelectedRisks}
            loading={workflow.acceptanceLoading}
            error={workflow.acceptanceError}
          />
        </div>
      )}

      {/* Empty state if no CBR risks */}
      {activeTab === 'selection' && workflow.cbrRisks.length === 0 && (
        <div className="empty-state">
          <p>No learned risks available yet.</p>
          <p>Check the Risk Prediction tab.</p>
        </div>
      )}
    </div>
  );
}
```

---

## 2. Componente Personalizado: Risk Summary Card

```jsx
// src/components/risk/RiskSummaryCard.jsx
import React from 'react';

export function RiskSummaryCard({
  dtCount = 0,
  cbrCount = 0,
  selectedCount = 0,
  loading = false
}) {
  const commonCount = Math.min(dtCount, cbrCount);
  const uniqueDT = dtCount - commonCount;
  const uniqueCBR = cbrCount - commonCount;

  if (loading) {
    return (
      <div className="risk-summary-card loading">
        <p>Loading risk analysis...</p>
      </div>
    );
  }

  return (
    <div className="risk-summary-card">
      <div className="summary-grid">
        <div className="summary-item">
          <div className="label">Early Warnings (DT)</div>
          <div className="value">{dtCount}</div>
          <div className="detail">Pattern-based risks</div>
        </div>

        <div className="summary-item">
          <div className="label">Learned Risks (CBR)</div>
          <div className="value">{cbrCount}</div>
          <div className="detail">Similar project risks</div>
        </div>

        <div className="summary-item">
          <div className="label">Unique DT</div>
          <div className="value">{uniqueDT}</div>
          <div className="detail">New patterns detected</div>
        </div>

        <div className="summary-item">
          <div className="label">Unique CBR</div>
          <div className="value">{uniqueCBR}</div>
          <div className="detail">New learned risks</div>
        </div>

        <div className="summary-item highlight">
          <div className="label">Both Agree</div>
          <div className="value">{commonCount}</div>
          <div className="detail">High confidence</div>
        </div>

        <div className="summary-item highlight">
          <div className="label">Selected</div>
          <div className="value">{selectedCount}</div>
          <div className="detail">For monitoring</div>
        </div>
      </div>

      <style jsx>{`
        .risk-summary-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .risk-summary-card.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #999;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .summary-item {
          padding: 12px;
          border-radius: 8px;
          background: #f9fafb;
          border-left: 4px solid #667eea;
        }

        .summary-item.highlight {
          border-left-color: #10b981;
          background: #f0fdf4;
        }

        .summary-item .label {
          font-size: 12px;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .summary-item .value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .summary-item .detail {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
```

### Uso
```jsx
<RiskSummaryCard
  dtCount={workflow.dtCount}
  cbrCount={workflow.cbrCount}
  selectedCount={workflow.selectionCount}
  loading={workflow.loading}
/>
```

---

## 3. Hook Personalizado: useRiskStats

```javascript
// src/hooks/useRiskStats.js
import { useMemo } from 'react';

export function useRiskStats(dtRisks = [], cbrRisks = []) {
  return useMemo(() => {
    const dtTypes = new Set(dtRisks.map(r => r.type));
    const cbrTypes = new Set(cbrRisks.map(r => r.type));
    
    // Riesgos que aparecen en ambas capas
    const commonTypes = new Set(
      [...dtTypes].filter(t => cbrTypes.has(t))
    );
    
    // Estadísticas por severidad
    const severityStats = {
      dt: countBySeverity(dtRisks),
      cbr: countBySeverity(cbrRisks)
    };
    
    // Riesgo promedio de confianza/probabilidad
    const avgConfidence = dtRisks.length > 0
      ? (dtRisks.reduce((sum, r) => sum + r.confidence, 0) / dtRisks.length).toFixed(2)
      : 0;
    
    const avgProbability = cbrRisks.length > 0
      ? (cbrRisks.reduce((sum, r) => sum + r.probability, 0) / cbrRisks.length).toFixed(2)
      : 0;

    return {
      dtCount: dtRisks.length,
      cbrCount: cbrRisks.length,
      totalCount: dtRisks.length + cbrRisks.length,
      commonCount: commonTypes.size,
      uniqueDT: dtTypes.size - commonTypes.size,
      uniqueCBR: cbrTypes.size - commonTypes.size,
      severityStats,
      avgConfidence,
      avgProbability,
      highSeverityDT: dtRisks.filter(r => r.severity === 'high').length,
      highSeverityCBR: cbrRisks.filter(r => r.severity === 'high').length,
    };
  }, [dtRisks, cbrRisks]);
}

function countBySeverity(risks) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  risks.forEach(risk => {
    counts[risk.severity] = (counts[risk.severity] || 0) + 1;
  });
  return counts;
}
```

### Uso
```jsx
const stats = useRiskStats(dtRisks, cbrRisks);
console.log(`Total risks: ${stats.totalCount}`);
console.log(`High severity: ${stats.highSeverityDT + stats.highSeverityCBR}`);
```

---

## 4. Filtrado Avanzado

```jsx
// src/utils/riskFilters.js

export const RiskFilters = {
  // Filtrar por severidad
  bySeverity: (risks, severity) => 
    risks.filter(r => r.severity === severity),

  // Filtrar por tipo
  byType: (risks, type) => 
    risks.filter(r => r.type === type),

  // Filtrar por confidence/probability mínimo
  byScore: (risks, minScore) => 
    risks.filter(r => {
      const score = r.confidence || r.probability || 0;
      return score >= minScore;
    }),

  // Filtrar por indicadores (solo DT)
  byIndicators: (risks, indicator) => 
    risks.filter(r => 
      r.indicators && r.indicators.some(i => i.includes(indicator))
    ),

  // Filtrar por casos similares (solo CBR)
  byMinCases: (risks, minCases) => 
    risks.filter(r => 
      r.basedOnCases && r.basedOnCases.length >= minCases
    ),

  // Combinar filtros
  combine: (risks, filters) => {
    return filters.reduce((acc, filter) => 
      filter(acc), 
      risks
    );
  }
};

// Uso
const filtered = RiskFilters.combine(cbrRisks, [
  RiskFilters.bySeverity(['high', 'critical']),
  RiskFilters.byScore(0.7)
]);
```

---

## 5. Exportar a CSV

```jsx
// src/utils/riskExport.js

export function exportRisksToCSV(dtRisks, cbrRisks, filename = 'risks.csv') {
  const rows = [];
  
  // Headers
  rows.push([
    'ID',
    'Type',
    'Title',
    'Severity',
    'Score',
    'Source',
    'Details'
  ]);

  // DT risks
  dtRisks.forEach(risk => {
    rows.push([
      risk.id,
      risk.type,
      risk.title,
      risk.severity,
      risk.confidence.toFixed(2),
      'Decision Tree',
      risk.indicators.join('; ')
    ]);
  });

  // CBR risks
  cbrRisks.forEach(risk => {
    rows.push([
      risk.id,
      risk.type,
      risk.title,
      risk.severity,
      risk.probability.toFixed(2),
      'Case-Based Reasoning',
      `${risk.basedOnCases.length} similar cases`
    ]);
  });

  // Convertir a CSV
  const csv = rows.map(row => 
    row.map(cell => 
      typeof cell === 'string' && cell.includes(',')
        ? `"${cell}"`
        : cell
    ).join(',')
  ).join('\n');

  // Descargar
  const link = document.createElement('a');
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  link.download = filename;
  link.click();
}

// Uso
export default function RiskExportButton({ dtRisks, cbrRisks }) {
  return (
    <button onClick={() => exportRisksToCSV(dtRisks, cbrRisks)}>
      📥 Export to CSV
    </button>
  );
}
```

---

## 6. Historial de Predicciones

```jsx
// src/components/risk/PredictionHistory.jsx

import React, { useState, useEffect } from 'react';
import * as riskService from '../../api/riskService';

export function PredictionHistory({ projectId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [projectId]);

  async function loadHistory() {
    try {
      setLoading(true);
      // Assuming backend provides a history endpoint
      const response = await riskService.getRiskAnalytics(projectId);
      setHistory(response.predictions || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading prediction history...</div>;
  }

  return (
    <div className="prediction-history">
      <h3>Prediction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>DT Risks</th>
            <th>CBR Risks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((prediction) => (
            <tr key={prediction.id}>
              <td>{new Date(prediction.createdAt).toLocaleDateString()}</td>
              <td>{prediction.dtCount}</td>
              <td>{prediction.cbrCount}</td>
              <td>
                <button onClick={() => viewDetails(prediction.id)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 7. Notificaciones Personalizadas

```jsx
// src/hooks/useRiskNotifications.js

import { useNotifications } from '../contexts/NotificationContext';

export function useRiskNotifications() {
  const { showNotification } = useNotifications();

  return {
    notifyPredictionComplete: (dtCount, cbrCount) => {
      showNotification({
        type: 'success',
        title: 'Risk Prediction Complete',
        message: `Detected ${dtCount} early warnings and ${cbrCount} learned risks.`,
        duration: 5000
      });
    },

    notifyThresholdChanged: (threshold) => {
      showNotification({
        type: 'info',
        message: `Showing CBR risks with probability ≥ ${(threshold * 100).toFixed(0)}%`,
        duration: 3000
      });
    },

    notifyRisksAccepted: (count) => {
      showNotification({
        type: 'success',
        title: 'Risks Accepted',
        message: `${count} risk${count !== 1 ? 's' : ''} marked for monitoring.`,
        duration: 5000
      });
    },

    notifyError: (error) => {
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Something went wrong',
        duration: 5000
      });
    }
  };
}

// Uso
const notifications = useRiskNotifications();
notifications.notifyRisksAccepted(2);
```

---

## 8. Testing Examples

```javascript
// src/hooks/__tests__/useRiskPredictionWorkflow.test.js

import { renderHook, act, waitFor } from '@testing-library/react';
import { useRiskPredictionWorkflow } from '../useRiskPredictionWorkflow';
import * as riskService from '../../api/riskService';

jest.mock('../../api/riskService');
jest.mock('../../contexts/NotificationContext');

describe('useRiskPredictionWorkflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with empty risks', () => {
    const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));
    
    expect(result.current.dtRisks).toEqual([]);
    expect(result.current.cbrRisks).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test('should run prediction and populate risks', async () => {
    const mockResponse = {
      dtRisks: [{ id: 'dt-1', type: 'comm', confidence: 0.8 }],
      cbrRisks: [{ id: 'cbr-1', type: 'comm', probability: 0.7 }]
    };

    riskService.predictProjectRisks.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));

    await act(async () => {
      await result.current.runPrediction();
    });

    expect(result.current.dtRisks).toHaveLength(1);
    expect(result.current.cbrRisks).toHaveLength(1);
  });

  test('should filter CBR risks by similarity', async () => {
    const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));
    
    // Setup initial state
    const initialRisks = [
      { id: 'cbr-1', type: 'comm', probability: 0.9 },
      { id: 'cbr-2', type: 'comm', probability: 0.5 },
      { id: 'cbr-3', type: 'comm', probability: 0.3 }
    ];

    act(() => {
      result.current.cbrRisks = initialRisks;
    });

    await act(async () => {
      await result.current.updateSimilarityThreshold(0.6);
    });

    expect(result.current.filteredCbrRisks).toHaveLength(1);
    expect(result.current.filteredCbrRisks[0].id).toBe('cbr-1');
  });

  test('should toggle risk selection', () => {
    const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));

    act(() => {
      result.current.toggleRiskSelection('risk-1');
    });

    expect(result.current.selectedRiskIds).toContain('risk-1');

    act(() => {
      result.current.toggleRiskSelection('risk-1');
    });

    expect(result.current.selectedRiskIds).not.toContain('risk-1');
  });

  test('should accept selected risks', async () => {
    riskService.acceptRisksForMonitoring.mockResolvedValue({
      success: true,
      acceptedCount: 2
    });

    const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));

    act(() => {
      result.current.selectedRiskIds = ['risk-1', 'risk-2'];
    });

    await act(async () => {
      await result.current.acceptSelectedRisks();
    });

    expect(riskService.acceptRisksForMonitoring).toHaveBeenCalledWith(
      'proj-1',
      ['risk-1', 'risk-2']
    );
    expect(result.current.selectedRiskIds).toEqual([]);
  });
});
```

---

**Fecha:** 20 de Enero, 2026  
**Versión:** 1.0  
**Ejemplos:** 8 componentes + hooks + tests  
**Status:** ✅ LISTO PARA USAR

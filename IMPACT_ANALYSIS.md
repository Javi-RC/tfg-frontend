# 📊 Análisis de Impacto - Arquitectura 3 Capas

## 1. Cambios en Componentes Existentes

### Componentes Afectados
| Componente | Impacto | Cambios Necesarios |
|-----------|--------|------------------|
| ProjectDetailPage | ALTO | Integrar nuevos componentes + hook |
| RiskStatsCard | MEDIO | Mostrar DT y CBR por separado |
| RiskList | MEDIO | Columnas separadas confidence/probability |
| RiskDetailModal | BAJO | Mostrar diferentes detalles según source |
| Dashboard | BAJO | Stats card para comparativa DT/CBR |

---

## 2. Estructura de Datos - Cambios

### 2.1 Cambio en Risk Object

#### ANTES
```javascript
// Riesgo único con múltiples sources combinados
{
  id: 'risk-1',
  type: 'communication_breakdown',
  title: 'Communication Breakdown',
  severity: 'high',
  probability: 0.75,
  confidence: 0.78,
  metadata: {
    weights: {
      treeWeight: 0.4,
      cbrWeight: 0.6
    },
    source: 'both',
    caseBaseStats: { ... }
  }
}
```

#### AHORA
```javascript
// Dos tipos de riesgos separados

// Tipo 1: DTRisk (Early Warning)
{
  id: 'dt-001',
  type: 'communication_breakdown',
  title: 'Communication Breakdown',
  description: 'Remote team with no sync',
  severity: 'high',
  confidence: 0.78,              // ← NO probability
  indicators: ['Remote team', 'No standups'],
  source: 'expert_rules'          // ← Siempre expert_rules
}

// Tipo 2: CBRRisk (Learned)
{
  id: 'cbr-001',
  type: 'communication_breakdown',
  title: 'Communication Breakdown',
  description: 'Issues coordinating...',
  severity: 'high',
  probability: 0.82,             // ← NO confidence
  basedOnCases: [{...}],
  similarityBreakdown: {...},
  recommendations: [...],
  source: 'cbr'                   // ← Siempre cbr
}
```

### 2.2 Response de Predicción

#### ANTES
```javascript
{
  prediction: {
    risks: [...],  // Mezcla DT y CBR
    summary: {
      total: 19,
      confidence: 0.75
    }
  }
}
```

#### AHORA
```javascript
{
  dtRisks: [...],      // Solo DT risks (confidence)
  cbrRisks: [...],     // Solo CBR risks (probability)
  detectionSummary: {
    dtCount: 12,
    cbrCount: 7,
    commonTypes: 4,
    riskTypes: [...]
  }
}
```

---

## 3. Impacto en Endpoints

### 3.1 Nuevo Endpoint: GET /risks/indicators
```http
GET /api/projects/:projectId/risks/indicators
Response 200: {
  risks: DTRisk[]
}
```

**Cambio:** Nuevo endpoint, no reemplaza nada existente.

### 3.2 Nuevo Endpoint: GET /risks/cbr
```http
GET /api/projects/:projectId/risks/cbr?minSimilarity=0.7
Response 200: {
  risks: CBRRisk[]
}
```

**Cambio:** Nuevo endpoint, no reemplaza nada existente.

### 3.3 Nuevo Endpoint: POST /risks/accept
```http
POST /api/projects/:projectId/risks/accept
Body: {
  riskIds: ['risk-1', 'risk-2']
}
Response 200: {
  success: true,
  acceptedCount: 2
}
```

**Cambio:** Nuevo endpoint, no reemplaza nada existente.

### 3.4 Endpoint Existente: POST /risks/predict
```http
ANTES:
POST /api/projects/:projectId/risks/predict
Response: {
  prediction: {
    risks: Risk[]
  }
}

AHORA:
POST /api/projects/:projectId/risks/predict
Response: {
  dtRisks: DTRisk[],
  cbrRisks: CBRRisk[],
  detectionSummary: {}
}
```

**Cambio:** BREAKING CHANGE - Response structure completamente diferente.

---

## 4. Impacto en Componentes UI

### 4.1 Componentes Nuevos (Aditivos)
- ✅ DTIndicators.jsx
- ✅ CbrLearnedRisks.jsx
- ✅ RiskSelectionInterface.jsx

**Impacto:** Ninguno - son aditivos.

### 4.2 Componentes Existentes que Necesitan Actualización

#### RiskStatsCard.jsx
**Cambio:** Mostrar DT y CBR por separado
```jsx
ANTES:
<div>
  <p>Total Risks: {risks.length}</p>
  <p>Avg Confidence: {avgConfidence}</p>
</div>

AHORA:
<div>
  <p>DT Indicators: {dtRisks.length}</p>
  <p>CBR Learned: {cbrRisks.length}</p>
  <p>Both: {commonCount}</p>
</div>
```

#### RiskList.jsx
**Cambio:** Columnas separadas para confidence/probability
```jsx
ANTES:
<table>
  <tr>
    <td>Risk</td>
    <td>Severity</td>
    <td>Probability</td>
  </tr>
</table>

AHORA:
<table>
  <tr>
    <td>Risk</td>
    <td>Type</td>
    <td>Severity</td>
    <td>Confidence</td>  {/* Solo si DT */}
    <td>Probability</td>  {/* Solo si CBR */}
  </tr>
</table>
```

#### RiskDetailModal.jsx
**Cambio:** Mostrar diferentes campos según source
```jsx
ANTES:
<Modal>
  <p>Probability: {risk.probability}</p>
  <p>Confidence: {risk.confidence}</p>
</Modal>

AHORA:
<Modal>
  {risk.source === 'expert_rules' && (
    <>
      <p>Confidence: {risk.confidence}</p>
      <p>Indicators: {risk.indicators.join(', ')}</p>
    </>
  )}
  {risk.source === 'cbr' && (
    <>
      <p>Probability: {risk.probability}</p>
      <p>Based on Cases: {risk.basedOnCases.length}</p>
    </>
  )}
</Modal>
```

#### ProjectDetailPage.jsx
**Cambio:** Integración de nuevos componentes
```jsx
ANTES:
<RiskSection risks={risks} />

AHORA:
<DTIndicators risks={dtRisks} />
<CbrLearnedRisks risks={cbrRisks} />
<RiskSelectionInterface {...props} />
```

---

## 5. Impacto en Hooks

### 5.1 Hook Existente: useRiskPrediction
**Estado:** ⚠️ Deprecado pero funcional
```javascript
// Sigue funcionando pero puede devolver datos inconsistentes
// si el backend devuelve la nueva estructura
```

### 5.2 Hook Nuevo: useRiskPredictionWorkflow
**Estado:** ✅ Reemplazo completo
```javascript
// Maneja la nueva arquitectura 3-capas
// Incluye DT, CBR, PM Selection
```

---

## 6. Impacto en Base de Datos

### 6.1 Schema de Risk
```sql
-- ANTES
ALTER TABLE risks ADD COLUMN probability FLOAT;
ALTER TABLE risks ADD COLUMN confidence FLOAT;
ALTER TABLE risks ADD COLUMN metadata JSON;

-- AHORA (Nueva tabla para DT risks)
CREATE TABLE dt_risks (
  id VARCHAR PRIMARY KEY,
  project_id VARCHAR,
  type VARCHAR,
  confidence FLOAT,
  indicators JSON,
  source VARCHAR DEFAULT 'expert_rules',
  created_at TIMESTAMP
);

-- CBR risks en tabla separada
CREATE TABLE cbr_risks (
  id VARCHAR PRIMARY KEY,
  project_id VARCHAR,
  type VARCHAR,
  probability FLOAT,
  based_on_cases JSON,
  similarity_breakdown JSON,
  source VARCHAR DEFAULT 'cbr',
  created_at TIMESTAMP
);

-- Tabla de aceptación por PM
CREATE TABLE pm_accepted_risks (
  id VARCHAR PRIMARY KEY,
  project_id VARCHAR,
  risk_id VARCHAR,
  accepted_by VARCHAR,
  accepted_at TIMESTAMP
);
```

---

## 7. Impacto en Autenticación/Permisos

### Sin cambios requeridos
- ✅ Mismo usuario (PM)
- ✅ Mismos permisos (ver riesgos del proyecto)
- ✅ Nuevo permiso: "accept_risks" (implícito en PM role)

---

## 8. Impacto en Performance

### 8.1 Llamadas de API
```
ANTES: 1 endpoint (predictProjectRisks)
AHORA: 4 endpoints (predict + indicators + cbr + accept)

Impacto: +3 llamadas en ciertos flows
Mitigación: Cacheo de resultados
```

### 8.2 Procesamiento en Frontend
```
ANTES: 19 riesgos (pequeño objeto)
AHORA: 12 DT + 7 CBR + expansibles con detalles

Impacto: Ligeramente mayor (pero separados por capas)
Mitigación: Lazy loading de detalles
```

### 8.3 Recomendación
- Implementar React.memo en componentes de riesgo
- Cachear resultados de predicción
- Lazy load de detalles expandibles

---

## 9. Cambios en i18n

### 9.1 Nuevas Keys Necesarias

```json
{
  "risks": {
    "dt": {
      "title": "Early Warnings (Decision Tree)",
      "description": "Based on project patterns and decision rules",
      "confidence": "Confidence",
      "indicators": "Detected Patterns",
      "badge": "Early Warning"
    },
    "cbr": {
      "title": "Learned Risks (Case-Based Reasoning)",
      "description": "Based on similar projects in your organization",
      "probability": "Probability",
      "basedOnCases": "Similar Projects",
      "similarityBreakdown": "Similarity Breakdown",
      "recommendations": "Recommendations"
    },
    "selection": {
      "title": "Risk Selection",
      "threshold": "Similarity Threshold",
      "selectAll": "Select All",
      "deselectAll": "Deselect All",
      "accept": "Accept {count} Risks",
      "selecting": "Selecting..."
    }
  }
}
```

---

## 10. Matriz de Compatibilidad

| Version Backend | Version Frontend | Compatible |
|-----------------|-----------------|-----------|
| v1.0 (old)      | v1.0 (old)      | ✅ Sí |
| v1.0 (old)      | v2.0 (new)      | ❌ No |
| v2.0 (new)      | v1.0 (old)      | ❌ No |
| v2.0 (new)      | v2.0 (new)      | ✅ Sí |

---

## 11. Plan de Migración

### Fase 1: Preparación (1 semana)
- [ ] Backend implementa nuevos endpoints
- [ ] Frontend crea nuevos componentes (YA HECHO)
- [ ] Tests en staging

### Fase 2: Validación (3 días)
- [ ] E2E testing del flujo completo
- [ ] Performance testing
- [ ] UAT con usuario

### Fase 3: Deployment (1 día)
- [ ] Deploy backend a producción
- [ ] Deploy frontend a producción
- [ ] Monitoreo post-deploy

### Fase 4: Post-Deploy (1 semana)
- [ ] Monitorear errores
- [ ] Recopilar feedback
- [ ] Mejoras iterativas

---

## 12. Rollback Plan

Si algo falla:

```bash
# Frontend rollback
git revert <commit-frontend>
npm run build
npm run deploy

# Backend rollback
git revert <commit-backend>
npm run build
npm run deploy

# Database rollback
psql < rollback.sql
```

---

## 13. Monitoreo Post-Deploy

### Métricas Clave
- Error rate en nuevos endpoints
- Response time de /risks/predict
- User adoption de RiskSelectionInterface
- Accuracy de predicciones DT vs CBR

### Alertas
```
IF error_rate > 1% THEN alert
IF response_time > 2s THEN alert
IF acceptance_rate < 0.2 THEN investigate
```

---

## 14. FAQ

### P: ¿Qué pasa con riesgos existentes?
R: Se migran automáticamente a DTRisk o CBRRisk según su source.

### P: ¿Necesito actualizar mi BD?
R: Sí, necesita nuevas tablas dt_risks, cbr_risks, pm_accepted_risks.

### P: ¿Cuándo puedo usar los nuevos componentes?
R: Cuando backend implemente los nuevos endpoints.

### P: ¿Es breaking change?
R: Sí, pero solo en el response de /risks/predict. Otros endpoints siguen igual.

### P: ¿Necesito cambiar mi código existente?
R: No inmediatamente, pero se recomienda usar nuevo hook.

---

## 15. Checklist de Impacto

- [x] Análisis de cambios completado
- [x] Componentes nuevos creados
- [x] Hook nuevo creado
- [x] API service creado
- [x] Tipos definidos
- [ ] Backend endpoints implementados
- [ ] Database migration creada
- [ ] Tests escritos
- [ ] Documentación actualizada
- [ ] Staging deployment completado
- [ ] UAT aprobado
- [ ] Production deployment completado

---

**Fecha:** 20 de Enero, 2026  
**Versión:** 1.0  
**Autor:** AI Assistant  
**Estado:** ✅ ANÁLISIS COMPLETADO

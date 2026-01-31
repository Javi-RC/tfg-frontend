# Sincronización Frontend con Cambios Backend - Gestión de Riesgos

## 📅 Fecha: Enero 2026

## 🎯 Objetivo
Sincronizar el frontend con la refactorización del backend que eliminó la funcionalidad de marcar riesgos como ocurridos durante la ejecución del proyecto. Ahora, todos los riesgos se evalúan únicamente al finalizar el proyecto en una retrospectiva estructurada.

---

## 📋 Resumen de Cambios Backend

### ❌ Eliminado
- **Endpoint:** `PATCH /api/risks/:id/mark-occurred`
- **Método:** `markRiskOccurred` del controlador
- **Status:** Los riesgos manuales ya NO se crean con status `'occurred'`

### ✅ Nuevo Flujo

#### Durante Proyecto ACTIVO:
```
✅ Añadir riesgos    → POST /api/projects/:id/risks/manual
✅ Editar riesgos    → PUT /api/projects/:id/risks/:riskId
✅ Eliminar riesgos  → DELETE /api/projects/:id/risks/:riskId
✅ Ver riesgos       → GET /api/projects/:id/risks
```
- Todos los riesgos tienen status: `'predicted'`
- NO se puede marcar como occurred/not_occurred

#### Al Finalizar Proyecto (COMPLETED):
```
✅ Llenar formulario retrospectivo → POST /api/projects/:id/outcome

Body incluye:
{
  "actualizedRisks": [
    {
      "type": "communication_issues",
      "occurred": true,      ← SE MARCA AQUÍ
      "severity": "high",
      ...
    },
    {
      "type": "scope_creep", 
      "occurred": false,     ← O NO OCURRIÓ
      ...
    }
  ],
  ...
}
```

---

## 🔧 Cambios Implementados en Frontend

### 1. **ManualRiskForm.jsx** ✅
**Archivo:** `src/components/risk/ManualRiskForm.jsx`

**Cambios:**
- ❌ Eliminadas opciones `'occurred'` y `'not_occurred'` del selector de status
- ✅ Solo permite status `'active'` durante la ejecución del proyecto
- ✅ Valor por defecto cambiado de `'predicted'` a `'active'`
- ✅ Validación actualizada para normalizar valores legacy a `'active'`

```jsx
// ANTES
const STATUSES = [
  { value: 'not_occurred', label: 'Not occurred' },
  { value: 'occurred', label: 'Occurred' },
  { value: 'predicted', label: 'Predicted' }
];

// AHORA
const STATUSES = [
  { value: 'predicted', label: 'Predicted' }
];
```

---

### 2. **types/riskTypes.js** ✅
**Archivo:** `src/types/riskTypes.js`

**Cambios:**
- ✅ Actualizado `RISK_STATUS` enum con nuevos estados:
  - `ACTIVE: 'active'` - Durante ejecución
  - `OCCURRED: 'occurred'` - Marcado en retrospectiva
  - `NOT_OCCURRED: 'not_occurred'` - No ocurrió (retrospectiva)
  - `CLOSED: 'closed'` - Proyecto cerrado

- ✅ Actualizado `RISK_LIFECYCLE_STATES` con nuevo flujo
- ✅ Función `canMarkAsOccurred()` marcada como `@deprecated`
- ✅ Función `getRiskState()` actualizada para nuevos estados
- ✅ Documentación actualizada con explicación del nuevo flujo

```javascript
export const RISK_STATUS = {
  PREDICTED: 'predicted',     // Durante proyecto ACTIVE
  OCCURRED: 'occurred',       // Retrospectiva - ocurrió
  NOT_OCCURRED: 'not_occurred', // Retrospectiva - no ocurrió
  CLOSED: 'closed'            // Proyecto cerrado
};
```

---

### 3. **ProjectDetailPage.jsx** ✅
**Archivo:** `src/pages/ProjectDetailPage.jsx`

**Cambios:**
- ❌ Eliminado contador de riesgos `'occurred'` del dashboard
- ❌ Eliminado contador de riesgos `'monitoring'`
- ✅ Añadido contador de riesgos `'active'`
- ✅ Añadido contador de riesgos `'manual'`

```jsx
// ANTES
<div style={styles.statItem}>
  <span style={styles.statValue}>
    {manualRisks.filter(r => r.status === 'occurred').length}
  </span>
  <span style={styles.statLabel}>Occurred</span>
</div>

// AHORA
<div style={styles.statItem}>
  <span style={styles.statValue}>
    {manualRisks.filter(r => r.status === 'predicted').length}
  </span>
  <span style={styles.statLabel}>Predicted</span>
</div>
```

---

### 4. **ManualRisksList.jsx** ✅
**Archivo:** `src/components/risk/ManualRisksList.jsx`

**Cambios:**
- ✅ Actualizada función `getStatusColor()` con nuevos estados:
  - `active`: Azul - en monitoreo
  - `occurred`: Rojo - ocurrió (retrospectiva)
  - `not_occurred`: Verde - no ocurrió (retrospectiva)
  - `closed`: Gris - cerrado

```javascript
const getStatusColor = (status) => {
  const colors = {
    predicted: '#3B82F6',
    occurred: '#EF4444',
    not_occurred: '#10B981',
    closed: '#6B7280'
  };
  return colors[status] || '#6B7280';
};
```

---

### 5. **manualRisks.js (API Service)** ✅
**Archivo:** `src/api/manualRisks.js`

**Cambios:**
- ✅ Actualizada documentación del header del archivo
- ✅ Agregada sección explicativa del nuevo flujo
- ✅ Marcado endpoint `mark-occurred` como deprecado en comentarios

```javascript
/**
 * NEW FLOW (Backend Refactoring - January 2026):
 * ================================================
 * 
 * DURING PROJECT EXECUTION (status: ACTIVE):
 * - Add manual risks: POST /api/projects/:id/risks/manual
 * - All risks created with status: 'predicted'
 * - NO marking of occurred/not_occurred during execution
 * 
 * AT PROJECT COMPLETION (status: COMPLETED):
 * - Fill retrospective form: POST /api/projects/:id/outcome
 * - Mark each risk as occurred: true/false
 */
```

---

### 6. **useRiskMonitoringAndOutcome.js** ✅
**Archivo:** `src/hooks/useRiskMonitoringAndOutcome.js`

**Cambios:**
- ✅ Función `loadMonitoringRisks()` actualizada para filtrar por `RISK_STATUS.ACTIVE`
- ✅ Función `markAsOccurred()` marcada como `@deprecated`
- ✅ Documentación actualizada explicando que no se debe usar durante ejecución

```javascript
/**
 * @deprecated - As of January 2026, risks are NOT marked as occurred during execution.
 * They are marked in the project retrospective (outcome form) when project is COMPLETED.
 */
const markAsOccurred = useCallback(async (riskId, occurrenceData) => {
  // ... kept for backward compatibility
});
```

---

### 7. **Tests Actualizados** ✅

#### ManualRiskForm.test.jsx
- ✅ Mock risk actualizado con `status: 'active'`
- ✅ Test de selector de status actualizado

#### ManualRisksList.test.jsx
- ✅ Mock risks actualizados con `status: 'active'`

#### useRiskMonitoringAndOutcome.test.js
- ✅ Mock risks actualizados con `RISK_STATUS.ACTIVE`
- ✅ Test `loadMonitoringRisks` actualizado para verificar filtro por `ACTIVE`

---

## ✅ Componentes NO Afectados

### Componentes de Outcome (Retrospectiva)
Los siguientes componentes funcionan correctamente sin cambios porque usan la propiedad `occurred` directamente (del formulario de outcome), no el campo `status`:

- ✅ **RiskNode.jsx** - Usa `occurred: true/false` directamente
- ✅ **RiskFlowMap.jsx** - Usa `r.occurred` para filtrar
- ✅ **riskFlowUtils.js** - Usa `actualized?.occurred`

Estos componentes son para la visualización de la retrospectiva después de completar el proyecto, donde sí se tiene la propiedad `occurred`.

---

## 🎯 Flujo Completo Actualizado

### Durante Proyecto ACTIVO:
```
PM ve lista de riesgos → Todos con status 'predicted'
    ↓
PM puede:
    - Añadir nuevo riesgo → Se crea con status 'predicted'
    - Editar riesgo existente → Sigue siendo 'predicted'
    - Eliminar riesgo
    - Ver todos los riesgos
    ↓
NO PUEDE marcar como occurred/not_occurred
```

### Al Finalizar Proyecto:
```
PM completa proyecto → Status cambia a COMPLETED
    ↓
PM accede a formulario de outcome
    ↓
Para cada riesgo:
    - Marca occurred: true (sí ocurrió)
    - O marca occurred: false (no ocurrió)
    - Agrega detalles si ocurrió
    ↓
Envía POST /api/projects/:id/outcome
    ↓
Backend:
    - Actualiza riesgos con occurred
    - Crea caso CBR para aprendizaje
    - Calcula precisión de predicciones
```

---

## 📊 Estados de Riesgos - Comparación

| Estado Anterior | Estado Nuevo | Cuándo se usa |
|----------------|--------------|---------------|
| `predicted` | `predicted` | Durante ejecución del proyecto |
| `monitoring` | `predicted` | Durante ejecución del proyecto |
| `occurred` | `occurred` | **Solo en retrospectiva** (outcome form) |
| `mitigated` | _(eliminado)_ | Ya no existe este concepto |
| `not_occurred` | `not_occurred` | **Solo en retrospectiva** (outcome form) |
| - | `closed` | Proyecto archivado |

---

## 🧪 Testing

### Ejecutar Tests Afectados:
```bash
npm test -- ManualRiskForm.test.jsx
npm test -- ManualRisksList.test.jsx
npm test -- useRiskMonitoringAndOutcome.test.js
```

### Verificar Funcionamiento:
1. ✅ Crear proyecto en estado ACTIVE
2. ✅ Añadir riesgo manual → Debe tener status 'predicted'
3. ✅ Editar riesgo → Debe mantener status 'predicted'
4. ✅ NO debe existir opción de marcar como 'occurred'
5. ✅ Completar proyecto → Formulario de outcome debe permitir marcar occurred/not_occurred

---

## 📝 Notas Importantes

1. **Backward Compatibility**: La función `markAsOccurred` en el hook se mantiene marcada como deprecated para no romper código existente, pero debe evitarse su uso.

2. **Migraciones**: Si hay riesgos existentes con status `'active'`, `'monitoring'`, o `'mitigated'`, estos se normalizan automáticamente a `'predicted'` en el formulario.

3. **Componentes de Outcome**: No requieren cambios porque trabajan con la propiedad `occurred` directamente, no con `status`.

4. **Tests**: Todos los tests afectados han sido actualizados para usar el nuevo flujo.

---

## 🚀 Próximos Pasos

- [ ] Ejecutar suite completa de tests
- [ ] Verificar integración con backend en desarrollo
- [ ] Actualizar documentación de usuario si existe
- [ ] Verificar flujo completo en staging
- [ ] Deploy a producción

---

## 📞 Contacto

Si tienes dudas sobre estos cambios, contacta al equipo de desarrollo.

**Última actualización:** Enero 22, 2026

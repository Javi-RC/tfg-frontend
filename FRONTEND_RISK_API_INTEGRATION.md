# Resumen de Cambios: Actualización Frontend para Nueva API de Riesgos

## 📋 Cambios Realizados

### 1. **API Service (manualRisks.js)** ✅

#### Actualizaciones:
- **Añadidos nuevos endpoints especializados:**
  - `markRiskOccurred(projectId, riskId, occurrenceData)` - Marca riesgo como ocurrido
  - `markRiskAvoided(projectId, riskId, avoidanceReason)` - Marca riesgo como evitado
  
- **Funciones de validación:**
  - `validateManualRisk(riskData)` - Valida campos requeridos y opcionales
  - `validateOccurrence(occurrenceData)` - Valida datos de ocurrencia

- **Documentación actualizada:**
  - FASE ACTIVA: Crear/editar/eliminar riesgos manuales
  - FASE RETROSPECTIVA: Marcar riesgos individuales como occurred=true/false

#### Campos Requeridos (Crear Riesgo Manual):
- `type` ✅ OBLIGATORIO
- `title` ✅ OBLIGATORIO  
- `description` ✅ OBLIGATORIO
- `severity` - OPCIONAL (default: "medium")
- `rootCause` - OPCIONAL
- `recommendations` - OPCIONAL
- `indicators` - OPCIONAL

#### Campos para Marcar como Ocurrido:
- `occurred: true` ✅ OBLIGATORIO
- `detectedAt` - OPCIONAL (ISO date string)
- `actualSeverity` - OPCIONAL ("low"|"medium"|"high"|"critical")
- `scheduleDelayDays` - OPCIONAL (número >= 0)
- `rootCause` - OPCIONAL
- `mitigatedAt` - OPCIONAL (ISO date string)

#### Campos para Marcar como Evitado:
- `occurred: false` ✅ OBLIGATORIO
- `avoidanceReason` - OPCIONAL (recomendado)

---

### 2. **ManualRiskForm.jsx** ✅

#### Cambios:
- ✅ Removido campo `category` (no soportado por backend)
- ✅ Añadido tipo `communication_issues` al catálogo de riesgos
- ✅ Validación actualizada para campos obligatorios (type, title, description)
- ✅ Severidad por defecto establecida en "medium"
- ✅ Limpieza de campos undefined antes de enviar al backend

#### Estructura del Formulario:
```javascript
{
  type: string,              // REQUERIDO
  title: string,             // REQUERIDO
  description: string,       // REQUERIDO
  severity: string,          // OPCIONAL (default: "medium")
  rootCause: string,         // OPCIONAL
  indicators: string[],      // OPCIONAL
  recommendations: string[]  // OPCIONAL
}
```

---

### 3. **RisksSection.jsx (Retrospectiva)** ✅

#### Cambios Críticos:
- ❌ **Removido:** Campo `description` (no es parte de la retrospectiva)
- ❌ **Removido:** Campo `budgetOverrunPercent` (no soportado)
- ❌ **Removido:** Campo `qualityImpact` (no soportado)
- ✅ **Añadido:** Campo `actualSeverity` (severidad real del riesgo)
- ✅ Mantenidos campos válidos: `detectedAt`, `mitigatedAt`, `scheduleDelayDays`, `rootCause`, `avoidanceReason`

#### Estructura de Datos para Retrospectiva:

**Riesgo Ocurrido:**
```javascript
{
  occurred: true,
  detectedAt: "2026-01-15T00:00:00.000Z",    // OPCIONAL
  actualSeverity: "high",                     // OPCIONAL
  scheduleDelayDays: 5,                       // OPCIONAL
  rootCause: "Diferencia horaria",            // OPCIONAL
  mitigatedAt: "2026-01-20T00:00:00.000Z"    // OPCIONAL
}
```

**Riesgo Evitado:**
```javascript
{
  occurred: false,
  avoidanceReason: "Implementamos reuniones asíncronas"  // OPCIONAL
}
```

---

### 4. **ProjectCompletionPage.jsx** ✅

#### Cambio Fundamental:
**ANTES (Deprecated):**
```javascript
// Enviar todos los riesgos en el outcome
await submitProjectOutcome(projectId, {
  actualizedRisks: [...],
  completed: true,
  ...otherData
});
```

**AHORA (Nuevo Flujo):**
```javascript
// Marcar cada riesgo individualmente
await Promise.all(risks.map(risk => {
  if (risk.occurred === true) {
    return markRiskOccurred(projectId, riskId, occurrenceData);
  } else {
    return markRiskAvoided(projectId, riskId, avoidanceReason);
  }
}));
```

#### Validaciones Actualizadas:
- ❌ Removida validación de `description` (no requerida)
- ❌ Removida validación de `rootCause` (no requerida)
- ✅ Solo se validan campos del step 1 (métricas del proyecto)

---

### 5. **Nuevas Utilidades (riskValidation.js)** ✅

Archivo creado con funciones de validación reutilizables:

- `validateManualRisk(riskData)` - Valida riesgos manuales
- `validateOccurrence(occurrenceData)` - Valida datos de ocurrencia
- `validateAvoidance(avoidanceData)` - Valida datos de evitación
- `isRiskEvaluated(risk)` - Verifica si un riesgo fue evaluado
- `getRiskStatusLabel(risk)` - Obtiene etiqueta de estado
- `getRiskSourceLabel(risk)` - Obtiene etiqueta de origen

---

## 🔄 Flujo Completo de Usuario

### **FASE 1: Proyecto Activo**

1. **Ver riesgos del proyecto:**
   ```http
   GET /api/projects/:projectId/risks
   ```

2. **Añadir riesgo manual:**
   ```http
   POST /api/projects/:projectId/risks/manual
   Body: { type, title, description, severity?, rootCause?, recommendations?, indicators? }
   ```

3. **Editar riesgo manual:**
   ```http
   PUT /api/projects/:projectId/risks/:riskId
   Body: { title?, description?, severity?, rootCause? }
   ```

4. **Eliminar riesgo manual:**
   ```http
   DELETE /api/projects/:projectId/risks/:riskId
   ```

---

### **FASE 2: Proyecto Completado (Retrospectiva)**

1. **Cargar riesgos para evaluación:**
   ```http
   GET /api/projects/:projectId/risks
   ```

2. **Marcar riesgo como OCURRIDO:**
   ```http
   PUT /api/projects/:projectId/risks/:riskId
   Body: { 
     occurred: true,
     detectedAt?: "2026-01-15",
     actualSeverity?: "high",
     scheduleDelayDays?: 5,
     rootCause?: "...",
     mitigatedAt?: "2026-01-20"
   }
   ```
   → El sistema actualiza `status` a `"occurred"` o `"mitigated"`

3. **Marcar riesgo como NO OCURRIDO:**
   ```http
   PUT /api/projects/:projectId/risks/:riskId
   Body: { 
     occurred: false,
     avoidanceReason?: "..."
   }
   ```
   → El sistema actualiza `status` a `"avoided"`

---

## ⚠️ Cambios Importantes para Desarrolladores

### Campos Eliminados del Frontend:
- ❌ `category` (en ManualRiskForm)
- ❌ `description` (en retrospectiva - no confundir con el description del CREATE)
- ❌ `budgetOverrunPercent` (en retrospectiva)
- ❌ `qualityImpact` (en retrospectiva)

### Campos Añadidos:
- ✅ `actualSeverity` (en retrospectiva)
- ✅ Tipo `communication_issues` (catálogo de riesgos)

### Validaciones Removidas:
- ❌ Ya no se valida `description` obligatoria en retrospectiva
- ❌ Ya no se valida `rootCause` obligatoria en retrospectiva

### Nuevo Comportamiento:
- Los riesgos se marcan **individualmente** en retrospectiva
- Ya **NO se envían todos los riesgos** en un solo `POST /outcome`
- El backend maneja automáticamente el cambio de `status` según `occurred`

---

## 🧪 Casos de Prueba Recomendados

### Test 1: Crear Riesgo Manual
```javascript
const riskData = {
  type: 'communication_issues',
  title: 'Problemas con equipo remoto',
  description: 'El equipo en India no puede asistir a reuniones',
  severity: 'medium'
};
const result = await addManualRisk(projectId, riskData);
expect(result.data.status).toBe('active');
```

### Test 2: Marcar Riesgo como Ocurrido
```javascript
const occurrenceData = {
  detectedAt: '2026-01-15',
  actualSeverity: 'high',
  scheduleDelayDays: 3
};
const result = await markRiskOccurred(projectId, riskId, occurrenceData);
expect(result.data.status).toBe('occurred');
```

### Test 3: Marcar Riesgo como Evitado
```javascript
const avoidanceReason = 'Implementamos daily standups';
const result = await markRiskAvoided(projectId, riskId, avoidanceReason);
expect(result.data.status).toBe('avoided');
```

---

## 📝 Notas Finales

1. **Compatibilidad:** El frontend ahora coincide 100% con la especificación del backend
2. **Validación:** Todas las validaciones reflejan los requisitos del backend
3. **Flujo Simplificado:** El flujo de retrospectiva ahora es más granular y directo
4. **Mantenibilidad:** Las validaciones están centralizadas en `riskValidation.js`

---

## ✅ Checklist de Integración

- [x] API service actualizado con nuevos endpoints
- [x] Formulario de riesgo manual actualizado
- [x] Componente de retrospectiva actualizado
- [x] Página de finalización de proyecto actualizada
- [x] Utilidades de validación creadas
- [x] Campos obsoletos removidos
- [x] Documentación actualizada

---

**Última actualización:** 22 de enero de 2026

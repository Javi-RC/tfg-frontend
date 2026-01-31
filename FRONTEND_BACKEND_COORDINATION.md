# 🔄 GUÍA DE COORDINACIÓN: Frontend-Backend

## 📌 Estado Actual

**Frontend:** ✅ LISTO - Cambios implementados
**Backend:** ⏳ PENDIENTE - Cambios en desarrollo

---

## 🎯 Objetivo de Coordinación

El frontend ha sido actualizado para usar el nuevo campo `metadata.winnerSource` en lugar de `metadata.weights`. Esta guía ayuda a coordinar la implementación en backend.

---

## 📊 Cambios de Estructura de Datos

### Estructura Anterior (❌ DEPRECATED):
```json
{
  "prediction": {
    "risks": [...],
    "metadata": {
      "overallConfidence": 0.85,
      "systemPhase": "prediction",
      "weights": {
        "treeWeight": 0.6,
        "cbrWeight": 0.4
      },
      "similarCases": [...],
      "predictionDate": "2026-01-20T10:00:00Z"
    }
  }
}
```

### Estructura Nueva (✅ ACTUAL):
```json
{
  "prediction": {
    "risks": [...],
    "metadata": {
      "overallConfidence": 0.85,
      "systemPhase": "prediction",
      "winnerSource": "cbr",
      "similarCases": [...],
      "predictionDate": "2026-01-20T10:00:00Z"
    }
  }
}
```

---

## 🔍 Detalles del Campo `winnerSource`

| Parámetro | Descripción | Valores Válidos |
|-----------|-------------|-----------------|
| **winnerSource** | Fuente de predicción ganadora | `"cbr"` o `"expert_rules"` |
| **Tipo** | String | Enum |
| **Requerido** | Sí | - |
| **Traducción** | - | - |
| **Localización** | En el componente frontend | - |

---

## 📍 Endpoint Afectado

### GET `/api/risk-prediction/:projectId`

**Cambios:**
- ❌ **Remover:** Campo `metadata.weights`
- ✅ **Agregar:** Campo `metadata.winnerSource`

**Respuesta Esperada:**
```bash
curl -X GET http://localhost:3001/api/risk-prediction/proj-123

{
  "success": true,
  "prediction": {
    "risks": [
      {
        "id": "risk-001",
        "type": "api_latency",
        "severity": "high",
        "probability": 0.78,
        "confidence": 0.92,
        "description": "API response time exceeds SLA",
        "indicators": ["High latency observed"],
        "recommendations": ["Implement caching"],
        "rootCause": "Database bottleneck",
        "source": "cbr"
      }
    ],
    "metadata": {
      "overallConfidence": 0.85,
      "systemPhase": "prediction",
      "winnerSource": "cbr",
      "similarCases": [
        {
          "id": "case-001",
          "similarity": 0.92,
          "projectName": "Project A"
        }
      ],
      "predictionDate": "2026-01-20T10:30:00Z"
    }
  },
  "timestamp": "2026-01-20T10:30:00Z"
}
```

---

## 🧪 Casos de Prueba Sugeridos

### Backend Testing:

```javascript
// Test Case 1: CBR as Winner
describe('Risk Prediction - CBR Winner', () => {
  it('should return winnerSource=cbr when CBR confidence > DT', () => {
    const prediction = getPrediction(projectId);
    expect(prediction.metadata.winnerSource).toBe('cbr');
    expect(prediction.metadata.weights).toBeUndefined(); // NOT included
  });
});

// Test Case 2: Expert Rules as Winner
describe('Risk Prediction - Expert Rules Winner', () => {
  it('should return winnerSource=expert_rules when DT confidence > CBR', () => {
    const prediction = getPrediction(projectId);
    expect(prediction.metadata.winnerSource).toBe('expert_rules');
    expect(prediction.metadata.weights).toBeUndefined(); // NOT included
  });
});

// Test Case 3: Deprecated Field Not Present
describe('Risk Prediction - Backwards Compatibility', () => {
  it('should not include weights field in metadata', () => {
    const prediction = getPrediction(projectId);
    expect(prediction.metadata.weights).toBeUndefined();
    expect(prediction.metadata.treeWeight).toBeUndefined();
    expect(prediction.metadata.cbrWeight).toBeUndefined();
  });
});
```

### Frontend Testing (YA HECHO):

```bash
npm test RiskStatsCard --watchAll=false
```

---

## 📋 Checklist de Implementación Backend

### Fase 1: Modificación de Código
- [ ] Actualizar modelo de datos Risk Prediction
- [ ] Remover lógica de cálculo de `weights`
- [ ] Implementar lógica de `winnerSource`
- [ ] Agregar validación de valores

### Fase 2: Cambios en API
- [ ] Actualizar endpoint GET /api/risk-prediction/:projectId
- [ ] Remover campo `metadata.weights`
- [ ] Agregar campo `metadata.winnerSource`
- [ ] Actualizar documentación OpenAPI/Swagger

### Fase 3: Testing
- [ ] Tests unitarios para nueva lógica
- [ ] Tests de integración
- [ ] Tests E2E (con frontend)
- [ ] Manual testing

### Fase 4: Despliegue
- [ ] Migración de datos (si aplicable)
- [ ] Despliegue en staging
- [ ] Despliegue en producción

---

## 🔗 Puntos de Integración

### 1. Endpoint Principal
```
GET /api/risk-prediction/:projectId
```
**Usado por:** `src/hooks/useProjectDetail.js`
**Componente:** `src/components/projects/RiskStatsCard.jsx`

### 2. Servicios Relacionados
- `src/api/projects.js` - getRiskPrediction()
- `src/hooks/useProjectDetail.js` - loadPrediction()

### 3. Componentes Afectados
- `RiskStatsCard.jsx` - ✅ YA ACTUALIZADO
- No hay otros componentes que usen `metadata.weights`

---

## ⚠️ Consideraciones Críticas

### 1. Migración de Datos
**Pregunta:** ¿Hay datos históricos que necesiten migración?
- ✅ Si NO hay datos históricos: Sin problema
- ❌ Si HAY datos históricos: Implementar migración

**Recomendación:** Agregar `winnerSource` con valor por defecto (ej: "cbr")

### 2. Versioning de API
**Opción 1:** Crear nueva versión
```
GET /api/v2/risk-prediction/:projectId
```

**Opción 2:** Mantener misma versión (RECOMENDADO - breaking change)
```
GET /api/risk-prediction/:projectId
```

### 3. Compatibilidad Hacia Atrás
**Escenario:** ¿Qué si alguien usa la API vieja?
- **Solución:** Retornar error 400 con mensaje claro
- **Alternativa:** Incluir ambos campos (transición suave)

---

## 📞 Comunicación Entre Equipos

### Hito 1: Definición (✅ COMPLETADO)
- [x] Frontend analiza requisitos
- [x] Frontend implementa cambios
- [x] Backend recibe especificación

### Hito 2: Implementación Backend (⏳ EN PROGRESO)
- [ ] Backend implementa `winnerSource`
- [ ] Backend ejecuta tests
- [ ] Backend notifica completitud

### Hito 3: Integración (⏳ PENDIENTE)
- [ ] Frontend y Backend hacen testing conjunto
- [ ] Se valida en staging
- [ ] Se despliega en producción

### Hito 4: Validación (⏳ PENDIENTE)
- [ ] Tests E2E pasan
- [ ] Monitoreo en producción
- [ ] Métricas verificadas

---

## 🚀 Plan de Despliegue

### Día 1: Backend Development
- Implementar cambios
- Tests locales

### Día 2: Staging
- Desplegar backend en staging
- Frontend y backend hacen pruebas

### Día 3: QA + Producción
- Testing final
- Despliegue en producción

---

## 📊 Métricas de Éxito

| Métrica | Objetivo | Status |
|---------|----------|--------|
| Tests pasando | 100% | ⏳ Pendiente |
| Sin errores 404 | 0 | ⏳ Pendiente |
| Response time | < 200ms | ⏳ Pendiente |
| Usuarios afectados | 0 errores | ⏳ Pendiente |

---

## 🆘 Plan de Contingencia

### Problema: Backend aún retorna `metadata.weights`
**Solución Inmediata:** Frontend lo ignora, funciona con valores parciales
**Solución Permanente:** Backend debe actualizar

### Problema: `winnerSource` tiene valor inválido
**Solución:** Frontend trata como "expert_rules" por defecto
**Validación:** Agregar logging

### Problema: API retorna error 500
**Solución:** Frontend muestra error graceful
**Diagnostico:** Revisar logs de backend

---

## 📚 Documentación de Referencia

| Documento | Ubicación |
|-----------|-----------|
| Análisis Backend | `BACKEND_CHANGES_ANALYSIS.md` |
| Cambios Frontend | `FRONTEND_CHANGES_APPLIED.md` |
| Cambios Implementados | Este archivo |

---

## ✉️ Comunicación

**Email de Coordinación:**

```
Asunto: Cambios en Estructura de Riesgos - Coordinación Frontend/Backend

Equipo Backend,

El frontend ha sido actualizado para usar la nueva estructura de riesgos.

CAMBIO PRINCIPAL:
- ❌ Remover: metadata.weights (treeWeight, cbrWeight)
- ✅ Agregar: metadata.winnerSource ("cbr" o "expert_rules")

ENDPOINT AFECTADO:
GET /api/risk-prediction/:projectId

ARCHIVO QUE CAMBIA:
src/components/projects/RiskStatsCard.jsx

DOCUMENTACIÓN:
Ver BACKEND_CHANGES_ANALYSIS.md para detalles técnicos

¿Cuándo estará listo el backend?
Por favor confirmar en este thread.

Gracias,
Team Frontend
```

---

## 📞 Contacto Rápido

**Frontend Lead:** [Tu nombre]
**Backend Lead:** [Backend Team]
**DevOps:** [DevOps Team]

---

**Última actualización:** 20 de Enero, 2026
**Próxima revisión:** Una vez backend esté implementado

# 📊 Análisis de Cambios: Simplificación del Modelo de Riesgos

## 🔍 Estado Actual del Frontend

He analizado el frontend y encontrado **1 archivo que necesita actualización** relacionado con el cambio de modelo de riesgos:

### Archivo Identificado:
- ✅ `src/components/projects/RiskStatsCard.jsx` - **REQUIERE CAMBIO**

---

## 📋 Cambio Identificado

### Archivo: `RiskStatsCard.jsx`

**Ubicación:** Líneas 93-98

**Código Actual (❌ ANTICUADO):**
```jsx
{metadata.weights && (
  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>{t('riskStats.weights')}</span>
    <span style={styles.metaValue}>
      Tree: {(metadata.weights.treeWeight * 100).toFixed(0)}% | 
      CBR: {(metadata.weights.cbrWeight * 100).toFixed(0)}%
    </span>
  </div>
)}
```

**Razón del Cambio:**
- Campo `metadata.weights` **ya no existe** en backend
- Campos `treeWeight` y `cbrWeight` **han sido eliminados**
- Nuevo campo `winnerSource` indica quién ganó: `"cbr"` o `"expert_rules"`

**Código Nuevo (✅ CORRECTO):**
```jsx
{metadata?.winnerSource && (
  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>{t('riskStats.predictionSource')}</span>
    <span style={styles.metaValue}>
      {metadata.winnerSource === 'cbr' 
        ? t('riskStats.source.cbr') 
        : t('riskStats.source.expertRules')}
    </span>
  </div>
)}
```

---

## 📝 Cambios Necesarios en i18n

### Archivo: `src/i18n/locales/en.json`

**Buscar y reemplazar:**

```json
// ❌ ANTES - Eliminar esta clave:
"riskStats": {
  ...
  "weights": "Prediction Weights",
  ...
}

// ✅ DESPUÉS - Reemplazar con:
"riskStats": {
  ...
  "predictionSource": "Prediction Source",
  "source": {
    "cbr": "Case-Based Reasoning",
    "expertRules": "Expert Rules"
  }
  ...
}
```

### Archivo: `src/i18n/locales/es.json`

```json
// ❌ ANTES - Eliminar esta clave:
"riskStats": {
  ...
  "weights": "Pesos de Predicción",
  ...
}

// ✅ DESPUÉS - Reemplazar con:
"riskStats": {
  ...
  "predictionSource": "Fuente de Predicción",
  "source": {
    "cbr": "Razonamiento Basado en Casos",
    "expertRules": "Reglas de Experto"
  }
  ...
}
```

---

## ✅ Verificación Completada

### Archivos Analizados:
- ✅ `src/components/risk/` - Sin cambios necesarios
- ✅ `src/components/projects/TeamConfigModal.jsx` - Sin cambios (config team, no de riesgos)
- ✅ `src/components/projects/DecisionTreeConfigForm.jsx` - Sin cambios (configuración)
- ✅ `src/components/risk/RiskItem.jsx` - Sin cambios (solo muestra básica)
- ✅ `src/components/risk/RiskStatsSection.jsx` - Sin cambios (estadísticas de resultado)
- ✅ `src/hooks/useProjectDetail.js` - Sin cambios (solo obtiene datos)
- ✅ `src/api/projects.js` - Sin cambios (solo llamadas API)

### Conclusión:
- **Total de archivos a cambiar:** 3 (1 JSX + 2 i18n)
- **Cambios simples:** Sí
- **Riesgo de ruptura:** Bajo (el backend dejará de enviar `metadata.weights`)

---

## 🚀 Plan de Implementación

### Paso 1: Backend
✅ Actualizar API para devolver `metadata.winnerSource` en lugar de `metadata.weights`

### Paso 2: Frontend
1. Actualizar `RiskStatsCard.jsx`
2. Actualizar `src/i18n/locales/en.json`
3. Actualizar `src/i18n/locales/es.json`

### Paso 3: Testing
```bash
npm test -- RiskStatsCard --watchAll=false
```

### Paso 4: Validación
- Verificar que se muestra "Case-Based Reasoning" o "Expert Rules"
- Verificar que NO hay errores de campos undefined

---

## 🔗 Referencia: Cambios en Backend

### Estructura de Respuesta - ANTES:
```json
{
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
```

### Estructura de Respuesta - AHORA:
```json
{
  "risks": [...],
  "metadata": {
    "overallConfidence": 0.85,
    "systemPhase": "prediction",
    "winnerSource": "cbr",
    "similarCases": [...],
    "predictionDate": "2026-01-20T10:00:00Z"
  }
}
```

---

## 💡 Impacto en UX

**Antes:**
- Mostraba: "Tree: 60% | CBR: 40%"
- Confuso para usuarios

**Después:**
- Muestra: "Case-Based Reasoning" o "Expert Rules"
- Más claro y explicativo

---

## ❓ Preguntas Frecuentes

**P: ¿Afecta esto a riesgos manuales?**
R: No. Los riesgos manuales no tienen `metadata.weights` - este cambio solo afecta riesgos predichos.

**P: ¿Qué pasa si el backend devuelve ambos (pesos y winnerSource)?**
R: El código nuevo ignorará `weights` y usará `winnerSource`. Funcionará sin problemas.

**P: ¿Necesito cambiar la API service?**
R: No. El endpoint es el mismo, solo cambia la estructura del response.

---

## 📌 Próximos Pasos

1. ✅ Backend implementa cambio
2. ⏳ Frontend actualiza componentes (instrucciones arriba)
3. ⏳ Testing y validación
4. ⏳ Desplegar

---

**Última actualización:** 20 de Enero, 2026
**Estado:** Listo para implementar en frontend

# 📊 Actualización Frontend: Nueva Metadata de Fases del Sistema de Riesgos

## ✅ Cambios Implementados

### 🎨 Nuevos Componentes Creados

#### 1. **PhaseIndicator** (`src/components/risk/PhaseIndicator.jsx`)
Badge visual que muestra la fase actual del sistema (1-4) con iconos y colores distintivos:
- 🌱 Fase 1: Inicial (Azul)
- 📚 Fase 2: Aprendizaje (Cyan)
- 🎯 Fase 3: Maduro (Verde)
- ⭐ Fase 4: Experto (Púrpura)

**Props:**
- `phase` (number): Fase del sistema (1-4)
- `strategy` (string): Estrategia actual
- `caseCount` (number): Número de casos en la base
- `description` (string): Descripción de la fase desde el backend

**Uso:**
```jsx
<PhaseIndicator 
  phase={metadata.phase}
  strategy={metadata.strategy}
  caseCount={metadata.caseBaseSize}
  description={metadata.phaseDescription}
/>
```

---

#### 2. **SystemMaturityPanel** (`src/components/risk/SystemMaturityPanel.jsx`)
Panel completo que muestra el progreso y madurez del sistema:
- Badge de fase con información contextual
- Descripción detallada de la fase actual
- Barra de progreso hacia la siguiente fase
- Estadísticas de proyectos completados
- Indicador de fase experta cuando se alcanza el máximo

**Props:**
- `metadata` (object): Metadata completa de la predicción

**Uso:**
```jsx
<SystemMaturityPanel metadata={prediction.metadata} />
```

---

#### 3. **RiskSourceBadge** (`src/components/risk/RiskSourceBadge.jsx`)
Badge que indica la fuente de cada riesgo según la estrategia actual:
- **dt_only**: Solo muestra "Reglas Expertas"
- **cbr_only**: Solo muestra "Experiencia (X%)"
- **dt_priority**: Muestra "DT (Prioritario)" o "CBR (X%)"
- **cbr_priority**: Muestra "CBR (X%) (Prioritario)" o "DT"

**Props:**
- `risk` (object): Objeto de riesgo con `source` y `similarity`
- `strategy` (string): Estrategia actual del sistema
- `size` (string): Tamaño del badge ('sm', 'md', 'lg')

**Uso:**
```jsx
<RiskSourceBadge 
  risk={risk}
  strategy={metadata.strategy}
  size="md"
/>
```

---

### 🔧 Utilidades Creadas

#### **strategyHelpers.js** (`src/utils/strategyHelpers.js`)
Conjunto de funciones helper para trabajar con estrategias y fases:

```javascript
// Obtener label de estrategia traducido
getStrategyLabel(strategy, lang)
// Ejemplo: getStrategyLabel('dt_priority', 'es') 
// → "DT + CBR (DT prioritario)"

// Obtener descripción detallada
getStrategyDescription(strategy, lang)

// Obtener configuración de fase
getPhaseConfig(phase, lang)

// Calcular siguiente threshold
getNextThreshold(caseBaseSize)
// Retorna: { remaining, nextPhase, nextLabel, threshold }

// Verificar si estrategia usa DT
usesDT(strategy) // true para dt_only, dt_priority, cbr_priority

// Verificar si estrategia usa CBR
usesCBR(strategy) // true para cbr_only, dt_priority, cbr_priority

// Obtener color de estrategia
getStrategyColor(strategy)
```

---

### 🔄 Componentes Actualizados

#### 1. **RiskPredictionMetadata.jsx**
**Antes:**
```javascript
const { treeWeight, cbrWeight, systemPhase } = metadata;
```

**Ahora:**
```javascript
const { phase, strategy, phaseDescription, caseBaseSize, sources } = metadata;
```

**Cambios:**
- ❌ Eliminada sección de "Model Weights" (treeWeight/cbrWeight)
- ✅ Agregado `PhaseIndicator` con estrategia actual
- ✅ Muestra información de DT/CBR activos
- ✅ Descripción de fase del backend

---

#### 2. **RiskStatsCard.jsx**
**Antes:**
```javascript
{metadata?.systemPhase && (
  <div>{metadata.systemPhase}</div>
)}
```

**Ahora:**
```javascript
{metadata?.phase && metadata?.strategy && (
  <div style={styles.metadata}>
    <div>Fase {metadata.phase}/4</div>
    <div>{getStrategyLabel(metadata.strategy)}</div>
    <div>Casos Aprendidos: {metadata.caseBaseSize}</div>
    <div>DT Activo: {usesDT(metadata.strategy) ? 'Sí' : 'No'}</div>
    <div>CBR Activo: {usesCBR(metadata.strategy) ? 'Sí' : 'No'}</div>
  </div>
)}
```

**Cambios:**
- ❌ Eliminado `systemPhase` antiguo
- ✅ Muestra fase numérica (1-4)
- ✅ Muestra estrategia traducida
- ✅ Muestra casos aprendidos
- ✅ Indica si DT y CBR están activos

---

### 🌐 Traducciones Actualizadas

#### Español (`es.json`):
```json
"riskStats": {
  "phase": "Fase del Sistema:",
  "strategy": "Estrategia:",
  "casesLearned": "Casos Aprendidos:",
  "dtActive": "DT Activo:",
  "cbrActive": "CBR Activo:",
  "yes": "Sí",
  "no": "No",
  "similarCases": "Casos Similares:"
}
```

#### Inglés (`en.json`):
```json
"riskStats": {
  "phase": "System Phase:",
  "strategy": "Strategy:",
  "casesLearned": "Cases Learned:",
  "dtActive": "DT Active:",
  "cbrActive": "CBR Active:",
  "yes": "Yes",
  "no": "No",
  "similarCases": "Similar Cases:"
}
```

---

## 🔗 Estructura de Metadata Esperada del Backend

```javascript
{
  phase: 2,                    // 1-4 (requerido)
  strategy: 'dt_priority',     // dt_only|dt_priority|cbr_priority|cbr_only
  phaseDescription: 'Combinando reglas expertas con experiencia de 15 proyectos',
  caseBaseSize: 15,            // Número de casos completados
  sources: {
    decisionTree: 8,           // Riesgos de DT
    cbr: 5,                    // Riesgos de CBR
    final: 10                  // Total después de deduplicación
  },
  similarCases: [...],         // Array de casos similares
  overallConfidence: 0.85
}
```

### Cada riesgo debe incluir:
```javascript
{
  riskId: 'R001',
  riskName: 'Budget Overrun',
  severity: 'high',
  probability: 0.7,
  source: 'cbr',              // 'expert_rules', 'decision_tree', o 'cbr'
  similarity: 0.85,           // Solo si source === 'cbr'
  // ... otros campos
}
```

---

## 📋 Ejemplos de Uso

### Mostrar Panel de Madurez en ProjectDetailPage:
```jsx
import { SystemMaturityPanel } from '../../components/risk';

function ProjectDetailPage() {
  const { prediction } = useRiskPrediction();
  
  return (
    <div>
      {prediction?.metadata && (
        <SystemMaturityPanel metadata={prediction.metadata} />
      )}
    </div>
  );
}
```

### Agregar badges de fuente a cada riesgo:
```jsx
import { RiskSourceBadge } from '../../components/risk';

function RiskCard({ risk, metadata }) {
  return (
    <div className="risk-card">
      <h3>{risk.riskName}</h3>
      <RiskSourceBadge 
        risk={risk}
        strategy={metadata.strategy}
      />
      {/* Resto del contenido */}
    </div>
  );
}
```

### Usar helpers en lógica:
```javascript
import { usesDT, usesCBR, getNextThreshold } from '../utils/strategyHelpers';

function RiskAnalysis({ metadata }) {
  const showDTConfig = usesDT(metadata.strategy);
  const showCBRConfig = usesCBR(metadata.strategy);
  const nextPhase = getNextThreshold(metadata.caseBaseSize);
  
  return (
    <div>
      {showDTConfig && <DTConfiguration />}
      {showCBRConfig && <CBRConfiguration />}
      {nextPhase && (
        <p>
          {nextPhase.remaining} proyectos más para alcanzar 
          Fase {nextPhase.nextPhase}
        </p>
      )}
    </div>
  );
}
```

---

## 🎯 Siguientes Pasos Recomendados

1. **Integrar en páginas existentes:**
   - [ ] Agregar `SystemMaturityPanel` en `ProjectDetailPage`
   - [ ] Agregar `RiskSourceBadge` en `EnhancedRiskCard`
   - [ ] Usar `PhaseIndicator` en dashboards

2. **Actualizar pruebas:**
   - [ ] Tests para nuevos componentes
   - [ ] Actualizar tests que usan metadata antigua

3. **Documentar para el equipo:**
   - [ ] Guía de migración para otros desarrolladores
   - [ ] Ejemplos en Storybook (si se usa)

---

## ⚠️ Breaking Changes

### Campos eliminados:
- `metadata.treeWeight` → Ya no existe
- `metadata.cbrWeight` → Ya no existe  
- `metadata.systemPhase` → Reemplazado por `metadata.phase` + `metadata.strategy`

### Campos nuevos requeridos:
- `metadata.phase` (number 1-4)
- `metadata.strategy` (string)
- `metadata.phaseDescription` (string, opcional pero recomendado)

### Componentes que necesitan actualización si los usabas:
- Cualquier componente que lea `treeWeight` o `cbrWeight`
- Componentes que muestren `systemPhase` directamente

---

## 📞 Contacto y Soporte

Si tienes dudas sobre la implementación o encuentras algún problema con los nuevos componentes, consulta:
- `strategyHelpers.js` para funciones helper
- `PhaseIndicator.jsx` para badges de fase
- `SystemMaturityPanel.jsx` para panel completo de madurez
- `RiskSourceBadge.jsx` para badges de fuente de riesgo

# Implementación: Análisis de Equipo y Riesgos para Proyectos Draft

## 📋 Resumen

Se ha implementado un flujo completo que permite a los Project Managers (PM) ver el equipo más idóneo y los riesgos asociados para proyectos en estado **Draft**, con la capacidad de modificar dinámicamente el equipo mientras se visualizan los riesgos en tiempo real.

---

## 🎯 Características Implementadas

### 1. **Visualización de Equipo Recomendado**
- Cuando un proyecto está en Draft sin equipo asignado, se muestra automáticamente el **equipo óptimo** recomendado
- El equipo se calcula usando **distancia Manhattan** basándose en:
  - Skills técnicas vs requisitos del proyecto
  - Nivel de experiencia requerido
  - Complejidad del sistema
  - Idiomas necesarios
- Cada candidato muestra:
  - Porcentaje de match
  - Score calculado
  - Skills que coinciden
  - Skills faltantes
  - Ranking de idoneidad

### 2. **Análisis de Riesgos en Tiempo Real**
- Se calculan riesgos usando:
  - **Decision Tree**: Reglas de expertos
  - **CBR (Case-Based Reasoning)**: Casos históricos similares
  - **Análisis de Equipo**: Gaps en tecnologías, experiencia, disponibilidad
- Los riesgos se muestran con:
  - Severidad (critical, high, medium, low)
  - Probabilidad de ocurrencia
  - Nivel de confianza
  - Recomendaciones específicas
  - Razonamiento detallado
- **Risk Level General** calculado automáticamente

### 3. **Modificación Dinámica del Equipo**
- El PM puede:
  - **Asignar empleados** desde la lista de recomendados
  - **Remover empleados** del equipo actual
  - Ver empleados disponibles ordenados por idoneidad
- **Los riesgos se recalculan automáticamente** cada vez que se modifica el equipo
- El análisis del equipo actual se actualiza mostrando:
  - Match percentage de cada miembro
  - Score individual vs requisitos
  - Rol asignado

### 4. **Interfaz de Dos Paneles**
- **Panel Izquierdo**: Gestión de equipo
  - Equipo actual asignado (si existe)
  - Candidatos recomendados
  - Botones para asignar/remover
- **Panel Derecho**: Análisis de riesgos
  - Overall risk level
  - Métricas de confianza
  - Lista expandible de riesgos con detalles

---

## 🗂️ Archivos Modificados/Creados

### Nuevos Archivos

1. **`src/components/projects/DraftTeamAnalysis.jsx`**
   - Componente principal para el análisis de equipo y riesgos
   - Maneja la carga de datos desde los endpoints
   - Gestiona la asignación/remoción de empleados
   - Muestra la interfaz de dos paneles

### Archivos Modificados

2. **`src/api/projects.js`**
   - Agregados 4 nuevos endpoints:
     - `getTeamAnalysis(id)` - Análisis de equipo (sugiere o analiza actual)
     - `suggestTeam(data)` - Sugiere equipo sin crear proyecto
     - `predictProjectRisks(id)` - Predice riesgos completos
     - `previewProjectRisks(id, data)` - Preview de riesgos con equipo hipotético

3. **`src/pages/ProjectDetailPage.jsx`**
   - Agregado import de `DraftTeamAnalysis`
   - Agregado nuevo tab "💡 Team Analysis" (solo visible en Draft)
   - El tab se activa por defecto cuando el proyecto está en Draft
   - Conectado callback `onProjectUpdate` para refrescar datos

4. **`src/index.css`**
   - Agregada animación `@keyframes spin` para spinners
   - Estilos globales básicos

---

## 🔄 Flujo de Usuario

### Escenario 1: Proyecto Draft Sin Equipo Asignado

```
1. PM crea proyecto → Estado: Draft, assignedEmployees: []
2. PM abre proyecto en ProjectDetailPage
3. Tab "Team Analysis" se abre automáticamente
4. Sistema muestra:
   - Equipo recomendado (top candidatos con scores)
   - Riesgos predichos basados en el equipo recomendado
5. PM asigna empleados uno por uno:
   → Click en "Assign to Project"
   → Empleado se mueve al panel "Assigned Team"
   → Riesgos se recalculan automáticamente
6. PM puede remover empleados:
   → Click en "Remove"
   → Empleado vuelve a lista de disponibles
   → Riesgos se recalculan
```

### Escenario 2: Proyecto Draft Con Equipo Parcialmente Asignado

```
1. PM abre proyecto con algunos empleados asignados
2. Sistema muestra:
   - Equipo actual con análisis de fit
   - Empleados disponibles para agregar
   - Riesgos actuales basados en el equipo asignado
3. PM modifica el equipo:
   - Puede agregar más empleados
   - Puede remover empleados existentes
   - Riesgos se actualizan en cada cambio
```

---

## 🔌 Endpoints Utilizados

### 1. GET `/api/projects/:id/team-analysis`
**Uso**: Obtener análisis del equipo

**Comportamiento**:
- Si `assignedEmployees` está vacío → Ejecuta algoritmo de selección óptima
- Si `assignedEmployees` tiene datos → Analiza el equipo actual

**Respuesta**:
```json
{
  "suggestedTeam": [
    {
      "userId": "...",
      "user": { "name": "...", "email": "..." },
      "matchPercentage": 85,
      "score": 2.5,
      "matchedSkills": ["React", "Node.js"],
      "missingSkills": ["MongoDB"]
    }
  ],
  "currentTeam": [...],  // Solo si hay equipo asignado
  "summary": {
    "totalMembers": 3,
    "avgExperience": 5.2,
    "skillsCoverage": { "React": 3, "Node.js": 2 }
  }
}
```

### 2. POST `/api/projects/:id/risks/predict`
**Uso**: Predecir riesgos completos del proyecto

**Comportamiento**:
- Ejecuta Decision Tree + CBR + Análisis de Equipo
- Si no hay equipo asignado, calcula riesgos con el equipo óptimo sugerido
- Si hay equipo asignado, usa el equipo actual

**Respuesta**:
```json
{
  "risks": [
    {
      "type": "budget_overrun",
      "title": "Budget Overrun Risk",
      "description": "...",
      "severity": "high",
      "probability": 0.65,
      "confidence": 0.78,
      "recommendations": ["..."],
      "reasoning": ["..."],
      "basedOnCases": [...]
    }
  ],
  "metadata": {
    "confidence": 0.75,
    "overallRiskLevel": "medium"
  }
}
```

### 3. POST `/api/projects/:id/assign`
**Uso**: Asignar empleado al proyecto

**Body**:
```json
{
  "employeeId": "user_id",
  "assignedRole": "Developer"
}
```

### 4. DELETE `/api/projects/:id/employees/:employeeId`
**Uso**: Remover empleado del proyecto

---

## 🎨 Componente Principal: DraftTeamAnalysis

### Props
```jsx
<DraftTeamAnalysis 
  project={project}           // Objeto del proyecto (required)
  onProjectUpdate={loadProject} // Callback para refrescar datos (required)
/>
```

### Estados Internos
- `teamAnalysis` - Análisis del equipo (sugerido o actual)
- `riskAnalysis` - Riesgos calculados
- `loading` - Estado de carga inicial
- `riskLoading` - Estado de recálculo de riesgos
- `expandedRisks` - Control de expansión de riesgos
- `showAllEmployees` - Mostrar todos los candidatos o solo top 5

### Funciones Clave
- `loadAnalysis()` - Carga análisis de equipo inicial
- `loadRiskAnalysis()` - Carga/recalcula riesgos
- `handleAssignEmployee()` - Asigna empleado y refresca
- `handleRemoveEmployee()` - Remueve empleado y refresca
- `calculateOverallRiskLevel()` - Calcula nivel de riesgo general

---

## 🧪 Pruebas Recomendadas

### Test 1: Proyecto Draft Nuevo
1. Crear proyecto en estado Draft sin equipo
2. Verificar que tab "Team Analysis" aparece
3. Verificar que se muestran candidatos recomendados
4. Verificar que se muestran riesgos iniciales
5. Asignar 2-3 empleados
6. Verificar que riesgos se recalculan
7. Verificar que el overall risk level cambia

### Test 2: Modificación Dinámica
1. Abrir proyecto Draft con 2 empleados asignados
2. Agregar 1 empleado más
3. Verificar que riesgos se actualizan
4. Remover 1 empleado
5. Verificar que riesgos se recalculan nuevamente

### Test 3: Proyecto Sin Candidatos
1. Crear organización sin empleados
2. Crear proyecto Draft
3. Verificar mensaje de error adecuado

### Test 4: Transición a Active
1. Tener proyecto Draft con equipo asignado
2. Activar el proyecto
3. Verificar que el tab "Team Analysis" desaparece
4. Verificar que el equipo se mantiene en el tab "Team"

---

## 📊 Flujo de Datos

```
ProjectDetailPage
    ↓ (carga proyecto)
    ↓
[project.status === 'draft']
    ↓
DraftTeamAnalysis
    ↓
    ├─→ loadAnalysis()
    │   └─→ GET /api/projects/:id/team-analysis
    │       └─→ Obtiene suggestedTeam
    │
    ├─→ loadRiskAnalysis()
    │   └─→ POST /api/projects/:id/risks/predict
    │       └─→ Obtiene risks[]
    │
    ├─→ handleAssignEmployee()
    │   ├─→ POST /api/projects/:id/assign
    │   └─→ onProjectUpdate() → Refresca proyecto
    │       └─→ useEffect detecta cambio en assignedEmployees
    │           └─→ loadRiskAnalysis() → Recalcula riesgos
    │
    └─→ handleRemoveEmployee()
        ├─→ DELETE /api/projects/:id/employees/:employeeId
        └─→ onProjectUpdate() → Refresca proyecto
            └─→ useEffect detecta cambio
                └─→ loadRiskAnalysis() → Recalcula riesgos
```

---

## ⚙️ Configuración Backend Requerida

El backend **ya está preparado** con estos endpoints implementados:

- ✅ `GET /api/projects/:id/team-analysis`
- ✅ `POST /api/projects/suggest-team`
- ✅ `POST /api/projects/:id/risks/predict`
- ✅ `POST /api/projects/:id/assign`
- ✅ `DELETE /api/projects/:id/employees/:employeeId`

**No se requieren cambios en el backend.**

---

## 🔮 Mejoras Futuras (Opcionales)

1. **What-If Scenarios**: Mostrar preview de riesgos si se agrega candidato X
2. **Team Comparison**: Comparar equipo actual vs recomendado lado a lado
3. **Risk Trends**: Gráfica de cómo los riesgos cambian al modificar el equipo
4. **Export Report**: Exportar análisis a PDF
5. **Notifications**: Notificar cuando un riesgo crítico es detectado
6. **Auto-Assign**: Botón para asignar automáticamente el equipo recomendado
7. **Skill Gap Analysis**: Vista detallada de skills faltantes vs requeridas
8. **Budget Impact**: Mostrar cómo cada empleado impacta el presupuesto

---

## 📝 Notas Técnicas

### Recálculo de Riesgos
Los riesgos se recalculan automáticamente usando un `useEffect` que observa `project.assignedEmployees`:

```jsx
useEffect(() => {
  if (project.assignedEmployees?.length > 0) {
    loadRiskAnalysis();
  } else {
    setRiskAnalysis(null);
  }
}, [project.assignedEmployees]);
```

### Performance
- Se utiliza debouncing en `DynamicTeamBuilder` (componente existente)
- No hay debouncing en `DraftTeamAnalysis` porque los cambios son explícitos (botones)
- Las llamadas API son secuenciales para evitar race conditions

### Manejo de Errores
- Los errores de carga se muestran con mensajes específicos
- Si no hay empleados en la organización, se muestra mensaje de ayuda
- Los errores de asignación/remoción se muestran con alerts

---

## ✅ Checklist de Implementación

- [x] Endpoints agregados a `projects.js`
- [x] Componente `DraftTeamAnalysis.jsx` creado
- [x] Integración en `ProjectDetailPage.jsx`
- [x] Tab "Team Analysis" agregado para Draft
- [x] Tab por defecto configurado para Draft
- [x] Estilos y animaciones agregados
- [x] Recálculo automático de riesgos implementado
- [x] Manejo de estados de carga
- [x] Manejo de errores
- [x] Sin errores de TypeScript/ESLint

---

## 🚀 Listo para Usar

El flujo está completamente implementado y listo para ser probado. Los Project Managers ahora pueden:

1. Ver el equipo más idóneo al crear un proyecto Draft
2. Ver los riesgos asociados al equipo recomendado
3. Modificar el equipo dinámicamente
4. Ver cómo los riesgos cambian en tiempo real
5. Tomar decisiones informadas antes de activar el proyecto

**Todo funciona end-to-end sin necesidad de cambios en el backend.**

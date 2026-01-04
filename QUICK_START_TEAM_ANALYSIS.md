# 🚀 Guía Rápida: Análisis de Equipo y Riesgos en Proyectos Draft

## ¿Qué se implementó?

Ahora cuando creas un proyecto en estado **Draft**, el sistema automáticamente:

1. ✅ **Recomienda el equipo más idóneo** basándose en:
   - Skills técnicas de cada empleado
   - Nivel de experiencia
   - Disponibilidad
   - Match con los requisitos del proyecto

2. ✅ **Predice riesgos del proyecto** usando:
   - Inteligencia Artificial (Decision Tree + CBR)
   - Análisis de casos históricos similares
   - Análisis del equipo sugerido/asignado

3. ✅ **Permite modificar el equipo dinámicamente** mientras:
   - Los riesgos se recalculan automáticamente
   - Ves el impacto de cada cambio en tiempo real

---

## 📖 Cómo usar

### Paso 1: Crear Proyecto Draft

Crea un proyecto normalmente. Quedará en estado **Draft** por defecto.

### Paso 2: Abrir el Proyecto

Cuando abras el proyecto, verás una nueva pestaña: **"💡 Team Analysis"**

Esta pestaña se abre automáticamente.

### Paso 3: Ver Equipo Recomendado

En el **panel izquierdo** verás:
- Lista de empleados ordenados por idoneidad
- Porcentaje de match con el proyecto
- Skills que coinciden y skills faltantes
- Score calculado

### Paso 4: Ver Riesgos Iniciales

En el **panel derecho** verás:
- Nivel de riesgo general (Low, Medium, High, Critical)
- Lista de riesgos detectados
- Severidad de cada riesgo
- Recomendaciones para mitigar

### Paso 5: Asignar Empleados

Click en **"Assign to Project"** en cualquier empleado recomendado.

**¿Qué pasa?**
- El empleado se mueve al panel "Assigned Team"
- Los riesgos se recalculan automáticamente
- El nivel de riesgo general se actualiza

### Paso 6: Modificar el Equipo (Opcional)

Puedes:
- **Agregar más empleados**: Click en "Assign" en la lista de disponibles
- **Remover empleados**: Click en "Remove" en el equipo asignado

**Cada cambio recalcula los riesgos instantáneamente.**

### Paso 7: Activar Proyecto

Cuando estés satisfecho con el equipo y los riesgos sean aceptables:

1. Ve a la pestaña **Overview**
2. Click en **"Activate Project"**
3. El proyecto pasa a estado **Active**

---

## 🎯 Ejemplo Práctico

### Escenario: Proyecto de App Web con React + Node.js

**1. Sistema recomienda:**
- Ana (React Expert) - 95% match
- Carlos (Full Stack) - 85% match
- María (Backend Senior) - 78% match

**2. Riesgos iniciales detectados:**
- ⚠️ **HIGH**: Timeline Delay (65% probabilidad)
  - *Razón*: Equipo pequeño para la complejidad
  - *Recomendación*: Agregar 1-2 desarrolladores más

- ⚠️ **MEDIUM**: Technical Debt (45% probabilidad)
  - *Razón*: Falta experiencia en testing automatizado
  - *Recomendación*: Incluir QA Engineer

**3. PM asigna a Ana y Carlos**
- Los riesgos se recalculan
- Timeline Delay baja a **MEDIUM** (45%)

**4. PM agrega a María**
- Timeline Delay baja a **LOW** (25%)
- Aparece nuevo riesgo **LOW**: Communication Overhead
  - *Razón*: Equipo más grande requiere coordinación

**5. PM decide:**
- El riesgo general es aceptable
- Activa el proyecto

---

## 💡 Tips

### Para minimizar riesgos:

1. **Prioriza el match percentage**: Empleados con mayor match reducen riesgos técnicos
2. **Revisa los riesgos ANTES de asignar**: Algunos riesgos son inevitables
3. **Lee las recomendaciones**: El sistema sugiere acciones concretas
4. **Balancea el equipo**: No siempre "más empleados = menos riesgos"

### Interpreta el Risk Level:

- 🟢 **LOW**: El proyecto está bien configurado
- 🟡 **MEDIUM**: Algunos riesgos identificados pero manejables
- 🟠 **HIGH**: Riesgos significativos, considera ajustar el equipo
- 🔴 **CRITICAL**: No recomendado activar, revisa el equipo urgentemente

---

## 🔍 Información Detallada de Riesgos

Click en cualquier riesgo para expandirlo y ver:

- **Descripción detallada**: Qué es el riesgo
- **Probabilidad**: Qué tan probable es que ocurra
- **Confidence**: Qué tan seguro está el sistema
- **Recomendaciones**: Acciones concretas para mitigar
- **Razonamiento**: Por qué el sistema detectó este riesgo
- **Casos similares**: Proyectos históricos con problemas parecidos

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo activar el proyecto sin asignar equipo?**  
R: Sí, pero el sistema lo desaconseja. El tab Team Analysis te ayuda a tomar mejores decisiones.

**P: ¿Los riesgos son garantías de que ocurrirán?**  
R: No, son predicciones basadas en datos históricos y análisis del equipo. Son guías para la toma de decisiones.

**P: ¿Puedo modificar el equipo después de activar el proyecto?**  
R: Sí, pero el tab Team Analysis solo está disponible en Draft. Una vez activo, usa el tab "Team" normal.

**P: ¿Qué pasa si no hay empleados disponibles?**  
R: El sistema mostrará un mensaje indicando que debes agregar empleados a la organización primero.

**P: ¿Cuántos empleados debo asignar?**  
R: Depende del proyecto. El sistema recomienda candidatos ordenados por idoneidad. Observa cómo cambian los riesgos al agregar/remover empleados.

---

## 🛠️ Archivos Involucrados (Para Desarrolladores)

Si necesitas modificar o extender esta funcionalidad:

- **`src/components/projects/DraftTeamAnalysis.jsx`**: Componente principal
- **`src/pages/ProjectDetailPage.jsx`**: Integración del componente
- **`src/api/projects.js`**: Endpoints conectados al backend
- **`TEAM_ANALYSIS_IMPLEMENTATION.md`**: Documentación técnica completa

---

## 🎉 ¡Disfruta la nueva funcionalidad!

Esta herramienta te ayudará a:
- Tomar decisiones más informadas sobre tu equipo
- Anticipar problemas antes de que ocurran
- Optimizar la composición del equipo según los requisitos
- Reducir riesgos en tus proyectos

**¿Dudas? Consulta `TEAM_ANALYSIS_IMPLEMENTATION.md` para más detalles técnicos.**

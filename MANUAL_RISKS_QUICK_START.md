# Manual Risks Frontend - Guía de Uso Rápida

## 🎯 Resumen

El sistema de **Riesgos Manuales** permite a los Project Managers:

1. **Descubrir y agregar** nuevos riesgos durante la ejecución del proyecto
2. **Actualizar** riesgos a medida que evolucionan
3. **Eliminar** riesgos (si el proyecto aún no está completado)
4. **Visualizar** todos los riesgos con detalles completos
5. Contribuir automáticamente al **aprendizaje del sistema** (CBR) cuando se completa el proyecto

## 🚀 Inicio Rápido

### 1. Abrir Proyecto

```
1. Ve a la página de Proyectos
2. Selecciona un proyecto en estado ACTIVE o superior
3. Se mostrará la nueva pestaña "Manual Risks"
```

### 2. Ver Riesgos Actuales

```
1. Haz clic en la pestaña "Manual Risks"
2. Verás una lista de todos los riesgos manuales del proyecto
3. Haz clic en un riesgo para ver detalles completos
```

### 3. Agregar Nuevo Riesgo

```
1. Haz clic en el botón "Add Risk" (esquina superior derecha)
2. Se abre un modal con el formulario
3. Completa los campos:
   - Type: Selecciona el tipo de riesgo
   - Title: Título del riesgo
   - Description: Descripción detallada
   - Severity: Nivel de severidad
   - Probability: Probabilidad (0-100%)
   - Category: Categoría (técnica, coordinación, etc.)
   - Root Cause: Causa raíz (opcional)
   - Indicators: Indicadores del riesgo (opcional)
   - Recommendations: Recomendaciones (opcional)
4. Haz clic en "Add Risk"
5. El riesgo se agrega instantáneamente a la lista
```

### 4. Actualizar un Riesgo

```
1. Haz clic en el ícono de "Editar" (lápiz) del riesgo
2. Modifica los datos necesarios
3. Haz clic en "Update Risk"
4. El riesgo se actualiza en la lista
```

### 5. Eliminar un Riesgo

```
1. Haz clic en el ícono de "Eliminar" (papelera)
2. El botón cambiará a "Click again to confirm"
3. Haz clic nuevamente para confirmar
4. El riesgo se elimina
```

## 📝 Campos del Formulario

### Type (Requerido)
Selecciona uno de estos 16 tipos predefinidos:

| Tipo | Descripción |
|------|-------------|
| schedule_overrun | El proyecto se desvía del cronograma |
| budget_overrun | Los costos superan el presupuesto |
| quality_degradation | La calidad del código disminuye |
| resource_unavailability | Falta de recursos disponibles |
| communication_breakdown | Fallos en la comunicación del equipo |
| vendor_lock_in | Dependencia de un proveedor externo |
| third_party_api_downtime | La API de terceros no disponible |
| team_conflicts | Conflictos entre miembros del equipo |
| scope_creep | Expansión incontrolada del alcance |
| technical_debt | Acumulación de deuda técnica |
| security_breach | Brechas de seguridad descubiertas |
| data_loss | Pérdida de datos críticos |
| dependency_failure | Fallo de dependencias del proyecto |
| market_change | Cambios en el mercado |
| regulatory_change | Cambios en regulaciones |
| other | Otro tipo de riesgo |

### Title (Requerido)
Título breve del riesgo. Ejemplo: "API de pagos sin SLA"

### Description (Requerido)
Descripción detallada del riesgo. Incluye contexto y por qué es preocupante.

### Severity (Recomendado)
Nivel de impacto si el riesgo ocurre:
- **low**: Impacto mínimo
- **medium**: Impacto moderado
- **high**: Impacto significativo
- **critical**: Impacto catastrófico

### Probability (Recomendado)
Probabilidad de que ocurra el riesgo (0-100%):
- 0%: No ocurrirá
- 50%: Posibilidad media
- 100%: Definitivamente ocurrirá

**Ejemplo**: Una API con antecedentes de inactividad → 65%

### Category (Recomendado)
Categoría del riesgo:
- **technical**: Problemas técnicos o arquitectónicos
- **coordination**: Problemas de coordinación entre equipos
- **team**: Problemas relacionados con el equipo
- **management**: Problemas de gestión de proyecto
- **organizational**: Problemas organizacionales

### Root Cause (Opcional)
¿Cuál es la causa raíz del riesgo?

Ejemplo: "No hay contrato SLA con el proveedor de API"

### Indicators (Opcional)
Señales que indican que el riesgo podría ocurrir.

Ejemplo:
- "El proveedor tiene 3 incidentes en los últimos 6 meses"
- "No hay monitoreo de disponibilidad"
- "Documentación del SLA vaga"

### Recommendations (Opcional)
Acciones para mitigar el riesgo.

Ejemplo:
- "Implementar cache local para reintento automático"
- "Evaluar proveedores alternativos"
- "Configurar alertas de disponibilidad"

## 💡 Casos de Uso Prácticos

### Caso 1: Descubrir Riesgo en Sprint 2

```
Situación: El equipo descubre que la API de pagos tiene 
rate-limiting no documentado (100 req/min)

Acción:
1. Abre el proyecto → Manual Risks
2. Haz clic en "Add Risk"
3. Type: third_party_api_downtime
4. Title: "Rate-limiting no documentado en API de pagos"
5. Description: "API rechaza después de 100 req/min sin aviso"
6. Severity: high
7. Probability: 75%
8. Root Cause: "Falta especificación en contrato"
9. Indicators:
   - "Documentación de API incompleta"
   - "Sin monitoreo de rate-limiting"
10. Recommendations:
    - "Implementar queue para manejar rate-limit"
    - "Contactar proveedor por SLA"
11. Haz clic en "Add Risk"

Resultado:
✅ El riesgo se agrega instantáneamente
✅ Todo el equipo ve este riesgo
✅ Se puede monitorear durante la ejecución
```

### Caso 2: El Riesgo Ocurrió

```
Situación: En Sprint 4, la API de pagos tuvo 2 horas 
de inactividad, causando retrasos

Acción:
1. Abre el riesgo agregado anteriormente
2. Haz clic en el ícono de editar (lápiz)
3. Cambiar Severity a: critical
4. Cambiar Probability a: 100%
5. Agregar nota en Root Cause:
   "Ocurrió el 2026-01-18 de 14:00 a 16:00"
6. Haz clic en "Update Risk"

Resultado:
✅ Riesgo actualizado a estado crítico
✅ Se captura que ocurrió
✅ Al completar el proyecto, esto se incluye en el CBR
✅ Futuro proyecto similar recibe esta advertencia
```

### Caso 3: Mitigación Exitosa

```
Situación: Se implementó cache y el riesgo se mitigó

Acción:
1. Abre el riesgo
2. Haz clic en editar
3. Cambiar Probability a: 15% (riesgo residual bajo)
4. Agregar en Recommendations: "✅ Cache implementado"
5. Haz clic en "Update Risk"

Resultado:
✅ El riesgo ahora tiene probabilidad baja
✅ Al completar el proyecto, CBR aprende cómo mitigarlo
✅ Futuro proyecto recibe recomendación: "Implementar cache"
```

### Caso 4: Riesgo Falsa Alarma

```
Situación: Evaluamos el riesgo de inactividad, 
pero el proveedor garantizó SLA de 99.9%

Acción:
1. El riesgo puede eliminarse (si proyecto aún está activo)
2. O dejarlo con Probability: 5% como riesgo residual

Resultado:
✅ CBR no aprende ese riesgo como crítico
✅ Se conserva la información por si es relevante
```

## 🔄 Flujo Completo: Desde Riesgo Manual a Aprendizaje

```
1️⃣ Project Manager en Sprint 2
   ├─ Descubre nuevo riesgo
   └─ Agrega manualmente en "Manual Risks"

2️⃣ Durante Ejecución
   ├─ PM actualiza estado del riesgo
   └─ Equipo ve y gestiona el riesgo

3️⃣ Proyecto Completado
   ├─ PM completa "Outcome"
   ├─ Los riesgos manuales se incluyen automáticamente
   └─ Se guardan en el CBR

4️⃣ Proyecto Futuro Similar
   ├─ Decision Tree predice riesgos automáticos
   ├─ CBR busca proyectos similares
   ├─ Encuentra el proyecto anterior
   ├─ Ve que incluyó ese riesgo manual
   └─ ✅ Predice el riesgo para el nuevo proyecto

5️⃣ PM en Nuevo Proyecto
   ├─ Ve el riesgo predicho por CBR
   ├─ "Este riesgo es exacto, como el proyecto anterior"
   └─ ✅ Sistema ha aprendido exitosamente
```

## 📊 Visualización de Riesgos

### Cada Riesgo Muestra:

```
┌─────────────────────────────────────────┐
│ [●] Vendor Lock-in Risk                 │
│     VENDOR LOCK IN | HIGH | monitoring  │
│     65% prob. | [EDIT] [DELETE]        │
├─────────────────────────────────────────┤
│ Description: Risk of API vendor...     │
│ Category: technical                     │
│ Probability: 65%                        │
│                                         │
│ Root Cause: No SLA agreement            │
│                                         │
│ Indicators:                             │
│ • No SLA contract                       │
│ • Previous downtime incidents           │
│                                         │
│ Recommendations:                        │
│ • Implement cache and retry logic       │
│ • Research alternative vendors          │
│                                         │
│ Added on 1/20/2026                      │
└─────────────────────────────────────────┘
```

## ⚠️ Consideraciones Importantes

### ✅ Haz Esto

- ✅ Agregar riesgos lo antes posible
- ✅ Ser específico en descripciones
- ✅ Actualizar cuando el riesgo evoluciona
- ✅ Incluir indicadores observables
- ✅ Proporcionar recomendaciones accionables

### ❌ Evita Esto

- ❌ Agregar riesgos vagos sin detalles
- ❌ Olvidar actualizar riesgos que ocurrieron
- ❌ Dejar riesgos sin indicadores
- ❌ No recopilar lecciones aprendidas

## 🔒 Permisos

| Acción | Quién | Condición |
|--------|-------|-----------|
| Ver riesgos | Todos | Proyecto no en DRAFT |
| Agregar riesgos | PM/Admin | Proyecto no COMPLETED |
| Editar riesgos | PM/Admin | Proyecto no COMPLETED |
| Eliminar riesgos | PM/Admin | Proyecto no COMPLETED |

## 🐛 Solución de Problemas

### Q: "No veo la pestaña Manual Risks"
**A:** 
- El proyecto debe estar en estado ACTIVE o superior (no DRAFT)
- Recarga la página

### Q: "No puedo editar/eliminar riesgos"
**A:**
- Verificar que eres PM o Admin
- Verificar que el proyecto no está completado

### Q: "El riesgo no se guardó"
**A:**
- Verifica campos requeridos (type, title, description)
- Revisa que probability esté entre 0 y 1
- Revisa la consola para errores

### Q: "¿Cómo se usan estos riesgos en el aprendizaje?"
**A:** Ver [SISTEMA_DE_RIESGOS_MANUALES.md](./SISTEMA_DE_RIESGOS_MANUALES.md)

## 📚 Más Información

- **Documentación técnica**: [MANUAL_RISKS_IMPLEMENTATION.md](./MANUAL_RISKS_IMPLEMENTATION.md)
- **Guía del sistema completo**: [README.md](./README.md)
- **Predicción de riesgos**: [QUICK_START_RISK_PREDICTION.md](./QUICK_START_RISK_PREDICTION.md)

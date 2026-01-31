# Sistema de Riesgos Manuales - Guía de Implementación Frontend

## 📋 Descripción General

Esta implementación proporciona la interfaz de usuario completa para el sistema de **Riesgos Manuales** que permite a los Project Managers:

- ✅ Agregar nuevos riesgos descubiertos durante la ejecución
- ✅ Actualizar riesgos existentes a medida que evolucionan
- ✅ Eliminar riesgos antes de que se complete el proyecto
- ✅ Visualizar todos los riesgos de un proyecto
- ✅ Gestionar indicadores y recomendaciones por riesgo

## 🗂️ Estructura de Archivos

```
src/
├── api/
│   ├── manualRisks.js          # Servicio API para riesgos manuales
│   └── manualRisks.test.js     # Tests del servicio API
├── hooks/
│   ├── useManualRisks.js       # Hook personalizado para gestión de riesgos
│   └── useManualRisks.test.js  # Tests del hook
├── components/risk/
│   ├── ManualRiskForm.jsx      # Componente de formulario (add/edit)
│   ├── ManualRiskForm.test.jsx # Tests del formulario
│   ├── ManualRisksList.jsx     # Componente de lista de riesgos
│   └── ManualRisksList.test.jsx# Tests de la lista
└── pages/
    └── ProjectDetailPage.jsx   # Página actualizada con nueva pestaña de riesgos
```

## 🔌 API Service (`src/api/manualRisks.js`)

Proporciona funciones para todas las operaciones CRUD:

```javascript
// Agregar un nuevo riesgo
addManualRisk(projectId, riskData)

// Obtener todos los riesgos manuales de un proyecto
getProjectManualRisks(projectId)

// Obtener un riesgo específico
getManualRisk(projectId, riskId)

// Actualizar un riesgo
updateManualRisk(projectId, riskId, updateData)

// Eliminar un riesgo
deleteManualRisk(projectId, riskId)

// Enviar resultado del proyecto con riesgos actualizados
submitProjectOutcome(projectId, outcomeData)
```

## 🎣 Hook Personalizado (`src/hooks/useManualRisks.js`)

Proporciona la lógica de gestión de estado para riesgos manuales:

```javascript
const {
  manualRisks,        // Array de riesgos
  loading,            // Estado de carga
  error,              // Mensaje de error
  loadManualRisks,    // Función para cargar riesgos
  addRisk,            // Función para agregar riesgo
  updateRisk,         // Función para actualizar riesgo
  deleteRisk,         // Función para eliminar riesgo
  clearError          // Función para limpiar errores
} = useManualRisks(projectId);
```

**Características:**
- Manejo automático de errores con notificaciones
- Estados de carga para cada operación
- Actualización automática de la lista
- Validación de projectId

## 🎨 Componentes UI

### ManualRiskForm (`src/components/risk/ManualRiskForm.jsx`)

Modal para agregar o editar riesgos manuales.

**Props:**
```javascript
{
  initialRisk: Risk | null,      // Riesgo a editar (null = agregar nuevo)
  onSubmit: (data) => void,      // Callback cuando se envía el formulario
  onCancel: () => void,          // Callback cuando se cancela
  loading: boolean               // Estado de carga
}
```

**Características:**
- Validación en tiempo real
- Selector de tipo de riesgo con 16 opciones
- Control deslizante para probabilidad (0-1)
- Gestión de indicadores y recomendaciones con etiquetas
- Modal reutilizable para add/edit

### ManualRisksList (`src/components/risk/ManualRisksList.jsx`)

Componente para mostrar la lista de riesgos manuales.

**Props:**
```javascript
{
  risks: Risk[],                 // Array de riesgos
  loading: boolean,              // Estado de carga
  error: string | null,          // Mensaje de error
  onEdit: (risk) => void,        // Callback cuando se abre edición
  onDelete: (riskId) => void,    // Callback cuando se elimina
  onRefresh: () => void,         // Callback para recargar
  canManage: boolean             // Si el usuario puede editar/eliminar
}
```

**Características:**
- Lista expandible con detalles
- Indicadores visuales de severidad y estado
- Botones de edición y eliminación con confirmación
- Manejo de estados: carga, error, vacío
- Código de colores por severidad (critical, high, medium, low)

## 📄 Integración en ProjectDetailPage

Se agregó una nueva pestaña "Manual Risks" que:

1. **Solo aparece** para proyectos que no están en estado DRAFT
2. **Permite agregar riesgos** si el usuario puede editar y el proyecto no está completado
3. **Muestra la lista** de riesgos con opciones de edición/eliminación
4. **Maneja errores** con UI amigable y opción de reintentar

### Código de Integración:

```javascript
// En ProjectDetailPage.jsx

import { useManualRisks } from '../hooks/useManualRisks';
import ManualRiskForm from '../components/risk/ManualRiskForm';
import ManualRisksList from '../components/risk/ManualRisksList';

// En el componente
const {
  manualRisks,
  loading: risksLoading,
  error: risksError,
  loadManualRisks,
  addRisk,
  updateRisk,
  deleteRisk
} = useManualRisks(project?._id);

// Nueva pestaña en TabNavigation
...(project.status !== PROJECT_STATUS.DRAFT ? [
  { id: 'risks', label: 'Manual Risks' }
] : [])

// Nueva sección de contenido
{activeTab === 'risks' && (
  <div>
    {/* Botón para agregar riesgo */}
    {/* Lista de riesgos */}
    {/* Modal del formulario */}
  </div>
)}
```

## 📦 Tipos de Riesgos

El sistema incluye 16 tipos predefinidos:

```javascript
schedule_overrun              // Sobrecostos de cronograma
budget_overrun               // Sobrecostos presupuestarios
quality_degradation          // Degradación de calidad
resource_unavailability      // Falta de recursos
communication_breakdown      // Fallos de comunicación
vendor_lock_in              // Dependencia de proveedor
third_party_api_downtime    // Inactividad de API de terceros
team_conflicts              // Conflictos de equipo
scope_creep                 // Expansión incontrolada del alcance
technical_debt              // Deuda técnica
security_breach             // Brechas de seguridad
data_loss                   // Pérdida de datos
dependency_failure          // Fallos de dependencias
market_change               // Cambios de mercado
regulatory_change           // Cambios regulatorios
other                       // Otro
```

## 🏷️ Categorías

```javascript
technical        // Problemas técnicos
coordination     // Problemas de coordinación
team             // Problemas de equipo
management       // Problemas de gestión
organizational   // Problemas organizacionales
```

## 📊 Niveles de Severidad

```javascript
low              // Bajo
medium           // Medio
high             // Alto
critical         // Crítico
```

## 🧪 Testing

Cada componente y hook tiene tests completos:

### API Tests (`manualRisks.test.js`)
- Tests para cada endpoint
- Manejo de errores
- Validación de llamadas API

### Hook Tests (`useManualRisks.test.js`)
- Carga de riesgos
- Agregar/actualizar/eliminar
- Manejo de errores
- Validación de notificaciones

### Componente Form Tests (`ManualRiskForm.test.jsx`)
- Modo agregar y editar
- Validación de formulario
- Gestión de indicadores/recomendaciones
- Estados de carga

### Componente List Tests (`ManualRisksList.test.jsx`)
- Renderizado de lista
- Expansión de detalles
- Edición y eliminación
- Manejo de permisos
- Estados de error y carga

**Para ejecutar los tests:**

```bash
npm test
# O para un archivo específico
npm test manualRisks.test.js
```

## 🚀 Flujo de Uso

### 1. Project Manager abre proyecto en estado ACTIVE

```
ProjectDetailPage carga
→ Nueva pestaña "Manual Risks" aparece
→ useManualRisks(projectId) se inicializa
→ loadManualRisks() obtiene la lista actual
```

### 2. PM descubre un nuevo riesgo

```
Haz clic en "Add Risk"
→ ManualRiskForm se abre en modo "add"
→ PM completa todos los campos
→ Haz clic en "Add Risk"
→ addRisk() envía POST al backend
→ Lista se actualiza automáticamente
→ Notificación de éxito
```

### 3. PM necesita actualizar un riesgo

```
Haz clic en el ícono de edición
→ ManualRiskForm se abre en modo "edit"
→ PM modifica los datos necesarios
→ Haz clic en "Update Risk"
→ updateRisk() envía PUT al backend
→ Lista se actualiza
→ Modal se cierra
```

### 4. PM elimina un riesgo (antes de completar)

```
Haz clic en el ícono de eliminar
→ Botón cambia a "Click again to confirm"
→ Segundo clic confirma
→ deleteRisk() envía DELETE
→ Riesgo se elimina de la lista
```

### 5. Proyecto se completa

```
PM finaliza proyecto (en otra página)
→ Riesgos manuales se incluyen automáticamente en outcome
→ CBR aprende estos riesgos
→ Futuros proyectos similares los predicen
```

## 🔒 Permisos

- **Agregar riesgos**: Solo si `canEdit && project.status !== COMPLETED`
- **Editar riesgos**: Solo si `canEdit && project.status !== COMPLETED`
- **Eliminar riesgos**: Solo si `canEdit && project.status !== COMPLETED`
- **Ver riesgos**: Todos los miembros del proyecto

## 🌐 Internacionalización

Los componentes usan `react-i18next` para textos traducibles. Los textos fijos (como etiquetas de riesgo) se pueden traducir agregando claves i18n.

## ⚠️ Notas Importantes

1. **Validación de Probabilidad**: Debe estar entre 0 y 1
2. **Campos Requeridos**: type, title, description son obligatorios
3. **Doble Confirmación**: Eliminar requiere dos clics para evitar borrados accidentales
4. **Solo Proyecto Activos**: Los riesgos manuales solo se pueden gestionar en proyectos ACTIVE o MONITORING
5. **Importancia para CBR**: Los riesgos manuales son cruciales para el aprendizaje del sistema

## 🐛 Troubleshooting

### Los riesgos no se cargan
- Verificar que projectId es válido
- Revisar console para errores
- Verificar que el proyecto no está en DRAFT

### El formulario no se envía
- Revisar validaciones (fields rojos)
- Asegurar que type está seleccionado
- Verificar que probability está entre 0 y 1

### Los botones de edición no aparecen
- Verificar que canEdit es true
- Verificar que el proyecto no está completado

## 📚 Documentación Relacionada

- Sistema de Predicción de Riesgos: `QUICK_START_RISK_PREDICTION.md`
- Flujo de Proyectos: `README.md`
- API Backend: Documentación del servidor

# 🚀 Guía de Implementación - Sistema de Gestión de Proyectos con Predicción de Riesgos

## ✅ COMPONENTES YA CREADOS

### 1. Tipos y Constantes Actualizados
- ✅ `src/types/projectTypes.js` - Añadidos WORK_MODEL_TYPES, TASK_TRACKING_SYSTEMS, KNOWLEDGE_MANAGEMENT_SYSTEMS, COMPLIANCE_STANDARDS
- ✅ FORM_STEPS actualizado a 11 pasos

### 2. Nuevos Componentes de Formulario
- ✅ `src/components/projects/Step4WorkModel.jsx` - Work Model & Remote Configuration
- ✅ `src/components/projects/Step6KnowledgeManagement.jsx` - Knowledge Management
- ✅ `src/components/projects/Step7StandardsCompliance.jsx` - Standards & Compliance
- ⚠️ `src/components/projects/Step5Roles.jsx` - PARCIALMENTE actualizado (falta completar)

### 3. API Actualizada
- ✅ `src/api/projects.js` - Añadidos endpoints:
  - `previewProjectRisks(projectId, data)` - Preview sin guardar
  - `getProjectRisks(projectId)` - Obtener riesgos guardados
  - `updateRisk(riskId, data)` - Actualizar riesgo
  - `suggestTeam(data)` - Obtener recomendaciones de equipo
  - `assignEmployeesToProject(projectId, data)` - Asignar múltiples empleados
  - `getTeamAnalysis(projectId)` - Análisis detallado del equipo

### 4. Componente Crítico: Dynamic Team Builder
- ✅ `src/components/projects/DynamicTeamBuilder.jsx` - Vista split con selección de equipo + riesgos en tiempo real

---

## 📋 TAREAS PENDIENTES

### 1. Actualizar ProjectFormPage.jsx

**Ubicación:** `src/pages/ProjectFormPage.jsx`

#### Cambios necesarios:

**a) Importar nuevos componentes:**
```javascript
import Step4WorkModel from '../components/projects/Step4WorkModel';
import Step6KnowledgeManagement from '../components/projects/Step6KnowledgeManagement';
import Step7StandardsCompliance from '../components/projects/Step7StandardsCompliance';
// Renumerar los existentes:
// Step4Geographic → ahora es parte de Step4WorkModel
// Step6Availability → ahora es Step8Availability
// Step7Coordination → ahora es Step9Coordination
// Step8CollaborationIntensity → ahora es Step10CollaborationIntensity
// Step9Maturity → ahora es Step11Maturity
```

**b) Actualizar `getInitialFormData()`:**
```javascript
function getInitialFormData() {
  return {
    // Step 1: General Information (REQUIRED)
    projectName: '',
    briefDescription: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    expectedDuration: { value: 1, unit: 'months' },
    
    // Step 2: Collaboration & Communication (REQUIRED)
    requiresSynchronousCommunication: 'no',
    realTimeCommunicationLevel: 'low',
    weeklyMeetingsCount: 0,
    averageMeetingDuration: { value: 0, unit: 'minutes' },
    requiredAvailabilitySchedule: '',
    requiredLanguages: [],
    minimumLanguageProficiency: 'B1',
    asyncCommunicationStrategy: '', // NUEVO
    
    // Step 3: Technical Requirements (REQUIRED)
    mainTechnologies: [],
    requiredExperienceLevel: 'mid',
    systemComplexity: 'medium',
    documentationLevel: 'partial',
    sharedInfrastructureDependency: '',
    requiresSpecializedTools: { needed: false, description: '' },
    
    // Step 4: Work Model & Remote Configuration (NUEVO)
    workModel: { type: 'hybrid', remotePercentage: 50 },
    teamRegions: [],
    distributedWorkExperienceLevel: 'medium',
    expectedTimeOverlap: { value: 4, unit: 'hours' },
    culturalDiversityLevel: 'medium',
    hasTimezoneSchedulingPolicy: false,
    coreHours: { start: '09:00', end: '17:00', timezone: 'UTC' },
    meetingRotationPolicy: false,
    timezoneConsiderations: '',
    requiresOffHoursReporting: false,
    
    // Step 5: Roles & Organization (AMPLIADO)
    hasOrganizationalChart: false,
    hasTaskTrackingTool: false,
    taskTrackingSystem: '',
    rolesAndResponsibilities: [],
    criticalDependencies: [],
    
    // Step 6: Knowledge Management (NUEVO)
    hasKnowledgeManagementTools: false,
    knowledgeManagementSystem: '',
    knowledgeManagementTools: [],
    documentationProcesses: {
      hasStandardization: false,
      templates: false,
      reviewProcess: false
    },
    
    // Step 7: Standards & Compliance (NUEVO)
    requiresRegulatoryCompliance: false,
    complianceStandards: [],
    hasStandardizedProcedures: false,
    standardsDocumentation: '',
    
    // Step 8: Availability Requirements (REQUIRED)
    weeklyHoursPerMember: 40,
    requiresAfterHoursAvailability: 'no',
    highLoadPeriods: [],
    
    // Step 9: Coordination & Methodology (REQUIRED)
    managementMethod: 'scrum',
    followUpFrequency: {
      standups: { frequency: 'daily' },
      reviews: { frequency: 'weekly' },
      retrospectives: { frequency: 'biweekly' }
    },
    communicationTools: [],
    taskManagementTools: [],
    documentationStandardization: 'medium',
    informationFlow: 'bidirectional',
    
    // Step 10: Collaboration Intensity (OPTIONAL)
    involvedTeams: [],
    criticalExchanges: [],
    
    // Step 11: Organizational Maturity (OPTIONAL)
    hasOnboardingProcesses: 'partial',
    hasVersionControlAndCICD: 'partial',
    internalToolsFragmentation: 'medium'
  };
}
```

**c) Actualizar el renderizado de steps:**
```javascript
// En la función que renderiza los steps (buscar el switch o el array de componentes)
const renderStep = () => {
  switch (currentStep) {
    case 1:
      return <Step1GeneralInfo formData={formData} onChange={handleChange} errors={errors} />;
    case 2:
      return <Step2Collaboration formData={formData} onChange={handleChange} errors={errors} />;
    case 3:
      return <Step3Technical formData={formData} onChange={handleChange} errors={errors} />;
    case 4:
      return <Step4WorkModel formData={formData} onChange={handleChange} errors={errors} />;
    case 5:
      return <Step5Roles formData={formData} onChange={handleChange} errors={errors} />;
    case 6:
      return <Step6KnowledgeManagement formData={formData} onChange={handleChange} errors={errors} />;
    case 7:
      return <Step7StandardsCompliance formData={formData} onChange={handleChange} errors={errors} />;
    case 8:
      return <Step6Availability formData={formData} onChange={handleChange} errors={errors} />; // Renombrado
    case 9:
      return <Step7Coordination formData={formData} onChange={handleChange} errors={errors} />; // Renombrado
    case 10:
      return <Step8CollaborationIntensity formData={formData} onChange={handleChange} errors={errors} />; // Renombrado
    case 11:
      return <Step9Maturity formData={formData} onChange={handleChange} errors={errors} />; // Renombrado
    default:
      return <Step1GeneralInfo formData={formData} onChange={handleChange} errors={errors} />;
  }
};
```

---

### 2. Actualizar ProjectDetailPage.jsx

**Ubicación:** `src/pages/ProjectDetailPage.jsx`

#### Cambios necesarios:

**a) Importar componentes:**
```javascript
import DynamicTeamBuilder from '../components/projects/DynamicTeamBuilder';
import { suggestTeam, assignEmployeesToProject } from '../api/projects';
```

**b) Añadir estado para el Dynamic Team Builder:**
```javascript
const [showTeamBuilder, setShowTeamBuilder] = useState(false);
```

**c) Añadir función para manejar asignación:**
```javascript
const handleAssignTeam = async (selectedEmployeeIds) => {
  try {
    setLoading(true);
    
    // Asignar empleados
    await assignEmployeesToProject(project._id, {
      employeeIds: selectedEmployeeIds
    });
    
    // Re-ejecutar predicción de riesgos con el equipo completo
    await predictRisks(project._id, project);
    
    // Recargar proyecto
    await loadProject();
    
    setShowTeamBuilder(false);
    alert('Team assigned successfully!');
    
  } catch (error) {
    console.error('Error assigning team:', error);
    alert(error.response?.data?.error || 'Error assigning team');
  } finally {
    setLoading(false);
  }
};
```

**d) Actualizar la sección del Tab "Team":**
```javascript
{activeTab === 'team' && (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">
        Team Members ({project.assignedEmployees?.length || 0})
      </Typography>
      <Box display="flex" gap={1}>
        {canEdit && (
          <>
            <PrimaryButton 
              onClick={() => setShowTeamBuilder(true)}
              startIcon={<span>🤖</span>}
            >
              Smart Team Builder
            </PrimaryButton>
            <SecondaryButton 
              onClick={() => setShowAssignModal(true)}
              startIcon={<span>+</span>}
            >
              Manual Assign
            </SecondaryButton>
          </>
        )}
      </Box>
    </Box>
    
    {/* Resto del contenido del tab Team */}
  </Box>
)}

{/* Modal de Dynamic Team Builder */}
{showTeamBuilder && (
  <DynamicTeamBuilder
    project={project}
    organizationId={project.organization}
    onAssignTeam={handleAssignTeam}
    onClose={() => setShowTeamBuilder(false)}
  />
)}
```

---

### 3. Mejorar RiskPredictionDashboard.jsx

**Ubicación:** `src/components/projects/RiskPredictionDashboard.jsx`

#### Cambios necesarios:

**a) Actualizar para mostrar nuevos campos de riesgos:**
```javascript
// Añadir sección para Predicted Impact
{risk.predictedImpact && (
  <div style={styles.impactSection}>
    <h4>Predicted Impact:</h4>
    <ul>
      <li>📅 Schedule Delay: {risk.predictedImpact.scheduleDelay.min}-{risk.predictedImpact.scheduleDelay.max}%</li>
      <li>💰 Budget Overrun: {risk.predictedImpact.budgetOverrun.min}-{risk.predictedImpact.budgetOverrun.max}%</li>
      <li>⚙️ Quality Impact: {risk.predictedImpact.qualityImpact}</li>
      <li>👥 Team Morale: {risk.predictedImpact.teamMoraleImpact}</li>
    </ul>
  </div>
)}

// Añadir sección para Early Warning Signals
{risk.earlyWarningSignals && risk.earlyWarningSignals.length > 0 && (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>🚨 Early Warning Signals</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Threshold</th>
            <th>Check Frequency</th>
          </tr>
        </thead>
        <tbody>
          {risk.earlyWarningSignals.map((signal, i) => (
            <tr key={i}>
              <td>{signal.signal}</td>
              <td>{signal.threshold}</td>
              <td>{signal.checkFrequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AccordionDetails>
  </Accordion>
)}
```

**b) Añadir formato para los nuevos tipos de riesgos:**
```javascript
const formatRiskType = (type) => {
  const riskTitles = {
    'communication_breakdown': '💬 Communication Breakdown',
    'skill_gap': '🎯 Skill Gap',
    'team_overload': '⚡ Team Overload',
    'dependency_blockage': '🔗 Dependency Blockage',
    'scope_creep': '📈 Scope Creep',
    'process_mismatch': '⚙️ Process Mismatch',
    'technical_infrastructure': '🖥️ Technical Infrastructure Issues',
    'quality_degradation': '📉 Quality Degradation',
    'knowledge_management_gap': '📚 Knowledge Management Gap', // NUEVO
    'remote_work_support_gap': '🌐 Remote Work Support Gap', // NUEVO
    'role_clarity_gap': '👤 Role Clarity Gap', // NUEVO
    'standards_compliance_gap': '📋 Standards Compliance Gap', // NUEVO
    'timezone_scheduling_gap': '🕐 Timezone Scheduling Gap' // NUEVO
  };
  
  return riskTitles[type] || type.split('_').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
};
```

---

### 4. Actualizar useRiskPrediction.js

**Ubicación:** `src/hooks/useRiskPrediction.js`

#### Cambios necesarios:

**a) Actualizar checkProjectReadiness para incluir nuevos campos:**
```javascript
const checkProjectReadiness = (project) => {
  const warnings = [];

  // Critical technical requirements
  if (!project.mainTechnologies?.length) {
    warnings.push('⚠️ Missing required technologies configuration');
  }

  if (!project.requiredExperienceLevel) {
    warnings.push('⚠️ Missing required experience level configuration');
  }

  if (!project.systemComplexity) {
    warnings.push('⚠️ Missing system complexity configuration');
  }

  // Critical communication requirements
  if (!project.requiredLanguages?.length) {
    warnings.push('⚠️ Missing required languages configuration');
  }

  if (!project.teamRegions?.length) {
    warnings.push('⚠️ Missing team regions configuration');
  }

  // Basic project information
  if (!project.estimatedStartDate || !project.estimatedEndDate) {
    warnings.push('⚠️ Missing project start or end dates');
  }

  if (!project.expectedDuration?.value) {
    warnings.push('⚠️ Missing expected project duration');
  }
  
  // NUEVOS CHECKS
  if (!project.workModel?.type) {
    warnings.push('⚠️ Missing work model configuration');
  }
  
  if (project.workModel?.type === 'remote' && !project.hasTimezoneSchedulingPolicy) {
    warnings.push('⚠️ Remote project without timezone scheduling policy');
  }
  
  if (!project.hasKnowledgeManagementTools) {
    warnings.push('⚠️ No knowledge management tools configured');
  }

  return {
    ready: warnings.length === 0,
    warnings,
    message: warnings.length > 0 
      ? 'Complete missing data before predicting risks'
      : 'Project ready for risk analysis'
  };
};
```

---

### 5. Actualizar Step2Collaboration.jsx

**Ubicación:** `src/components/projects/Step2Collaboration.jsx`

#### Añadir campo asyncCommunicationStrategy:

```javascript
<div style={styles.formGroup}>
  <label style={styles.label}>
    Async Communication Strategy
    <span style={styles.hint}> (optional)</span>
  </label>
  <textarea
    value={formData.asyncCommunicationStrategy || ''}
    onChange={(e) => onChange({ asyncCommunicationStrategy: e.target.value })}
    placeholder="Describe how async communication will be managed (max 1000 chars)..."
    maxLength="1000"
    rows="4"
    style={styles.textarea}
  />
  <small style={styles.helpText}>
    {(formData.asyncCommunicationStrategy || '').length}/1000 characters
  </small>
</div>
```

---

### 6. Completar Step5Roles.jsx

**Ubicación:** `src/components/projects/Step5Roles.jsx`

El archivo ya tiene las importaciones correctas. Solo falta actualizar la sección de roles para usar `rolesAndResponsibilities` en lugar de `keyRoles`, y añadir el campo `clarityScore`:

```javascript
// Cambiar keyRoles por rolesAndResponsibilities
const handleRoleChange = (index, field, value) => {
  const newRoles = [...(formData.rolesAndResponsibilities || [])];
  newRoles[index] = { ...newRoles[index], [field]: value };
  onChange({ rolesAndResponsibilities: newRoles });
};

const addRole = () => {
  const newRoles = [...(formData.rolesAndResponsibilities || []), { 
    roleName: '', 
    responsibilities: [], 
    assignedTo: null,
    clarityScore: 3 
  }];
  onChange({ rolesAndResponsibilities: newRoles });
};
```

---

## 🔄 FLUJO COMPLETO DE USO

### 1. Crear Proyecto
- Usuario completa formulario de 11 steps
- Click en "Create Project" → Status: DRAFT

### 2. Vista del Proyecto
- Navegar a Project Detail Page
- Ver tabs: Overview, Team, Risks, Timeline

### 3. Predicción Inicial (Opcional)
- Tab "Risks" → Click "Predict Risks"
- Ver dashboard con riesgos sin equipo

### 4. Selección de Equipo (CON Dynamic Team Builder)
- Tab "Team" → Click "Smart Team Builder"
- Se abre modal split:
  - Izquierda: Lista de empleados recomendados
  - Derecha: Riesgos predichos en tiempo real
- Seleccionar empleados → Ver cómo cambian los riesgos
- Click "Assign Selected Team"

### 5. Activar Proyecto
- Click "Activate Project" → Status: ACTIVE

### 6. Monitoreo
- Ver riesgos actualizados
- Gestionar equipo
- Actualizar estado de riesgos

### 7. Completar
- Click "Complete Project" → Status: COMPLETED
- Capturar Project Outcome

---

## 🎨 ESTILOS Y UX

### Colores de Severidad (ya definidos)
```javascript
RISK_SEVERITY_COLORS = {
  low: { bg: '#D1FAE5', text: '#10B981' },
  medium: { bg: '#FEF3C7', text: '#F59E0B' },
  'medium-high': { bg: '#FFEDD5', text: '#F97316' },
  high: { bg: '#FFEDD5', text: '#F97316' },
  critical: { bg: '#FEE2E2', text: '#EF4444' }
}
```

### Iconos Recomendados
- 💬 Communication
- 🎯 Skills
- ⚡ Overload
- 🔗 Dependencies
- 📈 Scope
- ⚙️ Process
- 🖥️ Technical
- 📉 Quality
- 📚 Knowledge Management
- 🌐 Remote Work
- 👤 Role Clarity
- 📋 Compliance
- 🕐 Timezone

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] 1. Actualizar types/projectTypes.js
- [x] 2. Crear Step4WorkModel.jsx
- [x] 3. Crear Step6KnowledgeManagement.jsx
- [x] 4. Crear Step7StandardsCompliance.jsx
- [x] 5. Actualizar api/projects.js
- [x] 6. Crear DynamicTeamBuilder.jsx
- [ ] 7. Actualizar ProjectFormPage.jsx (getInitialFormData + renderStep)
- [ ] 8. Completar Step5Roles.jsx
- [ ] 9. Actualizar Step2Collaboration.jsx (añadir asyncCommunicationStrategy)
- [ ] 10. Actualizar ProjectDetailPage.jsx (integrar DynamicTeamBuilder)
- [ ] 11. Mejorar RiskPredictionDashboard.jsx (nuevos campos)
- [ ] 12. Actualizar useRiskPrediction.js (nuevos checks)
- [ ] 13. Renombrar componentes Step6-9 → Step8-11
- [ ] 14. Probar flujo completo

---

## 🚨 NOTAS IMPORTANTES

1. **Backend debe estar actualizado** con los 5 nuevos detectores de riesgos
2. **Los endpoints deben existir** en el backend:
   - `POST /api/projects/:id/risks/preview`
   - `POST /api/projects/suggest-team`
   - `PUT /api/projects/:id/assign-employees`
   - `GET /api/projects/:id/team-analysis`

3. **Validaciones del formulario:** Asegúrate de que Step 4, 6 y 7 validen correctamente los campos requeridos

4. **Performance:** El debounce de 500ms en DynamicTeamBuilder es crítico para no saturar el backend

5. **Estado del proyecto:** El flujo DRAFT → ACTIVE → COMPLETED debe respetarse

---

## 📚 RECURSOS ADICIONALES

- Documentación de riesgos: Ver backend/docs/risk-detection.md
- Algoritmo de selección de equipo: Distancia Manhattan con pesos ajustables
- Case-Based Reasoning: Se entrena con ProjectOutcome de proyectos completados

---

✨ **Con estos cambios tendrás un sistema completo de gestión de proyectos con predicción de riesgos en tiempo real y selección inteligente de equipo!**

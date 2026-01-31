# Risk Monitoring & Project Outcome - Quick Reference

## 📋 OVERVIEW

Este documento describe los endpoints y flujos completos para:
1. **Monitorear riesgos** durante la ejecución del proyecto
2. **Marcar riesgos como ocurridos**
3. **Capturar el resultado final** del proyecto
4. **Permitir que el sistema aprenda** (crear case en CBR)

---

## 🔄 WORKFLOW COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: CREACIÓN Y PREDICCIÓN                               │
├─────────────────────────────────────────────────────────────┤
│ 1. PM crea proyecto                                          │
│ 2. POST /api/projects/:id/risks/predict                     │
│    └─ DT detecta riesgos + CBR aprende de casos similares   │
│    └─ Se guardan en Risk collection                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FASE 2: MONITOREO (Durante ejecución - Semanas 1-N)        │
├─────────────────────────────────────────────────────────────┤
│ PM monitorea riesgos predichos:                             │
│                                                              │
│ • GET /api/projects/:id/risks                               │
│   └─ Ver todos los riesgos predichos                        │
│                                                              │
│ • GET /api/projects/:id/risks?occurred=false                │
│   └─ Ver riesgos que aún no ocurrieron                      │
│                                                              │
│ Cuando un riesgo ocurre:                                    │
│                                                              │
│ A. Para riesgos PREDICHOS (DT/CBR):                        │
│    PATCH /api/risks/:riskId/mark-occurred                   │
│    Body: {                                                   │
│      occurred: true,                                         │
│      detectedAt: "2025-01-20T14:30:00Z",                    │
│      actualSeverity: "high",                                │
│      actualImpact: {                                        │
│        scheduleDelayDays: 3,                                │
│        budgetOverrunPercent: 5,                             │
│        qualityScore: 0.75,                                  │
│        description: "..."                                    │
│      },                                                      │
│      rootCause: "...",                                      │
│      mitigatedAt: "..." (opcional)                          │
│    }                                                         │
│                                                              │
│ B. Para riesgos MANUALES (agregados por PM):               │
│    PUT /api/projects/:id/risks/:riskId                      │
│    Body: {                                                   │
│      occurred: true,                                         │
│      actualSeverity: "high",                                │
│      detectedAt: "...",                                     │
│      actualImpact: {...}                                    │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FASE 3: CIERRE (Fin de proyecto)                            │
├─────────────────────────────────────────────────────────────┤
│ STEP 1: Marcar proyecto como completado                     │
│ ────────────────────────────────────────────────────────────│
│ PATCH /api/projects/:id/complete                            │
│ Body: {} (vacío)                                             │
│                                                              │
│ Response: {                                                  │
│   status: "completed",                                       │
│   completedAt: "2025-01-30T17:00:00Z"                       │
│ }                                                            │
│                                                              │
│ STEP 2: Capturar resultado (crea CASE en CBR) ✨            │
│ ────────────────────────────────────────────────────────────│
│ POST /api/projects/:id/outcome                              │
│ Body: {                                                      │
│   completed: true,                                           │
│   actualCompletedDate: "2025-01-30",                        │
│   actualHours: 320,                                          │
│   budgetOverrun: 2500,                                       │
│   qualityScore: 0.82,                                        │
│   clientSatisfaction: 4.5,                                   │
│   teamMorale: 4.0,                                           │
│                                                              │
│   actualizedRisks: [  ⚠️ CRUCIAL                            │
│     {                                                        │
│       type: "communication_breakdown",                       │
│       occurred: true,                                        │
│       severity: "high",                                      │
│       scheduleDelayDays: 3,                                  │
│       budgetOverrunPercent: 5,                               │
│       description: "..."                                     │
│     },                                                       │
│     {                                                        │
│       type: "skill_gap",                                     │
│       occurred: false  // ⚠️ Predicho pero NO ocurrió       │
│     }                                                        │
│   ],                                                         │
│                                                              │
│   lessonsLearned: ["..."],                                  │
│   successfulPractices: ["..."],                             │
│   unsuccessfulPractices: ["..."],                           │
│   recommendations: ["..."],                                  │
│   metrics: {...}                                             │
│ }                                                            │
│                                                              │
│ Response: {                                                  │
│   project: {...},                                            │
│   case: {                                                    │
│     id: "case_12345",                                        │
│     addedToKnowledgeBase: true  ✅                          │
│   },                                                         │
│   predictionAccuracy: {                                      │
│     correctPredictions: 8,                                   │
│     missedRisks: 1,                                          │
│     falsePositives: 2,                                       │
│     accuracy: 0.73                                           │
│   },                                                         │
│   learningReport: {...}                                      │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FASE 4: APRENDIZAJE (Próximos proyectos similares)         │
├─────────────────────────────────────────────────────────────┤
│ • Sistema tiene nuevo CASE en knowledge base                │
│ • Próximas predicciones más precisas                        │
│ • CBR similarity = 0.85 → Probabilidad = 0.85              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 ENDPOINTS SUMMARY

### 📊 Monitoring Phase

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/projects/:id/risks` | Get all predicted risks | ✅ |
| `GET` | `/api/projects/:id/risks?occurred=true` | Get occurred risks | ✅ |
| `GET` | `/api/projects/:id/risks?status=predicted&occurred=false` | Get risks not occurred yet | ✅ |
| `PATCH` | `/api/risks/:id/mark-occurred` | Mark predicted risk as occurred | ✅ |
| `PUT` | `/api/projects/:id/risks/:riskId` | Update manual risk | ✅ |

### ✅ Completion Phase

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `PATCH` | `/api/projects/:id/complete` | Mark project as completed | ✅ |
| `POST` | `/api/projects/:id/outcome` | Submit outcome (creates CBR case) | ✅ |
| `GET` | `/api/projects/:id/outcome/form` | Get pre-filled outcome form | ✅ |

---

## 📝 REQUEST BODY STRUCTURES

### 1. Mark Risk as Occurred

```typescript
PATCH /api/risks/:riskId/mark-occurred

Body: {
  occurred: boolean;              // true
  detectedAt: string;            // ISO8601 date
  actualSeverity: string;        // "low" | "medium" | "high" | "critical"
  actualImpact: {
    scheduleDelayDays: number;
    budgetOverrunPercent: number;
    qualityScore: number;        // 0-1
    description: string;
  };
  rootCause: string;
  mitigatedAt?: string;          // ISO8601 date (optional)
}
```

### 2. Submit Project Outcome (CRUCIAL)

```typescript
POST /api/projects/:projectId/outcome

Body: {
  completed: boolean;
  actualCompletedDate: string;   // "YYYY-MM-DD"
  actualHours: number;
  budgetOverrun: number;
  qualityScore: number;          // 0-1
  clientSatisfaction: number;    // 1-5
  teamMorale: number;            // 1-5
  
  // ⚠️ CRITICAL: List ALL risks (occurred AND not occurred)
  actualizedRisks: [
    {
      type: string;
      occurred: boolean;         // true or false
      severity?: string;         // if occurred
      scheduleDelayDays?: number;
      budgetOverrunPercent?: number;
      description?: string;
    }
  ];
  
  lessonsLearned: string[];
  successfulPractices: string[];
  unsuccessfulPractices: string[];
  recommendations: string[];
  
  metrics: {
    [key: string]: any;
  };
}
```

---

## 🎯 RISK STATES

### During Monitoring

| State | `occurred` | `mitigatedAt` | Meaning |
|-------|-----------|---------------|---------|
| `predicted` | `null` | - | Predicted, monitoring |
| `occurred` | `true` | `null` | Occurred, not mitigated |
| `mitigated` | `true` | Date | Occurred and mitigated |
| `closed` | `true`/`false` | Date | Project finished |

### In actualizedRisks

```javascript
// Risk that occurred
{
  type: "communication_breakdown",
  occurred: true,
  severity: "high",
  scheduleDelayDays: 3,
  description: "..."
}

// Risk predicted but did NOT occur
{
  type: "skill_gap",
  occurred: false  // ⚠️ IMPORTANT: Include this too!
}

// Risk not predicted but occurred (new discovery)
{
  type: "unexpected_issue",
  occurred: true,
  severity: "medium",
  description: "Issue not predicted by system"
}
```

---

## ⚠️ IMPORTANT NOTES

### Order Matters

```javascript
// ❌ WRONG - Will fail
await submitProjectOutcome(projectId, outcomeData);
await completeProject(projectId);

// ✅ CORRECT
await completeProject(projectId);        // Step 1
await submitProjectOutcome(projectId, outcomeData);  // Step 2
```

### actualizedRisks is Learning Data

`actualizedRisks` es el corazón del sistema CBR. Debe incluir:

- ✅ Riesgos predichos que ocurrieron
- ✅ Riesgos predichos que NO ocurrieron (`occurred: false`)
- ✅ Riesgos NO predichos que ocurrieron (nuevos)

**¿Por qué?** El sistema necesita saber:
- Qué predicciones fueron correctas
- Qué predicciones fueron falsas alarmas
- Qué riesgos se perdieron

### Case Creation is Automatic

No necesitas llamar endpoints de CBR manualmente. Cuando se ejecuta `POST /outcome`, el backend:
1. Actualiza riesgos reales
2. Crea CASE en CaseBase automáticamente
3. Retorna `case.addedToKnowledgeBase = true`

---

## 🔍 FRONTEND IMPLEMENTATION

### API Service (src/api/riskService.js)

```javascript
import { 
  markRiskAsOccurred,
  getProjectRisksFiltered,
  getOutcomeFormData
} from '@/api/riskService';

import {
  completeProject,
  submitProjectOutcome
} from '@/api/manualRisks';
```

### Usage Examples

#### 1. Get risks not occurred yet

```javascript
const response = await getProjectRisksFiltered(projectId, {
  status: 'predicted',
  occurred: false
});

const monitoringRisks = response.data.risks;
```

#### 2. Mark risk as occurred

```javascript
await markRiskAsOccurred(riskId, {
  occurred: true,
  detectedAt: new Date().toISOString(),
  actualSeverity: 'high',
  actualImpact: {
    scheduleDelayDays: 3,
    budgetOverrunPercent: 5,
    qualityScore: 0.75,
    description: 'Team communication breakdown'
  },
  rootCause: 'PM was unavailable'
});
```

#### 3. Complete project and submit outcome

```javascript
// Step 1: Mark as completed
await completeProject(projectId);

// Step 2: Submit outcome with actualized risks
const outcomeData = {
  completed: true,
  actualCompletedDate: '2025-01-30',
  actualHours: 320,
  budgetOverrun: 2500,
  qualityScore: 0.82,
  clientSatisfaction: 4.5,
  teamMorale: 4.0,
  
  actualizedRisks: [
    {
      type: 'communication_breakdown',
      occurred: true,
      severity: 'high',
      scheduleDelayDays: 3,
      budgetOverrunPercent: 5,
      description: 'Team miscommunication'
    },
    {
      type: 'skill_gap',
      occurred: false  // Predicted but did NOT occur
    }
  ],
  
  lessonsLearned: ['Daily standups are crucial'],
  successfulPractices: ['Code review system worked well'],
  unsuccessfulPractices: ['Slack-only communication failed'],
  recommendations: ['Use video calls for standups'],
  
  metrics: {
    velocityAvg: 45,
    defectRate: 0.02
  }
};

const response = await submitProjectOutcome(projectId, outcomeData);

// Check CBR learning
if (response.data.case?.addedToKnowledgeBase) {
  console.log('✅ System learned from this project!');
  console.log('Accuracy:', response.data.predictionAccuracy);
}
```

#### 4. Get pre-filled outcome form

```javascript
const formData = await getOutcomeFormData(projectId);

// Use predictedRisks to pre-fill actualizedRisks
const actualizedRisks = formData.data.predictedRisks.map(risk => ({
  type: risk.type,
  occurred: null,  // Let PM decide
  predictedSeverity: risk.predictedSeverity,
  predictedProbability: risk.predictedProbability
}));
```

---

## 🧪 TESTING CHECKLIST

- [ ] `GET /projects/:id/risks` returns predicted risks
- [ ] `PATCH /risks/:id/mark-occurred` changes `occurred` to `true`
- [ ] `PUT /projects/:id/risks/:riskId` updates manual risk
- [ ] `PATCH /projects/:id/complete` marks status as "completed"
- [ ] `POST /projects/:id/outcome` creates case in CaseBase
- [ ] Response includes `case.addedToKnowledgeBase = true`
- [ ] Next similar project has improved probabilities
- [ ] Accuracy metrics calculated correctly
- [ ] Validation: Cannot submit outcome if status !== "completed"
- [ ] Validation: `actualizedRisks` must include all risks

---

## 🚨 COMMON ERRORS

### "Project must be marked as completed first"

**Solution**: Call `PATCH /complete` before `POST /outcome`

```javascript
// ✅ Correct order
await completeProject(projectId);
await submitProjectOutcome(projectId, data);
```

### "Risk not found"

**Solution**: Verify `riskId` is valid. Predicted risks have different `_id` than manual risks.

### "Not authorized"

**Solution**: 
- Only PM of project can mark risks as occurred
- Only PM or org_admin can submit outcome

### "Project is already completed"

**Solution**: Cannot modify project after outcome submitted. Create new project for new prediction.

---

## 📚 TYPE DEFINITIONS

See [src/types/riskTypes.js](src/types/riskTypes.js) for complete type definitions including:

- `RISK_STATUS`: predicted | occurred | mitigated | closed
- `RISK_SEVERITY`: low | medium | high | critical
- `RISK_SOURCE`: dt | cbr | manual
- `RiskOccurrenceData`: Type for marking risk as occurred
- `ActualizedRisk`: Type for actualized risks in outcome
- `ProjectOutcome`: Complete outcome data structure

---

## 🔗 RELATED FILES

- **API Services**:
  - [src/api/riskService.js](src/api/riskService.js) - Risk prediction & monitoring
  - [src/api/manualRisks.js](src/api/manualRisks.js) - Manual risks & outcomes
  - [src/api/projects.js](src/api/projects.js) - Project management

- **Types**:
  - [src/types/riskTypes.js](src/types/riskTypes.js) - Risk types & constants

- **Hooks**:
  - [src/hooks/useRiskPrediction.js](src/hooks/useRiskPrediction.js) - Risk prediction hook
  - [src/hooks/useManualRisks.js](src/hooks/useManualRisks.js) - Manual risks hook
  - [src/hooks/useProjectDetail.js](src/hooks/useProjectDetail.js) - Project detail hook

---

## 💡 KEY CONCEPTS

### occurred: true vs occurred: false

- `true`: Risk materialized during project
- `false`: Risk was predicted but did NOT occur
- `null`: Still monitoring (not decided yet)

### actualizedRisks in outcome

**CRITICAL**: Must include:
- ✅ Risks predicted AND occurred
- ✅ Risks predicted but NOT occurred (`occurred: false`)
- ✅ Risks NOT predicted but occurred (new discoveries)

This is how the system learns!

### CaseBase Learning

When outcome is captured:
1. System creates CASE with project characteristics
2. Associates with actual risks that occurred
3. Calculates similarity vs other projects
4. Future similar projects get better probabilities

**Example**: If 85% of similar projects had "communication_breakdown", next similar project will show probability = 0.85 (well-founded!)

---

**Last Updated**: January 2026  
**Version**: 1.0.0

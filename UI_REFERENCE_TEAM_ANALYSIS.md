# Referencia Visual: Interfaz de Team Analysis

## 🖥️ Layout General

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Projects                                             │
│                                                                   │
│  Mi Nuevo Proyecto                               [DRAFT]         │
│                                                                   │
│                           [Activate Project]  [Edit]  [Delete]   │
├─────────────────────────────────────────────────────────────────┤
│  [Overview]  [💡 Team Analysis*]  [Team (0)]  [Details]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────┬───────────────────────────────┐  │
│  │   PANEL IZQUIERDO         │   PANEL DERECHO               │  │
│  │   (Equipo)                │   (Riesgos)                   │  │
│  └───────────────────────────┴───────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

* Tab activo por defecto en Draft
```

---

## 📋 Panel Izquierdo: Gestión de Equipo

### Cuando NO hay equipo asignado:

```
┌─────────────────────────────────────┐
│ 👥 Team Selection (0/5)             │
├─────────────────────────────────────┤
│                                     │
│ Optimal Team Candidates             │
│ Based on project requirements       │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ #1                 [85%]    │    │
│ │ Ana García                  │    │
│ │ ana.garcia@example.com      │    │
│ │ Match: 85%  Score: 2.5      │    │
│ │ ✅ Skills: React, Node.js   │    │
│ │ ⚠️ Missing: MongoDB         │    │
│ │                             │    │
│ │  [Assign to Project]        │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ #2                 [78%]    │    │
│ │ Carlos López                │    │
│ │ carlos.lopez@example.com    │    │
│ │ Match: 78%  Score: 3.2      │    │
│ │ ✅ Skills: Python, Docker   │    │
│ │                             │    │
│ │  [Assign to Project]        │    │
│ └─────────────────────────────┘    │
│                                     │
│ ... 3 more candidates               │
│                                     │
│  [Show All (8 employees)]           │
│                                     │
└─────────────────────────────────────┘
```

### Cuando SÍ hay equipo asignado:

```
┌─────────────────────────────────────┐
│ 👥 Current Team Analysis            │
│ 2 members assigned                  │
├─────────────────────────────────────┤
│                                     │
│ Assigned Team                       │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Ana García                  │    │
│ │ ana.garcia@example.com      │    │
│ │ Developer                   │    │
│ │ Match: 85%  Score: 2.5      │    │
│ │                    [Remove] │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Carlos López                │    │
│ │ carlos.lopez@example.com    │    │
│ │ Backend Developer           │    │
│ │ Match: 78%  Score: 3.2      │    │
│ │                    [Remove] │    │
│ └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│ Available Employees                 │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ María Rodríguez      [72%] │    │
│ │ maria.r@example.com         │    │
│ │ React, TypeScript, Jest     │    │
│ │                    [Assign] │    │
│ └─────────────────────────────┘    │
│                                     │
│ ... 6 more available                │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚠️ Panel Derecho: Análisis de Riesgos

```
┌─────────────────────────────────────┐
│ ⚠️ Risk Analysis (3 risks)  ⟳      │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐    │
│ │   Overall Risk: MEDIUM      │    │
│ │       (Background: 🟡)      │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌───────────┬─────────────────┐    │
│ │Confidence │  Total Risks    │    │
│ │   75%     │       3         │    │
│ └───────────┴─────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ [HIGH] Timeline Delay    ▶ │    │ ← Collapsed
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ [MEDIUM] Budget Overrun  ▼ │    │ ← Expanded
│ ├─────────────────────────────┤    │
│ │ The project has high risk   │    │
│ │ of exceeding the budget...  │    │
│ │                             │    │
│ │ Probability: 55%            │    │
│ │ Confidence: 78%             │    │
│ │                             │    │
│ │ 💡 Recommendations:         │    │
│ │ • Add buffer of 15-20%      │    │
│ │ • Review weekly expenses    │    │
│ │ • Consider fixed contracts  │    │
│ │                             │    │
│ │ 📋 Reasoning:               │    │
│ │ • Team lacks experience     │    │
│ │ • Similar projects failed   │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ [LOW] Technical Debt     ▶ │    │
│ └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Colores y Estados

### Risk Severity Colors
```
CRITICAL   → 🔴 #dc3545 (Red)
HIGH       → 🟠 #fd7e14 (Orange)
MEDIUM     → 🟡 #ffc107 (Yellow)
LOW        → 🟢 #28a745 (Green)
```

### Overall Risk Badge
```
Critical → Red background, white text
High     → Orange background, white text
Medium   → Yellow background, dark text
Low      → Green background, white text
```

### Match Badge Colors
```
90-100%  → 🟢 Green (#28a745)
75-89%   → 🟡 Yellow (#ffc107)
60-74%   → 🟠 Orange (#fd7e14)
< 60%    → 🔴 Red (#dc3545)
```

---

## 🔄 Estados de Carga

### Loading State (inicial)
```
┌─────────────────────────────────────┐
│                                     │
│         ⟳ (spinning)                │
│    Loading team analysis...         │
│                                     │
└─────────────────────────────────────┘
```

### Loading State (riesgos recalculando)
```
┌─────────────────────────────────────┐
│ ⚠️ Risk Analysis (3 risks)  ⟳      │ ← Mini spinner
├─────────────────────────────────────┤
│ (contenido visible pero updating)   │
└─────────────────────────────────────┘
```

### Empty State (sin empleados seleccionados)
```
┌─────────────────────────────────────┐
│ ⚠️ Risk Analysis (0 risks)          │
├─────────────────────────────────────┤
│                                     │
│            📊                       │
│   Assign employees to see           │
│      risk analysis                  │
│                                     │
└─────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│                                     │
│            ⚠️                       │
│   Error loading team analysis       │
│                                     │
│         [Retry]                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (> 1200px)
- Two panels side by side (50/50 split)
- Full card details visible
- All metrics shown

### Tablet (768px - 1200px)
- Two panels side by side (narrower)
- Compact card layout
- Essential metrics only

### Mobile (< 768px)
- Panels stack vertically
- Team panel on top
- Risks panel below
- Touch-friendly buttons

---

## 🎯 Interacciones

### Click en Empleado Recomendado
```
Estado Inicial: [Assign to Project]
     ↓ Click
Loading: [Assigning...]
     ↓ Success
Movido a: Assigned Team
     ↓ Auto
Riesgos: Recalculando...
     ↓ Complete
Riesgos: Actualizados
```

### Click en Riesgo
```
Collapsed: [HIGH] Timeline Delay  ▶
     ↓ Click
Expanded: [HIGH] Timeline Delay  ▼
          ├─ Description
          ├─ Metrics
          ├─ Recommendations
          └─ Reasoning
     ↓ Click again
Collapsed: [HIGH] Timeline Delay  ▶
```

### Hover Effects
- Empleado recomendado: Light shadow + border
- Botón Assign/Remove: Darker background
- Riesgo: Subtle background change

---

## ✨ Animaciones

### Spinner Rotation
```css
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Transitions
- Card hover: 0.2s ease
- Risk expand/collapse: 0.3s ease
- Button hover: 0.15s ease

---

## 📐 Dimensiones

```
Container:
- Max width: 100%
- Padding: 20px
- Border radius: 8px

Panels:
- Split: 50% / 50%
- Gap: 20px
- Max height: 600px (scrollable)
- Background: #f8f9fa

Cards:
- Padding: 12px
- Border: 1px solid #dee2e6
- Border radius: 8px
- Gap between cards: 12px

Badges:
- Padding: 2px-8px (small) to 12px (large)
- Border radius: 4px
- Font size: 10px-16px
```

---

## 🎪 Demo Flow Visual

```
1. DRAFT PROJECT CREATED
        ↓
   ┌─────────┐
   │ Project │ → Status: Draft
   └─────────┘
        ↓
2. OPEN PROJECT
        ↓
   ┌──────────────────────┐
   │ 💡 Team Analysis Tab │ ← Opens automatically
   └──────────────────────┘
        ↓
3. VIEW RECOMMENDATIONS
        ↓
   ┌─────────┐  ┌──────────┐
   │ Team    │  │ Risks    │
   │ (Empty) │  │ (Initial)│
   └─────────┘  └──────────┘
        ↓
4. ASSIGN EMPLOYEE #1
        ↓
   ┌─────────┐  ┌──────────┐
   │ Team    │  │ Risks    │
   │ (1)     │  │ (Update) │ ← Recalculated
   └─────────┘  └──────────┘
        ↓
5. ASSIGN EMPLOYEE #2
        ↓
   ┌─────────┐  ┌──────────┐
   │ Team    │  │ Risks    │
   │ (2)     │  │ (Update) │ ← Recalculated
   └─────────┘  └──────────┘
        ↓
6. REMOVE EMPLOYEE #1
        ↓
   ┌─────────┐  ┌──────────┐
   │ Team    │  │ Risks    │
   │ (1)     │  │ (Update) │ ← Recalculated
   └─────────┘  └──────────┘
        ↓
7. SATISFIED WITH TEAM
        ↓
   [Activate Project] ← Click
        ↓
8. PROJECT NOW ACTIVE
   (Team Analysis tab disappears)
```

---

## 📊 Ejemplo Real de Datos

### Empleado Recomendado
```json
{
  "userId": "user_123",
  "user": {
    "name": "Ana García",
    "email": "ana.garcia@example.com"
  },
  "matchPercentage": 85,
  "score": 2.5,
  "matchedSkills": ["React", "Node.js", "TypeScript"],
  "missingSkills": ["MongoDB"]
}
```

### Riesgo Detectado
```json
{
  "type": "timeline_delay",
  "title": "Timeline Delay Risk",
  "description": "High probability of missing deadlines...",
  "severity": "high",
  "probability": 0.65,
  "confidence": 0.78,
  "recommendations": [
    "Add 2-3 more developers",
    "Use agile sprints"
  ],
  "reasoning": [
    "Team size below optimal",
    "Complex requirements"
  ]
}
```

---

Esta referencia visual te ayudará a entender cómo se ve y funciona la interfaz implementada.

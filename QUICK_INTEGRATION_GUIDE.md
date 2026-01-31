# 🔗 Guía de Integración - Arquitectura 3 Capas

## ⚡ Integración Rápida en 5 minutos

### Paso 1: Importar el Hook
```jsx
import { useRiskPredictionWorkflow } from '../hooks';
```

### Paso 2: Inicializar el Hook
```jsx
const workflow = useRiskPredictionWorkflow(projectId);

useEffect(() => {
  workflow.runPrediction();
}, [projectId]);
```

### Paso 3: Renderizar Componentes
```jsx
<DTIndicators risks={workflow.dtRisks} loading={workflow.loading} />
<CbrLearnedRisks risks={workflow.cbrRisks} loading={workflow.loading} />
<RiskSelectionInterface
  cbrRisks={workflow.cbrRisks}
  filteredRisks={workflow.filteredCbrRisks}
  minSimilarity={workflow.minSimilarity}
  selectedRiskIds={workflow.selectedRiskIds}
  onSimilarityChange={workflow.updateSimilarityThreshold}
  onToggleRisk={workflow.toggleRiskSelection}
  onSelectAll={workflow.selectAllFilteredRisks}
  onClearSelection={workflow.clearSelection}
  onAccept={workflow.acceptSelectedRisks}
  loading={workflow.acceptanceLoading}
/>
```

---

## 📊 Hook State Reference

### DT Risks (Early Warnings)
```javascript
{
  dtRisks: [],          // DTRisk[]
  dtCount: 0,           // number
  loading: false        // boolean
}
```

### CBR Risks (Learned)
```javascript
{
  cbrRisks: [],         // CBRRisk[]
  filteredCbrRisks: [], // CBRRisk[] (filtered by minSimilarity)
  cbrCount: 0,          // number
  cbrFilteredCount: 0   // number
}
```

### Filtering
```javascript
{
  minSimilarity: 0.5,   // 0-1
  updateSimilarityThreshold(threshold) // updates minSimilarity & filters
}
```

### Selection
```javascript
{
  selectedRiskIds: [],  // string[]
  selectionCount: 0,    // number
  toggleRiskSelection(riskId) // toggle checkbox
  selectAllFilteredRisks() // select all visible
  clearSelection()       // deselect all
}
```

### Acceptance
```javascript
{
  acceptSelectedRisks() // POST /risks/accept
  acceptanceLoading: false // boolean
  acceptanceError: null // string | null
}
```

### State
```javascript
{
  predictionComplete: false // boolean
  error: null // string | null
}
```

---

## 🎯 Uso por Escenario

### Escenario 1: Ver todos los riesgos
```jsx
<>
  <DTIndicators risks={workflow.dtRisks} />
  <CbrLearnedRisks risks={workflow.cbrRisks} />
</>
```

### Escenario 2: Seleccionar riesgos para monitoreo
```jsx
<RiskSelectionInterface
  cbrRisks={workflow.cbrRisks}
  filteredRisks={workflow.filteredCbrRisks}
  minSimilarity={workflow.minSimilarity}
  selectedRiskIds={workflow.selectedRiskIds}
  onSimilarityChange={workflow.updateSimilarityThreshold}
  onToggleRisk={workflow.toggleRiskSelection}
  onSelectAll={workflow.selectAllFilteredRisks}
  onClearSelection={workflow.clearSelection}
  onAccept={workflow.acceptSelectedRisks}
  loading={workflow.acceptanceLoading}
/>
```

### Escenario 3: Mostrar stats de riesgos
```jsx
<div>
  <p>DT Indicators: {workflow.dtCount}</p>
  <p>CBR Learned: {workflow.cbrCount}</p>
  <p>CBR After Filter: {workflow.cbrFilteredCount}</p>
</div>
```

### Escenario 4: Manejar errores
```jsx
{workflow.error && (
  <ErrorBanner message={workflow.error} />
)}
{workflow.acceptanceError && (
  <ErrorBanner message={workflow.acceptanceError} />
)}
```

---

## 🛠️ Configuración de Componentes

### DTIndicators Props
```typescript
interface DTIndicatorsProps {
  risks: DTRisk[];
  loading?: boolean;
}
```

### CbrLearnedRisks Props
```typescript
interface CbrLearnedRisksProps {
  risks: CBRRisk[];
  loading?: boolean;
}
```

### RiskSelectionInterface Props
```typescript
interface RiskSelectionInterfaceProps {
  cbrRisks: CBRRisk[];
  filteredRisks: CBRRisk[];
  minSimilarity: number;
  selectedRiskIds: string[];
  onSimilarityChange: (threshold: number) => void;
  onToggleRisk: (riskId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onAccept: () => void;
  loading?: boolean;
  error?: string | null;
}
```

---

## 📡 API Reference

### predictProjectRisks
```javascript
const response = await riskService.predictProjectRisks(projectId);
// Returns: { dtRisks, cbrRisks, detectionSummary }
```

### getDTIndicators
```javascript
const dtRisks = await riskService.getDTIndicators(projectId);
// Returns: DTRisk[]
```

### getCBRRisks
```javascript
const cbrRisks = await riskService.getCBRRisks(projectId, minSimilarity);
// minSimilarity: number (0-1)
// Returns: CBRRisk[] (filtered)
```

### acceptRisksForMonitoring
```javascript
const result = await riskService.acceptRisksForMonitoring(projectId, riskIds);
// riskIds: string[]
// Returns: { success: boolean, acceptedCount: number }
```

---

## 🎨 Styling Reference

### DTIndicators Colors
```css
Primary: #667EEA (Purple)
Success: #10B981 (Green)
Severity High: #EF4444 (Red)
Severity Medium: #F97316 (Orange)
```

### CbrLearnedRisks Colors
```css
Primary: #10B981 (Green)
Secondary: #06B6D4 (Cyan)
Severity High: #EF4444 (Red)
Severity Medium: #F97316 (Orange)
```

### RiskSelectionInterface Colors
```css
Primary: #667EEA (Purple)
Accent: #F59E0B (Amber)
Secondary: #E5E7EB (Gray)
Danger: #EF4444 (Red)
```

---

## 🧪 Testing Patterns

### Test de Hook
```javascript
import { renderHook, act } from '@testing-library/react';
import { useRiskPredictionWorkflow } from './useRiskPredictionWorkflow';

test('should predict risks', async () => {
  const { result } = renderHook(() => useRiskPredictionWorkflow('proj-1'));
  
  await act(() => result.current.runPrediction());
  
  expect(result.current.dtRisks.length).toBeGreaterThan(0);
  expect(result.current.cbrRisks.length).toBeGreaterThan(0);
});
```

### Test de Componente
```javascript
import { render, screen } from '@testing-library/react';
import { DTIndicators } from './DTIndicators';

test('should display early warnings', () => {
  const risks = [{
    id: '1',
    type: 'communication',
    title: 'Communication Risk',
    confidence: 0.8
  }];
  
  render(<DTIndicators risks={risks} />);
  expect(screen.getByText('Early Warnings')).toBeInTheDocument();
});
```

---

## 🔍 Debugging Tips

### Verificar que el hook se inicializa
```javascript
useEffect(() => {
  console.log('Hook state:', {
    dtRisks: workflow.dtRisks,
    cbrRisks: workflow.cbrRisks,
    loading: workflow.loading,
    error: workflow.error
  });
}, [workflow]);
```

### Verificar que la predicción se ejecuta
```javascript
useEffect(() => {
  console.log('Running prediction...');
  workflow.runPrediction().then(() => {
    console.log('Prediction complete');
  });
}, [projectId]);
```

### Verificar que el filtrado funciona
```javascript
useEffect(() => {
  console.log('Filtered risks:', workflow.filteredCbrRisks.length);
}, [workflow.filteredCbrRisks]);
```

---

## ✅ Checklist de Integración

- [ ] Importado hook useRiskPredictionWorkflow
- [ ] Inicializado hook en useEffect
- [ ] Llamado runPrediction() después de inicializar
- [ ] DTIndicators renderizando dtRisks
- [ ] CbrLearnedRisks renderizando cbrRisks
- [ ] RiskSelectionInterface conectado a handlers
- [ ] Error handling implementado
- [ ] Loading states mostrados
- [ ] Tests escritos y pasando
- [ ] Deployado a staging

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [ ] Backend endpoints implementados
- [ ] Tests pasando (frontend + backend)
- [ ] Staging deployment validado
- [ ] Performance metrics aceptables
- [ ] No console errors/warnings

### Deploy
- [ ] Merge a main branch
- [ ] Build exitoso
- [ ] Deploy a producción
- [ ] Smoke tests en producción

### Post-Deploy
- [ ] Monitorear error logs
- [ ] Validar métricas de uso
- [ ] Feedback de usuarios
- [ ] Mejoras iterativas

---

## 📞 Contacto & Support

- 📧 Email: support@tfg.dev
- 💬 Slack: #risk-prediction
- 📚 Docs: /docs/three-layer-architecture
- 🐛 Issues: /issues/risk-prediction

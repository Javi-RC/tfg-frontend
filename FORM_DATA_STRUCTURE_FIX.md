# Form Data Structure Fixes - Backend Compliance

## Summary

Fixed frontend form data structures to match exact backend API requirements for risk management and project outcome submission.

## Changes Made

### 1. ManualRiskForm.jsx - Removed Status Field

**Problem**: The form included a "status" field selector, but the backend automatically assigns status as 'active' during project creation.

**Changes**:
- ✅ Removed `STATUSES` constant
- ✅ Removed status field from form UI (Category + Status row → Category only)
- ✅ Removed status from formData initial state
- ✅ Removed status from submissionData in handleSubmit
- ✅ Added comment explaining backend auto-assigns status

**Backend API**: `POST /api/projects/:id/risks/manual`
- Required: type, title, description
- Optional: severity, category, rootCause, indicators, recommendations
- **NOT NEEDED**: status (backend assigns as 'active')

**Result**: Form now submits only the required and optional fields. Backend handles status automatically.

---

### 2. RisksSection.jsx - Verified Complete Field Coverage

**Problem**: Need to ensure all backend-required fields are present in the retrospective form.

**Verification**:
When `occurred=true`, backend expects:
- ✅ severity - Already present
- ✅ description - Already present
- ✅ rootCause - Already present
- ✅ detectedAt - Already present
- ✅ mitigatedAt - Already present
- ✅ scheduleDelayDays - Already present
- ✅ budgetOverrunPercent - Already present
- ✅ qualityImpact - Already present

When `occurred=false`, backend expects:
- ✅ avoidanceReason - Already present

**Changes**:
- ✅ Added clarifying comment in handleRiskOccurred about backend expectations
- ✅ Verified all conditional fields are captured in the UI
- ✅ Confirmed riskId is internal tracking only (not sent to backend)

**Result**: All required fields are present and captured correctly.

---

### 3. ProjectCompletionPage.jsx - Verified Transformation

**Problem**: Need to ensure data transformation matches backend schema exactly.

**Backend API**: `POST /api/projects/:id/outcome`

Expected `actualizedRisks` array structure:
```javascript
{
  type: String (required),
  occurred: Boolean (required),
  // If occurred === true:
  severity: String,
  description: String,
  rootCause: String,
  detectedAt: Date,
  mitigatedAt: Date,
  scheduleDelayDays: Number,
  budgetOverrunPercent: Number,
  qualityImpact: String,
  // If occurred === false:
  avoidanceReason: String
}
```

**Verification**:
- ✅ transformedRisks uses baseRisk with only `type` and `occurred`
- ✅ When occurred=true: adds all 8 conditional fields
- ✅ When occurred=false: adds only avoidanceReason
- ✅ Internal tracking field `riskId` is correctly removed in transformation
- ✅ No extra fields are sent that backend doesn't expect

**Result**: Data transformation is correct and matches backend schema exactly.

---

## Data Flow Verification

### During Project Execution (ACTIVE)

1. **User adds manual risk** via ManualRiskForm
2. **Frontend sends** to `POST /api/projects/:id/risks/manual`:
   ```json
   {
     "type": "communication_gap",
     "title": "Time zone issues",
     "description": "Team in different time zones",
     "severity": "high",
     "category": "coordination",
     "rootCause": "8 hour time difference",
     "indicators": ["Missed meetings", "Delayed responses"],
     "recommendations": ["Schedule overlap hours", "Use async tools"]
   }
   ```
3. **Backend automatically assigns**: `status: 'active'`
4. **Risk stored** in database with active status

### During Project Completion (Retrospective)

1. **User opens completion form** at `/projects/:id/completion`
2. **Frontend loads** all predicted + manual risks
3. **User marks** which risks occurred via checkboxes in RisksSection
4. **For occurred risks**: User fills detailed impact fields
   - Description of what occurred
   - Detection and mitigation dates
   - Schedule delays, budget overruns, quality impact
   - Root cause analysis
5. **For non-occurred risks**: User provides avoidance reason
6. **Frontend transforms** actualizedRisks array to match backend schema
7. **Frontend sends** to `POST /api/projects/:id/outcome`:
   ```json
   {
     "completed": true,
     "actualCompletedDate": "2024-01-15",
     "qualityScore": 4,
     "clientSatisfaction": 5,
     "teamMorale": 4,
     "actualizedRisks": [
       {
         "type": "communication_gap",
         "occurred": true,
         "severity": "high",
         "description": "Team missed critical meetings",
         "rootCause": "8 hour time difference with no overlap",
         "detectedAt": "2024-01-05",
         "mitigatedAt": "2024-01-10",
         "scheduleDelayDays": 5,
         "budgetOverrunPercent": 10,
         "qualityImpact": "medium"
       },
       {
         "type": "technical_debt_risk",
         "occurred": false,
         "avoidanceReason": "Implemented code review policy early"
       }
     ],
     "lessonsLearned": [...],
     "successfulPractices": [...],
     "unsuccessfulPractices": [...],
     "metrics": {}
   }
   ```
8. **Backend processes** risks and updates ML models

---

## Key Principles Applied

1. **No Status in Creation**: Backend assigns status automatically during risk creation
2. **Minimal Required Fields**: Only send what backend explicitly requires or accepts
3. **Conditional Fields**: Include fields based on occurred=true/false logic
4. **Internal vs External**: riskId for internal frontend tracking, not sent to backend
5. **Exact Schema Match**: Transform data to exactly match backend expectations

---

## Files Modified

1. [`src/components/risk/ManualRiskForm.jsx`](src/components/risk/ManualRiskForm.jsx)
   - Removed status field from UI
   - Removed status from form state and submission

2. [`src/components/outcome/RisksSection.jsx`](src/components/outcome/RisksSection.jsx)
   - Added clarifying comments about backend expectations
   - Verified all required fields present

3. [`src/pages/ProjectCompletionPage.jsx`](src/pages/ProjectCompletionPage.jsx)
   - Verified transformation logic matches backend schema

---

## Testing Checklist

- [ ] Add manual risk during ACTIVE project - verify no status field visible
- [ ] Verify backend assigns status='active' automatically
- [ ] Complete project and open completion form
- [ ] Mark risk as occurred - verify all 8 conditional fields appear
- [ ] Mark risk as not occurred - verify avoidanceReason field appears
- [ ] Submit outcome - verify API call matches backend schema
- [ ] Verify no console errors or API rejection
- [ ] Verify CBR learning triggered (backend logs)

---

## Compliance Status

✅ **ManualRiskForm**: Matches backend POST /api/projects/:id/risks/manual  
✅ **RisksSection**: Captures all required conditional fields  
✅ **ProjectCompletionPage**: Transformation matches POST /api/projects/:id/outcome  

**All form data structures now fully compliant with backend API requirements.**

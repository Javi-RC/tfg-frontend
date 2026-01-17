# CV Upload & Interactive Questionnaire System

## 📋 Overview

Complete implementation of the CV upload and interactive questionnaire flow. This system allows users to upload their CV, processes it with AI, and provides an interactive multi-phase questionnaire to complete any missing information.

## 🏗️ Architecture

### File Structure

```
src/
├── api/
│   └── cv.js                          # Enhanced with questionnaire endpoints
├── components/
│   └── questionnaire/
│       ├── CVQuestionnaire.jsx        # Main questionnaire component
│       ├── QuestionnaireContext.jsx   # State management
│       ├── useQuestionnaire.js        # Custom hook
│       ├── PhaseProgress.jsx          # Progress indicator
│       ├── PhaseForm.jsx              # Phase renderer
│       ├── QuestionRenderer.jsx       # Question type router
│       ├── index.js                   # Exports
│       ├── *.css                      # Component styles
│       └── questions/
│           ├── EmailQuestion.jsx      # Text/email/number inputs
│           ├── BooleanQuestion.jsx    # Radio/select inputs
│           ├── DateQuestion.jsx       # Date inputs
│           ├── TextAreaQuestion.jsx   # Multi-line text
│           ├── ArrayQuestion.jsx      # Array inputs (phones, skills)
│           └── index.js               # Exports
└── pages/
    ├── CVUploadPage.jsx               # Main upload page
    ├── CVUploadPage.css
    └── CVUpload/
        ├── FileUploader.jsx           # Drag & drop uploader
        ├── FileUploader.css
        ├── QuestionnaireModal.jsx     # Modal wrapper
        ├── QuestionnaireModal.css
        └── index.js                   # Exports
```

## 🔄 User Flow

1. **User uploads CV** (PDF/TXT)
2. **Backend processes** with AI
3. **Backend verifies completeness**
4. **Decision Point:**
   - ✅ **CV Complete** → Redirect to dashboard
   - ❌ **CV Incomplete** → Show questionnaire modal
5. **User completes questionnaire** in 5 phases
6. **CV 100% complete** → Redirect to dashboard

## 🔌 API Integration

### Endpoints Used

#### 1. Upload CV
```javascript
POST /api/cv/upload
Headers: Authorization: Bearer {token}
Body: FormData { cv: File, language: 'en'|'es' }
```

**Response (Incomplete CV):**
```json
{
  "success": true,
  "cv": {...},
  "completeness": {
    "isComplete": false,
    "score": 45,
    "missingFieldsCount": 12
  },
  "questionnaire": {
    "needsCompletion": true,
    "sessionId": "qs_abc123",
    "currentPhase": {...},
    "questions": [...]
  }
}
```

#### 2. Submit Phase
```javascript
POST /api/cv/questionnaire/next
Headers: Authorization: Bearer {token}
Body: { sessionId, currentPhase, responses }
```

#### 3. Finalize Questionnaire
```javascript
POST /api/cv/questionnaire/submit
Headers: Authorization: Bearer {token}
Body: { sessionId, finalResponses }
```

## 🎨 Components

### CVUploadPage
Main page that handles the upload flow and questionnaire triggering.

**Props:** None  
**Features:**
- File upload with drag & drop
- Error handling
- Automatic navigation based on CV completeness

### FileUploader
Drag and drop file uploader with validation.

**Props:**
- `onFileSelect: (file: File) => void`
- `isUploading: boolean`

**Features:**
- Drag & drop support
- File type validation (PDF, TXT)
- File size validation (max 10MB)
- Visual feedback

### QuestionnaireModal
Modal wrapper for the questionnaire.

**Props:**
- `initialData: Object` - Initial questionnaire data
- `onComplete: () => void` - Callback when complete
- `onSkip: () => void` - Callback for skip action

### CVQuestionnaire
Main questionnaire component with phase management.

**Props:**
- `onComplete: () => void` - Callback when questionnaire is complete

**Features:**
- Multi-phase navigation
- Validation
- Progress tracking
- Error handling

### QuestionRenderer
Dynamically renders appropriate question component based on type.

**Supported Types:**
- `email` - Email input
- `phone` - Phone input
- `text` - Text input
- `number` - Number input
- `date` - Date picker
- `boolean` - Yes/No options
- `array` - Array of items
- `textarea` - Multi-line text
- `select` - Selection options

## 🎯 State Management

### QuestionnaireContext
Global state for questionnaire flow.

**State:**
```javascript
{
  sessionId: string,
  currentPhase: Object,
  questions: Array,
  responses: Object,        // Current phase responses
  allResponses: Object,     // Accumulated responses
  completenessScore: number,
  isLoading: boolean,
  error: string,
  language: string
}
```

**Actions:**
- `INITIALIZE` - Initialize questionnaire
- `LOAD_NEXT_PHASE` - Load next phase
- `UPDATE_RESPONSE` - Update single response
- `ACCUMULATE_RESPONSES` - Save phase responses
- `SET_LOADING` - Set loading state
- `SET_ERROR` - Set error message
- `COMPLETE` - Mark as complete

### useQuestionnaire Hook
Custom hook for questionnaire operations.

**Methods:**
- `updateResponse(field, value)` - Update response
- `submitPhase()` - Submit current phase
- `finalize()` - Finalize questionnaire

## 🎨 Styling

All components include responsive CSS with:
- Modern design with smooth animations
- Accessibility support
- Mobile-first approach
- Consistent color scheme
- Focus states for keyboard navigation

### Color Scheme
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Error: `#e53e3e` (Red)
- Neutral: `#718096` (Gray)

## 🚀 Usage

### Basic Implementation

```jsx
import CVUploadPage from './pages/CVUploadPage';

// In your router
<Route path="/cv/upload" element={
  <ProtectedRoute>
    <CVUploadPage />
  </ProtectedRoute>
} />
```

### Standalone Questionnaire

```jsx
import { 
  QuestionnaireProvider, 
  CVQuestionnaire 
} from './components/questionnaire';

function MyComponent() {
  const questionnaireData = {
    sessionId: 'qs_123',
    currentPhase: {...},
    questions: [...]
  };

  return (
    <QuestionnaireProvider initialSessionData={questionnaireData}>
      <CVQuestionnaire onComplete={() => console.log('Done!')} />
    </QuestionnaireProvider>
  );
}
```

## ✅ Features

- ✅ Drag & drop file upload
- ✅ Multi-phase questionnaire
- ✅ Dynamic question rendering
- ✅ Real-time validation
- ✅ Progress tracking
- ✅ Error handling
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Skip option with localStorage persistence
- ✅ Smooth animations
- ✅ Type-specific input components

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:3000
```

### File Upload Limits
- **Max Size:** 10MB
- **Allowed Types:** PDF, TXT

## 📝 Best Practices

1. **Error Handling:** All API calls are wrapped with try-catch
2. **Validation:** Client-side validation before submission
3. **User Experience:** Clear feedback and loading states
4. **Accessibility:** ARIA labels and keyboard navigation
5. **Responsive:** Mobile-first design approach
6. **Performance:** Optimized re-renders with proper state management

## 🐛 Troubleshooting

### Issue: Modal not showing
**Solution:** Check that `questionnaire.needsCompletion` is `true` in upload response

### Issue: Questions not validating
**Solution:** Ensure `required` flag is set on question objects

### Issue: Responses not persisting
**Solution:** Verify `sessionId` is consistent across phase submissions

## 🔮 Future Enhancements

- [ ] Auto-save draft responses
- [ ] Resume incomplete questionnaire
- [ ] Multi-language support
- [ ] Advanced validation rules
- [ ] File preview before upload
- [ ] Bulk upload support

## 📚 Related Documentation

- [API Documentation](./API_DOCS.md)
- [Component Storybook](./STORYBOOK.md)
- [Testing Guide](./TESTING.md)

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Author:** TFG Frontend Team

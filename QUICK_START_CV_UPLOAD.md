# Quick Start Guide - CV Upload & Questionnaire

## 🚀 Quick Start

### 1. Access the Upload Page

Navigate to `/cv/upload` in your application:

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/cv/upload')}>
      Upload CV
    </button>
  );
}
```

### 2. Upload Flow Example

The complete flow is handled automatically:

```
User uploads CV → Backend processes → Questionnaire appears (if needed) → Dashboard
```

### 3. Access from Existing Components

#### From TopNavBar
```jsx
<Link to="/cv/upload">Upload New CV</Link>
```

#### From Dashboard
```jsx
<button onClick={() => navigate('/cv/upload')}>
  <Upload size={20} />
  Upload CV
</button>
```

## 📦 Component Usage Examples

### Standalone Questionnaire

If you need to use the questionnaire separately:

```jsx
import { 
  QuestionnaireProvider, 
  CVQuestionnaire 
} from '../components/questionnaire';

function MyCustomPage() {
  const [questionnaireData, setQuestionnaireData] = useState(null);

  // Load questionnaire data from API or state
  useEffect(() => {
    // Example data structure
    setQuestionnaireData({
      sessionId: 'qs_abc123',
      currentPhase: {
        id: 'phase-1-basic',
        index: 1,
        total: 5,
        title: 'Basic Information',
        description: 'Tell us about yourself'
      },
      questions: [
        {
          id: 'q1',
          field: 'contact.email',
          question: 'What is your email?',
          type: 'email',
          required: true
        }
      ]
    });
  }, []);

  if (!questionnaireData) return <div>Loading...</div>;

  return (
    <QuestionnaireProvider initialSessionData={questionnaireData}>
      <CVQuestionnaire 
        onComplete={() => {
          console.log('Questionnaire completed!');
          // Navigate or update state
        }}
      />
    </QuestionnaireProvider>
  );
}
```

### Custom File Uploader

Use just the file uploader component:

```jsx
import { FileUploader } from '../pages/CVUpload';
import { uploadCV } from '../api/cv';

function MyUploadComponent() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file) => {
    setIsUploading(true);
    try {
      const response = await uploadCV(file, 'en');
      console.log('Upload successful:', response.data);
      // Handle response
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FileUploader 
      onFileSelect={handleFileSelect}
      isUploading={isUploading}
    />
  );
}
```

## 🔧 API Integration

### Check if User Has Pending Questionnaire

```jsx
function Dashboard() {
  const [hasPendingQuestionnaire, setHasPendingQuestionnaire] = useState(false);

  useEffect(() => {
    // Check localStorage for pending questionnaire
    const pending = localStorage.getItem('pendingQuestionnaire');
    if (pending) {
      const data = JSON.parse(pending);
      setHasPendingQuestionnaire(true);
      // Optionally show reminder
    }
  }, []);

  return (
    <div>
      {hasPendingQuestionnaire && (
        <div className="reminder-banner">
          <p>You have an incomplete CV profile</p>
          <button onClick={() => navigate('/cv/upload')}>
            Complete Now
          </button>
        </div>
      )}
      {/* Rest of dashboard */}
    </div>
  );
}
```

### Resume Incomplete Questionnaire

```jsx
import { getMyCV } from '../api/cv';

function ResumeQuestionnaire() {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        // Get CV data which includes questionnaire session if incomplete
        const response = await getMyCV();
        if (response.data.questionnaire?.needsCompletion) {
          setSessionData(response.data.questionnaire);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };

    loadSession();
  }, []);

  if (!sessionData) return null;

  return (
    <QuestionnaireProvider initialSessionData={sessionData}>
      <CVQuestionnaire onComplete={() => navigate('/dashboard')} />
    </QuestionnaireProvider>
  );
}
```

## 🎨 Custom Styling

### Override Default Styles

```css
/* In your custom CSS file */

/* Change primary color */
.cv-upload-page .btn-upload {
  background: #your-color;
}

/* Customize modal */
.questionnaire-modal {
  max-width: 900px;
  border-radius: 20px;
}

/* Adjust question styles */
.question-wrapper {
  background: #your-background;
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .cv-upload-page {
    background: #1a202c;
  }

  .upload-container {
    background: #2d3748;
    color: #e2e8f0;
  }

  .drop-zone {
    border-color: #4a5568;
    background: #2d3748;
  }
}
```

## 🔍 Testing

### Test Upload Flow

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CVUploadPage from '../pages/CVUploadPage';

test('uploads CV successfully', async () => {
  render(<CVUploadPage />);
  
  const file = new File(['cv content'], 'test-cv.pdf', { 
    type: 'application/pdf' 
  });
  
  const input = screen.getByLabelText(/upload/i);
  fireEvent.change(input, { target: { files: [file] } });
  
  const uploadButton = screen.getByText(/upload cv/i);
  fireEvent.click(uploadButton);
  
  await waitFor(() => {
    expect(screen.getByText(/processed successfully/i)).toBeInTheDocument();
  });
});
```

## 📱 Mobile Considerations

The components are fully responsive. However, you may want to adjust modal behavior:

```jsx
function ResponsiveQuestionnaireModal({ initialData, onComplete, onSkip }) {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Full-screen on mobile
    return (
      <div className="mobile-fullscreen-modal">
        <CVQuestionnaire onComplete={onComplete} />
      </div>
    );
  }

  // Regular modal on desktop
  return <QuestionnaireModal {...props} />;
}
```

## 🌐 Internationalization

Add i18n support:

```jsx
import { useTranslation } from 'react-i18next';

function CVUploadPage() {
  const { t } = useTranslation();

  return (
    <div className="cv-upload-page">
      <h1>{t('cv.upload.title')}</h1>
      <p>{t('cv.upload.subtitle')}</p>
      {/* Rest of component */}
    </div>
  );
}
```

Translation keys needed:
```json
{
  "cv": {
    "upload": {
      "title": "Upload Your CV",
      "subtitle": "Upload your CV to get started",
      "processing": "Processing...",
      "success": "CV processed successfully"
    },
    "questionnaire": {
      "complete": "Complete Your Profile",
      "phase": "Phase {{current}} of {{total}}",
      "next": "Next",
      "finish": "Finish",
      "skip": "Complete Later"
    }
  }
}
```

## 🎯 Common Use Cases

### 1. First-Time User Onboarding

```jsx
function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && <Welcome onNext={() => setStep(2)} />}
      {step === 2 && <CVUploadPage />}
    </div>
  );
}
```

### 2. Profile Update Flow

```jsx
function UpdateProfile() {
  return (
    <div>
      <h2>Update Your CV</h2>
      <p>Upload a new version of your CV</p>
      <CVUploadPage />
    </div>
  );
}
```

### 3. Job Application Flow

```jsx
function ApplyToJob({ jobId }) {
  const [cvUploaded, setCvUploaded] = useState(false);

  return (
    <div>
      {!cvUploaded ? (
        <CVUploadPage 
          onComplete={() => setCvUploaded(true)} 
        />
      ) : (
        <ApplicationForm jobId={jobId} />
      )}
    </div>
  );
}
```

## 🐛 Debugging

### Enable Debug Mode

```jsx
// In QuestionnaireContext.jsx
const DEBUG = process.env.NODE_ENV === 'development';

// Add logging
if (DEBUG) {
  console.log('Current state:', state);
  console.log('Dispatching action:', action);
}
```

### View State in DevTools

```jsx
import { useEffect } from 'react';
import { useQuestionnaire } from './useQuestionnaire';

function DebugPanel() {
  const { state } = useQuestionnaire();

  useEffect(() => {
    window.__QUESTIONNAIRE_STATE__ = state;
  }, [state]);

  return null; // Or render debug UI
}
```

## 📊 Analytics Integration

Track user interactions:

```jsx
function CVUploadPage() {
  const handleFileSelect = async (file) => {
    // Track upload start
    analytics.track('CV Upload Started', {
      fileSize: file.size,
      fileType: file.type
    });

    try {
      const response = await uploadCV(file);
      
      // Track upload success
      analytics.track('CV Upload Success', {
        completenessScore: response.data.completeness.score,
        needsQuestionnaire: response.data.questionnaire?.needsCompletion
      });
      
    } catch (error) {
      // Track upload error
      analytics.track('CV Upload Failed', {
        error: error.message
      });
    }
  };

  // ... rest of component
}
```

---

Need more examples? Check the full documentation in `CV_UPLOAD_README.md`

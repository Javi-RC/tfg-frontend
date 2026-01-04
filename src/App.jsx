import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import TopNavBar from './components/TopNavBar'
import Login from './pages/Login'
import Register from './pages/Register'
import ConfirmAccount from './pages/ConfirmAccount'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import CompleteProfile from './pages/CompleteProfile'
import OAuthSuccess from './pages/OAuthSuccess'
import MyCVPage from './pages/MyCVPage'
import CVStatsPage from './pages/CVStatsPage'
import AdminCVListPage from './pages/AdminCVListPage'
import NotificationsPage from './pages/NotificationsPage'
import MyOrganizationsPage from './pages/MyOrganizationsPage'
import OrganizationDetailPage from './pages/OrganizationDetailPage'
import CVDetailPage from './pages/CVDetailPage'
import BFI44Page from './pages/BFI44Page'
import ProjectsPage from './pages/ProjectsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import TermsPage from './pages/TermsPage'

function AppRoutes() {
  const location = useLocation();
  
  // Páginas sin barra de navegación
  const noNavBarPages = ['/login', '/register', '/auth/confirm', '/auth/callback', '/oauth-success', '/complete-profile'];
  const showNavBar = !noNavBarPages.includes(location.pathname);

  return (
    <>
      {showNavBar && <TopNavBar />}
      <Routes>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/confirm" element={<ConfirmAccount />} />
        <Route path="/auth/callback" element={<OAuthSuccess />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/bfi-44" element={<ProtectedRoute><BFI44Page /></ProtectedRoute>} />
        <Route path="/bfi-44/:testId" element={<ProtectedRoute><BFI44Page /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/my-cv" element={<ProtectedRoute><MyCVPage/></ProtectedRoute>} />
        <Route path="/cv/:cvId" element={<ProtectedRoute><MyCVPage/></ProtectedRoute>} />
        <Route path="/cv-stats" element={<ProtectedRoute><CVStatsPage/></ProtectedRoute>} />
        <Route path="/admin/cvs" element={<ProtectedRoute><AdminCVListPage/></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>} />
        <Route path="/organizations" element={<ProtectedRoute><MyOrganizationsPage/></ProtectedRoute>} />
        <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetailPage/></ProtectedRoute>} />
        <Route path="/organizations/:orgId/cvs/:cvId" element={<ProtectedRoute><CVDetailPage/></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage/></ProtectedRoute>} />
        <Route path="/projects/new" element={<ProtectedRoute><ProjectFormPage/></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage/></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><ProjectFormPage/></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App(){
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

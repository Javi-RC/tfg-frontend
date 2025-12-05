import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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

function AppRoutes() {
  const location = useLocation();
  
  // Páginas sin barra de navegación
  const noNavBarPages = ['/login', '/register', '/auth/confirm', '/auth/callback', '/oauth-success', '/complete-profile'];
  const showNavBar = !noNavBarPages.includes(location.pathname);

  return (
    <>
      {showNavBar && <TopNavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/confirm" element={<ConfirmAccount />} />
        <Route path="/auth/callback" element={<OAuthSuccess />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/my-cv" element={<ProtectedRoute><MyCVPage/></ProtectedRoute>} />
        <Route path="/cv-stats" element={<ProtectedRoute><CVStatsPage/></ProtectedRoute>} />
        <Route path="/admin/cvs" element={<ProtectedRoute><AdminCVListPage/></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

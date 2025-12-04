import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ConfirmAccount from './pages/ConfirmAccount'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import CompleteProfile from './pages/CompleteProfile'
import OAuthSuccess from './pages/OAuthSuccess'

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/confirm" element={<ConfirmAccount />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

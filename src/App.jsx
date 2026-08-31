import { lazy, Suspense } from 'react';
import './components/SkipLink.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ConfirmDialogProvider } from './contexts/ConfirmDialogProvider';
import { useLanguagePreference } from './hooks/useLanguagePreference';
import AppShell from './components/layout/AppShell';
import SkipLink from './components/SkipLink';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingState from './components/common/LoadingState';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastProvider from './components/common/ToastProvider';
import { isNoNavBarRoute, isLandingRoot, HOME_ROUTE, ADMIN_ROLES } from './constants/routes';
import { useAuth } from './hooks/useAuth';

const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ConfirmAccount = lazy(() => import('./pages/ConfirmAccount'));
const Profile = lazy(() => import('./pages/Profile'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess'));
const MyCVPage = lazy(() => import('./pages/MyCVPage'));
const CVUploadPage = lazy(() => import('./pages/CVUploadPage'));
const CVStatsPage = lazy(() => import('./pages/CVStatsPage'));
const AdminCVListPage = lazy(() => import('./pages/AdminCVListPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const MyOrganizationsPage = lazy(() => import('./pages/MyOrganizationsPage'));
const OrganizationDetailPage = lazy(() => import('./pages/OrganizationDetailPage'));
const CVDetailPage = lazy(() => import('./pages/CVDetailPage'));
const BFI44Page = lazy(() => import('./pages/BFI44Page'));
const BFI44AdminPage = lazy(() => import('./pages/BFI44AdminPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectFormPage = lazy(() => import('./pages/ProjectFormPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ProjectCompletionPage = lazy(() => import('./pages/ProjectCompletionPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  useLanguagePreference();

  // Visitors landing on "/" see the marketing page, which brings its own header.
  const showsLanding = isLandingRoot(location.pathname, Boolean(user));
  const showNavBar = !isNoNavBarRoute(location.pathname) && !showsLanding;

  const mainContent = (
    <main id="main-content">
      <Suspense fallback={<LoadingState />}>
        <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/confirm" element={<ConfirmAccount />} />
            <Route path="/auth/callback" element={<OAuthSuccess />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route
              path="/bfi-44"
              element={
                <ProtectedRoute>
                  <BFI44Page />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bfi-44/admin"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <BFI44AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bfi-44/:testId"
              element={
                <ProtectedRoute>
                  <BFI44Page />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={showsLanding ? <LandingPage /> : <Profile />} />
            <Route
              path="/my-cv"
              element={
                <ProtectedRoute>
                  <MyCVPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv/upload"
              element={
                <ProtectedRoute>
                  <CVUploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv/:cvId"
              element={
                <ProtectedRoute>
                  <MyCVPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-stats"
              element={
                <ProtectedRoute>
                  <CVStatsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cvs"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <AdminCVListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute>
                  <MyOrganizationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:id"
              element={
                <ProtectedRoute>
                  <OrganizationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:orgId/cvs/:cvId"
              element={
                <ProtectedRoute>
                  <CVDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute>
                  <ProjectFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <ProtectedRoute>
                  <ProjectFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/completion"
              element={
                <ProtectedRoute>
                  <ProjectCompletionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/delete"
              element={
                <ProtectedRoute>
                  <DeleteAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <TeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpPage />
                </ProtectedRoute>
              }
            />
            {/* A visitor has no notion of "this page is missing" — send them to
                the landing. Signed-in users get the real 404. */}
            <Route
              path="*"
              element={user ? <NotFoundPage /> : <Navigate to={HOME_ROUTE} replace />}
            />
        </Routes>
      </Suspense>
    </main>
  );

  return (
    <>
      <SkipLink />
      {showNavBar ? <AppShell>{mainContent}</AppShell> : mainContent}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ConfirmDialogProvider>
          <ToastProvider />
          <BrowserRouter>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </ConfirmDialogProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

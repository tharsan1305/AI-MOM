import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load user pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CreatePage = lazy(() => import('./pages/CreatePage'));
const BrandKitPage = lazy(() => import('./pages/BrandKitPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const InfographicViewPage = lazy(() => import('./pages/InfographicViewPage'));
const ImageGeneratorPage = lazy(() => import('./pages/ImageGeneratorPage'));
const ImageHistoryPage = lazy(() => import('./pages/ImageHistoryPage'));
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage'));

// Lazy load Admin imports
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminPromptsPage = lazy(() => import('./pages/admin/AdminPromptsPage'));
const AdminPlansPage = lazy(() => import('./pages/admin/AdminPlansPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminTemplatesPage = lazy(() => import('./pages/admin/AdminTemplatesPage'));
const AdminApiProvidersPage = lazy(() => import('./pages/admin/AdminApiProvidersPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AdminAuditLogsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminImagesPage = lazy(() => import('./pages/admin/AdminImagesPage'));

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  
  return children;
};

// Layout for standard user pages (includes Navbar and Footer)
const StandardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="animate-pulse flex items-center gap-2"><div className="w-4 h-4 bg-primary-500 rounded-full"></div><div className="w-4 h-4 bg-primary-500 rounded-full"></div></div></div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Standard User Routes */}
        <Route path="/" element={<StandardLayout><LandingPage /></StandardLayout>} />
        <Route path="/login" element={<StandardLayout><LoginPage /></StandardLayout>} />
        <Route path="/register" element={<StandardLayout><RegisterPage /></StandardLayout>} />
        <Route path="/forgot-password" element={<StandardLayout><ForgotPasswordPage /></StandardLayout>} />
        
        <Route path="/dashboard" element={<StandardLayout><ProtectedRoute><DashboardPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/create" element={<StandardLayout><ProtectedRoute><CreatePage /></ProtectedRoute></StandardLayout>} />
        <Route path="/templates" element={<StandardLayout><ProtectedRoute><TemplateGalleryPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/brand-kit" element={<StandardLayout><ProtectedRoute><BrandKitPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/history" element={<StandardLayout><ProtectedRoute><HistoryPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/profile" element={<StandardLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></StandardLayout>} />
        <Route path="/infographic/:id" element={<StandardLayout><ProtectedRoute><InfographicViewPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/image-generator" element={<StandardLayout><ProtectedRoute><ImageGeneratorPage /></ProtectedRoute></StandardLayout>} />
        <Route path="/image-history" element={<StandardLayout><ProtectedRoute><ImageHistoryPage /></ProtectedRoute></StandardLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Admin...</div>}>
            <AdminLoginPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Admin...</div>}>
            <AdminLayout />
          </Suspense>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="templates" element={<AdminTemplatesPage />} />
          <Route path="images" element={<AdminImagesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="prompts" element={<AdminPromptsPage />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="api-providers" element={<AdminApiProvidersPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
        
        {/* Fallback for bad URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

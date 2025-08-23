import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginPage from '@/pages/LoginPage';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import AuthenticatedApp from '@/pages/AuthenticatedApp'; // Impor komponen AuthenticatedApp

const Dashboard = lazy(() => import('@/pages/Dashboard'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-foreground text-lg">Memuat Aplikasi...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <HelmetProvider>
    <Router>
      <Helmet>
        <title>Corporate Management System</title>
        <meta name="description" content="Sistem manajemen korporat dengan role-based access control untuk admin, keuangan, HR, dan proyek" />
      </Helmet>
      <ThemeProvider>
        <DatabaseProvider>
          <AuthProvider>
            <ChatProvider>
              <div className="min-h-screen bg-background text-foreground theme-transition">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedApp />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </ChatProvider>
          </AuthProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Jika user belum login, tampilkan halaman login
  if (!user) {
    return <LoginPage />;
  }

  // Jika user sudah login dan di halaman login, redirect ke dashboard sesuai role
  if (location.pathname === '/login') {
    const roleBasedPath = getRoleDashboardPath(user.role);
    return <Navigate to={roleBasedPath} replace />;
  }

  // Jika user sudah login dan mengakses dashboard, tampilkan dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return <Dashboard />;
  }

  // Default redirect ke dashboard berdasarkan role
  const roleBasedPath = getRoleDashboardPath(user.role);
  return <Navigate to={roleBasedPath} replace />;
};

// Helper function untuk menentukan path dashboard berdasarkan role
const getRoleDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '/dashboard/admin';
    case 'finance':
      return '/dashboard/finance';
    case 'hr':
      return '/dashboard/hr';
    case 'project':
      return '/dashboard/project';
    default:
      return '/dashboard/admin'; // default ke admin jika role tidak dikenali
  }
};

export default AuthenticatedApp;

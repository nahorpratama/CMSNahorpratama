
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Jika user belum login, redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
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
      return '/dashboard/admin';
  }
};

export default AuthenticatedApp;


import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import HRDashboard from '@/components/dashboards/HRDashboard';
import ProjectDashboard from '@/components/dashboards/ProjectDashboard';
import ChatPage from '@/pages/ChatPage';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const UserManagement = lazy(() => import('@/components/admin/UserManagement'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const getDefaultRoute = () => {
    switch (user?.role) {
      case 'admin': return '/dashboard/admin';
      case 'finance': return '/dashboard/finance';
      case 'hr': return '/dashboard/hr';
      case 'project': return '/dashboard/project';
      default: return '/dashboard/admin';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground theme-transition">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-grid"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="admin" element={
                  hasPermission('all') || user?.role === 'admin' ? 
                  <AdminDashboard /> : <Navigate to={getDefaultRoute()} />
                } />
                <Route path="users" element={
                  hasPermission('user_management') ? 
                  <UserManagement /> : <Navigate to={getDefaultRoute()} />
                } />
                <Route path="finance/*" element={<FinanceDashboard />} />
                <Route path="hr/*" element={<HRDashboard />} />
                <Route path="project/*" element={<ProjectDashboard />} />
                <Route path="chat" element={<ChatPage />} />
                <Route index element={<Navigate to={getDefaultRoute()} replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

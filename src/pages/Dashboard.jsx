
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
const ProcurementManagement = lazy(() => import('@/components/procurement/ProcurementManagement'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
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
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
                {hasPermission('all') && <Route path="/admin/*" element={<AdminDashboard />} />}
                {hasPermission('user_management') && <Route path="/users" element={<UserManagement />} />}
                {hasPermission('finance_reports') && <Route path="/finance/*" element={<FinanceDashboard />} />}
                {hasPermission('hr_management') && <Route path="/hr/*" element={<HRDashboard />} />}
                {hasPermission('project_management') && <Route path="/project/*" element={<ProjectDashboard />} />}
                {hasPermission('procurement_management') && <Route path="/procurement" element={<ProcurementManagement />} />}
                {hasPermission('chat') && <Route path="/chat" element={<ChatPage />} />}
              </Routes>
            </Suspense>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

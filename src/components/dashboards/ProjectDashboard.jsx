import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Briefcase, 
  Target, 
  CheckSquare, 
  TrendingUp
} from 'lucide-react';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectManagement from '@/components/project/ProjectManagement';
import TaskManagement from '@/components/project/TaskManagement';
import ProjectTransactions from '@/components/project/ProjectTransactions';

const ProjectDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Project Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard proyek untuk manajemen proyek, task, dan transaksi proyek" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Dashboard</h1>
          <p className="text-muted-foreground">Overview proyek, task management, dan transaksi proyek</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/project" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Briefcase className="w-4 h-4" />
            Overview
          </NavLink>
          <NavLink to="/dashboard/project/management" className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Target className="w-4 h-4" />
            Manajemen Proyek
          </NavLink>
          <NavLink to="/dashboard/project/tasks" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-green-500/30' : ''}`}>
            <CheckSquare className="w-4 h-4" />
            Task Management
          </NavLink>
          <NavLink to="/dashboard/project/transactions" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/30' : ''}`}>
            <TrendingUp className="w-4 h-4" />
            Transaksi Proyek
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={<ProjectOverview />} />
          <Route path="/management" element={<ProjectManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/transactions" element={<ProjectTransactions />} />
        </Routes>
      </div>
    </>
  );
};

export default ProjectDashboard;
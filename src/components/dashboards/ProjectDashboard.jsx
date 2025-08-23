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
import { Button } from '@/components/ui/button';

const ProjectDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Project Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard proyek untuk manajemen proyek, task, dan transaksi proyek" />
      </Helmet>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Project Dashboard
          </h1>
          <p className="text-gray-400">
            Overview proyek, task management, dan transaksi proyek
          </p>
        </motion.div>

        <div className="flex gap-4">
          <NavLink to="/dashboard/project" end>
            <Button variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Overview
            </Button>
          </NavLink>
          <NavLink to="/dashboard/project/management">
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Manajemen Proyek
            </Button>
          </NavLink>
          <NavLink to="/dashboard/project/tasks">
            <Button variant="outline">
              <CheckSquare className="w-4 h-4 mr-2" />
              Task Management
            </Button>
          </NavLink>
          <NavLink to="/dashboard/project/transactions">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transaksi Proyek
            </Button>
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
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Briefcase, 
  Target, 
  CheckSquare, 
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectManagement from '@/components/project/ProjectManagement';
import TaskManagement from '@/components/project/TaskManagement';
import ProjectTransactions from '@/components/project/ProjectTransactions';
import ProcurementManagement from '@/components/procurement/ProcurementManagement';
import { MetricCard, StatsGrid, ContentGrid } from '@/components/ui/dashboard-card';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectDashboard = () => {
  const { language } = useLanguage();

  // Language-specific content
  const content = {
    id: {
      title: 'Project Dashboard',
      subtitle: 'Overview proyek, task management, transaksi proyek, dan procurement',
      metrics: {
        totalProjects: 'Total Proyek',
        activeProjects: 'Proyek Aktif',
        completedTasks: 'Task Selesai',
        projectRevenue: 'Revenue Proyek'
      },
      changes: {
        totalProjects: '+3 proyek baru',
        activeProjects: '+2 dari bulan lalu',
        completedTasks: '+23 dari minggu lalu',
        projectRevenue: '+18% dari bulan lalu'
      },
      navigation: {
        overview: 'Overview',
        management: 'Manajemen Proyek',
        tasks: 'Task Management',
        transactions: 'Transaksi Proyek',
        procurement: 'Procurement'
      },
      pageTitle: 'Project Dashboard - Corporate Management System',
      pageDesc: 'Dashboard proyek untuk manajemen proyek, task, transaksi, dan procurement'
    },
    en: {
      title: 'Project Dashboard',
      subtitle: 'Project overview, task management, project transactions, and procurement',
      metrics: {
        totalProjects: 'Total Projects',
        activeProjects: 'Active Projects',
        completedTasks: 'Completed Tasks',
        projectRevenue: 'Project Revenue'
      },
      changes: {
        totalProjects: '+3 new projects',
        activeProjects: '+2 from last month',
        completedTasks: '+23 from last week',
        projectRevenue: '+18% from last month'
      },
      navigation: {
        overview: 'Overview',
        management: 'Project Management',
        tasks: 'Task Management',
        transactions: 'Project Transactions',
        procurement: 'Procurement'
      },
      pageTitle: 'Project Dashboard - Corporate Management System',
      pageDesc: 'Project dashboard for project management, tasks, transactions, and procurement'
    }
  };

  const t = content[language];

  // Mock data untuk metrics
  const projectMetrics = [
    {
      title: t.metrics.totalProjects,
      value: '24',
      change: t.changes.totalProjects,
      icon: Briefcase,
      changeType: 'positive'
    },
    {
      title: t.metrics.activeProjects,
      value: '18',
      change: t.changes.activeProjects,
      icon: Target,
      changeType: 'positive'
    },
    {
      title: t.metrics.completedTasks,
      value: '156',
      change: t.changes.completedTasks,
      icon: CheckSquare,
      changeType: 'positive'
    },
    {
      title: t.metrics.projectRevenue,
      value: 'Rp 3.2M',
      change: t.changes.projectRevenue,
      icon: DollarSign,
      changeType: 'positive'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Metrics Cards */}
        <StatsGrid>
          {projectMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              variant="elevated"
            />
          ))}
        </StatsGrid>

        {/* Navigation Tabs */}
        <div className="flex gap-4 flex-wrap">
          <NavLink to="/dashboard/project" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Briefcase className="w-4 h-4" />
            {t.navigation.overview}
          </NavLink>
          <NavLink to="/dashboard/project/management" className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Target className="w-4 h-4" />
            {t.navigation.management}
          </NavLink>
          <NavLink to="/dashboard/project/tasks" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'bg-green-500/30' : ''}`}>
            <CheckSquare className="w-4 h-4" />
            {t.navigation.tasks}
          </NavLink>
          <NavLink to="/dashboard/project/transactions" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'bg-purple-500/30' : ''}`}>
            <TrendingUp className="w-4 h-4" />
            {t.navigation.transactions}
          </NavLink>
          <NavLink to="/dashboard/project/procurement" className={({ isActive }) => `glass-effect border-amber-500/30 hover:bg-amber-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'bg-amber-500/30' : ''}`}>
            <ShoppingCart className="w-4 h-4" />
            {t.navigation.procurement}
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={<ProjectOverview />} />
          <Route path="/management" element={<ProjectManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/transactions" element={<ProjectTransactions />} />
          <Route path="/procurement" element={<ProcurementManagement />} />
        </Routes>
      </div>
    </>
  );
};

export default ProjectDashboard;
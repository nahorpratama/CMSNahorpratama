import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MetricCard, ChartCard, StatsGrid } from '@/components/ui/dashboard-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminDashboard = () => {
  const { language } = useLanguage();

  // Language-specific content
  const content = {
    id: {
      title: 'Admin Dashboard',
      subtitle: 'Selamat datang kembali! Berikut ringkasan sistem Anda hari ini.',
      metrics: {
        totalEmployees: 'Total Karyawan',
        revenue: 'Revenue Bulan Ini',
        activeProjects: 'Proyek Aktif',
        growth: 'Pertumbuhan'
      },
      changes: {
        employees: '+12% dari bulan lalu',
        revenue: '+8% dari bulan lalu',
        projects: '+3 proyek baru',
        growth: '+2.1% dari target'
      },
      charts: {
        revenueVsTarget: 'Revenue vs Target',
        departmentOverview: 'Overview Departemen',
        projectStatus: 'Status Proyek',
        recentActivities: 'Aktivitas Terbaru'
      },
      projectStatus: {
        completed: 'Selesai',
        ongoing: 'Berlangsung',
        pending: 'Tertunda',
        cancelled: 'Dibatalkan'
      },
      activities: {
        userJoined: 'bergabung sebagai Developer',
        projectStarted: 'dimulai',
        maintenance: 'dijadwalkan',
        timeAgo: {
          hours: 'jam yang lalu',
          weeks: 'minggu yang lalu'
        }
      },
      pageTitle: 'Admin Dashboard - Corporate Management System'
    },
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Welcome back! Here\'s a summary of your system today.',
      metrics: {
        totalEmployees: 'Total Employees',
        revenue: 'Monthly Revenue',
        activeProjects: 'Active Projects',
        growth: 'Growth'
      },
      changes: {
        employees: '+12% from last month',
        revenue: '+8% from last month',
        projects: '+3 new projects',
        growth: '+2.1% from target'
      },
      charts: {
        revenueVsTarget: 'Revenue vs Target',
        departmentOverview: 'Department Overview',
        projectStatus: 'Project Status',
        recentActivities: 'Recent Activities'
      },
      projectStatus: {
        completed: 'Completed',
        ongoing: 'Ongoing',
        pending: 'Pending',
        cancelled: 'Cancelled'
      },
      activities: {
        userJoined: 'joined as Developer',
        projectStarted: 'started',
        maintenance: 'scheduled',
        timeAgo: {
          hours: 'hours ago',
          weeks: 'weeks ago'
        }
      },
      pageTitle: 'Admin Dashboard - Corporate Management System'
    }
  };

  const t = content[language];

  // Mock data untuk dashboard admin
  const metrics = [
    {
      title: t.metrics.totalEmployees,
      value: '248',
      change: t.changes.employees,
      changeType: 'positive',
      icon: Users,
    },
    {
      title: t.metrics.revenue,
      value: 'Rp 2.4M',
      change: t.changes.revenue,
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: t.metrics.activeProjects,
      value: '12',
      change: t.changes.projects,
      changeType: 'positive',
      icon: Briefcase,
    },
    {
      title: t.metrics.growth,
      value: '23.5%',
      change: t.changes.growth,
      changeType: 'positive',
      icon: TrendingUp,
    }
  ];

  // Data untuk chart revenue
  const revenueData = [
    { month: 'Jan', revenue: 2.1, target: 2.0 },
    { month: 'Feb', revenue: 2.3, target: 2.2 },
    { month: 'Mar', revenue: 2.8, target: 2.4 },
    { month: 'Apr', revenue: 2.6, target: 2.5 },
    { month: 'Mei', revenue: 3.1, target: 2.8 },
    { month: 'Jun', revenue: 2.4, target: 2.3 }
  ];

  // Data untuk chart departemen
  const departmentData = [
    { name: 'IT', employees: 45, budget: 850 },
    { name: 'Finance', employees: 32, budget: 640 },
    { name: 'HR', employees: 28, budget: 520 },
    { name: 'Operations', employees: 67, budget: 920 },
    { name: 'Marketing', employees: 38, budget: 780 }
  ];

  // Data untuk status proyek pie chart
  const projectStatusData = [
    { name: t.projectStatus.completed, value: 8, color: '#10b981' },
    { name: t.projectStatus.ongoing, value: 12, color: '#3b82f6' },
    { name: t.projectStatus.pending, value: 3, color: '#f59e0b' },
    { name: t.projectStatus.cancelled, value: 2, color: '#ef4444' }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: `John Doe ${t.activities.userJoined}`,
      time: `2 ${t.activities.timeAgo.hours}`,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'project',
      message: `Proyek Website E-commerce ${t.activities.projectStarted}`,
      time: `4 ${t.activities.timeAgo.hours}`,
      icon: Briefcase,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'alert',
      message: `Server maintenance ${t.activities.maintenance}`,
      time: `6 ${t.activities.timeAgo.hours}`,
      icon: AlertCircle,
      color: 'text-amber-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{t.pageTitle}</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Metrics Cards */}
      <StatsGrid>
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </StatsGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title={t.charts.revenueVsTarget}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Overview */}
        <ChartCard title={t.charts.departmentOverview}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="employees" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <ChartCard title={t.charts.projectStatus} className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {projectStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <MetricCard title={t.charts.recentActivities} className="h-full">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className={`p-2 rounded-lg bg-background ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground mb-1">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MetricCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
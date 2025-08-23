import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  Calendar,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Edit,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { MetricCard, ChartCard, DataCard, StatsGrid, ContentGrid } from '@/components/ui/dashboard-card';
import { useLanguage } from '@/contexts/LanguageContext';

const HRDashboard = () => {
  const { toast } = useToast();
  const { language } = useLanguage();

  // Language-specific content
  const content = {
    id: {
      title: 'HR Dashboard',
      subtitle: 'Manajemen sumber daya manusia dan monitoring performa karyawan',
      navigation: {
        overview: 'Overview',
        employees: 'Karyawan',
        recruitment: 'Recruitment'
      },
      metrics: {
        totalEmployees: 'Total Karyawan',
        activeEmployees: 'Karyawan Aktif',
        turnoverRate: 'Turnover Rate',
        avgSalary: 'Rata-rata Gaji'
      },
      charts: {
        departmentOverview: 'Overview Departemen',
        recentActivities: 'Aktivitas Terbaru'
      },
      data: {
        employeeList: 'Daftar Karyawan',
        recruitmentStatus: 'Status Recruitment'
      },
      status: {
        active: 'Aktif',
        resigned: 'Resign',
        open: 'Terbuka',
        inProgress: 'Dalam Proses',
        closed: 'Ditutup'
      },
      performance: {
        excellent: 'Excellent',
        good: 'Good',
        average: 'Average',
        poor: 'Poor'
      },
      priority: {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority'
      },
      activities: {
        newEmployee: 'Karyawan baru bergabung: Lisa Permata',
        performanceReview: 'Performance review selesai untuk Q2 2024',
        trainingProgram: 'Training program dijadwalkan untuk Juli',
        timeAgo: {
          days: 'hari yang lalu',
          weeks: 'minggu yang lalu'
        }
      },
      pageTitle: 'HR Dashboard - Corporate Management System',
      pageDesc: 'Dashboard HR untuk manajemen karyawan, recruitment, dan performa'
    },
    en: {
      title: 'HR Dashboard',
      subtitle: 'Human resource management and employee performance monitoring',
      navigation: {
        overview: 'Overview',
        employees: 'Employees',
        recruitment: 'Recruitment'
      },
      metrics: {
        totalEmployees: 'Total Employees',
        activeEmployees: 'Active Employees',
        turnoverRate: 'Turnover Rate',
        avgSalary: 'Average Salary'
      },
      charts: {
        departmentOverview: 'Department Overview',
        recentActivities: 'Recent Activities'
      },
      data: {
        employeeList: 'Employee List',
        recruitmentStatus: 'Recruitment Status'
      },
      status: {
        active: 'Active',
        resigned: 'Resigned',
        open: 'Open',
        inProgress: 'In Progress',
        closed: 'Closed'
      },
      performance: {
        excellent: 'Excellent',
        good: 'Good',
        average: 'Average',
        poor: 'Poor'
      },
      priority: {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority'
      },
      activities: {
        newEmployee: 'New employee joined: Lisa Permata',
        performanceReview: 'Performance review completed for Q2 2024',
        trainingProgram: 'Training program scheduled for July',
        timeAgo: {
          days: 'days ago',
          weeks: 'weeks ago'
        }
      },
      pageTitle: 'HR Dashboard - Corporate Management System',
      pageDesc: 'HR dashboard for employee management, recruitment, and performance'
    }
  };

  const t = content[language];

  const employees = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      position: language === 'id' ? 'Senior Developer' : 'Senior Developer',
      department: 'IT',
      status: 'active',
      joinDate: '2022-01-15',
      email: 'ahmad.rizki@company.com',
      phone: '+62 812-3456-7890',
      location: language === 'id' ? 'Jakarta' : 'Jakarta',
      salary: 15000000,
      performance: 'excellent'
    },
    {
      id: 2,
      name: 'Sari Dewi',
      position: language === 'id' ? 'Marketing Manager' : 'Marketing Manager',
      department: 'Marketing',
      status: 'active',
      joinDate: '2021-08-20',
      email: 'sari.dewi@company.com',
      phone: '+62 813-4567-8901',
      location: language === 'id' ? 'Bandung' : 'Bandung',
      salary: 12000000,
      performance: 'good'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      position: language === 'id' ? 'Finance Analyst' : 'Finance Analyst',
      department: 'Finance',
      status: 'resigned',
      joinDate: '2020-03-10',
      resignDate: '2024-05-30',
      email: 'budi.santoso@company.com',
      phone: '+62 814-5678-9012',
      location: language === 'id' ? 'Surabaya' : 'Surabaya',
      salary: 10000000,
      performance: 'good'
    },
    {
      id: 4,
      name: 'Lisa Permata',
      position: language === 'id' ? 'UI/UX Designer' : 'UI/UX Designer',
      department: 'IT',
      status: 'active',
      joinDate: '2023-02-01',
      email: 'lisa.permata@company.com',
      phone: '+62 815-6789-0123',
      location: language === 'id' ? 'Jakarta' : 'Jakarta',
      salary: 11000000,
      performance: 'excellent'
    },
    {
      id: 5,
      name: 'Andi Wijaya',
      position: language === 'id' ? 'HR Specialist' : 'HR Specialist',
      department: 'HR',
      status: 'resigned',
      joinDate: '2019-11-15',
      resignDate: '2024-04-15',
      email: 'andi.wijaya@company.com',
      phone: '+62 816-7890-1234',
      location: language === 'id' ? 'Yogyakarta' : 'Yogyakarta',
      salary: 9000000,
      performance: 'average'
    }
  ];

  const recruitmentData = [
    {
      id: 1,
      position: language === 'id' ? 'Full Stack Developer' : 'Full Stack Developer',
      department: 'IT',
      status: 'open',
      applications: 12,
      priority: 'high'
    },
    {
      id: 2,
      position: language === 'id' ? 'Marketing Specialist' : 'Marketing Specialist',
      department: 'Marketing',
      status: 'in_progress',
      applications: 8,
      priority: 'medium'
    },
    {
      id: 3,
      position: language === 'id' ? 'Finance Manager' : 'Finance Manager',
      department: 'Finance',
      status: 'closed',
      applications: 15,
      priority: 'high'
    }
  ];

  const metrics = [
    {
      title: t.metrics.totalEmployees,
      value: '248',
      change: language === 'id' ? '+12% dari bulan lalu' : '+12% from last month',
      icon: Users,
      changeType: 'positive'
    },
    {
      title: t.metrics.activeEmployees,
      value: '235',
      change: language === 'id' ? '+8% dari bulan lalu' : '+8% from last month',
      icon: UserCheck,
      changeType: 'positive'
    },
    {
      title: t.metrics.turnoverRate,
      value: '5.2%',
      change: language === 'id' ? '-2.1% dari bulan lalu' : '-2.1% from last month',
      icon: UserX,
      changeType: 'positive'
    },
    {
      title: t.metrics.avgSalary,
      value: 'Rp 12.5M',
      change: language === 'id' ? '+15% dari bulan lalu' : '+15% from last month',
      icon: TrendingUp,
      changeType: 'positive'
    }
  ];

  const departmentStats = [
    { name: 'IT', employees: 45, avgSalary: 15000000, turnover: 3.2 },
    { name: 'Finance', employees: 32, avgSalary: 12000000, turnover: 4.1 },
    { name: 'HR', employees: 28, avgSalary: 10000000, turnover: 2.8 },
    { name: 'Operations', employees: 67, avgSalary: 11000000, turnover: 5.5 },
    { name: 'Marketing', employees: 38, avgSalary: 13000000, turnover: 4.8 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'resigned':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      case 'open':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'in_progress':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'closed':
        return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'good':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'average':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'poor':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/hr" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Users className="w-4 h-4" />
            {t.navigation.overview}
          </NavLink>
          <NavLink to="/dashboard/hr/employees" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-green-500/30' : ''}`}>
            <UserCheck className="w-4 h-4" />
            {t.navigation.employees}
          </NavLink>
          <NavLink to="/dashboard/hr/recruitment" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/30' : ''}`}>
            <UserPlus className="w-4 h-4" />
            {t.navigation.recruitment}
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
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
                    variant="elevated"
                  />
                ))}
              </StatsGrid>

              {/* Department Overview */}
              <ContentGrid cols={2}>
                <ChartCard title={t.charts.departmentOverview} variant="elevated">
                  <div className="space-y-4">
                    {departmentStats.map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <p className="font-medium text-card-foreground">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dept.employees} {language === 'id' ? 'karyawan' : 'employees'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-card-foreground">{formatCurrency(dept.avgSalary)}</p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'id' ? 'Turnover' : 'Turnover'}: {dept.turnover}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                {/* Recent Activities */}
                <DataCard title={t.charts.recentActivities} variant="elevated">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          {t.activities.newEmployee}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 {t.activities.timeAgo.days}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          {t.activities.performanceReview}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 {t.activities.timeAgo.weeks}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          {t.activities.trainingProgram}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 {t.activities.timeAgo.weeks}
                        </p>
                      </div>
                    </div>
                  </div>
                </DataCard>
              </ContentGrid>
            </div>
          } />
          
          <Route path="/employees" element={
            <div className="space-y-6">
              <DataCard title={t.data.employeeList} variant="elevated">
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {employee.location}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {language === 'id' ? 'Bergabung' : 'Joined'}: {new Date(employee.joinDate).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? t.status.active : t.status.resigned}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(employee.performance)}`}>
                          {t.performance[employee.performance]}
                        </span>
                        <div className="text-right">
                          <p className="font-semibold text-card-foreground">{formatCurrency(employee.salary)}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DataCard>
            </div>
          } />
          
          <Route path="/recruitment" element={
            <div className="space-y-6">
              <DataCard title={t.data.recruitmentStatus} variant="elevated">
                <div className="space-y-3">
                  {recruitmentData.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{position.position}</p>
                          <p className="text-sm text-muted-foreground">{position.department}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {position.applications} {language === 'id' ? 'aplikasi diterima' : 'applications received'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(position.status)}`}>
                          {position.status === 'open' ? t.status.open : 
                           position.status === 'in_progress' ? t.status.inProgress : t.status.closed}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          position.priority === 'high' ? 'text-red-600 bg-red-500/10 border-red-500/20' :
                          position.priority === 'medium' ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' :
                          'text-blue-600 bg-blue-500/10 border-blue-500/20'
                        }`}>
                          {t.priority[position.priority.replace(' ', '').toLowerCase()]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DataCard>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
};

export default HRDashboard;
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

const HRDashboard = () => {
  const { toast } = useToast();

  const employees = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      position: 'Senior Developer',
      department: 'IT',
      status: 'active',
      joinDate: '2022-01-15',
      email: 'ahmad.rizki@company.com',
      phone: '+62 812-3456-7890',
      location: 'Jakarta',
      salary: 15000000,
      performance: 'excellent'
    },
    {
      id: 2,
      name: 'Sari Dewi',
      position: 'Marketing Manager',
      department: 'Marketing',
      status: 'active',
      joinDate: '2021-08-20',
      email: 'sari.dewi@company.com',
      phone: '+62 813-4567-8901',
      location: 'Bandung',
      salary: 12000000,
      performance: 'good'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      position: 'Finance Analyst',
      department: 'Finance',
      status: 'resigned',
      joinDate: '2020-03-10',
      resignDate: '2024-05-30',
      email: 'budi.santoso@company.com',
      phone: '+62 814-5678-9012',
      location: 'Surabaya',
      salary: 10000000,
      performance: 'good'
    },
    {
      id: 4,
      name: 'Lisa Permata',
      position: 'UI/UX Designer',
      department: 'IT',
      status: 'active',
      joinDate: '2023-02-01',
      email: 'lisa.permata@company.com',
      phone: '+62 815-6789-0123',
      location: 'Jakarta',
      salary: 11000000,
      performance: 'excellent'
    },
    {
      id: 5,
      name: 'Andi Wijaya',
      position: 'HR Specialist',
      department: 'HR',
      status: 'resigned',
      joinDate: '2019-11-15',
      resignDate: '2024-04-15',
      email: 'andi.wijaya@company.com',
      phone: '+62 816-7890-1234',
      location: 'Yogyakarta',
      salary: 9000000,
      performance: 'average'
    }
  ];

  const recruitmentData = [
    {
      id: 1,
      position: 'Full Stack Developer',
      department: 'IT',
      status: 'open',
      applications: 12,
      priority: 'high'
    },
    {
      id: 2,
      position: 'Marketing Specialist',
      department: 'Marketing',
      status: 'in_progress',
      applications: 8,
      priority: 'medium'
    },
    {
      id: 3,
      position: 'Finance Manager',
      department: 'Finance',
      status: 'closed',
      applications: 15,
      priority: 'high'
    }
  ];

  const metrics = [
    {
      title: 'Total Karyawan',
      value: '248',
      change: '+12% dari bulan lalu',
      icon: Users,
      changeType: 'positive'
    },
    {
      title: 'Karyawan Aktif',
      value: '235',
      change: '+8% dari bulan lalu',
      icon: UserCheck,
      changeType: 'positive'
    },
    {
      title: 'Turnover Rate',
      value: '5.2%',
      change: '-2.1% dari bulan lalu',
      icon: UserX,
      changeType: 'positive'
    },
    {
      title: 'Rata-rata Gaji',
      value: 'Rp 12.5M',
      change: '+15% dari bulan lalu',
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
        <title>HR Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard HR untuk manajemen karyawan, recruitment, dan performa" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">HR Dashboard</h1>
          <p className="text-muted-foreground">Manajemen sumber daya manusia dan monitoring performa karyawan</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/hr" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <Users className="w-4 h-4" />
            Overview
          </NavLink>
          <NavLink to="/dashboard/hr/employees" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-green-500/30' : ''}`}>
            <UserCheck className="w-4 h-4" />
            Karyawan
          </NavLink>
          <NavLink to="/dashboard/hr/recruitment" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/30' : ''}`}>
            <UserPlus className="w-4 h-4" />
            Recruitment
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
                <ChartCard title="Overview Departemen" variant="elevated">
                  <div className="space-y-4">
                    {departmentStats.map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <p className="font-medium text-card-foreground">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">{dept.employees} karyawan</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-card-foreground">{formatCurrency(dept.avgSalary)}</p>
                          <p className="text-sm text-muted-foreground">Turnover: {dept.turnover}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                {/* Recent Activities */}
                <DataCard title="Aktivitas Terbaru" variant="elevated">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          Karyawan baru bergabung: Lisa Permata
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hari yang lalu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          Performance review selesai untuk Q2 2024
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 minggu yang lalu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          Training program dijadwalkan untuk Juli
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 minggu yang lalu
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
              <DataCard title="Daftar Karyawan" variant="elevated">
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
                              Bergabung: {new Date(employee.joinDate).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? 'Aktif' : 'Resign'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance === 'excellent' ? 'Excellent' : 
                           employee.performance === 'good' ? 'Good' : 
                           employee.performance === 'average' ? 'Average' : 'Poor'}
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
              <DataCard title="Status Recruitment" variant="elevated">
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
                            {position.applications} aplikasi diterima
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(position.status)}`}>
                          {position.status === 'open' ? 'Terbuka' : 
                           position.status === 'in_progress' ? 'Dalam Proses' : 'Ditutup'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          position.priority === 'high' ? 'text-red-600 bg-red-500/10 border-red-500/20' :
                          position.priority === 'medium' ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' :
                          'text-blue-600 bg-blue-500/10 border-blue-500/20'
                        }`}>
                          {position.priority === 'high' ? 'High Priority' : 
                           position.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
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
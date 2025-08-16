import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
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

const AdminDashboard = () => {
  // Mock data untuk dashboard admin
  const metrics = [
    {
      title: 'Total Karyawan',
      value: '248',
      change: '+12% dari bulan lalu',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Revenue Bulan Ini',
      value: 'Rp 2.4M',
      change: '+8% dari bulan lalu',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Proyek Aktif',
      value: '12',
      change: '+3 proyek baru',
      changeType: 'positive',
      icon: Briefcase,
    },
    {
      title: 'Pertumbuhan',
      value: '23.5%',
      change: '+2.1% dari target',
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
    { name: 'Selesai', value: 8, color: '#10b981' },
    { name: 'Berlangsung', value: 12, color: '#3b82f6' },
    { name: 'Tertunda', value: 3, color: '#f59e0b' },
    { name: 'Dibatalkan', value: 2, color: '#ef4444' }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'John Doe bergabung sebagai Developer',
      time: '2 jam yang lalu',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'project',
      message: 'Proyek Website E-commerce dimulai',
      time: '4 jam yang lalu',
      icon: Briefcase,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Server maintenance dijadwalkan',
      time: '6 jam yang lalu',
      icon: AlertCircle,
      color: 'text-amber-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Dashboard - Corporate Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan sistem Anda hari ini.</p>
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
        <ChartCard title="Revenue vs Target">
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
        <ChartCard title="Overview Departemen">
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
        <ChartCard title="Status Proyek" className="lg:col-span-1">
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
          <MetricCard title="Aktivitas Terbaru" className="h-full">
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
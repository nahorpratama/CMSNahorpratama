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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // Mock data untuk dashboard admin
  const metrics = [
    {
      title: 'Total Karyawan',
      value: '248',
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Revenue Bulan Ini',
      value: 'Rp 2.4M',
      change: '+18%',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Proyek Aktif',
      value: '15',
      change: '+3',
      icon: Briefcase,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Growth Rate',
      value: '24.5%',
      change: '+5.2%',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 1800000, expenses: 1200000 },
    { month: 'Feb', revenue: 2100000, expenses: 1400000 },
    { month: 'Mar', revenue: 1900000, expenses: 1300000 },
    { month: 'Apr', revenue: 2400000, expenses: 1600000 },
    { month: 'May', revenue: 2200000, expenses: 1500000 },
    { month: 'Jun', revenue: 2600000, expenses: 1700000 }
  ];

  const departmentData = [
    { name: 'IT', value: 45, color: '#3B82F6' },
    { name: 'Marketing', value: 30, color: '#10B981' },
    { name: 'Finance', value: 25, color: '#F59E0B' },
    { name: 'HR', value: 20, color: '#EF4444' },
    { name: 'Operations', value: 35, color: '#8B5CF6' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      title: 'Proyek Website E-commerce Selesai',
      time: '2 jam yang lalu',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Budget Proyek Mobile App Mendekati Limit',
      time: '4 jam yang lalu',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'info',
      title: '5 Karyawan Baru Bergabung',
      time: '1 hari yang lalu',
      icon: Users
    },
    {
      id: 4,
      type: 'pending',
      title: 'Review Laporan Keuangan Q2',
      time: '2 hari yang lalu',
      icon: Clock
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard admin untuk overview seluruh sistem manajemen korporat" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Overview lengkap sistem manajemen korporat
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className={`text-sm ${metric.color} mt-1`}>
                          {metric.change} dari bulan lalu
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Revenue vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Distribusi Karyawan per Departemen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  const getStatusColor = (type) => {
                    switch (type) {
                      case 'success': return 'text-green-400 bg-green-500/20';
                      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
                      case 'info': return 'text-blue-400 bg-blue-500/20';
                      case 'pending': return 'text-gray-400 bg-gray-500/20';
                      default: return 'text-gray-400 bg-gray-500/20';
                    }
                  };

                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;
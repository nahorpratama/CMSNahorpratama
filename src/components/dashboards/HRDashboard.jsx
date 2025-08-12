import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

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
      applicants: 25,
      posted: '2024-06-01',
      deadline: '2024-07-01',
      requirements: ['React', 'Node.js', '3+ years experience'],
      salary: '12-18 juta'
    },
    {
      id: 2,
      position: 'Digital Marketing Specialist',
      department: 'Marketing',
      status: 'interview',
      applicants: 18,
      posted: '2024-05-15',
      deadline: '2024-06-30',
      requirements: ['SEO/SEM', 'Social Media', '2+ years experience'],
      salary: '8-12 juta'
    },
    {
      id: 3,
      position: 'Product Manager',
      department: 'Product',
      status: 'closed',
      applicants: 42,
      posted: '2024-04-20',
      deadline: '2024-05-20',
      requirements: ['Product Strategy', 'Agile', '5+ years experience'],
      salary: '20-25 juta'
    }
  ];

  const metrics = [
    {
      title: 'Total Karyawan',
      value: '248',
      change: '+12',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Karyawan Aktif',
      value: '235',
      change: '+8',
      icon: UserCheck,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Resign Bulan Ini',
      value: '3',
      change: '-2',
      icon: UserX,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Posisi Terbuka',
      value: '8',
      change: '+3',
      icon: UserPlus,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleEditEmployee = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  const handleApproveApplication = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>HR Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard HR untuk manajemen karyawan dan rekrutmen" />
      </Helmet>

      <Routes>
        <Route path="/" element={<HROverview />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/recruitment" element={<RecruitmentManagement />} />
      </Routes>
    </>
  );

  function HROverview() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            HR Dashboard
          </h1>
          <p className="text-gray-400">
            Manajemen sumber daya manusia dan rekrutmen
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/hr/employees">
            <Button variant="outline" className="glass-effect border-blue-500/30 hover:bg-blue-500/20">
              <Users className="w-4 h-4 mr-2" />
              Data Karyawan
            </Button>
          </NavLink>
          <NavLink to="/dashboard/hr/recruitment">
            <Button variant="outline" className="glass-effect border-green-500/30 hover:bg-green-500/20">
              <UserPlus className="w-4 h-4 mr-2" />
              Rekrutmen
            </Button>
          </NavLink>
        </div>

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

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Karyawan Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.filter(emp => emp.status === 'active').slice(0, 3).map((employee) => (
                  <div key={employee.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-400">{employee.position}</p>
                    </div>
                    <span className="status-badge status-active">Active</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-400" />
                Rekrutmen Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recruitmentData.filter(job => job.status !== 'closed').map((job) => (
                  <div key={job.id} className="p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{job.position}</h4>
                      <span className={`status-badge ${
                        job.status === 'open' ? 'status-active' : 'status-pending'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{job.department}</p>
                    <p className="text-sm text-blue-400">{job.applicants} applicants</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function EmployeeManagement() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Data Karyawan
          </h1>
          <p className="text-gray-400">
            Semua detail data karyawan yang sudah resign maupun yang existing
          </p>
        </motion.div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="active">Karyawan Aktif</TabsTrigger>
            <TabsTrigger value="resigned">Karyawan Resign</TabsTrigger>
            <TabsTrigger value="all">Semua Karyawan</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <EmployeeTable employees={employees.filter(emp => emp.status === 'active')} />
          </TabsContent>

          <TabsContent value="resigned">
            <EmployeeTable employees={employees.filter(emp => emp.status === 'resigned')} />
          </TabsContent>

          <TabsContent value="all">
            <EmployeeTable employees={employees} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  function EmployeeTable({ employees }) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Daftar Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Posisi</th>
                  <th>Departemen</th>
                  <th>Status</th>
                  <th>Tanggal Bergabung</th>
                  <th>Gaji</th>
                  <th>Performance</th>
                  <th>Kontak</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {employee.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{employee.position}</td>
                    <td>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {employee.department}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        employee.status === 'active' ? 'status-active' : 'status-inactive'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm">{new Date(employee.joinDate).toLocaleDateString('id-ID')}</p>
                        {employee.resignDate && (
                          <p className="text-xs text-red-400">
                            Resign: {new Date(employee.resignDate).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="font-semibold">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        employee.performance === 'excellent' ? 'status-approved' :
                        employee.performance === 'good' ? 'status-active' : 'status-pending'
                      }`}>
                        {employee.performance}
                      </span>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </p>
                        <p className="text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {employee.phone}
                        </p>
                      </div>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEmployee(employee.id)}
                        className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  function RecruitmentManagement() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Rekrutmen
          </h1>
          <p className="text-gray-400">
            Manajemen rekrutmen dengan fitur edit dan approval
          </p>
        </motion.div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Posisi Terbuka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {recruitmentData.map((job) => (
                <div key={job.id} className="glass-effect p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.position}</h3>
                      <p className="text-gray-400 mb-2">{job.department} Department</p>
                      <p className="text-green-400 font-semibold">Salary: {job.salary}</p>
                    </div>
                    <span className={`status-badge ${
                      job.status === 'open' ? 'status-active' :
                      job.status === 'interview' ? 'status-pending' : 'status-inactive'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{job.applicants} Applicants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Posted: {new Date(job.posted).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Deadline: {new Date(job.deadline).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleEditEmployee(job.id)}
                      className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {job.status !== 'closed' && (
                      <Button
                        onClick={() => handleApproveApplication(job.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Applications
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default HRDashboard;
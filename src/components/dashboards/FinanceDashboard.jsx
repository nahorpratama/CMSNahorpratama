import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const FinanceDashboard = () => {
  const { toast } = useToast();
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2024');

  const quarterlyData = [
    { quarter: 'Q1 2023', revenue: 1800000, expenses: 1200000, profit: 600000 },
    { quarter: 'Q2 2023', revenue: 2100000, expenses: 1400000, profit: 700000 },
    { quarter: 'Q3 2023', revenue: 1900000, expenses: 1300000, profit: 600000 },
    { quarter: 'Q4 2023', revenue: 2400000, expenses: 1600000, profit: 800000 },
    { quarter: 'Q1 2024', revenue: 2200000, expenses: 1500000, profit: 700000 },
    { quarter: 'Q2 2024', revenue: 2600000, expenses: 1700000, profit: 900000 }
  ];

  const monthlyData = [
    { month: 'Jan', income: 850000, expense: 620000 },
    { month: 'Feb', income: 920000, expense: 680000 },
    { month: 'Mar', income: 880000, expense: 650000 },
    { month: 'Apr', income: 950000, expense: 720000 },
    { month: 'May', income: 1100000, expense: 780000 },
    { month: 'Jun', income: 1050000, expense: 750000 }
  ];

  const transactions = [
    {
      id: 1,
      type: 'income',
      description: 'Pembayaran Proyek Website E-commerce',
      amount: 450000000,
      date: '2024-06-15',
      status: 'completed',
      category: 'Project Revenue'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Gaji Karyawan Bulan Juni',
      amount: 280000000,
      date: '2024-06-01',
      status: 'completed',
      category: 'Payroll'
    },
    {
      id: 3,
      type: 'income',
      description: 'Pembayaran Proyek Mobile App',
      amount: 320000000,
      date: '2024-06-10',
      status: 'pending',
      category: 'Project Revenue'
    },
    {
      id: 4,
      type: 'expense',
      description: 'Biaya Operasional Kantor',
      amount: 85000000,
      date: '2024-06-05',
      status: 'completed',
      category: 'Operations'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Pembelian Software License',
      amount: 45000000,
      date: '2024-06-12',
      status: 'pending',
      category: 'Technology'
    }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: 'Rp 2.6M',
      change: '+18.2%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Total Expenses',
      value: 'Rp 1.7M',
      change: '+12.5%',
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Net Profit',
      value: 'Rp 900K',
      change: '+28.6%',
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Profit Margin',
      value: '34.6%',
      change: '+5.2%',
      icon: PieChart,
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

  const handleEditTransaction = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  const handleApproveTransaction = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Finance Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard keuangan dengan laporan dan transaksi keuangan perusahaan" />
      </Helmet>

      <Routes>
        <Route path="/" element={<FinanceOverview />} />
        <Route path="/reports" element={<FinanceReports />} />
        <Route path="/transactions" element={<FinanceTransactions />} />
      </Routes>
    </>
  );

  function FinanceOverview() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Finance Dashboard
          </h1>
          <p className="text-gray-400">
            Overview keuangan dan performa finansial perusahaan
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/finance/reports">
            <Button variant="outline" className="glass-effect border-blue-500/30 hover:bg-blue-500/20">
              <FileText className="w-4 h-4 mr-2" />
              Laporan Keuangan
            </Button>
          </NavLink>
          <NavLink to="/dashboard/finance/transactions">
            <Button variant="outline" className="glass-effect border-green-500/30 hover:bg-green-500/20">
              <CreditCard className="w-4 h-4 mr-2" />
              Transaksi Keuangan
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="chart-container">
              <CardHeader>
                <CardTitle>Revenue Trend (Monthly)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
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
                      dataKey="income" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Expense"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="chart-container">
              <CardHeader>
                <CardTitle>Quarterly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="quarter" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  function FinanceReports() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Laporan Keuangan
          </h1>
          <p className="text-gray-400">
            Laporan keuangan detail dengan data grafik quarterly
          </p>
        </motion.div>

        <Tabs defaultValue="quarterly" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="quarterly">Quarterly Report</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="annual">Annual Report</TabsTrigger>
          </TabsList>

          <TabsContent value="quarterly" className="space-y-6">
            <Card className="chart-container">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quarterly Financial Performance</span>
                  <select 
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="Q2 2024">Q2 2024</option>
                    <option value="Q1 2024">Q1 2024</option>
                    <option value="Q4 2023">Q4 2023</option>
                  </select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="quarter" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quarterlyData.slice(-3).map((quarter, index) => (
                <Card key={quarter.quarter} className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-lg">{quarter.quarter}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="font-semibold text-green-400">
                        {formatCurrency(quarter.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Expenses:</span>
                      <span className="font-semibold text-red-400">
                        {formatCurrency(quarter.expenses)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                      <span className="text-gray-400">Profit:</span>
                      <span className="font-bold text-blue-400">
                        {formatCurrency(quarter.profit)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="glass-effect p-6">
              <h3 className="text-xl font-semibold mb-4">Monthly Reports</h3>
              <p className="text-gray-400">Monthly financial reports akan ditampilkan di sini.</p>
            </Card>
          </TabsContent>

          <TabsContent value="annual">
            <Card className="glass-effect p-6">
              <h3 className="text-xl font-semibold mb-4">Annual Reports</h3>
              <p className="text-gray-400">Annual financial reports akan ditampilkan di sini.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  function FinanceTransactions() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Transaksi Keuangan
          </h1>
          <p className="text-gray-400">
            Semua detail transaksi keuangan dengan fitur edit dan approval
          </p>
        </motion.div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Deskripsi</th>
                    <th>Kategori</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                      <td className="font-medium">{transaction.description}</td>
                      <td>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {transaction.category}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </div>
                      </td>
                      <td className="font-semibold">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          transaction.status === 'completed' ? 'status-approved' : 'status-pending'
                        }`}>
                          {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTransaction(transaction.id)}
                            className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                          >
                            Edit
                          </Button>
                          {transaction.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveTransaction(transaction.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default FinanceDashboard;
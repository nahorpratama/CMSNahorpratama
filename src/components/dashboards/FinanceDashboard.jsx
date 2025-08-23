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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { MetricCard, ChartCard, DataCard, StatsGrid, ContentGrid } from '@/components/ui/dashboard-card';

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
      changeType: 'positive'
    },
    {
      title: 'Total Expenses',
      value: 'Rp 1.7M',
      change: '+12.5%',
      icon: TrendingDown,
      changeType: 'negative'
    },
    {
      title: 'Net Profit',
      value: 'Rp 900K',
      change: '+25.8%',
      icon: DollarSign,
      changeType: 'positive'
    },
    {
      title: 'Cash Flow',
      value: 'Rp 1.2M',
      change: '+15.3%',
      icon: CreditCard,
      changeType: 'positive'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'pending':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'cancelled':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' 
      : 'text-red-600 bg-red-500/10 border-red-500/20';
  };

  return (
    <>
      <Helmet>
        <title>Finance Dashboard - Corporate Management System</title>
        <meta name="description" content="Dashboard keuangan untuk monitoring revenue, expenses, dan cash flow" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finance Dashboard</h1>
          <p className="text-muted-foreground">Monitoring keuangan perusahaan dan analisis performa finansial</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <NavLink to="/dashboard/finance" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <DollarSign className="w-4 h-4" />
            Overview
          </NavLink>
          <NavLink to="/dashboard/finance/reports" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-green-500/30' : ''}`}>
            <FileText className="w-4 h-4" />
            Laporan
          </NavLink>
          <NavLink to="/dashboard/finance/transactions" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/30' : ''}`}>
            <CreditCard className="w-4 h-4" />
            Transaksi
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

              {/* Charts Section */}
              <ContentGrid cols={2}>
                {/* Revenue vs Expenses Chart */}
                <ChartCard title="Revenue vs Expenses" variant="elevated">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
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
                        dataKey="income" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Quarterly Performance */}
                <ChartCard title="Performa Kuartalan" variant="elevated">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="quarter" 
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
                        dataKey="revenue" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="expenses" 
                        fill="hsl(var(--destructive))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </ContentGrid>

              {/* Recent Transactions */}
              <DataCard title="Transaksi Terbaru" variant="elevated">
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DataCard>
            </div>
          } />
          
          <Route path="/reports" element={
            <div className="space-y-6">
              <DataCard title="Laporan Keuangan" variant="elevated">
                <p className="text-muted-foreground">Laporan keuangan akan ditampilkan di sini...</p>
              </DataCard>
            </div>
          } />
          
          <Route path="/transactions" element={
            <div className="space-y-6">
              <DataCard title="Semua Transaksi" variant="elevated">
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
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

export default FinanceDashboard;
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
import { useLanguage } from '@/contexts/LanguageContext';
import PPH21Monthly from '@/components/finance/PPH21Monthly';
import PPHUnifikasi from '@/components/finance/PPHUnifikasi';
import PPH21Calculation from '@/components/finance/PPH21Calculation';

const FinanceDashboard = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2024');

  // Language-specific content
  const content = {
    id: {
      title: 'Finance Dashboard',
      subtitle: 'Monitoring keuangan perusahaan dan analisis performa finansial',
      navigation: {
        overview: 'Overview',
        reports: 'Laporan',
        transactions: 'Transaksi',
        pph21: 'PPh21 Bulanan',
        pph21calc: 'PPh21 Perhitungan',
        pphUnifikasi: 'PPh Unifikasi'
      },
      metrics: {
        totalRevenue: 'Total Revenue',
        totalExpenses: 'Total Expenses',
        netProfit: 'Net Profit',
        cashFlow: 'Cash Flow'
      },
      charts: {
        revenueVsExpenses: 'Revenue vs Expenses',
        quarterlyPerformance: 'Performa Kuartalan'
      },
      data: {
        recentTransactions: 'Transaksi Terbaru',
        allTransactions: 'Semua Transaksi',
        financialReports: 'Laporan Keuangan'
      },
      status: {
        completed: 'completed',
        pending: 'pending',
        cancelled: 'cancelled'
      },
      categories: {
        projectRevenue: 'Project Revenue',
        payroll: 'Payroll',
        operations: 'Operations',
        technology: 'Technology'
      },
      pageTitle: 'Finance Dashboard - Corporate Management System',
      pageDesc: 'Dashboard keuangan untuk monitoring revenue, expenses, dan cash flow'
    },
    en: {
      title: 'Finance Dashboard',
      subtitle: 'Company financial monitoring and financial performance analysis',
      navigation: {
        overview: 'Overview',
        reports: 'Reports',
        transactions: 'Transactions',
        pph21: 'Monthly PPh21',
        pph21calc: 'PPh21 Calculation',
        pphUnifikasi: 'PPh Unification'
      },
      metrics: {
        totalRevenue: 'Total Revenue',
        totalExpenses: 'Total Expenses',
        netProfit: 'Net Profit',
        cashFlow: 'Cash Flow'
      },
      charts: {
        revenueVsExpenses: 'Revenue vs Expenses',
        quarterlyPerformance: 'Quarterly Performance'
      },
      data: {
        recentTransactions: 'Recent Transactions',
        allTransactions: 'All Transactions',
        financialReports: 'Financial Reports'
      },
      status: {
        completed: 'completed',
        pending: 'pending',
        cancelled: 'cancelled'
      },
      categories: {
        projectRevenue: 'Project Revenue',
        payroll: 'Payroll',
        operations: 'Operations',
        technology: 'Technology'
      },
      pageTitle: 'Finance Dashboard - Corporate Management System',
      pageDesc: 'Finance dashboard for monitoring revenue, expenses, and cash flow'
    }
  };

  const t = content[language];

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
      description: language === 'id' ? 'Pembayaran Proyek Website E-commerce' : 'E-commerce Website Project Payment',
      amount: 450000000,
      date: '2024-06-15',
      status: t.status.completed,
      category: t.categories.projectRevenue
    },
    {
      id: 2,
      type: 'expense',
      description: language === 'id' ? 'Gaji Karyawan Bulan Juni' : 'June Employee Salaries',
      amount: 280000000,
      date: '2024-06-01',
      status: t.status.completed,
      category: t.categories.payroll
    },
    {
      id: 3,
      type: 'income',
      description: language === 'id' ? 'Pembayaran Proyek Mobile App' : 'Mobile App Project Payment',
      amount: 320000000,
      date: '2024-06-10',
      status: t.status.pending,
      category: t.categories.projectRevenue
    },
    {
      id: 4,
      type: 'expense',
      description: language === 'id' ? 'Biaya Operasional Kantor' : 'Office Operational Costs',
      amount: 85000000,
      date: '2024-06-05',
      status: t.status.completed,
      category: t.categories.operations
    },
    {
      id: 5,
      type: 'expense',
      description: language === 'id' ? 'Pembelian Software License' : 'Software License Purchase',
      amount: 45000000,
      date: '2024-06-12',
      status: t.status.pending,
      category: t.categories.technology
    }
  ];

  const metrics = [
    {
      title: t.metrics.totalRevenue,
      value: 'Rp 2.6M',
      change: '+18.2%',
      icon: TrendingUp,
      changeType: 'positive'
    },
    {
      title: t.metrics.totalExpenses,
      value: 'Rp 1.7M',
      change: '+12.5%',
      icon: TrendingDown,
      changeType: 'negative'
    },
    {
      title: t.metrics.netProfit,
      value: 'Rp 900K',
      change: '+25.8%',
      icon: DollarSign,
      changeType: 'positive'
    },
    {
      title: t.metrics.cashFlow,
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
          <NavLink to="/dashboard/finance" end className={({ isActive }) => `glass-effect border-blue-500/30 hover:bg-blue-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-blue-500/30' : ''}`}>
            <DollarSign className="w-4 h-4" />
            {t.navigation.overview}
          </NavLink>
          <NavLink to="/dashboard/finance/reports" className={({ isActive }) => `glass-effect border-green-500/30 hover:bg-green-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-green-500/30' : ''}`}>
            <FileText className="w-4 h-4" />
            {t.navigation.reports}
          </NavLink>
          <NavLink to="/dashboard/finance/transactions" className={({ isActive }) => `glass-effect border-purple-500/30 hover:bg-purple-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-purple-500/30' : ''}`}>
            <CreditCard className="w-4 h-4" />
            {t.navigation.transactions}
          </NavLink>
          <NavLink to="/dashboard/finance/pph21" className={({ isActive }) => `glass-effect border-amber-500/30 hover:bg-amber-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-amber-500/30' : ''}`}>
            <FileText className="w-4 h-4" />
            {t.navigation.pph21}
          </NavLink>
          <NavLink to="/dashboard/finance/pph21-calculation" className={({ isActive }) => `glass-effect border-orange-500/30 hover:bg-orange-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-orange-500/30' : ''}`}>
            <PieChart className="w-4 h-4" />
            {t.navigation.pph21calc}
          </NavLink>
          <NavLink to="/dashboard/finance/pph-unifikasi" className={({ isActive }) => `glass-effect border-yellow-500/30 hover:bg-yellow-500/20 rounded-md px-4 py-2 flex items-center gap-2 transition-all ${isActive ? 'bg-yellow-500/30' : ''}`}>
            <FileText className="w-4 h-4" />
            {t.navigation.pphUnifikasi}
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
                <ChartCard title={t.charts.revenueVsExpenses} variant="elevated">
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
                <ChartCard title={t.charts.quarterlyPerformance} variant="elevated">
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
              <DataCard title={t.data.recentTransactions} variant="elevated">
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
              <DataCard title={t.data.financialReports} variant="elevated">
                <p className="text-muted-foreground">
                  {language === 'id' ? 'Laporan keuangan akan ditampilkan di sini...' : 'Financial reports will be displayed here...'}
                </p>
              </DataCard>
            </div>
          } />
          
          <Route path="/transactions" element={
            <div className="space-y-6">
              <DataCard title={t.data.allTransactions} variant="elevated">
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
          <Route path="/pph21" element={<PPH21Monthly />} />
          <Route path="/pph21-calculation" element={<PPH21Calculation />} />
          <Route path="/pph-unifikasi" element={<PPHUnifikasi />} />
        </Routes>
      </div>
    </>
  );
};

export default FinanceDashboard;
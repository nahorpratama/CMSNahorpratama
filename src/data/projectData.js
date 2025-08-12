import { 
  Briefcase, 
  Target, 
  CheckSquare, 
  TrendingUp
} from 'lucide-react';

export const projectData = {
  projects: [
    {
      id: 1,
      name: 'Website E-commerce',
      client: 'PT. Digital Store',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      budget: 450000000,
      spent: 420000000,
      profit: 30000000,
      team: ['Ahmad Rizki', 'Lisa Permata', 'Sari Dewi'],
      description: 'Pengembangan platform e-commerce lengkap dengan sistem pembayaran dan manajemen inventory'
    },
    {
      id: 2,
      name: 'Mobile App Banking',
      client: 'Bank Nusantara',
      status: 'in-progress',
      progress: 75,
      startDate: '2024-03-01',
      endDate: '2024-08-30',
      budget: 650000000,
      spent: 480000000,
      profit: 170000000,
      team: ['Ahmad Rizki', 'Budi Santoso', 'Lisa Permata', 'Andi Wijaya'],
      description: 'Aplikasi mobile banking dengan fitur transfer, pembayaran, dan investasi'
    },
    {
      id: 3,
      name: 'ERP System',
      client: 'PT. Manufaktur Indonesia',
      status: 'planning',
      progress: 15,
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      budget: 850000000,
      spent: 125000000,
      profit: 725000000,
      team: ['Ahmad Rizki', 'Sari Dewi'],
      description: 'Sistem ERP terintegrasi untuk manajemen produksi, inventory, dan keuangan'
    }
  ],

  tasks: [
    {
      id: 1,
      projectId: 2,
      title: 'API Integration Payment Gateway',
      assignee: 'Ahmad Rizki',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-07-15',
      progress: 60,
      description: 'Integrasi API payment gateway untuk fitur transfer dan pembayaran'
    },
    {
      id: 2,
      projectId: 2,
      title: 'UI/UX Dashboard Design',
      assignee: 'Lisa Permata',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-06-30',
      progress: 100,
      description: 'Desain interface dashboard untuk aplikasi mobile banking'
    },
    {
      id: 3,
      projectId: 3,
      title: 'Database Schema Design',
      assignee: 'Budi Santoso',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-20',
      progress: 0,
      description: 'Perancangan skema database untuk sistem ERP'
    },
    {
      id: 4,
      projectId: 2,
      title: 'Security Testing',
      assignee: 'Andi Wijaya',
      status: 'in-progress',
      priority: 'critical',
      dueDate: '2024-07-10',
      progress: 30,
      description: 'Testing keamanan aplikasi mobile banking'
    }
  ],

  projectTransactions: [
    {
      id: 1,
      projectId: 1,
      type: 'income',
      description: 'Pembayaran Milestone 1 - Website E-commerce',
      amount: 150000000,
      date: '2024-02-15',
      status: 'completed'
    },
    {
      id: 2,
      projectId: 1,
      type: 'expense',
      description: 'Biaya Development Team - Website E-commerce',
      amount: 120000000,
      date: '2024-02-01',
      status: 'completed'
    },
    {
      id: 3,
      projectId: 2,
      type: 'income',
      description: 'Pembayaran Milestone 2 - Mobile App Banking',
      amount: 200000000,
      date: '2024-05-15',
      status: 'completed'
    },
    {
      id: 4,
      projectId: 2,
      type: 'expense',
      description: 'Biaya Operasional - Mobile App Banking',
      amount: 80000000,
      date: '2024-05-01',
      status: 'pending'
    },
    {
      id: 5,
      projectId: 3,
      type: 'income',
      description: 'Down Payment - ERP System',
      amount: 250000000,
      date: '2024-06-01',
      status: 'completed'
    }
  ],

  metrics: [
    {
      title: 'Total Proyek',
      value: '15',
      change: '+3',
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Proyek Aktif',
      value: '8',
      change: '+2',
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Task Pending',
      value: '24',
      change: '-5',
      icon: CheckSquare,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Total Revenue',
      value: 'Rp 1.2M',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ]
};
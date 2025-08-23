import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  MessageSquare,
  Building2,
  ShieldCheck,
  FileText,
  CreditCard,
  UserPlus,
  CheckSquare,
  Target,
  TrendingUp,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const sidebarVariants = {
  open: { width: "16rem" },
  closed: { width: "5rem" },
};

const logoTextVariants = {
  open: { opacity: 1, x: 0, transition: { delay: 0.2 } },
  closed: { opacity: 0, x: -10 },
};

const navTextVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 },
};

const Sidebar = ({ isOpen }) => {
  const { user, hasPermission } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  // Language-specific content
  const content = {
    id: {
      menu: {
        adminDashboard: 'Dashboard Admin',
        userManagement: 'Manajemen Pengguna',
        financeDashboard: 'Dashboard Keuangan',
        financeReports: 'Laporan Keuangan',
        financeTransactions: 'Transaksi Keuangan',
        hrDashboard: 'Dashboard HR',
        employeeData: 'Data Karyawan',
        recruitment: 'Rekrutmen',
        projectDashboard: 'Dashboard Proyek',
        projectManagement: 'Manajemen Proyek',
        taskManagement: 'Task Management',
        projectTransactions: 'Transaksi Proyek',
        procurementManagement: 'Manajemen Procurement',
        chat: 'Chat'
      }
    },
    en: {
      menu: {
        adminDashboard: 'Admin Dashboard',
        userManagement: 'User Management',
        financeDashboard: 'Finance Dashboard',
        financeReports: 'Finance Reports',
        financeTransactions: 'Finance Transactions',
        hrDashboard: 'HR Dashboard',
        employeeData: 'Employee Data',
        recruitment: 'Recruitment',
        projectDashboard: 'Project Dashboard',
        projectManagement: 'Project Management',
        taskManagement: 'Task Management',
        projectTransactions: 'Project Transactions',
        procurementManagement: 'Procurement Management',
        chat: 'Chat'
      }
    }
  };

  const t = content[language];

  const menuItems = [
    { 
      title: t.menu.adminDashboard, 
      icon: LayoutDashboard, 
      path: '/dashboard/admin', 
      permission: 'all', 
      roles: ['admin'] 
    },
    { 
      title: t.menu.userManagement, 
      icon: ShieldCheck, 
      path: '/dashboard/users', 
      permission: 'user_management', 
      roles: ['admin'] 
    },
    { 
      title: t.menu.financeDashboard, 
      icon: DollarSign, 
      path: '/dashboard/finance', 
      permission: 'finance_reports', 
      roles: ['admin', 'finance'] 
    },
    { 
      title: t.menu.financeReports, 
      icon: FileText, 
      path: '/dashboard/finance/reports', 
      permission: 'finance_reports', 
      roles: ['admin', 'finance'] 
    },
    { 
      title: t.menu.financeTransactions, 
      icon: CreditCard, 
      path: '/dashboard/finance/transactions', 
      permission: 'finance_transactions', 
      roles: ['admin', 'finance'] 
    },
    { 
      title: t.menu.hrDashboard, 
      icon: Users, 
      path: '/dashboard/hr', 
      permission: 'hr_management', 
      roles: ['admin', 'hr'] 
    },
    { 
      title: t.menu.employeeData, 
      icon: Users, 
      path: '/dashboard/hr/employees', 
      permission: 'hr_management', 
      roles: ['admin', 'hr'] 
    },
    { 
      title: t.menu.recruitment, 
      icon: UserPlus, 
      path: '/dashboard/hr/recruitment', 
      permission: 'recruitment', 
      roles: ['admin', 'hr'] 
    },
    { 
      title: t.menu.projectDashboard, 
      icon: Briefcase, 
      path: '/dashboard/project', 
      permission: 'project_management', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.projectManagement, 
      icon: Target, 
      path: '/dashboard/project/management', 
      permission: 'project_management', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.taskManagement, 
      icon: CheckSquare, 
      path: '/dashboard/project/tasks', 
      permission: 'tasks', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.projectTransactions, 
      icon: TrendingUp, 
      path: '/dashboard/project/transactions', 
      permission: 'project_transactions', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.procurementManagement, 
      icon: ShoppingCart, 
      path: '/dashboard/procurement', 
      permission: 'procurement_management', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.chat, 
      icon: MessageSquare, 
      path: '/dashboard/chat', 
      permission: 'chat', 
      roles: ['admin', 'finance', 'hr', 'project'] 
    }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role) && 
    (hasPermission(item.permission) || hasPermission('all'))
  );

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen glass-effect-sidebar flex flex-col theme-transition"
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3 h-[65px]">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <motion.div variants={logoTextVariants} className="overflow-hidden">
            <h1 className="font-bold text-lg text-sidebar-foreground">CMS</h1>
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">
              {language === 'id' ? 'Corporate Management' : 'Corporate Management'}
            </p>
          </motion.div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all duration-200",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                )}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <motion.span variants={navTextVariants} className="text-sm font-medium whitespace-nowrap">
                  {item.title}
                </motion.span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
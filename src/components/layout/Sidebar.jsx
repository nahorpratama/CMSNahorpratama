import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Briefcase,
  FileText,
  CreditCard,
  UserPlus,
  CheckSquare,
  Target,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { hasPermission } = useAuth();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard Admin', icon: LayoutDashboard, path: '/dashboard/admin', permission: 'all', roles: ['admin'] },
    { title: 'Manajemen Pengguna', icon: ShieldCheck, path: '/dashboard/users', permission: 'user_management', roles: ['admin'] },
    { title: 'Dashboard Keuangan', icon: DollarSign, path: '/dashboard/finance', permission: 'finance_reports', roles: ['admin', 'finance'] },
    { title: 'Laporan Keuangan', icon: FileText, path: '/dashboard/finance/reports', permission: 'finance_reports', roles: ['admin', 'finance'] },
    { title: 'Transaksi Keuangan', icon: CreditCard, path: '/dashboard/finance/transactions', permission: 'finance_transactions', roles: ['admin', 'finance'] },
    { title: 'Dashboard HR', icon: Users, path: '/dashboard/hr', permission: 'hr_management', roles: ['admin', 'hr'] },
    { title: 'Data Karyawan', icon: Users, path: '/dashboard/hr/employees', permission: 'hr_management', roles: ['admin', 'hr'] },
    { title: 'Rekrutmen', icon: UserPlus, path: '/dashboard/hr/recruitment', permission: 'recruitment', roles: ['admin', 'hr'] },
    { title: 'Dashboard Proyek', icon: Briefcase, path: '/dashboard/project', permission: 'project_management', roles: ['admin', 'project'] },
    { title: 'Manajemen Procurement', icon: Truck, path: '/dashboard/procurement', permission: 'procurement_management', roles: ['admin', 'project'] },
    { title: 'Manajemen Proyek', icon: Target, path: '/dashboard/project/management', permission: 'project_management', roles: ['admin', 'project'] },
    { title: 'Task Management', icon: CheckSquare, path: '/dashboard/project/tasks', permission: 'tasks', roles: ['admin', 'project'] },
    { title: 'Transaksi Proyek', icon: TrendingUp, path: '/dashboard/project/transactions', permission: 'project_transactions', roles: ['admin', 'project'] },
    { title: 'Chat', icon: MessageSquare, path: '/dashboard/chat', permission: 'chat', roles: ['admin', 'finance', 'hr', 'project'] }
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
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Corporate Management</p>
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
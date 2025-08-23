import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Sidebar = ({ isOpen, onToggle, onClose }) => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const location = useLocation();

  // Language-specific content
  const content = {
    id: {
      menu: {
        dashboard: 'Dashboard',
        finance: 'Manajemen Keuangan',
        hr: 'Manajemen HR',
        project: 'Dashboard Proyek',
        chat: 'Chat & Notifikasi',
        settings: 'Pengaturan'
      },
      actions: {
        logout: 'Keluar',
        close: 'Tutup Menu'
      }
    },
    en: {
      menu: {
        dashboard: 'Dashboard',
        finance: 'Finance Management',
        hr: 'HR Management',
        project: 'Project Dashboard',
        chat: 'Chat & Notifications',
        settings: 'Settings'
      },
      actions: {
        logout: 'Logout',
        close: 'Close Menu'
      }
    }
  };

  const t = content[language];

  const menuItems = [
    { 
      title: t.menu.dashboard, 
      icon: LayoutDashboard, 
      path: '/dashboard', 
      permission: 'dashboard_access', 
      roles: ['admin', 'finance', 'hr', 'project'] 
    },
    { 
      title: t.menu.finance, 
      icon: DollarSign, 
      path: '/dashboard/finance', 
      permission: 'finance_management', 
      roles: ['admin', 'finance'] 
    },
    { 
      title: t.menu.hr, 
      icon: Users, 
      path: '/dashboard/hr', 
      permission: 'hr_management', 
      roles: ['admin', 'hr'] 
    },
    { 
      title: t.menu.project, 
      icon: Briefcase, 
      path: '/dashboard/project', 
      permission: 'project_management', 
      roles: ['admin', 'project'] 
    },
    { 
      title: t.menu.chat, 
      icon: MessageSquare, 
      path: '/dashboard/chat', 
      permission: 'chat_access', 
      roles: ['admin', 'finance', 'hr', 'project'] 
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const hasPermission = (item) => {
    if (!user) return false;
    if (item.roles.includes('admin') && user.role === 'admin') return true;
    if (item.roles.includes(user.role)) return true;
    return false;
  };

  const filteredMenuItems = menuItems.filter(hasPermission);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-card border-r border-border shadow-lg theme-transition lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {language === 'id' ? 'CMS System' : 'CMS System'}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role} • {language === 'id' ? 'Aktif' : 'Active'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive: navIsActive }) => cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive || navIsActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t.actions.logout}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
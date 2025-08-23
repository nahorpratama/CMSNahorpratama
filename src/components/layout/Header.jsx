import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, LogOut, Settings, MessageSquare, Sun, Moon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout, allUsers } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-effect border-b border-border px-6 py-4 flex-shrink-0 theme-transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Selamat Datang, {user?.name}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role} Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/chat')}
            className="hover:bg-accent hover:text-accent-foreground relative"
            title="Buka Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="hover:bg-accent hover:text-accent-foreground relative"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
                title="Pengaturan"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Pengaturan</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                <div className="flex items-start gap-3">
                  {isDarkMode ? <Sun className="w-4 h-4 mt-0.5" /> : <Moon className="w-4 h-4 mt-0.5" />}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Ubah Tema</span>
                    <span className="text-xs text-muted-foreground">Beralih ke {isDarkMode ? 'tema terang' : 'tema gelap'}</span>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Daftar Pengguna</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64">
                  <DropdownMenuLabel>Pengguna Login ({allUsers?.length || 0})</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-60 overflow-auto">
                    {allUsers && allUsers.length > 0 ? (
                      allUsers.map((u) => (
                        <div key={u.id} className="px-2 py-1.5 text-sm flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                            <span className="text-xs font-semibold">{u?.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium leading-tight">{u?.name || 'Pengguna'}</span>
                            <span className="text-xs text-muted-foreground capitalize leading-tight">{u?.role || 'role tidak diketahui'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">Belum ada pengguna login.</div>
                    )}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <div className="flex items-start gap-3">
                  <LogOut className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Keluar</span>
                    <span className="text-xs text-muted-foreground">Keluar dari akun Anda</span>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
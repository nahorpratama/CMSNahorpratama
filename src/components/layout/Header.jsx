import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Settings, MessageSquare, Sun, Moon, LogOut, Users, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="hover:bg-accent hover:text-accent-foreground relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Settings Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="text-base font-semibold">
                Pengaturan & Informasi
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {/* Theme Toggle */}
              <DropdownMenuItem 
                onClick={toggleTheme}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-accent rounded-md">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Ubah Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
                    </p>
                  </div>
                  <div className="p-1 bg-accent rounded">
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* User List Section */}
              <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
                Pengguna yang Sedang Online
              </DropdownMenuLabel>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {allUsers.length > 0 ? (
                  allUsers.map((userItem) => (
                    <DropdownMenuItem key={userItem.id} className="cursor-default">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {userItem.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{userItem.name || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground capitalize truncate">
                            {userItem.role || 'user'}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="cursor-default">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Tidak ada pengguna online</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}
              </div>

              <DropdownMenuSeparator />

              {/* Logout Button */}
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-destructive/10 rounded-md">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Keluar dari Sistem</p>
                    <p className="text-xs text-muted-foreground">
                      Logout dan kembali ke halaman login
                    </p>
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
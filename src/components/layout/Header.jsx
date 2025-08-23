import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, LogOut, Settings, MessageSquare, Sun, Moon, User, Camera, Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notifications, clearNotifications, dismissNotification, groupChats, selectGlobalChat, selectGroupChat, selectPersonalChat } = useChat();
  
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  
  const notificationCount = notifications.length;
  
  const handleOpenNotification = (n) => {
    try {
      if (n.type === 'global') {
        selectGlobalChat();
        navigate('/dashboard/chat?type=global');
      } else if (n.type === 'group') {
        const group = groupChats?.find(g => g.id === n.chatId);
        if (group) selectGroupChat(group);
        navigate(`/dashboard/chat?type=group&id=${encodeURIComponent(n.chatId)}`);
      } else if (n.type === 'personal') {
        const recipient = { id: n.senderId, name: n.senderName };
        selectPersonalChat(recipient);
        navigate(`/dashboard/chat?type=personal&id=${encodeURIComponent(n.senderId)}`);
      } else {
        navigate('/dashboard/chat');
      }
    } catch (e) {
      navigate('/dashboard/chat');
    }
    dismissNotification(n.id);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: language === 'id' ? "Logout Berhasil" : "Logout Successful",
      description: language === 'id' ? "Anda telah keluar dari sistem" : "You have been logged out of the system",
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: language === 'id' ? "File Terlalu Besar" : "File Too Large",
          description: language === 'id' ? "Ukuran file maksimal 5MB" : "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        toast({
          title: language === 'id' ? "Foto Berhasil Diubah" : "Photo Changed Successfully",
          description: language === 'id' ? "Foto profil Anda telah diperbarui" : "Your profile photo has been updated",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case 'id':
        return 'Indonesia';
      case 'en':
        return 'English';
      default:
        return 'Indonesia';
    }
  };

  const getCurrentLanguageLabel = () => {
    return getLanguageLabel(language);
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
              {language === 'id' ? `Selamat Datang, ${user?.name}` : `Welcome, ${user?.name}`}
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
            title={language === 'id' ? "Buka Chat" : "Open Chat"}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground relative"
                title={language === 'id' ? "Notifikasi Chat" : "Chat Notifications"}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full text-[10px] leading-4 text-white flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{language === 'id' ? "Notifikasi Chat" : "Chat Notifications"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notificationCount === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {language === 'id' ? "Tidak ada notifikasi baru" : "No new notifications"}
                </div>
              ) : (
                <div className="max-h-80 overflow-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-2 py-2 flex items-start gap-3 hover:bg-accent rounded-md cursor-pointer" onClick={() => handleOpenNotification(n)}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{n.senderName?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium truncate">{n.senderName}</p>
                          <span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {n.type === 'global' ? '[Global]' : n.type === 'group' ? '[Grup]' : '[Personal]'} {n.text}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }} title={language === 'id' ? "Tutup" : "Close"}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {notificationCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-center text-blue-600" onClick={clearNotifications}>
                    {language === 'id' ? "Bersihkan semua" : "Clear all"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
                title={language === 'id' ? "Pengaturan" : "Settings"}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>{language === 'id' ? "Pengaturan" : "Settings"}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* User Profile Section */}
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                  <div className="relative">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                        <span className="text-sm font-semibold">{user?.name?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                    <label htmlFor="profile-image" className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </label>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Theme Toggle */}
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                <div className="flex items-start gap-3">
                  {isDarkMode ? <Sun className="w-4 h-4 mt-0.5" /> : <Moon className="w-4 h-4 mt-0.5" />}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {language === 'id' ? "Ubah Tema" : "Change Theme"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language === 'id' 
                        ? `Beralih ke ${isDarkMode ? 'tema terang' : 'tema gelap'}`
                        : `Switch to ${isDarkMode ? 'light theme' : 'dark theme'}`
                      }
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Language Selection */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span>{language === 'id' ? "Bahasa" : "Language"}</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuLabel>
                    {language === 'id' ? "Pilih Bahasa" : "Select Language"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setLanguage('id')} 
                    className={`cursor-pointer ${language === 'id' ? 'bg-accent' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Indonesia</span>
                      {language === 'id' && <span className="text-xs text-muted-foreground">(Current)</span>}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage('en')} 
                    className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>English</span>
                      {language === 'en' && <span className="text-xs text-muted-foreground">(Current)</span>}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <div className="flex items-start gap-3">
                  <LogOut className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {language === 'id' ? "Keluar" : "Logout"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language === 'id' ? "Keluar dari akun Anda" : "Sign out of your account"}
                    </span>
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
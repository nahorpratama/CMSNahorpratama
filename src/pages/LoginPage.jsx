
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LogIn, Building2, Languages, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

/**
 * Komponen untuk halaman Login.
 * Menangani input pengguna untuk kredensial dan proses autentikasi.
 */
const LoginPage = () => {
  // State untuk menyimpan input pengguna dan status loading
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mengambil fungsi login dari AuthContext
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  // Language-specific content
  const content = {
    id: {
      title: 'Corporate Portal',
      subtitle: 'Sistem Manajemen Korporat Terpadu',
      credentialLabel: 'Username atau Email',
      credentialPlaceholder: 'Masukkan username atau email Anda',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Masukkan password Anda',
      loginButton: 'Masuk',
      inputIncomplete: 'Input Tidak Lengkap',
      inputIncompleteDesc: 'Harap masukkan email/username dan password.',
      loginFailed: 'Login Gagal',
      loginSuccess: 'Login Berhasil',
      loginSuccessDesc: 'Mengalihkan ke dashboard...',
      error: 'Error',
      errorDesc: 'Terjadi kesalahan saat login. Silakan coba lagi.',
      pageTitle: 'Login - Corporate Management System',
      pageDesc: 'Login ke sistem manajemen korporat dengan role-based access',
      language: 'Bahasa',
      selectLanguage: 'Pilih Bahasa',
      indonesia: 'Indonesia',
      english: 'English',
      current: '(Saat Ini)'
    },
    en: {
      title: 'Corporate Portal',
      subtitle: 'Integrated Corporate Management System',
      credentialLabel: 'Username or Email',
      credentialPlaceholder: 'Enter your username or email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Login',
      inputIncomplete: 'Incomplete Input',
      inputIncompleteDesc: 'Please enter email/username and password.',
      loginFailed: 'Login Failed',
      loginSuccess: 'Login Successful',
      loginSuccessDesc: 'Redirecting to dashboard...',
      error: 'Error',
      errorDesc: 'An error occurred during login. Please try again.',
      pageTitle: 'Login - Corporate Management System',
      pageDesc: 'Login to corporate management system with role-based access',
      language: 'Language',
      selectLanguage: 'Select Language',
      indonesia: 'Indonesia',
      english: 'English',
      current: '(Current)'
    }
  };

  const t = content[language];

  /**
   * Menangani proses submit form login.
   * @param {React.FormEvent} e - Event form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi input
    if (!credential || !password) {
      toast({
        title: t.inputIncomplete,
        description: t.inputIncompleteDesc,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      // Memanggil fungsi login dari context
      const result = await login(credential, password);
      
      if (!result.success) {
        toast({
          title: t.loginFailed,
          description: result.error,
          variant: "destructive",
        });
        setLoading(false);
      } else {
        // Login sukses, redirect ke dashboard sesuai role
        toast({
          title: t.loginSuccess,
          description: t.loginSuccessDesc,
          variant: "default",
        });
        
        // Delay sedikit untuk memastikan state auth sudah terupdate
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorDesc,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Globe className="w-4 h-4 mr-2" />
                  {t.language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t.selectLanguage}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setLanguage('id')} 
                  className={`cursor-pointer ${language === 'id' ? 'bg-accent' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span>{t.indonesia}</span>
                    {language === 'id' && <span className="text-xs text-muted-foreground">{t.current}</span>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')} 
                  className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span>{t.english}</span>
                    {language === 'en' && <span className="text-xs text-muted-foreground">{t.current}</span>}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card className="glass-effect p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 ring-4 ring-white/10"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {t.title}
              </h1>
              <p className="text-gray-400">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="credential">{t.credentialLabel}</Label>
                <Input
                  id="credential"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder={t.credentialPlaceholder}
                  required
                  className="bg-white/5 border-white/20 h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  required
                  className="bg-white/5 border-white/20 h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-14"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    {t.loginButton}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;

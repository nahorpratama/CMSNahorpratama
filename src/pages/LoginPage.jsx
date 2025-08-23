
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LogIn, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect jika sudah login (mencegah perlu login dua kali)
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  /**
   * Menangani proses submit form login.
   * @param {React.FormEvent} e - Event form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi input
    if (!credential || !password) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap masukkan email/username dan password.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // Memanggil fungsi login dari context
    const result = await login(credential, password);
    
    if (!result.success) {
      toast({
        title: "Login Gagal",
        description: result.error,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      // Login sukses, redirect ke dashboard; Auth guard akan lanjutkan ke dashboard sesuai role
      toast({
        title: "Login Berhasil",
        description: "Mengalihkan ke dashboard...",
        variant: "default",
      });
      setLoading(false);
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Corporate Management System</title>
        <meta name="description" content="Login ke sistem manajemen korporat dengan role-based access" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
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
                Corporate Portal
              </h1>
              <p className="text-gray-400">
                Sistem Manajemen Korporat Terpadu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="credential">Username atau Email</Label>
                <Input
                  id="credential"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="Masukkan username atau email Anda"
                  required
                  className="bg-white/5 border-white/20 h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
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
                    Masuk
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

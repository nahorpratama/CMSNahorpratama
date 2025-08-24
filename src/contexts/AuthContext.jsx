import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dbService = useDatabase();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    try {
      const usersList = await dbService.getAllUsers();
      setAllUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAllUsers([]);
    }
  }, [dbService]);

  useEffect(() => {
    const sessionSubscription = dbService.onAuthStateChanged(async (session) => {
      const currentUser = session?.user;
      if (currentUser) {
        try {
          const profile = await dbService.getUserProfile(currentUser.id);
          if (profile) {
            // Gabungkan data user dari Supabase Auth dengan profile dari table profiles
            const userData = { 
              id: currentUser.id,
              email: currentUser.email,
              ...profile 
            };
            console.log('User authenticated successfully:', userData);
            setUser(userData);
            await fetchAllUsers();
          } else {
            console.error("User authenticated but no profile found. Logging out.");
            await dbService.logout();
            setUser(null);
            setAllUsers([]);
          }
        } catch (error) {
          console.error("Error setting up user session:", error);
          setUser(null);
          setAllUsers([]);
        }
      } else {
        console.log('No user session found');
        setUser(null);
        setAllUsers([]);
      }
      setLoading(false);
    });

    return () => {
      if (sessionSubscription) {
        sessionSubscription.unsubscribe();
      }
    };
  }, [dbService, fetchAllUsers]);

  const login = useCallback(async (credential, password) => {
    try {
      console.log('Attempting login with credential:', credential);
      const result = await dbService.login(credential, password);
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        // Set user state immediately after successful login
        try {
          const profile = await dbService.getUserProfile(result.user.id);
          if (profile) {
            const userData = { 
              id: result.user.id,
              email: result.user.email,
              ...profile 
            };
            console.log('Setting user state immediately:', userData);
            setUser(userData);
            await fetchAllUsers();
          } else {
            console.error("User authenticated but no profile found.");
            return { success: false, error: 'Profile user tidak ditemukan. Silakan hubungi administrator.' };
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return { success: false, error: 'Gagal mengambil data profil user.' };
        }
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Terjadi kesalahan saat login.' };
    }
  }, [dbService, fetchAllUsers]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await dbService.logout();
      setUser(null);
      setAllUsers([]);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [dbService]);

  const createUser = useCallback(async (userData) => {
    const result = await dbService.createUser(userData);
    if (result.success) {
      await fetchAllUsers(); // Refresh user list
    }
    return result;
  }, [dbService, fetchAllUsers]);

  const updateUser = useCallback(async (userId, userData) => {
    const result = await dbService.updateUser(userId, userData);
    if (result.success) {
      await fetchAllUsers();
    }
    return result;
  }, [dbService, fetchAllUsers]);

  const deleteUser = useCallback(async (userId) => {
    const result = await dbService.deleteUser(userId);
    if (result.success) {
      await fetchAllUsers();
    }
    return result;
  }, [dbService, fetchAllUsers]);

  const hasPermission = useCallback((permission) => {
    if (!user) {
      return false;
    }

    // Admin memiliki semua permission
    if (user.role === 'admin') {
      return true;
    }

    // Permission berdasarkan role
    const rolePermissions = {
      admin: ['all'],
      finance: ['finance_reports', 'finance_transactions', 'chat'],
      hr: ['hr_management', 'recruitment', 'chat'],
      project: ['project_management', 'tasks', 'project_transactions', 'procurement_management', 'chat']
    };

    const userPermissions = rolePermissions[user.role] || [];

    // Cek permission spesifik atau dari user.permissions jika ada
    return userPermissions.includes(permission) || 
           (user.permissions && user.permissions.includes(permission)) || 
           userPermissions.includes('all');
  }, [user]);

  const value = {
    user,
    allUsers,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    hasPermission,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
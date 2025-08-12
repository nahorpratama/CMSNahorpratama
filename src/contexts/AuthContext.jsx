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

// Developer Note: Set to true to bypass login and assume admin role.
// Set to false for normal authentication flow.
const BYPASS_AUTH = false;

export const AuthProvider = ({ children }) => {
  const dbService = useDatabase();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    const usersList = await dbService.getAllUsers();
    setAllUsers(usersList);
  }, [dbService]);

  useEffect(() => {
    if (BYPASS_AUTH) {
      // Bypass authentication and set a mock admin user
      setUser({
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@bypass.com',
        name: 'Admin Bypass',
        role: 'admin',
        permissions: ['all', 'user_management', 'procurement_management']
      });
      fetchAllUsers();
      setLoading(false);
      return;
    }

    const sessionSubscription = dbService.onAuthStateChanged(async (session) => {
      const currentUser = session?.user;
      if (currentUser) {
        try {
          const profile = await dbService.getUserProfile(currentUser.id);
          if (profile) {
            // Gabungkan data user dari Supabase Auth dengan profile dari table profiles
            setUser({ 
              id: currentUser.id,
              email: currentUser.email,
              ...profile 
            });
            fetchAllUsers();
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
    return await dbService.login(credential, password);
  }, [dbService]);

  const logout = useCallback(async () => {
    if (BYPASS_AUTH) {
      // In bypass mode, just clear the user state
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    await dbService.logout();
    setUser(null);
    setAllUsers([]);
    setLoading(false);
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
    if (BYPASS_AUTH) {
      return true;
    }

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
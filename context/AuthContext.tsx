// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StrapiUser } from '@/types/strapi';
import {
  getStoredUser,
  getStoredToken,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
} from '@/lib/auth';

interface AuthContextType {
  user: StrapiUser | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedUser = getStoredUser();

      if (storedUser && isMounted) {
        setUser(storedUser);
        setToken('active-session');
      }

      const freshUser = await fetchCurrentUser();
      if (isMounted) {
        if (freshUser) {
          setUser(freshUser);
          setToken('active-session');
        } else {
          setUser(null);
          setToken(null);
        }
        setIsLoading(false);
      }
    };

    initAuth();

    const handleAuthChange = () => {
      setUser(getStoredUser());
      setToken(getStoredToken());
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('yy_auth_changed', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('yy_auth_changed', handleAuthChange);
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await loginUser(identifier, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.jwt);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email: string) => {
    return await requestPasswordReset(email);
  };

  const refreshUser = async () => {
    if (token) {
      const freshUser = await fetchCurrentUser(token);
      if (freshUser) {
        setUser(freshUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        forgotPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

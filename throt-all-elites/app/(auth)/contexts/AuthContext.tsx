'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: { id: number; name: string; email: string; role: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem('accessToken');
      if (token && !user) {
      }
    }
  }, [isMounted, user]);

  const login = (token: string, userData: { id: number; name: string; email: string; role: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
    const fullUser: User = {
      ...userData,
      role: userData.role as 'USER' | 'ADMIN',
    };
    setUser(fullUser);

    if (fullUser.role === 'ADMIN') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = isMounted && (!!user || (typeof window !== 'undefined' && !!localStorage.getItem('accessToken')));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
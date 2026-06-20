'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  organization?: string;
  memberId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login'];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function getUserFromCookies(): User | null {
  const userId = getCookie('userId');
  const role = getCookie('role');
  const organization = getCookie('organization');

  if (!userId) return null;

  return {
    id: userId,
    userName: getCookie('userName') || '',
    email: getCookie('email') || '',
    role: role || 'user',
    organization: organization || undefined,
    memberId: getCookie('memberId') || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const cookieUser = getUserFromCookies();
    if (cookieUser) {
      setUser(cookieUser);
    } else {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    const data = response.data;

    if (data.status === 'success' && data.data) {
      const cookieUser = getUserFromCookies();
      const userData = cookieUser || data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/');
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem('user');
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
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

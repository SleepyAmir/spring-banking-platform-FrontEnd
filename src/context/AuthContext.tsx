import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { authApi } from '@/api/services';
import { setMock } from '@/api/client';

type Role = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

interface AuthValue {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isStaff: boolean; // ADMIN یا MANAGER
  login: (username: string, password: string) => Promise<Role>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem('role') as Role) || null);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (username: string, password: string): Promise<Role> => {
    const result = await authApi.login(username, password);
    localStorage.setItem('accessToken', result.tokens.accessToken);
    localStorage.setItem('role', result.role);
    localStorage.setItem('hadSession', 'true');
    setUser(result.user);
    setRole(result.role);
    return result.role;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('hadSession');
    setUser(null);
    setRole(null);
  };

  // helper برای فعال‌سازی سریع حالت دمو از صفحه‌ی لاگین
  useEffect(() => {
    if (localStorage.getItem('mockMode') === null) setMock(false);
  }, []);

  const value: AuthValue = {
    user,
    role,
    isAuthenticated: !!user && !!localStorage.getItem('accessToken'),
    isStaff: role === 'ADMIN' || role === 'MANAGER',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

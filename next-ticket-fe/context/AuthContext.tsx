'use client';

import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/auth';
import { AdminUser } from '@/types/auth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '@/lib/api';

interface AuthContextValue {
  token: string | null;
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvied({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      setIsLoading(false);
      return;
    }

    setToken(stored);
    getMe(stored)
      .then(({ user }) => setUser(user))
      .catch(() => {
        clearStoredToken();
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiLogin(email, password);
    setStoredToken(res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }

  async function logout() {
    if (token) {
      try {
        await apiLogout(token);
      } catch (error) {
        // token mungkin sudah invalid di server
      }
    }
    clearStoredToken();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('UseAuth must be used within AuthProvider');

  return context;
}

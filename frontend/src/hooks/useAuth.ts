import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';
import { getSocket, disconnectSocket } from '../lib/socket';
import type { User } from '../types';

interface AuthHook {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getCurrentUser(); // returns User
        if (!isMounted) return;

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        getSocket(token);
      } catch {
        if (!isMounted) return;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: userData, token } = await authApi.login({ email, password });
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    getSocket(token);
    return userData;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { user: userData, token } = await authApi.register({ email, password, name });
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    getSocket(token);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      disconnectSocket();
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};

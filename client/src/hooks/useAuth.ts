import { useState, useCallback, useEffect } from 'react';
import { login as apiLogin } from '../services/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { token } = await apiLogin(username, password);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}; 
import { useState, useCallback, useEffect } from 'react';
import { login as apiLogin } from '../services/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerLoading, setIsServerLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsServerLoading(true);
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      timeoutId = setTimeout(() => {
        toast.error('El servidor se encuentra cargando, esto podría tomar 1 minuto...', {
          duration: 5000,
          position: 'top-center',
        });
      }, 5000); 

      const { token } = await apiLogin(username, password);

      if (timeoutId) clearTimeout(timeoutId);

      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      toast.success('Login exitoso');
      router.push('/home');
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      setIsServerLoading(false);
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error('El servidor se encuentra cargando, intenta nuevamente en unos segundos');
      } else {
        toast.error('Credenciales inválidas');
      }
      throw error;
    } finally {
      setIsServerLoading(false);
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
    isServerLoading,
    login,
    logout,
  };
}; 
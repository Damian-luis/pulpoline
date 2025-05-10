import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useI18n } from '../hooks/useI18n';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading, logout, isAuthenticated, isServerLoading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && router.pathname !== '/') {
      router.replace('/');
    }
    if (!isLoading && isAuthenticated && router.pathname === '/') {
      router.replace('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated && router.pathname === '/') {
    return (
      <>
        {isServerLoading && (
          <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
              <LightBulbIcon className="h-5 w-5 animate-pulse" />
              <span>El servidor se encuentra cargando, esto podría tomar 1 minuto...</span>
            </div>
          </>
        )}
        {children}
      </>
    );
  }

  if (isAuthenticated && router.pathname === '/home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex justify-end items-center h-16 px-8">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            {t('logout')}
          </button>
        </div>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </main>
      </div>
    );
  }

  return null;
}; 
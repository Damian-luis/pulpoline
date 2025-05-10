import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { I18nProvider, useI18n } from '../hooks/useI18n';
import { Toaster } from 'react-hot-toast';
import { LanguageIcon } from '@heroicons/react/24/outline';
import React from 'react';

function FloatingButtons() {
  const { t, locale, setLocale } = useI18n();
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      <button
        onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
        className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        title={t('language_toggle') || 'Cambiar idioma'}
      >
        <LanguageIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Toaster position="top-right" />
      <FloatingButtons />
      <Component {...pageProps} />
    </I18nProvider>
  );
}

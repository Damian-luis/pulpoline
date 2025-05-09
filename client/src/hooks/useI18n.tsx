import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const locales = {
  en: () => import('../locales/en.json'),
  es: () => import('../locales/es.json'),
};

type Locale = 'en' | 'es';

interface I18nContextProps {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  loading: boolean;
}

const I18nContext = createContext<I18nContextProps>({
  t: (key) => key,
  locale: 'en',
  setLocale: () => {},
  loading: false,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('locale')) as Locale || 'es';
    setLocaleState(stored);
  }, []);

  useEffect(() => {
    setLoading(true);
    locales[locale]().then((mod) => {
      setMessages(mod.default || mod);
      setLoading(false);
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: string) => messages[key] || key;

  return (
    <I18nContext.Provider value={{ t, locale, setLocale, loading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext); 
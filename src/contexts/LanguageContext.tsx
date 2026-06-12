'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

export type Language = 'en' | 'pt' | 'es';

export function getLanguageLocale(language: Language) {
  return {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-ES',
  }[language];
}

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const languageChangeEvent = 'mythstride-language-change';
const supportedLanguages: Language[] = ['en', 'pt', 'es'];

function isLanguage(value: string | null): value is Language {
  return supportedLanguages.includes(value as Language);
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(languageChangeEvent, callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(languageChangeEvent, callback);
  };
}

function getBrowserLanguage(): Language {
  const browserLanguages =
    typeof navigator !== 'undefined'
      ? [navigator.language, ...(navigator.languages ?? [])]
      : [];

  for (const locale of browserLanguages) {
    const normalizedLocale = locale.toLowerCase();

    if (normalizedLocale.startsWith('pt')) {
      return 'pt';
    }

    if (normalizedLocale.startsWith('es')) {
      return 'es';
    }
  }

  return 'en';
}

function getLanguageSnapshot() {
  const storedLanguage = localStorage.getItem('lang');

  return isLanguage(storedLanguage) ? storedLanguage : getBrowserLanguage();
}

function getServerLanguageSnapshot(): Language {
  return 'en';
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const lang = useSyncExternalStore(subscribe, getLanguageSnapshot, getServerLanguageSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (nextLang: Language) => {
    localStorage.setItem('lang', nextLang);
    window.dispatchEvent(new Event(languageChangeEvent));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

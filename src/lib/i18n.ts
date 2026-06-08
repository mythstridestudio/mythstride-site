import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import en from './translations/en.json';
import pt from './translations/pt.json';
import es from './translations/es.json';

const translations = {
  en,
  pt,
  es,
};

/**
 * Custom hook for translations.
 * Supports nested keys using dot notation (e.g., 'nav.runLoop').
 */
export function useTranslations() {
  const { lang } = useLanguage();
  
  // Translation keys resolve to strings, arrays, and object lists across the app.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useCallback(<T = any>(key: string): T => {
    const keys = key.split('.');
    let result: unknown = translations[lang] || translations.en;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // If key not found, return the key itself as a fallback
        return key as T;
      }
    }
    
    return result as T;
  }, [lang]);

  return { t };
}

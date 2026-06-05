import { useLanguage } from '@/contexts/LanguageContext';
import en from './translations/en.json';
import pt from './translations/pt.json';

const translations: Record<string, Record<string, unknown>> = {
  en,
  pt,
};

/**
 * Custom hook for translations.
 * Supports nested keys using dot notation (e.g., 'nav.runLoop').
 */
export function useTranslations() {
  const { lang } = useLanguage();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let result = translations[lang] || translations['en'];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // If key not found, return the key itself as a fallback
        return key;
      }
    }
    
    return result;
  };

  return { t };
}

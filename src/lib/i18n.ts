import { useState, useEffect, useCallback } from 'react';

// Load translation files
const loadTranslations = async (lang: string) => {
  try:
    const res = await fetch(`/translations/${lang}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to English
    if (lang !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
};

export const useTranslations = (initialLang = 'en') => {
  const [translations, setTranslations] = useState<any>({});
  const [lang, setLang] = useState<string>(initialLang);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const loadLang = async () => {
      setLoading(true);
      const trans = await loadTranslations(lang);
      if (!cancelled) {
        setTranslations(trans);
        setLoading(false);
      }
    };
    loadLang();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const t = useCallback((key: string) => {
    // Support nested keys with dot notation
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result === undefined || result === null) return key;
      result = result[k];
    }
    return result !== undefined && result !== null ? result : key;
  }, [translations]);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    // Update html lang attribute for accessibility and SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  return { t, lang, changeLang, loading };
};
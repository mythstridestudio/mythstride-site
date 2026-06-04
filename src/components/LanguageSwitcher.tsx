'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
        className="flex items-center gap-2 text-text-secondary hover:text-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        aria-label="Toggle language"
      >
        {lang === 'en' ? 'PT' : 'EN'}
        <span className="ml-1 h-4 w-4 transform transition-transform duration-300">
          {lang === 'en' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
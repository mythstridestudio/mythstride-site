'use client';

import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslations();
  const languages: Language[] = ['en', 'pt', 'es'];

  return (
    <div
      className={`inline-flex items-center border border-gold-dim/25 bg-void/55 p-0.5 ${className ?? ''}`}
      role="group"
      aria-label={t('languageSwitcher.label')}
    >
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => setLang(language)}
          className={`h-7 min-w-8 px-2 font-display text-[10px] tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-gold ${
            lang === language
              ? 'bg-gold/15 text-gold-bright'
              : 'text-text-muted hover:text-gold'
          }`}
          aria-pressed={lang === language}
          aria-label={t(`languageSwitcher.${language}`)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

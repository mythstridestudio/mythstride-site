'use client';

import { SwordsIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

interface FooterLink {
  label: string;
  href: string;
}

export default function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="relative border-t border-gold-dim/15 bg-abyss py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Brand + Links row */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-gold-dim/10 pb-9 md:flex-row">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative">
              <SwordsIcon className="w-5 h-5 text-gold group-hover:text-gold-bright transition-all duration-300" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 83, 0.3))' }} />
            </div>
            <span className="font-display text-gold text-lg tracking-wider">
              MYTH<span className="text-gold-bright">STRIDE</span>
            </span>
          </a>

          {/* Links */}
          <nav aria-label="Footer" className="flex max-w-2xl flex-wrap justify-center text-sm">
            {t('footer.footerLinks').map((link: FooterLink, index: number) => (
              <a
                key={index}
                href={link.href}
                className="mx-3 my-2 whitespace-nowrap text-text-muted transition-colors duration-300 hover:text-gold sm:mx-4"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-7 pt-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="text-center text-xs text-text-muted md:text-left">
            &copy; {new Date().getFullYear()} {t('footer.rights')}
          </div>

          {/* Social links */}
          <nav aria-label="Social media" className="flex flex-wrap items-center justify-center text-xs">
            {t('footer.footerSocialLinks').map((link: FooterLink, index: number) => (
              <a
                key={index}
                href={link.href}
                className="mx-3 my-1.5 whitespace-nowrap text-text-muted transition-colors duration-300 hover:text-gold sm:mx-4"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="max-w-xs text-center text-xs leading-relaxed text-text-muted md:justify-self-end md:text-right">
            {t('footer.tagline')}
          </div>
        </div>
      </div>
    </footer>
  );
}

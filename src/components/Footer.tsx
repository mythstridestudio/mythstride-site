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
    <footer className="relative py-14 bg-abyss border-t border-gold-dim/15">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand + Links row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gold-dim/10">
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
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {t('footer.footerLinks').map((link: FooterLink, index: number) => (
              <a
                key={index}
                href={link.href}
                className="text-text-muted hover:text-gold transition-colors duration-300 tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} {t('footer.rights')}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6 text-xs">
            {t('footer.footerSocialLinks').map((link: FooterLink, index: number) => (
              <a
                key={index}
                href={link.href}
                className="text-text-muted hover:text-gold transition-colors duration-300 tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-text-muted text-xs max-w-xs text-center md:text-right leading-relaxed">
            {t('footer.tagline')}
          </div>
        </div>
      </div>
    </footer>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assets';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navigation() {
  const { t } = useTranslations();
  const { isAuthenticated, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t('nav.runLoop'), href: '#how-it-works' },
    { label: t('nav.elyndor'), href: '#world' },
    { label: t('nav.loot'), href: '#features' },
    { label: t('nav.bosses'), href: '#bosses' },
    { label: t('nav.aethron'), href: '#aethron' },
    { label: t('nav.app'), href: '#app' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return;
    }

    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/92 backdrop-blur-md border-b border-gold-dim/20'
          : 'bg-gradient-to-b from-void/80 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <a
          href="#"
          className="flex items-center gap-2.5 group"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('#');
          }}
        >
          <img src={getAssetPath('/images/mythstride-app-icon.png')} alt="" className="h-9 w-9 rounded-full object-cover shadow-[0_0_18px_rgba(212,168,83,0.18)]" />
          <span className="font-display text-gold text-lg tracking-wider sm:text-xl">
            Myth<span className="text-gold-bright">Stride</span>
          </span>
        </a>

        <div className="hidden items-center font-body text-[13px] lg:flex xl:text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative mx-2.5 whitespace-nowrap text-text-secondary transition-all duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-gold after:to-gold-bright after:transition-all after:duration-300 hover:text-gold hover:after:w-full xl:mx-3.5"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="myth-button-secondary hidden px-5 py-2.5 font-display text-xs tracking-wider lg:inline-flex"
              >
                {t('nav.dashboard')}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="myth-button-primary hidden px-5 py-2.5 font-display text-xs tracking-wider lg:inline-flex"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link
              href={loading ? "#join" : "/login"}
              className="myth-button-primary hidden px-5 py-2.5 font-display text-xs tracking-wider lg:inline-flex"
            >
              {loading ? t('nav.joinWaitlist') : t('nav.login')}
            </Link>
          )}

          <button
            className="flex cursor-pointer flex-col gap-1.5 p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t('authTopbar.closeMenu') : t('authTopbar.openMenu')}
          >
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-400 lg:hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="app-panel app-panel-compact rpg-card mx-4 mb-4 flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-gold transition-colors font-body text-sm py-2 tracking-wider"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(link.href);
                setMobileOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher className="mt-4" />
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="myth-button-secondary mt-2 px-6 py-3 font-display text-sm tracking-wider"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <button
                type="button"
                className="myth-button-primary mt-2 px-6 py-3 font-display text-sm tracking-wider"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link
              href={loading ? "#join" : "/login"}
              className="myth-button-primary mt-2 px-6 py-3 font-display text-sm tracking-wider"
              onClick={() => setMobileOpen(false)}
            >
              {loading ? t('nav.joinWaitlist') : t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

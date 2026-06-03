'use client';

import { useState, useEffect } from 'react';
const navLinks = [
  { label: 'Run Loop', href: '#how-it-works' },
  { label: 'Elyndor', href: '#world' },
  { label: 'Loot', href: '#features' },
  { label: 'Bosses', href: '#bosses' },
  { label: 'Aethron', href: '#aethron' },
  { label: 'Legend', href: '#legend' },
  { label: 'App', href: '#app' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <img src="/images/mythstride-app-icon.png" alt="" className="h-9 w-9 rounded-full object-cover shadow-[0_0_18px_rgba(212,168,83,0.18)]" />
          <span className="font-display text-gold text-lg tracking-wider sm:text-xl">
            Myth<span className="text-gold-bright">Stride</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-body text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-gold transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-gradient-to-r after:from-gold after:to-gold-bright after:transition-all after:duration-300 hover:after:w-full tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#join"
            className="gold-button hidden min-h-0 px-5 py-2.5 font-display text-xs tracking-wider sm:inline-flex"
          >
            Join Waitlist
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-gold transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="app-panel app-panel-compact mx-4 mb-4 px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-gold transition-colors font-body text-sm py-2 tracking-wider"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="gold-button mt-2 px-6 py-3 font-display text-sm tracking-wider"
            onClick={() => setMobileOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

import { SwordsIcon } from './Icons';

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Press Kit', href: '#' },
  { label: 'Support', href: '#' },
];

const footerSocialLinks = [
  { label: 'Twitter / X', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
];

export default function Footer() {
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
            {footerLinks.map((link) => (
              <a
                key={link.label}
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
            &copy; {new Date().getFullYear()} MythStride. All rights reserved.
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6 text-xs">
            {footerSocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-muted hover:text-gold transition-colors duration-300 tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-text-muted text-xs max-w-xs text-center md:text-right leading-relaxed">
            Transform your runs. Conquer the realm.
          </div>
        </div>
      </div>
    </footer>
  );
}

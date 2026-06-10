import ScrollReveal from './ScrollReveal';
import { CrossedSwordsIcon } from './Icons';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}

export default function SectionHeader({ label, title, description, align = 'center' }: SectionHeaderProps) {
  return (
    <ScrollReveal className={`mb-11 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`mb-5 flex items-center justify-center gap-2.5 sm:gap-3 ${align === 'left' ? '' : 'mx-auto'}`}>
        <span className="h-px w-8 bg-gradient-to-l from-gold-dim/50 to-transparent" />
        <CrossedSwordsIcon className="w-3.5 h-3.5 text-gold-dim/60" />
        <span className="font-body text-[10px] uppercase tracking-[0.24em] text-gold-muted sm:text-xs sm:tracking-[0.3em]">{label}</span>
        <CrossedSwordsIcon className="w-3.5 h-3.5 text-gold-dim/60" />
        <span className="h-px w-8 bg-gradient-to-r from-gold-dim/50 to-transparent" />
      </div>

      <h2 className={`rpg-heading mb-5 text-balance font-display text-3xl leading-[1.12] text-gold sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}>
        {title}
      </h2>

      {description && (
        <p className={`rpg-copy text-pretty text-base leading-7 text-text-secondary md:text-lg md:leading-8 ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>
          {description}
        </p>
      )}

      <div className={`flex items-center justify-center gap-2 mt-8 ${align === 'left' ? '' : 'mx-auto'}`}>
        <span className="w-12 h-px bg-gradient-to-l from-gold-dim/30 to-transparent" />
        <span className="flex gap-1.5">
          <span className="gothic-diamond-bright" />
          <span className="gothic-diamond" />
          <span className="gothic-diamond-bright" />
        </span>
        <span className="w-12 h-px bg-gradient-to-r from-gold-dim/30 to-transparent" />
      </div>
    </ScrollReveal>
  );
}

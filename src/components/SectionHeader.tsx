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
    <ScrollReveal className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`flex items-center justify-center gap-3 mb-5 ${align === 'left' ? '' : 'mx-auto'}`}>
        <span className="h-px w-8 bg-gradient-to-l from-gold-dim/50 to-transparent" />
        <CrossedSwordsIcon className="w-3.5 h-3.5 text-gold-dim/60" />
        <span className="text-gold-muted text-xs tracking-[0.3em] uppercase font-body">{label}</span>
        <CrossedSwordsIcon className="w-3.5 h-3.5 text-gold-dim/60" />
        <span className="h-px w-8 bg-gradient-to-r from-gold-dim/50 to-transparent" />
      </div>

      <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl text-gold mb-6 leading-tight ${align === 'center' ? 'max-w-3xl mx-auto' : ''}`}>
        {title}
      </h2>

      {description && (
        <p className={`text-text-secondary text-base md:text-lg leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
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

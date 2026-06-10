'use client';

import { motion, useReducedMotion } from 'framer-motion';

type MythProgressVariant = 'hp' | 'xp' | 'stamina' | 'ember' | 'emerald';
type MythProgressSize = 'sm' | 'md' | 'lg';

interface MythProgressMeterProps {
  value?: number | null;
  max?: number | null;
  label?: string;
  variant?: MythProgressVariant;
  showPercent?: boolean;
  size?: MythProgressSize;
  className?: string;
}

const variantClasses: Record<MythProgressVariant, string> = {
  hp: 'from-[#8f2f28] via-hp-red to-amber shadow-[0_0_14px_rgba(232,98,42,0.34)]',
  xp: 'from-[#786027] via-gold-dim to-gold-bright shadow-[0_0_14px_rgba(212,168,83,0.28)]',
  stamina: 'from-[#49652d] via-[#789447] to-amber shadow-[0_0_14px_rgba(154,184,80,0.24)]',
  ember: 'from-hp-red via-fiery-orange to-amber shadow-[0_0_14px_rgba(232,98,42,0.34)]',
  emerald: 'from-[#176348] via-emerald to-[#8cddb5] shadow-[0_0_14px_rgba(47,212,143,0.24)]',
};

const sizeClasses: Record<MythProgressSize, string> = {
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-6',
};

export default function MythProgressMeter({
  value,
  max = 100,
  label = 'Progress',
  variant = 'hp',
  showPercent = true,
  size = 'md',
  className = '',
}: MythProgressMeterProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeMax = typeof max === 'number' && Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  const clampedValue = Math.min(safeMax, Math.max(0, safeValue));
  const percent = (clampedValue / safeMax) * 100;
  const roundedPercent = Math.round(percent);

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
      className={`relative overflow-hidden rounded-full border border-gold-dim/45 bg-[#090807] p-[2px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),0_0_0_1px_rgba(84,62,32,0.24)] ${sizeClasses[size]} ${className}`}
    >
      <div className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(180deg,#17110d,#080706)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]">
        <motion.div
          className={`absolute inset-0 origin-left overflow-hidden rounded-full bg-gradient-to-r ${variantClasses[variant]}`}
          initial={prefersReducedMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.25, 0.4, 0.2, 1] }}
        >
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 via-gold-bright/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-black/30" />
          {!prefersReducedMotion && percent > 0 && (
            <motion.div
              className="absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/24 to-transparent"
              animate={{ x: ['-140%', '440%'] }}
              transition={{ duration: 2.4, repeat: 1, repeatDelay: 1.2, ease: 'easeInOut' }}
            />
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-bright/25" />
        {showPercent && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-semibold leading-none tracking-[0.08em] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.95)]">
            {roundedPercent}%
          </span>
        )}
      </div>
    </div>
  );
}

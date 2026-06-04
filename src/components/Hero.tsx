'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, startTransition } from 'react';
import { getAssetPath } from '@/lib/assets';
import { ChevronDownIcon, RunIcon } from './Icons';
import ScrollReveal from './ScrollReveal';
import { useTranslations } from '@/lib/i18n';

export default function Hero() {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-void pt-24 pb-16 md:pt-28">
      {/* Cinematic background with slow zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${getAssetPath('/images/background.png')}')`,
          animation: mounted ? 'cinematic-zoom 15s cubic-bezier(0.25, 0.4, 0.2, 1) forwards' : 'none',
        }}
      />

      {/* Fog/smoke layer */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(200, 180, 140, 0.3) 0%, transparent 60%)',
          animation: mounted ? 'fog-drift 20s ease-in-out infinite' : 'none',
        }}
      />

      {/* Multi-layer vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/40 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />

      {/* Candle/fire glow at bottom */}
      <div className="absolute inset-0 bg-candle-glow" />
      <div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full bg-ember-glow"
        style={{
          animation: mounted ? 'pulse-glow 5s ease-in-out infinite' : 'none',
        }}
      />

      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-fiery-orange/60"
            style={{
              left: `${5 + (i * 4.5) % 90}%`,
              bottom: '5%',
              animationDuration: `${5 + (i % 5) * 3}s`,
              animationDelay: `${i * 0.8}s`,
              animationName: 'ember-rise',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
        {mounted && Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`ember-d-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full bg-amber/40"
            style={{
              right: `${5 + (i * 8) % 70}%`,
              bottom: '5%',
              animationDuration: `${7 + (i % 4) * 4}s`,
              animationDelay: `${i * 1.2 + 0.5}s`,
              animationName: 'ember-drift',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
      </div>

      {/* Fire glow behind content */}
      <div
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(232, 98, 42, 0.1) 0%, rgba(212, 168, 83, 0.04) 40%, transparent 70%)',
          animation: mounted ? 'pulse-glow 4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Gold light rays */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(212, 168, 83, 0.3) 40px, rgba(212, 168, 83, 0.3) 41px)',
          animation: mounted ? 'shimmer 15s linear infinite' : 'none',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Ornate frames */}
      <div className="absolute inset-4 md:inset-8 border border-gold-dim/30 pointer-events-none" />
      <div className="absolute inset-6 md:inset-10 border border-gold-dim/15 pointer-events-none" />

      {/* Corner ornaments - larger */}
      <div className="absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 border-gold-dim/40" />
      <div className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-gold-dim/40" />
      <div className="absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 border-gold-dim/40" />
      <div className="absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 border-gold-dim/40" />

      {/* Decorative accent items */}
      <div className="absolute top-1/3 left-[8%] hidden lg:block pointer-events-none">
        <img
          src={getAssetPath('/images/fire_sword.png')}
          alt=""
          className="w-16 h-16 object-contain opacity-30"
          style={{ animation: mounted ? 'weapon-glow 4s ease-in-out infinite' : 'none' }}
        />
      </div>
      <div className="absolute top-2/3 right-[8%] hidden lg:block pointer-events-none">
        <img
          src={getAssetPath('/images/amuleto_magico.png')}
          alt=""
          className="w-14 h-14 object-contain opacity-25"
          style={{ animation: mounted ? 'item-glow 5s ease-in-out infinite' : 'none' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 mx-auto lg:grid-cols-[1.02fr_0.98fr]">
        <div className="text-center lg:text-left">
          <ScrollReveal delay={0} direction="none">
            <img
              src={getAssetPath('/images/mythstride-logo.png')}
              alt="MythStride"
              className="mx-auto mb-5 h-auto w-64 sm:w-80 lg:mx-0 lg:w-[23rem]"
            />
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <div className="inline-flex items-center gap-3 text-fiery-orange text-xs sm:text-sm tracking-[0.24em] uppercase font-body mb-5">
              <span className="w-8 h-px bg-fiery-orange/45" />
              {t('hero.aethronAwakened')}
              <span className="w-8 h-px bg-fiery-orange/45 lg:hidden" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300} direction="up">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold mb-6 leading-[1.05]">
              {t('hero.title')}
              <span className="block text-gold-bright">
                {t('hero.progress')}
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={450} direction="up">
            <p className="text-text-secondary text-base md:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={600} direction="up">
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center">
              <motion.a
                href="#join"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="gold-button px-8 py-3.5 font-display text-sm tracking-wider"
              >
                {t('hero.cta')}
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="ghost-button px-8 py-3.5 font-display text-sm tracking-wider"
              >
                {t('hero.runLoop')}
                <ChevronDownIcon className="w-4 h-4" />
              </motion.a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={780} direction="up">
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              {[t('hero.bossBattles'), t('hero.lootGear'), t('hero.aethronCompanion')].map((item, index) => (
                <span key={index} className="resource-pill text-xs text-text-secondary">
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={250} direction="right">
          <div className="relative mx-auto w-full max-w-[560px]">
            <div
              className="absolute -inset-8 boss-halo rounded-full blur-2xl opacity-80"
              style={{ animation: mounted ? 'pulse-glow 6s ease-in-out infinite' : 'none' }}
            />

            <div className="relative grid grid-cols-[0.76fr_1fr] items-end gap-3 sm:gap-5">
              <motion.div
                className="phone-shell relative -mb-3 overflow-hidden p-2 opacity-85"
                animate={mounted ? { y: [0, -7, 0] } : undefined}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={getAssetPath('/images/screen-dashboard.jpg')}
                  alt="MythStride dashboard showing player progress and current boss"
                  className="phone-screen h-auto w-full object-cover"
                />
              </motion.div>

              <motion.div
                className="phone-shell relative overflow-hidden p-2"
                animate={mounted ? { y: [0, 7, 0] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={getAssetPath('/images/screen-run.jpg')}
                  alt="MythStride run mission screen with boss progress"
                  className="phone-screen h-auto w-full object-cover"
                />
              </motion.div>
            </div>

            <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-gold-dim/30 bg-void/90 px-5 py-3 shadow-2xl sm:flex">
              <img src={getAssetPath('/images/run-button-swords.png')} alt="" className="h-12 w-12 object-contain" />
              <div className="text-left">
                <div className="font-display text-sm text-gold">{t('hero.tapToRun')}</div>
                <div className="text-xs text-text-muted">{t('hero.realRunning')}</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.22em] text-text-muted md:flex">
        <RunIcon className="h-3.5 w-3.5 text-gold-dim" />
        {t('hero.scrollToEnter')}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
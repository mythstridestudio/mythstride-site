'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { ChevronDownIcon, RunIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

const EMBERS = Array.from({ length: 26 }, (_, index) => ({
  left: `${6 + (index * 13) % 88}%`,
  delay: index * 0.34,
  duration: 5.5 + (index % 6) * 0.8,
  size: index % 4 === 0 ? 'h-1.5 w-1.5' : 'h-1 w-1',
  opacity: index % 3 === 0 ? 0.7 : 0.45,
}));

export default function Hero() {
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: false,
    animate: prefersReducedMotion ? undefined : { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.75, delay, ease: [0.25, 0.4, 0.2, 1] as const },
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-void pt-24 pb-14 md:pt-28 lg:pb-20">
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${getAssetPath('/images/background.png')}')`,
        }}
        initial={prefersReducedMotion ? false : { scale: 1.08, opacity: 0.78 }}
        animate={prefersReducedMotion ? undefined : { scale: 1.02, opacity: 1 }}
        transition={{ duration: 3.5, ease: [0.25, 0.4, 0.2, 1] }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,rgba(240,201,77,0.16),transparent_32%),linear-gradient(180deg,rgba(5,5,7,0.48)_0%,rgba(5,5,7,0.18)_38%,rgba(5,5,7,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,7,0.92)_0%,rgba(5,5,7,0.62)_28%,rgba(5,5,7,0.18)_54%,rgba(5,5,7,0.78)_100%)]" />

      <motion.div
        className="absolute -top-12 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        animate={prefersReducedMotion ? undefined : { opacity: [0.22, 0.34, 0.22], y: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute right-[-8rem] top-[7rem] hidden h-[58rem] w-[58rem] lg:block"
        initial={false}
        animate={prefersReducedMotion ? undefined : { opacity: 0.34, x: 0, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.25, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <img
          src={getAssetPath('/images/spectral-king.png')}
          alt=""
          className="h-full w-full object-contain opacity-90 saturate-[0.62] contrast-125 [filter:drop-shadow(0_0_42px_rgba(0,0,0,0.75))]"
        />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,transparent,rgba(5,5,7,0.38)_35%,rgba(5,5,7,0.96)_100%)]" />
      <div className="absolute inset-x-0 bottom-[11%] h-28 bg-[radial-gradient(ellipse_at_50%_100%,rgba(168,155,140,0.18),transparent_68%)] blur-2xl" />
      <div className="absolute bottom-0 left-[-12%] h-[28%] w-[62%] skew-x-[-16deg] bg-stone/40 opacity-55 blur-sm" />
      <div className="absolute bottom-0 right-[-16%] h-[34%] w-[58%] skew-x-[15deg] bg-rich-brown/45 opacity-65 blur-sm" />

      <motion.div
        className="pointer-events-none absolute left-[3%] top-[33%] hidden h-60 w-40 opacity-20 md:block"
        animate={prefersReducedMotion ? undefined : { y: [0, -10, 0], opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={getAssetPath('/images/aethron-full.png')}
          alt=""
          className="h-full w-full object-contain"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {EMBERS.map((ember, index) => (
          <motion.span
            key={index}
            className={`absolute bottom-[-2rem] rounded-full bg-fiery-orange ${ember.size}`}
            style={{ left: ember.left, opacity: ember.opacity }}
            animate={prefersReducedMotion ? undefined : { y: ['0vh', '-88vh'], x: [0, index % 2 ? 34 : -24], opacity: [0, ember.opacity, 0] }}
            transition={{ duration: ember.duration, delay: ember.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-4 border border-gold-dim/24 md:inset-8" />
      <div className="pointer-events-none absolute inset-6 border border-gold-dim/10 md:inset-10" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="max-w-3xl text-center lg:text-left">
          <motion.div {...reveal(0)}>
            <img
              src={getAssetPath('/images/mythstride-logo.png')}
              alt="MythStride"
              className="mx-auto mb-3 h-auto w-36 sm:w-56 lg:mx-0 lg:w-64"
            />
          </motion.div>

          <motion.div {...reveal(0.15)}>
            <div className="mb-4 inline-flex items-center gap-3 border border-emerald/20 bg-void/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-emerald shadow-[0_0_30px_rgba(47,212,143,0.08)] sm:text-sm">
              <span className="h-1.5 w-1.5 rotate-45 bg-emerald" />
              {t('hero.aethronAwakened')}
            </div>
          </motion.div>

          <motion.div {...reveal(0.3)}>
            <h1 className="mx-auto mb-4 max-w-[16.5rem] font-display text-[1.68rem] leading-[1.05] text-gold sm:max-w-none sm:text-5xl md:text-6xl lg:mx-0 lg:text-[4.45rem]">
              {t('hero.title')}
              <span className="block text-gold-bright">
                {t('hero.progress')}
              </span>
            </h1>
          </motion.div>

          <motion.div {...reveal(0.45)}>
            <p className="mx-auto mb-5 max-w-xl whitespace-pre-line text-sm leading-relaxed text-text-primary/86 sm:text-base md:text-lg lg:mx-0 lg:text-xl">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          <motion.div {...reveal(0.6)}>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
              <motion.a
                href="#join"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="myth-button-primary px-8 py-3.5 font-display text-sm tracking-wider"
              >
                {t<string>('hero.cta')}
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="myth-button-secondary px-8 py-3.5 font-display text-sm tracking-wider"
              >
                {t<string>('hero.runLoop')}
                <ChevronDownIcon className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div {...reveal(0.78)}>
            <div className="mt-5 hidden flex-wrap justify-center gap-3 sm:flex lg:justify-start">
              {[t('hero.bossBattles'), t('hero.lootGear'), t('hero.aethronCompanion')].map((item, index) => (
                <span key={index} className="resource-pill text-xs text-text-primary/78">
                  <span className="h-1.5 w-1.5 rotate-45 bg-fiery-orange" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div {...reveal(0.25)}>
          <div className="relative mx-auto h-[28rem] w-full max-w-[40rem] sm:h-[34rem] lg:h-[42rem]">
            <motion.div
              className="absolute left-1/2 top-0 h-[21rem] w-[21rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,74,69,0.26),transparent_62%)] blur-2xl sm:h-[28rem] sm:w-[28rem] lg:hidden"
              animate={prefersReducedMotion ? undefined : { opacity: [0.38, 0.62, 0.38], scale: [0.98, 1.04, 0.98] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.img
              src={getAssetPath('/images/spectral-king.png')}
              alt=""
              className="pointer-events-none absolute left-1/2 top-0 h-[20rem] w-[20rem] -translate-x-1/2 object-contain opacity-25 saturate-[0.55] contrast-125 sm:h-[28rem] sm:w-[28rem] lg:hidden"
              initial={false}
              animate={prefersReducedMotion ? undefined : { opacity: 0.25, y: 0 }}
              transition={{ duration: 1.4, delay: 0.2 }}
            />

            <div className="absolute bottom-0 left-1/2 grid w-[min(100%,32rem)] -translate-x-1/2 grid-cols-[0.82fr_1fr] items-end gap-3 sm:gap-5 lg:w-[36rem]">
              <motion.div
                className="phone-shell relative -mb-2 overflow-hidden p-1.5 opacity-90 sm:p-2 lg:-mb-5"
                animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={getAssetPath('/images/screen-dashboard.jpg')}
                  alt="MythStride dashboard showing player progress and current boss"
                  className="phone-screen h-auto w-full object-cover"
                />
              </motion.div>

              <motion.div
                className="phone-shell relative overflow-hidden p-1.5 sm:p-2"
                animate={prefersReducedMotion ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={getAssetPath('/images/screen-run.jpg')}
                  alt="MythStride run mission screen with boss progress"
                  className="phone-screen h-auto w-full object-cover"
                />
              </motion.div>
            </div>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gold-dim/30 bg-void/92 px-4 py-2.5 shadow-2xl shadow-black/50 backdrop-blur-sm sm:bottom-4 sm:px-5 sm:py-3">
              <img src={getAssetPath('/images/run-button-swords.png')} alt="" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
              <div className="text-left">
                <div className="font-display text-sm text-gold">{t('hero.tapToRun')}</div>
                <div className="hidden text-xs text-text-muted sm:block">{t('hero.realRunning')}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.22em] text-text-muted md:flex">
        <RunIcon className="h-3.5 w-3.5 text-gold-dim" />
        {t('hero.scrollToEnter')}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { BookIcon, CrownIcon, GemIcon, RunIcon, ScrollIcon, ShieldIcon, SwordsIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface Screen {
  title: string;
  chapter: string;
  copy: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const fallbackScreens: Screen[] = [
  {
    title: 'Dashboard',
    chapter: 'Start your journey',
    copy: 'Player level, HP, XP, currencies, current boss, missions, and navigation are already in the live app interface.',
    image: '/images/screen-dashboard.jpg',
    alt: 'MythStride dashboard with player progress, currencies, current boss, and missions',
    icon: BookIcon,
    accent: 'gold',
  },
  {
    title: 'Run Screen',
    chapter: 'Complete real-world runs',
    copy: 'The run mission screen connects distance, time, pace, calories, XP, and active mission status in one RPG workout view.',
    image: '/images/screen-run.jpg',
    alt: 'MythStride run mission screen with running stats and XP progress',
    icon: RunIcon,
    accent: 'emerald',
  },
  {
    title: 'Boss Screen',
    chapter: 'Damage powerful enemies',
    copy: 'Boss progress is visible during the mission, turning effort into damage against the weekly enemy.',
    image: '/images/screen-run.jpg',
    alt: 'MythStride boss mission screen showing the weekly Harpy boss and health progress',
    icon: SwordsIcon,
    accent: 'ember',
  },
  {
    title: 'Inventory',
    chapter: 'Collect rewards',
    copy: 'The arsenal already shows gear, prices, rarity, vendors, gold, and diamonds with a consistent fantasy interface.',
    image: '/images/screen-inventory.jpg',
    alt: 'MythStride inventory and shop screen with armor, helmet, sword, and boots',
    icon: ShieldIcon,
    accent: 'gold',
  },
  {
    title: 'Aethron',
    chapter: 'Receive guidance',
    copy: 'Aethron gives post-run context and makes the app feel guided, not just tracked.',
    image: '/images/screen-aethron.jpg',
    alt: 'MythStride Aethron companion screen',
    icon: ScrollIcon,
    accent: 'emerald',
  },
  {
    title: 'Achievements',
    chapter: 'Become a legend',
    copy: 'The shareable chronicle records distance, pace, duration, boss damage, streak, and the run identity earned that day.',
    image: '/images/screen-share.jpg',
    alt: 'MythStride shareable run chronicle with distance, pace, duration, boss damage, and streak',
    icon: CrownIcon,
    accent: 'diamond',
  },
];

const accentClasses: Record<string, string> = {
  gold: 'border-gold-dim/45 text-gold bg-gold/10',
  emerald: 'border-emerald/35 text-emerald bg-emerald/10',
  ember: 'border-fiery-orange/40 text-fiery-orange bg-fiery-orange/10',
  diamond: 'border-diamond/35 text-diamond bg-diamond/10',
};

export default function AppShowcase() {
  const { t } = useTranslations();
  const translatedScreens = t<Partial<Screen>[]>('appShowcase.screens');
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const screens = fallbackScreens.map((screen, index) => ({
    ...screen,
    ...(translatedScreens?.[index] ?? {}),
  }));
  const activeScreen = screens[activeIndex];
  const ActiveIcon = activeScreen.icon;

  return (
    <section id="app" className="cinematic-section relative overflow-hidden bg-deep-charcoal py-20 md:py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(212,168,83,0.08),transparent_48%),linear-gradient(180deg,rgba(5,5,7,0.34),rgba(18,18,24,0.98)_36%,rgba(5,5,7,0.92))]" />
      <ParallaxLayer direction="up" intensity={24} className="absolute inset-x-[-12%] top-24 h-80 bg-[radial-gradient(ellipse_at_center,rgba(47,212,143,0.09),transparent_64%)] blur-3xl" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-l from-gold-dim/50 to-transparent" />
            <SwordsIcon className="h-3.5 w-3.5 text-gold-dim/60" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gold-muted">{t('appShowcase.sectionHeader.label')}</span>
            <SwordsIcon className="h-3.5 w-3.5 text-gold-dim/60" />
            <span className="h-px w-8 bg-gradient-to-r from-gold-dim/50 to-transparent" />
          </div>

          <h2 className="rpg-heading mx-auto mb-6 max-w-3xl font-display text-3xl leading-tight text-gold sm:text-4xl md:text-5xl lg:text-6xl">
            {t('appShowcase.sectionHeader.title')}
          </h2>

          <p className="rpg-copy mx-auto max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {t('appShowcase.sectionHeader.description')}
          </p>

          <div className="mx-auto mt-8 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-gradient-to-l from-gold-dim/30 to-transparent" />
            <span className="flex gap-1.5">
              <span className="gothic-diamond-bright" />
              <span className="gothic-diamond" />
              <span className="gothic-diamond-bright" />
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-gold-dim/30 to-transparent" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative mx-auto max-w-[25rem] lg:max-w-[31rem]">
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.16),rgba(47,212,143,0.08)_34%,transparent_68%)] blur-3xl" />
            <div className="rpg-inset relative border-gold-dim/35 p-3 shadow-[0_32px_110px_rgba(0,0,0,0.72)]">
              <div className="pointer-events-none absolute inset-2 border border-gold-dim/15" />
              <div className="mb-3 flex items-center justify-between gap-4 border-b border-gold-dim/20 px-2 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center border ${accentClasses[activeScreen.accent]}`}>
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-gold-muted">{activeScreen.chapter}</div>
                    <div className="font-display text-xl text-gold">{activeScreen.title}</div>
                  </div>
                </div>
                <div className="font-mono text-xs text-text-muted">{String(activeIndex + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}</div>
              </div>

              <motion.div
                key={activeScreen.image + activeIndex}
                initial={prefersReducedMotion ? false : { opacity: 0.45, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.25, 0.4, 0.2, 1] }}
                className="phone-shell overflow-hidden p-2"
              >
                <img
                  src={getAssetPath(activeScreen.image)}
                  alt={activeScreen.alt}
                  className="phone-screen h-auto w-full object-cover"
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-panel app-panel-compact rpg-card overflow-hidden p-4 sm:p-5 md:p-6">
              <div className="relative z-10">
                <div className="mb-5 flex items-center gap-3">
                  <GemIcon className="h-4 w-4 text-gold" />
                  <span className="text-xs uppercase tracking-[0.28em] text-gold-muted">{t('appShowcase.archiveLabel')}</span>
                </div>

                <div className="grid gap-3">
                  {screens.map((screen, index) => {
                    const Icon = screen.icon;
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={`${screen.title}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`group myth-button-secondary !grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 p-3 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-gold/60 shadow-[0_0_28px_rgba(227,186,115,0.14)]'
                            : 'border-gold-dim/45'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center border ${accentClasses[screen.accent]}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="font-display text-base text-gold">{screen.title}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-text-muted">{screen.chapter}</div>
                        </div>
                        <div className="hidden h-16 w-10 overflow-hidden border border-gold-dim/20 bg-void sm:block">
                          <img src={getAssetPath(screen.image)} alt="" className="h-full w-full object-cover" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rpg-inset relative p-5 shadow-[0_22px_70px_rgba(0,0,0,0.42)]">
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald/45 to-transparent" />
              <div className="mb-2 text-xs uppercase tracking-[0.26em] text-emerald">{activeScreen.chapter}</div>
              <p className="text-sm leading-relaxed text-text-secondary md:text-base">{activeScreen.copy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

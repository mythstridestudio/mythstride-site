'use client';

import { useEffect, useState, startTransition } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { SwordsIcon, ShieldIcon, EyeIcon } from './Icons';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { useTranslations } from '@/lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import MythProgressMeter from './ui/MythProgressMeter';

export default function BossBattle() {
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  const bosses = [
    {
      name: t('bossBattle.bosses.0.name'),
      source: t('bossBattle.bosses.0.source'),
      image: '/images/boss-arpia.png',
    },
    {
      name: t('bossBattle.bosses.1.name'),
      source: t('bossBattle.bosses.1.source'),
      image: '/images/boss-dragao-ancestral.png',
    },
    {
      name: t('bossBattle.bosses.2.name'),
      source: t('bossBattle.bosses.2.source'),
      image: '/images/lich-do-abismo.png',
    },
  ];

  return (
    <section id="bosses" className="cinematic-section relative overflow-hidden bg-void py-20 md:py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <ParallaxLayer
        direction="down"
        intensity={28}
        className="absolute -inset-y-10 inset-x-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${getAssetPath('/images/background.png')}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
      <div
        className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(216,74,69,0.13) 0%, rgba(232,98,42,0.06) 34%, transparent 68%)',
          animation: mounted && !prefersReducedMotion ? 'pulse-glow 6s ease-in-out infinite' : 'none',
        }}
      />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          label={t('bossBattle.sectionHeader.label')}
          title={t('bossBattle.sectionHeader.title')}
          description={t('bossBattle.sectionHeader.description')}
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ScrollReveal direction="left">
            <div className="app-panel rpg-card relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 boss-halo opacity-80" />
              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
                {bosses.map((boss, index) => (
                  <div key={boss.name} className={`${index === 2 ? 'sm:col-span-1' : ''} rpg-inset relative overflow-hidden rounded-[18px] p-3`}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-rich-brown/40">
                      <ParallaxLayer direction="up" intensity={12 + index * 3} mobileScale={0.3} className="absolute inset-0">
                        <img
                          src={getAssetPath(boss.image)}
                          alt={boss.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(232,98,42,0.18)]"
                        />
                      </ParallaxLayer>
                    </div>
                    <div className="mt-3">
                      <h3 className="rpg-heading font-display text-lg text-gold">{boss.name}</h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{boss.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={180}>
            <div className="space-y-5">
              <div className="rpg-inset rounded-[20px] border-fiery-orange/25 p-5 sm:p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-fiery-orange">
                  <EyeIcon className="h-3.5 w-3.5" />
                  {t('bossBattle.theSpectralKing')}
                </div>
                <h3 className="rpg-heading font-display text-2xl leading-tight text-gold sm:text-3xl">
                  {t('bossBattle.firstCommanderSealed')}
                </h3>
                <p className="rpg-copy mt-4 leading-relaxed text-text-secondary">
                  {t('bossBattle.everyBossBattleSign')}
                </p>
              </div>

              <div className="rpg-inset rounded-[18px] p-5">
                <div className="mb-2 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-text-muted">
                  <span className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-fiery-orange" />
                    {t('bossBattle.mistPressure')}
                  </span>
                  <span className="text-fiery-orange">{t('bossBattle.mistPressureRising')}</span>
                </div>
                <MythProgressMeter
                  value={62}
                  label={t('bossBattle.mistPressure')}
                  showPercent={false}
                  size="sm"
                />
              </div>

              <div className="text-center text-[10px] uppercase tracking-[0.25em] text-text-muted">
                <span className="mr-3 inline-block h-px w-10 bg-gold-dim/30 align-middle" />
                <SwordsIcon className="mr-2 inline h-3.5 w-3.5 text-gold" />
                {t('bossBattle.everyRunStrike')}
                <span className="ml-3 inline-block h-px w-10 bg-gold-dim/30 align-middle" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

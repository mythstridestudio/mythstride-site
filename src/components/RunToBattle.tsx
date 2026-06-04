'use client';

import { useEffect, useState, startTransition } from 'react';
import { getAssetPath } from '@/lib/assets';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { RunIcon, SwordsIcon, ShieldIcon, TrophyIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

interface LoopStep {
  title: string;
  copy: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function RunToBattle() {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-deep-charcoal py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-35" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${getAssetPath('/images/aethron-scroll-bg.png')}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-deep-charcoal/80 to-void/40" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div
        className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232,98,42,0.08) 0%, rgba(47,212,143,0.04) 34%, transparent 68%)',
          animation: mounted ? 'pulse-glow 7s ease-in-out infinite' : 'none',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label={t('runToBattle.sectionHeader.label')}
          title={t('runToBattle.sectionHeader.title')}
          description={t('runToBattle.sectionHeader.description')}
        />

        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal direction="left">
            <div className="relative mx-auto max-w-sm">
              <div className="phone-shell overflow-hidden p-2">
                <img
                  src={getAssetPath('/images/screen-run.jpg')}
                  alt="MythStride mission screen showing a real run converted into boss progress"
                  className="phone-screen h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gold-dim/30 bg-void/90 px-5 py-3 shadow-2xl">
                <img src={getAssetPath('/images/run-button-swords.png')} alt="" className="h-11 w-11 object-contain" />
                <div>
                  <div className="font-display text-sm text-gold">{t('runToBattle.cta')}</div>
                  <div className="text-xs text-text-muted">{t('runToBattle.appLoopNotDashboard')}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-5">
            {t('runToBattle.loop').map((step: LoopStep, index: number) => {
              const Icon = step.icon;

              return (
                <ScrollReveal key={step.title} delay={index * 120} direction="right">
                  <div className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-6">
                    <div className="relative z-10 flex gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-gold-dim/30 bg-void/70">
                        <Icon className="h-7 w-7 text-gold" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold-muted">
                          <ShieldIcon className="h-3.5 w-3.5" />
                          Step {index + 1}
                        </div>
                        <h3 className="font-display text-xl text-gold">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.copy}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            <ScrollReveal delay={420} direction="up">
              <div className="rounded-[22px] border border-emerald/25 bg-emerald/5 p-5 text-center">
                <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
                  {t('runToBattle.everyKmStrengthensFlame')}
                  <span className="block text-emerald">{t('runToBattle.everyBattleWeakensMist')}</span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
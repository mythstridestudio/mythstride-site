'use client';

import { useEffect, useState, startTransition } from 'react';
import { getAssetPath } from '@/lib/assets';
import { SparkleIcon } from './Icons';
import ScrollReveal from './ScrollReveal';
import { useTranslations } from '@/lib/i18n';
import WaitlistForm from './WaitlistForm';

export default function FinalCTA() {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section id="join" className="cinematic-section relative overflow-hidden bg-void py-24 md:py-36">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${getAssetPath('/images/background.png')}')`,
          animation: mounted ? 'cinematic-zoom 15s cubic-bezier(0.25, 0.4, 0.2, 1) forwards' : 'none',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/72 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
      <div className="absolute inset-8 border border-gold-dim/20 pointer-events-none" />
      <div className="absolute inset-12 border border-gold-dim/10 pointer-events-none" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {mounted && Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-fiery-orange/50"
            style={{
              left: `${8 + (index * 6) % 86}%`,
              bottom: '4%',
              animation: `ember-rise ${7 + (index % 4) * 2}s linear ${index * 0.7}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <ScrollReveal direction="none">
          <div className="mb-8 flex justify-center">
            <SparkleIcon className="h-8 w-8 text-emerald" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} direction="up">
          <blockquote className="rpg-heading mx-auto max-w-3xl space-y-5 font-display text-2xl leading-tight text-gold-bright sm:text-3xl md:text-5xl">
            <p>{t('finalCTA.blockquote1.0')}</p>
            <p>{t('finalCTA.blockquote1.1')}</p>
            <p>{t('finalCTA.blockquote1.2')}</p>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={260} direction="up">
          <div className="mx-auto my-9 h-px max-w-lg bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent" />
          <blockquote className="mx-auto max-w-2xl space-y-2 text-lg leading-relaxed text-text-primary md:text-xl">
            <p>{t('finalCTA.blockquote2.0')}</p>
            <p className="font-display text-gold">{t('finalCTA.blockquote2.1')}</p>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={420} direction="up">
          <p className="mx-auto mt-9 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {t('finalCTA.joinWaitlistAndBeAmongFirst')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={560} direction="up">
          <WaitlistForm className="mt-9" />
        </ScrollReveal>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { CrownIcon, MapIcon, ShieldIcon, SparkleIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

interface Realm {
  title: string;
  copy: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function WorldSection() {
  const { t } = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const realmsData = t('worldSection.realms');
  const icons = [MapIcon, CrownIcon, ShieldIcon];

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cleanup: (() => void) | undefined;

    async function setupParallax() {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap.to(bgRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(mistRef.current, {
          yPercent: -12,
          opacity: 0.74,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }, sectionRef);

      cleanup = () => context.revert();
    }

    setupParallax();

    return () => cleanup?.();
  }, [prefersReducedMotion]);

  const realms: Realm[] = (Array.isArray(realmsData) ? realmsData : []).map((realm: unknown, i: number) => {
    const data = realm as Record<string, unknown>;
    return {
      title: String(data.title || ''),
      copy: String(data.copy || ''),
      icon: icons[i % icons.length]
    };
  });

  return (

    <section id="world" ref={sectionRef} className="cinematic-section relative overflow-hidden bg-void py-20 md:py-32">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center opacity-32"
        style={{ backgroundImage: `url('${getAssetPath('/images/aethron-scroll-bg.png')}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/40 to-void" />
      <div ref={mistRef} className="absolute inset-x-[-12%] top-1/3 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,224,208,0.16),transparent_64%)] blur-3xl" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          label={t('worldSection.sectionHeader.label')}
          title={t('worldSection.sectionHeader.title')}
          description={t('worldSection.sectionHeader.description')}
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ScrollReveal direction="left">
            <div className="app-panel rpg-card relative overflow-hidden p-5 sm:p-6 md:p-8">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-45"
                style={{ backgroundImage: `url('${getAssetPath('/images/background.png')}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-void via-void/82 to-void/30" />
              <div className="relative max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald">
                  <SparkleIcon className="h-3.5 w-3.5" />
                  {t('worldSection.theDarkMist')}
                </div>
                <h3 className="rpg-heading font-display text-3xl leading-tight text-gold md:text-5xl">
                  {t('worldSection.itDidNotDestroyCities')}
                </h3>
                <p className="rpg-copy mt-5 max-w-xl leading-relaxed text-text-secondary">
                  {t('worldSection.peopleStoppedFighting')}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {realms.map((realm: Realm, index: number) => {
              const Icon = realm.icon;

              return (
                <ScrollReveal key={realm.title} delay={index * 120} direction="right">
                  <div className="rpg-inset relative rounded-[18px] p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-dim/30 bg-gold/8">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="rpg-heading font-display text-xl text-gold">{realm.title}</h3>
                        <p className="rpg-copy mt-2 text-sm leading-relaxed text-text-secondary">{realm.copy}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

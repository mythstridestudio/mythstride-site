'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import ScrollReveal from './ScrollReveal';
import { EyeIcon, SparkleIcon, SwordsIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

type LoreChapter = {
  eyebrow: string;
  title: string;
  accent: 'gold' | 'emerald' | 'ember';
  lines: string[];
};

export default function AethronLegend() {
  const { t } = useTranslations();
  const chapters: LoreChapter[] = t('aethronLegend.loreChapters');
  
  const accentClasses = {
    gold: 'text-gold border-gold-dim/30 bg-gold/10',
    emerald: 'text-emerald border-emerald/30 bg-emerald/10',
    ember: 'text-fiery-orange border-fiery-orange/30 bg-fiery-orange/10',
  };

  function LoreChapterPanel({ chapter, index }: { chapter: LoreChapter; index: number }) {
    return (
      <ScrollReveal delay={index * 90} direction="up" className="relative">
        <article className="relative border-l border-gold-dim/25 pl-6 md:pl-8">
          <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rotate-45 border border-gold-dim/50 bg-void shadow-[0_0_18px_rgba(212,168,83,0.25)]" />
          <div className={`mb-4 inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${accentClasses[chapter.accent]}`}>
            {chapter.eyebrow}
          </div>
          <h3 className="font-display text-2xl text-gold md:text-3xl">{chapter.title}</h3>
          <div className="mt-5 space-y-3">
            {chapter.lines.map((line, lineIndex) => (
              <motion.p
                key={line}
                className={`max-w-2xl leading-relaxed ${
                  lineIndex < 2 ? 'text-text-primary' : 'text-text-secondary'
                }`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.55, delay: lineIndex * 0.08, ease: [0.25, 0.4, 0.2, 1] }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </article>
      </ScrollReveal>
    );
  }

  const sectionRef = useRef<HTMLElement>(null);
  const ruinsRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

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
        gsap.to(ruinsRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(mistRef.current, {
          yPercent: -10,
          opacity: 0.72,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.to(figureRef.current, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }, sectionRef);

      cleanup = () => context.revert();
    }

    setupParallax();

    return () => {
      cleanup?.();
    };
  }, [prefersReducedMotion]);

  return (
    <section id="legend" ref={sectionRef} className="relative overflow-hidden bg-void py-24 md:py-32">
      <div
        ref={ruinsRef}
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url('${getAssetPath('/images/aethron-scroll-bg.png')}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/45 to-void" />
      <div ref={mistRef} className="absolute inset-x-0 top-1/4 h-2/3 bg-[radial-gradient(ellipse_at_center,rgba(232,224,208,0.12),transparent_62%)] opacity-50 blur-2xl" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-fiery-orange/50"
            style={{
              left: `${8 + (index * 7) % 86}%`,
              bottom: `${index % 4}%`,
              animation: `ember-rise ${7 + (index % 5) * 2}s linear ${index * 0.55}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="gold-divider absolute left-0 right-0 top-0" />
      <div className="gold-divider absolute bottom-0 left-0 right-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <ScrollReveal direction="none">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-l from-gold-dim/50 to-transparent" />
              <EyeIcon className="h-4 w-4 text-emerald" />
              <span className="text-xs uppercase tracking-[0.28em] text-gold-muted">{t('aethronLegend.theLegendOfAethron')}</span>
              <EyeIcon className="h-4 w-4 text-emerald" />
              <span className="h-px w-12 bg-gradient-to-r from-gold-dim/50 to-transparent" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h2 className="font-display text-4xl leading-tight text-gold md:text-6xl">
              {t('aethronLegend.beforeTheRunThereWasTheFlame')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {t('aethronLegend.elyndorDidNotFallInSingleWar')}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div className="relative lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
            <div className="app-panel relative flex min-h-[560px] items-end justify-center overflow-hidden p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url('${getAssetPath('/images/background.png')}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-void/10 via-void/20 to-void" />
              <div className="absolute inset-x-0 top-12 mx-auto h-72 w-72 rounded-full bg-emerald/10 blur-3xl" />
              <img
                ref={figureRef}
                src={getAssetPath('/images/aethron-full.png')}
                alt="Aethron, the ancient spirit guide of MythStride"
                className="relative z-10 max-h-[480px] w-auto max-w-full object-contain drop-shadow-[0_0_34px_rgba(47,212,143,0.18)]"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-gold-dim/25 bg-void/82 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-emerald">
                  <SparkleIcon className="h-3.5 w-3.5" />
                  {t('aethronAI.keeperOfTheFlame')}
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {t('aethronAI.wiseCalmProtectiveSearching')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-14 md:space-y-20">
            {chapters.map((chapter, index) => (
              <LoreChapterPanel key={chapter.title} chapter={chapter} index={index} />
            ))}

            <ScrollReveal direction="up">
              <div className="relative overflow-hidden rounded-[28px] border border-fiery-orange/25 bg-void/80 p-6 md:p-8">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url('${getAssetPath('/images/spectral-king.png')}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-void via-void/86 to-void/45" />
                <div className="relative max-w-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-fiery-orange">
                    <SwordsIcon className="h-3.5 w-3.5" />
                    {t('aethronLegend.theSealedDarkness')}
                  </div>
                  <h3 className="font-display text-2xl text-gold md:text-3xl">{t('aethronLegend.spectralKingWaitsBeneathMist')}</h3>
                  <p className="mt-4 leading-relaxed text-text-secondary">
                    {t('aethronLegend.mythStrideGivesEveryRunAPlace')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
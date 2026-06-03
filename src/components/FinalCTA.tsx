'use client';

import { useEffect, useState, startTransition } from 'react';
import { SwordsIcon, SparkleIcon } from './Icons';
import ScrollReveal from './ScrollReveal';

export default function FinalCTA() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section id="join" className="relative overflow-hidden bg-void py-28 md:py-36">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.png')",
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

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal direction="none">
          <div className="mb-8 flex justify-center">
            <SparkleIcon className="h-8 w-8 text-emerald" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} direction="up">
          <blockquote className="mx-auto max-w-3xl space-y-5 font-display text-3xl leading-tight text-gold-bright md:text-5xl">
            <p>&quot;Finally...</p>
            <p>After centuries of silence...</p>
            <p>I have found someone capable of hearing my voice.&quot;</p>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={260} direction="up">
          <div className="mx-auto my-9 h-px max-w-lg bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent" />
          <blockquote className="mx-auto max-w-2xl space-y-2 text-lg leading-relaxed text-text-primary md:text-xl">
            <p>&quot;Walking is no longer enough.</p>
            <p className="font-display text-gold">We will need to run.&quot;</p>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={420} direction="up">
          <p className="mx-auto mt-9 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Join the waitlist and be among the first runners to answer Aethron&apos;s call.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={560} direction="up">
          <a
            href="mailto:hello@mythstride.com?subject=MythStride%20Waitlist"
            className="gold-button mt-9 px-10 py-4 font-display text-sm tracking-wider"
          >
            <SwordsIcon className="h-4 w-4" />
            Join the Waitlist
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

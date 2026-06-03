'use client';

import { useEffect, useState, startTransition } from 'react';
import ScrollReveal from './ScrollReveal';
import { EyeIcon, ShieldIcon, SparkleIcon } from './Icons';

const principles = [
  'Post-run guidance that gives effort meaning',
  'Daily counsel when discipline begins to fade',
  'Missions shaped around consistency and recovery',
];

export default function AethronAI() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section id="aethron" className="relative overflow-hidden bg-void py-24">
      <div className="absolute inset-0 bg-[url('/images/aethronfundo.png')] bg-cover bg-center opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/66 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
      <div
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(47,212,143,0.10) 0%, rgba(212,168,83,0.05) 36%, transparent 70%)',
          animation: mounted ? 'pulse-glow 7s ease-in-out infinite' : 'none',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <ScrollReveal direction="left">
            <div className="relative mx-auto max-w-md">
              <div className="app-panel relative min-h-[560px] overflow-hidden p-6">
                <div className="absolute inset-0 bg-[url('/images/aethronfundo.png')] bg-cover bg-center opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-emerald/25 bg-void/82 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-emerald">
                    <EyeIcon className="h-3.5 w-3.5" />
                    Keeper of the Flame
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    Aethron does not shout orders. He interprets your effort, guards your momentum, and gives each mission a reason.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={160}>
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald/25 bg-emerald/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald">
                <SparkleIcon className="h-4 w-4" />
                Aethron Companion
              </div>

              <h2 className="font-display text-4xl leading-tight text-gold md:text-6xl">
                Not a man. Not a god.
                <span className="block text-gold-bright">A consciousness.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                Inside MythStride, Aethron turns completed runs into calm counsel: what changed, what comes next, and why your progress matters beyond the numbers.
              </p>

              <div className="mt-8 space-y-4">
                {principles.map((principle, index) => (
                  <ScrollReveal key={principle} delay={index * 120} direction="up">
                    <div className="flex gap-4 rounded-[22px] border border-gold-dim/20 bg-charcoal/42 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-emerald/30 bg-emerald/10">
                        <ShieldIcon className="h-5 w-5 text-emerald" />
                      </div>
                      <p className="self-center text-sm leading-relaxed text-text-primary">{principle}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="mt-8 border-l border-gold-dim/30 pl-5">
                <p className="font-display text-2xl leading-snug text-gold">
                  He is wise, calm, protective, and inspiring.
                  <span className="block text-emerald">A companion for the run after the run.</span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

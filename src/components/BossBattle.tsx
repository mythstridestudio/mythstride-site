'use client';

import { useEffect, useState, startTransition } from 'react';
import { getAssetPath } from '@/lib/assets';
import { SwordsIcon, ShieldIcon, EyeIcon } from './Icons';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';

const bosses = [
  {
    name: 'Arpia',
    source: 'Mistborn scout',
    image: '/images/boss-arpia.png',
  },
  {
    name: 'Ancestral Dragon',
    source: 'Ember tyrant',
    image: '/images/boss-dragao-ancestral.png',
  },
  {
    name: 'Spectral King',
    source: 'Commander of darkness',
    image: '/images/spectral-king.png',
  },
];

export default function BossBattle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  return (
    <section id="bosses" className="relative overflow-hidden bg-void py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${getAssetPath('/images/background.png')}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
      <div
        className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(216,74,69,0.13) 0%, rgba(232,98,42,0.06) 34%, transparent 68%)',
          animation: mounted ? 'pulse-glow 6s ease-in-out infinite' : 'none',
        }}
      />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="Boss Progression"
          title="The Mist Gives Shape to Darkness"
          description="Bosses are not random encounters. They are the Dark Mist taking form, led by shadows of the Spectral King."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ScrollReveal direction="left">
            <div className="app-panel relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 boss-halo opacity-80" />
              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
                {bosses.map((boss, index) => (
                  <div key={boss.name} className={`${index === 2 ? 'sm:col-span-1' : ''} relative overflow-hidden rounded-[22px] border border-gold-dim/20 bg-void/70 p-3`}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-rich-brown/40">
                      <img src={getAssetPath(boss.image)} alt={boss.name} className="h-full w-full object-contain drop-shadow-[0_0_28px_rgba(232,98,42,0.22)]" />
                    </div>
                    <div className="mt-3">
                      <h3 className="font-display text-lg text-gold">{boss.name}</h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{boss.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={180}>
            <div className="space-y-5">
              <div className="rounded-[28px] border border-fiery-orange/25 bg-void/74 p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-fiery-orange">
                  <EyeIcon className="h-3.5 w-3.5" />
                  The Spectral King
                </div>
                <h3 className="font-display text-3xl leading-tight text-gold">
                  The first commander of darkness was sealed, not destroyed.
                </h3>
                <p className="mt-4 leading-relaxed text-text-secondary">
                  Every boss battle is a sign that the Mist is gathering again. Runs do more than fill bars; they help Aethron hold the seal.
                </p>
              </div>

              <div className="rounded-[22px] border border-gold-dim/20 bg-charcoal/40 p-5">
                <div className="mb-2 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-text-muted">
                  <span className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-fiery-orange" />
                    Mist pressure
                  </span>
                  <span className="text-fiery-orange">Rising</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-fiery-orange/25 bg-void">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber" />
                </div>
              </div>

              <div className="text-center text-[10px] uppercase tracking-[0.25em] text-text-muted">
                <span className="mr-3 inline-block h-px w-10 bg-gold-dim/30 align-middle" />
                <SwordsIcon className="mr-2 inline h-3.5 w-3.5 text-gold" />
                Every run is a strike against the Mist
                <span className="ml-3 inline-block h-px w-10 bg-gold-dim/30 align-middle" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

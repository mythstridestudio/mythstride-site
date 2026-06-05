'use client';

import { getAssetPath } from '@/lib/assets';
import { SwordsIcon, ScrollIcon, ShieldIcon, TrophyIcon, UsersIcon, SparkleIcon, RunIcon } from './Icons';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { useTranslations } from '@/lib/i18n';

interface Feature {
  title: string;
  category: string;
  copy: string;
  icon: React.ComponentType<{ className?: string }>;
  asset: string;
  accent: string;
  rarity: string;
}

export default function Features() {
  const { t } = useTranslations();
  const featuresData = t('features.features');
  
  const icons = [ScrollIcon, SwordsIcon, ShieldIcon, TrophyIcon, SparkleIcon, UsersIcon, RunIcon];
  const assets = [
    '/images/amuleto_magico.png',
    '/images/fire_sword.png',
    '/images/diamond-chest.png',
    '/images/boss-medusa-medal.png',
    '/images/aethron-full.png',
    '/images/spectral-king.png',
    '/images/run-button-swords.png'
  ];
  const accents = [
    'text-gold',
    'text-ember',
    'text-gold-bright',
    'text-emerald',
    'text-emerald-bright',
    'text-gold-dim',
    'text-ember-bright'
  ];
  const rarities = [
    'rarity-common',
    'rarity-uncommon',
    'rarity-rare',
    'rarity-epic',
    'rarity-legendary',
    'rarity-artifact',
    'rarity-mythic'
  ];

  const features: Feature[] = (Array.isArray(featuresData) ? featuresData : []).map((f: unknown, i: number) => {
    const data = f as Record<string, unknown>;
    return {
      title: String(data.title || ''),
      category: String(data.category || ''),
      copy: String(data.copy || ''),
      icon: icons[i % icons.length],
      asset: assets[i % assets.length],
      accent: accents[i % accents.length],
      rarity: rarities[i % rarities.length]
    };
  });

  return (
    <section id="features" className="relative overflow-hidden bg-deep-charcoal py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-deep-charcoal to-void/25" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label={t('features.nav.loot')} // Using nav.loot for "Loot" label
          title={t('features.title')}
          description={t('features.subtitle')}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <ScrollReveal key={feature.title} delay={index * 70} direction="up">
                <article className="group app-panel app-panel-compact relative h-full overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/35 to-transparent" />
                  <div className="relative z-10 flex gap-4">
                    <div className={`rarity-well ${feature.rarity} flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden p-2`}>
                      <img src={getAssetPath(feature.asset)} alt="" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0">
                      <div className={`mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${feature.accent}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {feature.category}
                      </div>
                      <h3 className="font-display text-xl text-gold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.copy}</p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { getAssetPath } from '@/lib/assets';
import { SwordsIcon, ScrollIcon, ShieldIcon, TrophyIcon, UsersIcon, SparkleIcon, RunIcon } from './Icons';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';

const features = [
  {
    title: 'Running missions',
    category: 'Mission Board',
    copy: 'Real routes become quests, daily orders, and distance goals inside Elyndor.',
    icon: RunIcon,
    asset: '/images/run-button-swords.png',
    accent: 'text-gold',
    rarity: 'rarity-uncommon',
  },
  {
    title: 'Boss progression',
    category: 'Battle Track',
    copy: 'Distance becomes damage against bosses born from the Dark Mist.',
    icon: SwordsIcon,
    asset: '/images/boss-medusa-medal.png',
    accent: 'text-fiery-orange',
    rarity: 'rarity-legendary',
  },
  {
    title: 'Loot and gear',
    category: 'Inventory',
    copy: 'Weapons, armor, relics, gold, and diamonds make each completed run feel earned.',
    icon: ShieldIcon,
    asset: '/images/fire_sword.png',
    accent: 'text-gold-bright',
    rarity: 'rarity-legendary',
  },
  {
    title: 'Achievements',
    category: 'Chronicle',
    copy: 'Milestones, trophies, and feats turn consistency into visible identity.',
    icon: TrophyIcon,
    asset: '/images/diamond-chest.png',
    accent: 'text-diamond',
    rarity: 'rarity-rare',
  },
  {
    title: 'Aethron guidance',
    category: 'Companion',
    copy: 'The Keeper of the Flame gives missions, recovery cues, and calm post-run counsel.',
    icon: SparkleIcon,
    asset: '/images/aethron-full.png',
    accent: 'text-emerald',
    rarity: 'rarity-uncommon',
  },
  {
    title: 'Guilds and allies',
    category: 'Party',
    copy: 'Shared challenges give each runner allies, rivals, and a reason to return.',
    icon: UsersIcon,
    asset: '/images/screen-share.jpg',
    accent: 'text-gold',
    rarity: 'rarity-common',
  },
  {
    title: 'Streaks',
    category: 'Flamekeeping',
    copy: 'The Flame grows through discipline: repeated effort, recovered momentum, and return.',
    icon: ScrollIcon,
    asset: '/images/amuleto_magico.png',
    accent: 'text-emerald',
    rarity: 'rarity-uncommon',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-deep-charcoal py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-deep-charcoal to-void/25" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="Loot and Achievements"
          title="Game Systems Built From Real Effort"
          description="MythStride keeps the focus on RPG progression: missions, bosses, loot, achievements, Aethron, guilds, and streaks."
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

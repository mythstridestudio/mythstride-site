import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { GemIcon, ScrollIcon, SwordsIcon, TrophyIcon, UsersIcon } from './Icons';

const screens = [
  {
    title: 'Home',
    copy: 'Player progress, current boss, missions, and navigation in the real app.',
    image: '/images/screen-dashboard.jpg',
    icon: TrophyIcon,
  },
  {
    title: 'Mission',
    copy: 'Running stats sit beside boss progress, making the workout feel like combat.',
    image: '/images/screen-run.jpg',
    icon: SwordsIcon,
  },
  {
    title: 'Shop',
    copy: 'Loot, rarity, gold, and diamonds use the same RPG visual language as the site.',
    image: '/images/screen-shop.jpg',
    icon: GemIcon,
  },
  {
    title: 'Aethron',
    copy: 'The companion gives the run emotional weight after the journey ends.',
    image: '/images/screen-aethron.jpg',
    icon: ScrollIcon,
  },
  {
    title: 'Share',
    copy: 'Player identity, achievements, and progress can leave the app as a fantasy profile.',
    image: '/images/screen-share.jpg',
    icon: UsersIcon,
  },
];

export default function AppShowcase() {
  return (
    <section id="app" className="relative overflow-hidden bg-deep-charcoal py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-deep-charcoal to-void/30" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="App Experience"
          title="The Actual MythStride Interface"
          description="The website should feel like the app because it uses the app: real screens, real hierarchy, real RPG progression."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ScrollReveal direction="left">
            <div className="relative mx-auto grid max-w-xl grid-cols-[0.85fr_1fr] items-end gap-4">
              <div className="phone-shell -mb-4 overflow-hidden p-2 opacity-85">
                <img src="/images/screen-dashboard.jpg" alt="MythStride dashboard screen" className="phone-screen h-auto w-full object-cover" />
              </div>
              <div className="phone-shell overflow-hidden p-2">
                <img src="/images/screen-run.jpg" alt="MythStride run mission screen" className="phone-screen h-auto w-full object-cover" />
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {screens.map((screen, index) => {
              const Icon = screen.icon;

              return (
                <ScrollReveal key={screen.title} delay={index * 90} direction="right">
                  <div className="app-panel app-panel-compact relative overflow-hidden p-4">
                    <div className="relative z-10 flex gap-4">
                      <div className="h-24 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-gold-dim/25 bg-void">
                        <img src={screen.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold-muted">
                          <Icon className="h-3.5 w-3.5 text-gold" />
                          {screen.title}
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">{screen.copy}</p>
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

import { getAssetPath } from '@/lib/assets';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { ShieldIcon, SparkleIcon, SwordsIcon, TrophyIcon } from './Icons';
import { useTranslations } from '@/lib/i18n';

interface IdentityItem {
  title: string;
  copy: string;
  icon: React.ComponentType<{ className?: string }>;
}

const identity: IdentityItem[] = [
  {
    title: 'Answer the call',
    copy: 'The player is not just logging exercise. They are the person Aethron has been searching for.',
    icon: SparkleIcon,
  },
  {
    title: 'Build a champion',
    copy: 'Profiles, gear, titles, streaks, and trophies make consistency visible.',
    icon: ShieldIcon,
  },
  {
    title: 'Share the legend',
    copy: 'Run summaries become fantasy artifacts that carry the MythStride identity outside the app.',
    icon: TrophyIcon,
  },
];

export default function CharacterSection() {
  const { t } = useTranslations();
  const identityData = t('characterSection.identity'); // array of { title: string, copy: string }

  return (
    <section className="relative overflow-hidden bg-abyss py-24">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-abyss to-void/20" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label={t('characterSection.sectionHeader.label')}
          title={t('characterSection.sectionHeader.title')}
          description={t('characterSection.sectionHeader.description')}
        />

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ScrollReveal direction="left">
            <div className="grid grid-cols-[0.9fr_1fr] items-end gap-4">
              <div className="app-panel app-panel-compact overflow-hidden p-2">
                <img src={getAssetPath('/images/perfil_masculino.png')} alt="Male MythStride hero profile artwork" className="h-auto w-full rounded-[18px] object-cover" />
              </div>
              <div className="app-panel app-panel-compact overflow-hidden p-2">
                <img src={getAssetPath('/images/screen-share.jpg')} alt="MythStride shareable journey card" className="h-auto w-full rounded-[18px] object-cover" />
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-5">
            {identity.map((item, index) => {
              const identityDataItem = identityData[index];
              const TranslatedTitle = identityDataItem?.title ?? item.title;
              const TranslatedCopy = identityDataItem?.copy ?? item.copy;
              const Icon = item.icon;

              return (
                <ScrollReveal key={item.title} delay={index * 120} direction="right">
                  <div className="relative rounded-[24px] border border-gold-dim/20 bg-charcoal/45 p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-dim/30 bg-void/70">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-gold">{TranslatedTitle}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{TranslatedCopy}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            <ScrollReveal delay={420} direction="up">
              <div className="flex items-center gap-3 rounded-full border border-emerald/25 bg-emerald/8 px-5 py-4 text-sm text-text-primary">
                <SwordsIcon className="h-5 w-5 flex-shrink-0 text-emerald" />
                {t('characterSection.theAppDoesNotOnlyTrackRuns')}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
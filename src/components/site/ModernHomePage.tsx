import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { AethronSection } from "@/components/site/home/AethronSection";
import { BossSection } from "@/components/site/home/BossSection";
import { CharacterSection } from "@/components/site/home/CharacterSection";
import { ClosingSections } from "@/components/site/home/ClosingSections";
import { CommunitySection } from "@/components/site/home/CommunitySection";
import { ElyndorSection } from "@/components/site/home/ElyndorSection";
import { FounderSection } from "@/components/site/home/FounderSection";
import { HeroSection } from "@/components/site/home/HeroSection";
import { LootSection } from "@/components/site/home/LootSection";
import { LoopSection } from "@/components/site/home/LoopSection";
import { PlatformsSection } from "@/components/site/home/PlatformsSection";
import { homeCopy } from "@/content/home";
import { siteCopy } from "@/content/site";
import type { PublicLocale } from "@/lib/locales";
import {
  getHomeStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

type ModernHomePageProps = { locale: PublicLocale };

/**
 * The Home page, in the order a visitor needs it:
 *
 *   promise -> the loop -> the fight -> the reward -> the character ->
 *   the world -> the companion -> the people -> the relic -> where it runs ->
 *   the call -> the form -> the questions
 *
 * Every section is its own component under `home/`, and every word it says
 * lives in `content/home.ts`, in all three languages. This file only decides
 * the order.
 */
export function ModernHomePage({ locale }: ModernHomePageProps) {
  const copy = siteCopy[locale];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(
            getHomeStructuredData(locale, homeCopy[locale].faq.items),
          ),
        }}
      />
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>

      <LocalizedNavigation locale={locale} />

      <main id="main-content">
        <HeroSection locale={locale} />
        <LoopSection locale={locale} />
        <BossSection locale={locale} />
        <LootSection locale={locale} />
        <CharacterSection locale={locale} />
        <ElyndorSection locale={locale} />
        <AethronSection locale={locale} />
        <CommunitySection locale={locale} />
        <FounderSection locale={locale} />
        <PlatformsSection locale={locale} />
        <ClosingSections locale={locale} />
      </main>

      <LocalizedFooter locale={locale} />
    </>
  );
}

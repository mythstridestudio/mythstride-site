import Image from "next/image";
import { homeCopy } from "@/content/home";
import { homeSectionIds, lootItems, rarityTiers } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import type { PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type LootSectionProps = { locale: PublicLocale };

/**
 * The reward rail: real catalogue pieces, each under its own rarity.
 *
 * No statistics are shown. The game's numbers depend on the roll behind a given
 * drop, so printing one here would be inventing a promise — the rarity name and
 * the artwork are what the catalogue actually guarantees.
 */
export function LootSection({ locale }: LootSectionProps) {
  const copy = homeCopy[locale].loot;

  return (
    <section
      id={homeSectionIds.loot}
      className="site-section site-section--stone loot-section"
    >
      <div className="site-container">
        <header className="section-heading">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="section-lede">{copy.lede}</p>
        </header>

        <Reveal as="ul" className="rarity-legend">
          {rarityTiers.map((tier, index) => (
            <li
              key={tier}
              className="rarity-legend__item"
              data-rarity={tier}
              style={{ ["--i" as string]: index }}
            >
              <span className="rarity-legend__dot" aria-hidden="true" />
              {copy.rarities[tier]}
            </li>
          ))}
        </Reveal>

        <Reveal as="ul" className="loot-rail" label={copy.eyebrow}>
          {lootItems.map((item, index) => (
            <li
              className="loot-card"
              key={item.slug}
              data-rarity={item.rarity}
              style={{ ["--i" as string]: index }}
            >
              <div className="loot-card__well">
                <Image
                  src={getAssetPath(item.art)}
                  alt=""
                  aria-hidden="true"
                  width={256}
                  height={256}
                  sizes="160px"
                  loading="lazy"
                />
              </div>
              <p className="loot-card__name">{copy.items[item.slug]}</p>
              <p className="loot-card__rarity">{copy.rarities[item.rarity]}</p>
            </li>
          ))}
        </Reveal>

        <p className="loot-section__note">
          <span className="loot-section__hint">{copy.scrollHint}</span>
          {copy.note}
        </p>
      </div>
    </section>
  );
}

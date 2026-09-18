import Image from "next/image";
import { homeCopy } from "@/content/home";
import { equipmentSlots } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import type { PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type CharacterSectionProps = { locale: PublicLocale };

/**
 * What the loot is for: a character sheet, with the same pieces seated in the
 * slots the app's inventory doll uses, beside the screen they come from.
 */
export function CharacterSection({ locale }: CharacterSectionProps) {
  const copy = homeCopy[locale].character;

  return (
    <section className="site-section character-section">
      <div className="site-container">
        <header className="section-heading">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="section-lede">{copy.lede}</p>
        </header>

        <div className="character-grid">
          <Reveal className="character-sheet">
            <div className="character-sheet__head">
              <p className="character-sheet__eyebrow">{copy.striderLabel}</p>
              <p className="character-sheet__level">
                <span>{copy.levelLabel}</span>
                <strong>{copy.levelValue}</strong>
              </p>
            </div>

            <div className="character-sheet__xp">
              <div className="character-sheet__xp-head">
                <span>{copy.xpLabel}</span>
                <span>{copy.xpValue}</span>
              </div>
              <div className="character-sheet__bar">
                <span className="character-sheet__bar-fill" />
              </div>
            </div>

            <p className="character-sheet__label">{copy.equipmentLabel}</p>

            <ul className="character-slots">
              {equipmentSlots.map((slot, index) => (
                <li
                  className="character-slot"
                  key={slot.slot}
                  data-rarity={slot.rarity}
                  style={{ ["--i" as string]: index }}
                >
                  <div className="character-slot__well">
                    <Image
                      src={getAssetPath(slot.art)}
                      alt=""
                      aria-hidden="true"
                      width={256}
                      height={256}
                      sizes="72px"
                      loading="lazy"
                    />
                  </div>
                  <div className="character-slot__text">
                    <span className="character-slot__slot">
                      {copy.slots[slot.slot]}
                    </span>
                    <span className="character-slot__item">
                      {homeCopy[locale].loot.items[slot.item]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="figure" className="character-shot">
            <div className="character-shot__device">
              <Image
                src={getAssetPath(`/images/product/inventory-${locale}.webp`)}
                alt={copy.screenshotAlt}
                width={720}
                height={1560}
                sizes="(max-width: 52rem) 70vw, 320px"
                loading="lazy"
              />
            </div>
            <figcaption>{copy.caption}</figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

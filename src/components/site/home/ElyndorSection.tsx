import Image from "next/image";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import type { PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type ElyndorSectionProps = { locale: PublicLocale };

/**
 * The world, and then the chronicles that open it a fragment at a time.
 *
 * The chronicle cards are `<details>`: they expand without a line of script,
 * they are reachable by keyboard for free, and a closed one still shows its
 * opening line, so nothing reads as an empty box.
 */
export function ElyndorSection({ locale }: ElyndorSectionProps) {
  const copy = homeCopy[locale];

  return (
    <>
      <section id={homeSectionIds.elyndor} className="elyndor-section">
        <div className="elyndor-scene">
          <Image
            src={getAssetPath("/images/world/elyndor-strider.webp")}
            alt={copy.elyndor.sceneAlt}
            width={1600}
            height={900}
            className="elyndor-scene__image"
            sizes="100vw"
            loading="lazy"
          />
          <div className="elyndor-scene__veil" aria-hidden="true" />
        </div>

        <div className="site-container elyndor-section__inner">
          <Reveal className="elyndor-section__copy">
            <p className="section-eyebrow">{copy.elyndor.eyebrow}</p>
            <h2>{copy.elyndor.title}</h2>
            <p className="section-lede">{copy.elyndor.lede}</p>
          </Reveal>

          <Reveal as="ul" className="elyndor-pillars">
            {copy.elyndor.pillars.map((pillar, index) => (
              <li
                className="elyndor-pillar"
                key={pillar.title}
                style={{ ["--i" as string]: index }}
              >
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="site-section chronicles-section">
        <div className="site-container">
          <header className="section-heading">
            <p className="section-eyebrow">{copy.chronicles.eyebrow}</p>
            <h2>{copy.chronicles.title}</h2>
            <p className="section-lede">{copy.chronicles.lede}</p>
          </header>

          <Reveal className="chronicle-grid">
            {copy.chronicles.entries.map((entry, index) => (
              <details
                className="chronicle-card"
                key={entry.numeral}
                style={{ ["--i" as string]: index }}
              >
                <summary>
                  <span className="chronicle-card__numeral" aria-hidden="true">
                    {entry.numeral}
                  </span>
                  <span className="chronicle-card__title">{entry.title}</span>
                  <span className="chronicle-card__teaser">{entry.teaser}</span>
                  <span className="chronicle-card__more">
                    {copy.chronicles.expandLabel}
                  </span>
                </summary>
                <p className="chronicle-card__body">{entry.body}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

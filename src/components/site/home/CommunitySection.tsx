import Image from "next/image";
import Link from "next/link";
import { MythGlyph } from "@/components/relic";
import { ShieldIcon } from "@/components/Icons";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { legalConfig } from "@/config/legal";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type CommunitySectionProps = { locale: PublicLocale };

const communityMarks = [
  <MythGlyph key="friends" glyph="social" size={40} />,
  <MythGlyph key="rankings" glyph="seasonChampion" size={40} />,
  <ShieldIcon key="groups" />,
  <MythGlyph key="achievements" glyph="achievements" size={40} />,
];

/** Who else is on the path, and the calendar that takes the run outdoors. */
export function CommunitySection({ locale }: CommunitySectionProps) {
  const copy = homeCopy[locale];

  return (
    <>
      <section
        id={homeSectionIds.community}
        className="site-section site-section--stone community-section"
      >
        <div className="site-container community-layout">
          <Reveal className="community-copy">
            <p className="section-eyebrow">{copy.community.eyebrow}</p>
            <h2>{copy.community.title}</h2>
            <p className="section-lede">{copy.community.lede}</p>

            <ul className="community-cards">
              {copy.community.cards.map((card, index) => (
                <li
                  className="community-card"
                  key={card.title}
                  style={{ ["--i" as string]: index }}
                >
                  <span className="community-card__mark" aria-hidden="true">
                    {communityMarks[index]}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </li>
              ))}
            </ul>

            <div className="section-action">
              <Link
                className="text-link"
                href={localePath(locale, "/community")}
                prefetch={false}
              >
                {copy.community.link}
              </Link>
            </div>
          </Reveal>

          <Reveal as="figure" className="community-shot">
            <div className="community-shot__device">
              <Image
                src={getAssetPath(`/images/product/groups-${locale}.webp`)}
                alt={copy.community.screenshotAlt}
                width={720}
                height={1560}
                sizes="(max-width: 52rem) 66vw, 300px"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-section events-section">
        <div className="site-container events-layout">
          <Reveal as="figure" className="events-shot">
            <div className="events-shot__device">
              <Image
                src={getAssetPath(`/images/product/events-${locale}.webp`)}
                alt={copy.events.screenshotAlt}
                width={720}
                height={1560}
                sizes="(max-width: 52rem) 66vw, 300px"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal className="events-copy">
            <p className="section-eyebrow">{copy.events.eyebrow}</p>
            <h2>{copy.events.title}</h2>
            <p className="section-lede">{copy.events.lede}</p>

            <ul className="events-list">
              {copy.events.highlights.map((item, index) => (
                <li key={item.title} style={{ ["--i" as string]: index }}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>

            <div className="section-action">
              <Link
                className="text-link"
                href={localePath(locale, "/events")}
                prefetch={false}
              >
                {copy.events.link}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* The organizer door. It reuses the studio's existing contact address
            rather than introducing a second inbox or a form with no backend
            behind it, and it promises a conversation — not inclusion. */}
        <Reveal className="site-container organizer-panel">
          <div className="organizer-panel__copy">
            <p className="section-eyebrow">{copy.events.organizer.eyebrow}</p>
            <h3>{copy.events.organizer.title}</h3>
            <p>{copy.events.organizer.body}</p>
          </div>

          <div className="organizer-panel__action">
            <ol className="organizer-steps">
              {copy.events.organizer.steps.map((step, index) => (
                <li key={step} style={{ ["--i" as string]: index }}>
                  {step}
                </li>
              ))}
            </ol>

            <a
              className="button button--secondary"
              href={`mailto:${legalConfig.contactEmail}?subject=${encodeURIComponent(
                copy.events.organizer.ctaSubject,
              )}`}
            >
              {copy.events.organizer.cta}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

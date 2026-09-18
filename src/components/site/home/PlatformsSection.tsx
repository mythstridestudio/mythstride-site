import Link from "next/link";
import { BookIcon, ScrollIcon, TrophyIcon } from "@/components/Icons";
import { homeCopy } from "@/content/home";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type PlatformsSectionProps = { locale: PublicLocale };

const horizonMarks = [
  <ScrollIcon key="quests" />,
  <TrophyIcon key="achievements" />,
  <BookIcon key="fragments" />,
];

/**
 * Where the game runs today, and the systems already inside the closed beta.
 *
 * Nothing on this page claims a platform the beta does not reach. Android, Wear
 * OS and Strava are what ships; anything else belongs on the integrations page,
 * where its real state can be described in full.
 */
export function PlatformsSection({ locale }: PlatformsSectionProps) {
  const copy = homeCopy[locale];

  return (
    <section className="site-section site-section--stone platforms-section">
      <div className="site-container platforms-layout">
        <Reveal className="platforms-copy">
          <p className="section-eyebrow">{copy.platforms.eyebrow}</p>
          <h2>{copy.platforms.title}</h2>
          <p className="section-lede">{copy.platforms.lede}</p>

          <ul className="platform-list">
            {copy.platforms.rows.map((row, index) => (
              <li key={row.name} style={{ ["--i" as string]: index }}>
                <span className="platform-list__name">{row.name}</span>
                <span className="platform-list__status">{row.status}</span>
              </li>
            ))}
          </ul>

          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/third-party-services")}
              prefetch={false}
            >
              {copy.platforms.link}
            </Link>
          </div>
        </Reveal>

        <Reveal className="horizon-copy">
          <p className="section-eyebrow">{copy.horizon.eyebrow}</p>
          <h2>{copy.horizon.title}</h2>
          <p className="section-lede">{copy.horizon.lede}</p>

          <ul className="horizon-cards">
            {copy.horizon.cards.map((card, index) => (
              <li key={card.title} style={{ ["--i" as string]: index }}>
                <span className="horizon-cards__mark" aria-hidden="true">
                  {horizonMarks[index]}
                </span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

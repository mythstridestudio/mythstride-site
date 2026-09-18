import Link from "next/link";
import { MythGlyph } from "@/components/relic";
import { ShieldIcon, SwordsIcon, TrophyIcon } from "@/components/Icons";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type LoopSectionProps = { locale: PublicLocale };

/** One mark per step, in the order the steps are written. */
const stepMarks = [
  <MythGlyph key="run" glyph="runOutdoor" size={44} />,
  <MythGlyph key="xp" glyph="achievements" size={44} />,
  <SwordsIcon key="attack" />,
  <MythGlyph key="loot" glyph="inventory" size={44} />,
  <TrophyIcon key="evolve" />,
];

/**
 * The transition after the hero, then the five-step loop that is the product's
 * whole explanation: run, earn, attack, claim, evolve.
 */
export function LoopSection({ locale }: LoopSectionProps) {
  const copy = homeCopy[locale];

  return (
    <>
      <section className="proposition">
        <Reveal className="site-container proposition__inner">
          <h2 className="proposition__title">
            <span>{copy.proposition.titleTop}</span>
            <span>{copy.proposition.titleBottom}</span>
          </h2>
          <p className="proposition__body">{copy.proposition.body}</p>
        </Reveal>
      </section>

      <section
        id={homeSectionIds.loop}
        className="site-section site-section--stone loop-section"
      >
        <div className="site-container">
          <header className="section-heading">
            <p className="section-eyebrow">{copy.loop.eyebrow}</p>
            <h2>{copy.loop.title}</h2>
            <p className="section-lede">{copy.loop.lede}</p>
          </header>

          <Reveal as="ol" className="loop-track">
            {copy.loop.steps.map((step, index) => (
              <li
                className="loop-step"
                key={step.title}
                style={{ ["--i" as string]: index }}
              >
                <span className="loop-step__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="loop-step__mark" aria-hidden="true">
                  {stepMarks[index] ?? <ShieldIcon />}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span className="loop-step__metric">{step.metric}</span>
              </li>
            ))}
          </Reveal>

          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/how-it-works")}
              prefetch={false}
            >
              {copy.loop.link}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { BossHealthBar, MythBossMedal } from "@/components/relic";
import { homeCopy } from "@/content/home";
import { bossScene, campaignBosses, homeSectionIds } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type BossSectionProps = { locale: PublicLocale };

const full = bossScene.health;
const before = bossScene.remaining;
const after = before - bossScene.damage;

/**
 * The battle, shown at the scale the game shows it: the boss large, its health
 * on the HUD rail, and the run that just hit it read out beside the bar.
 *
 * The ladder underneath is the real campaign — ten encounters in their shipped
 * order, each with the health the server seeds — so the section promises
 * exactly the fight that exists.
 */
export function BossSection({ locale }: BossSectionProps) {
  const copy = homeCopy[locale].boss;

  return (
    <section id={homeSectionIds.boss} className="site-section boss-section">
      <div className="boss-section__glow" aria-hidden="true" />

      <div className="site-container">
        <div className="boss-stage">
          <Reveal className="boss-stage__copy">
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <h2>{copy.title}</h2>
            <p className="section-lede">{copy.lede}</p>

            <dl className="boss-readout">
              <div>
                <dt>{copy.distanceLabel}</dt>
                <dd>{homeCopy[locale].hero.hud.distance}</dd>
              </div>
              <div className="boss-readout__arrow" aria-hidden="true">
                →
              </div>
              <div>
                <dt>{copy.damageLabel}</dt>
                <dd className="boss-readout__damage">
                  {homeCopy[locale].hero.hud.damageValue}
                </dd>
              </div>
            </dl>

            <div className="section-action">
              <Link
                className="text-link"
                href={localePath(locale, "/events")}
                prefetch={false}
              >
                {copy.link}
              </Link>
            </div>
          </Reveal>

          <Reveal as="figure" className="boss-stage__art">
            <Image
              src={getAssetPath(bossScene.art)}
              alt=""
              aria-hidden="true"
              width={820}
              height={820}
              className="boss-stage__portrait"
              sizes="(max-width: 52rem) 86vw, 440px"
              loading="lazy"
            />

            <figcaption className="boss-hud">
              <p className="boss-hud__eyebrow">{copy.bossEyebrow}</p>
              <p className="boss-hud__name">{copy.bossNames[bossScene.slug]}</p>
              <BossHealthBar
                value={after}
                max={full}
                from={before}
                label={`${copy.bossNames[bossScene.slug]} — ${copy.healthLabel}`}
              />
              <p className="boss-hud__values">
                <span>{copy.healthLabel}</span>
                <strong>
                  {after.toLocaleString(locale)} / {full.toLocaleString(locale)}
                </strong>
              </p>
              <p className="boss-hud__ability">
                <span>{copy.abilityLabel}</span> {copy.ability}
              </p>
            </figcaption>
          </Reveal>
        </div>

        <div className="boss-ladder">
          <div className="boss-ladder__head">
            <h3>{copy.ladderTitle}</h3>
            <p>{copy.ladderNote}</p>
          </div>

          <Reveal as="ol" className="boss-ladder__track" label={copy.ladderTitle}>
            {campaignBosses.map((boss, index) => (
              <li
                className="boss-ladder__item"
                key={boss.slug}
                style={{ ["--i" as string]: index }}
                data-final={index === campaignBosses.length - 1 ? "true" : undefined}
              >
                <MythBossMedal name={boss.medal} size="sm" />
                <span className="boss-ladder__name">
                  {copy.bossNames[boss.slug]}
                </span>
                <span className="boss-ladder__meta">
                  {copy.levelLabel} {boss.level} · {boss.health.toLocaleString(locale)}{" "}
                  {copy.healthLabel}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

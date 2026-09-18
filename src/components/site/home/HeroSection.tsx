import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { MythBossMedal } from "@/components/relic";
import { heroRun, homeSectionIds } from "@/content/home-data";
import { homeCopy } from "@/content/home";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";

type HeroSectionProps = { locale: PublicLocale };

const bossFullHealth = heroRun.boss.health;
const beforeAttack = heroRun.boss.remaining;
const afterAttack = beforeAttack - heroRun.damage;
const percent = (value: number) => `${((value / bossFullHealth) * 100).toFixed(1)}%`;

/**
 * The first screen: the promise, the two ways to act on it, and the loop the
 * whole page then explains, played once as a HUD beside the phone.
 *
 * The figures in that HUD are the product's own — a 7.4 km run yields 148 XP
 * and 195 points of boss damage — and the caption says so in plain words, so
 * nobody reads a demonstration as a live feed.
 */
export function HeroSection({ locale }: HeroSectionProps) {
  const copy = homeCopy[locale].hero;

  return (
    <header className="hero">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <div className="site-container hero__grid">
        <div className="hero__copy">
          <p className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {copy.badge}
          </p>

          <h1 className="hero__title">
            <span>{copy.titleTop}</span>
            <span className="hero__title-accent">{copy.titleBottom}</span>
          </h1>

          <p className="hero__lede">{copy.lede}</p>

          <div className="cta-row">
            <Link
              className="button button--primary"
              href={`${localePath(locale)}#${homeSectionIds.join}`}
              prefetch={false}
            >
              {copy.primary}
              <ArrowRightIcon className="button__icon" />
            </Link>
            <Link
              className="button button--secondary"
              href={`${localePath(locale)}#${homeSectionIds.loop}`}
              prefetch={false}
            >
              {copy.secondary}
            </Link>
          </div>
        </div>

        <figure className="hero__stage">
          <div className="hero__aura" aria-hidden="true" />

          <div className="hero__device">
            <Image
              src={getAssetPath(`/images/product/dashboard-${locale}.webp`)}
              alt={copy.deviceAlt}
              width={720}
              height={1560}
              priority
              sizes="(max-width: 52rem) 68vw, 340px"
            />
          </div>

          <div className="hero-hud" aria-hidden="true">
            <div className="hero-hud__card hero-hud__card--run">
              <span className="hero-hud__label">{copy.hud.runLabel}</span>
              <strong className="hero-hud__value">{copy.hud.distance}</strong>
            </div>

            <div className="hero-hud__card hero-hud__card--xp">
              <span className="hero-hud__label">{copy.hud.xpLabel}</span>
              <strong className="hero-hud__value hero-hud__value--gold">
                {copy.hud.xpValue}
              </strong>
            </div>

            {/* The card reads out the hit, not the boss: the screen behind it
                already names the encounter, and printing the name twice — once
                from a capture, once from the live catalogue — is how the two
                end up disagreeing. */}
            <div className="hero-hud__card hero-hud__card--boss">
              <div className="hero-hud__boss-head">
                <MythBossMedal name={heroRun.boss.medal} size="sm" />
                <div>
                  <span className="hero-hud__label">{copy.hud.attackLabel}</span>
                  <strong className="hero-hud__damage">
                    {copy.hud.damageValue}
                  </strong>
                </div>
              </div>
              <div className="hero-hud__bar">
                <span
                  className="hero-hud__bar-fill"
                  style={{
                    ["--hp-from" as string]: percent(beforeAttack),
                    ["--hp-to" as string]: percent(afterAttack),
                  }}
                />
              </div>
              <span className="hero-hud__hp">
                {copy.hud.healthLabel} {afterAttack.toLocaleString(locale)} /{" "}
                {bossFullHealth.toLocaleString(locale)}
              </span>
            </div>
          </div>

          <figcaption className="hero__caption">{copy.caption}</figcaption>
        </figure>
      </div>
    </header>
  );
}

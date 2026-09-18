import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type FounderSectionProps = { locale: PublicLocale };

/**
 * The Founder relic, with the eligibility stated as it actually stands: the
 * relic goes to eligible participants who are invited, and joining the list is
 * not an invitation. Both sentences are on the page, side by side.
 */
export function FounderSection({ locale }: FounderSectionProps) {
  const copy = homeCopy[locale].founder;

  return (
    <section className="site-section founder-section">
      <div className="founder-section__glow" aria-hidden="true" />

      <Reveal className="site-container founder-layout">
        <figure className="founder-relic-art">
          <span className="founder-relic-art__halo" aria-hidden="true" />
          <Image
            src={getAssetPath("/assets/mythstride/icons/founder_sword.png")}
            alt=""
            aria-hidden="true"
            width={256}
            height={256}
            sizes="(max-width: 52rem) 40vw, 220px"
            loading="lazy"
          />
        </figure>

        <div className="founder-copy">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="section-lede">{copy.lede}</p>

          <p className="founder-copy__relic">{copy.relicName}</p>

          <ul className="founder-criteria">
            {copy.criteria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="cta-row">
            <Link
              className="button button--primary"
              href={`${localePath(locale)}#${homeSectionIds.join}`}
              prefetch={false}
            >
              {copy.cta}
              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

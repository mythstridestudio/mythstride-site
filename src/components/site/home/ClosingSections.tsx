import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import WaitlistForm from "@/components/WaitlistForm";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { siteCopy } from "@/content/site";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type ClosingProps = { locale: PublicLocale };

/**
 * The close: one cinematic call, the form itself, and the questions a visitor
 * still has.
 *
 * The form is `WaitlistForm` untouched — the same validation, the same honeypot,
 * the same age confirmation, disclosure and capacity notice. Only the panel
 * around it is new.
 */
export function ClosingSections({ locale }: ClosingProps) {
  const copy = homeCopy[locale];

  return (
    <>
      <section className="final-cta">
        <div className="final-cta__scene" aria-hidden="true">
          <Image
            src={getAssetPath("/images/world/hall-of-heroes.webp")}
            alt=""
            width={900}
            height={1600}
            sizes="100vw"
            loading="lazy"
          />
        </div>

        <Reveal className="site-container final-cta__inner">
          <p className="section-eyebrow">{copy.finalCta.eyebrow}</p>
          <h2>{copy.finalCta.title}</h2>
          <p className="section-lede">{copy.finalCta.lede}</p>

          <div className="cta-row cta-row--center">
            <Link
              className="button button--primary"
              href={`${localePath(locale)}#${homeSectionIds.join}`}
              prefetch={false}
            >
              {copy.finalCta.cta}
              <ArrowRightIcon className="button__icon" />
            </Link>
          </div>

          <p className="final-cta__note">{copy.finalCta.note}</p>
        </Reveal>
      </section>

      <section id={homeSectionIds.join} className="site-section join-section">
        <div className="site-container join-layout">
          <div className="join-copy">
            <p className="section-eyebrow">{copy.join.eyebrow}</p>
            <h2>{copy.join.title}</h2>
            <p className="section-lede">{copy.join.lede}</p>
          </div>

          <div className="join-panel">
            <WaitlistForm locale={locale} />
          </div>
        </div>
      </section>

      <section
        id={homeSectionIds.faq}
        className="site-section site-section--stone faq-section"
      >
        <div className="site-container">
          <header className="section-heading">
            <p className="section-eyebrow">{copy.faq.eyebrow}</p>
            <h2>{copy.faq.title}</h2>
            <p className="section-lede">{copy.faq.lede}</p>
          </header>

          <FaqAccordion items={copy.faq.items} />

          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/faq")}
              prefetch={false}
            >
              {copy.faq.link}
            </Link>
          </div>

          <p className="faq-section__privacy">
            <Link href={localePath(locale, "/privacy")} prefetch={false}>
              {siteCopy[locale].waitlist.privacyLink}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

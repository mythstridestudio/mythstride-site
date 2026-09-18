import Image from "next/image";
import Link from "next/link";
import { MythGlyph } from "@/components/relic";
import { homeCopy } from "@/content/home";
import { homeSectionIds } from "@/content/home-data";
import { getAssetPath } from "@/lib/assets";
import { localePath, type PublicLocale } from "@/lib/locales";
import { Reveal } from "./Reveal";

type AethronSectionProps = { locale: PublicLocale };

/**
 * Aethron as the product presents him: a character first, with the technology
 * named underneath rather than in the headline.
 *
 * The AI disclosure is not decoration and is not tucked away — it sits directly
 * under the conversation it describes, in the same type size as the body copy.
 */
export function AethronSection({ locale }: AethronSectionProps) {
  const copy = homeCopy[locale].aethron;

  return (
    <section id={homeSectionIds.aethron} className="site-section aethron-section">
      <div className="aethron-section__glow" aria-hidden="true" />

      <div className="site-container aethron-layout">
        <Reveal as="figure" className="aethron-portrait">
          <Image
            src={getAssetPath("/images/world/aethron-presence.webp")}
            alt={copy.portraitAlt}
            width={640}
            height={800}
            sizes="(max-width: 52rem) 62vw, 340px"
            loading="lazy"
          />
        </Reveal>

        <Reveal className="aethron-body">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>

          <p className="aethron-body__name">
            <MythGlyph glyph="aethronSigil" size={36} />
            <span>{copy.name}</span>
            <em>{copy.role}</em>
          </p>

          <p className="section-lede">{copy.lede}</p>

          <div className="aethron-thread">
            {copy.messages.map((message, index) => (
              <p
                className="aethron-thread__line"
                key={message}
                style={{ ["--i" as string]: index }}
              >
                {message}
              </p>
            ))}
          </div>

          <p className="aethron-disclosure">{copy.disclosure}</p>

          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/aethron")}
              prefetch={false}
            >
              {copy.link}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

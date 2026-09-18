import Image from "next/image";
import Link from "next/link";
import { siteCopy } from "@/content/site";
import { homeSectionIds } from "@/content/home-data";
import {
  getLocaleLabel,
  getOtherLocales,
  getLocalizedText,
  localePath,
  type PublicLocale,
} from "@/lib/locales";

type LocalizedFooterProps = {
  locale: PublicLocale;
};

/**
 * The footer carries every destination the header no longer does.
 *
 * Trimming the header was a decision about attention, not about access: each
 * institutional page, the support channel, account deletion and the tester
 * login are all one link away from the bottom of every page.
 */
export function LocalizedFooter({ locale }: LocalizedFooterProps) {
  const copy = siteCopy[locale].footer;
  const nav = siteCopy[locale].nav;
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });

  const productLinks: [string, string][] = [
    ["/how-it-works", text("Como funciona", "How it works", "Cómo funciona")],
    ["/features", text("Recursos", "Features", "Funciones")],
    ["/events", text("Eventos", "Events", "Eventos")],
    ["/community", text("Comunidade", "Community", "Comunidad")],
    ["/wear-os", "Wear OS"],
  ];

  const universeLinks: [string, string][] = [
    ["/aethron", "Aethron"],
    ["/closed-beta", text("Beta fechado", "Closed beta", "Beta cerrada")],
  ];

  const helpLinks: [string, string][] = [
    ["/faq", text("Dúvidas frequentes", "FAQ", "Preguntas frecuentes")],
    ["/support", text("Suporte", "Support", "Soporte")],
    [
      "/delete-account",
      text("Excluir conta", "Delete account", "Eliminar cuenta"),
    ],
  ];

  const legalLinks: [string, string][] = [
    ["/privacy", text("Privacidade", "Privacy", "Privacidad")],
    ["/terms", text("Termos de Uso", "Terms of Use", "Términos de Uso")],
    [
      "/community-guidelines",
      text(
        "Diretrizes da Comunidade",
        "Community Guidelines",
        "Directrices de la Comunidad",
      ),
    ],
    [
      "/purchases",
      text(
        "Itens e moedas virtuais",
        "Items and virtual currency",
        "Objetos y monedas virtuales",
      ),
    ],
    [
      "/ai-transparency",
      text("Transparência de IA", "AI transparency", "Transparencia de IA"),
    ],
    [
      "/third-party-services",
      text(
        "Serviços e integrações",
        "Services and integrations",
        "Servicios e integraciones",
      ),
    ],
  ];

  const socialLinks = [
    ["https://instagram.com/mythstride", "Instagram"],
    ["https://www.youtube.com/@mythstride", "YouTube"],
    ["https://x.com/mythstride", "X"],
  ];

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__banner">
        <Link href={localePath(locale)} aria-label="MythStride" prefetch={false}>
          <Image
            src="/images/optimized/app-icon.webp"
            alt=""
            width={44}
            height={44}
          />
        </Link>
        <p className="site-footer__claim">
          {text(
            "Corra no mundo real. Progrida em outro.",
            "Run in the real world. Progress in another.",
            "Corre en el mundo real. Progresa en otro.",
          )}
        </p>
      </div>

      <div className="site-container site-footer__grid">
        <FooterColumn title={copy.product} locale={locale} links={productLinks} />

        <div className="site-footer__column">
          <h2>{copy.universe}</h2>
          <Link
            href={`${localePath(locale)}#${homeSectionIds.elyndor}`}
            prefetch={false}
          >
            {nav.elyndor}
          </Link>
          {universeLinks.map(([href, label]) => (
            <Link href={localePath(locale, href)} key={href} prefetch={false}>
              {label}
            </Link>
          ))}
        </div>

        <FooterColumn title={copy.support} locale={locale} links={helpLinks} />
        <FooterColumn title={copy.legal} locale={locale} links={legalLinks} />

        <div className="site-footer__column">
          <h2>{copy.social}</h2>
          {socialLinks.map(([href, label]) => (
            <a
              href={href}
              key={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} — MythStride`}
            >
              {label}
            </a>
          ))}
          <Link className="site-footer__tester" href="/login/" prefetch={false}>
            {nav.tester}
          </Link>
        </div>
      </div>

      <div className="site-container site-footer__base">
        <p>
          © {new Date().getFullYear()} MythStride. {copy.rights}
        </p>

        <div className="site-footer__locales">
          <span>{copy.language}</span>
          <strong lang={locale}>{getLocaleLabel(locale, locale)}</strong>
          {getOtherLocales(locale).map((candidate) => (
            <Link
              href={localePath(candidate)}
              hrefLang={candidate}
              lang={candidate}
              key={candidate}
              prefetch={false}
            >
              {getLocaleLabel(candidate, locale)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  locale,
  links,
}: {
  title: string;
  locale: PublicLocale;
  links: [string, string][];
}) {
  return (
    <div className="site-footer__column">
      <h2>{title}</h2>
      {links.map(([href, label]) => (
        <Link href={localePath(locale, href)} key={href} prefetch={false}>
          {label}
        </Link>
      ))}
    </div>
  );
}

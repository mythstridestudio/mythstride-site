import Image from "next/image";
import Link from "next/link";
import { siteCopy } from "@/content/site";
import {
  getLocalizedText,
  localeLabels,
  localePath,
  type PublicLocale,
} from "@/lib/locales";

type LocalizedFooterProps = {
  locale: PublicLocale;
};

export function LocalizedFooter({ locale }: LocalizedFooterProps) {
  const copy = siteCopy[locale].footer;
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  const productLinks = [
    ["/features", text("Recursos", "Features", "Funciones")],
    ["/how-it-works", text("Como funciona", "How it works", "Cómo funciona")],
    ["/events", text("Eventos", "Events", "Eventos")],
    ["/community", text("Comunidade", "Community", "Comunidad")],
    ["/aethron", "Aethron"],
    ["/wear-os", "Wear OS"],
  ];
  const helpLinks = [
    ["/closed-beta", text("Beta fechado", "Closed beta", "Beta cerrada")],
    ["/faq", text("Dúvidas frequentes", "FAQ", "Preguntas frecuentes")],
    ["/support", text("Suporte", "Support", "Soporte")],
    ["/delete-account", text("Excluir conta", "Delete account", "Eliminar cuenta")],
  ];
  const legalLinks = [
    [
      "/privacy",
      text("Privacidade — rascunho", "Privacy — draft", "Privacidad — borrador"),
    ],
    ["/terms", text("Termos — rascunho", "Terms — draft", "Términos — borrador")],
    [
      "/community-guidelines",
      text(
        "Diretrizes — rascunho",
        "Guidelines — draft",
        "Directrices — borrador",
      ),
    ],
    ["/purchases", text("Compras futuras", "Future purchases", "Compras futuras")],
    [
      "/ai-transparency",
      text("Transparência de IA", "AI transparency", "Transparencia de IA"),
    ],
    [
      "/third-party-services",
      text("Serviços de terceiros", "Third-party services", "Servicios de terceros"),
    ],
  ];

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand">
          <Link href={localePath(locale)} aria-label="MythStride">
            <Image
              src="/images/optimized/app-icon.webp"
              alt=""
              width={48}
              height={48}
            />
            <span>MythStride</span>
          </Link>
          <p>Run in the real world. Progress in another.</p>
        </div>
        <FooterColumn title={copy.product} locale={locale} links={productLinks} />
        <FooterColumn title={copy.support} locale={locale} links={helpLinks} />
        <FooterColumn title={copy.legal} locale={locale} links={legalLinks} />
        <div className="site-footer__column">
          <h2>{copy.social}</h2>
          <span className="footer-pending" aria-disabled="true">
            Instagram · {copy.comingSoon}
          </span>
          <span className="footer-pending" aria-disabled="true">
            Discord · {copy.comingSoon}
          </span>
          <span className="footer-pending" aria-disabled="true">
            YouTube · {copy.comingSoon}
          </span>
        </div>
      </div>
      <div className="site-container site-footer__base">
        <p>
          © {new Date().getFullYear()} MythStride. {copy.rights}
        </p>
        <p>{copy.draftNote}</p>
        <p>
          {copy.language}: {localeLabels[locale]}
        </p>
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
  links: string[][];
}) {
  return (
    <div className="site-footer__column">
      <h2>{title}</h2>
      {links.map(([href, label]) => (
        <Link href={localePath(locale, href)} key={href}>
          {label}
        </Link>
      ))}
    </div>
  );
}

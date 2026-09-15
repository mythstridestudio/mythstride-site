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
    ["/privacy", text("Privacidade", "Privacy", "Privacidad")],
    ["/terms", text("Termos de Uso", "Terms of Use", "Términos de Uso")],
    [
      "/community-guidelines",
      text("Diretrizes da Comunidade", "Community Guidelines", "Directrices de la Comunidad"),
    ],
    ["/purchases", text("Itens e moedas virtuais", "Items and virtual currency", "Objetos y monedas virtuales")],
    [
      "/ai-transparency",
      text("Transparência de IA", "AI transparency", "Transparencia de IA"),
    ],
    [
      "/third-party-services",
      text("Serviços e integrações", "Services and integrations", "Servicios e integraciones"),
    ],
  ];
  const socialLinks = [
    ["https://instagram.com/mythstride", "Instagram"],
    ["https://www.youtube.com/@mythstride", "YouTube"],
    ["https://x.com/mythstride", "X"],
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
          <p>{text("Corra no mundo real. Progrida em outro.", "Run in the real world. Progress in another.", "Corre en el mundo real. Progresa en otro.")}</p>
        </div>
        <FooterColumn title={copy.product} locale={locale} links={productLinks} />
        <FooterColumn title={copy.support} locale={locale} links={helpLinks} />
        <FooterColumn title={copy.legal} locale={locale} links={legalLinks} />
        <div className="site-footer__column">
          <h2>{copy.social}</h2>
          {socialLinks.map(([href, label]) => (
            <a href={href} key={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} — MythStride`}>
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="site-container site-footer__base">
        <p>
          © {new Date().getFullYear()} MythStride. {copy.rights}
        </p>
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

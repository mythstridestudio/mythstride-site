import Image from "next/image";
import Link from "next/link";
import { siteCopy } from "@/content/site";
import { localeLabels, localePath, type PublicLocale } from "@/lib/locales";

type LocalizedFooterProps = {
  locale: PublicLocale;
};

export function LocalizedFooter({ locale }: LocalizedFooterProps) {
  const copy = siteCopy[locale].footer;
  const isPt = locale === "pt-BR";
  const productLinks = [
    ["/features", isPt ? "Recursos" : "Features"],
    ["/how-it-works", isPt ? "Como funciona" : "How it works"],
    ["/events", isPt ? "Eventos" : "Events"],
    ["/community", isPt ? "Comunidade" : "Community"],
    ["/aethron", "Aethron"],
    ["/wear-os", "Wear OS"],
  ];
  const helpLinks = [
    ["/closed-beta", isPt ? "Beta fechado" : "Closed beta"],
    ["/faq", isPt ? "Dúvidas frequentes" : "FAQ"],
    ["/support", isPt ? "Suporte" : "Support"],
    ["/delete-account", isPt ? "Excluir conta" : "Delete account"],
  ];
  const legalLinks = [
    ["/privacy", isPt ? "Privacidade — rascunho" : "Privacy — draft"],
    ["/terms", isPt ? "Termos — rascunho" : "Terms — draft"],
    [
      "/community-guidelines",
      isPt ? "Diretrizes — rascunho" : "Guidelines — draft",
    ],
    ["/purchases", isPt ? "Compras futuras" : "Future purchases"],
    ["/ai-transparency", isPt ? "Transparência de IA" : "AI transparency"],
    [
      "/third-party-services",
      isPt ? "Serviços de terceiros" : "Third-party services",
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

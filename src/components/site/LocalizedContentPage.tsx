import type { ReactNode } from "react";
import Link from "next/link";
import { ContentSections, LegalPageShell } from "@/components/site/LegalPageShell";
import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { PageHero } from "@/components/site/PageHero";
import {
  getPageContent,
  type PageSlug,
} from "@/content/pages";
import { siteCopy } from "@/content/site";
import { getLocalizedText, localePath, type PublicLocale } from "@/lib/locales";

type LocalizedContentPageProps = {
  locale: PublicLocale;
  slug: PageSlug;
  children?: ReactNode;
};

export function LocalizedContentPage({
  locale,
  slug,
  children,
}: LocalizedContentPageProps) {
  const content = getPageContent(slug, locale);
  const copy = siteCopy[locale];

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <LocalizedNavigation locale={locale} />
      <main id="main-content">
        <PageHero
          compact
          eyebrow={content.eyebrow}
          title={content.title}
          body={content.summary}
          primary={
            {
              href: `${localePath(locale)}#join`,
              label: copy.nav.join,
            }
          }
          secondary={{
            href: localePath(locale),
            label: getLocalizedText(locale, {
              "pt-BR": "Voltar ao início",
              en: "Back to home",
              es: "Volver al inicio",
            }),
          }}
        />
        <div className="content-page-wrap">
          {children ? (
            <LegalPageShell content={content}>{children}</LegalPageShell>
          ) : (
            <div className="site-container">
              <ContentSections sections={content.sections} />
              {slug === "support" ? <SupportLinks locale={locale} /> : null}
              {slug === "privacy" ? <PrivacyControlLink locale={locale} /> : null}
            </div>
          )}
        </div>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

function PrivacyControlLink({ locale }: { locale: PublicLocale }) {
  return (
    <div className="support-links">
      <Link className="text-link" href={localePath(locale, "/delete-account")}>
        {getLocalizedText(locale, { "pt-BR": "Solicitar exclusão da conta", en: "Request account deletion", es: "Solicitar la eliminación de la cuenta" })}
      </Link>
    </div>
  );
}

function SupportLinks({ locale }: { locale: PublicLocale }) {
  const links = [
    ["/privacy", getLocalizedText(locale, { "pt-BR": "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad" })],
    ["/delete-account", getLocalizedText(locale, { "pt-BR": "Excluir minha conta", en: "Delete my account", es: "Eliminar mi cuenta" })],
    ["/community-guidelines", getLocalizedText(locale, { "pt-BR": "Diretrizes da Comunidade", en: "Community Guidelines", es: "Directrices de la Comunidad" })],
  ];

  return (
    <nav className="support-links" aria-label={getLocalizedText(locale, { "pt-BR": "Links de suporte", en: "Support links", es: "Enlaces de soporte" })}>
      {links.map(([href, label]) => <Link className="text-link" href={localePath(locale, href)} key={href}>{label}</Link>)}
    </nav>
  );
}

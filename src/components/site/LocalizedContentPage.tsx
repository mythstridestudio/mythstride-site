import type { ReactNode } from "react";
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
            <div className="site-container"><ContentSections sections={content.sections} /></div>
          )}
        </div>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

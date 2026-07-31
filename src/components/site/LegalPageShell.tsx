import type { ReactNode } from "react";
import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import { LegalDraftNotice } from "@/components/site/LegalDraftNotice";
import {
  getLegalDisplayValue,
  legalFieldLabels,
} from "@/config/legal";
import type { ContentSection, LocalizedPageContent } from "@/content/pages";
import type { PublicLocale } from "@/lib/locales";

type LegalPageShellProps = {
  locale: PublicLocale;
  content: LocalizedPageContent;
  children?: ReactNode;
};

export function LegalPageShell({
  locale,
  content,
  children,
}: LegalPageShellProps) {
  return (
    <div className="site-container legal-page">
      <LegalDraftNotice locale={locale} />
      <ContentSections locale={locale} sections={content.sections} />
      {children}
    </div>
  );
}

export function ContentSections({
  locale,
  sections,
}: {
  locale: PublicLocale;
  sections: ContentSection[];
}) {
  return (
    <div className="content-sections">
      {sections.map((section, index) => (
        <section className="content-section" key={section.title}>
          <span className="content-section__number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="content-section__body">
            {section.feature ? (
              <FeatureStatusBadge
                feature={section.feature}
                locale={locale}
                detailed
              />
            ) : null}
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.pendingFields?.length ? (
              <dl className="pending-fields">
                {section.pendingFields.map((field) => (
                  <div key={field}>
                    <dt>{legalFieldLabels[field][locale]}</dt>
                    <dd>{getLegalDisplayValue(field, locale)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}

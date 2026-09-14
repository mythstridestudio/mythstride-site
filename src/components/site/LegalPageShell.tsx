import type { ReactNode } from "react";
import type { ContentSection, LocalizedPageContent } from "@/content/pages";

type LegalPageShellProps = {
  content: LocalizedPageContent;
  children?: ReactNode;
};

export function LegalPageShell({
  content,
  children,
}: LegalPageShellProps) {
  return (
    <div className="site-container legal-page">
      <ContentSections sections={content.sections} />
      {children}
    </div>
  );
}

export function ContentSections({
  sections,
}: {
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
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <ContactParagraph key={paragraph} text={paragraph} />
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}

const supportEmail = "contato@playmythstride.com";

function ContactParagraph({ text }: { text: string }) {
  if (!text.includes(supportEmail)) return <p>{text}</p>;

  const [before, after] = text.split(supportEmail);
  return (
    <p>
      {before}<a className="text-link" href={`mailto:${supportEmail}`}>{supportEmail}</a>{after}
    </p>
  );
}

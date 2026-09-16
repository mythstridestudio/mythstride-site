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
              <p key={paragraph}>
                <LinkedText text={paragraph} />
              </p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <LinkedText text={bullet} />
                  </li>
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

// Legal copy is authored as plain strings so it stays translatable and
// diffable. The support address and the third-party policy URLs still have to
// be reachable, so they are turned into real links at render time instead of
// being embedded as markup in the content file.
const linkPattern = new RegExp(`(${supportEmail}|https://[^\\s]+[^\\s.,;:)])`, "g");

function LinkedText({ text }: { text: string }) {
  const parts = text.split(linkPattern);

  return (
    <>
      {parts.map((part, index) => {
        if (part === supportEmail) {
          return (
            <a className="text-link" href={`mailto:${supportEmail}`} key={index}>
              {supportEmail}
            </a>
          );
        }

        if (part.startsWith("https://")) {
          return (
            <a
              className="text-link text-link--url"
              href={part}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          );
        }

        return part;
      })}
    </>
  );
}

import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  tone?: "void" | "stone" | "ember";
  align?: "left" | "center";
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  body,
  tone = "void",
  align = "left",
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`site-section site-section--${tone} ${className}`.trim()}
    >
      <div className="site-container">
        {title ? (
          <header
            className={`section-heading section-heading--${align}`.trim()}
          >
            {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {body ? <p className="section-lede">{body}</p> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import { CtaGroup } from "@/components/site/CtaGroup";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  aside?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  aside,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <header className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <div className="site-container page-hero__grid">
        <div className="page-hero__copy">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero__lede">{body}</p>
          {children}
          {primary || secondary ? (
            <CtaGroup>
              {primary ? (
                <Link className="button button--primary" href={primary.href}>
                  {primary.label}
                  <ArrowRightIcon className="button__icon" />
                </Link>
              ) : null}
              {secondary ? (
                <Link className="button button--secondary" href={secondary.href}>
                  {secondary.label}
                </Link>
              ) : null}
            </CtaGroup>
          ) : null}
        </div>
        {aside ? <div className="page-hero__aside">{aside}</div> : null}
      </div>
    </header>
  );
}

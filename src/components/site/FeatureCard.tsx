import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/Icons";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export function FeatureCard({
  icon,
  title,
  body,
  href,
  linkLabel,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      {href && linkLabel ? (
        <Link className="text-link" href={href}>
          {linkLabel}
          <ArrowRightIcon className="text-link__icon" />
        </Link>
      ) : null}
    </article>
  );
}

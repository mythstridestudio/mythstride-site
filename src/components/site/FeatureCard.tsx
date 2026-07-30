import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

type FeatureCardProps = {
  locale: PublicLocale;
  feature: ProductFeature;
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  detailedStatus?: boolean;
};

export function FeatureCard({
  locale,
  feature,
  icon,
  title,
  body,
  href,
  linkLabel,
  detailedStatus = false,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card__icon" aria-hidden="true">
        {icon}
      </div>
      <FeatureStatusBadge
        feature={feature}
        locale={locale}
        detailed={detailedStatus}
      />
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

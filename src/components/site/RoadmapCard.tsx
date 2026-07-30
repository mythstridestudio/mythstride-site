import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

type RoadmapCardProps = {
  number: string;
  locale: PublicLocale;
  feature: ProductFeature;
  title: string;
  body: string;
};

export function RoadmapCard({
  number,
  locale,
  feature,
  title,
  body,
}: RoadmapCardProps) {
  return (
    <article className="roadmap-milestone">
      <span className="roadmap-milestone__number">{number}</span>
      <FeatureStatusBadge feature={feature} locale={locale} />
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

import {
  getFeatureStatus,
  getStatusContent,
  type ProductFeature,
} from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

type FeatureStatusBadgeProps = {
  feature: ProductFeature;
  locale: PublicLocale;
  detailed?: boolean;
  className?: string;
};

export function FeatureStatusBadge({
  feature,
  locale,
  detailed = false,
  className = "",
}: FeatureStatusBadgeProps) {
  const status = getFeatureStatus(feature);
  const content = getStatusContent(status, locale);

  return (
    <span
      className={`status-badge status-badge--${status} ${className}`.trim()}
      data-feature={feature}
      data-status={status}
      title={detailed ? undefined : content.description}
    >
      <span className="status-badge__mark" aria-hidden="true" />
      <span>
        <span className="status-badge__label">{content.label}</span>
        {detailed ? (
          <span className="status-badge__description">
            {content.description}
          </span>
        ) : null}
      </span>
    </span>
  );
}

import { EyeIcon } from "@/components/Icons";
import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

type ScreenshotFrameProps = {
  locale: PublicLocale;
  feature: ProductFeature;
  title: string;
  caption: string;
  label: string;
};

export function ScreenshotFrame({
  locale,
  feature,
  title,
  caption,
  label,
}: ScreenshotFrameProps) {
  return (
    <figure className="screenshot-frame">
      <div className="screenshot-frame__viewport">
        <div className="screenshot-frame__placeholder">
          <EyeIcon className="screenshot-frame__icon" />
          <span>{label}</span>
        </div>
      </div>
      <figcaption>
        <FeatureStatusBadge feature={feature} locale={locale} />
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

import Image from "next/image";

import { EyeIcon } from "@/components/Icons";
import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";
import { getAssetPath } from "@/lib/assets";

type ScreenshotFrameProps = {
  locale: PublicLocale;
  feature: ProductFeature;
  title: string;
  caption: string;
  label: string;
  /**
   * A capture of the real app, when one exists for this slot.
   *
   * Absent means the placeholder stands, which is what
   * `WEBSITE_SCREENSHOT_REQUIREMENTS.md` requires until a capture exists and is
   * approved. A slot is never filled with a capture of a different screen
   * because it looks better there.
   */
  image?: { src: string; alt: string };
};

export function ScreenshotFrame({
  locale,
  feature,
  title,
  caption,
  label,
  image,
}: ScreenshotFrameProps) {
  return (
    <figure className="screenshot-frame">
      <div className="screenshot-frame__viewport">
        {image ? (
          // 720x1560, half the 1440x3120 device master in each direction, so
          // the aspect ratio is the phone's own.
          <Image
            src={getAssetPath(image.src)}
            alt={image.alt}
            width={720}
            height={1560}
            className="screenshot-frame__shot"
            sizes="(max-width: 640px) 78vw, 320px"
            loading="lazy"
          />
        ) : (
          <div className="screenshot-frame__placeholder">
            <EyeIcon className="screenshot-frame__icon" />
            <span>{label}</span>
          </div>
        )}
      </div>
      <figcaption>
        <FeatureStatusBadge feature={feature} locale={locale} />
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

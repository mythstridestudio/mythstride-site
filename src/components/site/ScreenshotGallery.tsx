"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import { ScreenshotFrame } from "@/components/site/ScreenshotFrame";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

export type ScreenshotGalleryItem = {
  feature: ProductFeature;
  title: string;
  caption: string;
  label: string;
};

type ScreenshotGalleryProps = {
  locale: PublicLocale;
  items: ScreenshotGalleryItem[];
};

export function ScreenshotGallery({
  locale,
  items,
}: ScreenshotGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPt = locale === "pt-BR";

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(280, track.clientWidth * 0.72),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div
      className="screenshot-gallery"
      role="region"
      aria-label={isPt ? "Capturas do produto" : "Product captures"}
    >
      <div className="screenshot-gallery__controls">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label={isPt ? "Ver captura anterior" : "View previous capture"}
        >
          <ArrowRightIcon />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label={isPt ? "Ver próxima captura" : "View next capture"}
        >
          <ArrowRightIcon />
        </button>
      </div>
      <div
        className="screenshot-gallery__track"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
        }}
      >
        {items.map((item) => (
          <ScreenshotFrame
            key={item.title}
            locale={locale}
            feature={item.feature}
            title={item.title}
            caption={item.caption}
            label={item.label}
          />
        ))}
      </div>
      <p className="screenshot-gallery__hint">
        {isPt
          ? "Use as setas do teclado ou os controles para percorrer os espaços."
          : "Use the arrow keys or controls to move through the slots."}
      </p>
    </div>
  );
}

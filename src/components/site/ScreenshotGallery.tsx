"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import { ScreenshotFrame } from "@/components/site/ScreenshotFrame";
import { getLocalizedText, type PublicLocale } from "@/lib/locales";

export type ScreenshotGalleryItem = {
  title: string;
  caption: string;
  image: { src: string; alt: string };
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
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });

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
      aria-label={text("Capturas do produto", "Product captures", "Capturas del producto")}
    >
      <div className="screenshot-gallery__controls">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label={text(
            "Ver captura anterior",
            "View previous capture",
            "Ver captura anterior",
          )}
        >
          <ArrowRightIcon />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label={text(
            "Ver próxima captura",
            "View next capture",
            "Ver captura siguiente",
          )}
        >
          <ArrowRightIcon />
        </button>
      </div>
      <div
        className="screenshot-gallery__track"
        ref={trackRef}
        tabIndex={0}
        aria-label={text(
          "Percorra as capturas com as setas do teclado.",
          "Browse the captures with the arrow keys.",
          "Recorre las capturas con las flechas del teclado.",
        )}
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
            title={item.title}
            caption={item.caption}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}

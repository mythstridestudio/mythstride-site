import type { Metadata } from "next";
import "../globals.css";
import { documentFontClasses } from "@/app/fonts";
import { siteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MythStride | Choose your language",
  description:
    "Choose Portuguese or English to explore MythStride, the running RPG.",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt-BR/",
      en: "/en/",
      "x-default": "/",
    },
  },
};

export default function DefaultRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={documentFontClasses}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/optimized/hero-mobile.webp"
          type="image/webp"
          media="(max-width: 52rem)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/optimized/hero-desktop.webp"
          type="image/webp"
          media="(min-width: 52.001rem)"
        />
      </head>
      <body className="min-h-full bg-void font-body text-text-primary">
        {children}
      </body>
    </html>
  );
}

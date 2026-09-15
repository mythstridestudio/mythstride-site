import type { Metadata } from "next";
import "../globals.css";
import { documentFontClasses } from "@/app/fonts";
import { siteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MythStride | Run in the real world. Progress in another.",
  description:
    "MythStride turns real-world running into RPG progression. Available in Portuguese, English, and Spanish.",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt-BR/",
      en: "/en/",
      es: "/es/",
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

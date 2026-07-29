import type { Metadata } from "next";
import type { PublicLocale } from "@/lib/locales";
import { localePath } from "@/lib/locales";

export const siteUrl = "https://playmythstride.com";

type MetadataInput = {
  locale: PublicLocale;
  path?: string;
  title: string;
  description: string;
  noIndex?: boolean;
};

export function createLocalizedMetadata({
  locale,
  path = "/",
  title,
  description,
  noIndex = false,
}: MetadataInput): Metadata {
  const canonical = localePath(locale, path);
  const alternatePath = localePath(locale === "pt-BR" ? "en" : "pt-BR", path);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "pt-BR": locale === "pt-BR" ? canonical : alternatePath,
        en: locale === "en" ? canonical : alternatePath,
        "x-default": "/",
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type: "website",
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt-BR" ? ["en_US"] : ["pt_BR"],
      url: canonical,
      siteName: "MythStride",
      title,
      description,
      images: [
        {
          url: "/images/social/mythstride-og.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "pt-BR"
              ? "MythStride — corrida e progressão de RPG"
              : "MythStride — running and RPG progression",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/social/mythstride-og.jpg"],
    },
  };
}

export function createNoIndexMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

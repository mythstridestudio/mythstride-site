import type { Metadata } from "next";
import {
  getLocalizedText,
  localePath,
  publicLocales,
  type PublicLocale,
} from "@/lib/locales";

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
  const languages = Object.fromEntries(
    publicLocales.map((candidate) => [candidate, localePath(candidate, path)]),
  );
  const openGraphLocales: Record<PublicLocale, string> = {
    "pt-BR": "pt_BR",
    en: "en_US",
    es: "es_ES",
  };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
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
      locale: openGraphLocales[locale],
      alternateLocale: publicLocales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => openGraphLocales[candidate]),
      url: canonical,
      siteName: "MythStride",
      title,
      description,
      images: [
        {
          url: "/images/social/mythstride-og.jpg",
          width: 1200,
          height: 630,
          alt: getLocalizedText(locale, {
            "pt-BR": "MythStride — corrida e progressão de RPG",
            en: "MythStride — running and RPG progression",
            es: "MythStride — carrera y progresión de RPG",
          }),
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

import {
  getLocalizedText,
  localePath,
  publicLocales,
  type PublicLocale,
} from "@/lib/locales";
import { siteUrl } from "@/lib/metadata";

export function getHomeStructuredData(locale: PublicLocale) {
  const localizedUrl = new URL(localePath(locale), siteUrl).toString();
  const description = getLocalizedText(locale, {
    "pt-BR": "RPG de corrida em preparação para beta fechado Android.",
    en: "Running RPG preparing for an Android closed beta.",
    es: "RPG de carrera en preparación para una beta cerrada en Android.",
  });

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "MythStride",
      url: siteUrl,
      logo: `${siteUrl}/images/optimized/app-icon.webp`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "MythStride",
      inLanguage: publicLocales,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "MythStride",
      url: localizedUrl,
      description,
      applicationCategory: "GameApplication",
      operatingSystem: "Android",
      inLanguage: locale,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

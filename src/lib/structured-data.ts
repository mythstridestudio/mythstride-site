import type { PublicLocale } from "@/lib/locales";
import { localePath } from "@/lib/locales";
import { siteUrl } from "@/lib/metadata";

export function getHomeStructuredData(locale: PublicLocale) {
  const localizedUrl = new URL(localePath(locale), siteUrl).toString();
  const description =
    locale === "pt-BR"
      ? "RPG de corrida em preparação para beta fechado Android."
      : "Running RPG preparing for an Android closed beta.";

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
      inLanguage: ["pt-BR", "en"],
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

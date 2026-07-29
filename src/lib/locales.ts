export const publicLocales = ["pt-BR", "en"] as const;

export type PublicLocale = (typeof publicLocales)[number];

export const defaultLocale: PublicLocale = "pt-BR";

export const localeLabels: Record<PublicLocale, string> = {
  "pt-BR": "Português (Brasil)",
  en: "English",
};

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

export function normalizePublicLocale(value: string): PublicLocale | null {
  return isPublicLocale(value) ? value : null;
}

export function getAlternateLocale(locale: PublicLocale): PublicLocale {
  return locale === "pt-BR" ? "en" : "pt-BR";
}

export function localePath(locale: PublicLocale, path = "/"): string {
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/|\/$/g, "")}`;
  return `/${locale}${normalizedPath}/`;
}

export function replacePathLocale(
  pathname: string,
  nextLocale: PublicLocale,
): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isPublicLocale(segments[0])) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}/`;
  }

  return localePath(nextLocale);
}

export function getLocaleLabel(
  locale: PublicLocale,
  labelLocale: PublicLocale,
): string {
  if (labelLocale === "pt-BR") {
    return locale === "pt-BR" ? "Português (Brasil)" : "English";
  }

  return locale === "pt-BR" ? "Portuguese (Brazil)" : "English";
}

export const publicLocales = ["pt-BR", "en", "es"] as const;

export type PublicLocale = (typeof publicLocales)[number];

export const defaultLocale: PublicLocale = "pt-BR";

export const localeLabels: Record<PublicLocale, string> = {
  "pt-BR": "Português (Brasil)",
  en: "English",
  es: "Español",
};

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

export function normalizePublicLocale(value: string): PublicLocale | null {
  return isPublicLocale(value) ? value : null;
}

export function getOtherLocales(locale: PublicLocale): PublicLocale[] {
  return publicLocales.filter((candidate) => candidate !== locale);
}

export function getLocalizedText<T>(
  locale: PublicLocale,
  content: Record<PublicLocale, T>,
): T {
  return content[locale];
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
  const labels: Record<PublicLocale, Record<PublicLocale, string>> = {
    "pt-BR": {
      "pt-BR": "Português (Brasil)",
      en: "Inglês",
      es: "Espanhol",
    },
    en: {
      "pt-BR": "Portuguese (Brazil)",
      en: "English",
      es: "Spanish",
    },
    es: {
      "pt-BR": "Portugués (Brasil)",
      en: "Inglés",
      es: "Español",
    },
  };

  return labels[labelLocale][locale];
}

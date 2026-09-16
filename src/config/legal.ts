/**
 * Machine-readable record of the legal facts published by the site.
 *
 * The localized prose lives in `src/content/pages.ts` because it has to read
 * naturally in three languages. This file is the single place that states the
 * same facts in a comparable form, and `tests/legal-consistency.test.mjs`
 * checks that the published pages agree with it.
 */
export const legalConfig = {
  brand: "MythStride",
  publisher: "MythStride Studio",
  androidPackage: "com.playmythstride.mythstride",
  contactEmail: "contato@playmythstride.com",
  minimumAge: 18,
  effectiveDate: "2026-09-15",
  effectiveDateLabels: {
    "pt-BR": "15 de setembro de 2026",
    en: "September 15, 2026",
    es: "15 de septiembre de 2026",
  },
  country: "Brasil",
  jurisdiction: "Legislação brasileira",
} as const;

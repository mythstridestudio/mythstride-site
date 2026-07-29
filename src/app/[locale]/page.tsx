import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModernHomePage } from "@/components/site/ModernHomePage";
import { getLocalizedText, isPublicLocale } from "@/lib/locales";
import { createLocalizedMetadata } from "@/lib/metadata";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) return {};

  return createLocalizedMetadata({
    locale,
    path: "/",
    title: getLocalizedText(locale, {
      "pt-BR": "MythStride | Transforme corridas em progresso de RPG",
      en: "MythStride | Turn runs into RPG progression",
      es: "MythStride | Convierte carreras en progreso de RPG",
    }),
    description: getLocalizedText(locale, {
      "pt-BR":
        "Corra no mundo real e progrida em Elyndor. Conheça o beta fechado Android do RPG de corrida MythStride.",
      en: "Run in the real world and progress in Elyndor. Discover the MythStride Android closed beta.",
      es: "Corre en el mundo real y progresa en Elyndor. Descubre la beta cerrada de MythStride para Android.",
    }),
  });
}

export default async function LocalizedHomePage({
  params,
}: LocalizedPageProps) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return <ModernHomePage locale={locale} />;
}

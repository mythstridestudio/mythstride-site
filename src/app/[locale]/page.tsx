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
        "Transforme corridas reais em missões, batalhas, recompensas e progresso de RPG. Conheça MythStride e entre na lista do beta fechado para Android.",
      en: "Turn real runs into quests, battles, rewards, and RPG progression. Discover MythStride and join the Android closed beta list.",
      es: "Convierte carreras reales en misiones, batallas, recompensas y progreso de RPG. Descubre MythStride y únete a la lista de la beta cerrada para Android.",
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

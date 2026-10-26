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
        "Transforme corridas reais em missões, batalhas, recompensas e progresso de RPG. MythStride está disponível na App Store e no Google Play. Registre suas corridas e acompanhe sua evolução.",
      en: "Turn real runs into quests, battles, rewards, and RPG progression. Download MythStride on the App Store or Google Play to track runs and follow your progress.",
      es: "Convierte carreras reales en misiones, batallas, recompensas y progreso de RPG. Descarga MythStride en App Store o Google Play para registrar tus carreras y seguir tu progreso.",
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModernHomePage } from "@/components/site/ModernHomePage";
import { createLocalizedMetadata } from "@/lib/metadata";
import { isPublicLocale } from "@/lib/locales";

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
    title:
      locale === "pt-BR"
        ? "MythStride | Transforme corridas em progresso de RPG"
        : "MythStride | Turn runs into RPG progression",
    description:
      locale === "pt-BR"
        ? "Corra no mundo real e progrida em Elyndor. Conheça o beta fechado Android do RPG de corrida MythStride."
        : "Run in the real world and progress in Elyndor. Discover the MythStride Android closed beta.",
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

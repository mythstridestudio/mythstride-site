import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizersLanding } from "@/components/site/OrganizersLanding";
import { organizersCopy } from "@/content/organizers";
import { createLocalizedMetadata } from "@/lib/metadata";
import { isPublicLocale, publicLocales } from "@/lib/locales";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return publicLocales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isPublicLocale(locale)) return {};

  return createLocalizedMetadata({
    locale,
    path: "/organizadores",
    title: organizersCopy[locale].seoTitle,
    description: organizersCopy[locale].seoDescription,
  });
}

export default async function OrganizersPage({ params }: Props) {
  const { locale } = await params;
  if (!isPublicLocale(locale)) notFound();
  return <OrganizersLanding locale={locale} />;
}

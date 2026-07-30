import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedContentPage } from "@/components/site/LocalizedContentPage";
import {
  getPageContent,
  isDraftPageSlug,
  isPageSlug,
  pageSlugs,
} from "@/content/pages";
import { createLocalizedMetadata } from "@/lib/metadata";
import { isPublicLocale } from "@/lib/locales";

type ContentPageProps = {
  params: Promise<{ locale: string; page: string }>;
};

export function generateStaticParams() {
  return pageSlugs.map((page) => ({ page }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { locale, page } = await params;

  if (!isPublicLocale(locale) || !isPageSlug(page)) return {};

  const content = getPageContent(page, locale);

  return createLocalizedMetadata({
    locale,
    path: `/${page}`,
    title: `${content.title} | MythStride`,
    description: content.summary,
    noIndex: isDraftPageSlug(page),
  });
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { locale, page } = await params;

  if (!isPublicLocale(locale) || !isPageSlug(page)) {
    notFound();
  }

  return <LocalizedContentPage locale={locale} slug={page} />;
}

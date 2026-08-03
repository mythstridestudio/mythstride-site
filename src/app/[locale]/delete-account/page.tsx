import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountDeletionRequestForm } from "@/components/site/AccountDeletionRequestForm";
import { LocalizedContentPage } from "@/components/site/LocalizedContentPage";
import { getPageContent } from "@/content/pages";
import { isPublicLocale } from "@/lib/locales";
import { createLocalizedMetadata } from "@/lib/metadata";

type DeleteAccountPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: DeleteAccountPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) return {};

  const content = getPageContent("delete-account", locale);

  return createLocalizedMetadata({
    locale,
    path: "/delete-account",
    title: `${content.title} | MythStride`,
    description: content.summary,
    noIndex: true,
  });
}

export default async function DeleteAccountPage({
  params,
}: DeleteAccountPageProps) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <LocalizedContentPage locale={locale} slug="delete-account">
      <AccountDeletionRequestForm locale={locale} />
    </LocalizedContentPage>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountDeletionConfirmClient } from "@/components/site/AccountDeletionConfirmClient";
import { LegalDraftNotice } from "@/components/site/LegalDraftNotice";
import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { PageHero } from "@/components/site/PageHero";
import { siteCopy } from "@/content/site";
import { getLocalizedText, isPublicLocale, localePath } from "@/lib/locales";
import { createLocalizedMetadata } from "@/lib/metadata";

type ConfirmPageProps = {
  params: Promise<{ locale: string }>;
};

const pageCopy = {
  eyebrow: {
    "pt-BR": "Controle de conta — rascunho",
    en: "Account control — draft",
    es: "Control de cuenta — borrador",
  },
  title: {
    "pt-BR": "Confirmar exclusão de conta",
    en: "Confirm account deletion",
    es: "Confirmar la eliminación de la cuenta",
  },
  body: {
    "pt-BR":
      "Este passo verifica a titularidade da conta usando o link enviado por email. Ele não conclui a exclusão imediatamente.",
    en: "This step verifies account ownership using the link sent by email. It does not complete the deletion immediately.",
    es: "Este paso verifica la titularidad de la cuenta con el enlace enviado por correo. No completa la eliminación de inmediato.",
  },
  back: {
    "pt-BR": "Voltar ao início",
    en: "Back to home",
    es: "Volver al inicio",
  },
} as const;

export async function generateMetadata({
  params,
}: ConfirmPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLocale(locale)) return {};

  return createLocalizedMetadata({
    locale,
    path: "/delete-account/confirm",
    title: `${getLocalizedText(locale, pageCopy.title)} | MythStride`,
    description: getLocalizedText(locale, pageCopy.body),
    noIndex: true,
  });
}

export default async function DeleteAccountConfirmPage({
  params,
}: ConfirmPageProps) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  const copy = siteCopy[locale];

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <LocalizedNavigation locale={locale} />
      <main id="main-content">
        <PageHero
          compact
          eyebrow={getLocalizedText(locale, pageCopy.eyebrow)}
          title={getLocalizedText(locale, pageCopy.title)}
          body={getLocalizedText(locale, pageCopy.body)}
          secondary={{
            href: localePath(locale),
            label: getLocalizedText(locale, pageCopy.back),
          }}
        />
        <div className="legal-page-wrap">
          <div className="site-container legal-page">
            <LegalDraftNotice locale={locale} />
            <AccountDeletionConfirmClient locale={locale} />
          </div>
        </div>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

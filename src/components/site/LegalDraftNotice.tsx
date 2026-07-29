import { ScrollIcon } from "@/components/Icons";
import { getLocalizedText, type PublicLocale } from "@/lib/locales";

export function LegalDraftNotice({ locale }: { locale: PublicLocale }) {
  const title = getLocalizedText(locale, {
    "pt-BR": "Rascunho técnico — não é política aprovada",
    en: "Technical draft — not an approved policy",
    es: "Borrador técnico — no es una política aprobada",
  });
  const body = getLocalizedText(locale, {
    "pt-BR":
      "Este conteúdo registra a estrutura prevista e as decisões ainda pendentes. Ele precisa de revisão jurídica e aprovação do responsável antes de entrar em vigor.",
    en: "This content records the intended structure and decisions that are still pending. It requires legal review and owner approval before taking effect.",
    es: "Este contenido registra la estructura prevista y las decisiones aún pendientes. Requiere revisión jurídica y aprobación del responsable antes de entrar en vigor.",
  });

  return (
    <aside className="draft-notice" role="note" data-legal-draft>
      <ScrollIcon className="draft-notice__icon" />
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </aside>
  );
}

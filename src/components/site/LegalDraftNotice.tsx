import { ScrollIcon } from "@/components/Icons";
import type { PublicLocale } from "@/lib/locales";

export function LegalDraftNotice({ locale }: { locale: PublicLocale }) {
  const isPt = locale === "pt-BR";

  return (
    <aside className="draft-notice" role="note" data-legal-draft>
      <ScrollIcon className="draft-notice__icon" />
      <div>
        <strong>
          {isPt
            ? "Rascunho técnico — não é política aprovada"
            : "Technical draft — not an approved policy"}
        </strong>
        <p>
          {isPt
            ? "Este conteúdo registra a estrutura prevista e as decisões ainda pendentes. Ele precisa de revisão jurídica e aprovação do responsável antes de entrar em vigor."
            : "This content records the intended structure and decisions that are still pending. It requires legal review and owner approval before taking effect."}
        </p>
      </div>
    </aside>
  );
}

import type { PublicLocale } from "@/lib/locales";

export type LegalField =
  | "legalEntityName"
  | "cnpj"
  | "businessAddress"
  | "supportEmail"
  | "privacyEmail"
  | "privacyContact"
  | "effectiveDate"
  | "accountDeletionPeriod"
  | "dataRetentionSchedule"
  | "minimumAge"
  | "aiProviderStatement"
  | "aiDataTrainingStatement"
  | "purchaseRetentionPolicy"
  | "diamondDeletionPolicy";

const env = (value: string | undefined): string | null => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

export const legalConfig: Record<LegalField, string | null> = {
  legalEntityName: env(process.env.MYTHSTRIDE_LEGAL_ENTITY_NAME),
  cnpj: env(process.env.MYTHSTRIDE_CNPJ),
  businessAddress: env(process.env.MYTHSTRIDE_BUSINESS_ADDRESS),
  supportEmail: env(process.env.MYTHSTRIDE_SUPPORT_EMAIL),
  privacyEmail: env(process.env.MYTHSTRIDE_PRIVACY_EMAIL),
  privacyContact: env(process.env.MYTHSTRIDE_PRIVACY_CONTACT),
  effectiveDate: env(process.env.MYTHSTRIDE_LEGAL_EFFECTIVE_DATE),
  accountDeletionPeriod: env(
    process.env.MYTHSTRIDE_ACCOUNT_DELETION_PERIOD,
  ),
  dataRetentionSchedule: env(process.env.MYTHSTRIDE_DATA_RETENTION_SCHEDULE),
  minimumAge: env(process.env.MYTHSTRIDE_MINIMUM_AGE),
  aiProviderStatement: env(process.env.MYTHSTRIDE_AI_PROVIDER_STATEMENT),
  aiDataTrainingStatement: env(
    process.env.MYTHSTRIDE_AI_DATA_TRAINING_STATEMENT,
  ),
  purchaseRetentionPolicy: env(
    process.env.MYTHSTRIDE_PURCHASE_RETENTION_POLICY,
  ),
  diamondDeletionPolicy: env(
    process.env.MYTHSTRIDE_DIAMOND_DELETION_POLICY,
  ),
};

export const legalFieldLabels: Record<
  LegalField,
  Record<PublicLocale, string>
> = {
  legalEntityName: {
    "pt-BR": "Entidade responsável",
    en: "Responsible entity",
    es: "Entidad responsable",
  },
  cnpj: {
    "pt-BR": "CNPJ ou registro",
    en: "Company registration",
    es: "Registro de la empresa",
  },
  businessAddress: {
    "pt-BR": "Endereço comercial",
    en: "Business address",
    es: "Dirección comercial",
  },
  supportEmail: {
    "pt-BR": "Contato de suporte",
    en: "Support contact",
    es: "Contacto de soporte",
  },
  privacyEmail: {
    "pt-BR": "Contato de privacidade",
    en: "Privacy contact",
    es: "Contacto de privacidad",
  },
  privacyContact: {
    "pt-BR": "Responsável por privacidade",
    en: "Privacy lead",
    es: "Responsable de privacidad",
  },
  effectiveDate: {
    "pt-BR": "Data de vigência",
    en: "Effective date",
    es: "Fecha de entrada en vigor",
  },
  accountDeletionPeriod: {
    "pt-BR": "Prazo de exclusão",
    en: "Account deletion period",
    es: "Plazo de eliminación de la cuenta",
  },
  dataRetentionSchedule: {
    "pt-BR": "Tabela de retenção",
    en: "Data retention schedule",
    es: "Calendario de retención de datos",
  },
  minimumAge: {
    "pt-BR": "Idade mínima",
    en: "Minimum age",
    es: "Edad mínima",
  },
  aiProviderStatement: {
    "pt-BR": "Declaração do provedor de IA",
    en: "AI provider statement",
    es: "Declaración del proveedor de IA",
  },
  aiDataTrainingStatement: {
    "pt-BR": "Uso de dados para treinamento",
    en: "Data use for model training",
    es: "Uso de datos para entrenar modelos",
  },
  purchaseRetentionPolicy: {
    "pt-BR": "Retenção de compras",
    en: "Purchase retention",
    es: "Retención de compras",
  },
  diamondDeletionPolicy: {
    "pt-BR": "Diamantes após exclusão",
    en: "Diamonds after deletion",
    es: "Diamantes después de la eliminación",
  },
};

export function getLegalDisplayValue(
  field: LegalField,
  locale: PublicLocale,
): string {
  return (
    legalConfig[field] ??
    (locale === "pt-BR"
      ? "Decisão do responsável pendente"
      : locale === "es"
        ? "Decisión pendiente del responsable"
        : "Owner decision pending")
  );
}

export function getPendingLegalFields(): LegalField[] {
  return (Object.keys(legalConfig) as LegalField[]).filter(
    (field) => !legalConfig[field],
  );
}

import type { PublicLocale } from "@/lib/locales";

export type FeatureStatus =
  | "beta"
  | "validation"
  | "development"
  | "planned"
  | "future";

export const statusContent: Record<
  FeatureStatus,
  Record<PublicLocale, { label: string; description: string }>
> = {
  beta: {
    "pt-BR": {
      label: "Disponível no beta",
      description:
        "A funcionalidade está presente na build do beta e continua sujeita a ajustes.",
    },
    en: {
      label: "Available in beta",
      description:
        "The feature is present in the beta build and remains subject to change.",
    },
    es: {
      label: "Disponible en la beta",
      description:
        "La función está presente en la versión beta y sigue sujeta a cambios.",
    },
  },
  validation: {
    "pt-BR": {
      label: "Em validação",
      description:
        "A implementação existe, mas ainda depende de testes, configuração ou aceite antes da disponibilidade ampla.",
    },
    en: {
      label: "Under validation",
      description:
        "The implementation exists but still requires testing, configuration or acceptance before wider availability.",
    },
    es: {
      label: "En validación",
      description:
        "La implementación existe, pero todavía requiere pruebas, configuración o aceptación antes de una disponibilidad más amplia.",
    },
  },
  development: {
    "pt-BR": {
      label: "Em desenvolvimento",
      description:
        "A funcionalidade faz parte da visão do produto e ainda está sendo completada.",
    },
    en: {
      label: "In development",
      description:
        "The feature is part of the product vision and is still being completed.",
    },
    es: {
      label: "En desarrollo",
      description:
        "La función forma parte de la visión del producto y todavía se está completando.",
    },
  },
  planned: {
    "pt-BR": {
      label: "Planejado",
      description:
        "A funcionalidade está no roadmap e ainda não está disponível no beta atual.",
    },
    en: {
      label: "Planned",
      description:
        "The feature is on the roadmap and is not available in the current beta.",
    },
    es: {
      label: "Planificado",
      description:
        "La función está en la hoja de ruta y no está disponible en la beta actual.",
    },
  },
  future: {
    "pt-BR": {
      label: "Disponível futuramente",
      description:
        "A funcionalidade será considerada em uma fase posterior e não está ativa agora.",
    },
    en: {
      label: "Coming later",
      description:
        "The feature is intended for a later phase and is not active now.",
    },
    es: {
      label: "Disponible más adelante",
      description:
        "La función está prevista para una fase posterior y no está activa ahora.",
    },
  },
};

export const productStatus = {
  runTracking: "validation",
  bossBattles: "beta",
  inventory: "beta",
  achievements: "beta",
  events: "beta",
  friends: "beta",
  groups: "beta",
  weeklyRanking: "beta",
  aethron: "validation",
  strava: "validation",
  wearOs: "validation",
  raids: "development",
  sagas: "development",
  founderSword: "validation",
  communitySafety: "development",
  accountDeletion: "validation",
  rewardedAds: "future",
  diamondPurchases: "future",
  ios: "planned",
  appleWatch: "planned",
} as const satisfies Record<string, FeatureStatus>;

export type ProductFeature = keyof typeof productStatus;

export function getFeatureStatus(feature: ProductFeature): FeatureStatus {
  return productStatus[feature];
}

export function getStatusContent(
  status: FeatureStatus,
  locale: PublicLocale,
) {
  return statusContent[status][locale];
}

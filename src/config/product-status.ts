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
  accountDeletion: "development",
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

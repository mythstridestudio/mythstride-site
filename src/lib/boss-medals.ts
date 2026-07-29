import { getAssetPath } from "./assets";

const bossMedalBySlug: Record<string, string> = {
  aranha_rainha: "aranha_rainha.webp",
  arpia: "arpia.webp",
  arpia_sem_fundo: "arpia.webp",
  cavaleiro_caido: "cavaleiro_caido.webp",
  cerberus: "cerberus.webp",
  ciclope: "Ciclope.webp",
  colosso_de_pedra: "colosso_de_pedra.webp",
  dragao_ancestral: "dragao_ancestral.webp",
  fenix: "fenix.webp",
  golem_ferro: "golem_ferro.webp",
  guardiao_da_forja: "guardiao_da_forja.webp",
  hidra: "hidra.webp",
  kraken: "kraken.webp",
  lich_do_abismo: "lich_do_abismo.webp",
  medusa: "medusa.webp",
  minotaura: "minotaura.webp",
  minotauro_de_guerra: "minotauro_de_guerra.webp",
  rei_do_vazio: "rei_do_vazio.webp",
  serpe_tempestuosa: "serpe_tempestuosa.webp",
};

function normalizeBossSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getBossMedalPath(name: string | null | undefined) {
  const slug = normalizeBossSlug(name ?? "");
  const filename = bossMedalBySlug[slug];

  return filename ? getAssetPath(`/images/boss-medals/${filename}`) : null;
}

export function getBossImagePath(value: string | null | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  if (trimmedValue.startsWith("http") || trimmedValue.startsWith("data:")) {
    return trimmedValue;
  }

  return getBossMedalPath(trimmedValue) ?? getAssetPath(trimmedValue);
}

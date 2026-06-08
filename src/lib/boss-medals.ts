import { getAssetPath } from "./assets";

const bossMedalBySlug: Record<string, string> = {
  aranha_rainha: "aranha_rainha.png",
  arpia: "arpia.png",
  arpia_sem_fundo: "arpia_sem_fundo.png",
  cavaleiro_caido: "cavaleiro_caido.png",
  cerberus: "cerberus.png",
  ciclope: "Ciclope.png",
  colosso_de_pedra: "colosso_de_pedra.png",
  dragao_ancestral: "dragao_ancestral.png",
  fenix: "fenix.png",
  golem_ferro: "golem_ferro.png",
  guardiao_da_forja: "guardiao_da_forja.png",
  hidra: "hidra.png",
  kraken: "kraken.png",
  lich_do_abismo: "lich_do_abismo.png",
  medusa: "medusa.png",
  minotaura: "minotaura.png",
  minotauro_de_guerra: "minotauro_de_guerra.png",
  rei_do_vazio: "rei_do_vazio.png",
  serpe_tempestuosa: "serpe_tempestuosa.png",
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

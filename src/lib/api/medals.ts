import { apiFetch } from "./client";

export interface EarnedEventMedal {
  id: string;
  eventoId: string;
  eventoNome: string;
  earnedAtUtc: string;
  medalha: {
    id: string;
    nome: string;
    descricao: string | null;
    imagemUrl: string | null;
  };
  estatisticas: {
    distanciaKm: number | null;
    tempoSegundos: number | null;
    paceMinKm: number | null;
    dataCorrida: string | null;
    localNome: string | null;
    ordemConclusao: number | null;
  } | null;
}

/** Public read-only projection: no JWT and never calls claim-new. */
export function getPublicEarnedMedals(username: string): Promise<EarnedEventMedal[]> {
  return apiFetch<EarnedEventMedal[]>(
    "/api/public/player/" + encodeURIComponent(username.trim()) + "/medals",
    { cache: "no-store" },
  );
}

/** API uploads live on the backend's origin, not on GitHub Pages. */
export function resolveEventMedalImage(value: string | null | undefined): string | null {
  const path = value?.trim();
  if (!path) return null;

  if (/^https:\/\//i.test(path)) return path;
  if (!path.startsWith("/uploads/")) return null;

  const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!apiOrigin) return null;

  try {
    const base = new URL(apiOrigin);
    if (base.protocol !== "https:" && base.hostname !== "localhost") return null;
    return new URL(path, base.origin).href;
  } catch {
    return null;
  }
}

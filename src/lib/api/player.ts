import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type {
  CurrentBoss,
  PrivatePlayerProfile,
  RunHistoryEntry,
  Trophy,
} from "./types";

export interface DashboardData {
  profile: PrivatePlayerProfile;
  currentBoss: CurrentBoss | null;
  trophies: Trophy[];
  history: RunHistoryEntry[];
  partialErrors: Partial<Record<"currentBoss" | "trophies" | "history", string>>;
}

interface ApiEnvelope<T> {
  data?: T;
  player?: T;
  profile?: T;
  boss?: T;
  trophies?: T;
  history?: T;
  runs?: T;
}

function unwrapResponse<T>(response: T | ApiEnvelope<T>, keys: Array<keyof ApiEnvelope<T>> = ["data"]): T {
  if (response && typeof response === "object") {
    const envelope = response as ApiEnvelope<T>;

    for (const key of keys) {
      if (envelope[key] !== undefined) {
        // TODO: Remove envelope fallbacks after the backend response contract is confirmed.
        return envelope[key] as T;
      }
    }
  }

  return response as T;
}

function normalizeList<T>(response: T[] | ApiEnvelope<T[]>): T[] {
  const unwrapped = unwrapResponse<T[]>(response, ["data", "trophies", "history", "runs"]);
  return Array.isArray(unwrapped) ? unwrapped : [];
}

export async function getPlayerProfile(accessToken: string) {
  const response = await apiFetch<PrivatePlayerProfile | ApiEnvelope<PrivatePlayerProfile>>(API_ENDPOINTS.player.profile, {
    accessToken,
  });

  return unwrapResponse<PrivatePlayerProfile>(response, ["data", "player", "profile"]);
}

export async function getCurrentBoss(accessToken: string) {
  const response = await apiFetch<CurrentBoss | null | ApiEnvelope<CurrentBoss | null>>(API_ENDPOINTS.player.currentBoss, {
    accessToken,
  });

  return unwrapResponse<CurrentBoss | null>(response, ["data", "boss"]);
}

export async function getTrophies(accessToken: string) {
  const response = await apiFetch<Trophy[] | ApiEnvelope<Trophy[]>>(API_ENDPOINTS.player.trophies, { accessToken });
  return normalizeList<Trophy>(response);
}

export async function getRunHistory(accessToken: string) {
  const response = await apiFetch<RunHistoryEntry[] | ApiEnvelope<RunHistoryEntry[]>>(API_ENDPOINTS.player.history, {
    accessToken,
  });

  return normalizeList<RunHistoryEntry>(response);
}

export async function getDashboardData(accessToken: string): Promise<DashboardData> {
  const profile = await getPlayerProfile(accessToken);
  const [currentBossResult, trophiesResult, historyResult] = await Promise.allSettled([
    getCurrentBoss(accessToken),
    getTrophies(accessToken),
    getRunHistory(accessToken),
  ]);

  const partialErrors: DashboardData["partialErrors"] = {};

  if (currentBossResult.status === "rejected") {
    partialErrors.currentBoss = "Current boss data is temporarily unavailable.";
  }

  if (trophiesResult.status === "rejected") {
    partialErrors.trophies = "Achievements are temporarily unavailable.";
  }

  if (historyResult.status === "rejected") {
    partialErrors.history = "Adventure history is temporarily unavailable.";
  }

  return {
    profile,
    currentBoss: currentBossResult.status === "fulfilled" ? currentBossResult.value : null,
    trophies: trophiesResult.status === "fulfilled" ? trophiesResult.value : [],
    history: historyResult.status === "fulfilled" ? historyResult.value : [],
    partialErrors,
  };
}

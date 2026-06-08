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

export async function getPlayerProfile(accessToken: string) {
  return apiFetch<PrivatePlayerProfile>(API_ENDPOINTS.player.profile, {
    accessToken,
  });
}

export async function getCurrentBoss(accessToken: string) {
  return apiFetch<CurrentBoss | null>(API_ENDPOINTS.player.currentBoss, {
    accessToken,
  });
}

export async function getTrophies(accessToken: string) {
  return apiFetch<Trophy[]>(API_ENDPOINTS.player.trophies, { accessToken });
}

export async function getRunHistory(accessToken: string) {
  return apiFetch<RunHistoryEntry[]>(API_ENDPOINTS.player.history, {
    accessToken,
  });
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

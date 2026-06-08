import { ApiConfigurationError, ApiError, apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { PublicPlayerProfile } from "./types";

export type PublicPlayerSource = "api" | "development-mock";

export interface PublicPlayerResult {
  player: PublicPlayerProfile;
  source: PublicPlayerSource;
  fallbackReason?: string;
}

const developmentMockPlayer = (username: string): PublicPlayerProfile => ({
  username,
  displayName: username || "Botinha",
  level: 12,
  title: "Keeper of the Flame",
  totalDistanceKm: 245.7,
  currentStreakDays: 21,
  currentBoss: {
    name: "Spectral King",
    imageUrl: "/images/spectral-king.png",
    healthPercent: 64,
  },
  guild: {
    name: "Cavaleiros da Aurora",
  },
  rareAchievements: [
    {
      id: 1,
      name: "First Boss Defeated",
      rarity: "rare",
      description: "Defeated your first boss.",
      iconUrl: "/images/boss-medusa-medal.png",
      unlockedAt: "2026-06-03T00:00:00Z",
    },
    {
      id: 2,
      name: "Flamekeeper Streak",
      rarity: "epic",
      description: "Kept the Flame alive through repeated effort.",
      iconUrl: "/images/fire_sword.png",
      unlockedAt: "2026-06-03T00:00:00Z",
    },
  ],
  latestRun: {
    id: 1,
    distanceKm: 5.2,
    date: "2026-06-03T00:00:00Z",
    summary: "Strengthened the Flame",
    durationMinutes: 34,
    bossDamage: 120,
  },
});

const getFallbackReason = (error: unknown) => {
  if (error instanceof ApiConfigurationError) {
    return error.message;
  }

  if (error instanceof ApiError) {
    return `Public player endpoint returned ${error.status}.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Public player endpoint is unavailable.";
};

export async function getPublicPlayer(username: string): Promise<PublicPlayerResult> {
  const normalizedUsername = username.trim();

  try {
    const player = await apiFetch<PublicPlayerProfile>(API_ENDPOINTS.publicPlayer.byUsername(normalizedUsername));

    return { player, source: "api" };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return {
        player: developmentMockPlayer(normalizedUsername),
        source: "development-mock",
        fallbackReason: getFallbackReason(error),
      };
    }

    throw error;
  }
}

import { ApiConfigurationError, ApiError, apiFetch } from "./client";
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
  totalRuns: 48,
  bossesDefeated: 3,
  currentStreakDays: 21,
  currentBoss: {
    name: "Spectral King",
    imageUrl: "/images/spectral-king.png",
    healthPercent: 64,
  },
  guild: {
    name: "Cavaleiros da Aurora",
    description: "A guild of runners who keep the eastern flame lit before dawn.",
  },
  rareAchievements: [
    {
      name: "First Boss Defeated",
      rarity: "rare",
      iconUrl: "/images/boss-medusa-medal.png",
    },
    {
      name: "Flamekeeper Streak",
      rarity: "epic",
      iconUrl: "/images/fire_sword.png",
    },
  ],
  lastRun: {
    distanceKm: 5.2,
    date: "2026-06-03",
    summary: "Strengthened the Flame",
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
    const player = await apiFetch<PublicPlayerProfile>(
      `/api/public/player/${encodeURIComponent(normalizedUsername)}`,
    );

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

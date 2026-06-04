export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface PublicPlayerBoss {
  name: string;
  imageUrl: string;
  healthPercent: number;
}

export interface PublicPlayerGuild {
  name: string;
}

export interface PublicPlayerAchievement {
  name: string;
  rarity: AchievementRarity;
  iconUrl: string;
}

export interface PublicPlayerLastRun {
  distanceKm: number;
  date: string;
  summary: string;
}

export interface PublicPlayerProfile {
  username: string;
  displayName: string;
  level: number;
  title: string;
  totalDistanceKm: number;
  currentStreakDays: number;
  currentBoss: PublicPlayerBoss | null;
  guild: PublicPlayerGuild | null;
  rareAchievements: PublicPlayerAchievement[];
  lastRun: PublicPlayerLastRun | null;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt?: string;
}

export interface PrivatePlayerProfile {
  username: string;
  displayName: string;
  level: number;
  title?: string;
}

export interface CurrentBoss {
  name: string;
  imageUrl: string;
  healthPercent: number;
}

export interface Trophy {
  id: string;
  name: string;
  rarity: AchievementRarity;
  unlockedAt?: string;
}

export interface RunHistoryEntry {
  id: string;
  distanceKm: number;
  date: string;
  summary?: string;
}

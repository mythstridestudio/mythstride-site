export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface PublicPlayerBoss {
  name: string;
  imageUrl: string | null;
  healthPercent: number;
}

export interface PublicPlayerGuild {
  name: string;
}

export interface PublicPlayerAchievement {
  id: number;
  name: string;
  rarity: AchievementRarity;
  description: string | null;
  iconUrl: string | null;
  unlockedAt: string | null;
}

export interface PublicPlayerLatestRun {
  id: number;
  distanceKm: number;
  date: string;
  summary: string | null;
  durationMinutes: number | null;
  bossDamage: number | null;
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
  latestRun: PublicPlayerLatestRun | null;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  token: string;
  usuarioId: number;
  email: string;
  jogadorId: number | null;
  requiresPlayerCreation: boolean;
}

export interface PrivatePlayerProfile {
  username: string;
  displayName: string;
  level: number;
  title: string;
  totalDistanceKm: number;
  currentStreakDays: number;
  guild: PublicPlayerGuild | null;
}

export interface CurrentBoss {
  name: string;
  imageUrl: string | null;
  healthPercent: number;
}

export interface Trophy {
  id: number;
  name: string;
  rarity: AchievementRarity;
  description: string | null;
  iconUrl: string | null;
  unlockedAt: string | null;
}

export interface RunHistoryEntry {
  id: number;
  distanceKm: number;
  date: string;
  summary: string | null;
  durationMinutes: number | null;
  bossDamage: number | null;
}

export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface PublicPlayerBoss {
  name: string;
  imageUrl: string;
  healthPercent: number;
}

export interface PublicPlayerGuild {
  name: string;
  emblemUrl?: string;
  description?: string;
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
  totalRuns?: number;
  bossesDefeated?: number;
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
  tokenType?: "Bearer" | string;
  expiresAt?: string;
  user?: PrivatePlayerProfile;
}

export interface PrivatePlayerProfile {
  id?: string;
  username: string;
  displayName?: string;
  level: number;
  title?: string;
  totalDistanceKm?: number;
  currentStreakDays?: number;
  guild?: PublicPlayerGuild | null;
}

export interface CurrentBoss {
  name: string;
  imageUrl?: string;
  healthPercent: number;
  level?: number;
  damagePercent?: number;
}

export interface Trophy {
  id: string;
  name: string;
  rarity: AchievementRarity;
  description?: string;
  iconUrl?: string;
  unlockedAt?: string;
}

export interface RunHistoryEntry {
  id: string;
  distanceKm: number;
  date: string;
  summary?: string;
  durationMinutes?: number;
  bossDamage?: number;
}

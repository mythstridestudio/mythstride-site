export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface PlayerGuild {
  name: string;
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

export interface PrivatePlayerProfile {
  username: string;
  displayName: string;
  level: number;
  title: string;
  totalDistanceKm: number;
  currentStreakDays: number;
  guild: PlayerGuild | null;
}

export interface PublicPlayerProfile extends PrivatePlayerProfile {
  currentBoss?: CurrentBoss | null;
  rareAchievements?: Trophy[];
  latestRun?: RunHistoryEntry | null;
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

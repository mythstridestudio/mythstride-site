import { apiFetch } from "./client";

export interface AdminPlayerRun {
  runId: string;
  startedAtUtc: string;
  finishedAtUtc: string;
  distanceKm: number;
  durationSeconds: number;
  sourceType: string;
  measurementSource: string;
  xpGained: number;
  bossDamage: number;
  eligibleForProgression: boolean;
  ineligibilityReason: string | null;
}

export interface AdminPlayerImport {
  provider: string;
  sourcePlatform: string | null;
  activityType: string;
  startedAtUtc: string;
  distanceKm: number;
  durationSeconds: number;
  importedAtUtc: string;
  ingestionStatus: string | null;
  eligibleForProgression: boolean;
  ineligibilityReason: string | null;
  runId: string | null;
}

export interface AdminStravaConnection {
  isActive: boolean;
  connectedAtUtc: string;
  eligibilityStartedAtUtc: string;
  lastSyncAtUtc: string | null;
  tokenExpiresAtUtc: string;
}

export interface AdminHealthConnection {
  platform: string;
  isActive: boolean;
  consentGrantedAtUtc: string;
  eligibilityStartedAtUtc: string;
  lastSyncAtUtc: string | null;
  revokedAtUtc: string | null;
}

export interface AdminStravaSync {
  startedAtUtc: string;
  finishedAtUtc: string | null;
  success: boolean;
  imported: number;
  ignored: number;
  duplicated: number;
  totalDistanceKm: number;
  errorMessage: string | null;
}

export interface AdminSyncSourceSummary {
  provider: string;
  imported: number;
  matchedExistingRun: number;
  rewarded: number;
  xpReleased: number;
  competitive: number;
  pendingReview: number;
  refused: { reason: string; count: number }[];
  lastImportedAtUtc: string | null;
}

export interface AdminPlayerActivity {
  playerId: string;
  name: string;
  windowDays: number;
  connections: { strava: AdminStravaConnection | null; health: AdminHealthConnection[] };
  stravaSyncs: AdminStravaSync[];
  syncSummary: { windowDays: number; sources: AdminSyncSourceSummary[] };
  runs: AdminPlayerRun[];
  imports: AdminPlayerImport[];
}

export function getAdminPlayerActivity(token: string, playerId: string, days = 30) {
  return apiFetch<AdminPlayerActivity>(
    `/api/admin/players/${encodeURIComponent(playerId)}/runs?days=${days}`,
    { accessToken: token, cache: "no-store" },
  );
}

/** Backend ExternalActivityIneligibilityReasons, in support-friendly Portuguese. */
const REASONS: Record<string, string> = {
  BeforeEligibilityWindow: "Anterior à conexão da integração",
  FutureActivity: "Data no futuro",
  InvalidActivity: "Atividade inválida",
  RestrictedProvenance: "Origem não permitida",
  UnsupportedActivityType: "Não é corrida",
  DistanceBelowMinimum: "Distância abaixo do mínimo",
  ImplausibleActivity: "Dados implausíveis",
  DailyLimitReached: "Limite diário atingido",
  ManualEntry: "Lançamento manual",
  SourceNotAuthorized: "Fonte não autorizada",
  OverlapsExistingRun: "Sobrepõe outra corrida",
};

export function describeIneligibility(reason: string | null | undefined) {
  if (!reason) return null;
  return REASONS[reason] ?? reason;
}

export interface AdminPlayerProfile {
  profile: {
    playerId: string;
    name: string;
    email: string;
    emailVerified: boolean;
    authProvider: string;
    role: string;
    locale: string;
    level: number;
    xp: number;
    gold: number;
    diamonds: number;
    lastRunAtUtc: string | null;
    totalRuns: number;
    totalDistanceKm: number;
  };
  events: {
    eventId: string;
    eventName: string;
    eventStatus: number;
    startsAtUtc: string;
    endsAtUtc: string;
    joinedAtUtc: string;
    completed: boolean;
    receivedMedal: boolean;
    accumulatedKm: number;
    disqualified: boolean;
  }[];
  recentDiamonds: {
    amount: number;
    type: string;
    source: string;
    description: string | null;
    balanceAfter: number;
    createdAtUtc: string;
  }[];
  limits: { maxDiamondsPerCredit: number; maxGoldPerCredit: number };
}

export type AdminCurrency = "diamonds" | "gold";

export function getAdminPlayerProfile(token: string, playerId: string) {
  return apiFetch<AdminPlayerProfile>(`/api/admin/players/${encodeURIComponent(playerId)}`, {
    accessToken: token,
    cache: "no-store",
  });
}

/** Credit only. Reuse the same idempotencyKey when retrying one operation. */
export function creditAdminPlayer(
  token: string,
  playerId: string,
  currency: AdminCurrency,
  amount: number,
  reason: string,
  idempotencyKey: string,
) {
  return apiFetch<{ currency: AdminCurrency; amount: number; balanceAfter: number; replayed: boolean }>(
    `/api/admin/players/${encodeURIComponent(playerId)}/credits`,
    {
      accessToken: token,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency, amount, reason: reason.trim(), idempotencyKey }),
    },
  );
}

import { apiFetch } from "./client";
import type { SaveExternalRegistrationRequest } from "../external-registration";

export const EVENT_STATUS = {
  draft: 0,
  published: 1,
  active: 2,
  processing: 3,
  completed: 4,
  cancelled: 5,
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export interface AdminEvent {
  id: string;
  nome: string;
  descricao?: string | null;
  inicio: string;
  fim: string;
  dataHoraCorrida?: string | null;
  inicioValidacaoCorrida?: string | null;
  fimValidacaoCorrida?: string | null;
  prazoSincronizacao?: string | null;
  distanciaMinimaKm?: number | null;
  localNome?: string | null;
  endereco?: string | null;
  organizador?: string | null;
  percursoUrl?: string | null;
  regulamentoUrl?: string | null;
  imagemUrl?: string | null;
  bannerUrl?: string | null;
  ativo: boolean;
  status: EventStatus;
  requerEquipe?: boolean;
  // Counters only come from the list endpoint; create/update return the entity.
  quantidadeCodigos?: number;
  quantidadeParticipantesOficiais?: number;
  quantidadeRecompensas?: number;
  // Player-facing flags only; the links themselves come from the admin-only
  // external registration endpoint below.
  externalRegistrationOpen?: boolean;
  externalRegistrationProvider?: string | null;
}

export interface SaveAdminEventRequest {
  nome: string;
  descricao?: string | null;
  inicio: string;
  fim: string;
  dataHoraCorrida?: string | null;
  inicioValidacaoCorrida?: string | null;
  fimValidacaoCorrida?: string | null;
  prazoSincronizacao?: string | null;
  distanciaMinimaKm?: number | null;
  localNome?: string | null;
  endereco?: string | null;
  organizador?: string | null;
  percursoUrl?: string | null;
  regulamentoUrl?: string | null;
  imagemUrl?: string | null;
  bannerUrl?: string | null;
  ativo: boolean;
  requerEquipe: false;
  chefeId: null;
  codigoAcesso?: string | null;
  maxUsosCodigo?: number;
}

interface PagedAdminEvents {
  items: AdminEvent[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/** Admin uses the database-backed paginated listing, not the active-events
 * cache. This includes draft and inactive events even for large catalogs.
 */
export async function listAdminEvents(accessToken: string): Promise<AdminEvent[]> {
  const all: AdminEvent[] = [];
  let page = 1;
  while (true) {
    const result = await apiFetch<PagedAdminEvents>(
      `/api/Eventos/paged?page=${page}&pageSize=100`,
      { accessToken, cache: "no-store" },
    );
    all.push(...result.items);
    if (!result.hasNextPage || page >= result.totalPages) break;
    page += 1;
  }
  return all;
}

/** Backend's real medal collection status for the JWT's own character. */
export interface PlayerMedalCollection {
  key: string;
  year: number;
  earnedCount: number;
  totalPieces: number;
  complete: boolean;
  pieces: { element: string; earned: boolean; earnedAtUtc: string | null }[];
}

export function getMyMedalCollections(accessToken: string, playerId: string) {
  return apiFetch<PlayerMedalCollection[]>(
    `/api/players/${encodeURIComponent(playerId)}/medals/collections`,
    { accessToken, cache: "no-store" },
  );
}

/** Admin QA: the API awards only to the signed-in JWT player (no recipient ID).
 * Available for 2027 Draft events, with audit logs and idempotent grants.
 */
export async function grantAdminTestEventMedal(accessToken: string, eventId: string) {
  const result = await apiFetch<{ awarded: boolean }>(
    `/api/Eventos/${encodeURIComponent(eventId)}/medalha/teste`,
    { method: "POST", accessToken },
  );
  return result.awarded === true;
}

export async function removeAdminTestEventMedal(accessToken: string, eventId: string) {
  const result = await apiFetch<{ removed: boolean }>(
    `/api/Eventos/${encodeURIComponent(eventId)}/medalha/teste`,
    { method: "DELETE", accessToken },
  );
  return result.removed === true;
}

export function createAdminEvent(
  accessToken: string,
  request: SaveAdminEventRequest,
) {
  return apiFetch<AdminEvent>("/api/Eventos", {
    method: "POST",
    accessToken,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export function updateAdminEvent(
  accessToken: string,
  eventId: string,
  request: SaveAdminEventRequest,
) {
  return apiFetch<AdminEvent>(`/api/Eventos/${eventId}`, {
    method: "PUT",
    accessToken,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export interface OfficialParticipantImportRow {
  linha: number;
  nome: string;
  email?: string | null;
  numeroInscricao: string;
  distanciaKm?: number | null;
}

export interface OfficialParticipantImportResult {
  mensagem: string;
  importados: number;
}

export function importOfficialParticipants(
  accessToken: string,
  eventId: string,
  participants: OfficialParticipantImportRow[],
) {
  return apiFetch<OfficialParticipantImportResult>(
    `/api/Eventos/${eventId}/participantes-oficiais/importar`,
    {
      method: "POST",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantes: participants }),
    },
  );
}

export interface OfficialParticipant {
  id: string;
  nome: string;
  email?: string | null;
  numeroInscricao: string;
  distanciaKm?: number | null;
  vinculado: boolean;
  jogadorId?: string | null;
  vinculadoEm?: string | null;
}

export interface OfficialParticipantPage {
  itens: OfficialParticipant[];
  pagina: number;
  tamanhoPagina: number;
  total: number;
  totalPaginas: number;
}

export interface OfficialParticipantSummary {
  total: number;
  vinculados: number;
  disponiveis: number;
  percentualAdesao: number;
}

export interface SaveOfficialParticipantRequest {
  nome: string;
  email?: string | null;
  numeroInscricao: string;
  distanciaKm?: number | null;
}

export type OfficialParticipantStatusFilter = "all" | "linked" | "waiting";
export type OfficialParticipantSort = "name" | "registration" | "distance" | "status";
export type SortDirection = "asc" | "desc";

export function listOfficialParticipants(
  accessToken: string,
  eventId: string,
  search = "",
  page = 1,
  pageSize = 25,
  status: OfficialParticipantStatusFilter = "all",
  sort: OfficialParticipantSort = "name",
  direction: SortDirection = "asc",
) {
  const query = new URLSearchParams({
    pagina: String(page),
    tamanhoPagina: String(pageSize),
  });
  if (search.trim()) query.set("busca", search.trim());
  if (status !== "all") query.set("vinculado", status === "linked" ? "true" : "false");
  query.set("ordenarPor", {
    name: "nome",
    registration: "inscricao",
    distance: "distancia",
    status: "estado",
  }[sort]);
  query.set("direcao", direction);

  return apiFetch<OfficialParticipantPage>(
    `/api/Eventos/${eventId}/participantes-oficiais?${query.toString()}`,
    { accessToken },
  );
}

export function getOfficialParticipantSummary(
  accessToken: string,
  eventId: string,
) {
  return apiFetch<OfficialParticipantSummary>(
    `/api/Eventos/${eventId}/participantes-oficiais/resumo`,
    { accessToken },
  );
}

export function exportOfficialParticipants(
  accessToken: string,
  eventId: string,
  search = "",
  status: OfficialParticipantStatusFilter = "all",
  sort: OfficialParticipantSort = "name",
  direction: SortDirection = "asc",
) {
  const query = new URLSearchParams();
  if (search.trim()) query.set("busca", search.trim());
  if (status !== "all") query.set("vinculado", status === "linked" ? "true" : "false");
  query.set("ordenarPor", {
    name: "nome",
    registration: "inscricao",
    distance: "distancia",
    status: "estado",
  }[sort]);
  query.set("direcao", direction);
  const suffix = query.size ? `?${query.toString()}` : "";

  return apiFetch<string>(
    `/api/Eventos/${eventId}/participantes-oficiais/exportar${suffix}`,
    { accessToken, headers: { Accept: "text/csv" } },
  );
}

export function createOfficialParticipant(
  accessToken: string,
  eventId: string,
  request: SaveOfficialParticipantRequest,
) {
  return apiFetch<OfficialParticipant>(
    `/api/Eventos/${eventId}/participantes-oficiais`,
    {
      method: "POST",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );
}

export function updateOfficialParticipant(
  accessToken: string,
  eventId: string,
  participantId: string,
  request: SaveOfficialParticipantRequest,
) {
  return apiFetch<OfficialParticipant>(
    `/api/Eventos/${eventId}/participantes-oficiais/${participantId}`,
    {
      method: "PUT",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );
}

export function removeOfficialParticipant(
  accessToken: string,
  eventId: string,
  participantId: string,
) {
  return apiFetch<void>(
    `/api/Eventos/${eventId}/participantes-oficiais/${participantId}`,
    { method: "DELETE", accessToken },
  );
}

/**
 * Event lifecycle. The API enforces the allowed transitions and answers 409
 * when one is invalid, so the UI only mirrors the rules to keep buttons honest.
 */
export function publishAdminEvent(accessToken: string, eventId: string) {
  return apiFetch<unknown>(`/api/Eventos/${eventId}/publicar`, {
    method: "POST",
    accessToken,
  });
}

export function activateAdminEvent(accessToken: string, eventId: string) {
  return apiFetch<unknown>(`/api/Eventos/${eventId}/ativar`, {
    method: "POST",
    accessToken,
  });
}

export function cancelAdminEvent(accessToken: string, eventId: string) {
  return apiFetch<unknown>(`/api/Eventos/${eventId}/cancelar`, {
    method: "POST",
    accessToken,
  });
}

export function finishAdminEvent(accessToken: string, eventId: string) {
  return apiFetch<unknown>(`/api/Eventos/${eventId}/finalizar`, {
    method: "POST",
    accessToken,
  });
}

export const REWARD_DELIVERY = {
  none: 0,
  xp: 1,
  gold: 2,
  diamonds: 3,
  item: 4,
} as const;

export type RewardDelivery = (typeof REWARD_DELIVERY)[keyof typeof REWARD_DELIVERY];

export interface EventReward {
  id: string;
  nome: string;
  descricao?: string | null;
  tipo: string;
  raridade: string;
  imagemUrl?: string | null;
  bonusXpPercentual?: number | null;
  bonusDanoBoss?: number | null;
  exclusivaEvento: boolean;
  ativa: boolean;
  tipoEntrega: RewardDelivery;
  quantidade?: number | null;
  itemBaseId?: string | null;
}

export interface SaveEventRewardRequest {
  nome: string;
  descricao?: string | null;
  tipo: string;
  raridade: string;
  imagemUrl?: string | null;
  bonusXpPercentual?: number | null;
  bonusDanoBoss?: number | null;
  exclusivaEvento: boolean;
  ativa: boolean;
  tipoEntrega: RewardDelivery;
  quantidade?: number | null;
  itemBaseId?: string | null;
}

export interface AdminEventMedal {
  id: string;
  eventoId: string;
  internalKey: string;
  nome: string;
  descricao?: string | null;
  imagemUrl?: string | null;
}

export interface AdminEventDetails extends AdminEvent {
  medalha?: AdminEventMedal | null;
  chefeId?: string | null;
  recompensas: EventReward[];
}

/** Rewards are only exposed through the event detail payload. */
export function getAdminEventDetails(accessToken: string, eventId: string) {
  return apiFetch<AdminEventDetails>(`/api/Eventos/${eventId}`, { accessToken });
}

export function createEventReward(
  accessToken: string,
  eventId: string,
  request: SaveEventRewardRequest,
) {
  return apiFetch<EventReward>(`/api/Eventos/${eventId}/recompensas`, {
    method: "POST",
    accessToken,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export function removeEventReward(
  accessToken: string,
  eventId: string,
  rewardId: string,
) {
  return apiFetch<void>(`/api/Eventos/${eventId}/recompensas/${rewardId}`, {
    method: "DELETE",
    accessToken,
  });
}

export interface GenerateEventCodesRequest {
  quantidade: number;
  maxUsos: number;
  expiraEm?: string | null;
  prefixo?: string | null;
}

export interface GeneratedEventCode {
  id: string;
  codigo: string;
  maxUsos: number;
  expiraEm?: string | null;
}

/**
 * The API stores only a hash, so the plain codes are returned once at
 * generation time and can never be read back.
 */
export function generateEventCodes(
  accessToken: string,
  eventId: string,
  request: GenerateEventCodesRequest,
) {
  return apiFetch<GeneratedEventCode[]>(`/api/Eventos/${eventId}/codigos`, {
    method: "POST",
    accessToken,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export interface EventResult {
  jogadorId: string;
  nome: string;
  rankPosition: number;
  distanciaKm: number;
  desqualificado: boolean;
  motivoDesqualificacao?: string | null;
  recompensasEntregues: boolean;
}

export function listEventResults(accessToken: string, eventId: string) {
  return apiFetch<EventResult[]>(`/api/Eventos/${eventId}/resultados`, {
    accessToken,
  });
}

export function disqualifyEventParticipation(
  accessToken: string,
  eventId: string,
  playerId: string,
  motivo: string,
) {
  return apiFetch<void>(
    `/api/Eventos/${eventId}/participacoes/${playerId}/desqualificar`,
    {
      method: "POST",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo }),
    },
  );
}

/**
 * External registration (Sympla first). Admin-only on the API: the links,
 * which one runners are sent to (affiliate first, then public), whether the
 * button is visible in the app, warnings and outbound click counts. Clicks
 * are visits to the registration page — never registrations or sales.
 */
export interface EventExternalRegistration {
  eventoId: string;
  provider?: string | null;
  registrationUrl?: string | null;
  affiliateRegistrationUrl?: string | null;
  updatedAtUtc?: string | null;
  activeDestination: "affiliate" | "public" | "none";
  registrationOpen: boolean;
  warnings: string[];
  clicks: { total: number; affiliate: number; last7Days: number };
}

export function getEventExternalRegistration(accessToken: string, eventId: string) {
  return apiFetch<EventExternalRegistration>(
    `/api/Eventos/${eventId}/inscricao-externa`,
    { accessToken },
  );
}

export function saveEventExternalRegistration(
  accessToken: string,
  eventId: string,
  request: SaveExternalRegistrationRequest,
) {
  return apiFetch<EventExternalRegistration>(
    `/api/Eventos/${eventId}/inscricao-externa`,
    {
      method: "PUT",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );
}

/**
 * Administrative compensation for players who missed an event medal.
 * Authorization and audit are enforced by the .NET backend.
 */
export interface AdminMedalPlayer {
  playerId: string;
  name: string;
  email: string;
  level: number;
}

export interface CreateEventMedalRequest {
  eventoId: string;
  internalKey: string;
  nome: string;
  descricao?: string | null;
  imagemUrl?: string | null;
}

export function createAdminEventMedal(token: string, request: CreateEventMedalRequest) {
  return apiFetch<{ id: string; eventoId: string; nome: string }>("/api/medalhas", {
    method: "POST",
    accessToken: token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export interface AdminMedalCatalogItem {
  eventId: string;
  medalId: string;
  medalName: string;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  imageUrl?: string | null;
}

export interface AdminPlayerMedal {
  eventId: string;
  medalId: string;
  medalName: string;
  earnedAtUtc: string;
}

export interface AdminMedalGrantResult {
  eventId: string;
  playerId: string;
  awarded: boolean;
}

export function searchAdminMedalPlayers(token: string, query: string) {
  return apiFetch<AdminMedalPlayer[]>(
    `/api/admin/medals/players?query=${encodeURIComponent(query.trim())}`,
    { accessToken: token, cache: "no-store" },
  );
}

export function listAdminMedalCatalog(token: string, query = "") {
  return apiFetch<AdminMedalCatalogItem[]>(
    `/api/admin/medals/catalog?query=${encodeURIComponent(query.trim())}`,
    { accessToken: token, cache: "no-store" },
  );
}

export function listAdminPlayerMedals(token: string, playerId: string) {
  return apiFetch<AdminPlayerMedal[]>(
    `/api/admin/medals/players/${encodeURIComponent(playerId)}`,
    { accessToken: token, cache: "no-store" },
  );
}

export function grantAdminMedalToPlayer(
  token: string,
  playerId: string,
  eventId: string,
  reason: string,
) {
  return apiFetch<AdminMedalGrantResult>("/api/admin/medals/grants", {
    accessToken: token,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, eventId, reason: reason.trim() }),
  });
}

/** Assets are validated, re-encoded and stored by the .NET API, never Next.js. */
export type EventMediaKind = "event" | "banner" | "medal";

export async function uploadAdminEventMedia(
  accessToken: string,
  kind: EventMediaKind,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await apiFetch<{ url: string }>(
    `/api/Eventos/media/${kind}`,
    { method: "POST", accessToken, body: formData },
  );
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base || !result.url.startsWith("/uploads/")) {
    throw new Error("O servidor retornou uma URL de imagem inválida.");
  }
  // Persist the public absolute URL: installed app versions already support
  // Image.network(https://...), without requiring a store release per event.
  return new URL(result.url, `${base.replace(/\/$/, "")}/`).toString();
}

export function updateAdminEventMedal(
  token: string,
  medalId: string,
  request: { nome: string; descricao?: string | null; imagemUrl?: string | null },
) {
  return apiFetch<AdminEventMedal>(`/api/medalhas/${encodeURIComponent(medalId)}`, {
    method: "PUT",
    accessToken: token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

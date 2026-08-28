import { apiFetch } from "./client";

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

export function listAdminEvents(accessToken: string) {
  return apiFetch<AdminEvent[]>("/api/Eventos", { accessToken });
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

export interface AdminEventDetails extends AdminEvent {
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

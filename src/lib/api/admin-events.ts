import { apiFetch } from "./client";

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

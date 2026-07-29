"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";
import { BookIcon, CheckIcon, MapIcon, ScrollIcon } from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  createAdminEvent,
  createOfficialParticipant,
  exportOfficialParticipants,
  getOfficialParticipantSummary,
  importOfficialParticipants,
  listAdminEvents,
  listOfficialParticipants,
  removeOfficialParticipant,
  updateAdminEvent,
  updateOfficialParticipant,
  type AdminEvent,
  type OfficialParticipant,
  type OfficialParticipantPage,
  type OfficialParticipantSummary,
  type OfficialParticipantStatusFilter,
  type OfficialParticipantSort,
  type SaveAdminEventRequest,
  type SaveOfficialParticipantRequest,
  type SortDirection,
  type OfficialParticipantImportRow,
} from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";
import { isAdminAccessToken } from "@/lib/api/auth";

type FormState = {
  nome: string;
  descricao: string;
  inicio: string;
  fim: string;
  dataHoraCorrida: string;
  inicioValidacaoCorrida: string;
  fimValidacaoCorrida: string;
  prazoSincronizacao: string;
  distanciaMinimaKm: string;
  localNome: string;
  endereco: string;
  organizador: string;
  percursoUrl: string;
  regulamentoUrl: string;
  imagemUrl: string;
  bannerUrl: string;
  codigoAcesso: string;
  maxUsosCodigo: string;
  ativo: boolean;
};

const emptyForm: FormState = {
  nome: "",
  descricao: "",
  inicio: "",
  fim: "",
  dataHoraCorrida: "",
  inicioValidacaoCorrida: "",
  fimValidacaoCorrida: "",
  prazoSincronizacao: "",
  distanciaMinimaKm: "",
  localNome: "",
  endereco: "",
  organizador: "",
  percursoUrl: "",
  regulamentoUrl: "",
  imagemUrl: "",
  bannerUrl: "",
  codigoAcesso: "",
  maxUsosCodigo: "1",
  ativo: true,
};

type CsvPreview = {
  rows: OfficialParticipantImportRow[];
  errors: string[];
  fileName: string;
};

const emptyParticipantPage: OfficialParticipantPage = {
  itens: [],
  pagina: 1,
  tamanhoPagina: 25,
  total: 0,
  totalPaginas: 0,
};

const emptyParticipantSummary: OfficialParticipantSummary = {
  total: 0,
  vinculados: 0,
  disponiveis: 0,
  percentualAdesao: 0,
};

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function eventToForm(event: AdminEvent): FormState {
  return {
    ...emptyForm,
    nome: event.nome,
    descricao: event.descricao ?? "",
    inicio: toLocalInput(event.inicio),
    fim: toLocalInput(event.fim),
    dataHoraCorrida: toLocalInput(event.dataHoraCorrida),
    inicioValidacaoCorrida: toLocalInput(event.inicioValidacaoCorrida),
    fimValidacaoCorrida: toLocalInput(event.fimValidacaoCorrida),
    prazoSincronizacao: toLocalInput(event.prazoSincronizacao),
    distanciaMinimaKm: event.distanciaMinimaKm?.toString() ?? "",
    localNome: event.localNome ?? "",
    endereco: event.endereco ?? "",
    organizador: event.organizador ?? "",
    percursoUrl: event.percursoUrl ?? "",
    regulamentoUrl: event.regulamentoUrl ?? "",
    imagemUrl: event.imagemUrl ?? "",
    bannerUrl: event.bannerUrl ?? "",
    ativo: event.ativo,
  };
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseCsvLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseParticipantsCsv(content: string, fileName: string): CsvPreview {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    return { rows: [], errors: ["O CSV precisa de cabeçalho e pelo menos um participante."], fileName };
  }

  const delimiter = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const headers = parseCsvLine(lines[0], delimiter).map(normalizeHeader);
  const findColumn = (...names: string[]) => headers.findIndex((header) => names.includes(header));
  const nameIndex = findColumn("nome", "name");
  const registrationIndex = findColumn("numeroinscricao", "inscricao", "registrationnumber", "bib");
  const emailIndex = findColumn("email");
  const distanceIndex = findColumn("distanciakm", "distancia", "distancekm");
  const errors: string[] = [];

  if (nameIndex < 0) errors.push("Cabeçalho obrigatório ausente: nome.");
  if (registrationIndex < 0) errors.push("Cabeçalho obrigatório ausente: numeroInscricao.");
  if (errors.length) return { rows: [], errors, fileName };

  const rows: OfficialParticipantImportRow[] = [];
  for (let index = 1; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const values = parseCsvLine(lines[index], delimiter);
    const nome = values[nameIndex]?.trim() ?? "";
    const numeroInscricao = values[registrationIndex]?.trim() ?? "";
    const email = emailIndex >= 0 ? values[emailIndex]?.trim() : "";
    const rawDistance = distanceIndex >= 0 ? values[distanceIndex]?.trim().replace(",", ".") : "";
    const distanciaKm = rawDistance ? Number(rawDistance) : null;

    if (!nome) errors.push(`Linha ${lineNumber}: nome vazio.`);
    if (!numeroInscricao) errors.push(`Linha ${lineNumber}: número de inscrição vazio.`);
    if (rawDistance && !Number.isFinite(distanciaKm)) errors.push(`Linha ${lineNumber}: distância inválida.`);

    rows.push({
      linha: lineNumber,
      nome,
      numeroInscricao,
      email: email || null,
      distanciaKm: Number.isFinite(distanciaKm) ? distanciaKm : null,
    });
  }

  return { rows, errors, fileName };
}

export default function AdminEventsPage() {
  const router = useRouter();
  const { token, status } = useAuth();
  const isAdmin = useMemo(() => isAdminAccessToken(token), [token]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [participants, setParticipants] = useState<OfficialParticipantPage>(emptyParticipantPage);
  const [participantSummary, setParticipantSummary] = useState<OfficialParticipantSummary>(emptyParticipantSummary);
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantStatus, setParticipantStatus] = useState<OfficialParticipantStatusFilter>("all");
  const [participantPage, setParticipantPage] = useState(1);
  const [participantPageSize, setParticipantPageSize] = useState(25);
  const [participantSort, setParticipantSort] = useState<OfficialParticipantSort>("name");
  const [participantSortDirection, setParticipantSortDirection] = useState<SortDirection>("asc");
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<OfficialParticipant | null>(null);
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [participantDraft, setParticipantDraft] = useState<SaveOfficialParticipantRequest | null>(null);
  const [participantSaving, setParticipantSaving] = useState(false);
  const [confirmingRemovalId, setConfirmingRemovalId] = useState<string | null>(null);
  const [exportingParticipants, setExportingParticipants] = useState(false);

  const loadEvents = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminEvents(accessToken);
      setEvents(result);
    } catch {
      setError("Não foi possível carregar as provas.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadParticipants = useCallback(async (
    accessToken: string,
    eventId: string,
    search: string,
    page: number,
    pageSize: number,
    participantStatusFilter: OfficialParticipantStatusFilter,
    sort: OfficialParticipantSort,
    direction: SortDirection,
  ) => {
    setParticipantsLoading(true);
    try {
      const result = await listOfficialParticipants(
        accessToken,
        eventId,
        search,
        page,
        pageSize,
        participantStatusFilter,
        sort,
        direction,
      );
      setParticipants(result);
    } catch {
      setError("Não foi possível carregar os participantes oficiais.");
    } finally {
      setParticipantsLoading(false);
    }
  }, []);

  const loadParticipantSummary = useCallback(async (accessToken: string, eventId: string) => {
    try {
      setParticipantSummary(await getOfficialParticipantSummary(accessToken, eventId));
    } catch {
      setError("Não foi possível carregar o resumo das inscrições.");
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadEvents(token);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAdmin, loadEvents, router, status, token]);

  useEffect(() => {
    if (!token || !selectedId) return;

    const timer = window.setTimeout(() => {
      void loadParticipants(
        token,
        selectedId,
        participantSearch,
        participantPage,
        participantPageSize,
        participantStatus,
        participantSort,
        participantSortDirection,
      );
    }, 250);
    return () => window.clearTimeout(timer);
  }, [
    loadParticipants,
    participantPage,
    participantPageSize,
    participantSearch,
    participantSort,
    participantSortDirection,
    participantStatus,
    selectedId,
    token,
  ]);

  useEffect(() => {
    if (!token || !selectedId) return;
    const timer = window.setTimeout(() => {
      void loadParticipantSummary(token, selectedId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadParticipantSummary, selectedId, token]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const selectEvent = (event: AdminEvent) => {
    setSelectedId(event.id);
    setForm(eventToForm(event));
    setMessage(null);
    setError(null);
    setParticipantSearch("");
    setParticipantStatus("all");
    setParticipantPage(1);
    setParticipantPageSize(25);
    setParticipantSort("name");
    setParticipantSortDirection("asc");
    setEditingParticipant(null);
    setAddingParticipant(false);
    setParticipantDraft(null);
    setConfirmingRemovalId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const newEvent = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setMessage(null);
    setError(null);
    setCsvPreview(null);
    setParticipants(emptyParticipantPage);
    setParticipantSummary(emptyParticipantSummary);
    setParticipantSearch("");
    setParticipantStatus("all");
    setParticipantPage(1);
    setParticipantPageSize(25);
    setParticipantSort("name");
    setParticipantSortDirection("asc");
    setEditingParticipant(null);
    setAddingParticipant(false);
    setParticipantDraft(null);
    setConfirmingRemovalId(null);
  };

  const chooseCsv = async (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const file = changeEvent.target.files?.[0];
    changeEvent.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setCsvPreview({ rows: [], errors: ["O CSV deve ter no máximo 2 MB."], fileName: file.name });
      return;
    }
    setCsvPreview(parseParticipantsCsv(await file.text(), file.name));
  };

  const downloadCsvTemplate = () => {
    const content = [
      "nome,numeroInscricao,email,distanciaKm",
      '"Maria Corredora","A-100","maria@example.com","10"',
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "modelo-participantes-evento.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async () => {
    if (!token || !selectedId || !csvPreview || csvPreview.errors.length || !csvPreview.rows.length) return;
    setImporting(true);
    setError(null);
    setMessage(null);
    try {
      const result = await importOfficialParticipants(token, selectedId, csvPreview.rows);
      setMessage(`${result.importados} participantes importados com sucesso.`);
      setCsvPreview(null);
      await loadEvents(token);
      await loadParticipants(
        token,
        selectedId,
        participantSearch,
        1,
        participantPageSize,
        participantStatus,
        participantSort,
        participantSortDirection,
      );
      await loadParticipantSummary(token, selectedId);
      setParticipantPage(1);
    } catch (caught) {
      if (caught instanceof ApiError && caught.body && typeof caught.body === "object") {
        const body = caught.body as { mensagem?: string; erros?: Array<{ linha: number; mensagem: string }> };
        const details = body.erros?.slice(0, 8).map((item) => `Linha ${item.linha}: ${item.mensagem}`).join(" ");
        setError([body.mensagem, details].filter(Boolean).join(" "));
      } else {
        setError("Não foi possível importar os participantes.");
      }
    } finally {
      setImporting(false);
    }
  };

  const beginParticipantEdit = (participant: OfficialParticipant) => {
    setAddingParticipant(false);
    setEditingParticipant(participant);
    setParticipantDraft({
      nome: participant.nome,
      email: participant.email ?? "",
      numeroInscricao: participant.numeroInscricao,
      distanciaKm: participant.distanciaKm ?? null,
    });
    setConfirmingRemovalId(null);
  };

  const beginParticipantAdd = () => {
    setAddingParticipant(true);
    setEditingParticipant(null);
    setParticipantDraft({
      nome: "",
      email: "",
      numeroInscricao: "",
      distanciaKm: form.distanciaMinimaKm ? Number(form.distanciaMinimaKm) : null,
    });
    setConfirmingRemovalId(null);
  };

  const saveParticipant = async () => {
    if (!token || !selectedId || (!editingParticipant && !addingParticipant) || !participantDraft) return;
    setParticipantSaving(true);
    setError(null);
    setMessage(null);
    try {
      const request = {
        ...participantDraft,
        email: participantDraft.email?.trim() || null,
      };
      if (editingParticipant) {
        await updateOfficialParticipant(token, selectedId, editingParticipant.id, request);
      } else {
        await createOfficialParticipant(token, selectedId, request);
      }
      setEditingParticipant(null);
      setAddingParticipant(false);
      setParticipantDraft(null);
      setMessage(editingParticipant ? "Inscrição atualizada com sucesso." : "Participante cadastrado com sucesso.");
      await loadParticipants(
        token,
        selectedId,
        participantSearch,
        participantPage,
        participantPageSize,
        participantStatus,
        participantSort,
        participantSortDirection,
      );
      await loadParticipantSummary(token, selectedId);
    } catch (caught) {
      const body = caught instanceof ApiError && caught.body && typeof caught.body === "object"
        ? caught.body as { mensagem?: string }
        : null;
      setError(body?.mensagem ?? "Não foi possível salvar a inscrição.");
    } finally {
      setParticipantSaving(false);
    }
  };

  const removeParticipant = async (participant: OfficialParticipant) => {
    if (!token || !selectedId || participant.vinculado) return;
    if (confirmingRemovalId !== participant.id) {
      setConfirmingRemovalId(participant.id);
      return;
    }

    setParticipantSaving(true);
    setError(null);
    setMessage(null);
    try {
      await removeOfficialParticipant(token, selectedId, participant.id);
      setConfirmingRemovalId(null);
      setMessage("Inscrição removida.");
      const targetPage = participants.itens.length === 1 && participantPage > 1
        ? participantPage - 1
        : participantPage;
      setParticipantPage(targetPage);
      await loadParticipants(
        token,
        selectedId,
        participantSearch,
        targetPage,
        participantPageSize,
        participantStatus,
        participantSort,
        participantSortDirection,
      );
      await loadParticipantSummary(token, selectedId);
    } catch (caught) {
      const body = caught instanceof ApiError && caught.body && typeof caught.body === "object"
        ? caught.body as { mensagem?: string }
        : null;
      setError(body?.mensagem ?? "Não foi possível remover a inscrição.");
    } finally {
      setParticipantSaving(false);
    }
  };

  const exportParticipants = async () => {
    if (!token || !selectedId) return;
    setExportingParticipants(true);
    setError(null);
    try {
      const csv = await exportOfficialParticipants(
        token,
        selectedId,
        participantSearch,
        participantStatus,
        participantSort,
        participantSortDirection,
      );
      const url = URL.createObjectURL(new Blob([`\uFEFF${csv.replace(/^\uFEFF/, "")}`], { type: "text/csv;charset=utf-8" }));
      const selectedEvent = events.find((event) => event.id === selectedId);
      const safeName = (selectedEvent?.nome ?? "evento")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `participantes-${safeName || selectedId}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Não foi possível exportar os participantes.");
    } finally {
      setExportingParticipants(false);
    }
  };

  const refreshParticipantManagement = async () => {
    if (!token || !selectedId) return;
    setError(null);
    await Promise.all([
      loadParticipants(
        token,
        selectedId,
        participantSearch,
        participantPage,
        participantPageSize,
        participantStatus,
        participantSort,
        participantSortDirection,
      ),
      loadParticipantSummary(token, selectedId),
    ]);
  };

  const clearParticipantFilters = () => {
    setParticipantSearch("");
    setParticipantStatus("all");
    setParticipantSort("name");
    setParticipantSortDirection("asc");
    setParticipantPageSize(25);
    setParticipantPage(1);
  };

  const submit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const request: SaveAdminEventRequest = {
      nome: form.nome.trim(),
      descricao: nullable(form.descricao),
      inicio: toIso(form.inicio)!,
      fim: toIso(form.fim)!,
      dataHoraCorrida: toIso(form.dataHoraCorrida),
      inicioValidacaoCorrida: toIso(form.inicioValidacaoCorrida),
      fimValidacaoCorrida: toIso(form.fimValidacaoCorrida),
      prazoSincronizacao: toIso(form.prazoSincronizacao),
      distanciaMinimaKm: form.distanciaMinimaKm
        ? Number(form.distanciaMinimaKm)
        : null,
      localNome: nullable(form.localNome),
      endereco: nullable(form.endereco),
      organizador: nullable(form.organizador),
      percursoUrl: nullable(form.percursoUrl),
      regulamentoUrl: nullable(form.regulamentoUrl),
      imagemUrl: nullable(form.imagemUrl),
      bannerUrl: nullable(form.bannerUrl),
      ativo: form.ativo,
      requerEquipe: false,
      chefeId: null,
      codigoAcesso: selectedId ? null : nullable(form.codigoAcesso),
      maxUsosCodigo: Number(form.maxUsosCodigo) || 1,
    };

    try {
      if (selectedId) {
        await updateAdminEvent(token, selectedId, request);
        setMessage("Prova atualizada com sucesso.");
      } else {
        await createAdminEvent(token, request);
        setMessage("Prova criada com sucesso.");
        setForm(emptyForm);
      }
      await loadEvents(token);
    } catch (caught) {
      setError(
        caught instanceof ApiError && typeof caught.body === "string"
          ? caught.body
          : "Não foi possível salvar a prova. Revise os dados.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !token || !isAdmin) {
    return <main className="min-h-screen bg-void" />;
  }

  return (
    <main className="min-h-screen bg-void text-text-primary">
      <AuthenticatedTopbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form className="app-panel rpg-card p-5 sm:p-7" onSubmit={submit}>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-dim/25 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">
                Administração de eventos
              </p>
              <h1 className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">
                {selectedId ? "Editar prova oficial" : "Cadastrar prova oficial"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                Configure inscrição, horários oficiais, validação posterior,
                localização, percurso e regulamento.
              </p>
            </div>
            {selectedId && (
              <button type="button" className="myth-button-secondary px-4 py-2 text-xs" onClick={newEvent}>
                Nova prova
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6">
            <FormSection title="Identidade da prova" icon={<ScrollIcon className="h-5 w-5" />}>
              <Field label="Nome oficial" required value={form.nome} onChange={(value) => update("nome", value)} />
              <Field label="Organizador" value={form.organizador} onChange={(value) => update("organizador", value)} />
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.2em] text-gold-muted">Descrição</span>
                <textarea className="myth-input min-h-28" value={form.descricao} onChange={(event) => update("descricao", event.target.value)} />
              </label>
            </FormSection>

            <FormSection title="Horários e validação" icon={<CheckIcon className="h-5 w-5" />}>
              <DateField label="Publicação inicia" required value={form.inicio} onChange={(value) => update("inicio", value)} />
              <DateField label="Publicação encerra" required value={form.fim} onChange={(value) => update("fim", value)} />
              <DateField label="Largada oficial" value={form.dataHoraCorrida} onChange={(value) => update("dataHoraCorrida", value)} />
              <Field label="Distância oficial (km)" type="number" step="0.01" value={form.distanciaMinimaKm} onChange={(value) => update("distanciaMinimaKm", value)} />
              <DateField label="Início aceito" value={form.inicioValidacaoCorrida} onChange={(value) => update("inicioValidacaoCorrida", value)} />
              <DateField label="Conclusão máxima" value={form.fimValidacaoCorrida} onChange={(value) => update("fimValidacaoCorrida", value)} />
              <DateField label="Prazo de sincronização" value={form.prazoSincronizacao} onChange={(value) => update("prazoSincronizacao", value)} />
              <label className="flex items-center gap-3 border border-gold-dim/25 bg-void/45 px-4 py-3">
                <input type="checkbox" checked={form.ativo} onChange={(event) => update("ativo", event.target.checked)} />
                <span className="text-sm text-text-secondary">Evento ativo e visível</span>
              </label>
            </FormSection>

            <FormSection title="Local e documentos" icon={<MapIcon className="h-5 w-5" />}>
              <Field label="Nome do local" value={form.localNome} onChange={(value) => update("localNome", value)} />
              <Field label="Endereço" value={form.endereco} onChange={(value) => update("endereco", value)} />
              <Field label="URL do percurso" type="url" value={form.percursoUrl} onChange={(value) => update("percursoUrl", value)} />
              <Field label="URL do regulamento" type="url" value={form.regulamentoUrl} onChange={(value) => update("regulamentoUrl", value)} />
              <Field label="Imagem do evento" type="url" value={form.imagemUrl} onChange={(value) => update("imagemUrl", value)} />
              <Field label="Banner do evento" type="url" value={form.bannerUrl} onChange={(value) => update("bannerUrl", value)} />
            </FormSection>

            {!selectedId && (
              <FormSection title="Acesso oficial opcional" icon={<BookIcon className="h-5 w-5" />}>
                <Field label="Código de acesso" value={form.codigoAcesso} onChange={(value) => update("codigoAcesso", value)} />
                <Field label="Máximo de usos" type="number" min="1" value={form.maxUsosCodigo} onChange={(value) => update("maxUsosCodigo", value)} />
              </FormSection>
            )}

            {selectedId && (
              <FormSection title="Participantes oficiais por CSV" icon={<ScrollIcon className="h-5 w-5" />}>
                <div className="grid gap-3 sm:col-span-2">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    Cabeçalhos aceitos: <strong>nome</strong>, <strong>numeroInscricao</strong>, email e distanciaKm.
                    Use vírgula ou ponto e vírgula. A importação inteira é cancelada se qualquer linha for inválida.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="myth-button-secondary cursor-pointer px-4 py-3 text-center text-sm">
                      Selecionar arquivo CSV
                      <input type="file" accept=".csv,text/csv" className="sr-only" onChange={chooseCsv} />
                    </label>
                    <button type="button" className="myth-button-secondary px-4 py-3 text-sm" onClick={downloadCsvTemplate}>
                      Baixar modelo CSV
                    </button>
                  </div>
                  {csvPreview && (
                    <div className="rpg-inset rounded-[14px] border border-gold-dim/25 p-4">
                      <p className="font-display text-lg text-gold">{csvPreview.fileName}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {csvPreview.rows.length} linhas encontradas.
                      </p>
                      {csvPreview.errors.length > 0 ? (
                        <ul className="mt-3 grid gap-1 text-sm text-hp-red">
                          {csvPreview.errors.slice(0, 10).map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      ) : (
                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full min-w-[520px] text-left text-xs text-text-secondary">
                            <thead className="text-gold-muted">
                              <tr><th className="pb-2">Linha</th><th>Nome</th><th>Inscrição</th><th>Distância</th></tr>
                            </thead>
                            <tbody>
                              {csvPreview.rows.slice(0, 5).map((row) => (
                                <tr key={`${row.linha}-${row.numeroInscricao}`} className="border-t border-gold-dim/15">
                                  <td className="py-2">{row.linha}</td><td>{row.nome}</td><td>{row.numeroInscricao}</td><td>{row.distanciaKm ?? "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <button
                        type="button"
                        className="myth-button-primary mt-4 w-full px-5 py-3 text-sm"
                        disabled={importing || csvPreview.errors.length > 0 || csvPreview.rows.length === 0}
                        onClick={importCsv}
                      >
                        <CheckIcon className="h-4 w-4" />
                        {importing ? "Importando..." : "Confirmar importação"}
                      </button>
                    </div>
                  )}
                </div>
              </FormSection>
            )}

            {selectedId && (
              <section className="rpg-inset rounded-[16px] border border-gold-dim/20 p-4 sm:p-5">
                <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <ParticipantMetric
                    label="Lista oficial"
                    value={participantSummary.total}
                    detail="inscrições importadas"
                  />
                  <ParticipantMetric
                    label="Vinculados"
                    value={participantSummary.vinculados}
                    detail="jogadores reconhecidos"
                    accent="emerald"
                  />
                  <ParticipantMetric
                    label="Disponíveis"
                    value={participantSummary.disponiveis}
                    detail="aguardando vínculo"
                    accent="violet"
                  />
                  <ParticipantMetric
                    label="Adesão"
                    value={`${participantSummary.percentualAdesao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
                    detail="da lista já conectada"
                    progress={participantSummary.percentualAdesao}
                    accent="gold"
                  />
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-fiery-orange">Lista oficial</p>
                    <h2 className="mt-1 font-display text-xl text-gold">
                      Gestão de participantes
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {participantSearch.trim() || participantStatus !== "all"
                        ? `${participants.total} inscrições encontradas pelo filtro.`
                        : `${participantSummary.total} inscrições cadastradas nesta prova.`}
                    </p>
                  </div>
                  <div className="grid min-w-0 flex-1 gap-2 sm:max-w-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <label className="grid gap-1">
                      <span className="text-xs uppercase tracking-[0.16em] text-gold-muted">
                        Buscar
                      </span>
                      <input
                        className="myth-input"
                        placeholder="Nome, e-mail ou número"
                        value={participantSearch}
                        onChange={(event) => {
                          setParticipantSearch(event.target.value);
                          setParticipantPage(1);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="myth-button-secondary px-4 py-3 text-xs"
                      disabled={exportingParticipants}
                      onClick={() => void exportParticipants()}
                    >
                      {exportingParticipants
                        ? "Exportando..."
                        : participantSearch.trim() || participantStatus !== "all"
                          ? "Exportar filtro"
                          : "Exportar CSV"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar participantes por estado">
                  {([
                    ["all", "Todos", participantSummary.total],
                    ["linked", "Vinculados", participantSummary.vinculados],
                    ["waiting", "Aguardando vínculo", participantSummary.disponiveis],
                  ] as const).map(([statusFilter, label, count]) => (
                    <button
                      key={statusFilter}
                      type="button"
                      aria-pressed={participantStatus === statusFilter}
                      className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                        participantStatus === statusFilter
                          ? "border-gold/60 bg-gold/15 text-gold-bright"
                          : "border-gold-dim/20 bg-void/35 text-text-muted hover:border-gold/40 hover:text-text-secondary"
                      }`}
                      onClick={() => {
                        setParticipantStatus(statusFilter);
                        setParticipantPage(1);
                      }}
                    >
                      {label} <span className="ml-1 opacity-70">({count})</span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 border-y border-gold-dim/15 py-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_150px_130px_auto_auto_auto]">
                  <label className="grid gap-1">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Ordenar por</span>
                    <select
                      className="myth-input"
                      value={participantSort}
                      onChange={(event) => {
                        setParticipantSort(event.target.value as OfficialParticipantSort);
                        setParticipantPage(1);
                      }}
                    >
                      <option value="name">Nome</option>
                      <option value="registration">Inscrição</option>
                      <option value="distance">Distância</option>
                      <option value="status">Estado</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Direção</span>
                    <select
                      className="myth-input"
                      value={participantSortDirection}
                      onChange={(event) => {
                        setParticipantSortDirection(event.target.value as SortDirection);
                        setParticipantPage(1);
                      }}
                    >
                      <option value="asc">Crescente</option>
                      <option value="desc">Decrescente</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Por página</span>
                    <select
                      className="myth-input"
                      value={participantPageSize}
                      onChange={(event) => {
                        setParticipantPageSize(Number(event.target.value));
                        setParticipantPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="myth-button-secondary self-end px-3 py-3 text-xs"
                    onClick={clearParticipantFilters}
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    className="myth-button-secondary self-end px-3 py-3 text-xs"
                    disabled={participantsLoading}
                    onClick={() => void refreshParticipantManagement()}
                  >
                    Atualizar
                  </button>
                  <button
                    type="button"
                    className="myth-button-primary self-end px-3 py-3 text-xs"
                    onClick={beginParticipantAdd}
                  >
                    Novo participante
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-gold-dim/25 text-xs uppercase tracking-[0.16em] text-gold-muted">
                      <tr>
                        <th className="px-3 py-3">Participante</th>
                        <th className="px-3 py-3">Inscrição</th>
                        <th className="px-3 py-3">Distância</th>
                        <th className="px-3 py-3">Estado</th>
                        <th className="px-3 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.itens.map((participant) => (
                        <tr key={participant.id} className="border-b border-gold-dim/10">
                          <td className="px-3 py-3">
                            <span className="block font-medium text-text-primary">{participant.nome}</span>
                            <span className="block text-xs text-text-muted">{participant.email || "Sem e-mail"}</span>
                          </td>
                          <td className="px-3 py-3 font-mono text-gold-bright">{participant.numeroInscricao}</td>
                          <td className="px-3 py-3 text-text-secondary">
                            {participant.distanciaKm ? `${participant.distanciaKm} km` : "—"}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-xs uppercase tracking-[0.14em] ${participant.vinculado ? "text-emerald" : "text-text-muted"}`}>
                              {participant.vinculado ? "Vinculado" : "Disponível"}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="myth-button-secondary px-3 py-2 text-xs"
                                onClick={() => beginParticipantEdit(participant)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                disabled={participant.vinculado || participantSaving}
                                title={participant.vinculado ? "Inscrições vinculadas não podem ser removidas." : undefined}
                                className="border border-hp-red/35 px-3 py-2 text-xs text-hp-red transition-colors hover:bg-hp-red/10 disabled:cursor-not-allowed disabled:opacity-35"
                                onClick={() => void removeParticipant(participant)}
                              >
                                {confirmingRemovalId === participant.id ? "Confirmar" : "Remover"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {participantsLoading && (
                    <p className="py-8 text-center text-sm text-text-muted">Carregando inscrições...</p>
                  )}
                  {!participantsLoading && participants.itens.length === 0 && (
                    <p className="py-8 text-center text-sm text-text-muted">
                      Nenhuma inscrição encontrada.
                    </p>
                  )}
                </div>

                {participants.totalPaginas > 1 && (
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className="myth-button-secondary px-4 py-2 text-xs"
                      disabled={participantPage <= 1 || participantsLoading}
                      onClick={() => setParticipantPage((page) => Math.max(1, page - 1))}
                    >
                      Anterior
                    </button>
                    <span className="text-xs text-text-muted">
                      Página {participants.pagina} de {participants.totalPaginas}
                    </span>
                    <button
                      type="button"
                      className="myth-button-secondary px-4 py-2 text-xs"
                      disabled={participantPage >= participants.totalPaginas || participantsLoading}
                      onClick={() => setParticipantPage((page) => page + 1)}
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>

          {(message || error) && (
            <div className={`mt-6 border px-4 py-3 text-sm ${error ? "border-hp-red/35 bg-hp-red/10 text-text-secondary" : "border-emerald/35 bg-emerald/10 text-text-primary"}`}>
              {error ?? message}
            </div>
          )}

          <button type="submit" className="myth-button-primary mt-6 w-full px-6 py-3 font-display tracking-wider" disabled={saving}>
            <CheckIcon className="h-4 w-4" />
            {saving ? "Salvando..." : selectedId ? "Salvar alterações" : "Criar prova oficial"}
          </button>
        </form>

        {(editingParticipant || addingParticipant) && participantDraft && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-void/85 px-4 backdrop-blur-sm">
            <div className="app-panel rpg-card w-full max-w-xl p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">Inscrição oficial</p>
              <h2 className="mt-2 font-display text-2xl text-gold-bright">
                {editingParticipant ? "Editar participante" : "Cadastrar participante"}
              </h2>
              {editingParticipant?.vinculado && (
                <p className="mt-2 border border-emerald/25 bg-emerald/10 px-3 py-2 text-sm text-text-secondary">
                  Esta inscrição já está vinculada a um jogador. As correções preservam o vínculo.
                </p>
              )}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nome"
                  required
                  value={participantDraft.nome}
                  onChange={(value) => setParticipantDraft((draft) => draft ? { ...draft, nome: value } : draft)}
                />
                <Field
                  label="Número de inscrição"
                  required
                  value={participantDraft.numeroInscricao}
                  onChange={(value) => setParticipantDraft((draft) => draft ? { ...draft, numeroInscricao: value } : draft)}
                />
                <Field
                  label="E-mail"
                  type="email"
                  value={participantDraft.email ?? ""}
                  onChange={(value) => setParticipantDraft((draft) => draft ? { ...draft, email: value } : draft)}
                />
                <Field
                  label="Distância (km)"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={participantDraft.distanciaKm?.toString() ?? ""}
                  onChange={(value) => setParticipantDraft((draft) => draft ? {
                    ...draft,
                    distanciaKm: value ? Number(value) : null,
                  } : draft)}
                />
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="myth-button-secondary px-5 py-3"
                  disabled={participantSaving}
                  onClick={() => {
                    setEditingParticipant(null);
                    setAddingParticipant(false);
                    setParticipantDraft(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="myth-button-primary px-5 py-3"
                  disabled={participantSaving || !participantDraft.nome.trim() || !participantDraft.numeroInscricao.trim()}
                  onClick={() => void saveParticipant()}
                >
                  {participantSaving ? "Salvando..." : editingParticipant ? "Salvar inscrição" : "Cadastrar inscrição"}
                </button>
              </div>
            </div>
          </div>
        )}

        <aside className="app-panel app-panel-compact rpg-card h-fit p-4 lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-gold">Provas cadastradas</h2>
            <button type="button" onClick={newEvent} className="myth-button-secondary px-3 py-2 text-xs">Nova</button>
          </div>
          <div className="mt-4 grid gap-3">
            {loading && <p className="text-sm text-text-muted">Carregando...</p>}
            {!loading && events.length === 0 && <p className="text-sm text-text-muted">Nenhuma prova cadastrada.</p>}
            {events.map((event) => (
              <button
                type="button"
                key={event.id}
                onClick={() => selectEvent(event)}
                className={`rpg-inset grid gap-1 rounded-[14px] border p-4 text-left transition-colors ${selectedId === event.id ? "border-gold/60 bg-gold/10" : "border-gold-dim/20 hover:border-gold/40"}`}
              >
                <span className="font-display text-lg text-gold-bright">{event.nome}</span>
                <span className="text-xs text-text-muted">{event.localNome || "Local ainda não informado"}</span>
                <span className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${event.ativo ? "text-emerald" : "text-text-muted"}`}>
                  {event.ativo ? "Ativo" : "Inativo"}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rpg-inset rounded-[16px] border border-gold-dim/20 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-gold">
        {icon}
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ParticipantMetric({
  label,
  value,
  detail,
  progress,
  accent = "gold",
}: {
  label: string;
  value: string | number;
  detail: string;
  progress?: number;
  accent?: "gold" | "emerald" | "violet";
}) {
  const accentClasses = {
    gold: "border-gold/30 text-gold-bright",
    emerald: "border-emerald/30 text-emerald",
    violet: "border-violet/30 text-violet",
  };
  const progressClasses = {
    gold: "bg-gold",
    emerald: "bg-emerald",
    violet: "bg-violet",
  };

  return (
    <div className={`border bg-void/45 p-4 ${accentClasses[accent]}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{detail}</p>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden bg-black/35">
          <div
            className={`h-full transition-[width] duration-500 ${progressClasses[accent]}`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-gold-muted">{label}</span>
      <input {...props} type={type} className="myth-input w-full" value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function DateField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <Field label={label} type="datetime-local" value={value} onChange={onChange} required={required} />;
}

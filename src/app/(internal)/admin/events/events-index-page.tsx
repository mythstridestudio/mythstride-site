"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminProtectedWorkspace from "@/components/AdminProtectedWorkspace";
import { EVENT_STATUS, listAdminEvents, type AdminEvent, type EventStatus } from "@/lib/api/admin-events";

const labels: Record<EventStatus, string> = {
  [EVENT_STATUS.draft]: "Rascunho",
  [EVENT_STATUS.published]: "Publicada",
  [EVENT_STATUS.active]: "Em andamento",
  [EVENT_STATUS.processing]: "Processando",
  [EVENT_STATUS.completed]: "Finalizada",
  [EVENT_STATUS.cancelled]: "Cancelada",
};

function EventsIndex({ token }: { token: string }) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const result = await listAdminEvents(token);
        if (alive) { setEvents(result); setError(null); }
      } catch {
        if (alive) { setEvents([]); setError("Não foi possível consultar os eventos. Tente atualizar."); }
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => { alive = false; };
  }, [token, reload]);

  const filtered = useMemo(() => {
    const text = query.trim().toLocaleLowerCase("pt-BR");
    return events.filter((event) =>
      (filter === "all" || String(event.status) === filter) &&
      (!text || [event.nome, event.localNome, event.organizador]
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(text))),
    ).sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
  }, [events, query, filter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-dim/30 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">Administração · Provas oficiais</p>
          <h1 className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">Todos os Eventos</h1>
          <p className="mt-2 text-sm text-text-secondary">Localize, revise e gerencie provas publicadas ou em rascunho.</p>
        </div>
        <Link href="/admin/events/create" className="button button--primary">+ Cadastrar Evento</Link>
      </header>

      <section className="app-panel rpg-card rounded-xl p-4 sm:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <label className="grid gap-2 text-xs text-gold-muted">
            Buscar evento
            <input className="myth-input w-full" type="search" placeholder="Nome, local ou organizador"
              value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className="grid gap-2 text-xs text-gold-muted">
            Status
            <select className="myth-input w-full" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todos</option>
              {Object.entries(labels).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
            </select>
          </label>
          <button type="button" className="button button--secondary self-end" disabled={loading}
            onClick={() => { setLoading(true); setReload((n) => n + 1); }}>
            {loading ? "Carregando..." : "Atualizar"}
          </button>
        </div>
        <p className="mt-4 text-xs text-text-muted">{loading ? "Carregando eventos..." : `${filtered.length} de ${events.length} evento(s)`}</p>
      </section>
      {error && <p role="alert" className="border border-hp-red/40 p-3 text-sm">{error}</p>}

      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((event) => (
          <article key={event.id} className="app-panel rpg-card flex min-w-0 flex-col rounded-xl border border-gold-dim/25 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded border border-gold/30 px-2 py-1 text-xs text-gold-bright">
                {labels[event.status] ?? "Não informado"}
              </span>
              {!event.ativo && <span className="text-xs text-text-muted">Inativo</span>}
            </div>
            <h2 className="mt-4 break-words font-display text-xl text-gold-bright">{event.nome}</h2>
            <p className="mt-2 text-sm text-text-secondary">{event.localNome || "Evento virtual / local não informado"}</p>
            <p className="mt-2 text-xs text-text-muted">
              {new Date(event.inicio).toLocaleDateString("pt-BR")} — {new Date(event.fim).toLocaleDateString("pt-BR")}
            </p>
            {event.organizador && <p className="mt-1 text-xs text-text-muted">{event.organizador}</p>}
            <div className="mt-auto pt-5">
              <Link href={`/admin/events/create?eventId=${encodeURIComponent(event.id)}`}
                className="button button--secondary flex w-full items-center justify-center">
                Editar / Gerenciar Evento
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!loading && filtered.length === 0 && !error && (
        <p className="py-6 text-center text-sm text-text-secondary">Nenhum evento encontrado. Ajuste os filtros ou cadastre uma prova.</p>
      )}
    </div>
  );
}

export default function AdminEventsIndexPage() {
  return <AdminProtectedWorkspace active="events" render={(token) => <EventsIndex token={token}/>} />;
}

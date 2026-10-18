"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminProtectedWorkspace from "@/components/AdminProtectedWorkspace";
import {
  getAdminRegistrationStatistics,
  type AdminRegistrationStatistics,
} from "@/lib/api/admin-statistics";

const integer = (value: number) => value.toLocaleString("pt-BR");

function RegistrationsDashboard({ token }: { token: string }) {
  const [data, setData] = useState<AdminRegistrationStatistics | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const reload = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      setData(await getAdminRegistrationStatistics(token));
    } catch {
      setData(null);
      setError("Não foi possível consultar as estatísticas. Verifique se a API foi atualizada e tente novamente.");
    } finally {
      setPending(false);
    }
  }, [token]);

  useEffect(() => {
    // Defer the initial fetch to avoid synchronous state changes during effect.
    const handle = window.setTimeout(() => { void reload(); }, 0);
    return () => window.clearTimeout(handle);
  }, [reload]);

  const events = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLocaleLowerCase("pt-BR");
    return data.events
      .filter((event) => event.eventName.toLocaleLowerCase("pt-BR").includes(q))
      .sort((a, b) => b.inAppRegistrations - a.inAppRegistrations ||
                        a.eventName.localeCompare(b.eventName, "pt-BR"));
  }, [data, search]);
  const maxRegistrations = Math.max(1, ...events.map((event) => event.inAppRegistrations));

  const cards = [
    {
      title: "Contas cadastradas",
      count: data?.totalAccounts,
      description: "Identidades registradas, mesmo sem personagem criado",
    },
    {
      title: "Jogadores com personagem",
      count: data?.totalPlayers,
      description: "Personagens existentes no MythStride",
    },
    {
      title: "Jogadores em eventos",
      count: data?.uniqueEventParticipants,
      description: "Pessoas distintas que entraram em pelo menos um evento",
    },
    {
      title: "Inscrições nos eventos",
      count: data?.totalEventRegistrations,
      description: "Total de participações; uma pessoa pode entrar em vários eventos",
    },
    {
      title: "Inscrições nos últimos 7 dias",
      count: data?.eventRegistrationsLast7Days,
      description: "Novas participações no aplicativo, não novas contas",
    },
    {
      title: "Contas verificadas",
      count: data?.verifiedAccounts,
      description: "Contas com e-mail verificado",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-gold-dim/30 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">MythStride · Administração</p>
          <h1 className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">Estatísticas</h1>
          <p className="mt-2 text-sm text-text-secondary">Acompanhe a quantidade real de jogadores e de participantes em cada evento.</p>
        </div>
        <button type="button" className="button button--secondary"
          onClick={() => void reload()} disabled={pending}>
          {pending ? "Consultando..." : "Atualizar dados"}
        </button>
      </header>

      {error && <p role="alert" className="rounded-lg border border-hp-red/40 bg-hp-red/10 p-3 text-sm">{error}</p>}
      {pending && <p role="status" className="text-sm text-text-muted">Carregando estatísticas do servidor...</p>}

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {cards.map(({ title, count, description }) => (
          <section key={title} className="rpg-inset min-w-0 rounded-xl border border-gold-dim/30 p-5">
            <p className="font-display text-sm text-gold-muted">{title}</p>
            <p className="mt-3 font-display text-4xl tabular-nums text-gold-bright">
              {typeof count === "number" ? integer(count) : "—"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{description}</p>
          </section>
        ))}
      </div>

      <section className="app-panel rpg-card min-w-0 rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-gold-bright">Jogadores cadastrados por evento</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Inscrições feitas dentro do MythStride (não equivalem a ingressos externos).
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {data ? `${integer(data.totalEvents)} evento(s) cadastrados` : "—"}
          </span>
        </div>

        <label htmlFor="stats-event-search" className="mt-5 block text-xs uppercase tracking-[0.14em] text-gold-muted">
          Filtrar eventos por nome
        </label>
        <input
          id="stats-event-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="myth-input mt-2 w-full"
          placeholder="Ex.: MythStride Terra"
          maxLength={120}
        />
        {data && data.totalEvents > data.eventsLimit && (
          <p className="mt-2 text-xs text-fiery-orange">
            Exibindo até {data.eventsLimit} eventos mais recentes. Para eventos antigos, uma busca paginada será necessária.
          </p>
        )}

        <div className="mt-5 space-y-3">
          {!pending && data && events.length === 0 && (
            <p className="text-sm text-text-secondary">Nenhum evento encontrado.</p>
          )}
          {events.map((event) => (
            <div key={event.eventId} className="rpg-inset grid min-w-0 gap-3 rounded-lg border border-gold-dim/25 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-display text-base text-gold-bright">{event.eventName}</h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {new Date(event.startsAt).toLocaleDateString("pt-BR")} · {event.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl tabular-nums text-gold-bright">{integer(event.inAppRegistrations)}</p>
                  <p className="text-xs text-text-secondary">inscritos no app</p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded bg-black/50" aria-hidden="true">
                <div className="h-full rounded bg-gold/80"
                  style={{ width: `${(event.inAppRegistrations / maxRegistrations) * 100}%` }} />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-secondary">
                <span>Concluíram: <strong className="text-text-primary">{integer(event.completed)}</strong></span>
                <span>Lista oficial importada: <strong className="text-text-primary">{integer(event.officialRosterEntries)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <p className="text-xs text-text-muted">
        {data ? `Dados consultados em ${new Date(data.asOfUtc).toLocaleString("pt-BR")}. ` : ""}
        Inscrições de eventos não representam jogadores novos. Medalhas concedidas por administradores
        e cliques em plataformas externas não são contados como inscrições no aplicativo.
      </p>
    </div>
  );
}

export default function AdminStatisticsPage() {
  return (
    <AdminProtectedWorkspace active="statistics"
      render={(token) => <RegistrationsDashboard token={token} />} />
  );
}

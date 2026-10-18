"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EVENT_STATUS, listAdminEvents, listAdminMedalCatalog } from "@/lib/api/admin-events";
import { getAdminAuditLogs, MANUAL_MEDAL_GRANT_EVENT, type AdminAuditLog } from "@/lib/api/admin-console";
import AdminProtectedWorkspace from "@/components/AdminProtectedWorkspace";
import { ScrollIcon, UsersIcon, TrophyIcon, CrownIcon, ChartIcon } from "@/components/Icons";
import { getAdminRegistrationStatistics } from "@/lib/api/admin-statistics";

type DashboardData = {
  registeredEvents: number | null;
  liveEvents: number | null;
  catalogMedals: number | null;
  manualGrants: number | null;
  registeredPlayers: number | null;
  eventRegistrations: number | null;
  recent: AdminAuditLog[];
};
const initial: DashboardData = {
  registeredEvents: null, liveEvents: null, catalogMedals: null, manualGrants: null,
  registeredPlayers: null, eventRegistrations: null, recent: [],
};

function Overview({ token }: { token: string }) {
  const [data, setData] = useState<DashboardData>(initial);
  const [pending, setPending] = useState(true);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [events, catalog, log, registrationStats] = await Promise.allSettled([
        listAdminEvents(token),
        listAdminMedalCatalog(token),
        getAdminAuditLogs(token, { page: 1, pageSize: 5, eventType: MANUAL_MEDAL_GRANT_EVENT }),
        getAdminRegistrationStatistics(token),
      ]);
      if (cancelled) return;
      setData({
        registeredEvents: events.status === "fulfilled" ? events.value.length : null,
        liveEvents: events.status === "fulfilled"
          ? events.value.filter((x) => x.status === EVENT_STATUS.active && x.ativo).length : null,
        catalogMedals: catalog.status === "fulfilled" ? catalog.value.length : null,
        manualGrants: log.status === "fulfilled" ? log.value.total : null,
        registeredPlayers: registrationStats.status === "fulfilled" ? registrationStats.value.totalPlayers : null,
        eventRegistrations: registrationStats.status === "fulfilled" ? registrationStats.value.totalEventRegistrations : null,
        recent: log.status === "fulfilled" ? log.value.items : [],
      });
      setWarning(events.status !== "fulfilled" || catalog.status !== "fulfilled" || log.status !== "fulfilled" || registrationStats.status !== "fulfilled");
      setPending(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [token]);

  const cards = [
    { name: "Jogadores cadastrados", count: data.registeredPlayers, icon: UsersIcon, href: "/admin/statistics" },
    { name: "Inscrições em eventos", count: data.eventRegistrations, icon: ChartIcon, href: "/admin/statistics" },
    { name: "Eventos cadastrados", count: data.registeredEvents, icon: ScrollIcon, href: "/admin/events" },
    { name: "Eventos ativos", count: data.liveEvents, icon: CrownIcon, href: "/admin/events" },
    { name: "Medalhas no catálogo*", count: data.catalogMedals, icon: TrophyIcon, href: "/admin/medals" },
    { name: "Entregas manuais", count: data.manualGrants, icon: UsersIcon, href: "/admin/deliveries" },
  ];

  return (
    <div className="space-y-6" aria-labelledby="admin-overview-title">
      <div className="border-b border-gold-dim/30 pb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">MythStride · Administração</p>
        <h1 id="admin-overview-title" className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">Visão Geral</h1>
        <p className="mt-2 text-sm text-text-secondary">Gerencie eventos, medalhas e jogadores em um só lugar.</p>
      </div>

      {pending && <p role="status" className="text-sm text-text-muted">Consultando dados do servidor...</p>}
      {warning && <p role="alert" className="rounded-lg border border-gold-dim/40 p-3 text-sm text-text-secondary">
        Parte dos indicadores não pôde ser consultada. Valores indisponíveis aparecem como “—”, nunca como zero.
      </p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map(({ name, count, icon: Icon, href }) => (
          <Link key={name} href={href}
            className="rpg-inset group flex min-h-32 flex-col justify-between rounded-xl border border-gold-dim/30 p-4 transition-colors hover:border-gold/65">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-text-secondary">{name}</p>
              <Icon className="h-6 w-6 text-gold/85" />
            </div>
            <span className="font-display text-3xl tabular-nums text-gold-bright">
              {count === null ? "—" : count.toLocaleString("pt-BR")}
            </span>
          </Link>
        ))}
      </div>
      <p className="text-xs text-text-muted">*O catálogo retorna até 80 medalhas por consulta; não representa necessariamente o total histórico.</p>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(270px,0.75fr)]">
        <section className="app-panel rpg-card rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-gold-bright">Últimas entregas administrativas</h2>
            <Link className="text-sm text-gold underline-offset-4 hover:underline" href="/admin/deliveries">Ver todas</Link>
          </div>
          <div className="mt-4 divide-y divide-gold-dim/15">
            {data.recent.length === 0 && !pending && (
              <p className="py-4 text-sm text-text-muted">Nenhuma entrega consultável no momento.</p>
            )}
            {data.recent.map((entry) => (
              <div key={entry.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <span className="text-text-primary">Concessão administrativa de medalha</span>
                <time className="text-xs text-text-secondary" dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleString("pt-BR")}
                </time>
              </div>
            ))}
          </div>
        </section>
        <section className="app-panel rpg-card rounded-xl p-5 sm:p-6">
          <h2 className="font-display text-xl text-gold-bright">Acesso rápido</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/events" className="button button--secondary justify-center">Cadastrar ou editar evento</Link>
            <Link href="/admin/medals" className="button button--secondary justify-center">Entregar medalha</Link>
            <Link href="/admin/users" className="button button--secondary justify-center">Consultar jogador</Link>
            <Link href="/admin/statistics" className="button button--secondary justify-center">Estatísticas de jogadores</Link>
            <Link href="/admin/logs" className="button button--secondary justify-center">Consultar auditoria</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return <AdminProtectedWorkspace active="overview" render={(token) => <Overview token={token} />} />;
}

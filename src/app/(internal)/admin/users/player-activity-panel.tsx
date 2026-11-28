"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  describeIneligibility,
  getAdminPlayerActivity,
  type AdminPlayerActivity,
} from "@/lib/api/admin-players";
import { ApiError } from "@/lib/api/client";

const WINDOWS = [7, 30, 90] as const;

function dateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function duration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m}min${String(s).padStart(2, "0")}`;
}

function explain(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) return "Sessão expirada ou conta sem permissão administrativa.";
    if (error.status === 404) return "Jogador não encontrado, ou a API ainda não tem a consulta de corridas.";
    return `A API retornou o erro ${error.status} ao consultar as corridas.`;
  }
  return "Não foi possível consultar as corridas deste jogador.";
}

function StatusPill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`rounded border px-2 py-0.5 text-xs ${ok
      ? "border-emerald/35 bg-emerald/10 text-emerald"
      : "border-fiery-orange/40 bg-fiery-orange/10 text-fiery-orange"}`}>
      {children}
    </span>
  );
}

export default function PlayerActivityPanel({ token, playerId }: { token: string; playerId: string }) {
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<AdminPlayerActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      getAdminPlayerActivity(token, playerId, days)
        .then((result) => { if (!cancelled) setData(result); })
        .catch((err: unknown) => { if (!cancelled) { setData(null); setError(explain(err)); } })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [token, playerId, days]);

  const strava = data?.connections.strava ?? null;
  const health = data?.connections.health ?? [];

  return (
    <section className="app-panel rpg-card rounded-xl p-5 sm:p-6" aria-labelledby="player-activity-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="player-activity-title" className="font-display text-xl text-gold-bright">Corridas e sincronização</h2>
          <p className="text-sm text-text-secondary">O que chegou das integrações e o que virou corrida. Consulta registrada nos logs.</p>
        </div>
        <div role="group" aria-label="Período" className="flex gap-1">
          {WINDOWS.map((value) => (
            <button key={value} type="button" disabled={loading} onClick={() => setDays(value)}
              aria-pressed={days === value}
              className={`rounded border px-3 py-1.5 text-xs ${days === value
                ? "border-gold/70 bg-gold/10 text-gold-bright" : "border-gold-dim/30 text-text-secondary hover:border-gold/45"}`}>
              {value} dias
            </button>
          ))}
        </div>
      </div>

      {loading && <p role="status" className="mt-4 text-sm text-text-muted">Consultando corridas...</p>}
      {error && <p role="alert" className="mt-4 text-sm text-fiery-orange">{error}</p>}

      {data && !loading && (
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Integrações</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gold-bright">Strava</span>
                  {strava ? <StatusPill ok={strava.isActive}>{strava.isActive ? "Conectado" : "Desconectado"}</StatusPill>
                    : <StatusPill ok={false}>Nunca conectado</StatusPill>}
                </div>
                {strava && (
                  <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs text-text-secondary">
                    <dt>Conectado em</dt><dd>{dateTime(strava.connectedAtUtc)}</dd>
                    <dt>Conta corridas desde</dt><dd>{dateTime(strava.eligibilityStartedAtUtc)}</dd>
                    <dt>Último sync</dt><dd>{dateTime(strava.lastSyncAtUtc)}</dd>
                  </dl>
                )}
              </div>
              {health.length === 0 && (
                <div className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gold-bright">Health Connect / Apple Saúde</span>
                    <StatusPill ok={false}>Nunca conectado</StatusPill>
                  </div>
                </div>
              )}
              {health.map((h) => (
                <div key={h.platform} className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gold-bright">{h.platform === "HealthKit" ? "Apple Saúde" : "Health Connect"}</span>
                    <StatusPill ok={h.isActive}>{h.isActive ? "Conectado" : "Revogado"}</StatusPill>
                  </div>
                  <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs text-text-secondary">
                    <dt>Consentimento</dt><dd>{dateTime(h.consentGrantedAtUtc)}</dd>
                    <dt>Conta corridas desde</dt><dd>{dateTime(h.eligibilityStartedAtUtc)}</dd>
                    <dt>Último sync</dt><dd>{dateTime(h.lastSyncAtUtc)}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          {data.syncSummary.sources.length > 0 && (
            <div>
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Resumo ({data.windowDays} dias)</h3>
              <div className="mt-2 grid gap-2">
                {data.syncSummary.sources.map((s) => (
                  <div key={s.provider} className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-sm">
                    <p className="text-gold-bright">{s.provider}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {s.imported} importadas · {s.rewarded} recompensadas ({s.xpReleased} XP) · {s.matchedExistingRun} já existiam
                      {s.pendingReview > 0 && ` · ${s.pendingReview} em revisão`}
                    </p>
                    {s.refused.length > 0 && (
                      <p className="mt-1 text-xs text-fiery-orange">
                        Recusadas: {s.refused.map((r) => `${describeIneligibility(r.reason)} (${r.count})`).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Corridas no histórico ({data.runs.length})</h3>
            {data.runs.length === 0 && <p className="mt-2 text-sm text-text-muted">Nenhuma corrida no período.</p>}
            <div className="mt-2 grid gap-2">
              {data.runs.map((run) => (
                <div key={run.runId} className="rpg-inset flex flex-wrap items-center justify-between gap-3 rounded-md border border-gold-dim/20 p-3 text-sm">
                  <div>
                    <p className="text-gold-bright">{run.distanceKm.toLocaleString("pt-BR")} km · {duration(run.durationSeconds)}</p>
                    <p className="text-xs text-text-secondary">{dateTime(run.finishedAtUtc)} · {run.sourceType}</p>
                  </div>
                  {run.eligibleForProgression
                    ? <StatusPill ok>{run.xpGained} XP</StatusPill>
                    : <StatusPill ok={false}>{describeIneligibility(run.ineligibilityReason) ?? "Sem progressão"}</StatusPill>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Importações recebidas ({data.imports.length})</h3>
            {data.imports.length === 0 && <p className="mt-2 text-sm text-text-muted">Nenhuma atividade chegou das integrações no período.</p>}
            <div className="mt-2 grid gap-2">
              {data.imports.map((item, index) => (
                <div key={`${item.provider}-${item.importedAtUtc}-${index}`} className="rpg-inset flex flex-wrap items-center justify-between gap-3 rounded-md border border-gold-dim/20 p-3 text-sm">
                  <div>
                    <p className="text-gold-bright">{item.provider} · {item.distanceKm.toLocaleString("pt-BR")} km</p>
                    <p className="text-xs text-text-secondary">Corrida em {dateTime(item.startedAtUtc)} · importada em {dateTime(item.importedAtUtc)}</p>
                  </div>
                  {item.runId
                    ? <StatusPill ok>Virou corrida</StatusPill>
                    : <StatusPill ok={false}>{describeIneligibility(item.ineligibilityReason) ?? item.ingestionStatus ?? "Sem corrida"}</StatusPill>}
                </div>
              ))}
            </div>
          </div>

          {data.stravaSyncs.length > 0 && (
            <div>
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Últimos syncs do Strava</h3>
              <div className="mt-2 grid gap-2">
                {data.stravaSyncs.map((sync) => (
                  <div key={sync.startedAtUtc} className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-xs text-text-secondary">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>{dateTime(sync.startedAtUtc)}</span>
                      <StatusPill ok={sync.success}>{sync.success ? "Sucesso" : "Falhou"}</StatusPill>
                    </div>
                    <p className="mt-1">{sync.imported} importadas · {sync.ignored} ignoradas · {sync.duplicated} duplicadas</p>
                    {sync.errorMessage && <p className="mt-1 break-words text-fiery-orange">{sync.errorMessage}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  creditAdminPlayer,
  getAdminPlayerProfile,
  type AdminCurrency,
  type AdminPlayerProfile,
} from "@/lib/api/admin-players";
import { EVENT_STATUS, enrollAdminEventPlayers, listAdminEvents, type AdminEvent } from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";

const STATUS_LABEL: Record<number, string> = {
  [EVENT_STATUS.draft]: "Rascunho",
  [EVENT_STATUS.published]: "Publicado",
  [EVENT_STATUS.active]: "Ativo",
  [EVENT_STATUS.processing]: "Processando",
  [EVENT_STATUS.completed]: "Encerrado",
  [EVENT_STATUS.cancelled]: "Cancelado",
};

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-0000-4000-8000-${Math.random().toString(16).slice(2, 14).padEnd(12, "0")}`;
}

function date(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "—";
}

function explain(error: unknown, action: string) {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) return "Sessão expirada ou conta sem permissão administrativa.";
    if (error.status === 404) return "Jogador ou evento não encontrado, ou a API ainda não foi atualizada.";
    if (error.status === 409) return "Inscrição bloqueada: confira período, restrições do evento e se o e-mail da pessoa está confirmado.";
    if (error.status === 429) return "Muitas operações seguidas. Aguarde um pouco.";
    if (error.status === 400) return "Dados inválidos: confira quantidade, limite e justificativa.";
    return `A API retornou o erro ${error.status} ao ${action}.`;
  }
  return `Não foi possível ${action}. Se repetir, a mesma operação não é duplicada.`;
}

/** An admin can enroll only in open, free, virtual events without codes, teams, official lists or external sign-up. */
function enrollable(event: AdminEvent, now: number) {
  return event.ativo &&
    (event.status === EVENT_STATUS.published || event.status === EVENT_STATUS.active) &&
    new Date(event.fim).getTime() > now &&
    !event.requerEquipe &&
    !(event.quantidadeCodigos ?? 0) &&
    !(event.quantidadeParticipantesOficiais ?? 0) &&
    !event.externalRegistrationOpen && !event.externalRegistrationProvider;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rpg-inset rounded-md border border-gold-dim/20 p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-1 font-display text-lg text-gold-bright">{value}</p>
    </div>
  );
}

export default function PlayerProfilePanel({ token, playerId }: { token: string; playerId: string }) {
  const [data, setData] = useState<AdminPlayerProfile | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventId, setEventId] = useState("");
  const [enrollReason, setEnrollReason] = useState("");
  const [freeConfirmed, setFreeConfirmed] = useState(false);

  const [currency, setCurrency] = useState<AdminCurrency>("diamonds");
  const [amount, setAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [creditKey, setCreditKey] = useState(newKey);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setData(await getAdminPlayerProfile(token, playerId));
  }, [token, playerId]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      Promise.all([getAdminPlayerProfile(token, playerId), listAdminEvents(token).catch(() => [] as AdminEvent[])])
        .then(([profile, list]) => {
          if (cancelled) return;
          const now = Date.now();
          setData(profile);
          setEvents(list.filter((e) => enrollable(e, now)));
        })
        .catch((err: unknown) => { if (!cancelled) setError(explain(err, "consultar o perfil")); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [token, playerId]);

  const joined = useMemo(() => new Set(data?.events.map((e) => e.eventId) ?? []), [data]);
  const options = useMemo(() => events.filter((e) => !joined.has(e.id)), [events, joined]);

  const max = currency === "gold" ? data?.limits.maxGoldPerCredit ?? 0 : data?.limits.maxDiamondsPerCredit ?? 0;
  const parsedAmount = Number.parseInt(amount, 10);
  const validAmount = Number.isInteger(parsedAmount) && parsedAmount >= 1 && parsedAmount <= max;
  const validCreditReason = creditReason.trim().length >= 10 && creditReason.trim().length <= 400;
  const validEnrollReason = enrollReason.trim().length >= 10 && enrollReason.trim().length <= 400;

  async function enroll() {
    const event = options.find((e) => e.id === eventId);
    if (!data || !event || !freeConfirmed || !validEnrollReason || busy) return;
    if (!window.confirm(`Inscrever ${data.profile.name} (${data.profile.email}) em "${event.nome}"?\n\nNenhuma medalha ou recompensa é entregue nesta ação.`)) return;
    setBusy(true); setNotice(null); setActionError(null);
    try {
      const result = await enrollAdminEventPlayers(token, event.id, [playerId], enrollReason, freeConfirmed);
      setNotice(result.added ? `Inscrição criada em "${event.nome}".` : `A pessoa já estava inscrita em "${event.nome}".`);
      setEventId(""); setEnrollReason(""); setFreeConfirmed(false);
      await reload();
    } catch (err) { setActionError(explain(err, "inscrever no evento")); }
    finally { setBusy(false); }
  }

  async function credit() {
    if (!data || !validAmount || !validCreditReason || busy) return;
    const label = currency === "gold" ? "ouro" : "diamantes";
    if (!window.confirm(`Creditar ${parsedAmount.toLocaleString("pt-BR")} ${label} para ${data.profile.name} (${data.profile.email})?\n\nJustificativa: ${creditReason.trim()}\nA operação fica registrada nos logs e não pode ser desfeita pelo painel.`)) return;
    setBusy(true); setNotice(null); setActionError(null);
    try {
      const result = await creditAdminPlayer(token, playerId, currency, parsedAmount, creditReason, creditKey);
      setNotice(result.replayed
        ? `Esta operação já tinha sido aplicada. Saldo atual: ${result.balanceAfter.toLocaleString("pt-BR")} ${label}.`
        : `${parsedAmount.toLocaleString("pt-BR")} ${label} creditados. Novo saldo: ${result.balanceAfter.toLocaleString("pt-BR")}.`);
      setAmount(""); setCreditReason(""); setCreditKey(newKey());
      await reload();
    } catch (err) {
      // Keep the same key: a retry of this exact operation must not pay twice.
      setActionError(explain(err, "creditar"));
    }
    finally { setBusy(false); }
  }

  if (loading) return <section className="app-panel rpg-card rounded-xl p-5 sm:p-6"><p role="status" className="text-sm text-text-muted">Consultando perfil...</p></section>;
  if (error || !data) return <section className="app-panel rpg-card rounded-xl p-5 sm:p-6"><p role="alert" className="text-sm text-fiery-orange">{error ?? "Perfil indisponível."}</p></section>;

  const p = data.profile;
  return (
    <section className="app-panel rpg-card rounded-xl p-5 sm:p-6" aria-labelledby="player-profile-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="player-profile-title" className="font-display text-2xl text-gold-bright">{p.name}</h2>
          <p className="break-all text-sm text-text-secondary">{p.email}</p>
          <p className="mt-1 text-xs text-text-muted">
            {p.emailVerified ? "E-mail confirmado" : "E-mail NÃO confirmado"} · login por {p.authProvider} · idioma {p.locale}
            {p.role !== "Player" && ` · papel ${p.role}`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Nível" value={String(p.level)} />
        <Stat label="XP" value={p.xp.toLocaleString("pt-BR")} />
        <Stat label="Ouro" value={p.gold.toLocaleString("pt-BR")} />
        <Stat label="Diamantes" value={p.diamonds.toLocaleString("pt-BR")} />
        <Stat label="Corridas" value={p.totalRuns.toLocaleString("pt-BR")} />
        <Stat label="Distância" value={`${p.totalDistanceKm.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`} />
      </div>
      <p className="mt-2 text-xs text-text-muted">Última corrida: {date(p.lastRunAtUtc)}</p>

      {notice && <p role="status" className="mt-4 text-sm text-emerald">{notice}</p>}
      {actionError && <p role="alert" className="mt-4 text-sm text-fiery-orange">{actionError}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Eventos inscritos ({data.events.length})</h3>
          {data.events.length === 0 && <p className="mt-2 text-sm text-text-muted">Nenhuma inscrição em evento.</p>}
          <div className="mt-2 grid gap-2">
            {data.events.map((e) => (
              <div key={e.eventId} className="rpg-inset rounded-md border border-gold-dim/20 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-gold-bright">{e.eventName}</span>
                  <span className="text-xs text-text-secondary">{STATUS_LABEL[e.eventStatus] ?? "—"}</span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  Inscrito em {date(e.joinedAtUtc)} · {date(e.startsAtUtc)} a {date(e.endsAtUtc)}
                  {e.accumulatedKm > 0 && ` · ${e.accumulatedKm.toLocaleString("pt-BR")} km acumulados`}
                </p>
                <p className="mt-1 text-xs">
                  {e.disqualified ? <span className="text-fiery-orange">Desqualificado</span>
                    : e.completed ? <span className="text-emerald">Concluiu{e.receivedMedal ? " · medalha recebida" : ""}</span>
                    : <span className="text-text-muted">Em andamento</span>}
                </p>
              </div>
            ))}
          </div>

          <form className="mt-4 grid gap-3 rpg-inset rounded-md border border-gold-dim/25 p-4" onSubmit={(ev) => { ev.preventDefault(); void enroll(); }}>
            <h4 className="font-display text-base text-gold-bright">Inscrever em evento</h4>
            {options.length === 0
              ? <p className="text-sm text-text-muted">Nenhum evento aberto para inscrição assistida (eventos com código, equipe, lista oficial ou inscrição externa ficam de fora).</p>
              : <>
                <label className="grid gap-1 text-sm">Evento
                  <select className="myth-input" value={eventId} disabled={busy} onChange={(ev) => setEventId(ev.target.value)}>
                    <option value="">Selecione...</option>
                    {options.map((e) => <option key={e.id} value={e.id}>{e.nome} ({date(e.inicio)} a {date(e.fim)})</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">Justificativa (10 a 400 caracteres)
                  <textarea className="myth-input min-h-20" maxLength={400} value={enrollReason} disabled={busy} onChange={(ev) => setEnrollReason(ev.target.value)} />
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={freeConfirmed} disabled={busy} onChange={(ev) => setFreeConfirmed(ev.target.checked)} />
                  Confirmo que o evento é gratuito, com premiação apenas virtual.
                </label>
                {!p.emailVerified && <p className="text-xs text-fiery-orange">A conta precisa ter e-mail confirmado para ser inscrita.</p>}
                <button type="submit" className="button button--primary"
                  disabled={busy || !eventId || !freeConfirmed || !validEnrollReason || !p.emailVerified}>
                  {busy ? "Aguarde..." : "Inscrever"}
                </button>
              </>}
            <p className="text-xs text-text-muted">Para inscrever várias pessoas de uma vez, use Eventos → Participantes.</p>
          </form>
        </div>

        <div>
          <form className="grid gap-3 rpg-inset rounded-md border border-gold-dim/25 p-4" onSubmit={(ev) => { ev.preventDefault(); void credit(); }}>
            <h3 className="font-display text-base text-gold-bright">Creditar diamantes ou ouro</h3>
            <div role="radiogroup" aria-label="Moeda" className="flex gap-2">
              {(["diamonds", "gold"] as const).map((c) => (
                <button key={c} type="button" role="radio" aria-checked={currency === c} disabled={busy}
                  onClick={() => { setCurrency(c); setCreditKey(newKey()); }}
                  className={`flex-1 rounded border px-3 py-2 text-sm ${currency === c
                    ? "border-gold/70 bg-gold/10 text-gold-bright" : "border-gold-dim/30 text-text-secondary hover:border-gold/45"}`}>
                  {c === "diamonds" ? "Diamantes" : "Ouro"}
                </button>
              ))}
            </div>
            <label className="grid gap-1 text-sm">Quantidade (1 a {max.toLocaleString("pt-BR")})
              <input className="myth-input" inputMode="numeric" value={amount} disabled={busy}
                onChange={(ev) => { setAmount(ev.target.value.replace(/\D/g, "")); setCreditKey(newKey()); }} />
            </label>
            <label className="grid gap-1 text-sm">Justificativa (10 a 400 caracteres)
              <textarea className="myth-input min-h-20" maxLength={400} value={creditReason} disabled={busy}
                onChange={(ev) => setCreditReason(ev.target.value)} />
            </label>
            <button type="submit" className="button button--primary" disabled={busy || !validAmount || !validCreditReason}>
              {busy ? "Aguarde..." : "Creditar"}
            </button>
            <p className="text-xs text-text-muted">Só crédito. Cada operação pede confirmação, fica registrada nos Logs e não é aplicada duas vezes se a página repetir o envio.</p>
          </form>

          <h3 className="mt-6 font-display text-sm uppercase tracking-[0.18em] text-gold">Últimas movimentações de diamantes</h3>
          {data.recentDiamonds.length === 0 && <p className="mt-2 text-sm text-text-muted">Nenhuma movimentação.</p>}
          <div className="mt-2 grid gap-2">
            {data.recentDiamonds.map((d, i) => (
              <div key={`${d.createdAtUtc}-${i}`} className="rpg-inset flex flex-wrap items-center justify-between gap-2 rounded-md border border-gold-dim/20 p-3 text-xs">
                <span className={d.amount >= 0 ? "text-emerald" : "text-fiery-orange"}>{d.amount > 0 ? "+" : ""}{d.amount}</span>
                <span className="text-text-secondary">{d.description ?? d.source}</span>
                <span className="text-text-muted">{date(d.createdAtUtc)} · saldo {d.balanceAfter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

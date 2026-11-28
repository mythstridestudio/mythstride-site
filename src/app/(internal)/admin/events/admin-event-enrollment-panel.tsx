"use client";

import { useState } from "react";
import { enrollAdminEventPlayers, searchAdminMedalPlayers, type AdminMedalPlayer } from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";

export default function AdminEventEnrollmentPanel({ token, eventId, eventName }: {
  token: string; eventId: string; eventName: string;
}) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<AdminMedalPlayer[]>([]);
  const [selected, setSelected] = useState<AdminMedalPlayer[]>([]);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function failure(caught: unknown) {
    if (caught instanceof ApiError) {
      if (caught.status === 401 || caught.status === 403) return "A sessão expirou ou esta conta não é administradora.";
      if (caught.status === 409) return "Inscrição bloqueada: confira período, restrições do evento e confirmação de e-mail dos jogadores. Nenhuma inscrição deste lote foi criada.";
      if (caught.status === 404) return "Evento ou recurso indisponível. Atualize a API antes de usar esta seção.";
      if (caught.status === 429) return "Aguarde um pouco antes de repetir a operação.";
    }
    return "Não foi possível confirmar a operação. Você pode repetir o mesmo lote: inscrições existentes não serão duplicadas.";
  }

  async function search() {
    if (busy || query.trim().length < 3) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const players = await searchAdminMedalPlayers(token, query);
      setFound(players);
      if (!players.length) setNotice("Nenhum jogador encontrado. Confira o nome ou e-mail.");
    } catch (caught) { setError(failure(caught)); }
    finally { setBusy(false); }
  }

  async function enroll() {
    if (busy || !confirmed || !selected.length || reason.trim().length < 10) return;
    if (!window.confirm(`Inscrever ${selected.length} pessoa(s) em "${eventName}"?\n\n${selected.map(p => p.name + " (" + p.email + ")").join("\n")}\n\nJustificativa: ${reason.trim()}\nNenhuma medalha será entregue nesta ação.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await enrollAdminEventPlayers(token, eventId, selected.map(p => p.playerId), reason, confirmed);
      setNotice(`${result.added} inscrição(ões) criada(s). ${result.alreadyEnrolled} pessoa(s) já estavam inscritas.`);
      setSelected([]); setConfirmed(false); setReason("");
    } catch (caught) { setError(failure(caught)); }
    finally { setBusy(false); }
  }

  return <section role="tabpanel" id="event-panel-participants" aria-labelledby="event-tab-participants" className="rpg-inset mt-5 grid gap-4 rounded-xl border border-gold-dim/25 p-4 sm:p-6">
    <h3 className="font-display text-xl text-gold-bright">Inscrever pessoas no evento</h3>
    <p className="text-sm text-text-secondary">Selecione contas existentes para participar de {eventName}. Quem já está inscrito mantém seu progresso. Esta ação não cria contas nem entrega medalhas.</p>
    <label className="grid gap-2 text-sm">Nome ou e-mail
      <input className="myth-input" value={query} minLength={3} maxLength={120} disabled={busy} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void search(); } }} />
    </label>
    <button type="button" className="button button--secondary" disabled={busy || query.trim().length < 3} onClick={() => void search()}>Buscar jogadores</button>
    <p className="text-xs text-text-muted">Até 15 resultados por busca. Refine pelo e-mail para encontrar a pessoa.</p>
    <div className="grid gap-2 sm:grid-cols-2">
      {found.map(player => <button type="button" key={player.playerId} className="rpg-inset rounded-lg border border-gold-dim/25 p-3 text-left text-sm" disabled={busy || selected.length >= 100 || selected.some(p => p.playerId === player.playerId)} onClick={() => setSelected(current => current.some(p => p.playerId === player.playerId) ? current : [...current, player])}>
        <span className="block">{player.name}</span><span className="block break-all text-xs text-text-secondary">{player.email}</span>
        <span className="text-xs text-gold-bright">{selected.some(p => p.playerId === player.playerId) ? "Selecionado" : "Adicionar à seleção"}</span>
      </button>)}
    </div>
    <h4 className="text-sm text-gold-bright">Selecionados ({selected.length}/100)</h4>
    <ul className="grid gap-2">{selected.map(player => <li key={player.playerId} className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="break-all">{player.name} ({player.email})</span>
      <button type="button" className="button button--secondary" disabled={busy} aria-label={`Remover ${player.name} da seleção`} onClick={() => setSelected(current => current.filter(p => p.playerId !== player.playerId))}>Remover</button>
    </li>)}</ul>
    <label className="grid gap-2 text-sm">Justificativa (10 a 400 caracteres)
      <textarea className="myth-input min-h-24" minLength={10} maxLength={400} value={reason} disabled={busy} onChange={e => setReason(e.target.value)} />
    </label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e => setConfirmed(e.target.checked)} />
      Confirmo que este evento é gratuito, com premiação apenas virtual e sem exigência de inscrição externa.
    </label>
    <p className="text-xs text-text-muted">O evento deve estar aberto e sem código, equipe ou lista oficial obrigatória. Todas as contas selecionadas devem ter e-mail confirmado.</p>
    {error && <p role="alert" className="text-sm text-hp-red">{error}</p>}
    {notice && <p role="status" className="text-sm text-emerald">{notice}</p>}
    <button type="button" className="button button--primary" disabled={busy || !confirmed || !selected.length || reason.trim().length < 10 || reason.trim().length > 400} onClick={() => void enroll()}>{busy ? "Aguarde..." : "Inscrever selecionados"}</button>
  </section>;
}

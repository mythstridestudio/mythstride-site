"use client";

import { useState } from "react";
import Link from "next/link";
import AdminProtectedWorkspace from "@/components/AdminProtectedWorkspace";
import {
  listAdminPlayerMedals,
  searchAdminMedalPlayers,
  type AdminMedalPlayer,
  type AdminPlayerMedal,
} from "@/lib/api/admin-events";

function UsersDirectory({ token }: { token: string }) {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<AdminMedalPlayer[]>([]);
  const [selected, setSelected] = useState<AdminMedalPlayer | null>(null);
  const [medals, setMedals] = useState<AdminPlayerMedal[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function search() {
    const value = query.trim();
    if (value.length < 3 || value.length > 120) {
      setMessage("Informe de 3 a 120 caracteres do nome ou e-mail.");
      return;
    }
    setBusy(true);
    setMessage(null);
    setSelected(null);
    setMedals([]);
    try {
      const result = await searchAdminMedalPlayers(token, value);
      setPlayers(result);
      if (!result.length) setMessage("Nenhum jogador encontrado para esta busca.");
    } catch {
      setPlayers([]);
      setMessage("Não foi possível pesquisar jogadores. Confira sua sessão e a API.");
    } finally {
      setBusy(false);
    }
  }

  async function select(player: AdminMedalPlayer) {
    setBusy(true);
    setMessage(null);
    setSelected(player);
    setMedals([]);
    try {
      setMedals(await listAdminPlayerMedals(token, player.playerId));
    } catch {
      setMessage("Não foi possível consultar as medalhas deste jogador.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-gold-dim/30 pb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">MythStride · Administração</p>
        <h1 className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">Usuários</h1>
        <p className="mt-2 text-sm text-text-secondary">Consulte jogadores e as medalhas já registradas em suas contas.</p>
      </div>

      <section className="app-panel rpg-card rounded-xl p-5 sm:p-6">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void search(); }}>
          <label htmlFor="admin-user-query" className="sr-only">Nome ou e-mail do jogador</label>
          <input id="admin-user-query" className="myth-input min-w-0 flex-1"
            value={query} maxLength={120} placeholder="Buscar por nome ou e-mail..."
            onChange={(event) => setQuery(event.target.value)} />
          <button type="submit" className="button button--primary" disabled={busy}>{busy ? "Consultando..." : "Buscar jogador"}</button>
        </form>
        {message && <p role="status" className="mt-3 text-sm text-text-secondary">{message}</p>}
        <p className="mt-3 text-xs text-text-muted">Busca protegida para administradores, limitada a 15 contas por consulta.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {players.map((player) => (
            <button key={player.playerId} type="button" disabled={busy}
              onClick={() => void select(player)}
              className={`rpg-inset rounded-lg border p-4 text-left transition-colors ${selected?.playerId === player.playerId
                ? "border-gold/70 bg-gold/10" : "border-gold-dim/25 hover:border-gold/45"}`}>
              <span className="block font-display text-lg text-gold-bright">{player.name}</span>
              <span className="block break-all text-xs text-text-secondary">{player.email}</span>
              <span className="mt-1 block text-xs text-text-muted">Nível {player.level}</span>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <section className="app-panel rpg-card rounded-xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-gold-bright">{selected.name}</h2>
              <p className="text-sm text-text-secondary">Medalhas de eventos: {medals.length}</p>
            </div>
            <Link href="/admin/medals" className="button button--secondary">Entregar medalha</Link>
          </div>
          <div className="mt-4 grid gap-2">
            {!busy && medals.length === 0 && <p className="text-sm text-text-muted">Nenhuma medalha de evento encontrada.</p>}
            {medals.map((medal) => (
              <div key={medal.medalId} className="rpg-inset flex flex-wrap justify-between gap-3 rounded-md border border-gold-dim/20 p-3 text-sm">
                <span className="text-gold-bright">{medal.medalName}</span>
                <time className="text-text-secondary" dateTime={medal.earnedAtUtc}>{new Date(medal.earnedAtUtc).toLocaleDateString("pt-BR")}</time>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-text-muted">Para conceder uma medalha, abra Entrega de Medalhas e selecione o destinatário.</p>
        </section>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminProtectedWorkspace active="users" render={(token) => <UsersDirectory token={token} />} />;
}

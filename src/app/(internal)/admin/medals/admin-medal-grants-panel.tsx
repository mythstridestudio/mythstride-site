"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  grantAdminMedalToPlayer,
  listAdminMedalCatalog,
  listAdminPlayerMedals,
  searchAdminMedalPlayers,
  type AdminMedalCatalogItem,
  type AdminMedalPlayer,
  type AdminPlayerMedal,
} from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";

function explain(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403 || error.status === 401) return "Esta conta não possui autorização administrativa ou a sessão expirou.";
    if (error.status === 404) return "Jogador ou medalha não encontrado. Atualize os dados.";
    if (error.status === 429) return "Muitas operações seguidas. Aguarde um pouco e tente novamente.";
    if (error.status === 400) return "Dados inválidos. Confira o jogador, a medalha e a justificativa.";
    return `A API retornou o erro ${error.status}. Não foi possível confirmar a entrega.`;
  }
  return "Não foi possível comunicar com a API. Atualize o histórico antes de tentar novamente.";
}

export default function AdminMedalGrantsPanel({
  token,
  catalogRefreshKey = 0,
}: {
  token: string;
  catalogRefreshKey?: number;
}) {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<AdminMedalPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<AdminMedalPlayer | null>(null);
  const [catalog, setCatalog] = useState<AdminMedalCatalogItem[]>([]);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [eventId, setEventId] = useState("");
  const [held, setHeld] = useState<AdminPlayerMedal[]>([]);
  const [reason, setReason] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const medal = useMemo(() => catalog.find((m) => m.eventId === eventId), [catalog, eventId]);
  const alreadyOwned = held.some((m) => m.eventId === eventId);
  const validReason = reason.trim().length >= 10 && reason.trim().length <= 400;

  const refreshOwned = useCallback(async (playerId: string) => {
    const list = await listAdminPlayerMedals(token, playerId);
    setHeld(list);
  }, [token]);

  const loadCatalog = useCallback(async (term: string) => {
    const result = await listAdminMedalCatalog(token, term);
    setCatalog(result);
    setEventId((current) => result.some((x) => x.eventId === current) ? current : "");
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCatalogQuery("");
      void loadCatalog("").catch(() => {
        setError("Não foi possível consultar o catálogo de medalhas. O backend precisa ser atualizado.");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCatalog, catalogRefreshKey]);

  const searchPlayers = async () => {
    setError(null);
    setNotice(null);
    if (query.trim().length < 3 || query.trim().length > 120) {
      setError("Digite pelo menos 3 caracteres do nome ou e-mail do jogador.");
      return;
    }
    setLookingUp(true);
    setSelectedPlayer(null);
    setHeld([]);
    setEventId("");
    try {
      setPlayers(await searchAdminMedalPlayers(token, query));
    } catch (caught) {
      setPlayers([]);
      setError(explain(caught));
    } finally {
      setLookingUp(false);
    }
  };

  const selectPlayer = async (player: AdminMedalPlayer) => {
    setSelectedPlayer(player);
    setHeld([]);
    setError(null);
    setNotice(null);
    setRefreshing(true);
    try {
      await refreshOwned(player.playerId);
    } catch (caught) {
      setSelectedPlayer(null);
      setError(explain(caught));
    } finally {
      setRefreshing(false);
    }
  };

  const submit = async () => {
    if (!selectedPlayer || !medal || alreadyOwned || !validReason || saving || refreshing) return;
    const confirmed = window.confirm(
      `CONFIRMAR ENTREGA REAL\n\nJogador: ${selectedPlayer.name} (${selectedPlayer.email})\nMedalha: ${medal.medalName}\nProva: ${medal.eventName}\nJustificativa: ${reason.trim()}\n\nEsta medalha será entregue definitivamente à conta do jogador e poderá ser vista no aplicativo. Continuar?`,
    );
    if (!confirmed) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const result = await grantAdminMedalToPlayer(token, selectedPlayer.playerId, medal.eventId, reason);
      await refreshOwned(selectedPlayer.playerId);
      setNotice(result.awarded
        ? `Medalha entregue a ${selectedPlayer.name}. Já poderá ser visualizada no aplicativo.`
        : "Este jogador já possuía essa medalha. Nenhuma segunda medalha foi criada.");
      if (result.awarded) setReason("");
    } catch (caught) {
      setError(explain(caught));
      await refreshOwned(selectedPlayer.playerId).catch(() => {});
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="app-panel rpg-card p-5 sm:p-7" aria-labelledby="admin-grant-title">
      <p className="text-xs uppercase tracking-[0.24em] text-fiery-orange">Concessão administrativa · Recompensa permanente</p>
      <h2 id="admin-grant-title" className="mt-2 font-display text-2xl text-gold-bright">
        Entregar medalha a um jogador
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Para suporte, exceções e recuperação de uma medalha de evento que o jogador perdeu.
        A entrega é real no aplicativo, mesmo após o fim do evento, e exige uma justificativa.
        Nenhum evento é publicado e nenhuma corrida fictícia é criada.
      </p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="admin-medal-player-search" className="text-xs uppercase tracking-widest text-gold-muted">
            Encontrar jogador por nome ou e-mail
          </label>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <input
              id="admin-medal-player-search"
              className="myth-input min-w-0 flex-1"
              value={query}
              maxLength={120}
              autoComplete="off"
              placeholder="Ex.: jogador@email.com"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void searchPlayers(); } }}
              disabled={saving}
            />
            <button type="button" className="button button--secondary" disabled={lookingUp || saving} onClick={() => void searchPlayers()}>
              {lookingUp ? "Buscando..." : "Buscar"}
            </button>
          </div>
          {players.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2" aria-label="Jogadores encontrados">
              {players.map((player) => (
                <button
                  key={player.playerId}
                  type="button"
                  onClick={() => void selectPlayer(player)}
                  disabled={saving || refreshing}
                  className={`rpg-inset rounded-lg border p-3 text-left text-sm ${
                    selectedPlayer?.playerId === player.playerId
                      ? "border-gold/70 bg-gold/10 text-gold-bright"
                      : "border-gold-dim/25 text-text-primary hover:border-gold/40"
                  }`}
                >
                  <span className="block font-display">{player.name} · Nível {player.level}</span>
                  <span className="block break-all text-xs text-text-secondary">{player.email}</span>
                </button>
              ))}
            </div>
          )}
          {players.length === 0 && query.length >= 3 && !lookingUp && !selectedPlayer && (
            <p className="text-xs text-text-muted">Pesquise para selecionar uma conta. A API retorna até 15 resultados.</p>
          )}
        </div>

        {selectedPlayer && (
          <div className="rpg-inset grid gap-1 rounded-lg border border-gold/35 p-3">
            <strong className="text-gold-bright">Destinatário confirmado: {selectedPlayer.name}</strong>
            <span className="break-all text-xs text-text-secondary">{selectedPlayer.email}</span>
            <span className="text-xs text-text-muted">
              {refreshing ? "Verificando medalhas..." : `${held.length} medalha(s) de eventos registradas`}
            </span>
          </div>
        )}

        <div className="grid gap-2">
          <label htmlFor="admin-medal-search" className="text-xs uppercase tracking-widest text-gold-muted">Pesquisar medalhas de eventos</label>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <input id="admin-medal-search" className="myth-input min-w-0 flex-1" value={catalogQuery} maxLength={120} placeholder="Nome da medalha ou evento" onChange={(e) => setCatalogQuery(e.target.value)} disabled={saving}/>
            <button className="button button--secondary" type="button" disabled={saving} onClick={() => { setError(null); void loadCatalog(catalogQuery).catch((caught) => setError(explain(caught))); }}>
              Filtrar
            </button>
          </div>
          <select id="admin-medal-choice" value={eventId} className="myth-input w-full" onChange={(e) => { setEventId(e.target.value); setNotice(null); }} disabled={saving}>
            <option value="">Selecione uma medalha existente</option>
            {catalog.map((item) => (
              <option key={item.medalId} value={item.eventId}>{item.medalName} — {item.eventName}</option>
            ))}
          </select>
          <span className="text-xs text-text-muted">
            Exibindo até 80 medalhas por pesquisa. Para encontrar outras, digite o nome do evento ou da medalha e clique em Filtrar. Se não existir, cadastre a medalha no formulário abaixo.
          </span>
          {selectedPlayer && medal && (
            <p className={`text-sm ${alreadyOwned ? "text-emerald" : "text-gold"}`}>
              {alreadyOwned ? "Este jogador já possui esta medalha. Uma entrega duplicada será bloqueada." : "Este jogador ainda não possui esta medalha."}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="admin-medal-reason" className="text-xs uppercase tracking-widest text-gold-muted">Justificativa da entrega (obrigatória)</label>
          <textarea id="admin-medal-reason" className="myth-input min-h-24" minLength={10} maxLength={400} value={reason} placeholder="Ex.: Compensação de medalha perdida por falha de sincronização na prova de 2027." onChange={(e) => setReason(e.target.value)} disabled={saving}/>
          <span className="text-xs text-text-muted">{reason.trim().length}/400 caracteres · A ação é registrada na auditoria administrativa.</span>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 border border-hp-red/35 bg-hp-red/10 p-3 text-sm">{error}</p>}
      {notice && <p role="status" className="mt-4 border border-emerald/35 bg-emerald/10 p-3 text-sm">{notice}</p>}

      <button
        type="button"
        className="button button--primary mt-5 w-full"
        onClick={() => void submit()}
        disabled={!selectedPlayer || !medal || alreadyOwned || !validReason || saving || lookingUp || refreshing}
      >
        {saving ? "Confirmando entrega..." : "Entregar medalha ao jogador selecionado"}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">
        Entrega permanente. Diferente da medalha de teste, não há remoção automática.
        Confirme cuidadosamente o destinatário antes de autorizar.
      </p>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  grantAdminTestEventMedal,
  getMyMedalCollections,
  removeAdminTestEventMedal,
  type PlayerMedalCollection,
} from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";
import {
  FOUR_ELEMENTS_2027,
  FOUR_ELEMENTS_COLLECTION_KEY,
  authenticatedPlayerId,
} from "@/lib/medal-test-delivery";

const ELEMENT_STYLES: Record<string, string> = {
  terra: "border-emerald/30 text-emerald",
  fogo: "border-fiery-orange/40 text-fiery-orange",
  gelo: "border-sky-400/30 text-sky-300",
  sombra: "border-violet-400/30 text-violet-300",
};

function failureMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Sessão sem autorização administrativa. Entre novamente na conta de administrador.";
    }
    if (error.status === 404) {
      return "Evento ou medalha não encontrado na API. Confirme o deploy dos eventos de 2027.";
    }
    if (error.status === 409) {
      return "A medalha não pode ser alterada. Conquistas realmente obtidas em corridas não podem ser removidas por este teste.";
    }
    return `A API respondeu com erro ${error.status}. Tente novamente.`;
  }
  return error instanceof Error ? error.message : "O servidor não confirmou a operação. Tente novamente.";
}

/**
 * Real medal delivery — NOT an artwork preview. Uses the API's audited,
 * Admin-only grant/remove endpoints, scoped to the authenticated player.
 * Never publishes 2027 drafts or fabricates a player collection locally.
 */
export default function MedalTestDeliveryPanel({
  token,
  username,
}: {
  token: string;
  username?: string | null;
}) {
  const playerId = useMemo(() => authenticatedPlayerId(token), [token]);
  const [collection, setCollection] = useState<PlayerMedalCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!playerId) throw new Error("Sua sessão não possui um personagem vinculado.");
    const collections = await getMyMedalCollections(token, playerId);
    const current = collections.find((item) => item.key === FOUR_ELEMENTS_COLLECTION_KEY);
    if (!current || FOUR_ELEMENTS_2027.some(
      (stage) => !current.pieces.some((piece) => piece.element === stage.element),
    )) {
      throw new Error("A coleção Quatro Elementos ainda não está disponível nesta API.");
    }
    setCollection(current);
  }, [playerId, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollection(null);
      setLoading(true);
      setError(null);
      setNotice(null);
      void reload().catch((caught: unknown) => {
        setError(failureMessage(caught));
      }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  const isHeld = (element: string) =>
    collection?.pieces.find((piece) => piece.element === element)?.earned === true;

  const change = async (element: string, eventId: string, grant: boolean) => {
    if (!collection || !playerId || working) return;
    setWorking(element);
    setError(null);
    setNotice(null);
    try {
      const changed = grant
        ? await grantAdminTestEventMedal(token, eventId)
        : await removeAdminTestEventMedal(token, eventId);
      await reload();
      setNotice(changed
        ? grant
          ? `Medalha ${element} entregue à sua conta! Confira no aplicativo.`
          : `Medalha ${element} de teste retirada da sua conta.`
        : grant
          ? "A medalha já estava no seu personagem."
          : "Nenhuma medalha de teste para remover.");
    } catch (caught) {
      setError(failureMessage(caught));
      // A request may have succeeded while the response was lost: refresh from
      // the server rather than assuming an award failed or retrying blindly.
      await reload().catch(() => {});
    } finally {
      setWorking(null);
    }
  };

  const grantAll = async () => {
    if (!collection || !playerId || working) return;
    const missing = FOUR_ELEMENTS_2027.filter((stage) => !isHeld(stage.element));
    if (missing.length === 0) {
      setNotice("As quatro medalhas já estão no seu personagem.");
      return;
    }
    if (!window.confirm(
      `Entregar ${missing.length} medalha(s) de teste ao personagem desta sessão? Elas serão visíveis no aplicativo. Os eventos continuarão como rascunho.`,
    )) return;

    setWorking("all");
    setError(null);
    setNotice(null);
    let processed = 0;
    try {
      for (const stage of missing) {
        // Sequential: avoids conflicting concurrent award/notification writes.
        await grantAdminTestEventMedal(token, stage.eventId);
        processed += 1;
      }
      await reload();
      setNotice("Entrega concluída. Abra o aplicativo e confira o Salão de Troféus (4/4).");
    } catch (caught) {
      await reload().catch(() => {});
      setError(`O lote foi interrompido após ${processed} operação(ões). ${failureMessage(caught)} Confira o estado de cada medalha antes de tentar novamente.`);
    } finally {
      setWorking(null);
    }
  };

  return (
    <section className="app-panel rpg-card p-5 sm:p-7 lg:col-start-1" aria-labelledby="admin-test-medals-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-fiery-orange">Administração · Entrega real para testes</p>
          <h2 id="admin-test-medals-title" className="mt-2 font-display text-2xl text-gold-bright sm:text-3xl">
            Quatro Elementos 2027
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Entregue as medalhas de Terra, Fogo, Gelo e Sombra ao seu próprio personagem.
            Elas aparecerão no aplicativo e poderão montar a coleção. Isto não publica os eventos.
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Destino: personagem da sessão administrativa{username ? ` (@${username})` : ""}.
            Confira que entrou no site com a mesma conta utilizada no aplicativo.
          </p>
        </div>
        <div className="rpg-inset min-w-24 border border-gold-dim/30 px-4 py-3 text-center">
          <span className="block font-display text-3xl text-gold-bright">
            {collection ? `${collection.earnedCount}/${collection.totalPieces}` : "—/4"}
          </span>
          <span className="text-xs text-text-muted">recebidas no app</span>
        </div>
      </div>

      {loading && <p role="status" className="mt-5 text-sm text-text-secondary">Consultando medalhas do personagem...</p>}
      {error && <p role="alert" className="mt-5 border border-hp-red/40 bg-hp-red/10 p-3 text-sm text-text-primary">{error}</p>}
      {notice && <p role="status" className="mt-5 border border-emerald/40 bg-emerald/10 p-3 text-sm text-text-primary">{notice}</p>}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {FOUR_ELEMENTS_2027.map((stage) => {
          const held = isHeld(stage.element);
          return (
            <div key={stage.element} className="rpg-inset rounded-[14px] border border-gold-dim/25 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg text-gold-bright">{stage.name}</h3>
                <span className={`rounded border px-2 py-1 text-xs ${ELEMENT_STYLES[stage.element]}`}>
                  {collection ? (held ? "Recebida" : "Não recebida") : "Aguardando"}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">Medalha no personagem · evento continua em rascunho</p>
              <button
                type="button"
                className="button button--secondary mt-4 w-full"
                disabled={!collection || loading || Boolean(working)}
                onClick={() => void change(stage.element, stage.eventId, !held)}
              >
                {working === stage.element ? "Processando..." : held ? "Remover medalha de teste" : "Entregar ao meu personagem"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="button button--primary"
          onClick={() => void grantAll()}
          disabled={!collection || loading || Boolean(working) || collection.complete}
        >
          {working === "all" ? "Entregando..." : "Entregar as 4 medalhas"}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => {
            setLoading(true);
            setError(null);
            setNotice(null);
            void reload().catch((caught: unknown) => setError(failureMessage(caught)))
              .finally(() => setLoading(false));
          }}
          disabled={loading || Boolean(working)}
        >
          Atualizar estado do aplicativo
        </button>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Após a entrega, reabra o MythStride com este mesmo usuário e visite
        Salão de Troféus → Medalhas → 4 Medalhas, 1 Lenda. Remover teste não
        retira medalhas legitimamente conquistadas em corridas.
      </p>
    </section>
  );
}

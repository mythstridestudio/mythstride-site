"use client";

import { useEffect, useState } from "react";
import {
  getAdminAuditLogs,
  MANUAL_MEDAL_GRANT_EVENT,
  type AdminAuditLog,
  type AdminAuditPage,
} from "@/lib/api/admin-console";

function safeGrantDetails(log: AdminAuditLog): { recipient: string | null; reason: string | null; result: string | null } {
  if (log.eventType !== MANUAL_MEDAL_GRANT_EVENT || !log.metadataJson) {
    return { recipient: null, reason: null, result: null };
  }
  try {
    const data: unknown = JSON.parse(log.metadataJson);
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return { recipient: null, reason: null, result: null };
    }
    const v = data as Record<string, unknown>;
    return {
      recipient: typeof v.recipientPlayerId === "string" ? v.recipientPlayerId : null,
      reason: typeof v.reason === "string" ? v.reason : null,
      result: typeof v.awarded === "boolean" ? (v.awarded ? "Entregue" : "Já possuía") : null,
    };
  } catch {
    return { recipient: null, reason: null, result: null };
  }
}

export default function AdminAuditFeed({
  token,
  onlyDeliveries = false,
}: {
  token: string;
  onlyDeliveries?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminAuditPage | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const loaded = await getAdminAuditLogs(token, {
          page,
          pageSize: 20,
          eventType: onlyDeliveries ? MANUAL_MEDAL_GRANT_EVENT : undefined,
        });
        if (mounted) {
          setResult(loaded);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError("Não foi possível carregar os registros administrativos.");
          setResult(null);
        }
      } finally {
        if (mounted) setPending(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [onlyDeliveries, page, refresh, token]);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  return (
    <section className="app-panel rpg-card rounded-xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-gold-bright">
            {onlyDeliveries ? "Concessões manuais registradas" : "Registros de auditoria"}
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            {result ? `${result.total} registros encontrados` : "Consulta exclusiva para administradores"}
          </p>
        </div>
        <button type="button" className="button button--secondary" disabled={pending}
          onClick={() => { setPending(true); setRefresh((value) => value + 1); }}>
          Atualizar
        </button>
      </div>

      {pending && <p role="status" className="mt-5 text-sm text-text-secondary">Carregando registros...</p>}
      {error && <p role="alert" className="mt-5 text-sm text-fiery-orange">{error}</p>}
      {!pending && result?.items.length === 0 && <p className="mt-5 text-sm text-text-secondary">Nenhum registro encontrado.</p>}

      <div className="mt-4 divide-y divide-gold-dim/20">
        {result?.items.map((item) => {
          const details = safeGrantDetails(item);
          return (
            <article key={item.id} className="grid gap-2 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="break-words font-display text-base text-gold-bright">
                    {item.eventType === MANUAL_MEDAL_GRANT_EVENT ? "Entrega administrativa de medalha" : item.eventType}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">{item.message}</p>
                </div>
                <time dateTime={item.createdAt} className="shrink-0 text-xs text-text-muted">
                  {new Date(item.createdAt).toLocaleString("pt-BR")}
                </time>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-muted">
                <span>Severidade: {item.severity}</span>
                {details.result && <span>Resultado: {details.result}</span>}
                {details.recipient && <span className="break-all">Jogador: {details.recipient}</span>}
                {item.resourceId && <span className="break-all">Recurso: {item.resourceId}</span>}
              </div>
              {details.reason && (
                <p className="rounded-md border border-gold-dim/20 bg-void/50 p-3 text-sm text-text-secondary">
                  Justificativa: {details.reason}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {result && totalPages > 1 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold-dim/20 pt-4">
          <button type="button" className="button button--secondary" disabled={pending || page === 1}
            onClick={() => { setPending(true); setPage((p) => Math.max(1, p - 1)); }}>
            Anterior
          </button>
          <span className="text-sm text-text-secondary">Página {page} de {totalPages}</span>
          <button type="button" className="button button--secondary" disabled={pending || page >= totalPages}
            onClick={() => { setPending(true); setPage((p) => p + 1); }}>
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}

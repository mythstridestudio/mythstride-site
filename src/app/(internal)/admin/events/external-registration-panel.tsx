"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowRightIcon, CheckIcon, ShareIcon } from "@/components/Icons";
import {
  getEventExternalRegistration,
  saveEventExternalRegistration,
  type EventExternalRegistration,
} from "@/lib/api/admin-events";
import { ApiError } from "@/lib/api/client";
import {
  buildRegistrationRequest,
  describeErrorBody,
  DESTINATION_LABELS,
  previewDestination,
  REGISTRATION_PROVIDERS,
  REGISTRATION_URL_MAX_LENGTH,
  toProviderValue,
  WARNING_LABELS,
  type RegistrationDraft,
} from "@/lib/external-registration";

const emptyDraft: RegistrationDraft = {
  provider: "",
  registrationUrl: "",
  affiliateRegistrationUrl: "",
};

function draftFrom(view: EventExternalRegistration): RegistrationDraft {
  return {
    provider: toProviderValue(view.provider),
    registrationUrl: view.registrationUrl ?? "",
    affiliateRegistrationUrl: view.affiliateRegistrationUrl ?? "",
  };
}

function errorMessage(caught: unknown, fallback: string) {
  return caught instanceof ApiError ? describeErrorBody(caught.body, fallback) : fallback;
}

/**
 * "Inscrição externa" tab: where an event's Sympla (or other platform) links
 * are configured. Runners in the app see an "Inscreva-se" button only while
 * the API says registration is open; the API also picks the destination
 * (affiliate link first, then the public one) and counts outbound clicks.
 * No sales or revenue are shown here — only the platform has those.
 */
export default function ExternalRegistrationPanel({
  token,
  eventId,
  frozen,
}: {
  token: string;
  eventId: string;
  /** Completed and cancelled events can no longer be changed. */
  frozen: boolean;
}) {
  const [view, setView] = useState<EventExternalRegistration | null>(null);
  const [draft, setDraft] = useState<RegistrationDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEventExternalRegistration(token, eventId);
      setView(result);
      setDraft(draftFrom(result));
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível carregar a inscrição externa."));
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  // Deferred like the page's other loaders, so the effect never sets state
  // synchronously during the render pass.
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
    setSaved(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || frozen) return;
    const built = buildRegistrationRequest(draft);
    if (!built.ok) {
      setError(built.error);
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const result = await saveEventExternalRegistration(token, eventId, built.request);
      setView(result);
      setDraft(draftFrom(result));
      setSaved(true);
    } catch (caught) {
      setError(errorMessage(caught, "Não foi possível salvar a inscrição externa."));
    } finally {
      setSaving(false);
    }
  };

  const preview = previewDestination(draft);

  return (
    <div
      role="tabpanel"
      id="event-panel-registration"
      aria-labelledby="event-tab-registration"
      className="mt-5 grid gap-4"
    >
      <div className="rpg-inset rounded-[14px] border border-gold-dim/20 p-4">
        <div className="flex items-center gap-2 text-gold">
          <ShareIcon className="h-5 w-5" />
          <h3 className="font-display text-xl">Inscrição externa</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Link da página de inscrição da prova (Sympla ou outra plataforma). No app, o
          corredor vê o botão <strong className="text-text-primary">Inscreva-se</strong>{" "}
          enquanto a prova estiver publicada ou ativa e ainda não tiver acontecido. O
          checkout e a comissão ficam na plataforma; o MythStride só conta os cliques.
        </p>
      </div>

      {loading && !view ? (
        <p className="text-sm text-text-muted" role="status">
          Carregando inscrição externa...
        </p>
      ) : (
        <>
          {view && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="Destino atual"
                value={DESTINATION_LABELS[view.activeDestination] ?? DESTINATION_LABELS.none}
                detail={view.registrationOpen ? "Botão visível no app" : "Botão oculto no app"}
                emphasis={view.activeDestination === "affiliate"}
              />
              <Metric label="Cliques para inscrição" value={view.clicks.total} detail="Total" />
              <Metric label="Cliques via afiliado" value={view.clicks.affiliate} detail="Total" />
              <Metric label="Últimos 7 dias" value={view.clicks.last7Days} detail="Cliques" />
            </div>
          )}
          <p className="text-xs text-text-muted">
            Cliques medidos pelo MythStride. Inscrições, vendas e comissões ficam na
            plataforma externa.
          </p>

          {view && view.warnings.length > 0 && (
            <ul className="grid gap-2" aria-label="Avisos">
              {view.warnings.map((code) => (
                <li
                  key={code}
                  className="border border-fiery-orange/35 bg-fiery-orange/10 px-4 py-2 text-sm text-text-secondary"
                >
                  {WARNING_LABELS[code] ?? code}
                </li>
              ))}
            </ul>
          )}

          <form
            noValidate
            className="rpg-inset grid gap-4 rounded-[16px] border border-gold-dim/20 p-4 sm:p-5"
            onSubmit={(event) => void submit(event)}
          >
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-muted">Provedor</span>
              <select
                className="myth-input w-full"
                value={draft.provider}
                disabled={frozen}
                onChange={(event) =>
                  update("provider", toProviderValue(event.target.value))
                }
              >
                {REGISTRATION_PROVIDERS.map((provider) => (
                  <option key={provider.value || "none"} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </label>
            <UrlField
              label="Link público"
              placeholder="https://www.sympla.com.br/evento/..."
              value={draft.registrationUrl}
              disabled={frozen || !draft.provider}
              onChange={(value) => update("registrationUrl", value)}
            />
            <UrlField
              label="Link afiliado / promoter (opcional)"
              placeholder="Link individual que a Sympla gerou para o MythStride"
              value={draft.affiliateRegistrationUrl}
              disabled={frozen || !draft.provider}
              onChange={(value) => update("affiliateRegistrationUrl", value)}
            />
            <p className="text-sm text-text-secondary">
              Quando preenchido, o link afiliado tem prioridade sobre o link público. Use
              o link individual gerado pela Sympla para o MythStride — nunca o link
              público com <code>?ref=</code> ou UTM.
            </p>
            <p className="flex items-center gap-2 text-sm text-text-primary">
              <ArrowRightIcon className="h-4 w-4 text-gold" />
              Destino ao salvar:{" "}
              <strong className="text-gold-bright" data-testid="registration-preview">
                {DESTINATION_LABELS[preview]}
              </strong>
            </p>

            {frozen && (
              <p className="text-sm text-text-muted">
                Provas concluídas ou canceladas não podem ser alteradas.
              </p>
            )}
            {(error || saved) && (
              <div
                role="status"
                className={`border px-4 py-3 text-sm ${
                  error
                    ? "border-hp-red/35 bg-hp-red/10 text-text-secondary"
                    : "border-emerald/35 bg-emerald/10 text-text-primary"
                }`}
              >
                {error ?? "Inscrição externa atualizada."}
              </div>
            )}

            <button
              type="submit"
              className="button button--primary w-full"
              disabled={saving || frozen || (loading && !view)}
            >
              <CheckIcon className="h-4 w-4" />
              {saving ? "Salvando..." : "Salvar inscrição externa"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`border bg-void/45 p-4 ${
        emphasis ? "border-emerald/35 text-emerald" : "border-gold/30 text-gold-bright"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{detail}</p>
    </div>
  );
}

function UrlField({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-gold-muted">{label}</span>
      <input
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        maxLength={REGISTRATION_URL_MAX_LENGTH}
        className="myth-input w-full"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

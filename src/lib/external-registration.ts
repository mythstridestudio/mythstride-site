/**
 * External registration (Sympla first) for real-world events.
 *
 * The API is the authority: it validates every URL, decides which link
 * runners are sent to (affiliate first, then public) and records outbound
 * clicks. These helpers only mirror its rules so the admin sees mistakes and
 * the resulting destination before saving.
 *
 * Kept free of framework and path-alias imports so `node --test` can load it
 * directly.
 */

export const REGISTRATION_PROVIDERS = [
  { value: "", label: "Sem inscrição externa" },
  { value: "Sympla", label: "Sympla" },
  { value: "Other", label: "Outro" },
] as const;

export type RegistrationProviderValue = (typeof REGISTRATION_PROVIDERS)[number]["value"];

export type RegistrationDestination = "affiliate" | "public" | "none";

export const DESTINATION_LABELS: Record<RegistrationDestination, string> = {
  affiliate: "Link afiliado",
  public: "Link público",
  none: "Sem inscrição externa",
};

export const WARNING_LABELS: Record<string, string> = {
  registration_url_not_sympla:
    "O link público não é de um domínio da Sympla. Confira se está correto.",
  affiliate_url_not_sympla:
    "O link afiliado não é de um domínio da Sympla. Confira se está correto.",
  affiliate_equals_public:
    "O link afiliado é igual ao público: use o link individual que o organizador enviou ao MythStride.",
  registration_url_invalid: "O link público salvo é inválido e está sendo ignorado.",
  affiliate_url_invalid: "O link afiliado salvo é inválido e está sendo ignorado.",
};

export const REGISTRATION_URL_MAX_LENGTH = 1000;

/**
 * Absolute HTTPS on a real host name: no other schemes, no credentials, no
 * IP literals or localhost, no whitespace. Hosts are not whitelisted — Sympla
 * promoter and short links vary; the API warns about unexpected hosts.
 */
export function isValidRegistrationUrl(raw: string): boolean {
  const value = raw.trim();
  if (!value || value.length > REGISTRATION_URL_MAX_LENGTH || /\s/.test(value)) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  const host = url.hostname;
  if (!host.includes(".") || host.startsWith(".") || host.endsWith(".")) return false;
  if (/^[\d.]+$/.test(host) || host.startsWith("[")) return false;
  return true;
}

export interface RegistrationDraft {
  provider: RegistrationProviderValue;
  registrationUrl: string;
  affiliateRegistrationUrl: string;
}

/** Same precedence as the server: a valid affiliate link wins, then a valid public link. */
export function previewDestination(draft: RegistrationDraft): RegistrationDestination {
  if (!draft.provider) return "none";
  if (isValidRegistrationUrl(draft.affiliateRegistrationUrl)) return "affiliate";
  if (isValidRegistrationUrl(draft.registrationUrl)) return "public";
  return "none";
}

export interface SaveExternalRegistrationRequest {
  provider: string | null;
  registrationUrl: string | null;
  affiliateRegistrationUrl: string | null;
}

export type DraftValidation =
  | { ok: true; request: SaveExternalRegistrationRequest }
  | { ok: false; error: string };

/**
 * Turns the form into the API request. No provider means no external
 * registration, so every link is cleared; blank fields are sent as null.
 */
export function buildRegistrationRequest(draft: RegistrationDraft): DraftValidation {
  if (!draft.provider) {
    return {
      ok: true,
      request: { provider: null, registrationUrl: null, affiliateRegistrationUrl: null },
    };
  }
  const registrationUrl = draft.registrationUrl.trim();
  const affiliateRegistrationUrl = draft.affiliateRegistrationUrl.trim();
  const invalid = [registrationUrl, affiliateRegistrationUrl].some(
    (url) => url.length > 0 && !isValidRegistrationUrl(url),
  );
  if (invalid) {
    return {
      ok: false,
      error: "Use um endereço HTTPS completo (ex.: https://www.sympla.com.br/...).",
    };
  }
  return {
    ok: true,
    request: {
      provider: draft.provider,
      registrationUrl: registrationUrl || null,
      affiliateRegistrationUrl: affiliateRegistrationUrl || null,
    },
  };
}

/** The provider value the form understands, from whatever the API stored. */
export function toProviderValue(raw: string | null | undefined): RegistrationProviderValue {
  if (raw === "Sympla" || raw === "Other") return raw;
  return "";
}

/**
 * Error bodies come as a plain string, an ASP.NET LocalizedString
 * ({ name, value }), ProblemDetails or { mensagem | message }.
 */
export function describeErrorBody(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) return body.trim();
  if (body && typeof body === "object") {
    const shaped = body as {
      value?: unknown;
      mensagem?: unknown;
      message?: unknown;
      title?: unknown;
      errors?: Record<string, unknown>;
    };
    for (const candidate of [shaped.value, shaped.mensagem, shaped.message]) {
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
    if (shaped.errors && typeof shaped.errors === "object") {
      const details = Object.values(shaped.errors)
        .flat()
        .filter((item): item is string => typeof item === "string");
      if (details.length) return details.join(" ");
    }
    if (typeof shaped.title === "string" && shaped.title.trim()) return shaped.title.trim();
  }
  return fallback;
}

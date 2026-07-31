import { ApiConfigurationError, ApiError, ApiNetworkError, apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";

/**
 * Public, non-enumerating account-deletion flow.
 *
 * Matches the backend contract at POST /api/account-deletion/request-link
 * and POST /api/account-deletion/confirm-link (MythStrideApi
 * AccountDeletionPublicController). The confirmation token travels only in
 * the URL fragment (never sent to a server on navigation) and this module
 * never logs or persists it.
 */

export type AccountDeletionRequestOutcome =
  | "requested"
  | "rateLimited"
  | "unavailable";

export async function requestAccountDeletionLink(
  email: string,
): Promise<AccountDeletionRequestOutcome> {
  try {
    await apiFetch<unknown>(API_ENDPOINTS.accountDeletion.requestLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return "requested";
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return "rateLimited";
    }

    if (
      error instanceof ApiError ||
      error instanceof ApiConfigurationError ||
      error instanceof ApiNetworkError
    ) {
      return "unavailable";
    }

    throw error;
  }
}

export type AccountDeletionConfirmOutcome =
  | { outcome: "confirmed"; status: string }
  | { outcome: "invalid" }
  | { outcome: "rateLimited" }
  | { outcome: "unavailable" };

interface ConfirmAccountDeletionResponseBody {
  status?: unknown;
}

function readStatus(body: unknown): string {
  const candidate = (body as ConfirmAccountDeletionResponseBody | null)?.status;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : "Unknown";
}

export async function confirmAccountDeletionToken(
  token: string,
): Promise<AccountDeletionConfirmOutcome> {
  try {
    const response = await apiFetch<ConfirmAccountDeletionResponseBody>(
      API_ENDPOINTS.accountDeletion.confirmLink,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      },
    );

    return { outcome: "confirmed", status: readStatus(response) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return { outcome: "rateLimited" };
    }

    if (error instanceof ApiError && error.status === 400) {
      return { outcome: "invalid" };
    }

    if (
      error instanceof ApiError ||
      error instanceof ApiConfigurationError ||
      error instanceof ApiNetworkError
    ) {
      return { outcome: "unavailable" };
    }

    throw error;
  }
}

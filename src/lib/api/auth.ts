import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { AuthLoginRequest, AuthLoginResponse } from "./types";

export const AUTH_TOKEN_STORAGE_KEY = "mythstride.accessToken";

export const AUTH_ENDPOINTS = {
  login: API_ENDPOINTS.auth.login,
  playerProfile: API_ENDPOINTS.player.profile,
  currentBoss: API_ENDPOINTS.player.currentBoss,
  trophies: API_ENDPOINTS.player.trophies,
  history: API_ENDPOINTS.player.history,
} as const;

export function readStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function writeStoredAccessToken(accessToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
}

export function getAccessTokenRoles(accessToken: string | null | undefined) {
  if (!accessToken) return [] as string[];

  try {
    const payloadPart = accessToken.split(".")[1];
    if (!payloadPart) return [];
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(normalized)) as Record<string, unknown>;
    const roleValue =
      payload.role ??
      payload.roles ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (Array.isArray(roleValue)) {
      return roleValue.map(String);
    }
    return roleValue ? [String(roleValue)] : [];
  } catch {
    return [];
  }
}

export function isAdminAccessToken(accessToken: string | null | undefined) {
  return getAccessTokenRoles(accessToken).some(
    (role) => role.toLowerCase() === "admin",
  );
}

interface AuthLoginApiResponse {
  token: string;
  usuarioId: number;
  email: string;
  jogadorId: number | null;
  requiresPlayerCreation: boolean;
}

function normalizeLoginResponse(response: AuthLoginApiResponse): AuthLoginResponse {
  if (!response.token) {
    throw new Error("Login response did not include an access token.");
  }

  return {
    token: response.token,
    usuarioId: response.usuarioId,
    email: response.email,
    jogadorId: response.jogadorId,
    requiresPlayerCreation: response.requiresPlayerCreation,
  };
}

export async function loginWithEmail(credentials: AuthLoginRequest) {
  const response = await apiFetch<AuthLoginApiResponse>(AUTH_ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return normalizeLoginResponse(response);
}

export type { AuthLoginRequest, AuthLoginResponse };

// TODO: Revisit localStorage token storage if the backend later supports httpOnly website sessions.
